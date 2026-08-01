import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { applyAsHost } from "../api/host";
import "./ApplyHostPage.css";

export default function ApplyHostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Photo upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form fields state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [termsCheck, setTermsCheck] = useState(false);
  const [safetyCheck, setSafetyCheck] = useState(false);
  const [infoCheck, setInfoCheck] = useState(false);

  // Validation state
  const [validated, setValidated] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  const applyMutation = useMutation({
    mutationFn: (formData: FormData) => applyAsHost(formData),
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate auth so role updates (user → host) are reflected everywhere
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/listings");
    },
    onError: (err) => {
      // Log full error so we can diagnose in devtools
      console.error("[ApplyHostPage] submit error:", err);
      if (err instanceof AxiosError) {
        console.error("[ApplyHostPage] response:", err.response?.status, err.response?.data);
      }
      toast.error(
        err instanceof AxiosError && err.response?.data?.message
          ? err.response.data.message
          : "Something went wrong. Please try again."
      );
    },
  });

  // ---------- photo handling ----------
  function handleFileSelect(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setAvatarFile(file);
    setPhotoError(false);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage(e: React.MouseEvent) {
    e.stopPropagation();
    setAvatarFile(null);
    setPreviewUrl(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files[0]);
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  }

  // ---------- phone / aadhaar digit-only sanitization ----------
  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(e.target.value.replace(/\D/g, "").substring(0, 10));
  }

  function handleAadhaarChange(e: ChangeEvent<HTMLInputElement>) {
    setAadhaar(e.target.value.replace(/\D/g, "").substring(0, 12));
  }

  // ---------- submit ----------
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidated(true);

    // Photo is required
    if (!avatarFile) {
      setPhotoError(true);
      toast.error("Please upload your profile photo.");
      return;
    }

    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("aadhaar", aadhaar);

    applyMutation.mutate(formData);
  }

  return (
    <div className="container row mt-3">
      <div className="col-10 offset-1 col-lg-8 offset-lg-2">
        <h3 className="mb-4">
          <i className="bi bi-person-badge me-2 text-primary" />
          Apply to Become a Host
        </h3>

        <form
          noValidate
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
        >
          {/* ── Photo Upload Section ── */}
          <div className="form-container">
            <h5 className="apply-section-title">
              <i className="bi bi-camera me-2" />
              Profile Photo
            </h5>

            <div
              className={`photo-upload-frame${isDragOver ? " dragover" : ""}`}
              onClick={() => avatarInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />

              {previewUrl ? (
                /* Preview */
                <div className="preview-container">
                  <img src={previewUrl} className="preview-image" alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={handleRemoveImage}
                  >
                    <i className="bi bi-x" />
                  </button>
                </div>
              ) : (
                /* Upload prompt */
                <div className="upload-content">
                  <div className="upload-icon">
                    <i className="bi bi-cloud-upload" />
                  </div>
                  <div className="upload-text">Upload Your Photo</div>
                  <div className="upload-subtext">
                    Click here or drag and drop your image
                  </div>
                  <div className="file-size-limit">
                    <i className="bi bi-info-circle me-1" />
                    Max file size: 5MB | Formats: JPG, PNG, JPEG
                  </div>
                </div>
              )}
            </div>

            {photoError && (
              <div className="text-danger mt-1" style={{ fontSize: "0.875em" }}>
                Please upload your profile photo.
              </div>
            )}
          </div>

          {/* ── Personal Information Section ── */}
          <div className="form-container">
            <h5 className="apply-section-title">
              <i className="bi bi-person me-2" />
              Personal Information
            </h5>

            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                required
                minLength={2}
                maxLength={50}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">
                Please provide a valid full name (2-50 characters).
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  placeholder="Enter 10-digit phone number"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                />
                <div className="valid-feedback">Valid phone number!</div>
                <div className="invalid-feedback">
                  Please provide a valid 10-digit phone number.
                </div>
              </div>

              <div className="mb-3 col-md-6">
                <label htmlFor="aadhaar" className="form-label">
                  Aadhaar Number <span className="text-danger">*</span>
                </label>
                <input
                  id="aadhaar"
                  name="aadhaar"
                  type="text"
                  className="form-control"
                  placeholder="Enter 12-digit Aadhaar number"
                  required
                  pattern="[0-9]{12}"
                  maxLength={12}
                  value={aadhaar}
                  onChange={handleAadhaarChange}
                />
                <div className="valid-feedback">Valid Aadhaar number!</div>
                <div className="invalid-feedback">
                  Please provide a valid 12-digit Aadhaar number.
                </div>
              </div>
            </div>

            <div className="alert alert-info">
              <i className="bi bi-shield-check me-2" />
              <strong>Privacy Note:</strong> Your personal information is securely
              stored and used only for verification purposes.
            </div>
          </div>

          {/* ── Terms & Submit Section ── */}
          <div className="form-container">
            {/* Terms of Service */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="termsCheck"
                required
                checked={termsCheck}
                onChange={(e) => setTermsCheck(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="termsCheck">
                I agree to the{" "}
                <a href="/info/terms" target="_blank" className="text-primary">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/info/privacy" target="_blank" className="text-primary">
                  Privacy Policy
                </a>{" "}
                <span className="text-danger">*</span>
              </label>
              <div className="invalid-feedback">
                You must agree to the terms before submitting.
              </div>
            </div>

            {/* Safety Guidelines */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="safetyCheck"
                required
                checked={safetyCheck}
                onChange={(e) => setSafetyCheck(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="safetyCheck">
                I have read and understand the{" "}
                <a href="/info/safety" target="_blank" className="text-primary">
                  Safety Guidelines
                </a>{" "}
                and{" "}
                <a href="/info/community" target="_blank" className="text-primary">
                  Community Standards
                </a>{" "}
                <span className="text-danger">*</span>
              </label>
              <div className="invalid-feedback">
                Please acknowledge our safety and community guidelines.
              </div>
            </div>

            {/* Accuracy Confirmation */}
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="infoCheck"
                required
                checked={infoCheck}
                onChange={(e) => setInfoCheck(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="infoCheck">
                I confirm that all the information provided is accurate and true{" "}
                <span className="text-danger">*</span>
              </label>
              <div className="invalid-feedback">
                Please confirm the accuracy of your information.
              </div>
            </div>

            {/* Help Resources */}
            <div className="alert alert-info mb-4">
              <h6 className="alert-heading">
                <i className="bi bi-lightbulb me-2" />
                Need Help?
              </h6>
              <p className="mb-2">Check out these resources before submitting:</p>
              <div className="d-flex flex-wrap gap-2">
                <a
                  href="/info/host-guide"
                  target="_blank"
                  className="btn btn-sm help-link-btn"
                >
                  <i className="bi bi-book me-1" />
                  Host Guide
                </a>
                <a
                  href="/info/help-center"
                  target="_blank"
                  className="btn btn-sm help-link-btn"
                >
                  <i className="bi bi-question-circle me-1" />
                  Help Center
                </a>
                <a
                  href="/info/faq"
                  target="_blank"
                  className="btn btn-sm help-link-btn"
                >
                  <i className="bi bi-chat-square-text me-1" />
                  FAQ
                </a>
                <a
                  href="/info/contact"
                  target="_blank"
                  className="btn btn-sm help-link-btn"
                >
                  <i className="bi bi-telephone me-1" />
                  Contact Support
                </a>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-color btn-lg px-4"
                type="submit"
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2" />
                    Submit Application
                  </>
                )}
              </button>
              <Link to="/listings" className="text-muted go-back">
                <i className="bi bi-caret-left-fill" />
                Go Back
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

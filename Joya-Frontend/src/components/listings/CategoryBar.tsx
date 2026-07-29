import { categories } from "../../constants/categories";
import "./CategoryBar.css";

export default function CategoryBar() {
  return (
    <div className="d-flex mb-3 align-items-center justify-content-center">
      <div className="category-scroll d-flex overflow-auto mt-1 px-3 py-2 gap-4">
        {categories.map((category) => (
          <button
            className="btn d-flex flex-column align-items-center category-btn underline-slide border-0 px-2"
            data-category={category.name}
          >
            <i className={`fa-solid ${category.icon} fs-8 mb-1 text-black`} />
            <span className="small">{category.name}</span>
          </button>
        ))}
      </div>
      <div className="form-check form-switch form-check-reverse d-none d-lg-flex align-items-center justify-content-center ms-2 gap-2 taxSwitch">
        <label className="form-check-label" htmlFor="taxToggle">
          Include Tax
        </label>
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="taxToggle"
        />
      </div>
    </div>
  );
}

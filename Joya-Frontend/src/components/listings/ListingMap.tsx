import { useEffect, useRef } from "react";
import "./ListingMap.css";

type ListingMapProps = {
  coordinates?: [number, number]; // [longitude, latitude]
  title: string;
  location: string;
  country: string;
};

interface MapboxInstance {
  addControl: (control: unknown, position?: string) => void;
  remove: () => void;
}

interface MapboxGLGlobal {
  accessToken: string;
  Map: new (options: {
    container: HTMLElement;
    style: string;
    projection?: string;
    zoom: number;
    center: [number, number];
  }) => MapboxInstance;
  NavigationControl: new () => unknown;
  Marker: new (element: HTMLElement) => {
    setLngLat: (coords: [number, number]) => {
      setPopup: (popup: unknown) => {
        addTo: (map: MapboxInstance) => void;
      };
    };
  };
  Popup: new (options?: { offset?: number }) => {
    setHTML: (html: string) => unknown;
  };
}

declare global {
  interface Window {
    mapboxgl?: MapboxGLGlobal;
  }
}

export default function ListingMap({
  coordinates,
  title,
  location,
  country,
}: ListingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const token = import.meta.env.VITE_MAPBOX_TOKEN || "";

  useEffect(() => {
    if (!coordinates || coordinates.length < 2 || !mapContainerRef.current) {
      return;
    }

    // Ensure mapbox-gl CSS is present
    if (!document.getElementById("mapbox-gl-css")) {
      const link = document.createElement("link");
      link.id = "mapbox-gl-css";
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css";
      document.head.appendChild(link);
    }

    let mapInstance: MapboxInstance | null = null;

    const initMap = () => {
      if (!window.mapboxgl || !mapContainerRef.current) return;

      try {
        window.mapboxgl.accessToken = token;

        mapInstance = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/standard",
          projection: "globe",
          zoom: 12,
          center: coordinates,
        });

        // Add navigation controls
        mapInstance.addControl(
          new window.mapboxgl.NavigationControl(),
          "top-right"
        );

        // Custom marker element
        const markerEl = document.createElement("div");
        markerEl.className = "marker-wrap";
        markerEl.innerHTML = `
          <div class="pulse-ring"></div>
          <div class="custom-marker">
            <i class="bi bi-house-door-fill"></i>
          </div>
        `;

        new window.mapboxgl.Marker(markerEl)
          .setLngLat(coordinates)
          .setPopup(
            new window.mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h4>${title}</h4><p>Exact Location will be provided after booking</p>`
            )
          )
          .addTo(mapInstance);
      } catch (err) {
        console.warn("Mapbox initialization error:", err);
      }
    };

    if (window.mapboxgl) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js";
      script.onload = initMap;
      document.body.appendChild(script);
    }

    return () => {
      if (mapInstance && typeof mapInstance.remove === "function") {
        mapInstance.remove();
      }
    };
  }, [coordinates, title, token]);

  if (!coordinates || coordinates.length < 2) {
    return (
      <div className="alert alert-secondary text-center py-4">
        <i className="bi bi-geo-alt fs-3 d-block mb-2 text-muted" />
        <strong>Location:</strong> {location}, {country}
      </div>
    );
  }

  return (
    <div
      id="map"
      ref={mapContainerRef}
      style={{ width: "100%", height: "400px", borderRadius: "15px" }}
    />
  );
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * Root bootstrap: Manrope (sans) + DM Serif Text (display) are loaded in index.html.
 * Framer Motion and Recharts are used directly in components — no global providers required.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

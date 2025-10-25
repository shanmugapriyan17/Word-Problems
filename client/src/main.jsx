import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // <- this must exist at client/src/index.css

createRoot(document.getElementById("root")).render(<App />);

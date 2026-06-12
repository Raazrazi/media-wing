import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { RequestProvider } from "./context/RequestContext";
import "./index.css";
import "./styles/designTokens.css";

import Lenis from "lenis";

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.8,
  smoothWheel: true,
  syncTouch: true,
  touchMultiplier: 1.5,
  wheelMultiplier: 0.8,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RequestProvider>
          <App />
        </RequestProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { RequestProvider } from "./context/RequestContext";
import "./index.css";
import "./styles/designTokens.css";

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
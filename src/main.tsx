import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./components/theme/theme-provider";
import AuthSystem from "./auth/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleSuccess from "./auth/google";

function RootApp() {
  const token = localStorage.getItem("authToken");
  console.log(token);
  return token ? <App /> : <AuthSystem />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/auth/success" element={<GoogleSuccess />} />
          <Route path="/*" element={<RootApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

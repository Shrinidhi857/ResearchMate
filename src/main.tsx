import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App";
import { ThemeProvider } from "./components/theme/theme-provider";
import AuthSystem from "./auth/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleSuccess from "./auth/google";
import ChatPage from "./pages/ChatPage";
import axios from "axios";
import ResearchMateDashboard from "./pages/Dashboard";
import "@dotlottie/player-component";
import AnalysisPage from "./pages/AnalysisPage";
import ProjectPage from "./pages/ProjectPage";

function RootApp() {
  const token = localStorage.getItem("authToken");
  return token ? <App /> : <AuthSystem />;
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* ✅ Wrap everything once here */}
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<ResearchMateDashboard />} />
          <Route path="/auth/success" element={<GoogleSuccess />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/*" element={<RootApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

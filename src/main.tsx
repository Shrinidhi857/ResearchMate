import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./components/theme/theme-provider";
import AuthSystem from "./auth/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleSuccess from "./auth/google";
import ChatPage from "./CharPage";
import axios from "axios";
import ResearchMateDashboard from "./Dashboard";

function RootApp() {
  const token = localStorage.getItem("authToken");
  console.log(token);
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<ResearchMateDashboard />} />
          <Route path="/auth/success" element={<GoogleSuccess />} />
          <Route path="/*" element={<RootApp />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

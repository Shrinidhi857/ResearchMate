import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme/theme-provider";
import AuthSystem from "./auth/auth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen">
        <App />
        {/* <AuthSystem /> */}
      </div>
    </ThemeProvider>
  </StrictMode>
);

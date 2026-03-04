import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionConfig } from "framer-motion";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </ThemeProvider>
);

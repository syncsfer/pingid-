import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DecentraChat from "./DecentraChat";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DecentraChat />
  </StrictMode>
);

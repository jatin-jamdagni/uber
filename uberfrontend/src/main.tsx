import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router";
import { CaptainContext } from "./context/CaptainContext.js";
import { UserContext } from "./context/UserContext.js";
import { SocketProvider } from "./context/SocketContext.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CaptainContext>
      <UserContext>
        <SocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SocketProvider>
      </UserContext>
    </CaptainContext>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { ClerkProvider, UserProfile } from "@clerk/react-router";
import "./index.css";
import App from "./App.tsx";
import { shadcn } from "@clerk/themes";
// import UnderDevelopment from "./pages/UnderDevelopmet.tsx";
import Home from "./pages/Home.tsx";
import Create from "./pages/Create.tsx";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
    throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ClerkProvider
                publishableKey={PUBLISHABLE_KEY}
                appearance={{ baseTheme: shadcn }}
            >
                <App>
                    <Routes>
                        {/* <Route path="/*" element={<UnderDevelopment />} /> */}
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/create" element={<Create   />} />
                    </Routes>
                </App>
            </ClerkProvider>
        </BrowserRouter>
    </StrictMode>
);

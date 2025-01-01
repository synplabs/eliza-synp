import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "https://synp.tech/images/logo.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </PrivyProvider>
    </StrictMode>
);

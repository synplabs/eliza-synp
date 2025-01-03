import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { AgentCreationProvider } from "./contexts/AgentCreationContext";
import { FetchProvider } from "./contexts/FetchContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <FetchProvider apiKey={import.meta.env.VITE_API_KEY}>
                <AgentCreationProvider>
                    <RouterProvider router={router} />
                </AgentCreationProvider>
            </FetchProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

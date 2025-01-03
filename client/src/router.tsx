// In your router configuration file (e.g., App.jsx or router.jsx)
import { createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Agents from "./routes/agents";
import Litepaper from "./routes/litepaper";
import Create from "./routes/create";
import Chat from "./routes/chat";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/create",
        element: <Create />,
    },
    {
        path: "/agents",
        element: <Agents />,
    },
    {
        path: "/agents/:agentId",
        element: <Chat />,
    },
    {
        path: "/litepaper",
        element: <Litepaper />,
    },
]);

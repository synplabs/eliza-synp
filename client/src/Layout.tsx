import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "./components/header/header";

export default function Layout() {
    return (
        <SidebarProvider>
            <Header />
            <Outlet />
        </SidebarProvider>
    );
}

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ConnectWallet() {
    const { login, authenticated, user, logout } = usePrivy();

    const walletAddress = `${user?.wallet?.address.slice(
        0,
        6
    )}...${user?.wallet?.address.slice(-4)}`;

    return authenticated ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <WalletIcon className="w-4 h-4" />
                    {walletAddress}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="w-full">
                    <Button onClick={() => logout()}>Disconnect</Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Button onClick={() => login()}>
            <WalletIcon className="w-4 h-4" />
            Connect Wallet
        </Button>
    );
}

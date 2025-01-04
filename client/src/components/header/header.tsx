import ConnectWallet from "../connect-wallet/connect-wallet";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import telegram from "@/assets/icons/telegram.svg";
import x from "@/assets/icons/x.svg";
import logo from "@/assets/images/logo.png";
export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="py-4">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="hover:opacity-80 transition-all">
                        <img
                            src={logo}
                            alt="Synp"
                            className="w-[100px] drop-shadow-[0_0_12px_rgba(0,210,190,0.3)] hover:brightness-[2] hover:drop-shadow-[0_0_30px_rgba(255,255,255,1)] transition-all duration-300"
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/create"
                            className={`text-sm font-bold transition-all hover:text-secondary hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)] ${isActive("/create") ? "text-secondary drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]" : "text-white"}`}
                        >
                            CREATE
                        </Link>
                        <Link
                            to="/agents"
                            className={`text-sm font-bold transition-all hover:text-secondary hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)] ${isActive("/agents") ? "text-secondary drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]" : "text-white"}`}
                        >
                            AGENTS
                        </Link>
                        <Link
                            to="/litepaper"
                            className={`text-sm font-bold transition-all hover:text-secondary hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)] ${isActive("/litepaper") ? "text-secondary drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]" : "text-white"}`}
                        >
                            LITEPAPER
                        </Link>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <a
                        href="https://x.com/synp_ai"
                        target="_blank"
                        className="group"
                    >
                        <div className="p-2 rounded-full transition-all group-hover:bg-[#00D2BE]/10 group-hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]">
                            <img
                                src={x}
                                alt="X"
                                className="w-4 h-4 transition-all group-hover:brightness-200"
                            />
                        </div>
                    </a>
                    <a
                        href="https://t.me/+4xJS6LguaLJhZDZk"
                        target="_blank"
                        className="group"
                    >
                        <div className="p-2 rounded-full transition-all group-hover:bg-[#00D2BE]/10 group-hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]">
                            <img
                                src={telegram}
                                alt="Telegram"
                                className="w-4 h-4 transition-all group-hover:brightness-200"
                            />
                        </div>
                    </a>
                    <ConnectWallet />
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isMenuOpen ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden px-4 py-2 space-y-4">
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/create"
                            className="text-sm text-white/50 font-bold transition-all pointer-events-none cursor-not-allowed"
                        >
                            CREATE (SOON)
                        </Link>
                        <Link
                            to="/agents"
                            className={`text-sm font-bold transition-all hover:text-secondary hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)] ${isActive("/agents") ? "text-secondary drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]" : "text-white"}`}
                        >
                            AGENTS
                        </Link>
                        <Link
                            to="/litepaper"
                            className={`text-sm font-bold transition-all hover:text-secondary hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)] ${isActive("/litepaper") ? "text-secondary drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]" : "text-white"}`}
                        >
                            LITEPAPER
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <a
                            href="https://x.com/synp_ai"
                            target="_blank"
                            className="group"
                        >
                            <div className="p-2 rounded-full transition-all group-hover:bg-[#00D2BE]/10 group-hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]">
                                <img
                                    src={x}
                                    alt="X"
                                    className="w-4 h-4 transition-all group-hover:brightness-200"
                                />
                            </div>
                        </a>
                        <a
                            href="https://t.me/+4xJS6LguaLJhZDZk"
                            target="_blank"
                            className="group"
                        >
                            <div className="p-2 rounded-full transition-all group-hover:bg-[#00D2BE]/10 group-hover:drop-shadow-[0_0_12px_rgba(0,210,190,0.5)]">
                                <img
                                    src={telegram}
                                    alt="Telegram"
                                    className="w-4 h-4 transition-all group-hover:brightness-200"
                                />
                            </div>
                        </a>
                        <ConnectWallet />
                    </div>
                </div>
            )}
        </header>
    );
}

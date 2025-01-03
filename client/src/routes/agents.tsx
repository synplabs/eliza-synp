import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Character } from "@elizaos/core";
import { Header } from "@/components/header/header";
import { useFetch } from "@/contexts/FetchContext";

export default function Agents() {
    const navigate = useNavigate();
    const fetch = useFetch();

    const { data: agents, isLoading } = useQuery({
        queryKey: ["agents"],
        queryFn: async () => {
            const data = await fetch("/api/agents");
            console.log("Agents data:", data);
            return data.agents as Character[];
        },
    });

    return (
        <div className="flex flex-col w-full h-screen overflow-hidden pb-[env(safe-area-inset-bottom)]">
            <div className="relative z-50">
                <Header />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="container mx-auto max-w-5xl">
                    <h1 className="text-4xl font-bold text-center mb-16">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-secondary drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                            Select your agent
                        </span>
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-[50vh]">
                            <div className="relative w-12 h-12">
                                <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                                <div className="absolute inset-0 rounded-full border-t-2 border-[#00D2BE] animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {agents?.map((agent: Character) => (
                                <div
                                    key={agent.id}
                                    onClick={() =>
                                        navigate(`/agents/${agent.id}`)
                                    }
                                    className="group cursor-pointer bg-gradient-to-b from-white/[0.04] to-white/[0.02] hover:from-white/[0.08] hover:to-white/[0.04] rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] border border-white/20 hover:border-[#00D2BE] backdrop-blur-sm shadow-lg hover:shadow-xl shadow-black/20 flex flex-col gap-4"
                                >
                                    <div className="aspect-square overflow-hidden rounded-lg bg-black/50 ring-1 ring-white/20 group-hover:ring-[#00D2BE]/50 relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <img
                                            src={
                                                agent.avatarUrl ||
                                                "/default-agent.png"
                                            }
                                            alt={agent.name}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col min-h-[120px]">
                                        <h2 className="text-xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white group-hover:from-[#00D2BE] group-hover:to-secondary transition-all duration-300">
                                            {agent.name}
                                        </h2>
                                        <p className="text-sm text-center text-white/60 group-hover:text-white/80 mt-3 line-clamp-3 flex-1 transition-colors duration-300">
                                            {agent.bio[0] ||
                                                "No description available"}
                                        </p>
                                        <div className="flex items-center justify-center mt-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-sm px-4 py-1.5 rounded-full bg-[#00D2BE]/10 text-[#00D2BE] border border-[#00D2BE]/20 group-hover:bg-[#00D2BE]/20 transition-colors duration-300">
                                                Start chatting
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

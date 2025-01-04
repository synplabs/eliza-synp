import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header/header";
import { Character } from "@elizaos/core";
import "../App.css";
import { useFetch } from "@/contexts/FetchContext";

const extractMentions = (text: string) => {
    const mentions = text.match(/@(\w+)/g);
    return mentions?.map((mention) => mention.slice(1)) || [];
};

const getContextForMentions = async (
    mentions: string[],
    messages: TextResponse[],
    allAgents?: Character[]
) => {
    if (!allAgents) return {};

    const context: Record<string, TextResponse[]> = {};

    for (const mention of mentions) {
        const mentionedAgent = allAgents.find(
            (a) => a.name.toLowerCase() === mention.toLowerCase()
        );
        if (mentionedAgent && mentionedAgent.id) {
            const relevantMessages = messages.slice(-10);
            context[mentionedAgent.id] = relevantMessages;
        }
    }

    return context;
};

const formatMessageText = (text: string, allAgents?: Character[]) => {
    if (!allAgents) return text;

    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
        if (part.startsWith("@")) {
            const agentName = part.slice(1);
            const mentionedAgent = allAgents.find(
                (a) => a.name.toLowerCase() === agentName.toLowerCase()
            );
            if (mentionedAgent) {
                return (
                    <span
                        key={index}
                        className="text-[#00D2BE] hover:underline cursor-pointer"
                        onClick={() =>
                            window.open(
                                `/agents/${mentionedAgent.id}/info`,
                                "_blank"
                            )
                        }
                    >
                        {part}
                    </span>
                );
            }
        }
        return part;
    });
};

type TextResponse = {
    text: string;
    user: string;
    timestamp?: Date;
    attachments?: { url: string; contentType: string; title: string }[];
};

export default function Chat() {
    const fetch = useFetch();
    const { agentId } = useParams();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<TextResponse[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showMentionMenu, setShowMentionMenu] = useState(false);
    const [mentionFilter, setMentionFilter] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: agent } = useQuery({
        queryKey: ["agent", agentId],
        queryFn: async () => {
            const data = await fetch(`/api/agents/${agentId}`);
            console.log("Agent data:", data);
            return data.character as Character;
        },
    });

    const { data: allAgents } = useQuery({
        queryKey: ["agents"],
        queryFn: async () => {
            const data = await fetch("/api/agents");
            return data.agents as Character[];
        },
    });

    const filteredAgents = useMemo(() => {
        if (!allAgents) return [];
        return allAgents
            .filter((a) => a.id !== agentId)
            .filter(
                (a) =>
                    a.name
                        .toLowerCase()
                        .includes(mentionFilter.toLowerCase()) ||
                    a.lore?.[0]
                        ?.toLowerCase()
                        .includes(mentionFilter.toLowerCase())
            )
            .slice(0, 5);
    }, [allAgents, mentionFilter, agentId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setShowScrollButton(scrollContainerRef.current.scrollTop > 500);
            }
        };

        scrollContainerRef.current?.addEventListener("scroll", handleScroll);
        return () => {
            scrollContainerRef.current?.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const mutation = useMutation({
        mutationFn: async (text: string) => {
            const formData = new FormData();
            formData.append("text", text);
            formData.append("userId", "user");
            formData.append("roomId", `default-room-${agentId}`);

            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            return await fetch(`/api/${agentId}/message`, {
                method: "POST",
                body: formData,
            });
        },
        onSuccess: (data: TextResponse[]) => {
            const botMessages = data.filter((msg) => msg.user !== "user");
            setMessages((prev) => [
                ...prev,
                ...botMessages.map((msg) => ({
                    ...msg,
                    timestamp: new Date(),
                })),
            ]);
            setSelectedFile(null);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !selectedFile) return;

        const mentions = extractMentions(input);
        const mentionContext = await getContextForMentions(
            mentions,
            messages,
            allAgents
        );

        const userMessage: TextResponse = {
            text: input,
            user: "user",
            timestamp: new Date(),
            attachments: selectedFile
                ? [
                      {
                          url: URL.createObjectURL(selectedFile),
                          contentType: selectedFile.type,
                          title: selectedFile.name,
                      },
                  ]
                : undefined,
        };
        setMessages((prev) => [...prev, userMessage]);

        const formData = new FormData();
        formData.append("text", input);
        formData.append("userId", "user");
        formData.append("roomId", `default-room-${agentId}`);

        if (Object.keys(mentionContext).length > 0) {
            formData.append("mentionContext", JSON.stringify(mentionContext));
        }

        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        mutation.mutate(input);
        setInput("");
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        const lastAtIndex = value.lastIndexOf("@");
        if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
            setShowMentionMenu(true);
            setMentionFilter("");
        } else if (lastAtIndex !== -1 && lastAtIndex < value.length - 1) {
            setShowMentionMenu(true);
            setMentionFilter(value.slice(lastAtIndex + 1));
        } else {
            setShowMentionMenu(false);
        }
    };

    const insertMention = (agent: Character) => {
        const lastAtIndex = input.lastIndexOf("@");
        const newInput = input.slice(0, lastAtIndex) + `@${agent.name} `;
        setInput(newInput);
        setShowMentionMenu(false);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col w-full h-screen overflow-hidden pb-[env(safe-area-inset-bottom)]">
            <div className="relative z-50">
                <Header />
            </div>

            <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/30 bg-black/50">
                                    <img
                                        src={
                                            agent?.avatarUrl ||
                                            "https://placehold.co/600x600"
                                        }
                                        alt={agent?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-black"></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00D2BE]">
                                        {agent?.name || "Loading..."}
                                    </h2>
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#00D2BE]/10 border border-[#00D2BE]/30 text-[#00D2BE]">
                                        Online
                                    </span>
                                </div>
                                <p className="text-sm text-white/60 mt-0.5 line-clamp-1">
                                    {agent?.lore?.[0] || "AI Agent"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-white/60">
                            {/* Removed message counter */}
                        </div>
                    </div>

                    {agent?.topics && agent.topics.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#00D2BE]" />
                            <div className="flex gap-2 flex-wrap">
                                {agent.topics
                                    .slice(0, 4)
                                    .map((topic: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60 border border-white/10"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                {agent.topics.length > 4 && (
                                    <button
                                        onClick={() =>
                                            window.open(
                                                `/agents/${agentId}/info`,
                                                "_blank"
                                            )
                                        }
                                        className="px-2 py-0.5 rounded-full text-xs bg-[#00D2BE]/10 text-[#00D2BE] border border-[#00D2BE]/30 hover:bg-[#00D2BE]/20 transition-colors"
                                    >
                                        +{agent.topics.length - 4} more
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#00D2BE]/30 hover:scrollbar-thumb-[#00D2BE]/50 scrollbar-track-transparent"
            >
                <div className="max-w-5xl mx-auto space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.length > 0 ? (
                            <>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`text-left flex ${
                                            message.user === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-6 py-3 shadow-lg backdrop-blur-sm ${
                                                message.user === "user"
                                                    ? "bg-[#00D2BE]/10 border border-[#00D2BE]/30 text-white ml-12"
                                                    : "bg-white/[0.03] border border-white/30 text-white mr-12"
                                            } transition-all duration-200 hover:shadow-xl`}
                                        >
                                            <div className="prose prose-invert max-w-none">
                                                {formatMessageText(
                                                    message.text,
                                                    allAgents
                                                )}
                                            </div>
                                            {message.attachments?.map(
                                                (attachment, i) =>
                                                    attachment.contentType.startsWith(
                                                        "image/"
                                                    ) && (
                                                        <motion.img
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            key={i}
                                                            src={
                                                                message.user ===
                                                                "user"
                                                                    ? attachment.url
                                                                    : attachment.url.startsWith(
                                                                            "http"
                                                                        )
                                                                      ? attachment.url
                                                                      : `http://localhost:3000/media/generated/${attachment.url.split("/").pop()}`
                                                            }
                                                            alt={
                                                                attachment.title ||
                                                                "Attached image"
                                                            }
                                                            className="mt-3 max-w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-white/10"
                                                        />
                                                    )
                                            )}
                                            {message.timestamp && (
                                                <div
                                                    className={`text-xs mt-2 ${
                                                        message.user === "user"
                                                            ? "text-[#00D2BE]/50"
                                                            : "text-white/50"
                                                    }`}
                                                >
                                                    {message.timestamp.toLocaleTimeString()}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {mutation.isPending && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="max-w-[80%] rounded-2xl px-6 py-3 shadow-lg backdrop-blur-sm bg-white/[0.03] border border-white/30 text-white mr-12">
                                            <div className="flex items-center gap-2">
                                                <div className="relative w-4 h-4">
                                                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                                                    <div className="absolute inset-0 rounded-full border-t border-[#00D2BE] animate-spin"></div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <span className="text-sm text-white/70">
                                                        Thinking
                                                    </span>
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{
                                                            opacity: [0, 1, 0],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                        }}
                                                        className="text-sm text-white/70"
                                                    >
                                                        ...
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        ) : (
                            <div className="text-center mt-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-8 rounded-2xl border border-[#00D2BE]/30 bg-[#00D2BE]/5 backdrop-blur-sm max-w-2xl mx-auto"
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#00D2BE]/30 bg-black/50">
                                        <img
                                            src={
                                                agent?.avatarUrl ||
                                                "https://placehold.co/600x600"
                                            }
                                            alt={agent?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00D2BE]">
                                        Welcome to your chat with{" "}
                                        {agent?.name || "your agent"}
                                    </h3>
                                    <p className="text-white/60 mb-6 max-w-lg mx-auto">
                                        {agent?.lore?.[0] ||
                                            "Start a conversation and explore what this AI agent can do for you."}
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center items-center text-sm">
                                        {agent?.topics
                                            ?.slice(0, 3)
                                            .map((topic, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 rounded-full bg-white/5 text-[#00D2BE] border border-[#00D2BE]/30"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                    </div>
                                    <div className="mt-8 flex justify-center">
                                        <div className="animate-bounce text-[#00D2BE]/70 flex items-center gap-2">
                                            <span>Type a message to start</span>
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {showScrollButton && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-8 p-2 rounded-full bg-[#00D2BE] text-black shadow-lg hover:bg-[#00D2BE]/90 transition-colors"
                >
                    <ArrowUpCircle className="w-6 h-6" />
                </motion.button>
            )}

            <div className="border-t border-white/10 p-6 bg-black/20 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="flex gap-3 relative"
                    >
                        <div className="flex-1 relative">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type a message... (Use @ to mention other agents)"
                                className="flex-1 h-12 text-base rounded-full px-6 bg-white/[0.03] border-white/30 text-white placeholder:text-white/50"
                                disabled={mutation.isPending}
                            />
                            {showMentionMenu && filteredAgents.length > 0 && (
                                <div className="absolute bottom-full mb-2 w-full bg-black/90 rounded-lg border border-white/10 shadow-xl backdrop-blur-sm overflow-hidden">
                                    {filteredAgents.map((agent) => (
                                        <button
                                            key={agent.id}
                                            onClick={() => insertMention(agent)}
                                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                                <img
                                                    src={
                                                        agent.avatarUrl ||
                                                        "/default-agent.png"
                                                    }
                                                    alt={agent.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-white">
                                                    {agent.name}
                                                </div>
                                                <div className="text-xs text-white/50 line-clamp-1">
                                                    {agent.lore?.[0]}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="h-12 px-6 rounded-full bg-[#00D2BE] hover:bg-[#00D2BE]/90 text-black font-medium border-0"
                        >
                            {mutation.isPending ? "..." : "Send"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

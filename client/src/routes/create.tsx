import { useState } from "react";
import { Header } from "@/components/header/header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentCreation } from "@/contexts/AgentCreationContext";
import { ResetModal } from "@/components/ResetModal";
import { GeneratingAnimation } from "@/components/GeneratingAnimation";
import { BasicInfoForm } from "@/components/create/BasicInfoForm";
import { PersonalityForm } from "@/components/create/PersonalityForm";
import { MessagesForm } from "@/components/create/MessagesForm";
import { StyleForm } from "@/components/create/StyleForm";
import { FormTabs } from "@/components/create/FormTabs";
import { FormNavigation } from "@/components/create/FormNavigation";
import {
    Character,
    ArrayFields,
    FormTab,
    defaultCharacter,
} from "@/types/character";
import {
    validateSection,
    getValidationMessage,
    tabs,
} from "@/constants/create";
import { IntegrationsForm } from "@/components/create/IntegrationsForm";
import { useFetch } from "@/contexts/FetchContext";

export default function Create() {
    const queryClient = useQueryClient();
    const fetch = useFetch();
    const navigate = useNavigate();
    const {
        prompt,
        setPrompt,
        formData,
        setFormData,
        activeTab,
        setActiveTab,
        currentFormTab,
        setCurrentFormTab,
        clearState,
    } = useAgentCreation();

    const [validationError, setValidationError] = useState<string>("");
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const generateMutation = useMutation({
        mutationFn: async (prompt: string) => {
            const data = await fetch("/api/generate-character", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                }),
            });

            // Transform the modelProvider to match expected format
            return {
                ...data,
                modelProvider: Array.isArray(data.modelProvider)
                    ? data.modelProvider.map((p: string) => p.toLowerCase())
                    : [data.modelProvider.toLowerCase()],
            };
        },
        onSuccess: (data) => {
            setFormData(data);
            setActiveTab("advanced");
        },
        onError: (error) => {
            console.error("Generation error:", error);
        },
    });

    const createMutation = useMutation({
        mutationFn: async (character: Character) => {
            // Transform the character to match API expectations
            const apiCharacter = {
                ...character,
                modelProvider: character.modelProvider[0], // Take the first provider from the array
            };

            const data = await fetch(`/api/agents/${character.username}/set`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiCharacter),
            });
            return data;
        },
        onSuccess: (data) => {
            clearState();
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            navigate(`/agents/${data.id}`);
        },
        onError: (error) => {
            console.error("Creation error:", error);
        },
    });

    const handleFieldChange = <K extends keyof Character>(
        field: K,
        value: Character[K]
    ) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleArrayFieldChange = (
        field: ArrayFields,
        index: number,
        value: string
    ) => {
        const array = [...(formData[field] as string[])];
        array[index] = value;
        setFormData({ ...formData, [field]: array });
    };

    const handleMessageExampleChange = (
        exampleIndex: number,
        messageIndex: number,
        field: "user" | "content",
        value: string
    ) => {
        const examples = [...formData.messageExamples];
        const messages = [...examples[exampleIndex]];
        const message = { ...messages[messageIndex] };

        if (field === "user") {
            message.user = value;
        } else {
            message.content = { text: value };
        }

        messages[messageIndex] = message;
        examples[exampleIndex] = messages;
        setFormData({ ...formData, messageExamples: examples });
    };

    const handleSubmit = async () => {
        // Validate all sections before submitting
        const allSectionsValid = tabs.every((tab) =>
            validateSection(tab.id, formData)
        );
        if (!allSectionsValid) {
            console.log("Not all sections are valid, preventing submission");
            setValidationError(
                "Please complete all sections before submitting"
            );
            return;
        }

        if (!formData.username) {
            console.log("Username required, preventing submission");
            throw new Error("Username is required");
        }

        console.log("All checks passed, submitting form");
        createMutation.mutate(formData);
    };

    const handleNextSection = () => {
        // Only validate current section for navigation
        if (validateSection(currentFormTab, formData)) {
            setValidationError("");
            const currentIndex = tabs.findIndex((t) => t.id === currentFormTab);
            if (currentIndex < tabs.length - 1) {
                setCurrentFormTab(tabs[currentIndex + 1].id);
            }
        } else {
            setValidationError(getValidationMessage(currentFormTab));
        }
    };

    const handlePreviousSection = () => {
        const currentIndex = tabs.findIndex((t) => t.id === currentFormTab);
        if (currentIndex > 0) {
            setValidationError("");
            setCurrentFormTab(tabs[currentIndex - 1].id);
        }
    };

    const renderFormContent = () => {
        switch (currentFormTab) {
            case "basic":
                return (
                    <BasicInfoForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                    />
                );
            case "personality":
                return (
                    <PersonalityForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        onArrayFieldChange={handleArrayFieldChange}
                    />
                );
            case "messages":
                return (
                    <MessagesForm
                        formData={formData}
                        onMessageExampleChange={handleMessageExampleChange}
                        onFieldChange={handleFieldChange}
                    />
                );
            case "style":
                return (
                    <StyleForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        onArrayFieldChange={handleArrayFieldChange}
                    />
                );
            case "integrations":
                return (
                    <IntegrationsForm
                        formData={formData}
                        onFieldChange={handleFieldChange}
                        onSubmit={handleSubmit}
                        isSubmitting={createMutation.isPending}
                    />
                );
        }
    };

    const renderQuickCreate = () => (
        <motion.div
            key="quick"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/[0.03] p-6 rounded-xl border border-white/20 backdrop-blur-sm"
        >
            <h2 className="text-xl font-semibold mb-4 text-white/90">
                Quick Create
            </h2>
            <div className="space-y-4">
                <div className="group">
                    <label className="block text-sm font-medium mb-2 text-white/70">
                        Describe your agent
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Create an agent that acts like Elon Musk..."
                        className="w-full p-3 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] focus:ring-1 focus:ring-[#00D2BE] backdrop-blur-sm text-white outline-none transition-all duration-300 h-32"
                    />
                </div>
                <motion.button
                    type="button"
                    onClick={() => generateMutation.mutate(prompt)}
                    disabled={generateMutation.isPending || !prompt.trim()}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#00D2BE] to-secondary text-white rounded-lg hover:from-[#00D2BE]/80 hover:to-secondary/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {generateMutation.isPending ? (
                        <GeneratingAnimation />
                    ) : (
                        "Generate Configuration"
                    )}
                </motion.button>
                {generateMutation.isPending && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-white/50 text-center mt-4 flex flex-col gap-2"
                    >
                        <p>
                            Generation can take up to 30 seconds depending on
                            the complexity of your prompt
                        </p>
                        <p className="text-[#00D2BE]">
                            Creating a unique personality and detailed
                            backstory...
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );

    const renderAdvancedCreate = () => (
        <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="space-y-8">
                <FormTabs
                    currentTab={currentFormTab}
                    onTabChange={setCurrentFormTab}
                />
                <div className="bg-white/[0.03] p-6 rounded-xl border border-white/20">
                    <AnimatePresence mode="wait">
                        {renderFormContent()}
                    </AnimatePresence>
                    {validationError && (
                        <div className="mt-4 text-red-400 text-sm">
                            {validationError}
                        </div>
                    )}
                    {currentFormTab !== "integrations" && (
                        <FormNavigation
                            currentTab={currentFormTab}
                            isSubmitting={createMutation.isPending}
                            isValid={validateSection(currentFormTab, formData)}
                            onPrevious={handlePreviousSection}
                            onNext={handleNextSection}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-bold"
                        >
                            Create New Agent
                        </motion.h1>
                        <div className="flex items-center gap-4">
                            {(formData !== defaultCharacter ||
                                prompt.trim()) && (
                                <>
                                    <span className="text-sm text-white/60 bg-white/[0.05] px-3 py-1 rounded-full">
                                        Draft in progress
                                    </span>
                                    <motion.button
                                        onClick={() =>
                                            setIsResetModalOpen(true)
                                        }
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Reset
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        {activeTab === "quick"
                            ? renderQuickCreate()
                            : renderAdvancedCreate()}
                    </AnimatePresence>
                </div>
            </main>
            <ResetModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={clearState}
            />
        </div>
    );
}

import { motion } from "framer-motion";
import { Character } from "../../types/character";
import { useState } from "react";

type Props = {
    formData: Character;
    onFieldChange: <K extends keyof Character>(
        field: K,
        value: Character[K]
    ) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
};

export const IntegrationsForm = ({
    formData,
    onFieldChange,
    onSubmit,
    isSubmitting = false,
}: Props) => {
    const [showTelegramToken, setShowTelegramToken] = useState(false);
    const [showTwitterPassword, setShowTwitterPassword] = useState(false);

    const handleSecretChange = (key: string, value: string) => {
        onFieldChange("settings", {
            ...formData.settings,
            secrets: {
                ...formData.settings?.secrets,
                [key]: value,
            },
        });

        const newClients = new Set(formData.clients || []);

        if (key === "TELEGRAM_BOT_TOKEN") {
            if (value) {
                newClients.add("telegram");
            } else {
                newClients.delete("telegram");
            }
        }

        if (
            ["TWITTER_USERNAME", "TWITTER_EMAIL", "TWITTER_PASSWORD"].includes(
                key
            )
        ) {
            const hasAllTwitterSecrets = Boolean(
                (key === "TWITTER_USERNAME"
                    ? value
                    : formData.settings?.secrets?.TWITTER_USERNAME) &&
                    (key === "TWITTER_EMAIL"
                        ? value
                        : formData.settings?.secrets?.TWITTER_EMAIL) &&
                    (key === "TWITTER_PASSWORD"
                        ? value
                        : formData.settings?.secrets?.TWITTER_PASSWORD)
            );

            if (hasAllTwitterSecrets) {
                newClients.add("twitter");
            } else {
                newClients.delete("twitter");
            }
        }

        if (
            JSON.stringify([...newClients]) !== JSON.stringify(formData.clients)
        ) {
            onFieldChange("clients", [...newClients]);
        }
    };

    const secrets = formData.settings?.secrets || {};

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white/90">
                    Telegram Integration
                </h3>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                        Bot Token
                        <div className="text-xs text-white/50 mb-1">
                            Get this from @BotFather on Telegram
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <input
                            type={showTelegramToken ? "text" : "password"}
                            value={secrets.TELEGRAM_BOT_TOKEN || ""}
                            onChange={(e) =>
                                handleSecretChange(
                                    "TELEGRAM_BOT_TOKEN",
                                    e.target.value
                                )
                            }
                            className="flex-1 p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                            placeholder="Enter your bot token..."
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowTelegramToken(!showTelegramToken)
                            }
                            className="px-3 py-2 bg-white/[0.05] text-white/70 rounded-lg hover:bg-white/[0.1] transition-colors"
                        >
                            {showTelegramToken ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white/90">
                    Twitter Integration
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70">
                            Username
                        </label>
                        <input
                            type="text"
                            value={secrets.TWITTER_USERNAME || ""}
                            onChange={(e) =>
                                handleSecretChange(
                                    "TWITTER_USERNAME",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                            placeholder="@username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70">
                            Email
                        </label>
                        <input
                            type="email"
                            value={secrets.TWITTER_EMAIL || ""}
                            onChange={(e) =>
                                handleSecretChange(
                                    "TWITTER_EMAIL",
                                    e.target.value
                                )
                            }
                            className="w-full p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                            placeholder="email@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70">
                            Password
                        </label>
                        <div className="flex gap-2">
                            <input
                                type={showTwitterPassword ? "text" : "password"}
                                value={secrets.TWITTER_PASSWORD || ""}
                                onChange={(e) =>
                                    handleSecretChange(
                                        "TWITTER_PASSWORD",
                                        e.target.value
                                    )
                                }
                                className="flex-1 p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                                placeholder="Enter your password..."
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowTwitterPassword(!showTwitterPassword)
                                }
                                className="px-3 py-2 bg-white/[0.05] text-white/70 rounded-lg hover:bg-white/[0.1] transition-colors"
                            >
                                {showTwitterPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-sm text-white/50 italic">
                Note: These integrations are optional. Fill them only if you
                want to enable the respective platforms.
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-[#00D2BE] text-black font-medium rounded-lg
                        ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#00D2BE]/90"}
                        transition-colors duration-200`}
                >
                    {isSubmitting ? "Creating..." : "Create Agent"}
                </button>
            </div>
        </motion.div>
    );
};

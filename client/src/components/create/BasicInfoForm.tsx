import { motion } from "framer-motion";
import { Character } from "../../types/character";

type Props = {
    formData: Character;
    onFieldChange: <K extends keyof Character>(
        field: K,
        value: Character[K]
    ) => void;
};

export const BasicInfoForm = ({ formData, onFieldChange }: Props) => {
    return (
        <motion.div
            key="basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
        >
            <div className="space-y-4">
                <label className="block text-sm font-medium text-white/70">
                    Name
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onFieldChange("name", e.target.value)}
                        className="w-full p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                    />
                </label>
                <label className="block text-sm font-medium text-white/70">
                    Username
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                            onFieldChange("username", e.target.value)
                        }
                        className="w-full p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                    />
                </label>
                <label className="block text-sm font-medium text-white/70">
                    Avatar URL
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            value={formData.avatarUrl}
                            onChange={(e) =>
                                onFieldChange("avatarUrl", e.target.value)
                            }
                            className="flex-1 p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                        />
                        {formData.avatarUrl && (
                            <img
                                src={formData.avatarUrl}
                                alt="Avatar preview"
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) =>
                                    (e.currentTarget.src = "/default-agent.png")
                                }
                            />
                        )}
                    </div>
                </label>
            </div>
        </motion.div>
    );
};

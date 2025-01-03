import { motion } from "framer-motion";
import { Character, ArrayFields } from "../../types/character";

type Props = {
    formData: Character;
    onFieldChange: <K extends keyof Character>(
        field: K,
        value: Character[K]
    ) => void;
    onArrayFieldChange: (
        field: ArrayFields,
        index: number,
        value: string
    ) => void;
};

export const StyleForm = ({
    formData,
    onFieldChange,
    onArrayFieldChange,
}: Props) => {
    return (
        <motion.div
            key="style"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div>
                <label className="block text-sm font-medium mb-2 text-white/70">
                    Topics
                </label>
                <div className="space-y-2">
                    {formData.topics.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                    onArrayFieldChange(
                                        "topics",
                                        index,
                                        e.target.value
                                    )
                                }
                                className="flex-1 p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newTopics = [...formData.topics];
                                    newTopics.splice(index, 1);
                                    onFieldChange("topics", newTopics);
                                }}
                                className="p-2 text-white/50 hover:text-white/80 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            onFieldChange("topics", [...formData.topics, ""])
                        }
                        className="w-full p-2 border border-dashed border-white/20 rounded-lg text-white/50 hover:text-white/80 hover:border-[#00D2BE] transition-all duration-200"
                    >
                        + Add Topic
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-white/70">
                    Adjectives
                </label>
                <div className="space-y-2">
                    {formData.adjectives.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                    onArrayFieldChange(
                                        "adjectives",
                                        index,
                                        e.target.value
                                    )
                                }
                                className="flex-1 p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                                placeholder="Use CAPS for emphasis"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newAdjectives = [
                                        ...formData.adjectives,
                                    ];
                                    newAdjectives.splice(index, 1);
                                    onFieldChange("adjectives", newAdjectives);
                                }}
                                className="p-2 text-white/50 hover:text-white/80 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            onFieldChange("adjectives", [
                                ...formData.adjectives,
                                "",
                            ])
                        }
                        className="w-full p-2 border border-dashed border-white/20 rounded-lg text-white/50 hover:text-white/80 hover:border-[#00D2BE] transition-all duration-200"
                    >
                        + Add Adjective
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

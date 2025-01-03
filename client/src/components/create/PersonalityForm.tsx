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

export const PersonalityForm = ({
    formData,
    onFieldChange,
    onArrayFieldChange,
}: Props) => {
    return (
        <motion.div
            key="personality"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div>
                <label className="block text-sm font-medium mb-2 text-white/70">
                    System Prompt
                    <div className="text-xs text-white/50 mb-1">
                        Instructions for how the AI should roleplay this
                        character
                    </div>
                </label>
                <textarea
                    value={formData.system}
                    onChange={(e) => onFieldChange("system", e.target.value)}
                    className="w-full p-3 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                    rows={4}
                    placeholder="e.g., Roleplay as a visionary tech entrepreneur with a focus on space exploration..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-white/70">
                    Bio
                </label>
                <div className="space-y-2">
                    {formData.bio.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                    onArrayFieldChange(
                                        "bio",
                                        index,
                                        e.target.value
                                    )
                                }
                                className="flex-1 p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                                placeholder="Start with a verb (e.g., 'secured', 'protected')"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newBio = [...formData.bio];
                                    newBio.splice(index, 1);
                                    onFieldChange("bio", newBio);
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
                            onFieldChange("bio", [...formData.bio, ""])
                        }
                        className="w-full p-2 border border-dashed border-white/20 rounded-lg text-white/50 hover:text-white/80 hover:border-[#00D2BE] transition-all duration-200"
                    >
                        + Add Bio Entry
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-2 text-white/70">
                    Knowledge
                </label>
                <div className="space-y-2">
                    {formData.knowledge.map((item, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) =>
                                    onArrayFieldChange(
                                        "knowledge",
                                        index,
                                        e.target.value
                                    )
                                }
                                className="flex-1 p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                                placeholder="Start with 'knows', 'understands', etc."
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newKnowledge = [
                                        ...formData.knowledge,
                                    ];
                                    newKnowledge.splice(index, 1);
                                    onFieldChange("knowledge", newKnowledge);
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
                            onFieldChange("knowledge", [
                                ...formData.knowledge,
                                "",
                            ])
                        }
                        className="w-full p-2 border border-dashed border-white/20 rounded-lg text-white/50 hover:text-white/80 hover:border-[#00D2BE] transition-all duration-200"
                    >
                        + Add Knowledge Entry
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

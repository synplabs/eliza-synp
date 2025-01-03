import { motion } from "framer-motion";
import { Character, MessageExampleType } from "../../types/character";

type Props = {
    formData: Character;
    onMessageExampleChange: (
        exampleIndex: number,
        messageIndex: number,
        field: "user" | "content",
        value: string
    ) => void;
    onFieldChange: <K extends keyof Character>(
        field: K,
        value: Character[K]
    ) => void;
};

export const MessagesForm = ({
    formData,
    onMessageExampleChange,
    onFieldChange,
}: Props) => {
    return (
        <motion.div
            key="messages"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white/90">
                    Message Examples
                </h3>
                <button
                    type="button"
                    onClick={() => {
                        const newExamples = [
                            ...formData.messageExamples,
                            [
                                {
                                    user: "{{user1}}",
                                    content: { text: "" },
                                },
                                {
                                    user: "agent",
                                    content: { text: "" },
                                },
                            ],
                        ];
                        onFieldChange("messageExamples", newExamples);
                    }}
                    className="text-sm text-[#00D2BE] hover:text-[#00D2BE]/80 transition-colors"
                >
                    + Add Example
                </button>
            </div>
            {formData.messageExamples.map((example, index) => (
                <div
                    key={index}
                    className="p-4 bg-white/[0.02] rounded-lg space-y-4"
                >
                    {(example as MessageExampleType[]).map(
                        (message, messageIndex) => (
                            <div key={messageIndex} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${messageIndex === 0 ? "bg-blue-500" : "bg-[#00D2BE]"}`}
                                    />
                                    <span className="text-sm text-white/70">
                                        {messageIndex === 0 ? "User" : "Agent"}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={message.content.text}
                                    onChange={(e) =>
                                        onMessageExampleChange(
                                            index,
                                            messageIndex,
                                            "content",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 bg-white/[0.03] border border-white/20 rounded-lg focus:border-[#00D2BE] transition-colors duration-200"
                                    placeholder={
                                        messageIndex === 0
                                            ? "User's message"
                                            : "Agent's response"
                                    }
                                />
                            </div>
                        )
                    )}
                </div>
            ))}
        </motion.div>
    );
};

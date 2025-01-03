import { motion } from "framer-motion";
import { FormTab } from "../../types/character";
import { tabs } from "../../constants/create";

type Props = {
    currentTab: FormTab;
    isSubmitting: boolean;
    isValid: boolean;
    onPrevious: () => void;
    onNext: () => void;
};

export const FormNavigation = ({
    currentTab,
    isSubmitting,
    isValid,
    onPrevious,
    onNext,
}: Props) => {
    const currentIndex = tabs.findIndex((t) => t.id === currentTab);
    const isLastSection = currentIndex === tabs.length - 1;
    const isFirstSection = currentIndex === 0;

    return (
        <div className="flex justify-between gap-4 mt-6">
            {!isFirstSection && (
                <motion.button
                    type="button"
                    onClick={onPrevious}
                    className="px-4 py-2 bg-white/[0.05] text-white rounded-lg hover:bg-white/[0.1] transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Previous
                </motion.button>
            )}
            <div className="flex-1" />
            {isLastSection ? (
                <motion.button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="px-8 py-2 bg-gradient-to-r from-[#00D2BE] to-secondary text-white rounded-lg hover:from-[#00D2BE]/80 hover:to-secondary/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Creating...</span>
                        </div>
                    ) : (
                        "Create Agent"
                    )}
                </motion.button>
            ) : (
                <motion.button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-2 bg-gradient-to-r from-[#00D2BE] to-secondary text-white rounded-lg hover:from-[#00D2BE]/80 hover:to-secondary/80 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Next
                </motion.button>
            )}
        </div>
    );
};

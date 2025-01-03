import { motion, AnimatePresence } from "framer-motion";

type ResetModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function ResetModal({ isOpen, onClose, onConfirm }: ResetModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                >
                    <h2 className="text-xl font-semibold mb-2">Reset Draft</h2>
                    <p className="text-white/70 mb-6">
                        Are you sure you want to reset? This will clear all your
                        progress and cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                            Reset
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showActions?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  showActions = true,
  onConfirm,
  confirmText = "Confirm",
}: DialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative max-h-[80vh] overflow-scroll"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {title && (
              <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
            )}
            <div className="mb-4 text-gray-600">{children}</div>
            {showActions && (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {confirmText}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

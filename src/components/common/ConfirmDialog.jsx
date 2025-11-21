import { useEffect } from "react";

/**
 * ConfirmDialog - A reusable confirmation dialog component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message/content
 * @param {string} props.confirmText - Text for confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for cancel button (default: "Cancel")
 * @param {string} props.variant - Button variant: "danger" | "primary" | "warning" (default: "primary")
 * @param {Function} props.onConfirm - Callback when confirm is clicked
 * @param {Function} props.onCancel - Callback when cancel is clicked or backdrop is clicked
 * @param {boolean} props.closeOnBackdrop - Whether clicking backdrop closes dialog (default: true)
 */
function ConfirmDialog({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    onConfirm,
    onCancel,
    closeOnBackdrop = true,
}) {
    // Handle ESC key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onCancel?.();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when dialog is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onCancel?.();
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
            case "warning":
                return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
            case "primary":
            default:
                return "bg-primary hover:bg-primary/90 focus:ring-primary/50";
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

            {/* Dialog */}
            <div
                className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-message"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-neutral-200">
                    <h3
                        id="dialog-title"
                        className="text-lg font-semibold text-neutral-800"
                    >
                        {title}
                    </h3>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p
                        id="dialog-message"
                        className="text-neutral-600 leading-relaxed"
                    >
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-200 flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getVariantStyles()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;


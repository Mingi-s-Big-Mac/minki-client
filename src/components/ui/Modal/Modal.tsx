import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called on Escape key or backdrop click. */
  onClose: () => void;
  /** id of the element that labels the dialog (for aria-labelledby). */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Centered overlay dialog matching the Figma modals (로그아웃 node 1:2596): a
 * dark scrim over the app with a 418px field-surface card, outline border and
 * a deep drop shadow. Closes on Escape or backdrop click.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(5,7,10,0.72)] px-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          "w-full max-w-[418px] rounded-2xl border border-line-outline bg-field p-[29px]",
          "shadow-[0px_30px_60px_-20px_rgba(0,0,0,0.7)]",
          className,
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

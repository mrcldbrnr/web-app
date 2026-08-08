"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";

/** Einfacher Dialog: schliesst per Escape, Klick auf den Hintergrund oder X. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "flex max-h-[92vh] w-full flex-col overflow-hidden bg-white shadow-xl outline-none",
          "rounded-t-3xl sm:rounded-3xl",
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[14px] text-muted">{description}</p>
            )}
          </div>
          <IconButton label="Schliessen" onClick={onClose} className="-mr-2">
            <CloseIcon />
          </IconButton>
        </div>

        {children && (
          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
            {children}
          </div>
        )}

        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4 sm:px-7">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

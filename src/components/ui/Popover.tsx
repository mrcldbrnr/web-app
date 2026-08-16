"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const POPOVER_WIDTH = 288; // entspricht w-72
const GAP = 8; // entspricht mt-2
const VIEWPORT_MARGIN = 16;

/**
 * Kleines Auswahlpanel, das an seinem Auslöser hängt (Drei-Punkte-Menü,
 * Filterpanels). Schliesst bei Klick ausserhalb, mit Escape und beim
 * Scrollen. Wird mit `position: fixed` anhand der Position des Auslösers
 * platziert (direkt per Ref gesetzt, nicht über State), damit es nicht von
 * überlaufenden Vorfahren (z. B. der abgerundeten Inventarliste)
 * abgeschnitten wird.
 */
export function Popover({
  open,
  onClose,
  children,
  align = "right",
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;

    const panel = ref.current;
    const anchor = panel?.parentElement;
    if (!panel || !anchor) return;

    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const left =
        align === "right" ? rect.right - POPOVER_WIDTH : rect.left;
      const maxLeft = window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN;
      const clampedLeft = Math.min(
        Math.max(left, VIEWPORT_MARGIN),
        Math.max(maxLeft, VIEWPORT_MARGIN),
      );
      panel.style.top = `${rect.bottom + GAP}px`;
      panel.style.left = `${clampedLeft}px`;
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", onClose, true);

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panel.contains(target) && !anchor.contains(target)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onClose, true);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, align]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      style={{ width: POPOVER_WIDTH }}
      className={cn(
        "fixed z-40 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white p-3 shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

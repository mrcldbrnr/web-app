import { cn } from "@/lib/cn";
import { conditionLabel, statusLabel } from "@/lib/constants";
import type { ConditionId, StatusId } from "@/lib/types";

export type BadgeTone = "neutral" | "solid" | "notice" | "alert";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-line text-ink-soft bg-white",
  solid: "border-ink bg-ink text-white",
  notice: "border-notice/30 bg-notice-soft text-notice",
  alert: "border-alert/30 bg-alert-soft text-alert",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Akzentfarben nur dort, wo sie eine Handlung signalisieren (PRD 6). */
export function statusTone(status: StatusId): BadgeTone {
  switch (status) {
    case "maintenance_needed":
    case "in_repair":
      return "notice";
    case "retired":
      return "solid";
    default:
      return "neutral";
  }
}

export function StatusBadge({
  status,
  className,
}: {
  status?: StatusId;
  className?: string;
}) {
  if (!status) return null;
  return (
    <Badge tone={statusTone(status)} className={className}>
      {statusLabel(status)}
    </Badge>
  );
}

export function ConditionBadge({
  condition,
  className,
}: {
  condition?: ConditionId;
  className?: string;
}) {
  if (!condition) return null;
  return (
    <Badge
      tone={condition === "defective" ? "alert" : "neutral"}
      className={className}
    >
      {conditionLabel(condition)}
    </Badge>
  );
}

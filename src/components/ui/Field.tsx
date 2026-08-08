"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/** Beschriftetes Formularfeld mit optionalem Hinweistext. */
export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: (id: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children(id)}
      {hint && <p className="text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("field-control", className)} {...props} />;
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      className={cn("field-control resize-y", className)}
      {...props}
    />
  );
}

export function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("field-control", className)} {...props}>
      {children}
    </select>
  );
}

/** Auswahl-Chip für Mehrfachfilter. */
export function ToggleChip({
  active,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink-soft hover:border-ink-soft",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Checkbox mit gut erreichbarem Klickziel. */
export function CheckboxRow({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-[#0a0a0a]"
      />
      <span>
        <span className="block text-[15px] text-ink">{label}</span>
        {description && (
          <span className="block text-[13px] text-muted">{description}</span>
        )}
      </span>
    </label>
  );
}

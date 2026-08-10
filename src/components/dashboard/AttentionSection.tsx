"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ItemImage } from "@/components/items/ItemImage";
import { IconButton } from "@/components/ui/Button";
import { CheckboxRow } from "@/components/ui/Field";
import { DotsIcon } from "@/components/ui/Icons";
import { Popover } from "@/components/ui/Popover";
import { cn } from "@/lib/cn";
import { ATTENTION_STATUSES, statusLabel } from "@/lib/constants";
import { useInventory } from "@/lib/data/InventoryProvider";
import { getAttentionEntries, type AttentionTone } from "@/lib/logic/attention";
import { updateSettings } from "@/lib/logic/mutations";
import type { StatusId } from "@/lib/types";

/** Kachel-Akzentfarben passend zu den Status-Badges (siehe Badge.tsx). */
const TONE_CLASSES: Record<
  AttentionTone,
  { border: string; panel: string; label: string }
> = {
  info: {
    border: "border-info/30",
    panel: "bg-info-soft",
    label: "text-info",
  },
  notice: {
    border: "border-notice/30",
    panel: "bg-notice-soft",
    label: "text-notice",
  },
  orange: {
    border: "border-orange/30",
    panel: "bg-orange-soft",
    label: "text-orange",
  },
  alert: {
    border: "border-alert/30",
    panel: "bg-alert-soft",
    label: "text-alert",
  },
  neutral: {
    border: "border-line",
    panel: "bg-surface-soft",
    label: "text-ink-soft",
  },
};

/**
 * «Aufmerksamkeit erforderlich» mit persistentem Status-Filter. Der Filter
 * deaktiviert nur den jeweiligen Status als Auslöser – ein defekter Zustand
 * oder ein überschrittenes Wartungsdatum bleibt wirksam (PRD 3.1).
 */
export function AttentionSection() {
  const { data, update } = useInventory();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeFilter = data.settings.dashboardAttentionStatusFilter;
  const entries = useMemo(
    () => getAttentionEntries(data.items, activeFilter),
    [data.items, activeFilter],
  );

  const toggleStatus = (status: StatusId, enabled: boolean) => {
    const next = enabled
      ? [...activeFilter, status]
      : activeFilter.filter((current) => current !== status);
    update((current) =>
      updateSettings(current, {
        dashboardAttentionStatusFilter: ATTENTION_STATUSES.filter((value) =>
          next.includes(value),
        ),
      }),
    );
  };

  return (
    <section aria-labelledby="attention-heading">
      <div className="relative flex items-center gap-2">
        <h2 id="attention-heading" className="section-title">
          Aufmerksamkeit erforderlich
        </h2>
        <span className="muted-label">{entries.length}</span>
        <IconButton
          label="Status-Filter"
          className="ml-auto"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <DotsIcon />
        </IconButton>

        <Popover open={menuOpen} onClose={() => setMenuOpen(false)}>
          <p className="px-1 pb-2 text-[13px] font-semibold text-ink">
            Welche Status sollen hier erscheinen?
          </p>
          <div className="space-y-0.5 px-1">
            {ATTENTION_STATUSES.map((status) => (
              <CheckboxRow
                key={status}
                checked={activeFilter.includes(status)}
                onChange={(checked) => toggleStatus(status, checked)}
                label={statusLabel(status) ?? status}
              />
            ))}
          </div>
          <p className="px-1 pt-2 text-[12px] text-muted">
            Defekte Gegenstände und überfällige Wartungen werden unabhängig
            davon immer angezeigt.
          </p>
        </Popover>
      </div>

      {entries.length === 0 ? (
        <p className="mt-4 rounded-3xl border border-line bg-surface-soft px-5 py-8 text-center text-[15px] text-muted">
          Aktuell erfordert kein Gegenstand eine Handlung.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map(({ item, label, note, tone }) => {
            const toneClasses = TONE_CLASSES[tone];
            return (
              <li key={item.id}>
                <Link
                  href={`/items/${item.id}`}
                  className={cn(
                    "group block overflow-hidden rounded-3xl border bg-white transition-colors hover:border-ink",
                    toneClasses.border,
                  )}
                >
                  <ItemImage
                    item={item}
                    rounded="rounded-none"
                    className="aspect-square w-full border-0 border-b border-line"
                    textClassName="text-3xl"
                  />
                  <div className={cn("px-4 py-3.5", toneClasses.panel)}>
                    <p className="truncate text-[15px] font-semibold text-ink">
                      {item.name}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-[13px] font-semibold",
                        toneClasses.label,
                      )}
                    >
                      {label}
                    </p>
                    {note && (
                      <p className="mt-0.5 truncate text-[12px] text-muted">
                        {note}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

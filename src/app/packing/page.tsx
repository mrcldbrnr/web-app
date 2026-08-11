"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PackingListQuickEdit } from "@/components/packing/PackingListQuickEdit";
import { buttonClass, IconButton } from "@/components/ui/Button";
import { DotsIcon, PlusIcon } from "@/components/ui/Icons";
import { useInventory } from "@/lib/data/InventoryProvider";
import { formatDateRange } from "@/lib/format";
import {
  classifyPackingList,
  getProgress,
  PACKING_GROUP_LABELS,
  sortPackingLists,
  type PackingListGroup,
} from "@/lib/logic/packing";
import type { PackingList } from "@/lib/types";

const GROUP_ORDER: PackingListGroup[] = ["upcoming", "undated", "past"];

/** Packlistenübersicht (PRD 3.5). */
export default function PackingPage() {
  const { data } = useInventory();
  const router = useRouter();
  const [editing, setEditing] = useState<PackingList | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<PackingListGroup, PackingList[]>();
    for (const group of GROUP_ORDER) map.set(group, []);
    for (const list of data.packingLists) {
      map.get(classifyPackingList(list))?.push(list);
    }
    return map;
  }, [data.packingLists]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="page-title">Packliste</h1>
        <Link href="/packing/new" className={buttonClass("primary")}>
          <PlusIcon className="h-5 w-5" />
          Packliste erstellen
        </Link>
      </div>

      {data.packingLists.length === 0 && (
        <p className="card px-5 py-12 text-center text-[15px] text-muted">
          Noch keine Packlisten vorhanden.
        </p>
      )}

      {GROUP_ORDER.map((group) => {
        const lists = sortPackingLists(grouped.get(group) ?? [], group);
        if (!lists.length) return null;

        return (
          <section key={group} className="space-y-3">
            <h2 className="section-title">{PACKING_GROUP_LABELS[group]}</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {lists.map((list) => {
                const entries = data.packingEntries.filter(
                  (entry) => entry.packingListId === list.id,
                );
                const progress = getProgress(entries);
                const percent = progress.total
                  ? Math.round((progress.packed / progress.total) * 100)
                  : 0;
                const dateLabel = formatDateRange(list.startDate, list.endDate);

                return (
                  <li key={list.id} className="card relative p-5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/packing/${list.id}`}
                        className="min-w-0 flex-1"
                      >
                        <p className="truncate text-[17px] font-bold tracking-tight text-ink">
                          {list.name}
                        </p>
                        <p className="mt-0.5 text-[13px] text-muted">
                          {[
                            dateLabel,
                            `${progress.total} ${
                              progress.total === 1
                                ? "Gegenstand"
                                : "Gegenstände"
                            }`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </Link>
                      <IconButton
                        label={`${list.name} bearbeiten`}
                        className="-mt-1 -mr-2 shrink-0"
                        onClick={() => setEditing(list)}
                      >
                        <DotsIcon />
                      </IconButton>
                    </div>

                    <Link
                      href={`/packing/${list.id}`}
                      className="mt-4 block"
                      aria-label={`${list.name} öffnen`}
                    >
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
                        <div
                          className="h-full rounded-full bg-ink transition-[width]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[13px] font-semibold text-ink-soft">
                        {progress.packed} von {progress.total} eingepackt
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {editing && (
        <PackingListQuickEdit
          list={editing}
          open
          onClose={() => setEditing(null)}
          onDuplicated={(newListId) => router.push(`/packing/${newListId}`)}
        />
      )}
    </div>
  );
}

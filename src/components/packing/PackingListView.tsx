"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ItemImage } from "@/components/items/ItemImage";
import { ItemPickerModal } from "@/components/items/ItemPickerModal";
import { PackingListQuickEdit } from "@/components/packing/PackingListQuickEdit";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button, buttonClass } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ArrowLeftIcon,
  CheckIcon,
  CloseIcon,
  PlusIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { ATTENTION_STATUSES, statusLabel } from "@/lib/constants";
import { useInventory } from "@/lib/data/InventoryProvider";
import { formatDateRange } from "@/lib/format";
import {
  addItemsToPackingList,
  deletePackingList,
  duplicatePackingList,
  removeItemFromPackingList,
  setEntryPacked,
} from "@/lib/logic/mutations";
import { getProgress, groupEntriesByCategory } from "@/lib/logic/packing";
import { activeItems } from "@/lib/logic/stats";
import type { Item } from "@/lib/types";

/** Einzelne Packliste mit Packstatus und Fortschritt (PRD 3.5). */
export function PackingListView({ id }: { id: string }) {
  const { data, update } = useInventory();
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const list = data.packingLists.find((current) => current.id === id);

  const entries = useMemo(
    () => data.packingEntries.filter((entry) => entry.packingListId === id),
    [data.packingEntries, id],
  );

  const groups = useMemo(
    () => groupEntriesByCategory(entries, data.items),
    [entries, data.items],
  );

  /** Verknüpfte Gegenstände als optionale Ergänzungen (nie automatisch). */
  const suggestions = useMemo(() => {
    const inList = new Set(entries.map((entry) => entry.itemId));
    const suggested = new Map<string, Item>();
    for (const entry of entries) {
      const item = data.items.find((current) => current.id === entry.itemId);
      if (!item) continue;
      for (const linkedId of item.linkedItemIds) {
        if (inList.has(linkedId) || suggested.has(linkedId)) continue;
        const linked = data.items.find((current) => current.id === linkedId);
        if (linked && linked.status !== "retired") suggested.set(linkedId, linked);
      }
    }
    return [...suggested.values()];
  }, [entries, data.items]);

  if (!list) {
    return (
      <div className="card px-6 py-14 text-center">
        <p className="text-[15px] text-muted">
          Diese Packliste existiert nicht (mehr).
        </p>
        <Link href="/packing" className={buttonClass("secondary", "md", "mt-5")}>
          Zu den Packlisten
        </Link>
      </div>
    );
  }

  const progress = getProgress(entries);
  const percent = progress.total
    ? Math.round((progress.packed / progress.total) * 100)
    : 0;
  const dateLabel = formatDateRange(list.startDate, list.endDate);
  const inListIds = new Set(entries.map((entry) => entry.itemId));

  const duplicate = () => {
    const result = duplicatePackingList(data, list.id);
    update(() => result.data);
    router.push(`/packing/${result.list.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/packing"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted hover:text-ink"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Alle Packlisten
        </Link>
        <Button onClick={() => setEditOpen(true)}>Name/Datum bearbeiten</Button>
      </div>

      <div className="space-y-4">
        <div className="min-w-0">
          <h1 className="page-title">{list.name}</h1>
          {dateLabel && (
            <p className="mt-1 text-[15px] text-muted">{dateLabel}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-soft">
            <div
              className="h-full rounded-full bg-ink transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-[14px] font-semibold text-ink">
            {progress.packed} von {progress.total} eingepackt
          </p>
        </div>

        {list.notes && (
          <p className="card px-5 py-4 text-[15px] whitespace-pre-line text-ink-soft">
            {list.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="secondary" onClick={() => setPickerOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            Gegenstände hinzufügen
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={duplicate}>
              Duplizieren
            </Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Löschen
            </Button>
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="card px-5 py-12 text-center text-[15px] text-muted">
          Noch keine Gegenstände in dieser Packliste.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.label} className="space-y-3">
            <h2 className="section-title">{group.label}</h2>
            <ul className="card divide-y divide-line overflow-hidden">
              {group.entries.map(({ entry, item }) => {
                const retired = item.status === "retired";
                const problematic =
                  item.status !== undefined &&
                  ATTENTION_STATUSES.includes(item.status);

                return (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <button
                      type="button"
                      aria-pressed={entry.packed}
                      aria-label={
                        entry.packed
                          ? `${item.name} als noch einzupacken markieren`
                          : `${item.name} als eingepackt markieren`
                      }
                      onClick={() =>
                        update((current) =>
                          setEntryPacked(current, list.id, item.id, !entry.packed),
                        )
                      }
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                        entry.packed
                          ? "border-ink bg-ink text-white"
                          : "border-line-strong hover:border-ink",
                      )}
                    >
                      {entry.packed && <CheckIcon className="h-4 w-4" />}
                    </button>

                    <Link
                      href={`/items/${item.id}`}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <ItemImage
                        item={item}
                        className="h-11 w-11 shrink-0"
                        textClassName="text-sm"
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-[15px] font-semibold",
                            entry.packed ? "text-muted line-through" : "text-ink",
                          )}
                        >
                          {item.name}
                        </span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          {retired && <Badge tone="solid">Aussortiert</Badge>}
                          {!retired && problematic && item.status && (
                            <Badge tone={statusTone(item.status)}>
                              {statusLabel(item.status)}
                            </Badge>
                          )}
                        </span>
                      </span>
                    </Link>

                    <button
                      type="button"
                      aria-label={`${item.name} aus Packliste entfernen`}
                      onClick={() =>
                        update((current) =>
                          removeItemFromPackingList(current, list.id, item.id),
                        )
                      }
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-soft hover:text-ink"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}

      {suggestions.length > 0 && (
        <section className="space-y-3">
          <h2 className="section-title">Passende Gegenstände</h2>
          <p className="text-[14px] text-muted">
            Mit deiner Auswahl verknüpft – nichts wird automatisch hinzugefügt.
          </p>
          <ul className="flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    update((current) =>
                      addItemsToPackingList(current, list.id, [item.id]),
                    )
                  }
                  className="chip min-h-10 hover:border-ink"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pickerOpen && (
        <ItemPickerModal
          open
          title="Gegenstände hinzufügen"
          description="Aussortierte Gegenstände stehen nicht zur Auswahl."
          candidates={activeItems(data.items).filter(
            (item) => !inListIds.has(item.id),
          )}
          confirmLabel="Hinzufügen"
          onConfirm={(ids) => {
            update((current) => addItemsToPackingList(current, list.id, ids));
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {editOpen && (
        <PackingListQuickEdit
          list={list}
          open
          onClose={() => setEditOpen(false)}
          showDeleteButton={false}
          showDuplicateButton={false}
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        title={`«${list.name}» löschen?`}
        description="Die Packliste und ihre Einträge werden entfernt. Die Gegenstände selbst bleiben im Inventar."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          update((current) => deletePackingList(current, list.id));
          setConfirmDelete(false);
          router.push("/packing");
        }}
      />
    </div>
  );
}

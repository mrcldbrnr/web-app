"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { IconButton } from "@/components/ui/Button";
import { DotsIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Popover } from "@/components/ui/Popover";
import { useInventory } from "@/lib/data/InventoryProvider";
import { duplicateItemValues } from "@/lib/logic/itemFields";
import {
  addItemsToPackingList,
  createItem,
  deleteItem,
  type ItemInput,
} from "@/lib/logic/mutations";
import type { Item } from "@/lib/types";

/**
 * Schnellbearbeitung pro Listenzeile: Packliste, Duplizieren, Löschen.
 * Duplizieren und Löschen benötigen eine Bestätigung.
 */
export function ItemQuickMenu({ item }: { item: Item }) {
  const { data, update } = useInventory();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [packingOpen, setPackingOpen] = useState(false);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const retired = item.status === "retired";

  const packingListsWithItem = new Set(
    data.packingEntries
      .filter((entry) => entry.itemId === item.id)
      .map((entry) => entry.packingListId),
  );
  const availableLists = data.packingLists.filter(
    (list) => !packingListsWithItem.has(list.id),
  );

  const handleDuplicate = () => {
    const input: ItemInput = {
      ...duplicateItemValues(item),
      name: `${item.name} (Kopie)`,
      documents: [],
      linkedItemIds: [],
    };
    const result = createItem(data, input);
    update(() => result.data);
    setConfirmDuplicate(false);
    router.push(`/items/${result.item.id}`);
  };

  const handleDelete = () => {
    update((current) => deleteItem(current, item.id));
    setConfirmDelete(false);
  };

  return (
    <div className="relative">
      <IconButton
        label={`Schnellbearbeitung für ${item.name}`}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <DotsIcon />
      </IconButton>

      <Popover open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="flex flex-col">
          {!retired && data.packingLists.length > 0 && (
            <button
              type="button"
              className="rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-ink hover:bg-surface-soft"
              onClick={() => {
                setMenuOpen(false);
                setPackingOpen(true);
              }}
            >
              Zu Packliste hinzufügen
            </button>
          )}
          <button
            type="button"
            className="rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-ink hover:bg-surface-soft"
            onClick={() => {
              setMenuOpen(false);
              setConfirmDuplicate(true);
            }}
          >
            Duplizieren
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-alert hover:bg-alert-soft"
            onClick={() => {
              setMenuOpen(false);
              setConfirmDelete(true);
            }}
          >
            Löschen
          </button>
        </div>
      </Popover>

      <Modal
        open={packingOpen}
        onClose={() => setPackingOpen(false)}
        title="Zu Packliste hinzufügen"
        description={
          availableLists.length ? "Wähle eine bestehende Packliste." : undefined
        }
      >
        {availableLists.length === 0 ? (
          <p className="py-4 text-[15px] text-muted">
            Dieser Gegenstand ist bereits in allen Packlisten enthalten.
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-2xl border border-line">
            {availableLists.map((list) => (
              <li key={list.id}>
                <button
                  type="button"
                  className="row-link px-4 py-3.5 text-[15px] font-semibold text-ink"
                  onClick={() => {
                    update((current) =>
                      addItemsToPackingList(current, list.id, [item.id]),
                    );
                    setPackingOpen(false);
                  }}
                >
                  {list.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmDuplicate}
        title={`«${item.name}» duplizieren?`}
        description={`Ein neuer Gegenstand «${item.name} (Kopie)» wird mit denselben Angaben erstellt – ohne Seriennummer, Dokumente und Verknüpfungen.`}
        confirmLabel="Duplizieren"
        destructive={false}
        onCancel={() => setConfirmDuplicate(false)}
        onConfirm={handleDuplicate}
      />

      <ConfirmDialog
        open={confirmDelete}
        title={`«${item.name}» löschen?`}
        description="Der Gegenstand wird aus allen Packlisten entfernt und alle Verknüpfungen werden aufgehoben."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

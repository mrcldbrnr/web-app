"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PackingListToggleModal } from "@/components/items/PackingListToggleModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { IconButton } from "@/components/ui/Button";
import { DotsIcon } from "@/components/ui/Icons";
import { Popover } from "@/components/ui/Popover";
import { useInventory } from "@/lib/data/InventoryProvider";
import { duplicateItemValues } from "@/lib/logic/itemFields";
import { createItem, deleteItem, type ItemInput } from "@/lib/logic/mutations";
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

      <PackingListToggleModal
        item={item}
        open={packingOpen}
        onClose={() => setPackingOpen(false)}
      />

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

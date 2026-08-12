"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PackingListQuickEdit } from "@/components/packing/PackingListQuickEdit";
import { IconButton } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DotsIcon } from "@/components/ui/Icons";
import { Popover } from "@/components/ui/Popover";
import { useInventory } from "@/lib/data/InventoryProvider";
import { deletePackingList, duplicatePackingList } from "@/lib/logic/mutations";
import type { PackingList } from "@/lib/types";

/**
 * Schnellbearbeitung pro Packlisten-Kachel: Name/Datum, Duplizieren, Löschen.
 * Duplizieren und Löschen benötigen eine Bestätigung.
 */
export function PackingListQuickMenu({ list }: { list: PackingList }) {
  const { data, update } = useInventory();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDuplicate, setConfirmDuplicate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDuplicate = () => {
    const result = duplicatePackingList(data, list.id);
    update(() => result.data);
    setConfirmDuplicate(false);
    router.push(`/packing/${result.list.id}`);
  };

  const handleDelete = () => {
    update((current) => deletePackingList(current, list.id));
    setConfirmDelete(false);
  };

  return (
    <div className="relative">
      <IconButton
        label={`Schnellbearbeitung für ${list.name}`}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <DotsIcon />
      </IconButton>

      <Popover open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="flex flex-col">
          <button
            type="button"
            className="rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-ink hover:bg-surface-soft"
            onClick={() => {
              setMenuOpen(false);
              setEditOpen(true);
            }}
          >
            Name/Datum bearbeiten
          </button>
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
        open={confirmDuplicate}
        title={`«${list.name}» duplizieren?`}
        description="Eine neue Packliste mit denselben Gegenständen wird erstellt."
        confirmLabel="Duplizieren"
        destructive={false}
        onCancel={() => setConfirmDuplicate(false)}
        onConfirm={handleDuplicate}
      />

      <ConfirmDialog
        open={confirmDelete}
        title={`«${list.name}» löschen?`}
        description="Die Packliste und ihre Einträge werden entfernt. Die Gegenstände selbst bleiben im Inventar."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

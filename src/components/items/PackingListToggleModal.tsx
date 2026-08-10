"use client";

import { CheckboxRow } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useInventory } from "@/lib/data/InventoryProvider";
import { formatDateRange } from "@/lib/format";
import {
  addItemsToPackingList,
  removeItemFromPackingList,
} from "@/lib/logic/mutations";
import { classifyPackingList } from "@/lib/logic/packing";
import type { Item } from "@/lib/types";

/**
 * Packlisten-Zuordnung eines Gegenstands: zeigt bevorstehende und
 * datumslose Packlisten, vergangene bleiben ausgeblendet. Jede Checkbox
 * fügt den Gegenstand sofort hinzu bzw. entfernt ihn wieder.
 */
export function PackingListToggleModal({
  item,
  open,
  onClose,
}: {
  item: Item;
  open: boolean;
  onClose: () => void;
}) {
  const { data, update } = useInventory();

  const eligibleLists = data.packingLists.filter(
    (list) => classifyPackingList(list) !== "past",
  );

  const memberListIds = new Set(
    data.packingEntries
      .filter((entry) => entry.itemId === item.id)
      .map((entry) => entry.packingListId),
  );

  const toggle = (listId: string, checked: boolean) => {
    update((current) =>
      checked
        ? addItemsToPackingList(current, listId, [item.id])
        : removeItemFromPackingList(current, listId, item.id),
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Zu Packliste hinzufügen"
      description={
        eligibleLists.length
          ? "Wähle eine oder mehrere Packlisten."
          : undefined
      }
    >
      {eligibleLists.length === 0 ? (
        <p className="py-4 text-[15px] text-muted">
          Keine bevorstehenden oder datumslosen Packlisten vorhanden.
        </p>
      ) : (
        <div className="divide-y divide-line rounded-2xl border border-line px-4">
          {eligibleLists.map((list) => (
            <CheckboxRow
              key={list.id}
              checked={memberListIds.has(list.id)}
              onChange={(checked) => toggle(list.id, checked)}
              label={list.name}
              description={formatDateRange(list.startDate, list.endDate)}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field, TextInput } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useInventory } from "@/lib/data/InventoryProvider";
import {
  deletePackingList,
  duplicatePackingList,
  updatePackingList,
} from "@/lib/logic/mutations";
import type { PackingList } from "@/lib/types";

/**
 * Schnellbearbeitung aus der Packlistenübersicht: Name, Reisedatum,
 * Duplizieren und Löschen (PRD 3.5).
 */
export function PackingListQuickEdit({
  list,
  open,
  onClose,
  onDeleted,
  onDuplicated,
}: {
  list: PackingList;
  open: boolean;
  onClose: () => void;
  onDeleted?: () => void;
  onDuplicated?: (newListId: string) => void;
}) {
  const { data, update } = useInventory();
  const [name, setName] = useState(list.name);
  const [startDate, setStartDate] = useState(list.startDate ?? "");
  const [endDate, setEndDate] = useState(list.endDate ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(false);

  const save = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    update((current) =>
      updatePackingList(current, list.id, {
        name,
        startDate: startDate || undefined,
        endDate: startDate ? endDate || undefined : undefined,
        notes: list.notes,
      }),
    );
    onClose();
  };

  const duplicate = () => {
    const result = duplicatePackingList(data, list.id);
    update(() => result.data);
    onClose();
    onDuplicated?.(result.list.id);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Packliste bearbeiten"
        footer={
          <>
            <Button
              variant="danger"
              className="mr-auto"
              onClick={() => setConfirmDelete(true)}
            >
              Löschen
            </Button>
            <Button variant="secondary" onClick={duplicate}>
              Duplizieren
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Abbrechen
            </Button>
            <Button onClick={save}>Speichern</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name" required>
            {(id) => (
              <>
                <TextInput
                  id={id}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError(false);
                  }}
                />
                {error && (
                  <p className="mt-1.5 text-[13px] text-alert">
                    Bitte einen Namen erfassen.
                  </p>
                )}
              </>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Startdatum">
              {(id) => (
                <TextInput
                  id={id}
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    if (!event.target.value) setEndDate("");
                  }}
                />
              )}
            </Field>
            <Field
              label="Enddatum"
              hint={!startDate ? "Nur mit Startdatum möglich." : undefined}
            >
              {(id) => (
                <TextInput
                  id={id}
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  disabled={!startDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              )}
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title={`«${list.name}» löschen?`}
        description="Die Packliste und ihre Einträge werden entfernt. Die Gegenstände selbst bleiben im Inventar."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          update((current) => deletePackingList(current, list.id));
          setConfirmDelete(false);
          onClose();
          onDeleted?.();
        }}
      />
    </>
  );
}

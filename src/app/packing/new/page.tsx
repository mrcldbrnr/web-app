"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ItemPickerModal } from "@/components/items/ItemPickerModal";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { CloseIcon } from "@/components/ui/Icons";
import { useInventory } from "@/lib/data/InventoryProvider";
import { createPackingList } from "@/lib/logic/mutations";
import { activeItems } from "@/lib/logic/stats";
import type { Item } from "@/lib/types";

/** Packliste erstellen – nur der Name ist obligatorisch (PRD 3.5). */
export default function NewPackingListPage() {
  const { data, update } = useInventory();
  const router = useRouter();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState(false);

  const selected = itemIds
    .map((id) => data.items.find((item) => item.id === id))
    .filter((item): item is Item => item !== undefined);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    const result = createPackingList(
      data,
      { name, startDate, endDate, notes },
      itemIds,
    );
    update(() => result.data);
    router.push(`/packing/${result.list.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="page-title">Packliste erstellen</h1>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <section className="card space-y-5 p-5 sm:p-6">
          <Field label="Name" required>
            {(id) => (
              <>
                <TextInput
                  id={id}
                  value={name}
                  autoFocus
                  placeholder="z. B. Skiferien Zermatt"
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
              hint={
                startDate
                  ? undefined
                  : "Kann nur mit vorhandenem Startdatum gesetzt werden."
              }
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

          <Field label="Notizen">
            {(id) => (
              <TextArea
                id={id}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            )}
          </Field>
        </section>

        <section className="card space-y-3 p-5 sm:p-6">
          <p className="field-label">Gegenstände</p>
          {selected.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {selected.map((item) => (
                <li key={item.id}>
                  <span className="chip">
                    {item.name}
                    <button
                      type="button"
                      aria-label={`${item.name} entfernen`}
                      onClick={() =>
                        setItemIds((current) =>
                          current.filter((id) => id !== item.id),
                        )
                      }
                      className="text-muted hover:text-ink"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            Gegenstände auswählen
          </Button>
          <p className="text-[13px] text-muted">
            Gegenstände können auch später ergänzt werden.
          </p>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            Abbrechen
          </Button>
          <Button type="submit" size="lg">
            Packliste speichern
          </Button>
        </div>
      </form>

      {pickerOpen && (
        <ItemPickerModal
          open
          title="Gegenstände auswählen"
          description="Aussortierte Gegenstände stehen nicht zur Auswahl."
          candidates={activeItems(data.items)}
          initialSelection={itemIds}
          onConfirm={(ids) => {
            setItemIds(ids);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

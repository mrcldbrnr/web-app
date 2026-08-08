"use client";

import { useMemo, useState } from "react";
import { DocumentsField } from "@/components/items/DocumentsField";
import { ItemPickerModal } from "@/components/items/ItemPickerModal";
import { LocationFields } from "@/components/items/LocationFields";
import { PhotoField } from "@/components/items/PhotoField";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Field,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/ui/Field";
import { CloseIcon } from "@/components/ui/Icons";
import { CATEGORIES, CONDITIONS, STATUSES } from "@/lib/constants";
import { useInventory } from "@/lib/data/InventoryProvider";
import { createId } from "@/lib/id";
import {
  categoryDataLossPreview,
  categoryFields,
  pruneCategoryData,
  pruneStatusData,
  statusFields,
} from "@/lib/logic/itemFields";
import type { ItemInput } from "@/lib/logic/mutations";
import type {
  CategoryId,
  ConditionId,
  DocumentMeta,
  FieldDef,
  Item,
  PrimaryLocation,
  SecondaryLocation,
  StatusId,
} from "@/lib/types";

interface FormState {
  name: string;
  brand: string;
  image?: string;
  category?: CategoryId;
  locationPrimaryId?: string;
  locationSecondaryId?: string;
  purchaseDate: string;
  purchasePrice: string;
  condition?: ConditionId;
  status?: StatusId;
  notes: string;
  categoryData: Record<string, string>;
  statusData: Record<string, string>;
  documents: DocumentMeta[];
  linkedItemIds: string[];
}

function toFormState(item?: Item): FormState {
  return {
    name: item?.name ?? "",
    brand: item?.brand ?? "",
    image: item?.image,
    category: item?.category,
    locationPrimaryId: item?.locationPrimaryId,
    locationSecondaryId: item?.locationSecondaryId,
    purchaseDate: item?.purchaseDate ?? "",
    purchasePrice:
      item?.purchasePrice !== undefined ? String(item.purchasePrice) : "",
    condition: item?.condition,
    status: item?.status,
    notes: item?.notes ?? "",
    categoryData: { ...(item?.categoryData ?? {}) },
    statusData: { ...(item?.statusData ?? {}) },
    documents: [...(item?.documents ?? [])],
    linkedItemIds: [...(item?.linkedItemIds ?? [])],
  };
}

/** Erfassung und Bearbeitung eines Gegenstands (PRD 3.3). */
export function ItemForm({
  item,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  item?: Item;
  submitLabel: string;
  onSubmit: (input: ItemInput) => void;
  onCancel: () => void;
}) {
  const { data } = useInventory();
  const [form, setForm] = useState<FormState>(() => toFormState(item));
  const [pendingPrimary, setPendingPrimary] = useState<PrimaryLocation[]>([]);
  const [pendingSecondary, setPendingSecondary] = useState<SecondaryLocation[]>(
    [],
  );
  const [categoryChange, setCategoryChange] = useState<{
    next?: CategoryId;
    losses: { label: string; value: string }[];
  } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showNameError, setShowNameError] = useState(false);

  const patch = (values: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...values }));

  const allPrimary = [...data.primaryLocations, ...pendingPrimary];
  const allSecondary = [...data.secondaryLocations, ...pendingSecondary];

  const linkedItems = useMemo(
    () =>
      form.linkedItemIds
        .map((id) => data.items.find((current) => current.id === id))
        .filter((current): current is Item => current !== undefined),
    [form.linkedItemIds, data.items],
  );

  const linkCandidates = useMemo(
    () => data.items.filter((current) => current.id !== item?.id),
    [data.items, item?.id],
  );

  const applyCategory = (next?: CategoryId) => {
    setForm((current) => ({
      ...current,
      category: next,
      categoryData: pruneCategoryData(current.categoryData, next),
    }));
  };

  const handleCategoryChange = (next?: CategoryId) => {
    const losses = categoryDataLossPreview(
      form.categoryData,
      form.category,
      next,
    );
    if (losses.length > 0) {
      setCategoryChange({ next, losses });
      return;
    }
    applyCategory(next);
  };

  /** Statusabhängige Felder des bisherigen Status werden direkt entfernt. */
  const handleStatusChange = (next?: StatusId) => {
    setForm((current) => ({
      ...current,
      status: next,
      statusData: pruneStatusData(current.statusData, next),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setShowNameError(true);
      return;
    }
    const price = form.purchasePrice.trim().replace(",", ".");
    const parsedPrice = price === "" ? undefined : Number(price);

    onSubmit({
      name: form.name,
      brand: form.brand,
      image: form.image,
      category: form.category,
      locationPrimaryId: form.locationPrimaryId,
      locationSecondaryId: form.locationSecondaryId,
      purchaseDate: form.purchaseDate,
      purchasePrice:
        parsedPrice !== undefined && Number.isFinite(parsedPrice)
          ? parsedPrice
          : undefined,
      condition: form.condition,
      status: form.status,
      notes: form.notes,
      categoryData: form.categoryData,
      statusData: form.statusData,
      documents: form.documents,
      linkedItemIds: form.linkedItemIds,
      pendingPrimaryLocations: pendingPrimary,
      pendingSecondaryLocations: pendingSecondary,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <section className="card space-y-5 p-5 sm:p-6">
        <Field label="Name" required>
          {(id) => (
            <>
              <TextInput
                id={id}
                value={form.name}
                autoFocus
                onChange={(event) => {
                  patch({ name: event.target.value });
                  if (showNameError) setShowNameError(false);
                }}
                placeholder="z. B. Velohelm"
                aria-invalid={showNameError}
              />
              {showNameError && (
                <p className="mt-1.5 text-[13px] text-alert">
                  Bitte einen Namen erfassen.
                </p>
              )}
            </>
          )}
        </Field>

        <Field label="Marke / Hersteller">
          {(id) => (
            <TextInput
              id={id}
              value={form.brand}
              onChange={(event) => patch({ brand: event.target.value })}
            />
          )}
        </Field>

        <PhotoField
          value={form.image}
          onChange={(image) => patch({ image })}
        />
      </section>

      <section className="card space-y-5 p-5 sm:p-6">
        <Field label="Kategorie">
          {(id) => (
            <SelectInput
              id={id}
              value={form.category ?? ""}
              onChange={(event) =>
                handleCategoryChange(
                  (event.target.value || undefined) as CategoryId | undefined,
                )
              }
            >
              <option value="">Keine Kategorie</option>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </SelectInput>
          )}
        </Field>

        <DynamicFields
          fields={categoryFields(form.category)}
          values={form.categoryData}
          onChange={(categoryData) => patch({ categoryData })}
        />

        <LocationFields
          primaryLocations={allPrimary}
          secondaryLocations={allSecondary}
          primaryId={form.locationPrimaryId}
          secondaryId={form.locationSecondaryId}
          onChange={({ primaryId, secondaryId }) =>
            patch({
              locationPrimaryId: primaryId,
              locationSecondaryId: secondaryId,
            })
          }
          onCreatePrimary={(name) => {
            const location = { id: createId("loc"), name };
            setPendingPrimary((current) => [...current, location]);
            return location;
          }}
          onCreateSecondary={(primaryId, name) => {
            const location = { id: createId("sub"), name, primaryId };
            setPendingSecondary((current) => [...current, location]);
            return location;
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kaufdatum">
            {(id) => (
              <TextInput
                id={id}
                type="date"
                value={form.purchaseDate}
                onChange={(event) =>
                  patch({ purchaseDate: event.target.value })
                }
              />
            )}
          </Field>

          <Field
            label={`Kaufpreis (${data.settings.currencyLabel})`}
            hint="Ursprünglicher Kaufpreis, keine Zeitwertberechnung."
          >
            {(id) => (
              <TextInput
                id={id}
                type="number"
                inputMode="decimal"
                min={0}
                step="0.05"
                value={form.purchasePrice}
                onChange={(event) =>
                  patch({ purchasePrice: event.target.value })
                }
              />
            )}
          </Field>
        </div>
      </section>

      <section className="card space-y-5 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Zustand">
            {(id) => (
              <SelectInput
                id={id}
                value={form.condition ?? ""}
                onChange={(event) =>
                  patch({
                    condition: (event.target.value || undefined) as
                      | ConditionId
                      | undefined,
                  })
                }
              >
                <option value="">Kein Zustand</option>
                {CONDITIONS.map((condition) => (
                  <option key={condition.id} value={condition.id}>
                    {condition.label}
                  </option>
                ))}
              </SelectInput>
            )}
          </Field>

          <Field label="Status">
            {(id) => (
              <SelectInput
                id={id}
                value={form.status ?? ""}
                onChange={(event) =>
                  handleStatusChange(
                    (event.target.value || undefined) as StatusId | undefined,
                  )
                }
              >
                <option value="">Kein Status</option>
                {STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </SelectInput>
            )}
          </Field>
        </div>

        <DynamicFields
          fields={statusFields(form.status)}
          values={form.statusData}
          onChange={(statusData) => patch({ statusData })}
        />
      </section>

      <section className="card space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <p className="field-label">Verknüpfte Gegenstände</p>
          {linkedItems.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {linkedItems.map((linked) => (
                <li key={linked.id}>
                  <span className="chip">
                    {linked.name}
                    <button
                      type="button"
                      aria-label={`${linked.name} entfernen`}
                      onClick={() =>
                        patch({
                          linkedItemIds: form.linkedItemIds.filter(
                            (id) => id !== linked.id,
                          ),
                        })
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
            Gegenstand verknüpfen
          </Button>
          <p className="text-[13px] text-muted">
            Verknüpfungen gelten immer beidseitig.
          </p>
        </div>

        <DocumentsField
          value={form.documents}
          onChange={(documents) => patch({ documents })}
        />

        <Field label="Notizen">
          {(id) => (
            <TextArea
              id={id}
              value={form.notes}
              onChange={(event) => patch({ notes: event.target.value })}
            />
          )}
        </Field>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>

      {pickerOpen && (
        <ItemPickerModal
          open
          title="Gegenstände verknüpfen"
          description="Die Verknüpfung ist auf beiden Gegenständen sichtbar."
          candidates={linkCandidates}
          initialSelection={form.linkedItemIds}
          onConfirm={(ids) => {
            patch({ linkedItemIds: ids });
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <ConfirmDialog
        open={categoryChange !== null}
        title="Kategorie wechseln?"
        description="Kategoriespezifische Angaben, die zur neuen Kategorie nicht gehören, werden gelöscht."
        confirmLabel="Wechseln und löschen"
        onCancel={() => setCategoryChange(null)}
        onConfirm={() => {
          applyCategory(categoryChange?.next);
          setCategoryChange(null);
        }}
      >
        <ul className="space-y-1 text-[14px] text-ink-soft">
          {categoryChange?.losses.map((loss) => (
            <li key={loss.label}>
              <span className="font-semibold">{loss.label}:</span> {loss.value}
            </li>
          ))}
        </ul>
      </ConfirmDialog>
    </form>
  );
}

/** Rendert kategorie- bzw. statusabhängige Felder. */
function DynamicFields({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}) {
  if (!fields.length) return null;

  const set = (key: string, value: string) =>
    onChange({ ...values, [key]: value });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <Field key={field.key} label={field.label}>
          {(id) =>
            field.type === "select" ? (
              <SelectInput
                id={id}
                value={values[field.key] ?? ""}
                onChange={(event) => set(field.key, event.target.value)}
              >
                <option value="">Keine Angabe</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            ) : (
              <TextInput
                id={id}
                type={field.type === "date" ? "date" : "text"}
                value={values[field.key] ?? ""}
                onChange={(event) => set(field.key, event.target.value)}
              />
            )
          }
        </Field>
      ))}
    </div>
  );
}

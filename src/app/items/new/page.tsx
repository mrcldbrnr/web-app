"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemForm } from "@/components/items/ItemForm";
import { useInventory } from "@/lib/data/InventoryProvider";
import { duplicateItemValues } from "@/lib/logic/itemFields";
import { createItem } from "@/lib/logic/mutations";

export default function NewItemPage() {
  return (
    <Suspense fallback={<p className="py-10 text-muted">Formular wird geladen …</p>}>
      <NewItemView />
    </Suspense>
  );
}

/** Erfassungsseite: nur der Name ist obligatorisch (PRD 3.3). */
function NewItemView() {
  const { data, update } = useInventory();
  const router = useRouter();
  const searchParams = useSearchParams();

  const duplicateFromId = searchParams.get("from");
  const sourceItem = duplicateFromId
    ? data.items.find((current) => current.id === duplicateFromId)
    : undefined;
  const initialValues = sourceItem ? duplicateItemValues(sourceItem) : undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="page-title">
          {sourceItem ? "Gegenstand duplizieren" : "Gegenstand hinzufügen"}
        </h1>
        <p className="text-[15px] text-muted">
          {sourceItem
            ? `Vorausgefüllt anhand von «${sourceItem.name}». Passe die Angaben an und speichere den neuen Gegenstand.`
            : "Nur der Name ist erforderlich – alles andere kann jederzeit ergänzt werden."}
        </p>
      </div>

      <ItemForm
        initialValues={initialValues}
        submitLabel="Gegenstand speichern"
        onCancel={() => router.back()}
        onSubmit={(input) => {
          const result = createItem(data, input);
          update(() => result.data);
          router.push(`/items/${result.item.id}`);
        }}
      />
    </div>
  );
}

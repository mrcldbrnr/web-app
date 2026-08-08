"use client";

import { useRouter } from "next/navigation";
import { ItemForm } from "@/components/items/ItemForm";
import { useInventory } from "@/lib/data/InventoryProvider";
import { createItem } from "@/lib/logic/mutations";

/** Erfassungsseite: nur der Name ist obligatorisch (PRD 3.3). */
export default function NewItemPage() {
  const { data, update } = useInventory();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="page-title">Gegenstand hinzufügen</h1>
        <p className="text-[15px] text-muted">
          Nur der Name ist erforderlich – alles andere kann jederzeit ergänzt
          werden.
        </p>
      </div>

      <ItemForm
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

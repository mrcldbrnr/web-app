"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ItemForm } from "@/components/items/ItemForm";
import { buttonClass } from "@/components/ui/Button";
import { useInventory } from "@/lib/data/InventoryProvider";
import { updateItem } from "@/lib/logic/mutations";

export function EditItemView({ id }: { id: string }) {
  const { data, update } = useInventory();
  const router = useRouter();
  const item = data.items.find((current) => current.id === id);

  if (!item) {
    return (
      <div className="card px-6 py-14 text-center">
        <p className="text-[15px] text-muted">
          Dieser Gegenstand existiert nicht (mehr).
        </p>
        <Link
          href="/inventory"
          className={buttonClass("secondary", "md", "mt-5")}
        >
          Zum Inventar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="page-title">{item.name} bearbeiten</h1>

      <ItemForm
        item={item}
        submitLabel="Änderungen speichern"
        onCancel={() => router.push(`/items/${item.id}`)}
        onSubmit={(input) => {
          const result = updateItem(data, item.id, input);
          update(() => result.data);
          router.push(`/items/${item.id}`);
        }}
      />
    </div>
  );
}

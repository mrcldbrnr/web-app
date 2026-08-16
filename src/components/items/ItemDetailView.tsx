"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ItemImage } from "@/components/items/ItemImage";
import { ItemPickerModal } from "@/components/items/ItemPickerModal";
import { PackingListToggleModal } from "@/components/items/PackingListToggleModal";
import { ConditionBadge, StatusBadge } from "@/components/ui/Badge";
import { Button, buttonClass } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  AlertIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
} from "@/components/ui/Icons";
import { categoryLabel } from "@/lib/constants";
import { useInventory } from "@/lib/data/InventoryProvider";
import { formatDate, formatFileSize, formatPrice } from "@/lib/format";
import { hasOverdueMaintenance } from "@/lib/logic/attention";
import {
  filledCategoryFields,
  filledStatusFields,
} from "@/lib/logic/itemFields";
import { itemFullLocation } from "@/lib/logic/locations";
import { deleteItem, setItemLinks } from "@/lib/logic/mutations";
import type { Item } from "@/lib/types";

/** Detailseite: zeigt nur Felder, für die Daten vorhanden sind (PRD 3.4). */
export function ItemDetailView({ id }: { id: string }) {
  const { data, update } = useInventory();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [linkPickerOpen, setLinkPickerOpen] = useState(false);
  const [packingOpen, setPackingOpen] = useState(false);

  const item = data.items.find((current) => current.id === id);

  const linkedItems = useMemo(
    () =>
      item
        ? item.linkedItemIds
            .map((linkedId) =>
              data.items.find((current) => current.id === linkedId),
            )
            .filter((current): current is Item => current !== undefined)
        : [],
    [item, data.items],
  );

  if (!item) {
    return (
      <div className="card px-6 py-14 text-center">
        <p className="text-[15px] text-muted">
          Dieser Gegenstand existiert nicht (mehr).
        </p>
        <Link href="/inventory" className={buttonClass("secondary", "md", "mt-5")}>
          Zum Inventar
        </Link>
      </div>
    );
  }

  const location = itemFullLocation(data, item);
  const price = formatPrice(item.purchasePrice, data.settings.currencyLabel);
  const retired = item.status === "retired";
  const overdue = hasOverdueMaintenance(item);

  const basics = [
    { label: "Marke / Hersteller", value: item.brand },
    { label: "Standort", value: location },
    { label: "Kaufdatum", value: formatDate(item.purchaseDate) },
    { label: "Kaufpreis", value: price },
  ].filter((row) => Boolean(row.value));

  const categoryRows = filledCategoryFields(item).map(({ field, value }) => ({
    label: field.label,
    value: field.type === "date" ? formatDate(value) : value,
  }));

  const statusRows = filledStatusFields(item).map(({ field, value }) => ({
    label: field.label,
    value: field.type === "date" ? formatDate(value) : value,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted hover:text-ink"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Zum Inventar
        </Link>

        <div className="flex flex-wrap gap-2">
          {data.packingLists.length > 0 && !retired && (
            <Button variant="secondary" onClick={() => setPackingOpen(true)}>
              Zu Packliste hinzufügen
            </Button>
          )}
          <Link
            href={`/items/${item.id}/edit`}
            className={buttonClass("primary")}
          >
            Bearbeiten
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
        <ItemImage
          item={item}
          rounded="rounded-3xl"
          className="aspect-square w-full"
          textClassName="text-5xl"
        />

        <div className="space-y-5">
          <div className="space-y-2">
            {item.category && (
              <p className="muted-label">{categoryLabel(item.category)}</p>
            )}
            <h1 className="page-title">{item.name}</h1>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <ConditionBadge condition={item.condition} />
              <StatusBadge status={item.status} />
            </div>
          </div>

          {overdue && !retired && (
            <p className="flex items-start gap-2 rounded-2xl border border-notice/30 bg-notice-soft px-4 py-3 text-[14px] text-notice">
              <AlertIcon className="mt-0.5 h-5 w-5 shrink-0" />
              Die nächste Wartung war am{" "}
              {formatDate(item.categoryData.nextMaintenance)} fällig.
            </p>
          )}

          {basics.length > 0 && <DetailRows rows={basics} />}

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setLinkPickerOpen(true)}>
              Gegenstand verknüpfen
            </Button>
            <Link
              href={`/items/new?from=${item.id}`}
              className={buttonClass("secondary")}
            >
              Duplizieren
            </Link>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Löschen
            </Button>
          </div>
        </div>
      </div>

      {categoryRows.length > 0 && (
        <Section title={categoryLabel(item.category) ?? "Details"}>
          <DetailRows rows={categoryRows} />
        </Section>
      )}

      {statusRows.length > 0 && (
        <Section title="Statusinformationen">
          <DetailRows rows={statusRows} />
        </Section>
      )}

      {linkedItems.length > 0 && (
        <Section title="Verknüpfte Gegenstände">
          <ul className="card divide-y divide-line overflow-hidden">
            {linkedItems.map((linked) => (
              <li key={linked.id}>
                <Link
                  href={`/items/${linked.id}`}
                  className="row-link flex items-center gap-4 px-4 py-3"
                >
                  <ItemImage
                    item={linked}
                    className="h-12 w-12 shrink-0"
                    textClassName="text-sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-ink">
                      {linked.name}
                    </span>
                    <span className="block truncate text-[13px] text-muted">
                      {categoryLabel(linked.category)}
                    </span>
                  </span>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-line-strong" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {item.documents.length > 0 && (
        <Section title="Dokumente">
          <ul className="card divide-y divide-line overflow-hidden">
            {item.documents.map((document) => (
              <li
                key={document.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <DocumentIcon className="h-5 w-5 shrink-0 text-muted" />
                <span className="min-w-0 flex-1 truncate text-[14px] text-ink">
                  {document.name}
                </span>
                <span className="shrink-0 text-[13px] text-muted">
                  {formatFileSize(document.size)}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {item.notes && (
        <Section title="Notizen">
          <p className="card px-5 py-4 text-[15px] leading-relaxed whitespace-pre-line text-ink-soft">
            {item.notes}
          </p>
        </Section>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title={`«${item.name}» löschen?`}
        description="Der Gegenstand wird aus allen Packlisten entfernt und alle Verknüpfungen werden aufgehoben."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          update((current) => deleteItem(current, item.id));
          router.push("/inventory");
        }}
      />

      {linkPickerOpen && (
        <ItemPickerModal
          open
          title="Gegenstände verknüpfen"
          description="Die Verknüpfung ist auf beiden Gegenständen sichtbar."
          candidates={data.items.filter((current) => current.id !== item.id)}
          initialSelection={item.linkedItemIds}
          onConfirm={(ids) => {
            update((current) => setItemLinks(current, item.id, ids));
            setLinkPickerOpen(false);
          }}
          onClose={() => setLinkPickerOpen(false)}
        />
      )}

      <PackingListToggleModal
        item={item}
        open={packingOpen}
        onClose={() => setPackingOpen(false)}
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}

function DetailRows({
  rows,
}: {
  rows: { label: string; value?: string }[];
}) {
  return (
    <dl className="card divide-y divide-line overflow-hidden">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3"
        >
          <dt className="w-full text-[13px] font-medium text-muted sm:w-48">
            {row.label}
          </dt>
          <dd className="text-[15px] text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

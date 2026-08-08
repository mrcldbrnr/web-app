"use client";

import Link from "next/link";
import { ItemImage } from "@/components/items/ItemImage";
import { Badge, ConditionBadge, StatusBadge } from "@/components/ui/Badge";
import { categoryLabel } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { itemPrimaryLocation } from "@/lib/logic/locations";
import type { Item, PrimaryLocation, SecondaryLocation } from "@/lib/types";

/**
 * Kompakte Listenzeile mit ausschliesslich allgemeinen Feldern. Nicht
 * vorhandene Werte werden weggelassen (PRD 3.2).
 */
export function ItemListRow({
  item,
  locations,
  currencyLabel,
  retired = false,
}: {
  item: Item;
  locations: {
    primaryLocations: PrimaryLocation[];
    secondaryLocations: SecondaryLocation[];
  };
  currencyLabel: string;
  retired?: boolean;
}) {
  const meta = [categoryLabel(item.category), itemPrimaryLocation(locations, item)]
    .filter(Boolean)
    .join(" · ");
  const price = formatPrice(item.purchasePrice, currencyLabel);

  return (
    <Link
      href={`/items/${item.id}`}
      className="row-link flex items-center gap-4 px-4 py-3.5 sm:px-5"
    >
      <ItemImage
        item={item}
        className="h-14 w-14 shrink-0 sm:h-16 sm:w-16"
        textClassName="text-base"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink sm:text-[16px]">
          {item.name}
        </p>
        {meta && (
          <p className="mt-0.5 truncate text-[13px] text-muted">{meta}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:hidden">
          {retired && <Badge tone="solid">Aussortiert</Badge>}
          <ConditionBadge condition={item.condition} />
          {!retired && <StatusBadge status={item.status} />}
          {price && (
            <span className="text-[13px] font-semibold text-ink tabular-nums">
              {price}
            </span>
          )}
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        {retired && <Badge tone="solid">Aussortiert</Badge>}
        <ConditionBadge condition={item.condition} />
        {!retired && <StatusBadge status={item.status} />}
      </div>

      {price && (
        <span className="hidden w-32 shrink-0 text-right text-[15px] font-semibold text-ink tabular-nums sm:block">
          {price}
        </span>
      )}
    </Link>
  );
}

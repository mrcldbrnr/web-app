import { cn } from "@/lib/cn";
import type { Item } from "@/lib/types";

/** Initialen als ruhiger Platzhalter, solange kein Foto hinterlegt ist. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

export function ItemImage({
  item,
  className,
  rounded = "rounded-2xl",
  textClassName = "text-base",
}: {
  item: Pick<Item, "name" | "image">;
  className?: string;
  rounded?: string;
  textClassName?: string;
}) {
  if (item.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Bilder liegen als lokale Data-URL vor.
      <img
        src={item.image}
        alt={item.name}
        className={cn("object-cover", rounded, className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center border border-line bg-surface-soft",
        rounded,
        className,
      )}
    >
      <span
        className={cn(
          "font-bold tracking-tight text-line-strong select-none",
          textClassName,
        )}
      >
        {initials(item.name)}
      </span>
    </div>
  );
}

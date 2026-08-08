"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { CloseIcon, DocumentIcon } from "@/components/ui/Icons";
import { formatFileSize } from "@/lib/format";
import { createId } from "@/lib/id";
import type { DocumentMeta } from "@/lib/types";

/**
 * Dokumente werden im Prototyp als Metadaten erfasst (Dateiname, Typ, Grösse);
 * die Dateinamen sind über die Suche auffindbar (PRD 3.1 / 7).
 */
export function DocumentsField({
  value,
  onChange,
}: {
  value: DocumentMeta[];
  onChange: (value: DocumentMeta[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const additions: DocumentMeta[] = Array.from(files).map((file) => ({
      id: createId("doc"),
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      addedAt: new Date().toISOString(),
    }));
    onChange([...value, ...additions]);
  };

  return (
    <div className="space-y-2">
      <p className="field-label">Dokumente</p>

      {value.length > 0 && (
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {value.map((document) => (
            <li
              key={document.id}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <DocumentIcon className="h-5 w-5 shrink-0 text-muted" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] text-ink">
                  {document.name}
                </span>
                <span className="block text-[12px] text-muted">
                  {formatFileSize(document.size)}
                </span>
              </span>
              <button
                type="button"
                aria-label={`${document.name} entfernen`}
                onClick={() =>
                  onChange(value.filter((current) => current.id !== document.id))
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-soft hover:text-ink"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        Dokument hinzufügen
      </Button>
      <p className="text-[13px] text-muted">
        JPG, PNG, WebP oder PDF. Im Prototyp werden Dateiname, Typ und Grösse
        gespeichert.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

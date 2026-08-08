"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PhotoIcon } from "@/components/ui/Icons";

const MAX_EDGE = 1200;

/** Verkleinert das Bild vor dem Speichern, damit es lokal ablegbar bleibt. */
async function toResizedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Bild konnte nicht gelesen werden"));
    element.src = dataUrl;
  });

  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  if (scale === 1 && dataUrl.length < 400_000) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function PhotoField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      onChange(await toResizedDataUrl(file));
    } catch {
      setError("Das Bild konnte nicht verarbeitet werden.");
    }
  };

  return (
    <div className="space-y-2">
      <p className="field-label">Foto</p>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface-soft">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- lokale Data-URL
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <PhotoIcon className="h-7 w-7 text-line-strong" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            {value ? "Foto ersetzen" : "Foto wählen"}
          </Button>
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange(undefined)}>
              Entfernen
            </Button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-[13px] text-alert">{error}</p>}
    </div>
  );
}

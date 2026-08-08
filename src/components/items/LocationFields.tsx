"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, SelectInput, TextInput } from "@/components/ui/Field";
import { secondariesOf } from "@/lib/logic/locations";
import type { PrimaryLocation, SecondaryLocation } from "@/lib/types";

const NEW_VALUE = "__new__";

/**
 * Zweistufiger Standort. Neue Standorte werden hier nur lokal im Formular
 * gehalten und erst mit dem Gegenstand gespeichert (PRD 3.3).
 */
export function LocationFields({
  primaryLocations,
  secondaryLocations,
  primaryId,
  secondaryId,
  onChange,
  onCreatePrimary,
  onCreateSecondary,
}: {
  primaryLocations: PrimaryLocation[];
  secondaryLocations: SecondaryLocation[];
  primaryId?: string;
  secondaryId?: string;
  onChange: (value: {
    primaryId?: string;
    secondaryId?: string;
  }) => void;
  onCreatePrimary: (name: string) => PrimaryLocation;
  onCreateSecondary: (primaryId: string, name: string) => SecondaryLocation;
}) {
  const [newPrimary, setNewPrimary] = useState<string | null>(null);
  const [newSecondary, setNewSecondary] = useState<string | null>(null);

  const secondaries = secondariesOf(
    { primaryLocations, secondaryLocations },
    primaryId,
  );

  const confirmPrimary = () => {
    const name = newPrimary?.trim();
    if (!name) return;
    const location = onCreatePrimary(name);
    onChange({ primaryId: location.id, secondaryId: undefined });
    setNewPrimary(null);
  };

  const confirmSecondary = () => {
    const name = newSecondary?.trim();
    if (!name || !primaryId) return;
    const location = onCreateSecondary(primaryId, name);
    onChange({ primaryId, secondaryId: location.id });
    setNewSecondary(null);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Field label="Standort">
          {(id) => (
            <SelectInput
              id={id}
              value={primaryId ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                if (value === NEW_VALUE) {
                  setNewPrimary("");
                  return;
                }
                setNewPrimary(null);
                onChange({
                  primaryId: value || undefined,
                  secondaryId: undefined,
                });
              }}
            >
              <option value="">Kein Standort</option>
              {primaryLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
              <option value={NEW_VALUE}>+ neuer Standort erfassen</option>
            </SelectInput>
          )}
        </Field>

        {newPrimary !== null && (
          <div className="flex gap-2">
            <TextInput
              autoFocus
              value={newPrimary}
              placeholder="Name des Standorts"
              aria-label="Name des neuen Standorts"
              onChange={(event) => setNewPrimary(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  confirmPrimary();
                }
              }}
            />
            <Button size="sm" onClick={confirmPrimary}>
              Übernehmen
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewPrimary(null)}
            >
              Abbrechen
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Field
          label="Unterstandort"
          hint={!primaryId ? "Zuerst einen Standort wählen." : undefined}
        >
          {(id) => (
            <SelectInput
              id={id}
              value={secondaryId ?? ""}
              disabled={!primaryId}
              onChange={(event) => {
                const value = event.target.value;
                if (value === NEW_VALUE) {
                  setNewSecondary("");
                  return;
                }
                setNewSecondary(null);
                onChange({ primaryId, secondaryId: value || undefined });
              }}
            >
              <option value="">Kein Unterstandort</option>
              {secondaries.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
              {primaryId && (
                <option value={NEW_VALUE}>+ neuer Standort erfassen</option>
              )}
            </SelectInput>
          )}
        </Field>

        {newSecondary !== null && (
          <div className="flex gap-2">
            <TextInput
              autoFocus
              value={newSecondary}
              placeholder="Name des Unterstandorts"
              aria-label="Name des neuen Unterstandorts"
              onChange={(event) => setNewSecondary(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  confirmSecondary();
                }
              }}
            />
            <Button size="sm" onClick={confirmSecondary}>
              Übernehmen
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewSecondary(null)}
            >
              Abbrechen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

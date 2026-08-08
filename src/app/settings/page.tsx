"use client";

import { useState } from "react";
import { LocationManager } from "@/components/settings/LocationManager";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field, TextInput } from "@/components/ui/Field";
import { useInventory } from "@/lib/data/InventoryProvider";
import { updateSettings } from "@/lib/logic/mutations";

/** Einstellungen: Standortverwaltung und Währungs-Label (PRD 3.6). */
export default function SettingsPage() {
  const { data, update, resetToSeedData } = useInventory();
  const [currency, setCurrency] = useState(data.settings.currencyLabel);
  const [confirmCurrency, setConfirmCurrency] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  const trimmed = currency.trim();
  const changed = trimmed !== data.settings.currencyLabel && trimmed !== "";

  const applyCurrency = () => {
    update((current) => updateSettings(current, { currencyLabel: trimmed }));
    setConfirmCurrency(false);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <h1 className="page-title">Einstellungen</h1>

      <LocationManager />

      <section className="space-y-4">
        <h2 className="section-title">Währung</h2>
        <div className="card space-y-4 p-5 sm:p-6">
          <Field
            label="Label für Kaufpreise"
            hint="Reines Anzeige-Label, z. B. CHF, EUR oder USD."
          >
            {(id) => (
              <TextInput
                id={id}
                value={currency}
                maxLength={8}
                className="max-w-40"
                onChange={(event) => {
                  setCurrency(event.target.value);
                  setSaved(false);
                }}
              />
            )}
          </Field>

          <p className="text-[14px] text-muted">
            Bestehende Kaufpreise werden nicht umgerechnet – es ändert sich nur
            die Beschriftung.
          </p>

          <div className="flex items-center gap-3">
            <Button disabled={!changed} onClick={() => setConfirmCurrency(true)}>
              Label speichern
            </Button>
            {saved && !changed && (
              <span className="text-[14px] text-muted">Gespeichert.</span>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">Demodaten</h2>
        <div className="card space-y-4 p-5 sm:p-6">
          <p className="text-[14px] text-muted">
            Setzt das Inventar auf die mitgelieferten Beispieldaten zurück.
            Eigene Änderungen gehen dabei verloren.
          </p>
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            Demodaten zurücksetzen
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={confirmCurrency}
        title="Währungs-Label ändern?"
        description={`Alle Kaufpreise werden künftig mit «${trimmed}» beschriftet. Die erfassten Zahlenwerte bleiben unverändert, es findet keine Umrechnung statt.`}
        confirmLabel="Label ändern"
        destructive={false}
        onCancel={() => setConfirmCurrency(false)}
        onConfirm={applyCurrency}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Demodaten zurücksetzen?"
        description="Alle erfassten Gegenstände, Standorte und Packlisten werden durch die Beispieldaten ersetzt."
        confirmLabel="Zurücksetzen"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetToSeedData();
          setConfirmReset(false);
        }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button, IconButton } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TextInput } from "@/components/ui/Field";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import { useInventory } from "@/lib/data/InventoryProvider";
import {
  addPrimaryLocation,
  addSecondaryLocation,
  deletePrimaryLocation,
  deleteSecondaryLocation,
  renamePrimaryLocation,
  renameSecondaryLocation,
} from "@/lib/logic/mutations";
import {
  countItemsInPrimary,
  countItemsInSecondary,
  secondariesOf,
} from "@/lib/logic/locations";

type PendingDelete =
  | { kind: "primary"; id: string; name: string; affected: number; subs: number }
  | { kind: "secondary"; id: string; name: string; affected: number };

/** Standorte umbenennen und löschen (PRD 3.6). */
export function LocationManager() {
  const { data, update } = useInventory();
  const [editing, setEditing] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [addingPrimary, setAddingPrimary] = useState(false);
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const startEdit = (id: string, name: string) => {
    setEditing(id);
    setDraftName(name);
  };

  const saveEdit = (kind: "primary" | "secondary", id: string) => {
    const name = draftName.trim();
    if (name) {
      update((current) =>
        kind === "primary"
          ? renamePrimaryLocation(current, id, name)
          : renameSecondaryLocation(current, id, name),
      );
    }
    setEditing(null);
  };

  const confirmAdd = () => {
    const name = newName.trim();
    if (name) {
      update((current) =>
        addingSubFor
          ? addSecondaryLocation(current, addingSubFor, name).data
          : addPrimaryLocation(current, name).data,
      );
    }
    setNewName("");
    setAddingPrimary(false);
    setAddingSubFor(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">Standorte</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setAddingPrimary(true);
            setAddingSubFor(null);
            setNewName("");
          }}
        >
          <PlusIcon className="h-4 w-4" />
          Standort hinzufügen
        </Button>
      </div>

      {addingPrimary && (
        <div className="card flex flex-wrap gap-2 p-4">
          <TextInput
            autoFocus
            value={newName}
            placeholder="Name des Standorts"
            aria-label="Name des neuen Standorts"
            className="min-w-48 flex-1"
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") confirmAdd();
            }}
          />
          <Button size="sm" onClick={confirmAdd}>
            Speichern
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAddingPrimary(false)}
          >
            Abbrechen
          </Button>
        </div>
      )}

      {data.primaryLocations.length === 0 ? (
        <p className="card px-5 py-10 text-center text-[15px] text-muted">
          Noch keine Standorte erfasst.
        </p>
      ) : (
        <ul className="space-y-3">
          {data.primaryLocations.map((primary) => {
            const subs = secondariesOf(data, primary.id);
            const affected = countItemsInPrimary(data.items, primary.id);

            return (
              <li key={primary.id} className="card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 sm:px-5">
                  {editing === primary.id ? (
                    <>
                      <TextInput
                        autoFocus
                        value={draftName}
                        aria-label="Standort umbenennen"
                        className="flex-1"
                        onChange={(event) => setDraftName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter")
                            saveEdit("primary", primary.id);
                          if (event.key === "Escape") setEditing(null);
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => saveEdit("primary", primary.id)}
                      >
                        Speichern
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(null)}
                      >
                        Abbrechen
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] font-bold text-ink">
                          {primary.name}
                        </span>
                        <span className="text-[13px] text-muted">
                          {affected}{" "}
                          {affected === 1 ? "Gegenstand" : "Gegenstände"}
                        </span>
                      </span>
                      <IconButton
                        label={`${primary.name} umbenennen`}
                        onClick={() => startEdit(primary.id, primary.name)}
                      >
                        <EditIcon className="h-5 w-5" />
                      </IconButton>
                      <IconButton
                        label={`${primary.name} löschen`}
                        className="hover:text-alert"
                        onClick={() =>
                          setPendingDelete({
                            kind: "primary",
                            id: primary.id,
                            name: primary.name,
                            affected,
                            subs: subs.length,
                          })
                        }
                      >
                        <TrashIcon className="h-5 w-5" />
                      </IconButton>
                    </>
                  )}
                </div>

                <ul className="divide-y divide-line border-t border-line bg-[#f2f2ff]">
                  {subs.map((sub) => {
                    const subAffected = countItemsInSecondary(
                      data.items,
                      sub.id,
                    );
                    return (
                      <li
                        key={sub.id}
                        className="flex items-center gap-2 py-2.5 pr-4 pl-8 sm:pr-5 sm:pl-10"
                      >
                        {editing === sub.id ? (
                          <>
                            <TextInput
                              autoFocus
                              value={draftName}
                              aria-label="Unterstandort umbenennen"
                              className="flex-1"
                              onChange={(event) =>
                                setDraftName(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter")
                                  saveEdit("secondary", sub.id);
                                if (event.key === "Escape") setEditing(null);
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => saveEdit("secondary", sub.id)}
                            >
                              Speichern
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditing(null)}
                            >
                              Abbrechen
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="min-w-0 flex-1 truncate text-[15px] text-ink">
                              {sub.name}
                              <span className="ml-2 text-[13px] text-muted">
                                {subAffected}
                              </span>
                            </span>
                            <IconButton
                              label={`${sub.name} umbenennen`}
                              onClick={() => startEdit(sub.id, sub.name)}
                            >
                              <EditIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton
                              label={`${sub.name} löschen`}
                              className="hover:text-alert"
                              onClick={() =>
                                setPendingDelete({
                                  kind: "secondary",
                                  id: sub.id,
                                  name: sub.name,
                                  affected: subAffected,
                                })
                              }
                            >
                              <TrashIcon className="h-5 w-5" />
                            </IconButton>
                          </>
                        )}
                      </li>
                    );
                  })}

                  <li className="py-2.5 pr-4 pl-8 sm:pr-5 sm:pl-10">
                    {addingSubFor === primary.id ? (
                      <div className="flex flex-wrap gap-2">
                        <TextInput
                          autoFocus
                          value={newName}
                          placeholder="Name des Unterstandorts"
                          aria-label="Name des neuen Unterstandorts"
                          className="min-w-40 flex-1"
                          onChange={(event) => setNewName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") confirmAdd();
                          }}
                        />
                        <Button size="sm" onClick={confirmAdd}>
                          Speichern
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAddingSubFor(null)}
                        >
                          Abbrechen
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingSubFor(primary.id);
                          setAddingPrimary(false);
                          setNewName("");
                        }}
                        className="text-[14px] font-semibold text-muted hover:text-ink"
                      >
                        + Unterstandort hinzufügen
                      </button>
                    )}
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`«${pendingDelete?.name}» löschen?`}
        description={deleteDescription(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          update((current) =>
            pendingDelete.kind === "primary"
              ? deletePrimaryLocation(current, pendingDelete.id)
              : deleteSecondaryLocation(current, pendingDelete.id),
          );
          setPendingDelete(null);
        }}
      />
    </section>
  );
}

function deleteDescription(pending: PendingDelete | null): string {
  if (!pending) return "";
  const items =
    pending.affected === 1
      ? "1 Gegenstand ist betroffen"
      : `${pending.affected} Gegenstände sind betroffen`;

  if (pending.kind === "secondary") {
    return `${items}. Der Hauptstandort bleibt bei diesen Gegenständen erhalten.`;
  }

  const subs =
    pending.subs === 1
      ? " Der zugehörige Unterstandort wird ebenfalls gelöscht."
      : pending.subs > 1
        ? ` Die ${pending.subs} zugehörigen Unterstandorte werden ebenfalls gelöscht.`
        : "";

  return `${items}. Bei diesen Gegenständen werden Haupt- und Unterstandort entfernt.${subs} Die Gegenstände selbst bleiben bestehen.`;
}

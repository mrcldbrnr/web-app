"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { localStorageStore } from "@/lib/data/localStorageStore";
import { createSeedData } from "@/lib/data/seed";
import type { InventoryStore } from "@/lib/data/store";
import type { InventoryData, Item } from "@/lib/types";

interface InventoryContextValue {
  data: InventoryData;
  /** false, solange die Daten aus dem Speicher geladen werden. */
  ready: boolean;
  update: (recipe: (data: InventoryData) => InventoryData) => void;
  resetToSeedData: () => void;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({
  children,
  store = localStorageStore,
}: {
  children: React.ReactNode;
  store?: InventoryStore;
}) {
  const [data, setData] = useState<InventoryData>(createSeedData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void store.load().then((loaded) => {
      if (cancelled) return;
      if (loaded) setData(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  // Jede Änderung wird unmittelbar persistiert.
  useEffect(() => {
    if (!ready) return;
    void store.save(data);
  }, [data, ready, store]);

  const update = useCallback(
    (recipe: (current: InventoryData) => InventoryData) => setData(recipe),
    [],
  );

  const resetToSeedData = useCallback(() => setData(createSeedData()), []);

  const value = useMemo(
    () => ({ data, ready, update, resetToSeedData }),
    [data, ready, update, resetToSeedData],
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextValue {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory muss innerhalb von InventoryProvider stehen");
  }
  return context;
}

/** Kurzform für das Anzeige-Label des Kaufpreises. */
export function useCurrencyLabel(): string {
  return useInventory().data.settings.currencyLabel;
}

export function useItem(id: string): Item | undefined {
  const { data } = useInventory();
  return data.items.find((item) => item.id === id);
}

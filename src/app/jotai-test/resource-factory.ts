// app/(client)/state/resourceFactoryAction.ts
"use client";

import { atom, useAtom, useStore, type PrimitiveAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { useActionState } from "react";
import { useEffect, useMemo } from "react";

type SaveFn<T> = (next: T) => Promise<T>;

type ResourceConfig<T, K extends string | number> = {
  getKey: (entity: T) => K;
  save: SaveFn<T>;
  merge?: (prev: T, patch: Partial<T>) => T;
};

export function createResourceStoreAction<
  T extends object,
  K extends string | number
>(cfg: ResourceConfig<T, K>) {
  const merge = cfg.merge ?? ((p: T, patch: Partial<T>) => ({ ...p, ...patch }));

  // ✅ either let inference do it...
  // const entityAtomFamily = atomFamily((_: K) => atom<T | undefined>(undefined));
  // const errorAtomFamily  = atomFamily((_: K) => atom<string | null>(null));
  // const versionAtomFamily = atomFamily((_: K) => atom(0));

  // ...or spell the Atom types explicitly:
  const entityAtomFamily  = atomFamily<K, PrimitiveAtom<T | undefined>>((_: K) => atom<T | undefined>(undefined));
  const errorAtomFamily   = atomFamily<K, PrimitiveAtom<string | null>>((_: K) => atom<string | null>(null));
  const versionAtomFamily = atomFamily<K, PrimitiveAtom<number>>((_: K) => atom(0));

  function useResource(entity: T) {
    const key = useMemo(() => cfg.getKey(entity), [entity]);
    const store = useStore();

    const entityAtom = entityAtomFamily(key);
    const errorAtom = errorAtomFamily(key);
    const versionAtom = versionAtomFamily(key);

    const [value, setLocal] = useAtom(entityAtom);
    const [error] = useAtom(errorAtom);

    // hydrate once per key
    useEffect(() => {
      store.set(entityAtom, (curr) => curr ?? entity);
      store.set(errorAtom, null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    type AState = { status: "idle" } | { status: "error"; message: string };

    const [aState, formAction, isPending] = useActionState<AState, Partial<T>>(
      async (_prev, patch) => {
        const flight = (store.get(versionAtom) ?? 0) + 1;
        store.set(versionAtom, flight);

        const prev = store.get(entityAtom)!;
        const optimistic = merge(prev, patch);

        store.set(entityAtom, optimistic);
        store.set(errorAtom, null);

        try {
          const confirmed = await cfg.save(optimistic);
          if (store.get(versionAtom) === flight) {
            store.set(entityAtom, confirmed);
          }
          return { status: "idle" };
        } catch (e) {
          const msg = (e as Error)?.message ?? "Save failed";
          if (store.get(versionAtom) === flight) {
            store.set(entityAtom, prev);
            store.set(errorAtom, msg);
          }
          return { status: "error", message: msg };
        }
      },
      { status: "idle" }
    );

    return {
      key,
      value: (value ?? entity) as T,
      setLocal,       // local-only edits
      save: (patch: Partial<T>) => formAction(patch), // persist via Server Action
      isPending,
      error: aState.status === "error" ? aState.message : error,
    };
  }

  return {
    useResource,
    atoms: { entityAtomFamily, errorAtomFamily },
  };
}

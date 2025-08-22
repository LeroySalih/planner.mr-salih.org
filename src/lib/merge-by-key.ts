export function mergeByKey<T, K extends PropertyKey>(
  oldArr: readonly T[],
  updates: readonly T[],
  getKey: (x: T) => K,
  { appendNew = true }: { appendNew?: boolean } = {}
): T[] {
  const updateMap = new Map(updates.map(u => [getKey(u), u]));
  const replaced = oldArr.map(o => updateMap.get(getKey(o)) ?? o);

  if (!appendNew) return replaced;

  const oldKeys = new Set(oldArr.map(getKey));
  const additions = updates.filter(u => !oldKeys.has(getKey(u)));
  return [...replaced, ...additions];
}

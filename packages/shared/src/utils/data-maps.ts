export interface MapOfSets<K, V> {
  map: Map<K, Set<V>>;
  addValue: (key: K, value: V) => void;
  addValues: (key: K, values: V[]) => void;
  getValue: (key: K) => Set<V> | undefined;
  getValueOrDefault: (key: K, defaultValue?: Set<V>) => Set<V>;
  removeValue: (key: K, value: V) => boolean;
  keysArray: () => K[];
  valuesArray: () => Set<V>[];
  normEntries: () => Generator<[K, V[]]>;

  readonly size: number;
  entries: () => IterableIterator<[K, Set<V>]>;
  delete: (key: K) => boolean;
}

export function mapOfSets<K, V>(map = new Map<K, Set<V>>()): MapOfSets<K, V> {
  return {
    map,

    addValue(key: K, value: V) {
      const values = map.get(key) ?? new Set<V>();
      values.add(value);
      map.set(key, values);
    },

    addValues(key: K, values: V[]) {
      const existingValues = map.get(key) ?? new Set<V>();
      values.forEach((value) => existingValues.add(value));
      map.set(key, existingValues);
    },

    removeValue(key: K, value: V) {
      return Boolean(map.get(key)?.delete(value));
    },

    getValue(key: K) {
      return map.get(key);
    },

    getValueOrDefault(key: K, defaultValue = new Set()) {
      return map.get(key) ?? defaultValue;
    },

    keysArray() {
      return Array.from(map.keys());
    },

    valuesArray() {
      return Array.from(map.values());
    },

    *normEntries() {
      for (const [key, values] of map.entries()) {
        yield [key, Array.from(values)];
      }
    },

    delete(key: K) {
      return map.delete(key);
    },

    entries() {
      return map.entries();
    },

    get size() {
      return map.size;
    },
  };
}

import { ensureIsDefined, isDefined } from "./assert";

const dataSymbol = Symbol("path-store-trunk");

export interface TrieMap<K, V> {
  set: (path: K[], value: V) => void;
  has: (path: K[]) => boolean;
  get: (path: K[]) => V | undefined;
  delete: (path: K[]) => boolean;
  clear: () => void;
  hasPrefix: (path: K[]) => boolean;
  entries: () => IterableIterator<[K[], V]>;
  keys: () => IterableIterator<K[]>;
  values: () => IterableIterator<V>;

  setValue: (value: V) => void;
  getValue: () => V | undefined;
  rename: (from: K, to: K) => void;
  renameTail: (path: K[], tail: K) => void;
  getTrieFromPath: (path: K[]) => TrieMap<K, V> | undefined;

  readonly [Symbol.toStringTag]: string;
  [Symbol.iterator]: () => IterableIterator<[K[], V]>;
  readonly size: number;
}

export function trieMap<K, V>(initialRoot?: Map<K[], V>): TrieMap<K, V> {
  type Key = K[] | K | typeof dataSymbol;
  type Value = V | KeyedMap;
  type KeyedMap = Map<Key, Value>;

  const newMap = (): KeyedMap => new Map<Key, Value>();

  const root = initialRoot ?? newMap();
  let size = 0;

  //   for (const [k, v] of initialEntries) {
  //     this.set(k, v);
  //   }

  interface MapStack {
    parent: KeyedMap;
    child: KeyedMap;
    item: K;
  }

  function getNextMap(map: KeyedMap, k: K): KeyedMap | undefined {
    return map.get(k) as KeyedMap | undefined;
  }

  function findMapForPath(path: K[]): {
    map: KeyedMap | undefined;
    stack: MapStack[];
  } {
    const stack: MapStack[] = [];
    let map: KeyedMap | undefined = root;
    for (const item of path) {
      const nextMap = getNextMap(map, item);
      if (nextMap) {
        stack.unshift({ parent: map, child: nextMap, item });
        map = nextMap;
      } else {
        return { map, stack };
      }
    }
    return { map, stack };
  }

  function getTrieFromPath(path: K[]): TrieMap<K, V> | undefined {
    const { map } = findMapForPath(path);
    return map && trieMap(map as Map<K[], V>);
  }

  function setValue(value: V): void {
    root.set(dataSymbol, value);
  }

  function getValue(): V | undefined {
    return get([]);
  }

  function set(path: K[], value: V): void {
    let map = root;
    for (const item of path) {
      let nextMap = map.get(item);
      if (!nextMap) {
        // Create next map if none exists
        nextMap = newMap();
        map.set(item, nextMap);
      }
      map = nextMap as KeyedMap;
    }

    // Reached end of path.  Set the data symbol to the given value, and
    // increment size if nothing was here before.
    if (!map.has(dataSymbol)) size += 1;
    map.set(dataSymbol, value);
  }

  function has(path: K[]): boolean {
    const { map } = findMapForPath(path);
    return isDefined(map) && map.has(dataSymbol);
  }

  function hasPrefix(path: K[]): boolean {
    const { map } = findMapForPath(path);
    return isDefined(map);
  }

  function get(path: K[]): V | undefined {
    const { map } = findMapForPath(path);
    return map?.get(dataSymbol) as V | undefined;
  }

  function renameTail(path: K[], tail: K): void {
    const { map, stack } = findMapForPath(path);

    if (map) {
      const [{ parent, item, child }] = stack;
      parent.delete(item);
      parent.set(tail, child);
    }
  }

  function rename(from: K, to: K): void {
    const value = root.get(from);

    if (value) {
      root.delete(from);
      root.set(to, value);
    }
  }

  function del(path: K[]): boolean {
    let map = root;

    // Maintain a stack of maps we visited, so we can go back and trim empty ones
    // if we delete something.
    const stack: MapStack[] = [];

    for (const item of path) {
      const nextMap = map.get(item);
      if (nextMap) {
        stack.unshift({ parent: map, child: nextMap as KeyedMap, item });
        map = nextMap as KeyedMap;
      } else {
        // Nothing to delete
        return false;
      }
    }

    // Reached end of path.  Delete data, if it exists.
    const hadPreviousValue = map.delete(dataSymbol);

    // If something was deleted, decrement size and go through the stack of
    // visited maps, trimming any that are now empty.
    if (hadPreviousValue) {
      size -= 1;

      for (const { parent, child, item } of stack) {
        if (child.size === 0) {
          parent.delete(item);
        }
      }
    }
    return hadPreviousValue;
  }

  function* entries(): IterableIterator<[K[], V]> {
    const stack: { path: K[]; map: KeyedMap }[] = [{ path: [], map: root }];
    while (stack.length > 0) {
      const { path, map } = ensureIsDefined(stack.pop());
      for (const [key, value] of map.entries()) {
        if (key === dataSymbol) yield [path, value as V];
        else
          stack.push({ path: path.concat([key as K]), map: value as KeyedMap });
      }
    }
  }

  function* keys(): IterableIterator<K[]> {
    for (const [key] of entries()) yield key;
  }

  function* values(): IterableIterator<V> {
    for (const [, value] of entries()) yield value;
  }

  return {
    set,

    has,

    get,

    delete: del,

    clear() {
      root.clear();
      size = 0;
    },

    hasPrefix,

    entries,

    keys,

    values,

    setValue,

    getValue,

    rename,

    renameTail,

    getTrieFromPath,

    get [Symbol.toStringTag]() {
      return "ArrayKeyedMap";
    },

    *[Symbol.iterator]() {
      yield* entries();
    },

    get size() {
      return size;
    },
  };
}

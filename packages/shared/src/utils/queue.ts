export interface Queue<T> {
  enqueue: (...items: T[]) => void;
  dequeue: () => T | undefined;
  size: () => number;
  peek: () => T | undefined;
  dequeueAll: () => Generator<T, void>;
}

export function queue<T>(): Queue<T> {
  const storage = new Map<number, T>();
  let head = 0;
  let tail = 0;

  return {
    enqueue(...items: T[]): void {
      for (const item of items) {
        storage.set(tail, item);
        tail = tail + 1;
      }
    },

    dequeue(): T | undefined {
      const size = tail - head;
      if (size <= 0) return undefined;

      const item = storage.get(head);
      storage.delete(head);
      head = head + 1;

      //Reset the counter
      if (head === tail) {
        head = 0;
        tail = 0;
      }

      return item;
    },

    size(): number {
      return tail - head;
    },

    peek(): T | undefined {
      return storage.get(tail - 1);
    },

    *dequeueAll(): Generator<T> {
      let item = this.dequeue();
      while (item) {
        yield item;
        item = this.dequeue();
      }
    },
  };
}

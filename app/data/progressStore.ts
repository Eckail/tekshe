const PROGRESS_EVENT = "tekshe-progress-updated";

export function createProgressStore<T>(
  readValue: () => T,
  serverValue: T
): {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
} {
  let cachedValue = serverValue;
  let cachedJson = JSON.stringify(serverValue);
  const listeners = new Set<() => void>();

  function refresh(): void {
    let nextValue: T;
    try {
      nextValue = readValue();
    } catch {
      nextValue = serverValue;
    }

    const nextJson = JSON.stringify(nextValue);
    if (nextJson === cachedJson) return;

    cachedValue = nextValue;
    cachedJson = nextJson;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    if (listeners.size === 1 && typeof window !== "undefined") {
      window.addEventListener(PROGRESS_EVENT, refresh);
      window.addEventListener("storage", refresh);
    }

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0 && typeof window !== "undefined") {
        window.removeEventListener(PROGRESS_EVENT, refresh);
        window.removeEventListener("storage", refresh);
      }
    };
  }

  function getSnapshot(): T {
    if (typeof window === "undefined") return serverValue;

    let nextValue: T;
    try {
      nextValue = readValue();
    } catch {
      nextValue = serverValue;
    }

    const nextJson = JSON.stringify(nextValue);
    if (nextJson !== cachedJson) {
      cachedValue = nextValue;
      cachedJson = nextJson;
    }

    return cachedValue;
  }

  return {
    subscribe,
    getSnapshot,
    getServerSnapshot: () => serverValue,
  };
}

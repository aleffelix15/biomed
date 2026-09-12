import React, { createContext, useContext, useState, useEffect } from 'react';

const DataCacheContext = createContext();

const globalCache = new Map();

export function DataCacheProvider({ children }) {
  return (
    <DataCacheContext.Provider value={{}}>
      {children}
    </DataCacheContext.Provider>
  );
}

export function useCachedQuery(key, fetcher, { ttlMs = 60000 } = {}) {
  const [, force] = useState(0);
  const entry = globalCache.get(key);

  useEffect(() => {
    if (!key) return;

    const isStale = !entry || Date.now() - entry.ts > ttlMs;

    if (!entry) {
      // First time: wait
      fetcher().then(data => {
        globalCache.set(key, { data, ts: Date.now() });
        force(x => x + 1);
      }).catch(err => console.error("Cache fetch error", err));
    } else if (isStale) {
      // Background revalidate
      fetcher().then(data => {
        globalCache.set(key, { data, ts: Date.now() });
        force(x => x + 1);
      }).catch(err => console.error("Cache background fetch error", err));
    }
  }, [key]);

  return { data: entry?.data ?? null, loading: !entry };
}

export function invalidateCache(keyOrPrefix) {
  for (const k of globalCache.keys()) {
    if (k.startsWith(keyOrPrefix)) {
      globalCache.delete(k);
    }
  }
}

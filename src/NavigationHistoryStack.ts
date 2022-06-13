// eslint-disable-next-line
import Navigation from './Navigation'
// eslint-disable-next-line
import NavigationHistoryEntry from './NavigationHistoryEntry'

interface NavigationHistoryEntryCache {
  id: string
  index: number
  url: string | URL | null | undefined
}

function cacheToNavigationHistoryEntry(
  cache: NavigationHistoryEntryCache
): NavigationHistoryEntry {
  return new NavigationHistoryEntry(cache.index, cache.url, cache.id)
}

function navigationHistoryEntryToCache(
  entry: NavigationHistoryEntry
): NavigationHistoryEntryCache {
  return {
    id: entry.id,
    index: entry.index,
    url: entry.url,
  }
}

// eslint-disable-next-line
export default class NavigationHistoryStack {
  navigation: Navigation

  private stack: NavigationHistoryEntry[]

  constructor(navigation: Navigation) {
    this.navigation = navigation
    let stack: NavigationHistoryEntry[] = []
    try {
      const entryCaches: NavigationHistoryEntryCache[] = JSON.parse(
        sessionStorage.getItem(this.getCacheKey()) || '[]'
      )
      stack = entryCaches.map((entryCache) => {
        return cacheToNavigationHistoryEntry(entryCache)
      })
    } catch (error) {
      stack = []
    }
    this.stack = stack
  }

  private getCacheKey() {
    return `navigation-history-stack-${this.navigation.id}`
  }

  entries(): NavigationHistoryEntry[] {
    return this.stack
  }

  push(entry: NavigationHistoryEntry) {
    try {
      this.stack = this.stack.slice(0, entry.index)
      this.stack.push(entry)
      sessionStorage.setItem(
        this.getCacheKey(),
        JSON.stringify(
          this.stack.map((item) => navigationHistoryEntryToCache(item))
        )
      )
    } catch (error) {
      // TODO: overflow
    }
  }

  replace(entry: NavigationHistoryEntry) {
    this.stack.splice(entry.index, 1, entry)
    try {
      sessionStorage.setItem(
        this.getCacheKey(),
        JSON.stringify(
          this.stack.map((item) => navigationHistoryEntryToCache(item))
        )
      )
    } catch (error) {
      // TODO: overflow
    }
  }
}

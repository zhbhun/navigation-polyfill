import { NAVIGATION_HISTORY_STACK_CACHE_KEY } from './constants'
import Navigation from './Navigation'
import type { NavigationHistoryEntryJSON } from './NavigationHistoryEntry'
import NavigationHistoryEntry from './NavigationHistoryEntry'

export function getNavigationHistoryStackCacheKey(navigation: Navigation) {
  return `${NAVIGATION_HISTORY_STACK_CACHE_KEY}_${navigation.key}`
}

export default class NavigationHistoryStack {
  navigation: Navigation

  private stack: NavigationHistoryEntry[]

  constructor(navigation: Navigation) {
    this.navigation = navigation
    let stack: NavigationHistoryEntry[] = []
    try {
      stack = (
        JSON.parse(
          sessionStorage.getItem(
            getNavigationHistoryStackCacheKey(navigation)
          ) || '[]'
        ) as NavigationHistoryEntryJSON[]
      ).map((entryCache: NavigationHistoryEntryJSON, index) => {
        return new NavigationHistoryEntry(
          entryCache.index,
          entryCache.url,
          entryCache.key,
          entryCache.id
        )
      })
    } catch (error) {
      stack = []
    }
    this.stack = stack
  }

  entries(): NavigationHistoryEntry[] {
    return this.stack
  }

  push(entry: NavigationHistoryEntry) {
    try {
      this.stack = this.stack.slice(0, entry.index)
      this.stack.push(entry)
      sessionStorage.setItem(
        getNavigationHistoryStackCacheKey(this.navigation),
        JSON.stringify(this.stack)
      )
    } catch (error) {
      // TODO: overflow
    }
  }

  replace(entry: NavigationHistoryEntry) {
    this.stack.splice(entry.index, 1, entry)
    try {
      sessionStorage.setItem(
        getNavigationHistoryStackCacheKey(this.navigation),
        JSON.stringify(this.stack)
      )
    } catch (error) {
      // TODO: overflow
    }
  }
}

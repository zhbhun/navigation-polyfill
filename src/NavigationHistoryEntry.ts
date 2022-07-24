import { NAVIGATION_HISTORY_ENTRY_STATE_CACHE_KEY } from './constants'
import { createKey } from './utils'

export interface NavigationHistoryEntryJSON {
  key: string
  id: string
  index: number
  url: string | URL | null | undefined
}

export function getNavigationHitoryEntryStateCacheKey(key: string) {
  return `${NAVIGATION_HISTORY_ENTRY_STATE_CACHE_KEY}_${key}`
}

export function getNavigationHistoryEntryState(key: string): any {
  const stateCacheKey = getNavigationHitoryEntryStateCacheKey(key)
  const stateCache = sessionStorage.getItem(stateCacheKey)
  if (stateCache) {
    try {
      return JSON.parse(stateCache)
    } catch (error) {
      // ignore
    }
  }
  return undefined
}

export function setNavigationHistoryEntryState(key: string, state: any) {
  const stateCacheKey = getNavigationHitoryEntryStateCacheKey(key)
  if (state === null || state === undefined) {
    sessionStorage.removeItem(stateCacheKey)
  } else {
    const stateCache = JSON.stringify(state)
    sessionStorage.setItem(stateCacheKey, stateCache)
  }
}

export default class NavigationHistoryEntry {
  public readonly key: string
  public readonly id: string
  public readonly index: number
  public readonly url: string | URL | null | undefined

  constructor(
    index: number,
    url?: string | URL | null | undefined,
    key?: string,
    id?: string
  ) {
    this.index = index
    this.url = url
    this.key = key ?? createKey()
    this.id = id ?? createKey()
  }

  toJSON(): NavigationHistoryEntryJSON {
    return {
      index: this.index,
      url: this.url,
      key: this.key,
      id: this.id,
    }
  }

  getState(): any {
    return getNavigationHistoryEntryState(this.key)
  }
}

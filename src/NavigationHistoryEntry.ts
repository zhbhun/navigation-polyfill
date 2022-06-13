import {
  NAVIGATION_STATE_KEY,
  NAVIGATION_HISTORY_ENTRY_STATE_KEY,
} from './constants'
import { createKey } from './utils'
// eslint-disable-next-line
import Navigation from './Navigation'
// eslint-disable-next-line
import NavigationHistoryStack from './NavigationHistoryStack'

export interface NavigationHistoryEntryState {
  id: string
  index: number
}

export interface NavigationDestination {
  id: string
  index: number
  url: string | URL | null | undefined
}

export function createNavigationHistoryState(
  state: any,
  navigation: Navigation,
  entry: NavigationHistoryEntry
) {
  return Object.assign({}, state, {
    [NAVIGATION_STATE_KEY]: navigation.id,
    [NAVIGATION_HISTORY_ENTRY_STATE_KEY]: entry.getState(),
  })
}

export function getNavigationHistryEntryIndex(state: any): number {
  const entryState: NavigationHistoryEntryState | undefined =
    state?.[NAVIGATION_HISTORY_ENTRY_STATE_KEY]
  return entryState?.index ?? -1
}

export function getCurrentNavigationHistryEntryIndex(): number {
  return getNavigationHistryEntryIndex(history.state)
}

export default class NavigationHistoryEntry {
  id: string
  index: number
  url: string | URL | null | undefined

  constructor(
    index: number,
    url?: string | URL | null | undefined,
    id?: string
  ) {
    this.index = index
    this.url = url
    this.id = id ?? createKey()
  }

  getState(): NavigationHistoryEntryState {
    return {
      id: this.id,
      index: this.index,
    }
  }
}

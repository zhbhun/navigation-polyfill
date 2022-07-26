import NavigateEvent from './NavigateEvent'
import NavigationHistoryEntry, {
  setNavigationHistoryEntryState,
} from './NavigationHistoryEntry'
import NavigationHistoryStack from './NavigationHistoryStack'
import {
  NAVIGATION_STATE_KEY,
  NAVIGATION_HISTORY_ENTRY_STATE_KEY,
} from './constants'
import { createKey } from './utils'

const nativePushState = History.prototype.pushState
const nativeReplaceState = History.prototype.replaceState

export interface NavigationUpdateCurrentEntryOptions {
  state: any
}

function createNavigationHistoryState(
  state: any,
  navigation: Navigation,
  entry: NavigationHistoryEntry
) {
  return Object.assign({}, state, {
    [NAVIGATION_STATE_KEY]: navigation.key,
    [NAVIGATION_HISTORY_ENTRY_STATE_KEY]: entry.key,
  })
}

function getNavigationCurrentEntryKey() {
  return history.state?.[NAVIGATION_HISTORY_ENTRY_STATE_KEY]
}

function getNavigationEntry(
  entries: NavigationHistoryEntry[],
  entryKey = getNavigationCurrentEntryKey()
) {
  let matchedEntry: NavigationHistoryEntry = entries[entries.length - 1]
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index]
    if (entry.key === entryKey) {
      matchedEntry = entry
    }
  }
  return matchedEntry
}

class Navigation extends EventTarget {
  public key: string
  public currentEntry: NavigationHistoryEntry
  private entryStack: NavigationHistoryStack

  constructor() {
    super()

    const cacheKey = history.state?.[NAVIGATION_STATE_KEY]
    const key: string = cacheKey ?? createKey()
    const shouldInit = cacheKey !== key

    this.key = key
    this.entryStack = new NavigationHistoryStack(this)

    // init
    if (shouldInit) {
      const entry = new NavigationHistoryEntry(
        0,
        location.pathname + location.search + location.hash
      )
      nativeReplaceState.call(
        history,
        createNavigationHistoryState(history.state, this, entry),
        '',
        location.pathname + location.search + location.hash
      )
      this.entryStack.push(entry)
    }

    // currentEntry
    this.currentEntry = getNavigationEntry(this.entryStack.entries())

    const that = this

    // rewrite
    History.prototype.pushState = function (
      data: any,
      unused: string,
      url?: string | URL | null | undefined
    ) {
      const entry = new NavigationHistoryEntry(that.currentEntry.index + 1, url)
      const navigateEvent = new NavigateEvent('navigate', {
        navigationType: 'push',
        destination: entry,
      })
      that.dispatchEvent(navigateEvent)
      if (!navigateEvent.defaultPrevented) {
        const state = createNavigationHistoryState(data, that, entry)
        nativePushState.call(this, state, unused, url)
        that.entryStack.push(entry)
        that.currentEntry = entry
      }
    }
    History.prototype.replaceState = function (
      data: any,
      unused: string,
      url?: string | URL | null | undefined
    ) {
      const entry = new NavigationHistoryEntry(
        that.currentEntry.index,
        url,
        navigation.currentEntry.key
      )
      const navigateEvent = new NavigateEvent('navigate', {
        navigationType: 'replace',
        destination: entry,
      })
      that.dispatchEvent(navigateEvent)
      if (!navigateEvent.defaultPrevented) {
        const state = createNavigationHistoryState(data, that, entry)
        nativeReplaceState.call(this, state, unused, url)
        that.entryStack.replace(entry)
        that.currentEntry = entry
      }
    }
    window.addEventListener('popstate', function (event: PopStateEvent) {
      const entryKey = event.state[NAVIGATION_HISTORY_ENTRY_STATE_KEY]
      const entry = getNavigationEntry(that.entries(), entryKey)
      that.currentEntry = entry
      const navigateEvent = new NavigateEvent('navigate', {
        navigationType: 'traverse',
        destination: entry,
        cancelable: false,
      })
      that.dispatchEvent(navigateEvent)
    })
  }

  updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions) {
    setNavigationHistoryEntryState(this.currentEntry.key, options.state)
  }

  entries(): NavigationHistoryEntry[] {
    return this.entryStack.entries()
  }
}

const navigation = new Navigation()

export { navigation }

export default Navigation

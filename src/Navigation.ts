import NavigateEvent from './NavigateEvent'
// eslint-disable-next-line
import NavigationHistoryEntry, {
  createNavigationHistoryState,
  getNavigationHistryEntryIndex,
  getCurrentNavigationHistryEntryIndex,
} from './NavigationHistoryEntry'
// eslint-disable-next-line
import NavigationHistoryStack from './NavigationHistoryStack'
import { NAVIGATION_STATE_KEY } from './constants'
import { createKey } from './utils'

// eslint-disable-next-line
let navigation: Navigation

const nativePushState = History.prototype.pushState
const nativeReplaceState = History.prototype.replaceState

class Navigation extends EventTarget {
  public id: string
  public currentEntry: NavigationHistoryEntry

  private entryStack: NavigationHistoryStack

  static getCurrent(): Navigation {
    return navigation
  }

  constructor() {
    super()

    const stateId = history.state?.[NAVIGATION_STATE_KEY]
    const id: string = stateId ?? createKey()
    const shouldInit = stateId !== id

    this.id = id
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
    this.currentEntry = this.entries()[getCurrentNavigationHistryEntryIndex()]

    const that = this

    // rewrite
    History.prototype.pushState = function (
      data: any,
      unused: string,
      url?: string | URL | null | undefined
    ) {
      const entry = new NavigationHistoryEntry(that.currentEntry.index + 1, url)
      const state = createNavigationHistoryState(data, that, entry)
      const navigateEvent = new NavigateEvent('navigate', {
        navigationType: 'push',
        destination: entry,
      })
      that.dispatchEvent(navigateEvent)
      if (!navigateEvent.defaultPrevented) {
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
      const entry = new NavigationHistoryEntry(that.currentEntry.index, url)
      const state = createNavigationHistoryState(data, that, entry)
      const navigateEvent = new NavigateEvent('navigate', {
        navigationType: 'replace',
        destination: entry,
      })
      that.dispatchEvent(navigateEvent)
      if (!navigateEvent.defaultPrevented) {
        nativeReplaceState.call(this, state, unused, url)
        that.entryStack.replace(entry)
        that.currentEntry = entry
      }
    }
    window.addEventListener('popstate', function (event: PopStateEvent) {
      const index = getNavigationHistryEntryIndex(event.state)
      const entry = that.entries()[index]
      that.currentEntry = entry
      const navigateEvent = new NavigateEvent('navigate', {
        navigationType: 'traverse',
        destination: entry,
        cancelable: false,
      })
      that.dispatchEvent(navigateEvent)
    })
  }

  entries(): NavigationHistoryEntry[] {
    return this.entryStack.entries()
  }
}

navigation = new Navigation()

export { navigation }

export default Navigation

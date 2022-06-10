export interface HistoryEventInit extends EventInit {
  state: any
  url: string | URL | null | undefined
}

export class HistoryEvent extends Event {
  readonly state: any
  readonly url: string | URL | null | undefined

  constructor(type: string, options: HistoryEventInit) {
    const { state, url, ...eventInit } = options
    super(
      type,
      Object.assign(
        {
          bubbles: true,
          cancelable: true,
        },
        eventInit
      )
    )
    this.state = state
    this.url = url
  }
}

export interface HistoryNavigation {
  /** navigation unique identifier */
  key: string
  /** spa unique identifier */
  app: string
  /** navigation history index */
  index: number
  url?: string
}

let appKey = ''
let navigationKey = 'navigation'

export function defaultCreateKey() {
  return Math.random().toString(36).substring(2, 10)
}

export const defaultNavigation: HistoryNavigation = {
  key: '',
  app: '',
  index: -1,
  url: '',
}

/**
 * Get the current navigation
 *
 * @returns
 */
export function getCurrentNavigation(): HistoryNavigation {
  return history.state?.[navigationKey] || defaultNavigation
}

export function getNavigationStackCacheKey(app = appKey) {
  return `navigation-stack-${app}`
}

/**
 *
 * Get the current navigation stack
 *
 * @param all Whether to return all navigational stack (include forward navigation)
 * @returns
 */
export function getNavigationStack(all = false): HistoryNavigation[] {
  const navigation = getCurrentNavigation()
  if (navigation.app) {
    try {
      const navigations: HistoryNavigation[] = JSON.parse(
        sessionStorage.getItem(getNavigationStackCacheKey(navigation.app)) ||
          '[]'
      )
      if (all) {
        return navigations
      }
      return navigations.slice(0, navigation.index + 1)
    } catch (error) {
      return []
    }
  }
  return []
}

export function pushNavigationStack(navigation: HistoryNavigation) {
  const navigations = getNavigationStack()
  try {
    sessionStorage.setItem(
      getNavigationStackCacheKey(navigation.app),
      JSON.stringify(
        navigations.slice(0, navigation.index).concat([
          {
            key: navigation.key,
            app: navigation.app,
            index: navigation.index,
            url: navigation.url ?? location.href,
          },
        ])
      )
    )
  } catch (error) {
    // TODO: overflow
  }
}

export function replaceNavigationStack(navigation: HistoryNavigation) {
  const navigations = getNavigationStack(true)
  navigations.splice(navigation.index, 1, {
    key: navigation.key,
    app: navigation.app,
    index: navigation.index,
    url: navigation.url ?? location.href,
  })
  try {
    sessionStorage.setItem(
      getNavigationStackCacheKey(navigation.app),
      JSON.stringify(navigations)
    )
  } catch (error) {
    // TODO: overflow
  }
}

export default function (options?: {
  /** Store the key value of the navigation information in history.state, default `'navigation'` */
  navigation?: string
  /** Each navigation message has a unique key, and createKey is used to generate that value  */
  createKey?(): string
}) {
  // TODO: forbid repeatlly invoking
  const { navigation = navigationKey, createKey = defaultCreateKey } =
    options || {}
  if (navigation !== navigationKey) {
    navigationKey = navigation
  }

  const nativePushState = History.prototype.pushState
  const nativeReplaceState = History.prototype.replaceState

  let index = history.state?.[navigation]?.index ?? defaultNavigation.index

  if (index < 0) {
    index = 0
    appKey = createKey()
    const navigationDetail = {
      key: createKey(),
      app: appKey,
      index,
    }
    nativeReplaceState.call(
      history,
      Object.assign({}, history.state, {
        [navigation]: navigationDetail,
      }),
      '',
      location.pathname + location.search + location.hash
    )
    pushNavigationStack(navigationDetail)
  } else {
    appKey = history.state?.[navigation]?.app || ''
  }

  History.prototype.pushState = function (
    data: any,
    unused: string,
    url?: string | URL | null | undefined
  ) {
    const newIndex = index + 1
    const navigationDetail: HistoryNavigation = {
      key: createKey(),
      app: appKey,
      index: newIndex,
    }
    const state = Object.assign({}, data, {
      [navigation]: navigationDetail,
    })
    const pushStateEvent = new HistoryEvent('pushstate', { state, url })
    window.dispatchEvent(pushStateEvent)
    if (!pushStateEvent.defaultPrevented) {
      index = newIndex
      nativePushState.call(this, state, unused, url)
      pushNavigationStack(navigationDetail)
    }
  }

  History.prototype.replaceState = function (
    data: any,
    unused: string,
    url?: string | URL | null | undefined
  ) {
    const navigationDetail: HistoryNavigation = {
      key: createKey(),
      app: appKey,
      index: history.state?.[navigation]?.index ?? defaultNavigation.index,
    }
    const state = Object.assign({}, data, {
      [navigation]: navigationDetail,
    })
    const replaceStateEvent = new HistoryEvent('replacestate', { state, url })
    window.dispatchEvent(replaceStateEvent)
    if (!replaceStateEvent.defaultPrevented) {
      nativeReplaceState.call(this, state, unused, url)
      replaceNavigationStack(navigationDetail)
    }
  }

  window.addEventListener('popstate', function (event) {
    index = event.state?.[navigation]?.index ?? defaultNavigation.index
  })
}

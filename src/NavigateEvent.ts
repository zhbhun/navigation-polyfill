export type NavigationType = 'reload' | 'push' | 'replace' | 'traverse'

export interface NavigationDestination {
  id: string
  index: number
  url: string | URL | null | undefined
}

export interface NavigateEventInit extends EventInit {
  navigationType: NavigationType
  destination: NavigationDestination
}

export default class NavigateEvent extends Event {
  readonly navigationType: NavigationType
  readonly destination: NavigationDestination

  constructor(type: string, options: NavigateEventInit) {
    const { navigationType, destination, ...eventInit } = options
    super(
      type,
      Object.assign(
        {
          bubbles: false,
          cancelable: true,
        },
        eventInit
      )
    )
    this.navigationType = navigationType
    this.destination = destination
  }
}

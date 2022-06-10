export interface HistoryEventInit extends EventInit {
  state: any;
}

export class HistoryEvent extends Event {
  readonly state: any;
  _defaultPrevented: boolean = false;

  constructor(type: string, options: HistoryEventInit) {
    const { state, ...eventInit } = options;
    super(type);
    this.state = state;
  }

  preventDefault(): void {
    super.preventDefault();
    this._defaultPrevented = true;
  }

  isDefaultPrevented() {
    return this._defaultPrevented;
  }
}

export interface HistoryNavigation {
  key: string;
  index: number;
}

const defaultNavigation: HistoryNavigation = {
  key: "",
  index: -1,
};

let navigationKey = "navigation";

export function getCurrentNavigation(): HistoryNavigation {
  return history.state?.[navigationKey] || defaultNavigation;
}

function defaultCreateKey() {
  return Math.random().toString(36).substring(2, 10);
}

export default function (options?: {
  /** 在 history.state 存储导航信息的 key 值，默认 `'navigation'` */
  navigation?: string;
  /** 每个导航信息都有一个唯一的 key，createKey 用于生成该值  */
  createKey?(): string;
}) {
  const { navigation = navigationKey, createKey = defaultCreateKey } =
    options || {};
  if (navigation !== navigationKey) {
    navigationKey = navigation;
  }

  const nativePushState = History.prototype.pushState;
  const nativeReplaceState = History.prototype.replaceState;

  let index = history.state?.[navigation]?.index ?? defaultNavigation.index;

  if (index < 0) {
    index = 0;
    nativeReplaceState.call(
      history,
      Object.assign({}, history.state, {
        [navigation]: {
          key: createKey(),
          index,
        },
      }),
      "",
      location.pathname + location.search + location.hash
    );
  }

  History.prototype.pushState = function (
    data: any,
    unused: string,
    url?: string | URL | null | undefined
  ) {
    const state = Object.assign({}, data, {
      [navigation]: {
        key: createKey(),
        index: ++index,
      },
    });
    const pushStateEvent = new HistoryEvent("pushstate", { state });
    window.dispatchEvent(pushStateEvent);
    if (!pushStateEvent.isDefaultPrevented()) {
      nativePushState.call(this, state, unused, url);
    }
  };

  History.prototype.replaceState = function (
    data: any,
    unused: string,
    url?: string | URL | null | undefined
  ) {
    const state = Object.assign({}, data, {
      [navigation]: {
        key: createKey(),
        index: history.state?.[navigation]?.index ?? defaultNavigation.index,
      },
    });
    const replaceStateEvent = new HistoryEvent("replacestate", { state });
    window.dispatchEvent(replaceStateEvent);
    if (!replaceStateEvent.isDefaultPrevented()) {
      nativeReplaceState.call(this, state, unused, url);
    }
  };

  window.addEventListener("popstate", function (event) {
    index = event.state?.[navigation]?.index ?? defaultNavigation.index;
  });
}

English | [简体中文](./README_zh-CN.md)

`HistoryEvent` is an interface for the pushstate and replacestate event.

A pushstate and replacestate event is dispatched to the window every time, if the history entry being activated was created by a call to history.pushState() or was affected by a call to history.replaceState().

## Why

It is well known that browsers already provide a popstate event. However, the popstate event is only triggered by certain browser actions, such as clicking the back button (or calling history.back() or history.forward() in JavaScript). That is, navigating between two history entries in the same document will trigger this event. Calling history.pushState() or history.replaceState() will not trigger the popstate event.

In some cases, we need to know that the browser has newly opened or replaced a route and do some additional processing before switching, such as:

1. blocking the routing switch.
2. doing buried reporting when a route switch occurs.
3. setting additional history states.

## Install

```shell
npm install history-event
# yarn add history-event
# pnpm add history-event
```

## Usage

HistoryEvent is more like a polyfill and must be injected on the first line of code in the program.

```js
// polyfill.js
import historyEventPolyfill from "history-event";
historyEventPolyfill();

// main.js
import "./polyfill";
// import 'others';
// ...

// case.js
window.addEventListener("pushstate", function (event) {
  event.preventDefault(); // blocking the opening new route
});
window.addEventListener("replacestate", function (event) {
  event.preventDefault(); // blocking the replacing current route
});
```

In addition to providing pushstate and replace events, the HistoryEvent stores information about the next navigation on the state property of each event (accessed via event.state.navigation).

Each navigation stores a key and index, with the key representing the route's unique navigation identifier and the index representing the index position (starting at 0) in the current route's sub-history stack.

```js
window.addEventListener("pushstate", function (event) {
  console.log(event.state.navigation.key); // unique key of new navigation
  console.log(event.state.navigation.index); // history index of new navigation
});
window.addEventListener("replacestate", function (event) {
  console.log(event.state.navigation.key); // unique key of replacing navigation
  console.log(event.state.navigation.index); // history index of replacing navigation
});
document.querySelector("#submit").addEventListener("click", function () {
  // go to home page after submit
  history.go(-history.state.navigation.index);
});
```

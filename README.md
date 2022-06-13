English | [简体中文](./README_zh-CN.md)

`navigation-polyfill` implements part of the functionality of [Navigation API](https://wicg.github.io/navigation-api/) based on Hisotry API emulation.

- [x] navigation.entries()
- [x] navigation.currentEntry

  - [x] navigation.currentEntry.id
  - [ ] navigation.currentEntry.key
  - [x] navigation.currentEntry.index
  - [x] navigation.currentEntry.url
  - [x] navigation.currentEntry.getState

- [ ] navigation.canGoBack
- [ ] navigation.canGoForward
- [ ] navigation.navigate
- [ ] navigation.reload
- [ ] navigation.traverseTo
- [ ] navigation.back
- [ ] navigation.forward
- [x] navigation.onnavigate
- [ ] navigation.onnavigatesuccess
- [ ] navigation.onnavigateerror
- [ ] navigation.oncurrententrychange
- [x] navigation.addEventListener()
- [x] navigation.removeEventListener()

## Installation

```shell
npm install navigation-polyfill
```

## Using

`navigation-polyfill` must be injected in the first line of code of the program.

```js
// main.js
import 'navigation-polyfill';
// import 'others';
// ...

// case.js
import navigation from 'navigation-polyfill'
navigation.addEventListener("navigate", function (event) {
  event.preventDefault(); // blocking the opening new route
  console.log(event.navigationType); // 'reload' | 'push' | 'replace' | 'traverse'
  console.log(event.destination.id);
  console.log(event.destination.index);
  console.log(event.destination.url);
  console.log(navigation.entries());
});
```

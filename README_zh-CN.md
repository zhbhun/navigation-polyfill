[English](./README.md) | 简体中文

`navigation-polyfill` 基于 Hisotry API 模拟实现了 [Navigation API](https://wicg.github.io/navigation-api/) 的部分功能。

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

## 安装

```shell
npm install navigation-polyfill
```

## 使用

`navigation-polyfill` 必须在程序的第一行代码中注入。

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

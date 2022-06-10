[English](./README.md) | 简体中文

`HistoryEvent` 是 pushstate 和 replacestate 事件的一个接口。

如果被激活的历史条目是由调用 `history.pushState()` 创建的，或者是由调用 `history.replaceState()` 影响的，每次都会向窗口派发一个 `pushstate` 和 `replacestate` 事件。

## 为什么

众所周知，浏览器已经提供了一个 `popstate` 事件。然而，`popstate` 事件只由某些浏览器动作触发，比如点击后退按钮（在 JavaScript 中调用 `history.back()` 或 `history.forward()`）。而调用 `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件。

在某些情况下，我们需要知道浏览器新开了或替换了一个路由，并在切换前做一些额外的处理，比如说：

1. 阻止路由切换。
2. 在路由切换发生时做埋点报告。
3. 设置额外的历史状态。

## 安装

```shell
npm install history-event
# yarn add history-event
# pnpm add history-event
```

## 使用方法

HistoryEvent 更像是一个 polyfill，必须在程序的第一行代码中注入。

```js
// polyfill.js
import historyEventPolyfill from 'history-event'
historyEventPolyfill()。

// main.js
import './polyfill'
// import 'others';
// ...

// case.js
window.addEventListener('pushstate', function (event) {
  event.preventDefault() // 阻止打开新路径
})
window.addEventListener('replacestate', function (event) {
  event.preventDefault() // 阻止替换当前路由的行为
})
```

除了提供 pushstate 和 replace 事件外，HistoryEvent 还在每个事件的 state 属性上存储了关于下一个导航的信息（通过 event.state.navigation 访问）。

每个导航都存储一个 `key` 和 `index`，`key` 代表路由的唯一导航标识符，`index` 代表当前路由的子历史栈中的索引位置（从 0 开始）。

```js
window.addEventListener("pushstate", function (event) {
  console.log(event.state.navigation.key); // 新导航的唯一标识
  console.log(event.state.navigation.index); // 新导航的历史索引位置
});
window.addEventListener("replacestate", function (event) {
  console.log(event.state.navigation.key); // 替换导航的唯一标识
  console.log(event.state.navigation.index); // 替换导航的历史索引位置
});
document.querySelector("#submit").addEventListener("click", function () {
  // 提交后转到主页
  history.go(-history.state.navigation.index);
});
```

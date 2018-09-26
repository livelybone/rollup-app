#marketing-activity-system-web

- 环境
- 安装
- 开发规范
- 可用组件

## 环境
请使用 Node > 8.6.0

## 安装
```bash
# install dependencies
npm i --cache-min Infinity

# build config
cp config/config.js.sample config/config.js
# then edit it by your need

# dev
cross-env activityNames=[activityNames] npm run dev

# build
cross-env activityNames=[activityNames] npm run build

# run server
npm run server
```

添加新文件需要重启 `npm run dev`

可使用 `cross-env` 设置 `activityNames` 指定监听或编译对应活动页面(多个用 `,` 分隔)，可降低性能开销
默认为全部活动页面

## 开发规范

> 请自行阅读 Vue2 官方文档，按 Vue2 官方文档编写程序

> 请严格使用 es6 语法编写程序

> 请严格按照 eslint 进行代码风格检查，确保代码统一性

> 不要在 master 分支开发，请建立自己的开发分支，如果测试好需要发布，请发 PR

> css 与 vue 文件分离， css 放 `src/css`， 页面文件放 `src/pages`(警告: 非页面级的组件不要放在此文件夹)

> 路由为自动创建，创建规则 `/activity/{directoryName1}/{directoryName2}/.../{VuePageName}` (directoryName 不包括 pages)，比如 pages 下的 `ActivityDemo.vue` 的访问路径为 `/activity/ActivityDemo.vue`

> 公共组件放 `src/common/components`, 其 css 放 `src/css/component-css`, 组件 css 需要主动引入到页面 css

> 一个活动对应 pages 目录下的一个文件夹或者一个文件，解释：每一个活动可能有一个或者多个页面组成，一个页面的活动可直接使用单个 Vue 文件开发，多个页面的活动请新建一个目录（页面的 Vue 文件放于该目录）

> 

## 可用组件 - 需安装

> [vue-img-tag](https://github.com/livelybone/vue-img-tag)，图片组件，支持懒加载，支持图片文件的预览

> [vue-scrollbar-live](https://github.com/livelybone/vue-scrollbar-live)，自定义滚动条

> [@livelybone/mouse-wheel](https://github.com/livelybone/mouse-wheel)，封装好的 mouse wheel 事件，移动增量统一

> [@livelybone/copy](https://github.com/livelybone/copy)，复制到剪切板 `copyDom` `copyText`，对象复制 `objectDeepCopy` `objectSimpleCopy`，对象深度合并 `objectDeepMerge`

> [@livelybone/vue-loading](https://github.com/livelybone/vue-loading)，加载动画

> [@livelybone/vue-input](https://github.com/livelybone/vue-input)，input/textarea 标签的封装，实现 `pristine` `valid` 检查

> [@livelybone/vue-datepicker](https://github.com/livelybone/vue-datepicker)，datepicker, timepicker, datetimePicker

> [@livelybone/meta-scale](https://github.com/livelybone/meta-scale)，获取页面 viewport 的缩放比例

> [@livelybone/simple-observer](https://github.com/livelybone/simple-observer)，简单 Observer 实现

> [@livelybone/touch](https://github.com/livelybone/touch)，touch 封装， 实现事件：pan, pinch, tap, press, swipe, rotate

> [@livelybone/vue-select](https://github.com/livelybone/vue-select)，自定义 select，包括 cascader，实现多选

> [@livelybone/scroll-get](https://github.com/livelybone/scroll-get)，获取元素相对于页面/窗口的位置

> [@livelybone/vue-popper](https://github.com/livelybone/vue-popper)，[popper.js](https://popper.js.org) 的封装，并扩展实现了对箭头位置的控制

> [@livelybone/vue-table](https://github.com/livelybone/vue-table)，table 标签的封装，实现单元格宽度拖拽修改

> [@livelybone/vue-button](https://github.com/livelybone/vue-button)，button 标签的封装，实现防抖功能

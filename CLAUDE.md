# ToDoList 项目约定

## 设计风格

轻松休闲卡通风格。明亮温暖，可爱但不幼稚，生产力工具优先。
宫崎骏风格指**插画和图标的气质**（手绘感、圆润、有机、温暖），不是硬性配色规则。配色应丰富自然，不同功能区域用不同暖色调，不要让单一色相主导界面。

## 配色规范

所有颜色通过 CSS custom properties 定义在 `src/styles/theme.css`，组件中只使用 `var(--ghibli-*)` 引用：

| Token | 色值 | 用途 |
|-------|------|------|
| `--ghibli-sky` | #7ECCE5 | 天空蓝 - 主色调 |
| `--ghibli-sky-light` | #B8E4F0 | 浅天空 - hover |
| `--ghibli-sky-pale` | #E3F3F9 | 极淡天空 - 背景 |
| `--ghibli-grass` | #8BBF6E | 森林绿 - 完成色 |
| `--ghibli-grass-dark` | #5E9A44 | 深绿 - 强调 |
| `--ghibli-earth` | #D4A574 | 暖土棕 |
| `--ghibli-earth-light` | #E8CEB0 | 浅棕 |
| `--ghibli-cream` | #FFF8EC | 暖奶油 - 主背景 |
| `--ghibli-cloud` | #FFFFFF | 白云 - 卡片面 |
| `--ghibli-sunset` | #F4A67E | 夕阳橙 |
| `--ghibli-rose` | #E8929A | 柔粉 - 删除/危险 |
| `--ghibli-text` | #3D3529 | 深暖棕 - 主文本 |
| `--ghibli-text-soft` | #7A7062 | 柔和文本 |
| `--ghibli-text-faint` | #A89E90 | 占位文本 |
| `--ghibli-border` | #E2D8C8 | 暖边框 |
| `--ghibli-shadow` | rgba(61,53,41,0.08) | 阴影 |

## 字体

Nunito（自托管 woff2），圆润友好，小字号可读。

## 动画规范

- GSAP 做交互动画（add/remove/complete/expand/drag），CSS animation 做常驻轻量动画（云朵漂移等）
- 所有交互动画 < 400ms，小窗口内保持克制
- 动画 hook 与 UI 组件完全解耦：hook 只接收 DOM 元素，不依赖组件 state
- 装饰组件（`src/decorations/`）自包含动画，`pointer-events: none`

## 架构约束

- 纯 CSS + CSS custom properties，不引入 CSS-in-JS / Tailwind / CSS Modules
- 动画逻辑在 `src/animations/`，装饰组件在 `src/decorations/`，与业务组件隔离
- 窗口 320×480px，装饰不可浪费空间

## 代码风格

- 函数式思维优先：纯函数 > 副作用，数据变换用 map/filter/reduce，避免命令式循环和可变状态
- 副作用隔离：集中在 hook 边界（useEffect）或明确标记的函数中，业务逻辑保持纯净
- DRY：不重复不绕弯，相同模式提取为工具函数或复用组件，不做过度抽象
- 架构清晰：每个文件/模块职责单一明确，命名即文档，读代码即懂意图
- 简洁高效：删掉能删的代码，最直接的方式实现，拒绝绕弯和过度设计

## Codepen 素材复用

`/Users/yuartian/git/codepen/` 中的项目只借鉴**动画逻辑和交互形式**，视觉样式全部自行设计以符合宫崎骏风格。

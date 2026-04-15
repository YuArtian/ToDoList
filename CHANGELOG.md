# Changelog

本项目所有重要的变更都记录在此文件中。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，并遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [0.3.0] - 2026-04-15

### ✨ Features
- 引入宫崎骏风格设计规范与动画体系：CSS custom properties 主题（`--ghibli-*`）、装饰组件架构、云朵漂移等常驻轻量动画
- 增强 TodoItem 的 GSAP 交互动画（add / remove / complete），新增手绘风格 CatIcon 组件

### 🔧 Chore
- 接入 release-please 自动化发版 workflow
- 新增项目专属 `/release` skill，固化 release-please + 手动 tag 双通路流程

## [0.2.0] - 2026-04-13

### ✨ Features
- 集成 Tiptap 富文本编辑器，提供更强大的笔记编辑体验（支持 StarterKit 与 Placeholder 扩展）

### 🐛 Bug Fixes
- 修复 Release Action 缺少 `contents: write` 权限导致无法发布的问题
- 补充 SVG 模块的 TypeScript 类型声明，修复类型检查报错

### 🔧 Chore
- 统一 `package.json` / `tauri.conf.json` / `Cargo.toml` 的版本号为 `0.2.0`

## [0.0.1] - 初始发布

### ✨ Features
- TodoList 基础功能：新增、完成、删除待办事项
- 基于 `@dnd-kit` 的拖拽排序
- 通过 `@tauri-apps/plugin-sql` 持久化数据到本地 SQLite
- GitHub Actions 自动构建并发布 Release

[0.3.0]: https://github.com/YuArtian/ToDoList/releases/tag/v0.3.0
[0.2.0]: https://github.com/YuArtian/ToDoList/releases/tag/v0.2.0
[0.0.1]: https://github.com/YuArtian/ToDoList/releases/tag/v0.0.1

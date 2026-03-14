# TodoList

一个基于 Tauri + React + TypeScript 构建的轻量级桌面待办事项应用，使用 SQLite 进行本地数据持久化。

![TodoList](app-icon.svg)

## 功能特性

- **任务管理** — 新增、编辑、完成、删除待办事项
- **分类管理** — 创建自定义分类，按分类筛选任务
- **本地存储** — 基于 SQLite 的本地数据库，数据离线可用
- **桌面集成** — 窗口置顶、自定义标题栏、可折叠收起

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 桌面框架 | Tauri 2 (Rust) |
| 数据库 | SQLite |

## 项目结构

```
src/
├── components/        # React 组件
│   ├── Header.tsx         # 顶栏（统计、折叠、关闭）
│   ├── CategorySidebar.tsx # 分类侧边栏
│   ├── TodoList.tsx       # 任务列表
│   ├── TodoItem.tsx       # 任务项
│   └── TodoForm.tsx       # 新增任务表单
├── hooks/             # 自定义 Hooks
│   ├── useTodos.ts        # 任务状态与操作
│   └── useCategories.ts   # 分类状态与操作
├── lib/
│   └── commands.ts    # SQLite 数据库操作
├── types/
│   └── index.ts       # 类型定义
├── App.tsx            # 主组件
├── App.css            # 样式
└── main.tsx           # 入口文件

src-tauri/             # Tauri / Rust 后端
├── src/
│   ├── main.rs            # 应用入口
│   └── lib.rs             # 数据库迁移与初始化
└── tauri.conf.json        # Tauri 配置
```

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) (>= 18)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri 环境依赖](https://v2.tauri.app/start/prerequisites/)

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发模式
npm run tauri dev

# 构建生产版本
npm run tauri build
```

## 许可证

MIT

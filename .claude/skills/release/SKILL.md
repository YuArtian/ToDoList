---
name: release
description: 给 TodoList 这个 Tauri 项目发版。自动判断走 release-please PR 路径还是手动打 tag 路径，同步 package.json / tauri.conf.json / Cargo.toml 三处版本号，按 conventional commits 生成 CHANGELOG，本地完成 commit + tag，并把 push 命令交还给用户执行。当用户说"发版""release""出版本""tag a release""打 tag 发布"等时使用。
---

# Release skill — TodoList (Tauri)

## 项目背景

本项目用 **两条互补的发版通路**：

1. **自动通路（首选）** — [release-please.yml](.github/workflows/release-please.yml) 根据 main 上的 conventional commits 维护一个 release PR。合并 PR → release-please 创建 tag + GitHub Release → 同一个 workflow 内继续跑 Tauri 构建并上传 `.exe` / `.msi`。
2. **手动通路（兜底）** — 直接推 `v*` tag 触发 [release.yml](.github/workflows/release.yml)。仅用于热修复或需要绕过 release-please 的场合。

## ⚠️ 用户偏好（不可越界）

**用户禁止 Claude 执行 `git push`。** 所有推送动作必须打印命令交给用户手动跑。本地 commit / tag 可以做。

---

## Step 1 — 摸清当前状态

并行执行：

```bash
git fetch --tags origin
git tag --list 'v*' --sort=-v:refname | head -5
git log $(git describe --tags --abbrev=0)..HEAD --oneline
gh pr list --label 'autorelease: pending' --state open --json number,title,url
gh run list --workflow release-please.yml --limit 3
```

并读取版本号现状：
- [package.json](package.json) → `version`
- [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json) → `version`
- [src-tauri/Cargo.toml](src-tauri/Cargo.toml) → `[package] version`

**如果三处版本号不一致或与最近 tag 不符，先告诉用户**，让用户决定是否一并对齐。

## Step 2 — 选路径

用 AskUserQuestion 让用户选（默认推荐 A）：

| 场景 | 路径 |
|---|---|
| 有 `autorelease: pending` PR | **A：合并 release-please PR** |
| main 上有未发版 commit 但 release-please 没开 PR | 提醒用户去 GitHub Settings → Actions → General 打开 *Allow GitHub Actions to create and approve pull requests*；等几秒看是否触发 |
| 需要紧急热修复，不想等 release-please | **B：手动打 tag** |

---

## Path A — 合并 release-please PR

1. 读 PR 内容：
   ```bash
   gh pr view <number> --json title,body,files
   gh pr diff <number>
   ```
2. 简要总结给用户：版本从 `X.Y.Z` → `A.B.C`，CHANGELOG 新增哪些条目。
3. 询问用户是否合并；得到确认后：
   ```bash
   gh pr merge <number> --squash --delete-branch
   ```
4. 监听构建：
   ```bash
   gh run watch
   ```
5. 完成后报告：
   ```bash
   gh release view vA.B.C --json url,assets --jq '{url, assets:[.assets[].name]}'
   ```

---

## Path B — 手动打 tag（仅热修复）

### B.1 选版本号

按 conventional commits 推算：
- 任一 `feat:` → minor bump
- 仅 `fix:` / `chore:` / `docs:` / `refactor:` → patch bump
- 任一 `feat!:` 或 commit body 有 `BREAKING CHANGE:` → major bump

用 AskUserQuestion 给出推算结果 + 2-3 个可选项让用户确认。

### B.2 同步 5 处版本号

逐一编辑（**少一个都不行**，否则 CI 构建会失败）：

| 文件 | 位置 |
|---|---|
| [package.json](package.json) | `"version"` |
| [package-lock.json](package-lock.json) | 顶层 `"version"` **和** `packages."".version` 两处 |
| [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json) | `"version"` |
| [src-tauri/Cargo.toml](src-tauri/Cargo.toml) | `[package] version` |
| [src-tauri/Cargo.lock](src-tauri/Cargo.lock) | `[[package]] name = "todolist-app"` 块的 `version` |
| [.release-please-manifest.json](.release-please-manifest.json) | `".": "X.Y.Z"`（保持 release-please 基线一致） |

### B.3 更新 CHANGELOG.md

格式参照 [CHANGELOG.md](CHANGELOG.md) 已有条目。按 commit 类型分组：

```markdown
## [X.Y.Z] - YYYY-MM-DD

### ✨ Features
- <feat: ... 的描述>

### 🐛 Bug Fixes
- <fix: ... 的描述>

### 🔧 Chore
- <chore/ci/docs/refactor 的描述>
```

底部追加链接：
```markdown
[X.Y.Z]: https://github.com/YuArtian/ToDoList/releases/tag/vX.Y.Z
```

⚠️ 不要从 `git diff` 中夹带与发版无关的本地未提交改动到 release commit 里。如果检测到，先用 AskUserQuestion 问用户是否一并打包。

### B.4 本地 commit + tag

```bash
git add package.json package-lock.json src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json .release-please-manifest.json CHANGELOG.md
git commit -m "chore(release): vX.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z"
```

### B.5 把 push 命令交给用户

**不要自己跑 `git push`。** 打印：

```
git push origin main vX.Y.Z
```

等用户回报推送完成后：

```bash
gh run list --workflow release.yml --limit 1
gh run watch
gh release view vX.Y.Z --json url,assets
```

报告 release URL。

---

## 已知坑位

- **release-please 不动 Cargo.lock 的 version 字段**。release-please.yml 里有 `cargo update -p todolist-app` 在构建前修齐，**不要手工去改 release-please PR 里的 Cargo.lock**。
- **GITHUB_TOKEN 推的 tag 不会触发其他 workflow**。这是 release-please.yml 内置构建步骤的原因，也是为什么 release.yml 只在人工推 tag 时才会跑。
- **Path B 必须同步 `.release-please-manifest.json`**，否则 release-please 下次跑时基线版本错乱，会重复提议已发版本。
- **`package.json` 历史版本号曾错位**（v0.0.1 时 package.json 是 1.0.0）。永远以"刚发出去的 git tag"为权威版本。
- **第一次发版前**，确认 GitHub 仓库 Settings → Actions → General → *Allow GitHub Actions to create and approve pull requests* 已开。

## 不适用场景

- 普通代码改动 → 用 `/commit`，不要走本 skill。
- pre-release / RC 构建 → 当前 workflow 没配 `prerelease: true`，需要先扩展配置。
- 仅修文档不需要发版 → 跳过本 skill。

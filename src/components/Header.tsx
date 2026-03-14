import { getCurrentWindow } from "@tauri-apps/api/window";
import "./Header.css";
import appIcon from "../assets/app-icon.svg";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Header({
  totalCount,
  completedCount,
  collapsed,
  onToggleCollapse,
}: HeaderProps) {
  const appWindow = getCurrentWindow();

  return (
    <header className="header" data-tauri-drag-region>
      <div className="header-left">
        <img className="header-icon" src={appIcon} alt="icon" />
        <h1 className="header-title">Todo</h1>
        <span className="header-stats">
          {completedCount}/{totalCount}
        </span>
      </div>
      <div className="header-right">
        <button
          className="header-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "展开" : "收起"}
        >
          {collapsed ? "▼" : "▲"}
        </button>
        <button
          className="header-btn"
          onClick={() => appWindow.minimize()}
          title="最小化"
        >
          &#8722;
        </button>
        <button
          className="header-btn close"
          onClick={() => appWindow.close()}
          title="关闭"
        >
          &#10005;
        </button>
      </div>
    </header>
  );
}

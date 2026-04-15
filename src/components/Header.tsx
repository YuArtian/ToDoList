import { CatIcon } from "../assets/CatIcon";
import "./Header.css";

const isTauri = "__TAURI_INTERNALS__" in window;
const getWindow = () =>
  isTauri ? import("@tauri-apps/api/window").then((m) => m.getCurrentWindow()) : null;

interface HeaderProps {
  totalCount: number;
  completedCount: number;
  collapsed: boolean;
  allNotesExpanded: boolean;
  onToggleCollapse: () => void;
  onToggleAllNotes: () => void;
}

export function Header({
  totalCount,
  completedCount,
  collapsed,
  allNotesExpanded,
  onToggleCollapse,
  onToggleAllNotes,
}: HeaderProps) {
  return (
    <header className="header" data-tauri-drag-region>
      <div className="header-left">
        <CatIcon className="header-icon" size={50} />
        <span className="header-stats">
          {completedCount}/{totalCount}
        </span>
      </div>
      <div className="header-right">
        <button
          className={`header-btn${allNotesExpanded ? " active" : ""}`}
          onClick={onToggleAllNotes}
          title={allNotesExpanded ? "全部折叠备注" : "全部展开备注"}
        >
          &#128221;
        </button>
        <button
          className="header-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "展开" : "收起"}
        >
          {collapsed ? "▼" : "▲"}
        </button>
        <button
          className="header-btn"
          onClick={() => getWindow()?.then((w) => w?.minimize())}
          title="最小化"
        >
          &#8722;
        </button>
        <button
          className="header-btn close"
          onClick={() => getWindow()?.then((w) => w?.close())}
          title="关闭"
        >
          &#10005;
        </button>
      </div>
    </header>
  );
}

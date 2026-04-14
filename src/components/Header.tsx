import { FloatingClouds } from "../decorations/FloatingClouds";
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
      <FloatingClouds />
      <div className="header-left">
        <svg className="header-icon" viewBox="0 0 24 24" fill="none">
          {/* ears */}
          <path d="M4.5 9L6 3.5h2.5L6.5 9" fill="var(--cat-orange)" stroke="var(--cat-stroke)" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M19.5 9L18 3.5h-2.5l2 5.5" fill="var(--cat-orange)" stroke="var(--cat-stroke)" strokeWidth="1.5" strokeLinejoin="round"/>
          {/* body */}
          <ellipse cx="12" cy="14" rx="8.5" ry="7.5" fill="var(--cat-orange)" stroke="var(--cat-stroke)" strokeWidth="1.5"/>
          {/* tummy */}
          <ellipse cx="12" cy="15.5" rx="4" ry="3.5" fill="var(--cat-tummy)"/>
          {/* eyes */}
          <circle cx="9" cy="12.5" r="1.2" fill="var(--cat-stroke)"/>
          <circle cx="15" cy="12.5" r="1.2" fill="var(--cat-stroke)"/>
          {/* nose */}
          <ellipse cx="12" cy="14.5" rx="0.8" ry="0.5" fill="var(--cat-stroke)"/>
          {/* whiskers */}
          <line x1="5" y1="14" x2="9" y2="14.5" stroke="var(--cat-stroke)" strokeWidth="1" strokeLinecap="round"/>
          <line x1="5.5" y1="15.5" x2="9" y2="15" stroke="var(--cat-stroke)" strokeWidth="1" strokeLinecap="round"/>
          <line x1="15" y1="14.5" x2="19" y2="14" stroke="var(--cat-stroke)" strokeWidth="1" strokeLinecap="round"/>
          <line x1="15" y1="15" x2="18.5" y2="15.5" stroke="var(--cat-stroke)" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <h1 className="header-title">Todo</h1>
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

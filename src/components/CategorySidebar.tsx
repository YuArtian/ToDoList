import { useState } from "react";
import type { Category } from "../types";
import "./CategorySidebar.css";

interface CategorySidebarProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onAdd: (name: string) => void;
  onDelete: (id: number) => void;
}

export function CategorySidebar({
  categories,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
}: CategorySidebarProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const name = newName.trim();
    if (name) {
      onAdd(name);
      setNewName("");
      setAdding(false);
    }
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${selectedId === null ? "active" : ""}`}
          onClick={() => onSelect(null)}
        >
          <span className="sidebar-icon">&#128229;</span>
          <span>全部</span>
        </button>
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span>我的项目</span>
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`sidebar-item ${selectedId === cat.id ? "active" : ""}`}
            onClick={() => onSelect(cat.id)}
          >
            <span className="sidebar-hash">#</span>
            <span className="sidebar-item-name">{cat.name}</span>
            {cat.id !== 1 && (
              <button
                className="sidebar-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cat.id);
                }}
                title="删除项目"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="sidebar-add-form">
          <input
            className="sidebar-add-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setAdding(false);
                setNewName("");
              }
            }}
            placeholder="项目名称"
            autoFocus
          />
        </div>
      ) : (
        <button className="sidebar-add-btn" onClick={() => setAdding(true)}>
          + 添加项目
        </button>
      )}
    </aside>
  );
}

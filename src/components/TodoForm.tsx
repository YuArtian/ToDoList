import { useState } from "react";

interface TodoFormProps {
  onAdd: (title: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed);
      setTitle("");
    }
  };

  if (!active) {
    return (
      <button className="add-task-btn" onClick={() => setActive(true)}>
        <span className="add-task-plus">+</span> 添加任务
      </button>
    );
  }

  return (
    <div className="add-task-form">
      <input
        className="add-task-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") {
            setActive(false);
            setTitle("");
          }
        }}
        placeholder="输入任务名称，按 Enter 添加"
        autoFocus
      />
      <div className="add-task-actions">
        <button className="btn-primary" onClick={handleSubmit}>
          添加
        </button>
        <button
          className="btn-cancel"
          onClick={() => {
            setActive(false);
            setTitle("");
          }}
        >
          取消
        </button>
      </div>
    </div>
  );
}

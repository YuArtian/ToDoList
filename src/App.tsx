import { useState } from "react";
import { Header } from "./components/Header";
import { CategorySidebar } from "./components/CategorySidebar";
import { TodoList } from "./components/TodoList";
import { TodoForm } from "./components/TodoForm";
import { useCategories } from "./hooks/useCategories";
import { useTodos } from "./hooks/useTodos";
import "./App.css";

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const refresh = () => setRefreshKey((k) => k + 1);

  const { categories, addCategory, removeCategory } =
    useCategories(refreshKey);
  const { todos, addTodo, editTodo, toggle, removeTodo, completedCount } =
    useTodos(selectedCategoryId, refreshKey);

  const selectedCategory = categories.find(
    (c) => c.id === selectedCategoryId
  );
  const contentTitle = selectedCategory ? selectedCategory.name : "全部";

  return (
    <div className="app">
      <Header
        totalCount={todos.length}
        completedCount={completedCount}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      {!collapsed && (
        <main className="main">
          {showSidebar && (
            <CategorySidebar
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={(id) => {
                setSelectedCategoryId(id);
                setShowSidebar(false);
              }}
              onAdd={async (name) => {
                await addCategory(name);
                refresh();
              }}
              onDelete={async (id) => {
                await removeCategory(id);
                if (selectedCategoryId === id) {
                  setSelectedCategoryId(null);
                }
                refresh();
              }}
            />
          )}
          <div className="content">
            <div className="content-header">
              <button
                className="category-toggle"
                onClick={() => setShowSidebar(!showSidebar)}
                title="切换项目列表"
              >
                #
              </button>
              <h2 className="content-title">{contentTitle}</h2>
            </div>
            <TodoList
              todos={todos}
              onToggle={async (id, completed) => {
                await toggle(id, completed);
                refresh();
              }}
              onEdit={async (id, title) => {
                await editTodo(id, title);
                refresh();
              }}
              onDelete={async (id) => {
                await removeTodo(id);
                refresh();
              }}
            />
            <TodoForm
              onAdd={async (title) => {
                await addTodo(title);
                refresh();
              }}
            />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;

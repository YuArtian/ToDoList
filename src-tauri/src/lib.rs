use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create tables",
        sql: "CREATE TABLE IF NOT EXISTS categories (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT NOT NULL,
                created_at  TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS todos (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                title         TEXT NOT NULL,
                completed     INTEGER NOT NULL DEFAULT 0,
                category_id   INTEGER,
                created_at    TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            );
            INSERT OR IGNORE INTO categories (id, name) VALUES (1, '默认');",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 2,
        description: "add sort_order to todos",
        sql: "ALTER TABLE todos ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:todolist.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

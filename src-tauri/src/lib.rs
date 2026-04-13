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
    },
    Migration {
        version: 3,
        description: "remove categories",
        sql: "ALTER TABLE todos DROP COLUMN category_id;
              DROP TABLE IF EXISTS categories;",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 4,
        description: "add notes to todos",
        sql: "ALTER TABLE todos ADD COLUMN notes TEXT NOT NULL DEFAULT '';",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:todolist.db", migrations)
                .build(),
        )
        .setup(|_app| {
            #[cfg(target_os = "macos")]
            {
                use tauri::Manager;
                use objc2::msg_send;
                use objc2::runtime::AnyObject;
                use objc2_app_kit::{NSColor, NSWindow};

                let window = _app
                    .get_webview_window("main")
                    .or_else(|| _app.webview_windows().values().next().cloned());

                if let Some(window) = window {
                    // 1) Make the NSWindow itself transparent so the rounded-corner
                    //    mask is not drawn over by the window's default backing.
                    if let Ok(ns_window_ptr) = window.ns_window() {
                        let ns_window = ns_window_ptr as *mut NSWindow;
                        unsafe {
                            let clear = NSColor::clearColor();
                            (*ns_window).setBackgroundColor(Some(&clear));
                            (*ns_window).setOpaque(false);
                        }
                    }

                    // 2) Apply a 16px corner-radius mask directly to the WKWebView's
                    //    backing CALayer. This clips any white bg the WKWebView may
                    //    draw regardless of macOS version / drawsBackground behavior.
                    let _ = window.with_webview(|webview| {
                        let wk_webview = webview.inner() as *mut AnyObject;
                        unsafe {
                            let _: () = msg_send![wk_webview, setWantsLayer: true];
                            let layer: *mut AnyObject = msg_send![wk_webview, layer];
                            if !layer.is_null() {
                                let radius: f64 = 16.0;
                                let _: () = msg_send![layer, setCornerRadius: radius];
                                let _: () = msg_send![layer, setMasksToBounds: true];
                            }
                        }
                    });
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

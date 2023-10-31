// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn openGame(gameLocation: &str) {
    open::that(gameLocation);
}

#[tauri::command]
fn openLibLocation() {
    open::that(format!("C:\\Users\\{}\\AppData\\Roaming\\com.adithya.clear", whoami::username()));
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![openGame, openLibLocation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

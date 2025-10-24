#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod commands;
use commands::config::{
    read_or_create_config,
    add_modpack,
    update_modpack,
    remove_modpack,
    get_modpack_by_id,
    get_modpack_by_path,
    list_modpacks
};

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_or_create_config,
            add_modpack,
            update_modpack,
            remove_modpack,
            get_modpack_by_id,
            get_modpack_by_path,
            list_modpacks
        ])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("Error while running tauri application.");
}

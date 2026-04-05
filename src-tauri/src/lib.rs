mod commands;
mod db;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            connect_db,
            get_dashboard_data,
            get_drug_monthly_qty,
            get_top_drugs,
            get_available_years,
            get_drug_list,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

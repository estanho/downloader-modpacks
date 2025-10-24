use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Modpack {
    pub id: u64,
    pub url: String,
    pub last_path: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    #[serde(default)]
    pub modpacks: Vec<Modpack>,
    #[serde(default)]
    next_id: u64,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            modpacks: Vec::new(),
            next_id: 1,
        }
    }
}

fn get_config_path() -> Result<PathBuf, String> {
    let exe_path = std::env::current_exe()
        .map_err(|e| format!("Failed to get executable path: {}", e))?;
    
    let exe_dir = exe_path
        .parent()
        .ok_or_else(|| "Could not determine executable directory".to_string())?;
    
    Ok(exe_dir.join("sn-config.json"))
}

fn read_config_file() -> Result<Config, String> {
    let path = get_config_path()?;
    
    if !path.exists() {
        return Ok(Config::default());
    }
    
    let content = match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(e) => {
            eprintln!("Error reading config file: {}. Creating new file.", e);
            let default = Config::default();
            write_config_file(&default)?;
            return Ok(default);
        }
    };
    
    if content.trim().is_empty() {
        eprintln!("Config file is empty. Recreating with default values.");
        let default = Config::default();
        write_config_file(&default)?;
        return Ok(default);
    }
    
    match serde_json::from_str::<Config>(&content) {
        Ok(config) => Ok(config),
        Err(e) => {
            eprintln!("Config file is corrupted: {}. Recreating with default values.", e);
            
            let backup_path = path.with_extension("json.backup");
            if let Err(backup_err) = fs::copy(&path, &backup_path) {
                eprintln!("Warning: could not create backup: {}", backup_err);
            } else {
                println!("Backup of corrupted file saved to: {:?}", backup_path);
            }
            
            let default = Config::default();
            write_config_file(&default)?;
            Ok(default)
        }
    }
}

fn write_config_file(config: &Config) -> Result<(), String> {
    let path = get_config_path()?;
    
    let json = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    
    fs::write(&path, &json)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    
    Ok(())
}

fn config_to_json(config: &Config) -> Result<String, String> {
    serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to convert config to JSON: {}", e))
}

#[tauri::command]
pub fn read_or_create_config() -> Result<String, String> {
    let config = read_config_file()?;
    config_to_json(&config)
}

#[tauri::command]
pub fn add_modpack(url: String, last_path: String) -> Result<String, String> {
    if url.trim().is_empty() {
        return Err("URL cannot be empty".to_string());
    }
    
    if last_path.trim().is_empty() {
        return Err("Path cannot be empty".to_string());
    }
    
    let mut config = read_config_file()?;
    
    if config.modpacks.iter().any(|m| m.last_path == last_path) {
        return Err(format!("A modpack with path '{}' already exists", last_path));
    }
    
    let id = config.next_id;
    config.next_id += 1;
    
    config.modpacks.push(Modpack { 
        id,
        url, 
        last_path: last_path.clone()
    });
    
    println!("New modpack added (ID: {}) for path: {}", id, last_path);
    
    write_config_file(&config)?;
    config_to_json(&config)
}

#[tauri::command]
pub fn update_modpack(id: u64, url: Option<String>, last_path: Option<String>) -> Result<String, String> {
    let mut config = read_config_file()?;
    
    let modpack = config.modpacks
        .iter_mut()
        .find(|m| m.id == id)
        .ok_or_else(|| format!("Modpack with ID {} not found", id))?;
    
    if let Some(new_url) = url {
        if new_url.trim().is_empty() {
            return Err("URL cannot be empty".to_string());
        }
        modpack.url = new_url;
    }
    
    if let Some(new_path) = last_path {
        if new_path.trim().is_empty() {
            return Err("Path cannot be empty".to_string());
        }
        
        modpack.last_path = new_path;
    }
    
    println!("Modpack updated (ID: {})", id);
    
    write_config_file(&config)?;
    config_to_json(&config)
}

#[tauri::command]
pub fn remove_modpack(id: u64) -> Result<String, String> {
    let mut config = read_config_file()?;
    let before_count = config.modpacks.len();
    
    config.modpacks.retain(|m| m.id != id);
    
    if config.modpacks.len() == before_count {
        return Err(format!("Modpack with ID {} not found", id));
    }
    
    println!("Modpack removed (ID: {})", id);
    write_config_file(&config)?;
    config_to_json(&config)
}

#[tauri::command]
pub fn get_modpack_by_id(id: u64) -> Result<String, String> {
    let config = read_config_file()?;
    
    let modpack = config.modpacks
        .iter()
        .find(|m| m.id == id)
        .ok_or_else(|| format!("Modpack with ID {} not found", id))?;
    
    serde_json::to_string_pretty(&modpack)
        .map_err(|e| format!("Failed to serialize modpack: {}", e))
}

#[tauri::command]
pub fn get_modpack_by_path(last_path: String) -> Result<String, String> {
    let config = read_config_file()?;
    
    let modpack = config.modpacks
        .iter()
        .find(|m| m.last_path == last_path)
        .ok_or_else(|| format!("Modpack with path '{}' not found", last_path))?;
    
    serde_json::to_string_pretty(&modpack)
        .map_err(|e| format!("Failed to serialize modpack: {}", e))
}

#[tauri::command]
pub fn list_modpacks() -> Result<String, String> {
    let config = read_config_file()?;
    serde_json::to_string_pretty(&config.modpacks)
        .map_err(|e| format!("Failed to serialize modpack list: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = Config::default();
        assert_eq!(config.modpacks.len(), 0);
        assert_eq!(config.next_id, 1);
    }

    #[test]
    fn test_modpack_creation() {
        let modpack = Modpack {
            id: 1,
            url: "https://github.com/user/repo".to_string(),
            last_path: "/path/to/minecraft".to_string(),
        };
        assert_eq!(modpack.id, 1);
        assert_eq!(modpack.url, "https://github.com/user/repo");
    }
}
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Modpack {
    pub id: u64,
    pub url: String,
    pub last_path: String,
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct Config {
    #[serde(default)]
    pub modpacks: Vec<Modpack>,
    #[serde(default = "default_next_id")]
    next_id: u64,
}

fn default_next_id() -> u64 {
    1
}

struct ConfigManager {
    path: PathBuf,
}

impl ConfigManager {
    fn new() -> Result<Self, String> {
        let exe_path = std::env::current_exe()
            .map_err(|e| format!("Failed to get executable path: {}", e))?;

        let exe_dir = exe_path
            .parent()
            .ok_or("Could not determine executable directory")?;

        Ok(Self {
            path: exe_dir.join("sn-config.json"),
        })
    }

    fn read(&self) -> Result<Config, String> {
        if !self.path.exists() {
            return Ok(Config::default());
        }

        let content = fs::read_to_string(&self.path).map_err(|e| {
            eprintln!("Error reading config file: {}", e);
            format!("Failed to read config file: {}", e)
        })?;

        if content.trim().is_empty() {
            eprintln!("Config file is empty. Using default values.");
            return Ok(Config::default());
        }

        serde_json::from_str(&content).or_else(|e| {
            eprintln!("Config file corrupted: {}. Creating backup.", e);
            self.create_backup()?;
            Ok(Config::default())
        })
    }

    fn write(&self, config: &Config) -> Result<(), String> {
        let json = serde_json::to_string_pretty(config)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;

        fs::write(&self.path, json)
            .map_err(|e| format!("Failed to write config file: {}", e))
    }

    fn create_backup(&self) -> Result<(), String> {
        let backup_path = self.path.with_extension("json.backup");
        fs::copy(&self.path, &backup_path)
            .map(|_| {
                println!("Backup created: {:?}", backup_path);
            })
            .map_err(|e| format!("Failed to create backup: {}", e))
    }
}

#[tauri::command]
pub fn read_or_create_config() -> Result<String, String> {
    let manager = ConfigManager::new()?;
    let config = manager.read()?;
    serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))
}

#[tauri::command]
pub fn add_modpack(url: String, last_path: String) -> Result<String, String> {
    let url = url.trim();
    let last_path = last_path.trim();

    if url.is_empty() {
        return Err("URL cannot be empty".to_string());
    }
    if last_path.is_empty() {
        return Err("Path cannot be empty".to_string());
    }

    let manager = ConfigManager::new()?;
    let mut config = manager.read()?;

    if config.modpacks.iter().any(|m| m.last_path == last_path) {
        return Err(format!("A modpack with path '{}' already exists", last_path));
    }

    let id = config.next_id;
    config.next_id += 1;

    config.modpacks.push(Modpack {
        id,
        url: url.to_string(),
        last_path: last_path.to_string(),
    });

    manager.write(&config)?;
    println!("Modpack added (ID: {})", id);

    serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))
}

#[tauri::command]
pub fn update_modpack(
    id: u64,
    url: Option<String>,
    last_path: Option<String>,
) -> Result<String, String> {
    let manager = ConfigManager::new()?;
    let mut config = manager.read()?;

    let modpack = config
        .modpacks
        .iter_mut()
        .find(|m| m.id == id)
        .ok_or_else(|| format!("Modpack with ID {} not found", id))?;

    if let Some(new_url) = url {
        let new_url = new_url.trim();
        if new_url.is_empty() {
            return Err("URL cannot be empty".to_string());
        }
        modpack.url = new_url.to_string();
    }

    if let Some(new_path) = last_path {
        let new_path = new_path.trim();
        if new_path.is_empty() {
            return Err("Path cannot be empty".to_string());
        }
        modpack.last_path = new_path.to_string();
    }

    manager.write(&config)?;
    println!("Modpack updated (ID: {})", id);

    serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))
}

#[tauri::command]
pub fn remove_modpack(id: u64) -> Result<String, String> {
    let manager = ConfigManager::new()?;
    let mut config = manager.read()?;

    let initial_len = config.modpacks.len();
    config.modpacks.retain(|m| m.id != id);

    if config.modpacks.len() == initial_len {
        return Err(format!("Modpack with ID {} not found", id));
    }

    manager.write(&config)?;
    println!("Modpack removed (ID: {})", id);

    serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))
}

#[tauri::command]
pub fn get_modpack_by_id(id: u64) -> Result<String, String> {
    let manager = ConfigManager::new()?;
    let config = manager.read()?;

    let modpack = config
        .modpacks
        .iter()
        .find(|m| m.id == id)
        .ok_or_else(|| format!("Modpack with ID {} not found", id))?;

    serde_json::to_string_pretty(&modpack)
        .map_err(|e| format!("Failed to serialize modpack: {}", e))
}

#[tauri::command]
pub fn get_modpack_by_path(last_path: String) -> Result<String, String> {
    let manager = ConfigManager::new()?;
    let config = manager.read()?;

    let modpack = config
        .modpacks
        .iter()
        .find(|m| m.last_path == last_path)
        .ok_or_else(|| format!("Modpack with path '{}' not found", last_path))?;

    serde_json::to_string_pretty(&modpack)
        .map_err(|e| format!("Failed to serialize modpack: {}", e))
}

#[tauri::command]
pub fn list_modpacks() -> Result<String, String> {
    let manager = ConfigManager::new()?;
    let config = manager.read()?;

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
import { configSchema, type IConfig } from "@/types/config";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

interface IModpack {
  id: number;
  url: string;
  last_path: string;
}

export function useConfig() {
  const [config, setConfig] = useState<IConfig | null>(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig(): Promise<void> {
    setIsLoading(true);
    setError(false);
    setErrorMessage(null);

    try {
      const data = await invoke<string>("read_or_create_config");
      const parsed = JSON.parse(data);
      const result = configSchema.safeParse(parsed);

      if (!result.success) {
        const firstError = result.error.issues[0];
        setError(true);
        setErrorMessage(`${firstError.path.join(".")}: ${firstError.message}`);
        setConfig(null);
      } else {
        setConfig(result.data);
        setError(false);
        setErrorMessage(null);
      }
    } catch (err) {
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load config"
      );
      setConfig(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function addModpack(url: string, lastPath: string): Promise<boolean> {
    try {
      await invoke<string>("add_modpack", { url, lastPath });
      await loadConfig();
      return true;
    } catch (err) {
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to add modpack"
      );
      return false;
    }
  }

  async function updateModpack(
    id: number,
    url?: string,
    lastPath?: string
  ): Promise<boolean> {
    try {
      await invoke<string>("update_modpack", { id, url, lastPath });
      await loadConfig();
      return true;
    } catch (err) {
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to update modpack"
      );
      return false;
    }
  }

  async function removeModpack(id: number): Promise<boolean> {
    try {
      await invoke<string>("remove_modpack", { id });
      await loadConfig();
      return true;
    } catch (err) {
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to remove modpack"
      );
      return false;
    }
  }

  async function getModpackById(id: number) {
    try {
      const data = await invoke<string>("get_modpack_by_id", { id });
      return JSON.parse(data) as IModpack;
    } catch (err) {
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to get modpack"
      );
      return null;
    }
  }

  async function getModpackByPath(lastPath: string) {
    try {
      const data = await invoke<string>("get_modpack_by_path", { lastPath });
      return JSON.parse(data) as IModpack;
    } catch (err) {
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to get modpack"
      );
      return null;
    }
  }

  return {
    config,
    error,
    errorMessage,
    isLoading,
    loadConfig,
    addModpack,
    updateModpack,
    removeModpack,
    getModpackById,
    getModpackByPath,
  };
}

import { useConfig } from "@/hooks/use-config";
import { appDataDir, join } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { exists } from "@tauri-apps/plugin-fs";
import { useState } from "react";

const REQUIRED_ITEMS = ["launcher_profiles.json", "versions"];
const OPTIONAL_ITEMS = ["assets", "mods", "config", "saves", "resourcepacks"];

const FOLDER_REGEX = /^[a-zA-Z]:\\(?:[^<>:"/\\|?*\n]+(\\|))*$/;

export function useSelectDir() {
  const { updateModpack } = useConfig();
  const [selectedDir, setSelectedDir] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [missingItems, setMissingItems] = useState<string[]>([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function selectDir(path: string) {
    try {
      setIsSelecting(true);
      setError(false);
      setErrorMessage(null);
      if (path) {
        path = await join(path);
        setSelectedDir(path);
      }
    } catch (err) {
      setSelectedDir(null);
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to read directory"
      );
    } finally {
      setIsSelecting(false);
    }
  }

  async function openDir(url: string, path: string) {
    try {
      setIsSelecting(true);
      setError(false);
      setErrorMessage(null);

      const appdata = await appDataDir();

      if (path && FOLDER_REGEX.test(path)) {
        path = await join(path);
      }

      const defaultPath = path !== undefined ? path : appdata;

      const selected = await open({
        directory: true,
        multiple: false,
        title: "Selecione o diretório do Minecraft",
        defaultPath,
      });

      setSelectedDir(selected);

      if (selected) {
        updateModpack(0, url, selected);
        validateMinecraftStructure(selected);
      }
    } catch (err) {
      setSelectedDir(null);
      setError(true);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to read directory"
      );
    } finally {
      setIsSelecting(false);
    }
  }

  async function validateMinecraftStructure(path: string) {
    setIsValidating(true);
    setError(false);
    setErrorMessage(null);

    const foundItems: string[] = [];
    const missingItems: string[] = [];

    try {
      for (const item of REQUIRED_ITEMS) {
        const itemPath = await join(path, item);
        if (await exists(itemPath)) {
          foundItems.push(item);
        } else {
          missingItems.push(item);
        }
      }

      for (const item of OPTIONAL_ITEMS) {
        const itemPath = await join(path, item);
        if (await exists(itemPath)) {
          foundItems.push(item);
        }
      }

      setIsValid(missingItems.length === 0);
      setFoundItems(foundItems);
      setMissingItems(missingItems);
      setError(false);
      setErrorMessage(null);
    } catch (err) {
      setIsValid(false);
      setFoundItems([]);
      setMissingItems([]);
      setError(true);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to load Minecraft structure"
      );
    } finally {
      setIsValidating(false);
    }
  }

  return {
    selectedDir,
    isSelecting,
    isValid,
    foundItems,
    missingItems,
    error,
    errorMessage,
    isValidating,
    selectDir,
    openDir,
    validateMinecraftStructure,
  };
}

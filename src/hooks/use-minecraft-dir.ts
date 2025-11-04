import { appDataDir, join } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { exists } from "@tauri-apps/plugin-fs";
import { useState } from "react";

const REQUIRED_FILES = ["launcher_profiles.json", "versions"];

interface MinecraftDirState {
  path: string | null;
  isValid: boolean | null;
  isLoading: boolean;
  error: string | null;
}

export function useMinecraftDir() {
  const [state, setState] = useState<MinecraftDirState>({
    path: null,
    isValid: null,
    isLoading: false,
    error: null,
  });

  async function openDialog() {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const appdata = await appDataDir();
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Selecione o diretório do Minecraft",
        defaultPath: appdata,
      });

      if (!selected) {
        setState((prev) => ({
          ...prev,
          path: null,
          isValid: null,
          isLoading: false,
        }));
        return;
      }

      await validateAndSet(selected);
    } catch (err) {
      setState({
        path: null,
        isValid: false,
        isLoading: false,
        error:
          err instanceof Error ? err.message : "Erro ao selecionar diretório",
      });
    }
  }

  async function validateAndSet(dirPath: string) {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const normalizedPath = await join(dirPath);

      let isValid = true;

      for (const item of REQUIRED_FILES) {
        const itemPath = await join(normalizedPath, item);

        if (!(await exists(itemPath))) {
          isValid = false;
          break;
        }
      }

      const error = isValid ? null : "Diretório inválido para o Minecraft";

      setState({
        path: normalizedPath,
        isValid,
        isLoading: false,
        error,
      });
    } catch (err) {
      setState({
        path: null,
        isValid: false,
        isLoading: false,
        error: err instanceof Error ? err.message : "Erro ao validar diretório",
      });
    }
  }

  return {
    openDialog,
    dir: {
      path: state.path,
      isValid: state.isValid,
      isLoading: state.isLoading,
      error: state.error,
    },
  };
}

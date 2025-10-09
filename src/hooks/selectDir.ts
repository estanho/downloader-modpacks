import { appDataDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

interface ISelectedDir {
  selectedDir: string | null;
  error: boolean;
  isValidating: boolean;
  selectDir: () => void;
}

export function useSelectDir(): ISelectedDir {
  const [selectedDir, setSelectedDir] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  async function selectDir() {
    try {
      setIsValidating(true);
      setError(false);

      const appdata = await appDataDir();

      const selected = await open({
        directory: true,
        multiple: false,
        title: "Selecione o diretório do Minecraft",
        defaultPath: appdata,
      });

      setSelectedDir(selected);
    } catch (err) {
      console.error("Erro ao ler diretório:", err);
      setError(true);
      setSelectedDir(null);
    } finally {
      setIsValidating(false);
    }
  }

  return {
    selectedDir,
    error,
    isValidating,
    selectDir,
  };
}

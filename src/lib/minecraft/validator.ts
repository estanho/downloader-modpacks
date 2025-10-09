import { join } from "@tauri-apps/api/path";
import { exists, readTextFile } from "@tauri-apps/plugin-fs";

const REQUIRED_ITEMS = ["launcher_profiles.json", "versions"];
const OPTIONAL_ITEMS = ["assets", "mods", "config", "saves", "resourcepacks"];

interface IMinecraftStructure {
  isValid: boolean;
  foundItems: string[];
  missingItems: string[];
}

interface IManifest {
  hasManifest: boolean;
  manifestError: boolean;
  manifestData?: any;
}

export async function validateMinecraftStructure(
  path: string
): Promise<IMinecraftStructure> {
  const foundItems: string[] = [];
  const missingItems: string[] = [];

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

  return {
    isValid: missingItems.length === 0,
    foundItems,
    missingItems,
  };
}

export async function validateManifest(path: string): Promise<IManifest> {
  const manifestPath = await join(path, ".sn-manifest.json");
  const hasManifest = await exists(manifestPath);

  let manifestData;
  let manifestError = false;

  if (hasManifest) {
    try {
      const manifestText = await readTextFile(manifestPath);
      manifestData = JSON.parse(manifestText);
    } catch (err) {
      console.error("Erro ao ler manifesto:", err);
      manifestError = true;
    }
  }

  return {
    hasManifest,
    manifestError,
    manifestData,
  };
}

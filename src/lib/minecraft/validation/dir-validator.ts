import { manifestSchema, type IManifest } from "@/types/manifest";
import { join } from "@tauri-apps/api/path";
import { exists, readTextFile } from "@tauri-apps/plugin-fs";

const REQUIRED_ITEMS = ["launcher_profiles.json", "versions"];
const OPTIONAL_ITEMS = ["assets", "mods", "config", "saves", "resourcepacks"];

interface IMinecraftStructure {
  isValid: boolean;
  foundItems: string[];
  missingItems: string[];
}

interface IManifestValidation {
  hasManifest: boolean;
  isValid: boolean;
  manifestData: IManifest | null;
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

export async function validateManifest(
  path: string
): Promise<IManifestValidation> {
  const manifestPath = await join(path, ".sn-manifest.json");
  const hasManifest = await exists(manifestPath);

  if (!hasManifest) {
    return {
      hasManifest: false,
      isValid: false,
      manifestData: null,
    };
  }

  try {
    const manifestText = await readTextFile(manifestPath);

    if (!manifestText || manifestText.trim() === "") {
      return {
        hasManifest: true,
        isValid: false,
        manifestData: null,
      };
    }

    const rawData = JSON.parse(manifestText);
    const result = manifestSchema.safeParse(rawData);

    if (!result.success) {
      return {
        hasManifest: true,
        isValid: false,
        manifestData: null,
      };
    }

    return {
      hasManifest: true,
      isValid: true,
      manifestData: result.data,
    };
  } catch (err) {
    console.error(
      "Erro ao validar manifest:",
      err instanceof Error ? err.message : "Erro desconhecido"
    );

    return {
      hasManifest: true,
      isValid: false,
      manifestData: null,
    };
  }
}

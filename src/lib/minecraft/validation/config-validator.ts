import { configSchema, type IConfig } from "@/types/config";
import { invoke } from "@tauri-apps/api/core";

interface IConfigValidation {
  config: IConfig | null;
  error: boolean;
  error_messages?: string;
}

export async function validateConfig() {
  const config = await getConfig();
  console.log(config);
}

async function getConfig(): Promise<IConfigValidation> {
  const data = await invoke<string>("read_or_create_config");
  const result = configSchema.safeParse(JSON.parse(data));

  if (result.error) {
    return {
      config: null,
      error: true,
      error_messages: result.error.issues[0].message,
    };
  }

  return {
    config: result.data,
    error: false,
  };
}

import { z } from "zod";

export const configSchema = z.object({
  modpacks: z.array(
    z.object({
      url: z.url(),
      last_path: z.string(),
    })
  ),
});

export type IConfig = z.infer<typeof configSchema>;

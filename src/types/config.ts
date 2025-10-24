import { z } from "zod";

export const configSchema = z.object({
  modpacks: z.array(
    z.object({
      id: z.number(),
      url: z.url(),
      last_path: z.string(),
    })
  ),
  next_id: z.number(),
});

export type IConfig = z.infer<typeof configSchema>;

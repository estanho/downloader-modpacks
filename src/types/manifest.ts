import { z } from "zod";

export const manifestSchema = z.object({
  schemaVersion: z.string(),

  minecraft: z.object({
    version: z.string(),
    modLoader: z.enum(["forge", "fabric", "neoforge", "quilt"]),
    modLoaderVersion: z.string(),
  }),

  modpack: z.object({
    id: z.string(),
    name: z.string(),
    version: z.string(),
    lastUpdated: z.string(),
    url: z.string(),

    package: z.object({
      fileName: z.string(),
      size: z.number(),
      hash: z.string(),
    }),

    contents: z.object({
      mods: z.number(),
      modsList: z.array(
        z.object({
          name: z.string(),
          version: z.string(),
        })
      ),
    }),
  }),
});

export type IManifest = z.infer<typeof manifestSchema>;

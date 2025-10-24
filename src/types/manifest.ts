import { z } from "zod";

export const manifestSchema = z.object({
  minecraft: z.object({
    version: z.string(),
    modLoader: z.enum(["forge", "fabric", "neoforge", "quilt"]),
    modLoaderVersion: z.string(),
  }),

  modpack: z.object({
    name: z.string(),
    version: z.string(),
    lastUpdated: z.date(),

    package: z.object({
      url: z.url(),
      fileName: z.string(),
      size: z.number(),
      hash: z.string(),
    }),
  }),

  archives: z.array(
    z.object({
      path: z.string(),
      type: z.enum(["directory", "file"]),

      file: z.object({
        name: z.string(),
        size: z.number(),
        hash: z.string(),
      }),
    })
  ),
});

export type IManifest = z.infer<typeof manifestSchema>;

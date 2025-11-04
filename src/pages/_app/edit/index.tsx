import SelectModpack from "@/components/select-modpack";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useConfig } from "@/hooks/use-config";
import { useSelectDir } from "@/hooks/use-minecraft-dir";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { config, error, errorMessage, isLoading } = useConfig();
  const { selectedDir, isSelecting, selectDir, openDir } = useSelectDir();

  const [url, setUrl] = useState<string>("");
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    if (config && config.modpacks.length > 0) {
      const modpack = config.modpacks[0];
      setUrl(modpack.url);
      setPath(modpack.last_path);
      selectDir(modpack.last_path);
    }
  }, [config]);

  return (
    <>
      <FieldSet>
        <FieldLegend>
          <span className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Editar modpack
          </span>
        </FieldLegend>
        <FieldDescription>
          Edite um modpack já existente no seu Minecraft.
        </FieldDescription>

        <FieldGroup>
          <div className="flex gap-2">
            <SelectModpack config={config} />
            <Button
              variant={"destructive"}
              size={"icon"}
              disabled={isLoading || config?.modpacks.length === 0}
            >
              <Trash />
            </Button>
          </div>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Endereço de download do modpack</FieldLabel>
            <Input
              placeholder="Digite o endereço de download do modpack"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading || config?.modpacks.length === 0}
            />
            {error && (
              <FieldDescription className="text-red-600 dark:text-red-400">
                {errorMessage}
              </FieldDescription>
            )}
            <FieldDescription>
              Esse link deve ser disponibilizado pelo servidor que utiliza o
              modpack.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field>
            <FieldLabel>Selecione o diretório do Minecraft</FieldLabel>
            <Button
              onClick={() => openDir(url, path)}
              variant={selectedDir ? "secondary" : "outline"}
              disabled={isLoading || config?.modpacks.length === 0}
            >
              {isSelecting
                ? "..."
                : selectedDir
                  ? selectedDir
                  : "Selecione o diretório"}
            </Button>
            <FieldDescription>
              Você deve selecionar a pasta onde o Minecraft está instalado.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="grid grid-cols-2 gap-2">
        <Button className="cursor-default" variant={"outline"} asChild>
          <Link to={"/"}>Voltar</Link>
        </Button>
        <Button className="cursor-default" asChild>
          <Link to={"/"}>Editar</Link>
        </Button>
      </div>
    </>
  );
}

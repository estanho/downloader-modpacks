import SelectModpack from "@/components/select-modpack";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useConfig } from "@/hooks/use-config";
import { useSelectDir } from "@/hooks/use-select-dir";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/create/")({
  component: Create,
});

export default function Create() {
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
    <FieldSet>
      {config && config.modpacks.length > 0 && (
        <FieldGroup>
          <Field>
            <FieldLabel>Selecione o modpack</FieldLabel>
            <SelectModpack config={config} />
          </Field>
        </FieldGroup>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel>Endereço de download do modpack</FieldLabel>
          <Input
            placeholder="Digite o endereço de download"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
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
            variant={selectedDir ? "secondary" : "default"}
            className="w-full"
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
  );
}

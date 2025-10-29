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
import { useSelectDir } from "@/hooks/use-select-dir";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
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
    <>
      <FieldSet>
        <FieldLegend>
          <span className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Novo modpack
          </span>
        </FieldLegend>
        <FieldDescription>
          Adicione um novo modpack para o seu Minecraft.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel>Endereço de download do modpack</FieldLabel>
            <Input
              placeholder="Digite o endereço de download do modpack"
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
              variant={selectedDir ? "secondary" : "outline"}
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
          <Link to={"/"}>Criar</Link>
        </Button>
      </div>
    </>
  );
}

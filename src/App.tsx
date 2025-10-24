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
import { useEffect, useState } from "react";

export default function App() {
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
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <FieldSet>
        <FieldLegend>Bem Vindo(a) ao Downloader ModPacks Sn50</FieldLegend>
        <FieldDescription>
          Esse programa facilita a instalação e configuração correta de
          modpacks.
        </FieldDescription>

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
    </main>
  );
}

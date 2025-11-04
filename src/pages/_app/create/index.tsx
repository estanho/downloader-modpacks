import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMinecraftDir } from "@/hooks/use-minecraft-dir";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/create/")({
  component: Create,
});

export default function Create() {
  const { openDialog, dir } = useMinecraftDir();

  const [url, setUrl] = useState("");

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
              placeholder="https://exemplo.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <FieldDescription>
              Esse link deve ser disponibilizado pelo servidor que utiliza o
              modpack.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <FieldGroup>
          <Field data-invalid={!dir.isValid}>
            <FieldLabel>Diretório do Minecraft</FieldLabel>

            <Button
              onClick={() => openDialog()}
              variant={"outline"}
              className={dir.isValid ? "text-green-400" : ""}
              disabled={dir.isLoading}
              aria-invalid={!dir.isValid}
            >
              {dir.isLoading
                ? "Carregando..."
                : dir.path || "Selecione o diretório"}
            </Button>

            <FieldError hidden={dir.isValid ?? true}>{dir.error}</FieldError>

            <FieldDescription>
              Selecione onde está instalado o seu Minecraft.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" asChild>
          <Link to="/">Voltar</Link>
        </Button>
        <Button disabled={!url || !dir.isValid}>Criar</Button>
      </div>
    </>
  );
}

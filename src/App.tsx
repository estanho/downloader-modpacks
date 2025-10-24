import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { validateConfig } from "@/lib/minecraft/validation/config-validator";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    validateConfig();
  }, []);

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
            <Input placeholder="Digite o endereço de download" />
            <FieldDescription>
              Esse link deve ser disponibilizado pelo servidor que utiliza o
              modpack.{" "}
              <span className="font-bold">
                NÃO utilize links de fontes que não sejam confiáveis!
              </span>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </main>
  );
}

export default App;

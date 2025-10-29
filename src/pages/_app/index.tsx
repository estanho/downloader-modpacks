import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownCircle, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/")({
  component: App,
});

function App() {
  const [option, setOption] = useState<string>("create");

  return (
    <>
      <FieldSet>
        <FieldGroup>
          <FieldLabel htmlFor="compute-environment-p8w">
            O que você deseja fazer?
          </FieldLabel>
          <RadioGroup
            defaultValue="create"
            value={option}
            onValueChange={setOption}
          >
            <FieldLabel>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    <PlusCircle className="h-5 w-5" />
                    Novo Modpack
                  </FieldTitle>
                  <FieldDescription>
                    Instale um novo modpack para o seu Minecraft.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="create" />
              </Field>
            </FieldLabel>
            <FieldLabel>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    <ArrowDownCircle className="h-5 w-5" />
                    Atualizar Modpack
                  </FieldTitle>
                  <FieldDescription>
                    Atualize um modpack já existente no seu Minecraft.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="update" />
              </Field>
            </FieldLabel>
            <FieldLabel>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    <Pencil className="h-4 w-4" />
                    Editar Modpack
                  </FieldTitle>
                  <FieldDescription>
                    Edite o modpack já existente no seu Minecraft.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="edit" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldGroup>
      </FieldSet>

      <div className="grid grid-cols-1">
        <Button className="cursor-default" asChild>
          <Link to={option}>Próximo</Link>
        </Button>
      </div>
    </>
  );
}

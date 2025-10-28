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
  const [value, setValue] = useState<string>("create");

  return (
    <div className="space-y-8">
      <FieldSet>
        <FieldGroup>
          <FieldLabel htmlFor="compute-environment-p8w">
            O que você deseja fazer?
          </FieldLabel>
          <RadioGroup
            defaultValue="create"
            value={value}
            onValueChange={setValue}
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

      <Button className="w-full cursor-default" asChild>
        <Link to={value}>Próximo</Link>
      </Button>
    </div>
  );
}

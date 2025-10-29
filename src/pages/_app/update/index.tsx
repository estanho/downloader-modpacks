import SelectModpack from "@/components/select-modpack";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useConfig } from "@/hooks/use-config";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownCircle } from "lucide-react";

export const Route = createFileRoute("/_app/update/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { config } = useConfig();

  return (
    <>
      <FieldSet>
        <FieldLegend>
          <span className="flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5" />
            Atualizar modpack
          </span>
        </FieldLegend>
        <FieldDescription>
          Edite um modpack já existente no seu Minecraft.
        </FieldDescription>

        <FieldGroup>
          <SelectModpack config={config} />
        </FieldGroup>

        <FieldGroup>Status ...</FieldGroup>
      </FieldSet>

      <div className="grid grid-cols-2 gap-2">
        <Button className="cursor-default" variant={"outline"} asChild>
          <Link to={"/"}>Voltar</Link>
        </Button>
        <Button className="cursor-default" asChild>
          <Link to={"/"}>Atualizar</Link>
        </Button>
      </div>
    </>
  );
}

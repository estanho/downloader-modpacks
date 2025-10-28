import { Separator } from "@/components/ui/separator";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header>
        <div>
          <h1 className="mb-1 font-medium">
            Bem Vindo(a) ao Downloader ModPacks Sn50
          </h1>
          <p className="text-muted-foreground text-sm font-normal">
            Esse programa facilita a instalação e configuração correta de
            modpacks.
          </p>
        </div>
      </header>

      <Separator />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

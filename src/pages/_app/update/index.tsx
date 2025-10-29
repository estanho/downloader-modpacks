import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/update/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/update/"!</div>;
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IConfig } from "@/types/config";

export default function SelectModpack({ config }: { config: IConfig | null }) {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o modpack" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Modpacks</SelectLabel>
          {config &&
            config.modpacks.map((modpack, index) => (
              <SelectItem key={index} value={String(modpack.id)}>
                {modpack.url}
              </SelectItem>
            ))}
          {config && config.modpacks.length === 0 && (
            <SelectItem disabled value="0">
              Nenhum modpack encontrado
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

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

export default function SelectModpack({ config }: { config: IConfig }) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione o modpack" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Modpacks</SelectLabel>
          {config.modpacks.map((modpack, index) => (
            <SelectItem key={index} value={String(modpack.id)}>
              {modpack.url}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

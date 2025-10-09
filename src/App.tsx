import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useSelectDir } from "@/hooks/selectDir";
import {
  validateManifest,
  validateMinecraftStructure,
} from "@/lib/minecraft/validator";
import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react"; // Adicionar useState e useEffect

interface ValidationResult {
  isValid: boolean;
  foundItems: string[];
  missingItems: string[];
  hasManifest: boolean;
  manifestData?: {
    version: string;
    lastUpdate: string;
  };
  manifestError?: boolean;
}

function App() {
  const { selectDir, selectedDir, isValidating } = useSelectDir();
  const [validation, setValidation] = useState<ValidationResult>();

  useEffect(() => {
    if (selectedDir) {
      handleValidation(selectedDir);
    }
  }, [selectedDir]);

  async function handleValidation(path: string) {
    const structure = await validateMinecraftStructure(path);
    const manifest = await validateManifest(path);

    setValidation({
      isValid: structure.isValid,
      foundItems: structure.foundItems,
      missingItems: structure.missingItems,
      hasManifest: manifest.hasManifest,
      manifestData: manifest.manifestData,
      manifestError: manifest.manifestError,
    });
  }

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
            <FieldLabel>Selecione o diretório do Minecraft</FieldLabel>
            <Button
              onClick={selectDir}
              variant={selectedDir ? "outline" : "default"}
              className="w-full"
            >
              {isValidating
                ? "..."
                : selectedDir
                  ? selectedDir
                  : "Selecione o diretório"}
            </Button>
            <FieldDescription>
              Você deve selecionar a pasta &quot;.minecraft&quot; ou a pasta que
              você configurou no launcher.
            </FieldDescription>
          </Field>
        </FieldGroup>

        <FieldGroup>
          {validation && (
            <div className="space-y-4">
              <div
                className={`rounded-lg border p-2 ${
                  validation.isValid
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                    : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                }`}
              >
                <div className="flex items-center gap-2">
                  {validation.isValid ? (
                    <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <CircleX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={`font-semibold ${
                      validation.isValid
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {validation.isValid
                      ? "Pasta do Minecraft válida!"
                      : "Pasta inválida do Minecraft"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Estrutura encontrada:</h3>
                <div className="grid grid-cols-3 gap-2">
                  {validation.foundItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded bg-gray-50 p-2 text-sm dark:bg-gray-800"
                    >
                      <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {validation.hasManifest && validation.manifestData && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <div className="flex items-start gap-2">
                    <CircleAlert className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-semibold text-blue-800 dark:text-blue-200">
                        Configuração existente encontrada
                      </p>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        Versão instalada: {validation.manifestData.version}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Última atualização: {validation.manifestData.lastUpdate}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {validation.missingItems.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                    Arquivos obrigatórios faltando:
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {validation.missingItems.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded bg-red-50 p-2 text-sm dark:bg-red-900"
                      >
                        <CircleX className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-red-700 dark:text-red-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validation.isValid && (
                <Button className="mt-4 w-full">
                  {validation.hasManifest
                    ? "Verificar atualizações"
                    : "Instalar modpack"}
                </Button>
              )}
            </div>
          )}
        </FieldGroup>
      </FieldSet>
    </main>
  );
}

export default App;

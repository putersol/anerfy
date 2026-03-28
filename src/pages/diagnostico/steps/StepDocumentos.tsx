import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DiagnosticoForm, DOCUMENT_NAMES } from "../schema";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

const STATUS_OPTIONS: [string, string, string][] = [
  ["tengo", "Tengo", "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"],
  ["en_proceso", "En proceso", "bg-amber-500/20 text-amber-300 border-amber-500/30"],
  ["no_tengo", "No tengo", "bg-red-500/20 text-red-300 border-red-500/30"],
];

export default function StepDocumentos({ form }: Props) {
  const { setValue, watch } = form;
  const documentos = watch("documentos") || {};

  const tengoCount = Object.values(documentos).filter((v) => v === "tengo").length;
  const enProcesoCount = Object.values(documentos).filter((v) => v === "en_proceso").length;

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Marca el estado de cada documento. Esto nos ayuda a evaluar qué tan avanzado está tu expediente.
      </p>

      <div className="flex gap-3 text-xs text-slate-400">
        <span className="text-emerald-400">{tengoCount} listos</span>
        <span className="text-amber-400">{enProcesoCount} en proceso</span>
        <span className="text-red-400">{14 - tengoCount - enProcesoCount} pendientes</span>
      </div>

      <div className="space-y-3">
        {DOCUMENT_NAMES.map((doc, i) => {
          const key = `doc_${i}`;
          const currentVal = documentos[key] || "no_tengo";

          return (
            <div key={key} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <Label className="text-slate-200 text-sm font-medium block mb-2">{doc}</Label>
              <RadioGroup
                value={currentVal}
                onValueChange={(v) => {
                  setValue("documentos", { ...documentos, [key]: v });
                }}
                className="flex flex-wrap gap-2"
              >
                {STATUS_OPTIONS.map(([val, lbl, cls]) => (
                  <label
                    key={val}
                    className={`flex items-center gap-1.5 cursor-pointer text-xs px-3 py-1.5 rounded-full border transition-all ${
                      currentVal === val ? cls : "border-white/10 text-slate-500"
                    }`}
                  >
                    <RadioGroupItem value={val} className="h-3 w-3" />
                    {lbl}
                  </label>
                ))}
              </RadioGroup>
            </div>
          );
        })}
      </div>
    </div>
  );
}

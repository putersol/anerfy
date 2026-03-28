import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiagnosticoForm } from "../schema";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

export default function StepMotivacion({ form }: Props) {
  const { register, watch, formState: { errors } } = form;
  const motivacion = watch("motivacion") || "";

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200 text-base">
          ¿Por qué quieres ejercer medicina en Alemania y qué esperas lograr?
        </Label>
        <p className="text-slate-400 text-sm mt-1.5 mb-4 leading-relaxed">
          Cuéntanos tu historia, tus motivaciones y tus metas. Esto nos ayuda a
          personalizar tu asesoría y entender qué es lo más importante para ti.
        </p>
        <Textarea
          {...register("motivacion")}
          placeholder="Comparte tu motivación aquí..."
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[180px] text-base leading-relaxed"
        />
        <div className="flex justify-between items-center mt-1.5">
          {errors.motivacion ? (
            <p className="text-red-400 text-sm">{errors.motivacion.message}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${motivacion.length >= 10 ? "text-slate-500" : "text-slate-600"}`}>
            {motivacion.length} caracteres
          </span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-slate-400 text-sm leading-relaxed">
          <span className="text-blue-400 font-medium">Tip:</span> No hay respuestas incorrectas.
          Queremos conocer tu situación real para poder ayudarte mejor.
          Mientras más detalles compartas, más preciso será tu plan personalizado.
        </p>
      </div>
    </div>
  );
}

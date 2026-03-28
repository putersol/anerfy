import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiagnosticoForm, GERMAN_LEVELS } from "../schema";
import { RadioPills, SectionDivider } from "../components";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

export default function StepVisa({ form }: Props) {
  const { setValue, watch, formState: { errors } } = form;
  const viajaConPareja = watch("viajaConPareja");

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200">¿Qué tipo de visa planeas solicitar?</Label>
        <p className="text-slate-500 text-xs mt-0.5">Cada visa tiene requisitos diferentes</p>
        <Select onValueChange={(v) => setValue("tipoVisa", v)} value={watch("tipoVisa")}>
          <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trabajo">Visa de trabajo</SelectItem>
            <SelectItem value="busqueda_empleo">Visa de búsqueda de empleo</SelectItem>
            <SelectItem value="estudio">Visa de estudio</SelectItem>
            <SelectItem value="oportunidad">Chancenkarte (tarjeta de oportunidad)</SelectItem>
            <SelectItem value="no_se">No sé aún</SelectItem>
          </SelectContent>
        </Select>
        {errors.tipoVisa && <p className="text-red-400 text-sm mt-1">{errors.tipoVisa.message}</p>}
      </div>

      <SectionDivider label="Pareja" />

      <RadioPills form={form} name="viajaConPareja" label="¿Planeas viajar con tu pareja?" />

      {viajaConPareja === "si" && (
        <>
          <RadioPills form={form} name="parejaHablaAleman" label="¿Tu pareja habla alemán?" helper="El nivel A1 es requisito mínimo para visa familiar" />

          <div>
            <Label className="text-slate-200">Nivel de alemán de tu pareja</Label>
            <Select onValueChange={(v) => setValue("nivelAlemanPareja", v)} value={watch("nivelAlemanPareja")}>
              <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {GERMAN_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-200">¿Tu pareja tiene profesión universitaria?</Label>
            <Select onValueChange={(v) => setValue("parejaProfesion", v)} value={watch("parejaProfesion")}>
              <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si_medicina">Sí, también es médico/a</SelectItem>
                <SelectItem value="si_otra">Sí, otra profesión</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}

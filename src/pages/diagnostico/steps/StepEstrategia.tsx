import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DiagnosticoForm } from "../schema";
import { RadioPills, SectionDivider } from "../components";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

const SPECIALTIES = [
  "Medicina interna",
  "Cirugía",
  "Urgencias / Medicina de emergencia",
  "Rehabilitación",
  "Geriatría",
  "Psiquiatría",
  "Anestesiología",
  "Pediatría",
  "Ginecología",
  "Otra",
];

export default function StepEstrategia({ form }: Props) {
  const { register, setValue, watch } = form;
  const dispuestoEspecialidades = watch("dispuestoEspecialidades") || [];

  const toggleSpecialty = (spec: string) => {
    const current = dispuestoEspecialidades;
    const updated = current.includes(spec)
      ? current.filter((s) => s !== spec)
      : [...current, spec];
    setValue("dispuestoEspecialidades", updated);
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200">Especialidad de mayor interés</Label>
        <p className="text-slate-500 text-xs mt-0.5">Para trabajar en Alemania</p>
        <Input {...register("especialidadInteres")} placeholder="Ej: Medicina interna" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
      </div>

      <div>
        <Label className="text-slate-200 block mb-1">¿En cuáles áreas estarías dispuesto/a a trabajar?</Label>
        <p className="text-slate-500 text-xs mb-3">Selecciona todas las que apliquen</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SPECIALTIES.map((spec) => (
            <label
              key={spec}
              className={`flex items-center gap-2.5 cursor-pointer text-sm p-3 rounded-xl border transition-all min-h-[44px] ${
                dispuestoEspecialidades.includes(spec)
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Checkbox
                checked={dispuestoEspecialidades.includes(spec)}
                onCheckedChange={() => toggleSpecialty(spec)}
              />
              {spec}
            </label>
          ))}
        </div>
      </div>

      <SectionDivider label="Experiencia previa" />

      <RadioPills form={form} name="haAplicadoHospitales" label="¿Has aplicado a hospitales alemanes?" />
      <RadioPills form={form} name="haTenidoEntrevistas" label="¿Has tenido entrevistas con hospitales o clínicas?" />
    </div>
  );
}

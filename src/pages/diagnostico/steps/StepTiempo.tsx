import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiagnosticoForm } from "../schema";
import { RadioPills, SectionDivider } from "../components";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

export default function StepTiempo({ form }: Props) {
  const { setValue, watch, formState: { errors } } = form;

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200">¿Cuándo te gustaría viajar a Alemania?</Label>
        <p className="text-slate-500 text-xs mt-0.5">Esto nos ayuda a definir tu ruta y prioridades</p>
        <Select onValueChange={(v) => setValue("cuandoViajar", v)} value={watch("cuandoViajar")}>
          <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3_meses">En los próximos 3 meses</SelectItem>
            <SelectItem value="6_meses">En los próximos 6 meses</SelectItem>
            <SelectItem value="1_anio">En el próximo año</SelectItem>
            <SelectItem value="mas_1_anio">En más de 1 año</SelectItem>
            <SelectItem value="no_se">No estoy seguro/a</SelectItem>
          </SelectContent>
        </Select>
        {errors.cuandoViajar && <p className="text-red-400 text-sm mt-1">{errors.cuandoViajar.message}</p>}
      </div>

      <SectionDivider label="Disponibilidad" />

      <RadioPills form={form} name="puedeEstudiarIntensivo" label="¿Puedes estudiar alemán de forma intensiva?" helper="20+ horas por semana acelera mucho el proceso" />
      <RadioPills form={form} name="puedeDedicar1a2Horas" label="¿Puedes dedicar al menos 1-2 horas diarias?" helper="La constancia es más importante que la intensidad" />
    </div>
  );
}

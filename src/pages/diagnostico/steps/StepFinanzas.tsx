import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiagnosticoForm } from "../schema";
import { RadioPills, SectionDivider } from "../components";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

export default function StepFinanzas({ form }: Props) {
  const { setValue, watch, formState: { errors } } = form;

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200">¿Cuánto dinero tienes ahorrado para el proceso?</Label>
        <p className="text-slate-500 text-xs mt-0.5">Incluye cursos de idioma, visa, vuelos y primeros meses</p>
        <Select onValueChange={(v) => setValue("dineroAhorrado", v)} value={watch("dineroAhorrado")}>
          <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
            <SelectValue placeholder="Selecciona un rango" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="menos_5000">Menos de 5.000 EUR</SelectItem>
            <SelectItem value="5000_10000">5.000 - 10.000 EUR</SelectItem>
            <SelectItem value="10000_20000">10.000 - 20.000 EUR</SelectItem>
            <SelectItem value="mas_20000">Más de 20.000 EUR</SelectItem>
          </SelectContent>
        </Select>
        {errors.dineroAhorrado && <p className="text-red-400 text-sm mt-1">{errors.dineroAhorrado.message}</p>}
      </div>

      <RadioPills form={form} name="puedeAbrirSperrkonto" label="¿Puedes abrir un Sperrkonto?" helper="Cuenta bloqueada de ~11.208 EUR, obligatoria para varias visas" />

      <SectionDivider />

      <RadioPills form={form} name="apoyoFamiliar" label="¿Tienes apoyo económico familiar?" />
      <RadioPills form={form} name="dispuestoCiudadesPequenas" label="¿Estás dispuesto/a a trabajar en ciudades pequeñas?" helper="Las zonas rurales tienen mayor demanda y menos competencia" />
    </div>
  );
}

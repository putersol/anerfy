import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiagnosticoForm } from "../schema";
import { RadioPills, SectionDivider } from "../components";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

export default function StepFormacion({ form }: Props) {
  const { register, watch, formState: { errors } } = form;
  const tieneEspecialidad = watch("tieneEspecialidad");

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200">Universidad donde estudiaste medicina</Label>
        <p className="text-slate-500 text-xs mt-0.5">El nombre oficial de tu universidad</p>
        <Input {...register("universidad")} placeholder="Nombre de la universidad" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
        {errors.universidad && <p className="text-red-400 text-sm mt-1">{errors.universidad.message}</p>}
      </div>

      <div>
        <Label className="text-slate-200">Año de graduación</Label>
        <Input {...register("anioGraduacion")} type="number" placeholder="Ej: 2018" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
        {errors.anioGraduacion && <p className="text-red-400 text-sm mt-1">{errors.anioGraduacion.message}</p>}
      </div>

      <RadioPills form={form} name="realizoInternado" label="¿Realizaste internado rotatorio?" helper="El internado es parte de la formación requerida" />

      <SectionDivider label="Especialización" />

      <RadioPills form={form} name="tieneEspecialidad" label="¿Tienes especialidad médica?" />

      {tieneEspecialidad === "si" && (
        <div>
          <Label className="text-slate-200">¿Cuál especialidad?</Label>
          <Input {...register("cualEspecialidad")} placeholder="Ej: Cardiología" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
        </div>
      )}

      <SectionDivider label="Experiencia" />

      <div>
        <Label className="text-slate-200">Años de experiencia laboral</Label>
        <Input {...register("aniosExperiencia")} type="number" placeholder="Ej: 5" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
        {errors.aniosExperiencia && <p className="text-red-400 text-sm mt-1">{errors.aniosExperiencia.message}</p>}
      </div>

      <div>
        <Label className="text-slate-200">Áreas de trabajo</Label>
        <p className="text-slate-500 text-xs mt-0.5">Describe brevemente dónde has trabajado</p>
        <Textarea {...register("areasTrabajo")} placeholder="Ej: Urgencias, consulta externa, hospitalización..." className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[80px]" />
        {errors.areasTrabajo && <p className="text-red-400 text-sm mt-1">{errors.areasTrabajo.message}</p>}
      </div>
    </div>
  );
}

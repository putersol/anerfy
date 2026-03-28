import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiagnosticoForm, GERMAN_LEVELS } from "../schema";
import { RadioPills, SectionDivider } from "../components";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

export default function StepIdioma({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const tieneCertificado = watch("tieneCertificado");
  const estudiaActualmente = watch("estudiaActualmente");

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200">Nivel actual de alemán</Label>
        <p className="text-slate-500 text-xs mt-0.5">Según el Marco Común Europeo (MCER)</p>
        <Select onValueChange={(v) => setValue("nivelAleman", v)} value={watch("nivelAleman")}>
          <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
            <SelectValue placeholder="Selecciona tu nivel" />
          </SelectTrigger>
          <SelectContent>
            {GERMAN_LEVELS.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.nivelAleman && <p className="text-red-400 text-sm mt-1">{errors.nivelAleman.message}</p>}
      </div>

      <RadioPills form={form} name="tieneCertificado" label="¿Tienes certificado oficial de alemán?" helper="Goethe, telc, ÖSD u otro certificado reconocido" />
      {tieneCertificado === "si" && (
        <div>
          <Label className="text-slate-200">¿Cuál certificado?</Label>
          <Input {...register("cualCertificado")} placeholder="Ej: Goethe B2" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
        </div>
      )}

      <SectionDivider label="Estudio actual" />

      <RadioPills form={form} name="estudiaActualmente" label="¿Estudias alemán actualmente?" />
      {estudiaActualmente === "si" && (
        <div>
          <Label className="text-slate-200">¿Cuántas horas por semana?</Label>
          <Input {...register("horasPorSemana")} type="number" placeholder="Ej: 10" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
        </div>
      )}

      <SectionDivider label="Alemán médico" />

      <RadioPills form={form} name="estudioAlemanMedico" label="¿Has estudiado alemán médico (Fachsprache)?" helper="El vocabulario médico en alemán es indispensable" />
      <RadioPills form={form} name="presentoFSP" label="¿Has presentado la FSP?" helper="Fachsprachprüfung: examen de alemán médico" />
      <RadioPills form={form} name="presentoKenntnis" label="¿Has presentado la Kenntnisprüfung?" helper="Examen de conocimientos médicos" />
    </div>
  );
}

import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiagnosticoForm, BUNDESLAENDER } from "../schema";
import { RadioPills, SectionDivider } from "../components";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

export default function StepEstadoProceso({ form }: Props) {
  const { setValue, watch, formState: { errors } } = form;
  const envioDocumentos = watch("envioDocumentos");

  return (
    <div className="space-y-5">
      <RadioPills form={form} name="envioDocumentos" label="¿Ya enviaste documentos a Alemania para iniciar la homologación?" helper="Este es el primer paso del proceso oficial" />

      {envioDocumentos === "si" && (
        <>
          <div>
            <Label className="text-slate-200">¿A qué Bundesland?</Label>
            <Select onValueChange={(v) => setValue("bundeslandEnvio", v)} value={watch("bundeslandEnvio")}>
              <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {BUNDESLAENDER.filter((b) => b !== "No sé aún").map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RadioPills form={form} name="recibioRespuesta" label="¿Has recibido respuesta?" />

          <div>
            <Label className="text-slate-200">¿Te solicitaron FSP o Kenntnisprüfung?</Label>
            <Select onValueChange={(v) => setValue("solicitaronExamen", v)} value={watch("solicitaronExamen")}>
              <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fsp">FSP (Fachsprachprüfung)</SelectItem>
                <SelectItem value="kenntnis">Kenntnisprüfung</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
                <SelectItem value="ninguno">Ninguno / Aún no</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <SectionDivider label="Permisos obtenidos" />

      <RadioPills form={form} name="tieneBerufserlaubnis" label="¿Tienes Berufserlaubnis?" helper="Permiso temporal de ejercicio médico" />
      <RadioPills form={form} name="tieneApprobation" label="¿Ya tienes la Approbation?" helper="Homologación completa para ejercer en Alemania" />
    </div>
  );
}

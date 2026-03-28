import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiagnosticoForm, BUNDESLAENDER } from "../schema";
import { RadioPills, SectionDivider } from "../components";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

const COUNTRIES = [
  { flag: "\u{1F1F2}\u{1F1FD}", name: "México", nationality: "Mexicana" },
  { flag: "\u{1F1E8}\u{1F1F4}", name: "Colombia", nationality: "Colombiana" },
  { flag: "\u{1F1E6}\u{1F1F7}", name: "Argentina", nationality: "Argentina" },
  { flag: "\u{1F1FB}\u{1F1EA}", name: "Venezuela", nationality: "Venezolana" },
  { flag: "\u{1F1EA}\u{1F1E8}", name: "Ecuador", nationality: "Ecuatoriana" },
  { flag: "\u{1F1F5}\u{1F1EA}", name: "Perú", nationality: "Peruana" },
  { flag: "\u{1F1E8}\u{1F1F1}", name: "Chile", nationality: "Chilena" },
  { flag: "\u{1F1E7}\u{1F1F4}", name: "Bolivia", nationality: "Boliviana" },
  { flag: "\u{1F1F5}\u{1F1FE}", name: "Paraguay", nationality: "Paraguaya" },
  { flag: "\u{1F1FA}\u{1F1FE}", name: "Uruguay", nationality: "Uruguaya" },
  { flag: "\u{1F1E8}\u{1F1F7}", name: "Costa Rica", nationality: "Costarricense" },
  { flag: "\u{1F1F5}\u{1F1E6}", name: "Panamá", nationality: "Panameña" },
  { flag: "\u{1F1EC}\u{1F1F9}", name: "Guatemala", nationality: "Guatemalteca" },
  { flag: "\u{1F1ED}\u{1F1F3}", name: "Honduras", nationality: "Hondureña" },
  { flag: "\u{1F1F8}\u{1F1FB}", name: "El Salvador", nationality: "Salvadoreña" },
  { flag: "\u{1F1F3}\u{1F1EE}", name: "Nicaragua", nationality: "Nicaragüense" },
  { flag: "\u{1F1E9}\u{1F1F4}", name: "República Dominicana", nationality: "Dominicana" },
  { flag: "\u{1F1E8}\u{1F1FA}", name: "Cuba", nationality: "Cubana" },
  { flag: "\u{1F1F5}\u{1F1F7}", name: "Puerto Rico", nationality: "Puertorriqueña" },
  { flag: "\u{1F1EA}\u{1F1F8}", name: "España", nationality: "Española" },
  { flag: "\u{1F1E7}\u{1F1F7}", name: "Brasil", nationality: "Brasileña" },
];

const slideIn = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

export default function StepDatosPersonales({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form;
  const tieneContactos = watch("tieneContactosAlemania");
  const paisOrigen = watch("paisOrigen");

  const handlePaisChange = (pais: string) => {
    setValue("paisOrigen", pais);
    const match = COUNTRIES.find((c) => c.name === pais);
    if (match) setValue("nacionalidad", match.nationality);
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-slate-200">Nombre completo</Label>
        <p className="text-slate-500 text-xs mt-0.5">Como aparece en tu pasaporte</p>
        <Input {...register("nombreCompleto")} placeholder="Tu nombre completo" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[44px]" />
        {errors.nombreCompleto && <p className="text-red-400 text-sm mt-1">{errors.nombreCompleto.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-200">País de origen</Label>
          <Select onValueChange={handlePaisChange} value={paisOrigen}>
            <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
              <SelectValue placeholder="Selecciona tu país" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <span className="mr-2">{c.flag}</span> {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paisOrigen && <p className="text-red-400 text-sm mt-1">{errors.paisOrigen.message}</p>}
        </div>
        <div>
          <Label className="text-slate-200">Nacionalidad</Label>
          <Select onValueChange={(v) => setValue("nacionalidad", v)} value={watch("nacionalidad")}>
            <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.nationality} value={c.nationality}>
                  <span className="mr-2">{c.flag}</span> {c.nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nacionalidad && <p className="text-red-400 text-sm mt-1">{errors.nacionalidad.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-200">Edad</Label>
          <Input {...register("edad")} type="number" placeholder="Ej: 30" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[44px]" />
          {errors.edad && <p className="text-red-400 text-sm mt-1">{errors.edad.message}</p>}
        </div>
        <div>
          <Label className="text-slate-200">Estado civil</Label>
          <Select onValueChange={(v) => setValue("estadoCivil", v)} value={watch("estadoCivil")}>
            <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {["Soltero/a", "Casado/a", "Unión libre", "Divorciado/a", "Viudo/a"].map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.estadoCivil && <p className="text-red-400 text-sm mt-1">{errors.estadoCivil.message}</p>}
        </div>
      </div>

      <SectionDivider label="Situación familiar" />

      <RadioPills form={form} name="viajaSolo" label="¿Viajas solo o con familia?" options={[["solo", "Solo"], ["familia", "Con familia"]]} />
      <RadioPills form={form} name="tieneHijos" label="¿Tienes hijos?" />
      <RadioPills form={form} name="viajaMascota" label="¿Viajas con mascota?" helper="Hay trámites especiales para ingresar con mascotas" />

      <SectionDivider label="Preferencia de destino" />

      <div>
        <Label className="text-slate-200">Bundesland preferido (opcional)</Label>
        <p className="text-slate-500 text-xs mt-0.5">El estado federal donde te gustaría vivir</p>
        <Select onValueChange={(v) => setValue("bundeslandPreferido", v)} value={watch("bundeslandPreferido")}>
          <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white min-h-[44px]">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            {BUNDESLAENDER.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-slate-200">Ciudad preferida (opcional)</Label>
        <Input {...register("ciudadPreferida")} placeholder="Ej: Múnich" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[44px]" />
      </div>

      <RadioPills form={form} name="tieneContactosAlemania" label="¿Tienes amigos o familiares en Alemania?" helper="Tener contactos facilita la adaptación inicial" />

      <AnimatePresence>
        {tieneContactos === "si" && (
          <motion.div {...slideIn} className="overflow-hidden">
            <div className="pt-1">
              <Label className="text-slate-200">¿En qué ciudad/región?</Label>
              <Input {...register("dondeContactos")} placeholder="Ej: Berlín" className="mt-1.5 bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[44px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

# Mega Prompt para Lovable — Diagnóstico Migratorio Anerfy

Copia cada sección como un mensaje separado en Lovable. Empieza por el Prompt 1.

---

## PROMPT 1 — Instrucciones generales

Replace the contents of these 4 files EXACTLY as I provide them. Do NOT modify, summarize, or skip any code. These files make up the complete Diagnostico (migration assessment form) feature:

1. `src/pages/diagnostico/schema.ts`
2. `src/pages/diagnostico/questions.ts`  
3. `src/pages/diagnostico/QuestionView.tsx`
4. `src/pages/Diagnostico.tsx`

Key changes from the current version:
- Typeform-style UX (one question per screen, full-screen, auto-advance on selection)
- ALL emojis removed from groupIcons, step icons, and score categories — clean professional look
- Age field: min=1 (no negative or zero)
- Graduation year field: max=current year (cannot be in the future)
- Sperrkonto amount updated to €11,904 (2026 value)
- FSP and Kenntnisprüfung questions REMOVED from the form
- Approbation question REMOVED, Berufserlaubnis reformulated
- LinkedIn share button REMOVED from results screen
- Nationality dropdown includes European nationalities for dual citizenship
- More spacing between input fields and action buttons (mt-8)
- Submit is resilient — shows results even if Supabase save fails
- Score disclaimer added below score circle

I will paste each file in the following messages. Replace each file completely.

---

## PROMPT 2 — schema.ts

Replace `src/pages/diagnostico/schema.ts` with this EXACT content:

```ts
import { z } from "zod";

export const DOCUMENT_NAMES = [
  "Título médico apostillado",
  "Certificado de notas apostillado",
  "Pensum / malla curricular apostillado",
  "Certificado de good standing",
  "Antecedentes penales",
  "Certificado médico de salud",
  "Currículum en alemán",
  "Certificado de nacimiento",
  "Pasaporte vigente",
] as const;

export const BUNDESLAENDER = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen", "No sé aún",
] as const;

export const GERMAN_LEVELS = ["Ninguno", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

const docStatusSchema = z.enum(["tengo", "en_proceso", "no_tengo"]);

export const diagnosticoSchema = z.object({
  nombreCompleto: z.string().min(2, "Necesitamos tu nombre para personalizar tu plan"),
  paisOrigen: z.string().min(1, "Indica tu país de origen para evaluar requisitos"),
  nacionalidad: z.string().min(1, "Tu nacionalidad afecta el tipo de visa disponible"),
  edad: z.string().min(1, "Tu edad es importante para el perfil migratorio"),
  estadoCivil: z.string().min(1, "Selecciona tu estado civil"),
  viajaSolo: z.string().min(1, "Indica si viajas solo o acompañado"),
  viajaConPareja: z.string().optional(),
  parejaHablaAleman: z.string().optional(),
  nivelAlemanPareja: z.string().optional(),
  parejaProfesion: z.string().optional(),
  tieneHijos: z.string().optional(),
  bundeslandPreferido: z.string().optional(),
  tieneContactosAlemania: z.string().min(1, "Los contactos pueden facilitar tu adaptación"),
  dondeContactos: z.string().optional(),
  viajaMascota: z.string().optional(),
  ciudadPreferida: z.string().optional(),
  universidad: z.string().min(1, "Tu universidad es clave para la homologación"),
  anioGraduacion: z.string().min(1, "El año de graduación determina requisitos adicionales"),
  realizoInternado: z.string().min(1, "El internado es relevante para tu perfil"),
  tieneEspecialidad: z.string().min(1, "Las especialidades tienen rutas específicas"),
  cualEspecialidad: z.string().optional(),
  aniosExperiencia: z.string().min(1, "Tu experiencia influye en las oportunidades"),
  areasTrabajo: z.string().min(1, "Describe brevemente tus áreas de trabajo"),
  nivelAleman: z.string().min(1, "El idioma es el factor más importante del proceso"),
  tieneCertificado: z.string().min(1, "Los certificados validan tu nivel oficialmente"),
  cualCertificado: z.string().optional(),
  estudiaActualmente: z.string().min(1, "Tu dedicación actual al idioma es relevante"),
  horasPorSemana: z.string().optional(),
  estudioAlemanMedico: z.string().min(1, "El alemán médico es requisito para ejercer"),
  presentoFSP: z.string().optional(),
  presentoKenntnis: z.string().optional(),
  documentos: z.record(z.string(), docStatusSchema),
  envioDocumentos: z.string().min(1, "Necesitamos saber en qué punto del proceso estás"),
  bundeslandEnvio: z.string().optional(),
  recibioRespuesta: z.string().optional(),
  solicitaronExamen: z.string().optional(),
  tieneBerufserlaubnis: z.string().min(1, "El permiso temporal es un hito importante"),
  tieneApprobation: z.string().optional(),
  dineroAhorrado: z.string().min(1, "Los recursos financieros son requisito de visa"),
  puedeAbrirSperrkonto: z.string().min(1, "El Sperrkonto es obligatorio para varias visas"),
  apoyoFamiliar: z.string().optional(),
  dispuestoCiudadesPequenas: z.string().min(1, "La flexibilidad geográfica abre más oportunidades"),
  especialidadInteres: z.string().optional(),
  dispuestoEspecialidades: z.array(z.string()).optional(),
  haAplicadoHospitales: z.string().min(1, "Tu experiencia previa nos ayuda a orientarte"),
  cualesHospitales: z.string().optional(),
  haTenidoEntrevistas: z.string().optional(),
  cuandoViajar: z.string().min(1, "Tu horizonte de tiempo define la estrategia"),
  puedeEstudiarIntensivo: z.string().min(1, "El estudio intensivo acelera mucho el proceso"),
  puedeDedicar1a2Horas: z.string().min(1, "La constancia es clave para el éxito"),
  motivacion: z.string().min(10, "Cuéntanos un poco más sobre tu motivación (mínimo 10 caracteres)"),
  tipoVisa: z.string().optional(),
});

export type DiagnosticoForm = z.infer<typeof diagnosticoSchema>;

export const STEP_ICONS = [
  "", "", "", "", "", "", "", "", "", "",
];

export const STEP_TITLES = [
  "Datos Personales",
  "Formación Académica",
  "Idioma Alemán",
  "Documentos para Homologación",
  "Estado del Proceso",
  "Situación Financiera",
  "Estrategia Laboral",
  "Tiempo y Planificación",
  "Motivación Personal",
  "Migration Score",
];

export const STEP_FIELDS: Record<number, (keyof DiagnosticoForm)[]> = {
  0: ["nombreCompleto", "paisOrigen", "nacionalidad", "edad", "estadoCivil", "viajaSolo", "viajaConPareja", "tieneHijos", "tieneContactosAlemania"],
  1: ["universidad", "anioGraduacion", "realizoInternado", "tieneEspecialidad", "aniosExperiencia", "areasTrabajo"],
  2: ["nivelAleman", "tieneCertificado", "estudiaActualmente", "estudioAlemanMedico"],
  3: ["documentos"],
  4: ["envioDocumentos", "tieneBerufserlaubnis"],
  5: ["dineroAhorrado", "puedeAbrirSperrkonto", "apoyoFamiliar", "dispuestoCiudadesPequenas"],
  6: ["haAplicadoHospitales", "cualesHospitales"],
  7: ["cuandoViajar", "puedeEstudiarIntensivo", "puedeDedicar1a2Horas"],
  8: ["motivacion"],
  9: [],
};

export function calculateScores(data: DiagnosticoForm) {
  const nivelScores: Record<string, number> = {
    Ninguno: 0, A1: 2, A2: 5, B1: 10, B2: 15, C1: 18, C2: 20,
  };
  let idioma = nivelScores[data.nivelAleman] ?? 0;
  if (data.tieneCertificado === "si") idioma = Math.min(20, idioma + 2);
  if (data.estudioAlemanMedico === "si") idioma = Math.min(20, idioma + 2);

  const docs = data.documentos || {};
  const tengoCount = Object.values(docs).filter((v) => v === "tengo").length;
  const documentos = Math.round((tengoCount / DOCUMENT_NAMES.length) * 20);

  let homologacion = 0;
  if (data.tieneApprobation === "si") {
    homologacion = 20;
  } else {
    if (data.envioDocumentos === "si") homologacion += 5;
    if (data.recibioRespuesta === "si") homologacion += 5;
    if (data.tieneBerufserlaubnis === "si") homologacion += 10;
  }
  homologacion = Math.min(20, homologacion);

  let finanzas = 0;
  const dinero = data.dineroAhorrado;
  if (dinero === "mas_20000") finanzas += 15;
  else if (dinero === "10000_20000") finanzas += 10;
  else if (dinero === "5000_10000") finanzas += 5;
  if (data.puedeAbrirSperrkonto === "si") finanzas += 3;
  if (data.apoyoFamiliar === "si") finanzas += 2;
  finanzas = Math.min(20, finanzas);

  let estrategia = 0;
  if (data.especialidadInteres && data.especialidadInteres.length > 0) estrategia += 5;
  if (data.dispuestoEspecialidades && data.dispuestoEspecialidades.length >= 2) estrategia += 5;
  if (data.haAplicadoHospitales === "si") estrategia += 5;
  if (data.haTenidoEntrevistas === "si") estrategia += 5;
  estrategia = Math.min(20, estrategia);

  const total = idioma + documentos + homologacion + finanzas + estrategia;

  let clasificacion = "Ruta preparatoria";
  if (total >= 70) clasificacion = "Ruta rápida";
  else if (total >= 40) clasificacion = "Ruta estándar";

  return { idioma, documentos, homologacion, finanzas, estrategia, total, clasificacion };
}
```

---

## PROMPT 3 — questions.ts

Replace `src/pages/diagnostico/questions.ts` completely with the content from the GitHub repo at commit 397a951. The file is too long for this prompt, so pull it from GitHub directly — it should already be synced.

If the sync didn't work, here are the key changes to make manually:
- All `groupIcon` values are empty strings `""`
- `presentoFSP` and `presentoKenntnis` questions are REMOVED
- `tieneApprobation` question is REMOVED
- `tieneBerufserlaubnis` label changed to "¿Has iniciado algún trámite de Berufserlaubnis?"
- Sperrkonto helper says "€11.904 (2026)"
- Added `ALL_NATIONALITIES` export with LATAM + European nationalities

---

## PROMPT 4 — QuestionView.tsx

Key changes to make in `src/pages/diagnostico/QuestionView.tsx`:
1. Import `ALL_NATIONALITIES` from questions
2. Shell component: remove `{q.groupIcon}` from the template, increase spacing (mb-8 → mb-10, mt-2 → mt-3)
3. Number input: add `min={fieldName === "edad" ? 1 : undefined}` and `max={fieldName === "anioGraduacion" ? currentYear : undefined}`
4. All mt-4 after input fields → mt-8 (more spacing between fields and buttons)
5. Nationality dropdown uses `ALL_NATIONALITIES` array instead of `COUNTRIES` for the nationality selector

---

## PROMPT 5 — Diagnostico.tsx

Key changes to make in `src/pages/Diagnostico.tsx`:
1. Remove all emojis from score category labels (just "Idioma alemán", "Documentos", etc.)
2. Remove "📊" from Migration Score header
3. Remove LinkedIn share button entirely from SubmittedScreen
4. Change `~50 preguntas` to `~40 preguntas` in welcome screen
5. Make submit resilient: don't throw on Supabase error, still show results
6. Change `tiene_approbation: data.tieneApprobation` to `tiene_approbation: data.tieneApprobation || null`
7. Change `presento_fsp` and `presento_kenntnis` to use `|| null`
8. Add score disclaimer text below score circle: "Este es un diagnóstico preliminar. El análisis detallado se realizará durante tu asesoría personalizada."

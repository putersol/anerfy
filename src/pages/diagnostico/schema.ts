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
  // Step 0 - Datos Personales
  nombreCompleto: z.string().min(2, "Necesitamos tu nombre para personalizar tu plan"),
  paisOrigen: z.string().min(1, "Indica tu país de origen para evaluar requisitos"),
  nacionalidad: z.string().min(1, "Tu nacionalidad afecta el tipo de visa disponible"),
  edad: z.string().min(1, "Tu edad es importante para el perfil migratorio").refine(
    (v) => { const n = Number(v); return n >= 18 && n <= 80; },
    "La edad debe estar entre 18 y 80 años"
  ),
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
  // Removed from form, kept optional for existing data
  viajaMascota: z.string().optional(),
  ciudadPreferida: z.string().optional(),

  // Step 1 - Formación Académica
  universidad: z.string().min(1, "Tu universidad es clave para la homologación"),
  anioGraduacion: z.string().min(1, "El año de graduación determina requisitos adicionales").refine(
    (v) => { const n = Number(v); return n >= 1970 && n <= new Date().getFullYear(); },
    `El año de graduación debe estar entre 1970 y ${new Date().getFullYear()}`
  ),
  realizoInternado: z.string().min(1, "El internado es relevante para tu perfil"),
  tieneEspecialidad: z.string().min(1, "Las especialidades tienen rutas específicas"),
  cualEspecialidad: z.string().optional(),
  aniosExperiencia: z.string().min(1, "Tu experiencia influye en las oportunidades").refine(
    (v) => { const n = Number(v); return n >= 0 && n <= 50; },
    "Los años de experiencia deben estar entre 0 y 50"
  ),
  areasTrabajo: z.string().min(1, "Describe brevemente tus áreas de trabajo"),

  // Step 2 - Idioma Alemán
  nivelAleman: z.string().min(1, "El idioma es el factor más importante del proceso"),
  tieneCertificado: z.string().min(1, "Los certificados validan tu nivel oficialmente"),
  cualCertificado: z.string().optional(),
  estudiaActualmente: z.string().min(1, "Tu dedicación actual al idioma es relevante"),
  horasPorSemana: z.string().optional(),
  estudioAlemanMedico: z.string().min(1, "El alemán médico es requisito para ejercer"),
  presentoFSP: z.string().optional(),
  presentoKenntnis: z.string().optional(),

  // Step 3 - Documentos
  documentos: z.record(z.string(), docStatusSchema),

  // Step 4 - Estado del Proceso
  envioDocumentos: z.string().min(1, "Necesitamos saber en qué punto del proceso estás"),
  bundeslandEnvio: z.string().optional(),
  recibioRespuesta: z.string().optional(),
  solicitaronExamen: z.string().optional(),
  tieneBerufserlaubnis: z.string().min(1, "El permiso temporal es un hito importante"),
  tieneApprobation: z.string().optional(),

  // Step 5 - Situación Financiera
  dineroAhorrado: z.string().min(1, "Los recursos financieros son requisito de visa"),
  puedeAbrirSperrkonto: z.string().min(1, "El Sperrkonto es obligatorio para varias visas"),
  apoyoFamiliar: z.string().optional(),
  dispuestoCiudadesPequenas: z.string().min(1, "La flexibilidad geográfica abre más oportunidades"),

  // Step 6 - Estrategia Laboral
  especialidadInteres: z.string().optional(),
  dispuestoEspecialidades: z.array(z.string()).optional(),
  haAplicadoHospitales: z.string().min(1, "Tu experiencia previa nos ayuda a orientarte"),
  cualesHospitales: z.string().optional(),
  // Removed from form, kept optional for existing data
  haTenidoEntrevistas: z.string().optional(),

  // Step 7 - Tiempo y Planificación
  cuandoViajar: z.string().min(1, "Tu horizonte de tiempo define la estrategia"),
  puedeEstudiarIntensivo: z.string().min(1, "El estudio intensivo acelera mucho el proceso"),
  puedeDedicar1a2Horas: z.string().min(1, "La constancia es clave para el éxito"),

  // Step 8 - Motivación Personal
  motivacion: z.string().min(10, "Cuéntanos un poco más sobre tu motivación (mínimo 10 caracteres)"),

  // Removed from form, kept optional for existing data
  tipoVisa: z.string().optional(),
});

export type DiagnosticoForm = z.infer<typeof diagnosticoSchema>;

export const STEP_ICONS = [
  "", // Datos Personales
  "", // Formación
  "", // Idioma
  "", // Documentos
  "", // Estado del Proceso
  "", // Finanzas
  "", // Estrategia
  "", // Tiempo
  "", // Motivación
  "", // Score
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

// Auto-score logic
export function calculateScores(data: DiagnosticoForm) {
  // Idioma: A1=2, A2=5, B1=10, B2=15, C1=18, C2=20
  const nivelScores: Record<string, number> = {
    Ninguno: 0, A1: 2, A2: 5, B1: 10, B2: 15, C1: 18, C2: 20,
  };
  let idioma = nivelScores[data.nivelAleman] ?? 0;
  if (data.tieneCertificado === "si") idioma = Math.min(20, idioma + 2);
  if (data.estudioAlemanMedico === "si") idioma = Math.min(20, idioma + 2);

  // Documentos: count "tengo" out of total documents
  const docs = data.documentos || {};
  const tengoCount = Object.values(docs).filter((v) => v === "tengo").length;
  const documentos = Math.round((tengoCount / DOCUMENT_NAMES.length) * 20);

  // Homologación
  let homologacion = 0;
  if (data.tieneApprobation === "si") {
    homologacion = 20;
  } else {
    if (data.envioDocumentos === "si") homologacion += 5;
    if (data.recibioRespuesta === "si") homologacion += 5;
    if (data.tieneBerufserlaubnis === "si") homologacion += 10;
  }
  homologacion = Math.min(20, homologacion);

  // Finanzas
  let finanzas = 0;
  const dinero = data.dineroAhorrado;
  if (dinero === "mas_20000") finanzas += 15;
  else if (dinero === "10000_20000") finanzas += 10;
  else if (dinero === "5000_10000") finanzas += 5;
  if (data.puedeAbrirSperrkonto === "si") finanzas += 3;
  if (data.apoyoFamiliar === "si") finanzas += 2;
  finanzas = Math.min(20, finanzas);

  // Estrategia
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

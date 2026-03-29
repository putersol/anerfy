import { DiagnosticoForm, BUNDESLAENDER, GERMAN_LEVELS } from "./schema";

export const COUNTRIES = [
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

// All nationalities for the nationality dropdown (LATAM + European for dual citizenship)
export const ALL_NATIONALITIES = [
  // Latinoamericanas
  "Mexicana", "Colombiana", "Argentina", "Venezolana", "Ecuatoriana",
  "Peruana", "Chilena", "Boliviana", "Paraguaya", "Uruguaya",
  "Costarricense", "Panameña", "Guatemalteca", "Hondureña", "Salvadoreña",
  "Nicaragüense", "Dominicana", "Cubana", "Puertorriqueña", "Española", "Brasileña",
  // Europeas
  "Alemana", "Italiana", "Francesa", "Portuguesa", "Británica",
  "Holandesa", "Belga", "Suiza", "Austriaca", "Sueca",
  "Noruega", "Danesa", "Finlandesa", "Polaca", "Rumana",
  "Húngara", "Checa", "Griega", "Irlandesa", "Croata",
];

export type QuestionType =
  | "text" | "number" | "radio" | "cards" | "select"
  | "textarea" | "checkbox-multi" | "country"
  | "documents" | "motivation";

export interface QuestionDef {
  field: keyof DiagnosticoForm;
  type: QuestionType;
  label: string;
  helper?: string;
  placeholder?: string;
  group: string;
  groupIcon: string;
  options?: { value: string; label: string }[];
  required: boolean;
  condition?: { field: keyof DiagnosticoForm; values: string[] };
  conditions?: { field: keyof DiagnosticoForm; values: string[] }[];
}

const SPECIALTIES = [
  "Allgemeinmedizin (Medicina general)",
  "Innere Medizin (Medicina interna)",
  "Chirurgie (Cirugía)",
  "Anästhesiologie (Anestesiología)",
  "Pädiatrie (Pediatría)",
  "Gynäkologie (Ginecología)",
  "Psychiatrie (Psiquiatría)",
  "Neurologie (Neurología)",
  "Orthopädie (Ortopedia)",
  "Radiologie (Radiología)",
  "Dermatologie (Dermatología)",
  "Urologie (Urología)",
  "Kardiologie (Cardiología)",
  "Augenheilkunde (Oftalmología)",
  "HNO (Otorrinolaringología)",
  "Notfallmedizin (Medicina de emergencia)",
  "Geriatrie (Geriatría)",
  "Rehabilitationsmedizin (Rehabilitación)",
  "Otra",
];

export const QUESTIONS: QuestionDef[] = [
  // ── Datos Personales ──
  { field: "nombreCompleto", type: "text", label: "¿Cómo te llamas?", helper: "Como aparece en tu pasaporte", placeholder: "Tu nombre completo", group: "Datos Personales", groupIcon: "", required: true },
  { field: "paisOrigen", type: "country", label: "¿De qué país eres?", helper: "Tu nacionalidad se completará automáticamente", group: "Datos Personales", groupIcon: "", required: true },
  { field: "edad", type: "number", label: "¿Cuántos años tienes?", placeholder: "Ej: 30", group: "Datos Personales", groupIcon: "", required: true },
  { field: "estadoCivil", type: "cards", label: "¿Cuál es tu estado civil?", group: "Datos Personales", groupIcon: "", required: true, options: [
    { value: "Soltero/a", label: "Soltero/a" }, { value: "Casado/a", label: "Casado/a" },
    { value: "Unión libre", label: "Unión libre" }, { value: "Divorciado/a", label: "Divorciado/a" },
    { value: "Viudo/a", label: "Viudo/a" },
  ] },
  { field: "viajaSolo", type: "cards", label: "¿Viajas solo o con familia?", group: "Datos Personales", groupIcon: "", required: true, options: [
    { value: "solo", label: "Solo" }, { value: "familia", label: "Con familia" },
  ] },
  { field: "viajaConPareja", type: "radio", label: "¿Planeas viajar con tu pareja?", group: "Datos Personales", groupIcon: "", required: false, condition: { field: "viajaSolo", values: ["familia"] } },
  { field: "parejaHablaAleman", type: "radio", label: "¿Tu pareja habla alemán?", helper: "El nivel A1 es requisito mínimo para visa familiar", group: "Datos Personales", groupIcon: "", required: false, condition: { field: "viajaConPareja", values: ["si"] } },
  { field: "nivelAlemanPareja", type: "cards", label: "¿Cuál es el nivel de alemán de tu pareja?", group: "Datos Personales", groupIcon: "", required: false, condition: { field: "viajaConPareja", values: ["si"] }, options: GERMAN_LEVELS.map(l => ({ value: l, label: l })) },
  { field: "parejaProfesion", type: "cards", label: "¿Tu pareja tiene profesión universitaria?", group: "Datos Personales", groupIcon: "", required: false, condition: { field: "viajaConPareja", values: ["si"] }, options: [
    { value: "si_medicina", label: "Sí, también es médico/a" },
    { value: "si_otra", label: "Sí, otra profesión" },
    { value: "no", label: "No" },
  ] },
  { field: "tieneHijos", type: "radio", label: "¿Tienes hijos?", group: "Datos Personales", groupIcon: "", required: false, conditions: [
    { field: "viajaSolo", values: ["familia"] },
    { field: "estadoCivil", values: ["Casado/a", "Unión libre"] },
  ] },
  { field: "bundeslandPreferido", type: "select", label: "¿En qué Bundesland te gustaría vivir?", helper: "El estado federal donde te gustaría vivir", group: "Datos Personales", groupIcon: "", required: false, options: BUNDESLAENDER.map(b => ({ value: b, label: b })) },
  { field: "tieneContactosAlemania", type: "radio", label: "¿Tienes amigos o familiares en Alemania?", helper: "Tener contactos facilita la adaptación inicial", group: "Datos Personales", groupIcon: "", required: true },
  { field: "dondeContactos", type: "text", label: "¿En qué ciudad o región están tus contactos?", placeholder: "Ej: Berlín", group: "Datos Personales", groupIcon: "", required: false, condition: { field: "tieneContactosAlemania", values: ["si"] } },

  // ── Formación Académica ──
  { field: "universidad", type: "text", label: "¿En qué universidad estudiaste medicina?", helper: "El nombre oficial de tu universidad", placeholder: "Nombre de la universidad", group: "Formación Académica", groupIcon: "", required: true },
  { field: "anioGraduacion", type: "number", label: "¿En qué año te graduaste?", placeholder: "Ej: 2018", group: "Formación Académica", groupIcon: "", required: true },
  { field: "realizoInternado", type: "radio", label: "¿Realizaste servicio social o rural?", helper: "El servicio social o rural es un requisito en muchos países latinoamericanos para poder ejercer medicina. En Alemania, se evalúa como parte de tu formación clínica.", group: "Formación Académica", groupIcon: "", required: true },
  { field: "tieneEspecialidad", type: "radio", label: "¿Tienes especialidad médica?", group: "Formación Académica", groupIcon: "", required: true },
  { field: "cualEspecialidad", type: "text", label: "¿Cuál especialidad?", placeholder: "Ej: Cardiología", group: "Formación Académica", groupIcon: "", required: false, condition: { field: "tieneEspecialidad", values: ["si"] } },
  { field: "aniosExperiencia", type: "number", label: "¿Cuántos años de experiencia laboral tienes?", placeholder: "Ej: 5", group: "Formación Académica", groupIcon: "", required: true },
  { field: "areasTrabajo", type: "textarea", label: "¿En qué áreas has trabajado?", helper: "Describe brevemente dónde has trabajado", placeholder: "Ej: Urgencias, consulta externa, hospitalización...", group: "Formación Académica", groupIcon: "", required: true },

  // ── Idioma Alemán ──
  { field: "nivelAleman", type: "cards", label: "¿Cuál es tu nivel actual de alemán?", helper: "Según el Marco Común Europeo (MCER)", group: "Idioma Alemán", groupIcon: "", required: true, options: GERMAN_LEVELS.map(l => ({ value: l, label: l })) },
  { field: "tieneCertificado", type: "radio", label: "¿Tienes certificado oficial de alemán?", helper: "Goethe, telc, ÖSD u otro certificado reconocido", group: "Idioma Alemán", groupIcon: "", required: true },
  { field: "cualCertificado", type: "text", label: "¿Cuál certificado tienes?", placeholder: "Ej: Goethe B2", group: "Idioma Alemán", groupIcon: "", required: false, condition: { field: "tieneCertificado", values: ["si"] } },
  { field: "estudiaActualmente", type: "radio", label: "¿Estudias alemán actualmente?", group: "Idioma Alemán", groupIcon: "", required: true },
  { field: "horasPorSemana", type: "number", label: "¿Cuántas horas por semana estudias?", placeholder: "Ej: 10", group: "Idioma Alemán", groupIcon: "", required: false, condition: { field: "estudiaActualmente", values: ["si"] } },
  { field: "estudioAlemanMedico", type: "radio", label: "¿Has estudiado alemán médico (Fachsprache)?", helper: "El vocabulario médico en alemán es indispensable", group: "Idioma Alemán", groupIcon: "", required: true },


  // ── Documentos (single screen) ──
  { field: "documentos", type: "documents", label: "Estado de tus documentos", helper: "Marca el estado de cada documento para evaluar tu expediente.", group: "Documentos para Homologación", groupIcon: "", required: true },

  // ── Estado del Proceso ──
  { field: "envioDocumentos", type: "radio", label: "¿Ya enviaste documentos a Alemania para la homologación?", helper: "Este es el primer paso del proceso oficial", group: "Estado del Proceso", groupIcon: "", required: true },
  { field: "bundeslandEnvio", type: "select", label: "¿A qué Bundesland enviaste los documentos?", group: "Estado del Proceso", groupIcon: "", required: false, condition: { field: "envioDocumentos", values: ["si"] }, options: BUNDESLAENDER.filter(b => b !== "No sé aún").map(b => ({ value: b, label: b })) },
  { field: "recibioRespuesta", type: "radio", label: "¿Has recibido respuesta?", group: "Estado del Proceso", groupIcon: "", required: false, condition: { field: "envioDocumentos", values: ["si"] } },
  { field: "solicitaronExamen", type: "cards", label: "¿Te solicitaron FSP o Kenntnisprüfung?", group: "Estado del Proceso", groupIcon: "", required: false, condition: { field: "envioDocumentos", values: ["si"] }, options: [
    { value: "fsp", label: "FSP (Fachsprachprüfung)" }, { value: "kenntnis", label: "Kenntnisprüfung" },
    { value: "ambos", label: "Ambos" }, { value: "ninguno", label: "Ninguno / Aún no" },
  ] },
  

  // ── Situación Financiera ──
  { field: "dineroAhorrado", type: "cards", label: "¿Cuánto dinero tienes ahorrado para el proceso?", helper: "Incluye cursos de idioma, visa, vuelos y primeros meses", group: "Situación Financiera", groupIcon: "", required: true, options: [
    { value: "menos_5000", label: "Menos de 5.000 EUR" }, { value: "5000_10000", label: "5.000 – 10.000 EUR" },
    { value: "10000_20000", label: "10.000 – 20.000 EUR" }, { value: "mas_20000", label: "Más de 20.000 EUR" },
  ] },
  { field: "puedeAbrirSperrkonto", type: "radio", label: "¿Puedes abrir un Sperrkonto?", helper: "Cuenta bloqueada de €11.904 (2026), obligatoria para varias visas", group: "Situación Financiera", groupIcon: "", required: true },
  { field: "apoyoFamiliar", type: "radio", label: "¿Tienes apoyo económico familiar?", group: "Situación Financiera", groupIcon: "", required: false, conditions: [
    { field: "tieneHijos", values: ["si"] },
    { field: "estadoCivil", values: ["Casado/a", "Unión libre"] },
  ] },
  { field: "dispuestoCiudadesPequenas", type: "radio", label: "¿Estás dispuesto/a a trabajar en ciudades pequeñas?", helper: "Las zonas rurales tienen mayor demanda y menos competencia", group: "Situación Financiera", groupIcon: "", required: true },

  // ── Estrategia Laboral ──
  { field: "especialidadInteres", type: "select", label: "¿Cuál es tu especialidad de mayor interés para Alemania?", group: "Estrategia Laboral", groupIcon: "", required: false, options: SPECIALTIES.map(s => ({ value: s, label: s })) },
  { field: "dispuestoEspecialidades", type: "checkbox-multi", label: "¿En cuáles áreas estarías dispuesto/a a trabajar?", helper: "Selecciona todas las que apliquen", group: "Estrategia Laboral", groupIcon: "", required: false, options: SPECIALTIES.map(s => ({ value: s, label: s })) },
  { field: "haAplicadoHospitales", type: "radio", label: "¿Has buscado opciones de hospitales en los que te gustaría trabajar en Alemania?", group: "Estrategia Laboral", groupIcon: "", required: true },
  { field: "cualesHospitales", type: "text", label: "¿Cuáles hospitales o clínicas has investigado?", placeholder: "Ej: Charité, Universitätsklinikum...", group: "Estrategia Laboral", groupIcon: "", required: false, condition: { field: "haAplicadoHospitales", values: ["si"] } },

  // ── Tiempo y Planificación ──
  { field: "cuandoViajar", type: "cards", label: "¿Cuándo te gustaría viajar a Alemania?", helper: "Esto nos ayuda a definir tu ruta y prioridades", group: "Tiempo y Planificación", groupIcon: "", required: true, options: [
    { value: "3_meses", label: "Próximos 3 meses" }, { value: "6_meses", label: "Próximos 6 meses" },
    { value: "1_anio", label: "Próximo año" }, { value: "mas_1_anio", label: "Más de 1 año" },
    { value: "no_se", label: "No estoy seguro/a" },
  ] },
  { field: "puedeEstudiarIntensivo", type: "radio", label: "¿Puedes estudiar alemán de forma intensiva?", helper: "20+ horas por semana acelera mucho el proceso", group: "Tiempo y Planificación", groupIcon: "", required: true },
  { field: "puedeDedicar1a2Horas", type: "radio", label: "¿Puedes dedicar al menos 1-2 horas diarias?", helper: "La constancia es más importante que la intensidad", group: "Tiempo y Planificación", groupIcon: "", required: true },

  // ── Motivación (single screen) ──
  { field: "motivacion", type: "motivation", label: "¿Por qué quieres ejercer medicina en Alemania?", helper: "Cuéntanos tu historia, tus motivaciones y tus metas.", group: "Motivación Personal", groupIcon: "", required: true },
];

// Condition fields that determine question visibility
export const CONDITION_FIELDS: (keyof DiagnosticoForm)[] = [
  "tieneContactosAlemania", "tieneEspecialidad", "tieneCertificado",
  "estudiaActualmente", "envioDocumentos", "viajaConPareja",
  "estadoCivil", "viajaSolo", "tieneHijos", "haAplicadoHospitales",
];

export function getVisibleQuestions(
  conditionValues: Partial<Record<keyof DiagnosticoForm, string>>,
): QuestionDef[] {
  return QUESTIONS.filter((q) => {
    // OR-logic conditions: show if ANY condition matches
    if (q.conditions) {
      return q.conditions.some((c) => {
        const val = conditionValues[c.field] || "";
        return c.values.includes(val);
      });
    }
    if (!q.condition) return true;
    const val = conditionValues[q.condition.field] || "";
    return q.condition.values.includes(val);
  });
}

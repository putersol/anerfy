// Enhanced scoring engine for the Results Dashboard
// Reads from diagnostico_submissions row and calculates 5-pillar scores

const EU_NATIONALITIES = new Set([
  'Alemania', 'Austria', 'Bélgica', 'Bulgaria', 'Chipre', 'Croacia',
  'Dinamarca', 'Eslovaquia', 'Eslovenia', 'España', 'Estonia', 'Finlandia',
  'Francia', 'Grecia', 'Hungría', 'Irlanda', 'Italia', 'Letonia', 'Lituania',
  'Luxemburgo', 'Malta', 'Países Bajos', 'Polonia', 'Portugal', 'República Checa',
  'Rumanía', 'Suecia',
  // EEA + Switzerland (same free movement rights)
  'Noruega', 'Islandia', 'Liechtenstein', 'Suiza',
]);

export function isEuNational(nacionalidad: string | null | undefined): boolean {
  if (!nacionalidad) return false;
  return EU_NATIONALITIES.has(nacionalidad);
}

export interface DashboardScores {
  idioma: number;
  documentos: number;
  homologacion: number;
  finanzas: number;
  estrategia: number;
  total: number;
  route: 'preparatoria' | 'estandar' | 'rapida';
  routeLabel: string;
}

export interface PillarDetail {
  score: number;
  max: 20;
  status: 'CRÍTICO' | 'PARCIAL' | 'AVANZADO' | 'COMPLETO';
  color: string;
  explanation: string;
}

const LEVEL_SCORES: Record<string, number> = {
  'Ninguno': 0, 'A1': 4, 'A2': 8, 'B1': 12, 'B2': 16, 'C1': 20, 'C2': 20,
};

const VALID_CERTS = ['goethe', 'telc', 'ösd', 'testdaf'];

function pillarStatus(score: number): PillarDetail['status'] {
  if (score <= 5) return 'CRÍTICO';
  if (score <= 12) return 'PARCIAL';
  if (score <= 17) return 'AVANZADO';
  return 'COMPLETO';
}

function pillarColor(score: number): string {
  if (score <= 5) return 'hsl(0, 72%, 51%)';
  if (score <= 12) return 'hsl(38, 92%, 50%)';
  return 'hsl(160, 85%, 45%)';
}

export function calculateDashboardScores(s: any): DashboardScores {
  // Pillar 1: IDIOMA (0-20)
  let idioma = LEVEL_SCORES[s.nivel_aleman] ?? 0;
  if (s.tiene_certificado === 'si') {
    const cert = (s.cual_certificado || '').toLowerCase();
    if (VALID_CERTS.some(c => cert.includes(c))) {
      idioma = Math.min(20, idioma + 2);
    } else {
      idioma = Math.max(0, idioma - 2);
    }
  }

  // Pillar 2: DOCUMENTOS (0-20)
  let documentos = 0;
  const docs = s.documentos || {};
  const docKeys = Object.keys(docs);
  docKeys.forEach(key => {
    if (docs[key] === 'tengo') documentos += 2;
    else if (docs[key] === 'en_proceso') documentos += 1;
  });
  documentos = Math.min(20, documentos);

  // Pillar 3: HOMOLOGACIÓN (0-20)
  let homologacion = 0;
  if (s.tiene_approbation === 'si') {
    homologacion = 20;
  } else if (s.tiene_berufserlaubnis === 'si') {
    homologacion = 15;
  } else if (s.recibio_respuesta === 'si') {
    homologacion = 10;
  } else if (s.envio_documentos === 'si') {
    homologacion = 5;
    if (s.bundesland_envio) homologacion += 2;
  }
  homologacion = Math.min(20, homologacion);

  // Pillar 4: FINANZAS (0-20)
  const euNational = isEuNational(s.nacionalidad);
  let finanzas = 0;
  const dinero = s.dinero_ahorrado;
  if (dinero === 'mas_20000') finanzas = 14;
  else if (dinero === '10000_20000') finanzas = 10;
  else if (dinero === '5000_10000') finanzas = 6;
  else if (dinero === 'menos_5000') finanzas = 2;
  // EU/EEA nationals don't need Sperrkonto — auto-grant those points
  if (euNational || s.puede_abrir_sperrkonto === 'si') finanzas += 4;
  if (s.apoyo_familiar === 'si') finanzas += 2;
  finanzas = Math.min(20, finanzas);

  // Pillar 5: ESTRATEGIA (0-20)
  let estrategia = 0;
  const exp = parseInt(s.anios_experiencia) || 0;
  estrategia += Math.min(10, exp);
  if (s.dispuesto_ciudades_pequenas === 'si') estrategia += 2;
  const dispEsp = s.dispuesto_especialidades;
  if (Array.isArray(dispEsp) && dispEsp.length >= 2) estrategia += 2;
  if (s.motivacion && s.motivacion.length > 20) estrategia += 1;
  const age = parseInt(s.edad) || 35;
  if (age < 40) estrategia += 2;
  if (s.especialidad_interes) estrategia += 3;
  estrategia = Math.min(20, estrategia);

  const total = idioma + documentos + homologacion + finanzas + estrategia;

  let route: DashboardScores['route'] = 'preparatoria';
  let routeLabel = 'Ruta Preparatoria';
  if (total >= 61) { route = 'rapida'; routeLabel = 'Ruta Rápida'; }
  else if (total >= 31) { route = 'estandar'; routeLabel = 'Ruta Estándar'; }

  return { idioma, documentos, homologacion, finanzas, estrategia, total, route, routeLabel };
}

export function getPillarDetails(s: any, scores: DashboardScores): Record<string, PillarDetail> {
  const details: Record<string, PillarDetail> = {};

  details.idioma = {
    score: scores.idioma, max: 20,
    status: pillarStatus(scores.idioma),
    color: pillarColor(scores.idioma),
    explanation: scores.idioma >= 16
      ? `Nivel ${s.nivel_aleman} — listo para FSP`
      : scores.idioma >= 8
        ? `Nivel ${s.nivel_aleman} — en progreso hacia B2`
        : `Nivel ${s.nivel_aleman || 'sin iniciar'} — prioridad absoluta`,
  };

  details.documentos = {
    score: scores.documentos, max: 20,
    status: pillarStatus(scores.documentos),
    color: pillarColor(scores.documentos),
    explanation: scores.documentos >= 16
      ? 'Expediente casi completo'
      : scores.documentos >= 8
        ? 'Documentos parcialmente listos'
        : 'Documentación pendiente — iniciar trámites',
  };

  details.homologacion = {
    score: scores.homologacion, max: 20,
    status: pillarStatus(scores.homologacion),
    color: pillarColor(scores.homologacion),
    explanation: scores.homologacion >= 15
      ? 'Proceso de homologación avanzado'
      : scores.homologacion >= 5
        ? 'Proceso iniciado — pendiente respuesta'
        : 'Sin iniciar proceso de homologación',
  };

  details.finanzas = {
    score: scores.finanzas, max: 20,
    status: pillarStatus(scores.finanzas),
    color: pillarColor(scores.finanzas),
    explanation: scores.finanzas >= 14
      ? 'Recursos financieros sólidos'
      : scores.finanzas >= 8
        ? 'Recursos parciales — planificar Sperrkonto'
        : 'Recursos limitados — necesita plan financiero',
  };

  details.estrategia = {
    score: scores.estrategia, max: 20,
    status: pillarStatus(scores.estrategia),
    color: pillarColor(scores.estrategia),
    explanation: scores.estrategia >= 14
      ? 'Perfil estratégico fuerte'
      : scores.estrategia >= 8
        ? 'Buen perfil — optimizable'
        : 'Estrategia por definir',
  };

  return details;
}

// Country-specific rural service alerts
export interface RuralAlert {
  level: 'critico' | 'precaucion' | 'informativo' | 'seguro';
  message: string;
}

const RURAL_ALERTS: Record<string, RuralAlert> = {
  'Colombia': { level: 'critico', message: 'SSO obligatorio para Tarjeta Profesional y colegiación. Sin rural → sin Good Standing → rechazo en Alemania' },
  'México': { level: 'critico', message: 'Servicio Social parte de créditos académicos. Sin él → sin Título ni Cédula Profesional' },
  'Ecuador': { level: 'critico', message: 'Salud Rural indispensable para registro en ACESS' },
  'Venezuela': { level: 'critico', message: 'Artículo 8 obligatorio para libre ejercicio. Sin constancia → MinSalud no emite documentos' },
  'República Dominicana': { level: 'critico', message: 'Pasantía de Ley obligatoria para Exequátur' },
  'Bolivia': { level: 'critico', message: 'SSSRO obligatorio para Título en Provisión Nacional' },
  'Perú': { level: 'precaucion', message: 'SERUMS obligatorio solo para Estado/Especialidad. Colegiado sin SERUMS puede aplicar, pero revisar horas prácticas' },
  'Chile': { level: 'informativo', message: 'EDF opcional. Internado incluido en carrera' },
  'Argentina': { level: 'seguro', message: 'PFO incluida dentro de la carrera. Matrícula directa al graduarse' },
};

export function getRuralAlert(country: string): RuralAlert | null {
  return RURAL_ALERTS[country] || null;
}

// Timeline calculation
export interface TimelineEstimate {
  monthsToB2: string;
  hoursRequired: string;
  totalToApprobation: string;
  investmentRange: string;
}

export function calculateTimeline(nivelAleman: string, scores: DashboardScores): TimelineEstimate {
  const timelines: Record<string, { months: string; hours: string }> = {
    'Ninguno': { months: '14-18', hours: '550-700' },
    'A1': { months: '11-15', hours: '470-600' },
    'A2': { months: '9-11', hours: '350-450' },
    'B1': { months: '5-6', hours: '200-250' },
    'B2': { months: '0 (preparar FSP)', hours: '3-6 meses FSP' },
    'C1': { months: '0 (listo para FSP)', hours: '1-3 meses FSP' },
    'C2': { months: '0 (listo para FSP)', hours: '1-3 meses FSP' },
  };

  const t = timelines[nivelAleman] || timelines['Ninguno'];

  // Investment calc
  let minInv = 0, maxInv = 0;
  if (!['B2', 'C1', 'C2'].includes(nivelAleman)) {
    minInv += 3000; maxInv += 8000; // language
  }
  minInv += 800; maxInv += 2000; // docs
  if (scores.finanzas < 14) { minInv += 12324; maxInv += 12324; } // sperrkonto
  minInv += 5000; maxInv += 10000; // living
  minInv += 1500; maxInv += 3000; // FSP
  minInv += 2000; maxInv += 5000; // contingency

  // Total timeline
  const isAdvanced = ['B2', 'C1', 'C2'].includes(nivelAleman);
  const totalMonths = isAdvanced ? '10-18' : '24-36';

  return {
    monthsToB2: t.months,
    hoursRequired: t.hours,
    totalToApprobation: totalMonths,
    investmentRange: `€${Math.round(minInv / 1000)}k-€${Math.round(maxInv / 1000)}k`,
  };
}

// Strengths & gaps analysis
export function getStrengths(s: any, scores: DashboardScores): string[] {
  const strengths: string[] = [];
  const exp = parseInt(s.anios_experiencia) || 0;
  if (exp >= 3) strengths.push(`${exp} años experiencia clínica comprobada`);
  if (s.tiene_especialidad === 'si') strengths.push(`Especialidad: ${s.cual_especialidad || 'médica'}`);
  if (s.realizo_internado === 'si') strengths.push('Servicio social/rural cumplido');
  const age = parseInt(s.edad) || 35;
  if (age < 40) strengths.push(`Edad ideal: ${age} años — juventud + experiencia`);
  if (s.dispuesto_ciudades_pequenas === 'si') strengths.push('Flexibilidad geográfica');
  if (s.viaja_solo === 'solo') strengths.push('Sin cargas familiares');
  if (s.motivacion && s.motivacion.length > 30) strengths.push('Motivación clara y objetivos realistas');
  if (scores.idioma >= 12) strengths.push(`Certificado ${s.nivel_aleman} válido`);
  if (scores.documentos >= 10) strengths.push('Documentación parcialmente lista');
  if (s.tiene_contactos_alemania === 'si') strengths.push('Red de contactos en Alemania');
  return strengths;
}

export function getGaps(s: any, scores: DashboardScores): string[] {
  const gaps: string[] = [];
  if (scores.idioma < 16) {
    const level = s.nivel_aleman || 'A0';
    gaps.push(`Alemán nivel ${level} → Requiere avanzar hasta B2`);
  }
  if (scores.documentos < 14) {
    const docs = s.documentos || {};
    const missing = Object.values(docs).filter(v => v !== 'tengo').length;
    gaps.push(`${missing} documentos pendientes: apostillas y traducciones`);
  }
  if (scores.finanzas < 14) {
    gaps.push('Sperrkonto €12.324 obligatorio');
  }
  if (s.puede_abrir_sperrkonto !== 'si') {
    gaps.push('Cuenta bloqueada aún no disponible');
  }
  if (scores.homologacion < 5) {
    gaps.push('Proceso de homologación sin iniciar');
  }
  const alert = getRuralAlert(s.pais_origen);
  if (alert && alert.level === 'critico' && s.realizo_internado !== 'si') {
    gaps.push(`Rural no completado — ${alert.message}`);
  }
  return gaps;
}

// Roadmap stages
export interface RoadmapStage {
  name: string;
  status: 'completado' | 'en_proceso' | 'no_iniciado' | 'pendiente';
  progress?: number;
}

export function getRoadmapStages(s: any, scores: DashboardScores): RoadmapStage[] {
  const nivel = s.nivel_aleman || 'Ninguno';
  const levelIdx = ['Ninguno', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(nivel);

  return [
    { name: 'Diagnóstico Anerfy', status: 'completado' },
    {
      name: 'Idioma A0→B2',
      status: levelIdx >= 4 ? 'completado' : levelIdx >= 1 ? 'en_proceso' : 'no_iniciado',
      progress: levelIdx >= 4 ? 100 : Math.round((levelIdx / 4) * 100),
    },
    {
      name: 'Documentos',
      status: scores.documentos >= 18 ? 'completado' : scores.documentos >= 6 ? 'en_proceso' : 'no_iniciado',
      progress: Math.round((scores.documentos / 20) * 100),
    },
    {
      name: 'Solicitud Bundesland',
      status: s.envio_documentos === 'si' ? (s.recibio_respuesta === 'si' ? 'completado' : 'en_proceso') : 'no_iniciado',
    },
    {
      name: 'Visa',
      status: s.tipo_visa ? 'en_proceso' : 'pendiente',
    },
    {
      name: 'FSP',
      status: s.presento_fsp === 'si' ? 'completado' : 'pendiente',
    },
    {
      name: 'Berufserlaubnis',
      status: s.tiene_berufserlaubnis === 'si' ? 'completado' : 'pendiente',
    },
    {
      name: 'KP / Gutachten',
      status: 'pendiente',
    },
    {
      name: 'Approbation',
      status: s.tiene_approbation === 'si' ? 'completado' : 'pendiente',
    },
  ];
}

// Competitive profile
export function getCompetitiveProfile(scores: DashboardScores): { label: string; percentile: string } {
  if (scores.total >= 70) return { label: 'PERFIL TOP 10% CANDIDATOS', percentile: 'TOP 10%' };
  if (scores.total >= 50) return { label: 'PERFIL TOP 30% CANDIDATOS', percentile: 'TOP 30%' };
  if (scores.total >= 30) return { label: 'PERFIL TOP 50% CANDIDATOS', percentile: 'TOP 50%' };
  return { label: 'Perfil en desarrollo — alto potencial con plan correcto', percentile: 'EN DESARROLLO' };
}

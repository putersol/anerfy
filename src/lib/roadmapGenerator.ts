// Genera un roadmap personalizado de tareas según el submission del cliente
import { isEuNational } from './dashboardScoring';

export interface RoadmapTask {
  id: string;
  label: string;
  description?: string;
  preCompleted?: boolean; // Si viene marcada por defecto según el submission
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  tasks: RoadmapTask[];
  hidden?: boolean;
}

const DOC_LABELS: Record<string, string> = {
  doc_0: 'Título médico apostillado',
  doc_1: 'Notas/Certificado de estudios apostillado',
  doc_2: 'Pensum/Plan de estudios apostillado',
  doc_3: 'Good Standing del colegio médico',
  doc_4: 'Certificado de antecedentes penales',
  doc_5: 'Pasaporte vigente',
  doc_6: 'Currículum en formato alemán (Lebenslauf)',
  doc_7: 'Carta de motivación en alemán',
  doc_8: 'Certificado de idioma alemán',
};

export function generatePersonalizedRoadmap(submission: any): RoadmapPhase[] {
  const docs = (submission?.documentos || {}) as Record<string, string>;
  const nivel = submission?.nivel_aleman || 'Ninguno';
  const isEU = isEuNational(submission?.nacionalidad);
  const tieneApprobation = submission?.tiene_approbation === 'Sí';
  const tieneBerufserlaubnis = submission?.tiene_berufserlaubnis === 'Sí';
  const presentoFSP = submission?.presento_fsp === 'Sí';
  const ahorrado = submission?.dinero_ahorrado || '';
  const envioDocs = submission?.envio_documentos === 'Sí';
  const recibioRespuesta = submission?.recibio_respuesta === 'Sí';

  const phases: RoadmapPhase[] = [];

  // FASE 1 — Documentación
  const docTasks: RoadmapTask[] = Object.entries(DOC_LABELS).map(([key, label]) => ({
    id: `docs_${key}`,
    label,
    preCompleted: docs[key] === 'tengo' || docs[key] === 'apostillado' || docs[key] === 'traducido',
  }));
  phases.push({
    id: 'fase_documentos',
    title: 'Fase 1 — Documentación',
    subtitle: 'Reunir, apostillar y traducir todos los documentos requeridos',
    tasks: [
      ...(isEU ? [] : [{ id: 'docs_anabin', label: 'Verificar universidad en ANABIN', preCompleted: false }]),
      ...docTasks,
      { id: 'docs_traduccion', label: 'Traducción jurada al alemán de todos los documentos' },
    ],
  });

  // FASE 2 — Idioma alemán (oculta si C1+)
  if (nivel !== 'C1' && nivel !== 'C2') {
    const langTasks: RoadmapTask[] = [];
    const niveles = ['A1', 'A2', 'B1', 'B2'];
    const currentIdx = niveles.indexOf(nivel) + 1;
    niveles.forEach((n, i) => {
      langTasks.push({
        id: `lang_${n}`,
        label: `Alcanzar nivel ${n} de alemán general`,
        preCompleted: i < currentIdx,
      });
    });
    langTasks.push(
      { id: 'lang_medico', label: 'Curso de alemán médico (Fachsprache)', preCompleted: submission?.estudio_aleman_medico === 'Sí' },
      { id: 'lang_simulacion', label: 'Simulaciones y práctica con paciente simulado' },
    );
    phases.push({
      id: 'fase_idioma',
      title: 'Fase 2 — Alemán hasta B2/C1 + Médico',
      subtitle: 'Llegar al nivel requerido para el ejercicio profesional',
      tasks: langTasks,
    });
  }

  // FASE 3 — Elección de Bundesland y envío de documentos
  phases.push({
    id: 'fase_bundesland',
    title: 'Fase 3 — Bundesland y envío de documentos',
    subtitle: 'Elegir estratégicamente y enviar documentación',
    tasks: [
      { id: 'bundes_eleccion', label: 'Elegir Bundesland estratégicamente', preCompleted: !!submission?.bundesland_preferido },
      { id: 'bundes_envio', label: 'Enviar documentación completa al Bundesland', preCompleted: envioDocs },
      { id: 'bundes_tasas', label: 'Pagar tasas administrativas' },
      { id: 'bundes_respuesta', label: 'Recibir evaluación inicial', preCompleted: recibioRespuesta },
    ],
  });

  // FASE 4 — FSP / Kenntnisprüfung (si no tiene Approbation)
  if (!tieneApprobation) {
    const examTasks: RoadmapTask[] = [];
    if (!presentoFSP) {
      examTasks.push(
        { id: 'fsp_prep', label: 'Preparación estructurada para FSP (3-6 meses)' },
        { id: 'fsp_anamnesis', label: 'Práctica de anamnesis con paciente simulado' },
        { id: 'fsp_documentacion', label: 'Práctica de documentación médica escrita' },
        { id: 'fsp_examen', label: 'Aprobar examen FSP (Fachsprachprüfung)' },
      );
    } else {
      examTasks.push({ id: 'fsp_aprobado', label: 'FSP aprobada', preCompleted: true });
    }
    phases.push({
      id: 'fase_fsp',
      title: 'Fase 4 — Examen FSP',
      subtitle: 'Examen de alemán médico oficial',
      tasks: examTasks,
    });

    // Kenntnisprüfung solo para no-EU sin homologación
    if (!isEU) {
      phases.push({
        id: 'fase_kenntnis',
        title: 'Fase 5 — Kenntnisprüfung',
        subtitle: 'Examen de equivalencia de conocimientos médicos',
        tasks: [
          { id: 'kp_evaluacion', label: 'Recibir resultado de evaluación de formación' },
          { id: 'kp_estudio_interna', label: 'Estudiar medicina interna' },
          { id: 'kp_estudio_cirugia', label: 'Estudiar cirugía' },
          { id: 'kp_estudio_urgencias', label: 'Estudiar urgencias' },
          { id: 'kp_casos', label: 'Practicar casos clínicos' },
          { id: 'kp_examen', label: 'Aprobar Kenntnisprüfung' },
        ],
      });
    }
  }

  // FASE 6 — Berufserlaubnis (licencia temporal) — solo si no tiene Approbation
  if (!tieneApprobation) {
    phases.push({
      id: 'fase_berufserlaubnis',
      title: tieneApprobation ? '' : 'Fase 6 — Berufserlaubnis (Licencia temporal)',
      subtitle: 'Trabajar bajo supervisión mientras obtienes la Approbation',
      tasks: [
        { id: 'be_solicitud', label: 'Solicitar Berufserlaubnis', preCompleted: tieneBerufserlaubnis },
        { id: 'be_trabajo', label: 'Trabajar bajo supervisión médica' },
        { id: 'be_experiencia', label: 'Acumular experiencia en hospital alemán' },
      ],
    });
  }

  // FASE 7 — Approbation
  phases.push({
    id: 'fase_approbation',
    title: tieneApprobation ? 'Fase 7 — Approbation ✓' : 'Fase 7 — Approbation definitiva',
    subtitle: 'Licencia médica completa para ejercer en toda Alemania',
    tasks: [
      { id: 'approb_recibida', label: 'Recibir Approbation', preCompleted: tieneApprobation },
      { id: 'approb_ejercer', label: 'Ejercer libremente en toda Alemania', preCompleted: tieneApprobation },
      { id: 'approb_weiterbildung', label: 'Planificar Facharzt / Weiterbildung' },
    ],
  });

  // FASE 8 — Finanzas y vida en Alemania
  const ahorroOk = ahorrado === '€25.000+' || ahorrado === '€20.000-25.000';
  phases.push({
    id: 'fase_finanzas',
    title: 'Fase 8 — Finanzas y vida en Alemania',
    subtitle: 'Plan de ahorro, Sperrkonto y planificación financiera',
    tasks: [
      { id: 'fin_ahorro', label: 'Alcanzar meta de ahorro €25k-€28k', preCompleted: ahorroOk },
      { id: 'fin_sperrkonto', label: 'Abrir Sperrkonto (€11.904)', preCompleted: submission?.puede_abrir_sperrkonto === 'Sí, ya tengo' },
      { id: 'fin_visa', label: 'Tramitar visa de trabajo / búsqueda de empleo' },
      { id: 'fin_steuerklasse', label: 'Optimizar Steuerklasse' },
      { id: 'fin_versorgungswerk', label: 'Configurar Versorgungswerk (pensión médica)' },
      { id: 'fin_seguro_bu', label: 'Contratar Berufsunfähigkeitsversicherung' },
    ],
  });

  return phases.filter(p => !p.hidden && p.tasks.length > 0);
}

export function getTotalTasks(phases: RoadmapPhase[]): number {
  return phases.reduce((acc, p) => acc + p.tasks.length, 0);
}

export function getCompletedCount(phases: RoadmapPhase[], progressMap: Record<string, boolean>): number {
  let count = 0;
  phases.forEach(p => {
    p.tasks.forEach(t => {
      if (progressMap[t.id] ?? t.preCompleted) count++;
    });
  });
  return count;
}

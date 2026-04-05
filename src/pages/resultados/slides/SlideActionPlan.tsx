import { motion } from 'framer-motion';
import { DashboardScores, getRuralAlert } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

interface Task {
  title: string;
  priority: 'alta' | 'media';
}

function generateMonthTasks(s: any, scores: DashboardScores, month: 1 | 2 | 3): Task[] {
  const tasks: Task[] = [];
  const nivel = s.nivel_aleman || 'Ninguno';
  const rural = getRuralAlert(s.pais_origen);

  if (month === 1) {
    // Rural alert
    if (rural && rural.level === 'critico' && s.realizo_internado !== 'si') {
      tasks.push({ title: `Completar servicio social/rural — ${s.pais_origen}`, priority: 'alta' });
    }
    // Language
    if (['Ninguno', 'A1'].includes(nivel)) {
      tasks.push({ title: 'Inscripción curso alemán A1 presencial / Goethe online', priority: 'alta' });
    } else if (nivel === 'A2') {
      tasks.push({ title: 'Continuar alemán hacia B1 — curso intensivo', priority: 'alta' });
    } else if (nivel === 'B1') {
      tasks.push({ title: 'Preparación intensiva B2 — inscribir examen Goethe/telc', priority: 'alta' });
    }
    // Passport
    const docs = s.documentos || {};
    if (docs.doc_8 !== 'tengo') {
      tasks.push({ title: 'Solicitar/renovar pasaporte válido 12+ meses', priority: 'alta' });
    }
    // University docs
    if (docs.doc_0 !== 'tengo') {
      tasks.push({ title: `Solicitar título original — ${s.universidad || 'universidad'}`, priority: 'media' });
    }
    if (tasks.length < 3) {
      tasks.push({ title: 'Verificar universidad en base Anabin H+', priority: 'media' });
    }
  } else if (month === 2) {
    // Language continuation
    if (['Ninguno', 'A1', 'A2'].includes(nivel)) {
      tasks.push({ title: 'Continuar curso de alemán — mínimo 15h/semana', priority: 'alta' });
    }
    // Apostille
    const docs = s.documentos || {};
    if (docs.doc_0 !== 'tengo' || docs.doc_1 !== 'tengo') {
      tasks.push({ title: 'Iniciar apostilla de título y notas', priority: 'alta' });
    }
    // Translations
    if (docs.doc_2 !== 'tengo') {
      tasks.push({ title: 'Buscar traductor jurado certificado', priority: 'media' });
    }
    // Financial
    if (scores.finanzas < 14) {
      tasks.push({ title: 'Abrir plan de ahorro mensual para Sperrkonto', priority: 'media' });
    }
  } else {
    // Month 3
    if (['Ninguno', 'A1', 'A2', 'B1'].includes(nivel)) {
      tasks.push({ title: 'Inscribir examen de certificación del nivel actual', priority: 'alta' });
    }
    tasks.push({ title: 'Preparar CV en formato alemán (tabellarischer Lebenslauf)', priority: 'media' });
    if (!s.bundesland_preferido || s.bundesland_preferido === 'No sé aún') {
      tasks.push({ title: 'Investigar Bundesländer — comparar requisitos y tiempos', priority: 'media' });
    }
    if (scores.finanzas < 10) {
      tasks.push({ title: 'Activar plan de ahorro — meta: €12.324 Sperrkonto', priority: 'media' });
    }
  }

  return tasks.slice(0, 4);
}

const MONTH_LABELS = ['MES 1 — Fundamentos', 'MES 2 — Consolidación', 'MES 3 — Aceleración'];

export default function SlideActionPlan({ submission, scores }: Props) {
  const months = [1, 2, 3] as const;

  return (
    <div className="h-full flex flex-col justify-center px-8 sm:px-12">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        Plan de Acción — 90 Días
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-6"
      >
        Tareas concretas priorizadas por mes
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {months.map((m, mi) => {
          const tasks = generateMonthTasks(submission, scores, m);
          return (
            <motion.div
              key={m}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + mi * 0.15 }}
              className="rounded-xl border border-border bg-secondary/30 p-4"
            >
              <h3 className="text-xs font-semibold text-primary mb-3 tracking-wider uppercase">
                {MONTH_LABELS[mi]}
              </h3>
              <div className="space-y-2.5">
                {tasks.map((task, ti) => (
                  <div
                    key={ti}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      task.priority === 'alta' ? 'bg-destructive' : 'bg-warning'
                    }`} />
                    <span className="text-foreground leading-tight">{task.title}</span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-xs text-muted-foreground">Sin tareas pendientes</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

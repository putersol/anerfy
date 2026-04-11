import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, AlertTriangle } from 'lucide-react';
import { DashboardScores, getGaps, getRuralAlert } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

interface NextAction {
  title: string;
  description: string;
  deadline: string;
  critical: string;
}

function generateNextSteps(s: any, scores: DashboardScores): NextAction[] {
  const actions: NextAction[] = [];
  const nivel = s.nivel_aleman || 'Ninguno';
  const docs = s.documentos || {};
  const rural = getRuralAlert(s.pais_origen);

  if (rural && rural.level === 'critico' && s.realizo_internado !== 'si') {
    actions.push({
      title: 'Completar servicio social/rural',
      description: `Requisito obligatorio en ${s.pais_origen} para obtener documentos válidos`,
      deadline: 'Esta semana',
      critical: 'Sin esto, ningún documento será válido para Alemania',
    });
  }

  if (['Ninguno', 'A1'].includes(nivel)) {
    actions.push({
      title: 'Inscribirse en curso de alemán A1',
      description: 'Buscar curso intensivo presencial o Goethe online — mínimo 15h/semana',
      deadline: 'Esta semana',
      critical: 'El idioma es el factor #1 del proceso completo',
    });
  } else if (['A2', 'B1'].includes(nivel)) {
    actions.push({
      title: `Inscribir examen ${nivel === 'A2' ? 'B1' : 'B2'}`,
      description: 'Preparar y agendar examen de certificación del siguiente nivel',
      deadline: 'Próximos 7 días',
      critical: 'Cada mes sin avanzar retrasa todo el timeline',
    });
  }

  if (docs.doc_8 !== 'tengo') {
    actions.push({
      title: 'Renovar/solicitar pasaporte',
      description: 'Debe tener vigencia mínima de 12 meses para proceso de visa',
      deadline: 'Esta semana',
      critical: 'Sin pasaporte vigente no hay visa posible',
    });
  }

  if (s.puede_abrir_sperrkonto !== 'si' && scores.finanzas < 14) {
    actions.push({
      title: 'Investigar opciones de Sperrkonto',
      description: `Comparar Expatrio, Fintiba, Deutsche Bank — abrir cuenta bloqueada ${SPERRKONTO_LABEL}`,
      deadline: 'Próximos 14 días',
      critical: 'Obligatorio para visa de búsqueda de empleo y estudiante',
    });
  }

  actions.push({
    title: `Verificar ${s.universidad || 'universidad'} en Anabin`,
    description: 'Buscar clasificación H+ en base de datos Anabin para tu universidad',
    deadline: 'Hoy',
    critical: 'Determina si necesitas evaluación adicional de ZAB',
  });

  return actions.slice(0, 4);
}

const SlideNextSteps = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const actions = generateNextSteps(submission, scores);

  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-16">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        Próximos Pasos Inmediatos
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-6"
      >
        {actions.length} acciones esta semana
      </motion.p>

      <div className="space-y-3">
        {actions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="rounded-xl border border-border bg-secondary/30 p-4 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-bold text-primary">{i + 1}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-1">{action.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                <div className="flex flex-wrap gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-warning">
                    <Clock className="w-3 h-3" />
                    {action.deadline}
                  </span>
                  <span className="flex items-center gap-1 text-destructive">
                    <Target className="w-3 h-3" />
                    {action.critical}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

SlideNextSteps.displayName = 'SlideNextSteps';
export default SlideNextSteps;

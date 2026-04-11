import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { calculateTimeline, DashboardScores } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1 Médico'];

const LEVEL_DETAILS: Record<string, { months: string; hours: string; institution: string }> = {
  'A0→A1': { months: '2-3', hours: '80-100', institution: 'Goethe / VHS online' },
  'A1→A2': { months: '2-3', hours: '80-100', institution: 'Goethe / telc prep' },
  'A2→B1': { months: '3-4', hours: '150-200', institution: 'Goethe / intensivo presencial' },
  'B1→B2': { months: '4-6', hours: '200-250', institution: 'Goethe / telc Medizin' },
  'B2→C1 Médico': { months: '3-6', hours: '150-200', institution: 'FSP Vorbereitung' },
};

function getCurrentLevelIndex(nivel: string): number {
  const map: Record<string, number> = { 'Ninguno': 0, 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 5 };
  return map[nivel] ?? 0;
}

const SlideLanguageTimeline = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const nivel = submission.nivel_aleman || 'Ninguno';
  const currentIdx = getCurrentLevelIndex(nivel);
  const timeline = calculateTimeline(nivel, scores, submission);
  const isAdvanced = currentIdx >= 4;

  const steps: { from: string; to: string; key: string }[] = [];
  for (let i = currentIdx; i < LEVELS.length - 1; i++) {
    steps.push({ from: LEVELS[i], to: LEVELS[i + 1], key: `${LEVELS[i]}→${LEVELS[i + 1]}` });
  }

  let accMonths = 0;
  let accHours = 0;

  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-16">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        {isAdvanced ? 'Preparación FSP' : 'Timeline de Idioma'}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-6"
      >
        {isAdvanced
          ? 'Nivel B2+ alcanzado — enfoque en Fachsprachprüfung'
          : `Ruta desde ${nivel || 'A0'} hasta B2 + C1 Médico`}
      </motion.p>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const detail = LEVEL_DETAILS[step.key];
          if (!detail) return null;
          const mRange = detail.months.split('-').map(Number);
          const hRange = detail.hours.split('-').map(Number);
          accMonths += (mRange[0] + (mRange[1] || mRange[0])) / 2;
          accHours += (hRange[0] + (hRange[1] || hRange[0])) / 2;

          return (
            <motion.div
              key={step.key}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-stretch gap-4"
            >
              <div className="flex flex-col items-center w-8">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  i === 0 ? 'bg-primary border-primary' : 'bg-secondary border-border'
                }`} />
                {i < steps.length - 1 && <div className="flex-1 w-px bg-border" />}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-semibold text-foreground">{step.from} → {step.to}</span>
                  <span className="text-xs text-primary font-mono">{detail.months} meses</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-muted-foreground">Horas</p>
                    <p className="font-medium text-foreground">{detail.hours}h</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-muted-foreground">Acumulado</p>
                    <p className="font-medium text-foreground">{Math.round(accMonths)} meses</p>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/50 border border-border">
                    <p className="text-muted-foreground">Institución</p>
                    <p className="font-medium text-foreground">{detail.institution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 p-3 rounded-xl bg-warning/10 border border-warning/20"
      >
        <p className="text-xs text-warning font-medium">
          ⚠️ El nivel B2 es requisito absoluto e innegociable; sin certificación B2 válida no se podrá abrir expediente.
        </p>
      </motion.div>
    </div>
  );
});

SlideLanguageTimeline.displayName = 'SlideLanguageTimeline';
export default SlideLanguageTimeline;

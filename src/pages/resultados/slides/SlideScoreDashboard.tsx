import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardScores, PillarDetail, getPillarDetails } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

const PILLAR_LABELS: Record<string, string> = {
  idioma: 'IDIOMA',
  documentos: 'DOCUMENTOS',
  homologacion: 'HOMOLOGACIÓN',
  finanzas: 'FINANZAS',
  estrategia: 'ESTRATEGIA',
};

const PILLAR_ICONS: Record<string, string> = {
  idioma: '🗣️',
  documentos: '📄',
  homologacion: '🏥',
  finanzas: '💰',
  estrategia: '🎯',
};

const SlideScoreDashboard = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const details = getPillarDetails(submission, scores);
  const circumference = 2 * Math.PI * 56;
  const strokeDash = (scores.total / 100) * circumference;

  const routeColor = scores.route === 'rapida'
    ? 'bg-success/20 text-success border-success/30'
    : scores.route === 'estandar'
      ? 'bg-warning/20 text-warning border-warning/30'
      : 'bg-destructive/20 text-destructive border-destructive/30';

  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-16">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        Diagnóstico Actual
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-8"
      >
        Evaluación completa del punto de partida
      </motion.p>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Score circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="relative flex-shrink-0"
        >
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="56" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
            <motion.circle
              cx="80" cy="80" r="56" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - strokeDash }}
              transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{scores.total}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <div className="mt-3 text-center">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${routeColor}`}>
              {scores.routeLabel}
            </span>
          </div>
        </motion.div>

        {/* Pillar bars */}
        <div className="flex-1 w-full space-y-4">
          {Object.entries(details).map(([key, detail], i) => (
            <motion.div
              key={key}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{PILLAR_ICONS[key]}</span>
                  <span className="text-sm font-medium text-foreground">{PILLAR_LABELS[key]}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    detail.status === 'COMPLETO' ? 'bg-success/20 text-success' :
                    detail.status === 'AVANZADO' ? 'bg-success/20 text-success' :
                    detail.status === 'PARCIAL' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {detail.status}
                  </span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{detail.score}/20</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: detail.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(detail.score / 20) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{detail.explanation}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

SlideScoreDashboard.displayName = 'SlideScoreDashboard';
export default SlideScoreDashboard;

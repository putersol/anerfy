import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardScores, calculateTimeline, getCompetitiveProfile, getStrengths, getGaps } from '@/lib/dashboardScoring';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

interface Props {
  submission: any;
  scores: DashboardScores;
}

const SlideExecutiveSummary = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const timeline = calculateTimeline(submission.nivel_aleman || 'Ninguno', scores, submission);
  const profile = getCompetitiveProfile(scores);
  const strengths = getStrengths(submission, scores);
  const gaps = getGaps(submission, scores);

  const stats = [
    { value: timeline.monthsToB2, label: 'Alemán intensivo hasta B2', sub: `${submission.nivel_aleman || 'A0'}→B2` },
    { value: timeline.investmentRange, label: 'Inversión total requerida', sub: 'estimado completo' },
    { value: `${timeline.totalToApprobation} meses`, label: 'Timeline hasta Approbation', sub: 'realista' },
    { value: profile.percentile, label: 'Perfil competitivo', sub: 'vs. candidatos' },
  ];

  const topStrength = strengths[0] || 'Perfil en desarrollo';
  const topGap = gaps[0] || 'Sin brechas críticas';

  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-16">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        Tu Ruta Clara hacia la Approbation Alemana
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-6"
      >
        Resumen ejecutivo — {submission.nombre_completo || 'Doctor/a'}
      </motion.p>

      {/* 4 big stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center"
          >
            <p className="text-xl font-bold text-primary">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
            <p className="text-[9px] text-muted-foreground/60">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Summary blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-success/20 bg-success/5 p-4"
        >
          <p className="text-[10px] font-semibold text-success uppercase tracking-wider mb-1.5">Ventaja Competitiva</p>
          <p className="text-xs text-foreground leading-relaxed">{topStrength}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4"
        >
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1.5">Timeline Completo</p>
          <p className="text-xs text-foreground leading-relaxed">{timeline.monthsToB2} meses idioma → {timeline.totalToApprobation} meses total</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-xl border border-warning/20 bg-warning/5 p-4"
        >
          <p className="text-[10px] font-semibold text-warning uppercase tracking-wider mb-1.5">Prioridad Hoy</p>
          <p className="text-xs text-foreground leading-relaxed">{topGap}</p>
        </motion.div>
      </div>

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center space-y-4 pt-2"
      >
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          Con dedicación intensiva al alemán + inversión planificada + tu perfil favorable = <span className="text-primary font-semibold">Approbation ALCANZABLE</span>
        </p>
        <div className="flex items-center justify-center gap-2 opacity-60">
          <img src={anerfyLogo} alt="Anerfy" className="h-5 brightness-0 invert" />
          <span className="text-xs text-muted-foreground">¿Preguntas? Contacto ANERFY para seguimiento personalizado</span>
        </div>
      </motion.div>
    </div>
  );
});

SlideExecutiveSummary.displayName = 'SlideExecutiveSummary';
export default SlideExecutiveSummary;

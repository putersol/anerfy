import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { DashboardScores, getStrengths, getGaps } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

export default function SlideStrengthsGaps({ submission, scores }: Props) {
  const strengths = getStrengths(submission, scores);
  const gaps = getGaps(submission, scores);

  return (
    <div className="h-full flex flex-col justify-center px-8 sm:px-16">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        Análisis Estratégico
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-8"
      >
        Fortalezas consolidadas vs. brechas críticas
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div>
          <h3 className="text-sm font-semibold text-success flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            FORTALEZAS SÓLIDAS
          </h3>
          <div className="space-y-2.5">
            {strengths.length > 0 ? strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-success/5 border border-success/10"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{s}</span>
              </motion.div>
            )) : (
              <p className="text-sm text-muted-foreground">No se identificaron fortalezas destacadas aún</p>
            )}
          </div>
        </div>

        {/* Gaps */}
        <div>
          <h3 className="text-sm font-semibold text-destructive flex items-center gap-2 mb-4">
            <XCircle className="w-4 h-4" />
            BRECHAS CRÍTICAS
          </h3>
          <div className="space-y-2.5">
            {gaps.length > 0 ? gaps.map((g, i) => (
              <motion.div
                key={i}
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-destructive/5 border border-destructive/10"
              >
                <XCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{g}</span>
              </motion.div>
            )) : (
              <p className="text-sm text-muted-foreground">Sin brechas críticas identificadas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardScores, getStrengths, getCompetitiveProfile } from '@/lib/dashboardScoring';
import { Award, Star } from 'lucide-react';

interface Props {
  submission: any;
  scores: DashboardScores;
}

const SlideCompetitiveProfile = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const strengths = getStrengths(submission, scores);
  const profile = getCompetitiveProfile(scores);

  const factors: { label: string; active: boolean }[] = [
    { label: `Edad ${submission.edad || '—'} años`, active: parseInt(submission.edad) < 40 },
    { label: 'Rural completado', active: submission.realizo_internado === 'si' },
    { label: 'Especialidad', active: submission.tiene_especialidad === 'si' },
    { label: `${submission.anios_experiencia || 0} años exp.`, active: parseInt(submission.anios_experiencia) >= 3 },
    { label: 'Flex. geográfica', active: submission.dispuesto_ciudades_pequenas === 'si' },
    { label: 'Motivación clara', active: !!submission.motivacion && submission.motivacion.length > 20 },
    { label: `Idioma ${submission.nivel_aleman || '—'}`, active: scores.idioma >= 8 },
    { label: 'Docs parciales', active: scores.documentos >= 8 },
  ];

  const activeCount = factors.filter(f => f.active).length;

  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-16">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        Perfil Competitivo
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-8"
      >
        {activeCount} factores críticos a tu favor
      </motion.p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {factors.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className={`rounded-xl border p-3 text-center transition-colors ${
              f.active
                ? 'border-success/30 bg-success/5'
                : 'border-border bg-secondary/20 opacity-40'
            }`}
          >
            <Star className={`w-4 h-4 mx-auto mb-1 ${f.active ? 'text-success fill-success/20' : 'text-muted-foreground/30'}`} />
            <p className={`text-xs font-medium ${f.active ? 'text-foreground' : 'text-muted-foreground'}`}>
              {f.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center"
      >
        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl border ${
          scores.total >= 70
            ? 'bg-success/10 border-success/30'
            : scores.total >= 30
              ? 'bg-primary/10 border-primary/30'
              : 'bg-secondary border-border'
        }`}>
          <Award className={`w-7 h-7 ${scores.total >= 70 ? 'text-success' : 'text-primary'}`} />
          <div>
            <p className="text-base font-semibold text-foreground">{profile.percentile}</p>
            <p className="text-xs text-muted-foreground">{profile.label}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

SlideCompetitiveProfile.displayName = 'SlideCompetitiveProfile';
export default SlideCompetitiveProfile;

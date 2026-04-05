import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardScores } from '@/lib/dashboardScoring';
import { BarChart3, GitBranch, Wallet, Rocket } from 'lucide-react';

interface Props {
  scores: DashboardScores;
  onNavigate: (slideIndex: number) => void;
}

const SECTIONS = [
  { num: '01', title: 'Diagnóstico Actual', desc: 'Tu posición en el roadmap — Score y análisis de tu punto de partida hacia la Approbation', slideIdx: 2, icon: BarChart3 },
  { num: '02', title: 'Análisis Estratégico', desc: 'Fortalezas consolidadas versus brechas críticas — roadmap de 9 etapas', slideIdx: 5, icon: GitBranch },
  { num: '03', title: 'Inversión y Timeline', desc: 'Presupuesto real y timeline de idioma hasta B2', slideIdx: 6, icon: Wallet },
  { num: '04', title: 'Plan de Acción', desc: 'Primeros 90 días decisivos y próximos pasos concretos', slideIdx: 8, icon: Rocket },
];

const SlideTOC = forwardRef<HTMLDivElement, Props>(({ scores, onNavigate }, ref) => {
  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-16 max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-medium text-foreground mb-2"
      >
        Contenido
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-8"
      >
        Score total: <span className="text-primary font-semibold">{scores.total}/100</span> — {scores.routeLabel}
      </motion.p>

      <div className="space-y-3">
        {SECTIONS.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <motion.button
              key={sec.num}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              onClick={() => onNavigate(sec.slideIdx)}
              className="w-full text-left p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 hover:bg-secondary transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-mono text-xs font-semibold">{sec.num}</span>
                    <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                      {sec.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{sec.desc}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

SlideTOC.displayName = 'SlideTOC';
export default SlideTOC;

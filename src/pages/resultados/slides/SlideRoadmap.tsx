import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, AlertTriangle } from 'lucide-react';
import { RoadmapStage, getRoadmapStages, DashboardScores, calculateTimeline } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

function StageIcon({ status }: { status: RoadmapStage['status'] }) {
  if (status === 'completado') return <Check className="w-4 h-4 text-success" />;
  if (status === 'en_proceso') return <Circle className="w-4 h-4 text-warning fill-warning/30" />;
  if (status === 'no_iniciado') return <AlertTriangle className="w-4 h-4 text-destructive" />;
  return <Circle className="w-4 h-4 text-muted-foreground/30" />;
}

function stageBorder(status: RoadmapStage['status']) {
  if (status === 'completado') return 'border-success/40 bg-success/5';
  if (status === 'en_proceso') return 'border-warning/40 bg-warning/5';
  if (status === 'no_iniciado') return 'border-destructive/40 bg-destructive/5';
  return 'border-border bg-secondary/30';
}

function stageLabel(status: RoadmapStage['status']) {
  if (status === 'completado') return 'COMPLETADO';
  if (status === 'en_proceso') return 'EN PROCESO';
  if (status === 'no_iniciado') return 'NO INICIADO';
  return 'PENDIENTE';
}

const SlideRoadmap = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const stages = getRoadmapStages(submission, scores);
  const timeline = calculateTimeline(submission.nivel_aleman || 'Ninguno', scores);

  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-12">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-medium text-foreground mb-1"
      >
        Roadmap — 9 Etapas hacia la Approbation
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-6"
      >
        Tu posición actual en el proceso
      </motion.p>

      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.name}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className={`rounded-xl border p-3 ${stageBorder(stage.status)}`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <StageIcon status={stage.status} />
              <span className="text-[10px] font-semibold text-muted-foreground">{i + 1}</span>
            </div>
            <p className="text-xs font-medium text-foreground leading-tight">{stage.name}</p>
            <p className={`text-[10px] mt-1 font-medium ${
              stage.status === 'completado' ? 'text-success' :
              stage.status === 'en_proceso' ? 'text-warning' :
              stage.status === 'no_iniciado' ? 'text-destructive' :
              'text-muted-foreground/50'
            }`}>
              {stageLabel(stage.status)}
              {stage.progress !== undefined && stage.status === 'en_proceso' && ` ${stage.progress}%`}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-primary">{timeline.monthsToB2}</p>
            <p className="text-[10px] text-muted-foreground">meses hasta B2</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{timeline.hoursRequired}</p>
            <p className="text-[10px] text-muted-foreground">horas requeridas</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{timeline.totalToApprobation}</p>
            <p className="text-[10px] text-muted-foreground">meses hasta Approbation</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">{timeline.investmentRange}</p>
            <p className="text-[10px] text-muted-foreground">inversión estimada</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

SlideRoadmap.displayName = 'SlideRoadmap';
export default SlideRoadmap;

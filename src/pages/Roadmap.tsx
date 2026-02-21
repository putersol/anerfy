import { motion } from 'framer-motion';
import { useMedicusStore, allTasks } from '@/stores/medicusStore';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, User } from 'lucide-react';

interface PhaseConfig {
  id: string;
  title: string;
  subtitle: string;
  number: number;
  costRange: string;
  timeRange: string;
  tasks: string[];
  warning?: string;
  tip?: string;
  service?: { name: string; desc: string; price: string };
  conditionalBadge?: { condition: boolean; text: string };
}

export default function RoadmapPage() {
  const { onboarding, roadmap, toggleTask, getEstimatedCost, getEstimatedTime, getOverallProgress } = useMedicusStore();
  const [costLow, costHigh] = getEstimatedCost();
  const [timeLow, timeHigh] = getEstimatedTime();
  const overallProgress = getOverallProgress();

  const phases: PhaseConfig[] = [
    {
      id: 'phase1', title: 'Preparación', subtitle: 'Mes 1–2', number: 1,
      costRange: '€400–€1.200', timeRange: '1–2 meses', tasks: allTasks.phase1,
      service: { name: 'Alberto — Virtus Akademie', desc: 'Revisión documentos', price: '€150' },
    },
    {
      id: 'phase2', title: 'Idioma Alemán', subtitle: 'Mes 2–8', number: 2,
      costRange: '€1.200–€2.400', timeRange: '3–8 meses', tasks: allTasks.phase2,
      service: { name: 'Profesora Leipzig', desc: 'Alemán médico + FSP', price: '€280/mes' },
    },
    {
      id: 'phase3', title: 'Solicitud Approbation', subtitle: 'Mes 3–4', number: 3,
      costRange: '€400–€800', timeRange: '2–4 meses', tasks: allTasks.phase3,
      warning: 'No envíes documentación incompleta — causa retrasos de meses.',
    },
    {
      id: 'phase4', title: 'Fachsprachprüfung', subtitle: 'Mes 6–8', number: 4,
      costRange: '€350–€650', timeRange: '3–6 meses prep.', tasks: allTasks.phase4,
      tip: 'No es alemán general — es pensamiento clínico en alemán.',
    },
    {
      id: 'phase5', title: 'Kenntnisprüfung', subtitle: 'Si se requiere', number: 5,
      costRange: '€400–€1.400', timeRange: '3–6 meses prep.', tasks: allTasks.phase5,
      warning: 'Solo si tu universidad no es H+ en ANABIN.',
      conditionalBadge: { condition: onboarding.anabinStatus === 'Sí', text: 'Probablemente NO necesitas este examen' },
    },
    {
      id: 'phase6', title: 'Berufserlaubnis', subtitle: 'Opcional', number: 6,
      costRange: '€200', timeRange: '2–4 semanas', tasks: allTasks.phase6,
      tip: 'Solo válida en el Bundesland donde la solicites.',
    },
    {
      id: 'phase7', title: 'Approbation', subtitle: 'La meta', number: 7,
      costRange: 'Incluido', timeRange: '—', tasks: allTasks.phase7,
      tip: 'Ya eres médico en Alemania oficialmente.',
    },
    {
      id: 'phase8', title: 'Post-Approbation', subtitle: 'Finanzas', number: 8,
      costRange: '€200+', timeRange: 'Continuo', tasks: allTasks.phase8,
      service: { name: 'Hispano Akademie', desc: 'Asesoría financiera', price: '€200 consulta' },
    },
  ];

  const getPhaseProgress = (phaseId: string) => {
    const tasks = allTasks[phaseId];
    const checked = tasks.filter((_, i) => roadmap.checkedTasks[`${phaseId}-${i}`]).length;
    return Math.round((checked / tasks.length) * 100);
  };

  return (
    <div className="container max-w-2xl py-6 sm:py-10 px-4 space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Tu Roadmap</h1>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-0.5">Tiempo estimado</p>
            <p className="text-lg sm:text-xl font-semibold text-foreground">{timeLow}–{timeHigh} meses</p>
          </div>
          <div className="bg-muted rounded-lg p-3 sm:p-4">
            <p className="text-[11px] sm:text-xs text-muted-foreground mb-0.5">Costo estimado</p>
            <p className="text-lg sm:text-xl font-semibold text-foreground">€{costLow.toLocaleString()}–€{costHigh.toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium text-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>
      </motion.div>

      {/* Timeline */}
      <Accordion type="multiple" className="space-y-2">
        {phases.map((phase, idx) => (
          <motion.div key={phase.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
            <AccordionItem value={phase.id} className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-semibold shrink-0">
                    {phase.number}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-medium text-sm text-foreground">{phase.title}</span>
                      <span className="text-[11px] text-muted-foreground">{phase.subtitle}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">{phase.costRange}</span>
                      <Progress value={getPhaseProgress(phase.id)} className="h-1 w-14 sm:w-20" />
                      <span className="text-[11px] text-muted-foreground">{getPhaseProgress(phase.id)}%</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                {phase.conditionalBadge?.condition && (
                  <Badge variant="secondary" className="text-xs">✓ {phase.conditionalBadge.text}</Badge>
                )}

                <div className="space-y-1">
                  {phase.tasks.map((task, i) => {
                    const taskId = `${phase.id}-${i}`;
                    return (
                      <label key={taskId} className="flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors min-h-[40px]">
                        <Checkbox
                          checked={!!roadmap.checkedTasks[taskId]}
                          onCheckedChange={() => toggleTask(taskId)}
                          className="mt-0.5"
                        />
                        <span className={`text-sm leading-relaxed ${roadmap.checkedTasks[taskId] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex gap-3 text-[11px] text-muted-foreground">
                  <span>{phase.costRange}</span>
                  <span>·</span>
                  <span>{phase.timeRange}</span>
                </div>

                {phase.warning && (
                  <div className="flex items-start gap-2 bg-muted rounded-lg p-3 text-xs text-foreground">
                    <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    {phase.warning}
                  </div>
                )}

                {phase.tip && (
                  <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
                    {phase.tip}
                  </div>
                )}

                {phase.service && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{phase.service.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{phase.service.desc} · {phase.service.price}</p>
                    </div>
                    <button className="text-xs font-medium text-foreground underline underline-offset-2 shrink-0">Contactar</button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
}

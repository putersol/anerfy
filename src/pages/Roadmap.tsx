import { motion } from 'framer-motion';
import { useMedicusStore, allTasks } from '@/stores/medicusStore';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, BookOpen, Send, Stethoscope, Award, TrendingUp, ShieldCheck, Clock, AlertTriangle, User } from 'lucide-react';

interface PhaseConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
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
      id: 'phase1', title: 'Preparación', subtitle: 'Mes 1-2', icon: <FileText className="w-5 h-5" />,
      color: 'bg-primary', costRange: '€400-€1.200', timeRange: '1-2 meses', tasks: allTasks.phase1,
      service: { name: 'Alberto - Virtus Akademie', desc: 'Revisión documentos', price: '€150' },
    },
    {
      id: 'phase2', title: 'Idioma Alemán', subtitle: 'Mes 2-8', icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-secondary', costRange: '€1.200-€2.400', timeRange: '3-8 meses', tasks: allTasks.phase2,
      service: { name: 'Profesora Leipzig', desc: 'Alemán médico + FSP', price: '€280/mes' },
    },
    {
      id: 'phase3', title: 'Solicitud Approbation', subtitle: 'Mes 3-4', icon: <Send className="w-5 h-5" />,
      color: 'bg-accent', costRange: '€400-€800', timeRange: '2-4 meses', tasks: allTasks.phase3,
      warning: 'No envíes documentación incompleta — causa retrasos de meses.',
    },
    {
      id: 'phase4', title: 'Fachsprachprüfung', subtitle: 'Mes 6-8', icon: <Stethoscope className="w-5 h-5" />,
      color: 'bg-destructive', costRange: '€350-€650', timeRange: '3-6 meses prep.', tasks: allTasks.phase4,
      tip: 'No es alemán general — es pensamiento clínico en alemán.',
    },
    {
      id: 'phase5', title: 'Kenntnisprüfung', subtitle: 'Si se requiere', icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-purple-600', costRange: '€400-€1.400', timeRange: '3-6 meses prep.', tasks: allTasks.phase5,
      warning: 'Solo si tu universidad no es H+ en ANABIN.',
      conditionalBadge: { condition: onboarding.anabinStatus === 'Sí', text: 'Probablemente NO necesitas este examen' },
    },
    {
      id: 'phase6', title: 'Berufserlaubnis', subtitle: 'Opcional', icon: <ShieldCheck className="w-5 h-5" />,
      color: 'bg-yellow-500', costRange: '€200', timeRange: '2-4 semanas', tasks: allTasks.phase6,
      tip: 'Solo válida en el Bundesland donde la solicites.',
    },
    {
      id: 'phase7', title: 'Approbation', subtitle: '¡La meta!', icon: <Award className="w-5 h-5" />,
      color: 'bg-secondary', costRange: 'Incluido', timeRange: '—', tasks: allTasks.phase7,
      tip: '¡Ya eres médico en Alemania oficialmente! 🎉',
    },
    {
      id: 'phase8', title: 'Post-Approbation', subtitle: 'Finanzas', icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-primary', costRange: '€200+', timeRange: 'Continuo', tasks: allTasks.phase8,
      service: { name: 'Hispano Akademie', desc: 'Asesoría financiera', price: '€200 consulta' },
    },
  ];

  const getPhaseProgress = (phaseId: string) => {
    const tasks = allTasks[phaseId];
    const checked = tasks.filter((_, i) => roadmap.checkedTasks[`${phaseId}-${i}`]).length;
    return Math.round((checked / tasks.length) * 100);
  };

  return (
    <div className="container max-w-3xl py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h1 className="font-display text-3xl font-bold text-foreground">Tu Roadmap Personalizado</h1>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Clock className="w-4 h-4" /> Tiempo estimado</div>
            <p className="text-xl font-bold text-foreground">{timeLow}-{timeHigh} meses</p>
          </Card>
          <Card className="p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><TrendingUp className="w-4 h-4" /> Costo estimado</div>
            <p className="text-xl font-bold text-foreground">€{costLow.toLocaleString()}-€{costHigh.toLocaleString()}</p>
          </Card>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso total</span>
            <span className="font-semibold text-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>
      </motion.div>

      {/* Timeline */}
      <Accordion type="multiple" className="space-y-3">
        {phases.map((phase, idx) => (
          <motion.div key={phase.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <AccordionItem value={phase.id} className="border rounded-xl overflow-hidden shadow-card">
              <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-10 h-10 rounded-lg ${phase.color} flex items-center justify-center text-primary-foreground shrink-0`}>
                    {phase.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-foreground">{phase.title}</span>
                      <span className="text-xs text-muted-foreground">{phase.subtitle}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{phase.costRange}</span>
                      <Progress value={getPhaseProgress(phase.id)} className="h-1.5 w-20" />
                      <span className="text-xs text-muted-foreground">{getPhaseProgress(phase.id)}%</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                {phase.conditionalBadge?.condition && (
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">✅ {phase.conditionalBadge.text}</Badge>
                )}

                {/* Tasks */}
                <div className="space-y-2">
                  {phase.tasks.map((task, i) => {
                    const taskId = `${phase.id}-${i}`;
                    return (
                      <label key={taskId} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                        <Checkbox
                          checked={!!roadmap.checkedTasks[taskId]}
                          onCheckedChange={() => toggleTask(taskId)}
                        />
                        <span className={`text-sm ${roadmap.checkedTasks[taskId] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>💰 {phase.costRange}</span>
                  <span>⏱ {phase.timeRange}</span>
                </div>

                {phase.warning && (
                  <div className="flex items-start gap-2 bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm text-foreground">
                    <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {phase.warning}
                  </div>
                )}

                {phase.tip && (
                  <div className="bg-info/5 border border-info/20 rounded-lg p-3 text-sm text-foreground">
                    💡 {phase.tip}
                  </div>
                )}

                {phase.service && (
                  <Card className="p-3 bg-muted/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{phase.service.name}</p>
                      <p className="text-xs text-muted-foreground">{phase.service.desc} · {phase.service.price}</p>
                    </div>
                    <button className="text-xs font-medium text-primary hover:underline">Contactar</button>
                  </Card>
                )}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
}

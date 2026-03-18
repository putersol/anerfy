import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedicusStore, allTasks } from '@/stores/medicusStore';
import { 
  FileCheck, BookOpen, Send, GraduationCap, Stethoscope, 
  BriefcaseMedical, Award, PiggyBank, X, ChevronRight,
  MapPin, Star, Lock, CheckCircle2, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface PhaseNode {
  id: string;
  phase: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tasks: string[];
  x: number;
  y: number;
  color: string;
}

const phaseNodes: PhaseNode[] = [
  { id: 'phase1', phase: 1, title: 'Documentación', subtitle: 'Preparar y validar documentos', icon: <FileCheck className="w-5 h-5" />, tasks: allTasks.phase1, x: 15, y: 85, color: '220 80% 48%' },
  { id: 'phase2', phase: 2, title: 'Idioma Alemán', subtitle: 'Dominar B2/C1 + alemán médico', icon: <BookOpen className="w-5 h-5" />, tasks: allTasks.phase2, x: 38, y: 70, color: '200 80% 48%' },
  { id: 'phase3', phase: 3, title: 'Solicitud', subtitle: 'Enviar y tramitar expediente', icon: <Send className="w-5 h-5" />, tasks: allTasks.phase3, x: 60, y: 55, color: '180 70% 45%' },
  { id: 'phase4', phase: 4, title: 'FSP Exam', subtitle: 'Preparar examen de conocimientos', icon: <GraduationCap className="w-5 h-5" />, tasks: allTasks.phase4, x: 82, y: 42, color: '160 75% 42%' },
  { id: 'phase5', phase: 5, title: 'Kenntnisprüfung', subtitle: 'Examen de equivalencia médica', icon: <Stethoscope className="w-5 h-5" />, tasks: allTasks.phase5, x: 68, y: 28, color: '140 70% 40%' },
  { id: 'phase6', phase: 6, title: 'Berufserlaubnis', subtitle: 'Licencia temporal supervisada', icon: <BriefcaseMedical className="w-5 h-5" />, tasks: allTasks.phase6, x: 42, y: 18, color: '38 92% 50%' },
  { id: 'phase7', phase: 7, title: 'Approbation', subtitle: 'Licencia definitiva', icon: <Award className="w-5 h-5" />, tasks: allTasks.phase7, x: 22, y: 8, color: '30 90% 50%' },
  { id: 'phase8', phase: 8, title: 'Finanzas', subtitle: 'Optimización fiscal y pensión', icon: <PiggyBank className="w-5 h-5" />, tasks: allTasks.phase8, x: 50, y: 2, color: '0 72% 51%' },
];

function getPhaseStatus(phaseId: string, checkedTasks: Record<string, boolean>, tasks: string[]): 'locked' | 'active' | 'completed' {
  const completed = tasks.filter((_, i) => checkedTasks[`${phaseId}-${i}`]).length;
  if (completed === tasks.length && tasks.length > 0) return 'completed';
  if (completed > 0) return 'active';
  
  // Check if previous phase is at least started
  const phaseNum = parseInt(phaseId.replace('phase', ''));
  if (phaseNum === 1) return 'active';
  
  const prevPhaseId = `phase${phaseNum - 1}`;
  const prevTasks = allTasks[prevPhaseId] || [];
  const prevCompleted = prevTasks.filter((_, i) => checkedTasks[`${prevPhaseId}-${i}`]).length;
  if (prevCompleted > 0) return 'active';
  
  return 'locked';
}

function getActivePhase(checkedTasks: Record<string, boolean>): number {
  for (let i = phaseNodes.length - 1; i >= 0; i--) {
    const node = phaseNodes[i];
    const completed = node.tasks.filter((_, j) => checkedTasks[`${node.id}-${j}`]).length;
    if (completed > 0) return node.phase;
  }
  return 1;
}

export default function GameMapPage() {
  const { onboarding, roadmap, toggleTask, getOverallProgress, getEstimatedCost, getEstimatedTime } = useMedicusStore();
  const [selectedPhase, setSelectedPhase] = useState<PhaseNode | null>(null);
  const navigate = useNavigate();

  const overallProgress = getOverallProgress();
  const [costLow, costHigh] = getEstimatedCost();
  const [timeLow, timeHigh] = getEstimatedTime();
  const activePhase = getActivePhase(roadmap.checkedTasks);

  const avatarNode = useMemo(() => {
    return phaseNodes.find(n => n.phase === activePhase) || phaseNodes[0];
  }, [activePhase]);

  const getPhaseProgress = (node: PhaseNode) => {
    const completed = node.tasks.filter((_, i) => roadmap.checkedTasks[`${node.id}-${i}`]).length;
    return Math.round((completed / node.tasks.length) * 100);
  };

  // Build SVG path through all nodes
  const pathPoints = phaseNodes.map(n => ({ x: n.x, y: n.y }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-success/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-warning/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Tu Camino a la Approbation</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {onboarding.country && `Desde ${onboarding.country}`}
              {onboarding.city && onboarding.inGermany === 'Sí' && ` · En ${onboarding.city}`}
              {onboarding.germanLevel && ` · Alemán: ${onboarding.germanLevel}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Progreso total</p>
              <p className="text-lg font-bold text-foreground">{overallProgress}%</p>
            </div>
            <div className="w-32 hidden sm:block">
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Tiempo est.</p>
                <p className="text-sm font-semibold text-foreground">{timeLow}-{timeHigh} meses</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Costo est.</p>
                <p className="text-sm font-semibold text-foreground">€{costLow.toLocaleString()}-{costHigh.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Map Area */}
      <div className="relative z-10 w-full" style={{ height: 'calc(100vh - 73px)' }}>
        {/* SVG Path connecting nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220 80% 48%)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="hsl(160 75% 42%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Dotted trail path */}
          {pathPoints.map((point, i) => {
            if (i === 0) return null;
            const prev = pathPoints[i - 1];
            return (
              <line
                key={i}
                x1={prev.x}
                y1={prev.y}
                x2={point.x}
                y2={point.y}
                stroke="url(#pathGradient)"
                strokeWidth="0.3"
                strokeDasharray="1 0.8"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Phase Nodes */}
        {phaseNodes.map((node, index) => {
          const status = getPhaseStatus(node.id, roadmap.checkedTasks, node.tasks);
          const progress = getPhaseProgress(node);
          const isAvatar = node.phase === activePhase;

          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
            >
              {/* Avatar indicator */}
              {isAvatar && (
                <motion.div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                    ESTÁS AQUÍ
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary" />
                </motion.div>
              )}

              {/* Node button */}
              <button
                onClick={() => status !== 'locked' && setSelectedPhase(node)}
                disabled={status === 'locked'}
                className="group relative flex flex-col items-center"
              >
                {/* Glow ring for active */}
                {status === 'active' && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: 64,
                      height: 64,
                      left: '50%',
                      top: 0,
                      transform: 'translateX(-50%)',
                      background: `radial-gradient(circle, hsl(${node.color} / 0.3), transparent 70%)`,
                    }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                )}

                {/* Circle node */}
                <div
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    status === 'completed'
                      ? 'bg-success/20 border-success text-success shadow-lg'
                      : status === 'active'
                      ? 'bg-card border-primary text-primary shadow-lg group-hover:scale-110'
                      : 'bg-muted/50 border-border text-muted-foreground opacity-50'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : status === 'locked' ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    node.icon
                  )}

                  {/* Progress ring */}
                  {status === 'active' && progress > 0 && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" />
                      <circle
                        cx="18" cy="18" r="16" fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray={`${progress} ${100 - progress}`}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {/* Phase number badge */}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center border border-border">
                    {node.phase}
                  </span>
                </div>

                {/* Label */}
                <span className={`mt-1.5 text-[11px] sm:text-xs font-medium max-w-20 sm:max-w-24 text-center leading-tight ${
                  status === 'locked' ? 'text-muted-foreground/50' : 'text-foreground'
                }`}>
                  {node.title}
                </span>
              </button>
            </motion.div>
          );
        })}

        {/* Mobile progress bar */}
        <div className="sm:hidden absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progreso: {overallProgress}%</span>
            <span className="text-xs text-muted-foreground">{timeLow}-{timeHigh} meses · €{costLow.toLocaleString()}-{costHigh.toLocaleString()}</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      {/* Phase Detail Panel */}
      <AnimatePresence>
        {selectedPhase && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhase(null)}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Close */}
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="outline" className="text-xs" style={{ borderColor: `hsl(${selectedPhase.color})`, color: `hsl(${selectedPhase.color})` }}>
                    Fase {selectedPhase.phase} de 8
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedPhase(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Phase info */}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `hsl(${selectedPhase.color} / 0.15)`, color: `hsl(${selectedPhase.color})` }}
                  >
                    {selectedPhase.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{selectedPhase.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedPhase.subtitle}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4 mb-6">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Progreso de fase</span>
                    <span className="font-semibold text-foreground">{getPhaseProgress(selectedPhase)}%</span>
                  </div>
                  <Progress value={getPhaseProgress(selectedPhase)} className="h-2.5" />
                </div>

                {/* Onboarding context */}
                {selectedPhase.phase === 1 && onboarding.anabinStatus && (
                  <div className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-warning" />
                      <span className="text-foreground font-medium">
                        ANABIN: {onboarding.anabinStatus === 'Sí' ? '✅ Reconocida' : onboarding.anabinStatus === 'No' ? '⚠️ No reconocida' : '❓ No lo sé'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedPhase.phase === 2 && onboarding.germanLevel && (
                  <div className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">
                        Tu nivel actual: {onboarding.germanLevel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tasks checklist */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning" />
                    Tareas ({selectedPhase.tasks.filter((_, i) => roadmap.checkedTasks[`${selectedPhase.id}-${i}`]).length}/{selectedPhase.tasks.length})
                  </h3>

                  {selectedPhase.tasks.map((task, i) => {
                    const taskId = `${selectedPhase.id}-${i}`;
                    const isChecked = roadmap.checkedTasks[taskId] || false;

                    return (
                      <motion.button
                        key={taskId}
                        onClick={() => toggleTask(taskId)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                          isChecked
                            ? 'bg-success/10 border-success/30'
                            : 'bg-secondary/30 border-border hover:border-primary/30 hover:bg-secondary/50'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-success border-success' : 'border-muted-foreground/30'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3 h-3 text-success-foreground" />}
                        </div>
                        <span className={`text-sm ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {task}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Quick action */}
                <div className="mt-8 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">¿Necesitas ayuda con esta fase?</p>
                  <Button 
                    className="w-full" 
                    onClick={() => { setSelectedPhase(null); navigate('/waitlist'); }}
                  >
                    Contactar asesor <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

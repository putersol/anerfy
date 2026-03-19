import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedicusStore, allTasks } from '@/stores/medicusStore';
import { taskContent, type TaskDetail } from '@/data/taskContent';
import { 
  FileCheck, BookOpen, Send, GraduationCap, Stethoscope, 
  BriefcaseMedical, Award, PiggyBank, X, ChevronRight,
  Star, Lock, CheckCircle2, Zap, Trophy, ExternalLink,
  Clock, Coins, ChevronDown, ChevronUp, PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PhaseNode {
  id: string;
  phase: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tasks: string[];
  color: string;
  bgGradient: string;
}

const phaseNodes: PhaseNode[] = [
  { id: 'phase1', phase: 1, title: 'Documentación', subtitle: 'Preparar y validar documentos', icon: <FileCheck className="w-7 h-7" />, tasks: allTasks.phase1, color: '#4F8CFF', bgGradient: 'from-blue-500 to-blue-600' },
  { id: 'phase2', phase: 2, title: 'Idioma Alemán', subtitle: 'Dominar B2/C1 + alemán médico', icon: <BookOpen className="w-7 h-7" />, tasks: allTasks.phase2, color: '#6C5CE7', bgGradient: 'from-purple-500 to-purple-600' },
  { id: 'phase3', phase: 3, title: 'Solicitud', subtitle: 'Enviar y tramitar expediente', icon: <Send className="w-7 h-7" />, tasks: allTasks.phase3, color: '#00B894', bgGradient: 'from-emerald-500 to-emerald-600' },
  { id: 'phase4', phase: 4, title: 'FSP Exam', subtitle: 'Preparar examen de conocimientos', icon: <GraduationCap className="w-7 h-7" />, tasks: allTasks.phase4, color: '#00CEC9', bgGradient: 'from-teal-400 to-teal-500' },
  { id: 'phase5', phase: 5, title: 'Kenntnisprüfung', subtitle: 'Examen de equivalencia médica', icon: <Stethoscope className="w-7 h-7" />, tasks: allTasks.phase5, color: '#E17055', bgGradient: 'from-orange-400 to-orange-500' },
  { id: 'phase6', phase: 6, title: 'Berufserlaubnis', subtitle: 'Licencia temporal supervisada', icon: <BriefcaseMedical className="w-7 h-7" />, tasks: allTasks.phase6, color: '#FDCB6E', bgGradient: 'from-yellow-400 to-yellow-500' },
  { id: 'phase7', phase: 7, title: 'Approbation', subtitle: 'Licencia definitiva', icon: <Award className="w-7 h-7" />, tasks: allTasks.phase7, color: '#FF6B6B', bgGradient: 'from-red-400 to-red-500' },
  { id: 'phase8', phase: 8, title: 'Finanzas', subtitle: 'Optimización fiscal y pensión', icon: <PiggyBank className="w-7 h-7" />, tasks: allTasks.phase8, color: '#FF9FF3', bgGradient: 'from-pink-400 to-pink-500' },
];

const milestoneMessages: Record<number, { emoji: string; title: string; subtitle: string }> = {
  1: { emoji: '📋', title: '¡Documentación lista!', subtitle: 'Tus papeles están en orden. Un gran primer paso.' },
  2: { emoji: '🗣️', title: '¡Idioma dominado!', subtitle: 'Ya hablas el idioma de tu futuro.' },
  3: { emoji: '📬', title: '¡Solicitud enviada!', subtitle: 'Tu expediente está en camino. Paciencia.' },
  4: { emoji: '🎓', title: '¡FSP aprobada!', subtitle: 'Demostraste que puedes comunicarte como médico.' },
  5: { emoji: '🏥', title: '¡KP superada!', subtitle: 'Tus conocimientos médicos son oficiales.' },
  6: { emoji: '⚕️', title: '¡Berufserlaubnis obtenida!', subtitle: 'Ya estás trabajando como médico en Alemania.' },
  7: { emoji: '🏆', title: '¡¡APPROBATION!!', subtitle: 'Lo lograste. Eres médico en Alemania. Para siempre.' },
  8: { emoji: '💰', title: '¡Finanzas optimizadas!', subtitle: 'Tu futuro financiero está asegurado.' },
};

function getPhaseStatus(phaseId: string, checkedTasks: Record<string, boolean>, tasks: string[]): 'locked' | 'active' | 'completed' {
  const completed = tasks.filter((_, i) => checkedTasks[`${phaseId}-${i}`]).length;
  if (completed === tasks.length && tasks.length > 0) return 'completed';
  if (completed > 0) return 'active';
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

function TwinkleStar({ x, y, delay, size = 12 }: { x: number; y: number; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <Star className="text-yellow-400/60 fill-yellow-400/40" style={{ width: size, height: size }} />
    </motion.div>
  );
}

function DecoDot({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ left: x, top: y, backgroundColor: color }}
      animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

// Celebration overlay when completing a phase
function CelebrationOverlay({ milestone, onClose }: { milestone: { emoji: string; title: string; subtitle: string }; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="text-center px-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        {/* Confetti particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              backgroundColor: ['#FFD700', '#FF6B6B', '#4F8CFF', '#00B894', '#6C5CE7', '#FF9FF3'][i % 6],
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
              opacity: 0,
              scale: [1, 1.5, 0],
            }}
            transition={{ duration: 1.5, delay: i * 0.05, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          className="text-7xl mb-4"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {milestone.emoji}
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {milestone.title}
        </motion.h2>
        <motion.p
          className="text-white/60 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {milestone.subtitle}
        </motion.p>
        <motion.p
          className="text-white/30 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Toca para continuar
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Task detail expandable card
function TaskCard({ task, taskId, isChecked, onToggle, detail, phaseColor }: {
  task: string; taskId: string; isChecked: boolean; onToggle: () => void; detail?: TaskDetail; phaseColor: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${
      isChecked ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'
    }`}>
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3.5 text-left"
        whileTap={{ scale: 0.98 }}
      >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          isChecked ? 'bg-green-500 border-green-500 shadow-md shadow-green-500/30' : 'border-white/20'
        }`}>
          {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
        </div>
        <span className={`text-sm flex-1 ${isChecked ? 'text-white/40 line-through' : 'text-white/90'}`}>
          {task}
        </span>
        {detail && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-white/30 hover:text-white/60 p-1"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </motion.button>

      <AnimatePresence>
        {expanded && detail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
              <p className="text-sm text-white/60 leading-relaxed">{detail.description}</p>
              
              {/* Tips */}
              <div className="space-y-1.5">
                {detail.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="text-white/30 mt-0.5">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>

              {/* Meta: time & cost */}
              {(detail.estimatedTime || detail.estimatedCost) && (
                <div className="flex items-center gap-3 flex-wrap">
                  {detail.estimatedTime && (
                    <span className="flex items-center gap-1 text-xs text-white/40 bg-white/5 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" /> {detail.estimatedTime}
                    </span>
                  )}
                  {detail.estimatedCost && (
                    <span className="flex items-center gap-1 text-xs text-white/40 bg-white/5 px-2 py-1 rounded-md">
                      <Coins className="w-3 h-3" /> {detail.estimatedCost}
                    </span>
                  )}
                </div>
              )}

              {/* Resources */}
              {detail.resources && detail.resources.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-white/30">Recursos</span>
                  {detail.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                      style={{ color: phaseColor }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      {res.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GameMapPage() {
  const { onboarding, roadmap, toggleTask, getOverallProgress, getEstimatedCost, getEstimatedTime } = useMedicusStore();
  const [selectedPhase, setSelectedPhase] = useState<PhaseNode | null>(null);
  const [celebration, setCelebration] = useState<{ emoji: string; title: string; subtitle: string } | null>(null);
  const [prevCompletedPhases, setPrevCompletedPhases] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const overallProgress = getOverallProgress();
  const [costLow, costHigh] = getEstimatedCost();
  const [timeLow, timeHigh] = getEstimatedTime();
  const activePhase = getActivePhase(roadmap.checkedTasks);

  const getPhaseProgress = (node: PhaseNode) => {
    const completed = node.tasks.filter((_, i) => roadmap.checkedTasks[`${node.id}-${i}`]).length;
    return Math.round((completed / node.tasks.length) * 100);
  };

  // Detect phase completion for celebrations
  useEffect(() => {
    const currentCompleted = new Set<string>();
    phaseNodes.forEach(node => {
      const status = getPhaseStatus(node.id, roadmap.checkedTasks, node.tasks);
      if (status === 'completed') currentCompleted.add(node.id);
    });

    // Find newly completed phases
    currentCompleted.forEach(id => {
      if (!prevCompletedPhases.has(id)) {
        const phase = parseInt(id.replace('phase', ''));
        const milestone = milestoneMessages[phase];
        if (milestone) setCelebration(milestone);
      }
    });

    setPrevCompletedPhases(currentCompleted);
  }, [roadmap.checkedTasks]);

  const reversedNodes = [...phaseNodes].reverse();

  const nodePositions = reversedNodes.map((_, index) => {
    const verticalSpacing = 180;
    const y = 60 + index * verticalSpacing;
    const pattern = index % 3;
    let x: number;
    // Keep nodes away from edges (min 30%, max 70%) to avoid clipping on small screens
    if (pattern === 0) x = 50;
    else if (pattern === 1) x = 30;
    else x = 70;
    return { x, y };
  });

  const totalHeight = 60 + (reversedNodes.length - 1) * 180 + 120;

  const buildPath = () => {
    const points = nodePositions.map(p => ({ x: (p.x / 100) * 340 + 10, y: p.y }));
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpY = (prev.y + curr.y) / 2;
      d += ` C ${prev.x} ${cpY}, ${curr.x} ${cpY}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  // Personalized subtitle based on onboarding
  const personalSubtitle = useMemo(() => {
    const parts: string[] = [];
    if (onboarding.country) parts.push(onboarding.country);
    if (onboarding.germanLevel) parts.push(`Alemán: ${onboarding.germanLevel}`);
    if (onboarding.currentStage) parts.push(onboarding.currentStage);
    return parts.join(' · ');
  }, [onboarding]);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #0f1729 0%, #1a1040 30%, #0d2137 60%, #0f1729 100%)' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-black/30">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-lg">🩺</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">Tu Camino</h1>
                <p className="text-[11px] text-white/50 max-w-[200px] truncate">{personalSubtitle || 'Completa el onboarding'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-white/40">Progreso</p>
                <p className="text-sm font-bold text-white">{overallProgress}%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="url(#progressGrad)" strokeWidth="2.5" strokeDasharray={`${overallProgress} ${100 - overallProgress}`} strokeLinecap="round" />
                </svg>
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F8CFF" />
                      <stop offset="100%" stopColor="#6C5CE7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
            <div className="flex-1 text-center min-w-0">
              <p className="text-[9px] text-white/30 uppercase tracking-wider truncate">Tiempo</p>
              <p className="text-[11px] font-semibold text-white/80 truncate">{timeLow}-{timeHigh}m</p>
            </div>
            <div className="w-px h-5 bg-white/10 shrink-0" />
            <div className="flex-1 text-center min-w-0">
              <p className="text-[9px] text-white/30 uppercase tracking-wider truncate">Inversión</p>
              <p className="text-[11px] font-semibold text-white/80 truncate">€{costLow.toLocaleString()}-{costHigh.toLocaleString()}</p>
            </div>
            <div className="w-px h-5 bg-white/10 shrink-0" />
            <div className="flex-1 text-center min-w-0">
              <p className="text-[9px] text-white/30 uppercase tracking-wider truncate">Fase</p>
              <p className="text-[11px] font-semibold text-white/80">{activePhase}/8</p>
            </div>
          </div>
          {/* User bar */}
          {user && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <span className="text-[11px] text-white/30 truncate max-w-[200px]">{user.email}</span>
              <button onClick={signOut} className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Map */}
      <div className="relative z-10 max-w-lg mx-auto px-4 pb-28" style={{ minHeight: totalHeight }}>
        <svg
          className="absolute left-0 right-0 mx-auto pointer-events-none"
          style={{ width: 360, left: '50%', transform: 'translateX(-50%)' }}
          viewBox={`0 0 360 ${totalHeight}`}
          height={totalHeight}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.5" />
              <stop offset="30%" stopColor="#6C5CE7" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#00B894" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FDCB6E" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <motion.path d={buildPath()} fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="50" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: 'easeInOut' }} />
          <motion.path d={buildPath()} fill="none" stroke="url(#roadGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray="12 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} />
        </svg>

        {nodePositions.map((pos, i) => {
          const xPx = (pos.x / 100) * 360;
          return (
            <div key={`deco-${i}`}>
              <TwinkleStar x={xPx + 60 + (i % 2 === 0 ? 20 : -80)} y={pos.y - 30} delay={i * 0.5} size={i % 3 === 0 ? 14 : 10} />
              <TwinkleStar x={xPx - 40 + (i % 2 === 0 ? -20 : 60)} y={pos.y + 20} delay={i * 0.7 + 1} size={8} />
              <DecoDot x={xPx + (i % 2 === 0 ? 80 : -60)} y={pos.y + 40} color={reversedNodes[i].color} delay={i * 0.3} />
            </div>
          );
        })}

        {reversedNodes.map((node, index) => {
          const status = getPhaseStatus(node.id, roadmap.checkedTasks, node.tasks);
          const progress = getPhaseProgress(node);
          const isAvatar = node.phase === activePhase;
          const pos = nodePositions[index];

          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{ left: `${pos.x}%`, top: pos.y, transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            >
              {isAvatar && (
                <motion.div
                  className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
                  style={{ minWidth: '80px' }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <div className="text-3xl drop-shadow-lg">🧑‍⚕️</div>
                  <div className="mt-0.5 bg-white text-gray-900 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                    ESTÁS AQUÍ
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => status !== 'locked' && setSelectedPhase(node)}
                disabled={status === 'locked'}
                className="group relative flex flex-col items-center min-w-[44px] min-h-[44px] touch-manipulation"
              >
                {status === 'active' && (
                  <motion.div
                    className="absolute rounded-full"
                    style={{ width: 100, height: 100, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, ${node.color}40, transparent 70%)` }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  />
                )}
                {status === 'completed' && (
                  <motion.div
                    className="absolute rounded-full"
                    style={{ width: 90, height: 90, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: `radial-gradient(circle, #FFD70040, transparent 70%)` }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  />
                )}

                <div className={`relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  status === 'completed'
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-yellow-500/30 border-4 border-yellow-300/50'
                    : status === 'active'
                    ? `bg-gradient-to-br ${node.bgGradient} text-white shadow-lg border-4 border-white/20 group-hover:scale-110 group-hover:shadow-2xl`
                    : 'bg-gray-700/80 text-gray-500 border-4 border-gray-600/50'
                }`}>
                  {status === 'completed' ? <CheckCircle2 className="w-8 h-8 drop-shadow" /> : status === 'locked' ? <Lock className="w-6 h-6" /> : <div className="drop-shadow">{node.icon}</div>}

                  {status === 'active' && progress > 0 && (
                    <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="2" />
                      <motion.circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray={`${progress * 1.13} ${113 - progress * 1.13}`} strokeLinecap="round" initial={{ strokeDasharray: '0 113' }} animate={{ strokeDasharray: `${progress * 1.13} ${113 - progress * 1.13}` }} transition={{ duration: 1, delay: 0.5 + index * 0.1 }} />
                    </svg>
                  )}

                  <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center border-2 shadow-md ${
                    status === 'completed' ? 'bg-yellow-300 text-yellow-800 border-yellow-200' : status === 'active' ? 'bg-white text-gray-900 border-white/80' : 'bg-gray-600 text-gray-400 border-gray-500'
                  }`}>{node.phase}</span>
                </div>

                <span className={`mt-2 text-xs sm:text-sm font-semibold max-w-24 sm:max-w-28 text-center leading-tight ${
                  status === 'locked' ? 'text-white/20' : status === 'completed' ? 'text-yellow-300/90' : 'text-white/90'
                }`}>{node.title}</span>

                {status === 'active' && progress > 0 && (
                  <span className="text-[10px] text-white/50 mt-0.5">{progress}%</span>
                )}
              </button>
            </motion.div>
          );
        })}

        <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: 60 - 80 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <div className="flex flex-col items-center">
            <motion.div animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
              <span className="text-4xl">🏆</span>
            </motion.div>
            <span className="text-[10px] text-yellow-400/60 font-semibold mt-1 uppercase tracking-widest">Meta</span>
          </div>
        </motion.div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-black/60 backdrop-blur-xl border-t border-white/10 sm:hidden">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">{overallProgress}% completado</span>
            <span className="text-[11px] text-white/40">{timeLow}-{timeHigh} meses · €{costLow.toLocaleString()}-{costHigh.toLocaleString()}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4F8CFF, #6C5CE7, #00B894)' }} initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 1, delay: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Phase Detail Panel */}
      <AnimatePresence>
        {selectedPhase && (
          <>
            <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhase(null)} />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-y-auto"
              style={{ background: 'linear-gradient(180deg, #1a1040 0%, #0f1729 100%)' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Badge className="text-xs border-0 text-white" style={{ backgroundColor: `${selectedPhase.color}30`, color: selectedPhase.color }}>
                    Fase {selectedPhase.phase} de 8
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedPhase(null)} className="text-white/60 hover:text-white hover:bg-white/10">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${selectedPhase.bgGradient} text-white shadow-lg`}>
                    {selectedPhase.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPhase.title}</h2>
                    <p className="text-sm text-white/50">{selectedPhase.subtitle}</p>
                  </div>
                </div>

                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Progreso de fase</span>
                    <span className="font-bold text-white">{getPhaseProgress(selectedPhase)}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${selectedPhase.color}, ${selectedPhase.color}CC)` }} initial={{ width: 0 }} animate={{ width: `${getPhaseProgress(selectedPhase)}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>

                {selectedPhase.phase === 1 && onboarding.anabinStatus && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">ANABIN: {onboarding.anabinStatus === 'Sí' ? '✅ Reconocida' : onboarding.anabinStatus === 'No' ? '⚠️ No reconocida' : '❓ No lo sé'}</span>
                    </div>
                  </div>
                )}
                {selectedPhase.phase === 2 && onboarding.germanLevel && (
                  <div className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">Tu nivel actual: {onboarding.germanLevel}</span>
                    </div>
                  </div>
                )}

                {/* Personalized tips based on onboarding */}
                {selectedPhase.phase === 1 && onboarding.inGermany === 'No' && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-emerald-400 mt-0.5">💡</span>
                      <span className="text-white/70">Como aún no estás en Alemania, puedes hacer gran parte de la documentación desde tu país. Esto te ahorra €10.000-€15.000 en costos de vida.</span>
                    </div>
                  </div>
                )}
                {selectedPhase.phase === 8 && (
                  <div className="mb-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-pink-400 mt-0.5">🤝</span>
                      <span className="text-white/70">Para optimización fiscal e inversiones, nuestro partner Hispano Akademie asesora a profesionales hispanohablantes en Alemania.</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    Tareas ({selectedPhase.tasks.filter((_, i) => roadmap.checkedTasks[`${selectedPhase.id}-${i}`]).length}/{selectedPhase.tasks.length})
                  </h3>

                  {selectedPhase.tasks.map((task, i) => {
                    const taskId = `${selectedPhase.id}-${i}`;
                    const isChecked = roadmap.checkedTasks[taskId] || false;
                    const detail = taskContent[selectedPhase.id]?.[i];

                    return (
                      <TaskCard
                        key={taskId}
                        task={task}
                        taskId={taskId}
                        isChecked={isChecked}
                        onToggle={() => toggleTask(taskId)}
                        detail={detail}
                        phaseColor={selectedPhase.color}
                      />
                    );
                  })}
                </div>

                <div className="mt-8 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/30 mb-3">¿Necesitas ayuda con esta fase?</p>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25" onClick={() => { setSelectedPhase(null); navigate('/waitlist'); }}>
                    Contactar asesor <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebration && (
          <CelebrationOverlay milestone={celebration} onClose={() => setCelebration(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedicusStore, allTasks } from '@/stores/medicusStore';
import { taskContent, type TaskDetail } from '@/data/taskContent';
import {
  FileCheck, BookOpen, Send, GraduationCap, Stethoscope,
  BriefcaseMedical, Award, PiggyBank, X, Lock, CheckCircle2,
  ChevronDown, ChevronUp, Clock, Coins, MapPin, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// ─── Phase Config ───
interface PhaseNode {
  id: string;
  phase: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tasks: string[];
  color: string;
  colorEnd: string;
}

const phaseNodes: PhaseNode[] = [
  { id: 'phase1', phase: 1, title: 'Documentación', subtitle: 'Preparar y validar documentos', icon: <FileCheck className="w-6 h-6" />, tasks: allTasks.phase1, color: '#4F8CFF', colorEnd: '#2563EB' },
  { id: 'phase2', phase: 2, title: 'Idioma Alemán', subtitle: 'Dominar B2/C1 + médico', icon: <BookOpen className="w-6 h-6" />, tasks: allTasks.phase2, color: '#8B5CF6', colorEnd: '#6D28D9' },
  { id: 'phase3', phase: 3, title: 'Solicitud', subtitle: 'Enviar expediente', icon: <Send className="w-6 h-6" />, tasks: allTasks.phase3, color: '#10B981', colorEnd: '#059669' },
  { id: 'phase4', phase: 4, title: 'FSP Exam', subtitle: 'Examen de conocimientos', icon: <GraduationCap className="w-6 h-6" />, tasks: allTasks.phase4, color: '#06B6D4', colorEnd: '#0891B2' },
  { id: 'phase5', phase: 5, title: 'Kenntnisprüfung', subtitle: 'Equivalencia médica', icon: <Stethoscope className="w-6 h-6" />, tasks: allTasks.phase5, color: '#F97316', colorEnd: '#EA580C' },
  { id: 'phase6', phase: 6, title: 'Berufserlaubnis', subtitle: 'Licencia temporal', icon: <BriefcaseMedical className="w-6 h-6" />, tasks: allTasks.phase6, color: '#EAB308', colorEnd: '#CA8A04' },
  { id: 'phase7', phase: 7, title: 'Approbation', subtitle: 'Licencia definitiva', icon: <Award className="w-6 h-6" />, tasks: allTasks.phase7, color: '#EF4444', colorEnd: '#DC2626' },
  { id: 'phase8', phase: 8, title: 'Finanzas', subtitle: 'Optimización fiscal', icon: <PiggyBank className="w-6 h-6" />, tasks: allTasks.phase8, color: '#EC4899', colorEnd: '#DB2777' },
];

const educationalCards = [
  { emoji: '📋', text: 'Apostillar tus documentos puede tomar 2-8 semanas. ¡Empieza ya!' },
  { emoji: '🗣️', text: '¿Sabías que? El nivel B2 es el mínimo, pero hospitales prefieren C1' },
  { emoji: '📰', text: 'Alemania recluta activamente médicos latinos — 2,600€/mes + seguro social' },
  { emoji: '💡', text: 'La FSP tiene 3 partes: anamnesis, documentación, y comunicación con colega' },
  { emoji: '🏥', text: 'Con Berufserlaubnis puedes trabajar bajo supervisión mientras preparas la Approbation' },
  { emoji: '🎯', text: 'Una vez con Approbation, puedes ejercer en TODA Alemania' },
  { emoji: '💰', text: 'Post-Approbation: optimiza tu Steuerklasse y empieza tu Versorgungswerk desde el día 1' },
];

const germanyTips = [
  { icon: '🏙️', title: 'Costo de vida por ciudad', desc: 'Munich ~1,400€/mes • Berlin ~1,000€/mes • Frankfurt ~1,200€/mes' },
  { icon: '💶', title: 'Salario médico promedio', desc: 'Asistente: 4,600€ • Facharzt: 6,200€ • Oberarzt: 7,800€/mes bruto' },
  { icon: '🗺️', title: 'Bundesländer top', desc: 'Sachsen, Brandenburg y Mecklenburg-Vorpommern más contratan extranjeros' },
  { icon: '🏥', title: 'Cultura hospitalaria', desc: 'Puntualidad estricta, jerarquía clara, documentación exhaustiva' },
  { icon: '📱', title: 'Apps útiles', desc: 'Doctolib, Amboss, IMED-Komm, DeepL, Anki para alemán médico' },
];

// ─── Helpers ───
function getPhaseStatus(phaseId: string, checkedTasks: Record<string, boolean>, tasks: string[]): 'locked' | 'active' | 'completed' {
  const completed = tasks.filter((_, i) => checkedTasks[`${phaseId}-${i}`]).length;
  if (completed === tasks.length && tasks.length > 0) return 'completed';
  if (completed > 0) return 'active';
  const phaseNum = parseInt(phaseId.replace('phase', ''));
  if (phaseNum === 1) return 'active';
  const prevId = `phase${phaseNum - 1}`;
  const prevTasks = allTasks[prevId] || [];
  const prevCompleted = prevTasks.filter((_, i) => checkedTasks[`${prevId}-${i}`]).length;
  if (prevCompleted > 0) return 'active';
  return 'locked';
}

function getPhaseProgress(phaseId: string, checkedTasks: Record<string, boolean>, tasks: string[]): number {
  if (tasks.length === 0) return 0;
  return tasks.filter((_, i) => checkedTasks[`${phaseId}-${i}`]).length / tasks.length;
}

// ─── Progress Ring ───
function ProgressRing({ progress, color, colorEnd, size = 80 }: {
  progress: number; color: string; colorEnd: string; size?: number;
}) {
  const sw = 5;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const gid = `ring-${color.replace('#', '')}`;
  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={colorEnd} />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth={sw} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={`url(#${gid})`} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - circ * progress }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ─── Phase Node Component ───
function PhaseNodeView({ node, status, progress, checkedTasks, toggleTask, isExpanded, onToggle, side }: {
  node: PhaseNode; status: 'locked' | 'active' | 'completed';
  progress: number; checkedTasks: Record<string, boolean>;
  toggleTask: (id: string) => void; isExpanded: boolean;
  onToggle: () => void; side: 'left' | 'right';
}) {
  const completedCount = node.tasks.filter((_, i) => checkedTasks[`${node.id}-${i}`]).length;
  const detail = taskContent[node.id];

  return (
    <motion.div
      className={`flex flex-col items-center ${side === 'left' ? 'self-start ml-4 sm:ml-12' : 'self-end mr-4 sm:mr-12'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Node Circle */}
      <button
        onClick={status !== 'locked' ? onToggle : undefined}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all
          ${status === 'locked' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
        style={{
          background: status === 'locked' ? '#1a1f35' : `linear-gradient(135deg, ${node.color}22, ${node.colorEnd}22)`,
          border: `2px solid ${status === 'locked' ? '#2a2f45' : status === 'completed' ? '#22c55e' : node.color}`,
          boxShadow: status === 'active' ? `0 0 20px ${node.color}40, 0 0 40px ${node.color}20` :
                     status === 'completed' ? '0 0 20px #22c55e40' : 'none',
        }}
      >
        <ProgressRing progress={progress * 100} color={node.color} colorEnd={node.colorEnd} size={80} />
        <div className="relative z-10 text-white">
          {status === 'locked' ? <Lock className="w-6 h-6 opacity-50" /> :
           status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-green-400" /> :
           node.icon}
        </div>
        {status === 'active' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${node.color}` }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </button>

      {/* Label */}
      <div className={`mt-2 text-center max-w-[140px] ${status === 'locked' ? 'opacity-40' : ''}`}>
        <p className="text-xs font-bold text-white">{node.phase}. {node.title}</p>
        <p className="text-[10px] text-white/50">{node.subtitle}</p>
        {status !== 'locked' && (
          <p className="text-[10px] mt-0.5" style={{ color: node.color }}>
            {completedCount}/{node.tasks.length}
          </p>
        )}
      </div>

      {/* Expanded Task List */}
      <AnimatePresence>
        {isExpanded && status !== 'locked' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 w-[280px] sm:w-[320px] overflow-hidden"
          >
            <div className="rounded-xl border border-white/10 bg-[#0d1225]/90 backdrop-blur-sm p-3 space-y-1.5">
              {node.tasks.map((task, i) => {
                const taskId = `${node.id}-${i}`;
                const checked = !!checkedTasks[taskId];
                const td = detail?.[i];
                return (
                  <motion.button
                    key={taskId}
                    onClick={() => toggleTask(taskId)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors
                      ${checked ? 'bg-green-500/10' : 'bg-white/5 hover:bg-white/8'}`}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${checked ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                      {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${checked ? 'text-green-400 line-through opacity-70' : 'text-white/90'}`}>
                        {task}
                      </p>
                      {td?.estimatedTime && (
                        <p className="text-[10px] text-white/30 mt-0.5">{td.estimatedTime}</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Educational Card ───
function EduCard({ emoji, text, side }: { emoji: string; text: string; side: 'left' | 'right' }) {
  return (
    <motion.div
      className={`${side === 'left' ? 'self-start ml-6 sm:ml-16' : 'self-end mr-6 sm:mr-16'} max-w-[260px]`}
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-3.5 backdrop-blur-sm">
        <p className="text-xs text-white/70 leading-relaxed">
          <span className="text-base mr-1.5">{emoji}</span>
          {text}
        </p>
      </div>
    </motion.div>
  );
}

// ─── SVG Path Line (connecting nodes) ───
function PathLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <line x1="50%" y1="0" x2="50%" y2="100%"
          stroke="url(#pathGrad)" strokeWidth="2" strokeDasharray="8 6"
        />
      </svg>
    </div>
  );
}

// ─── Main Component ───
export default function GameMap() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roadmap, toggleTask, getEstimatedCost, getEstimatedTime, getOverallProgress } = useMedicusStore();
  const checkedTasks = roadmap.checkedTasks;

  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const overallProgress = getOverallProgress();
  const [costLow, costHigh] = getEstimatedCost();
  const [timeLow, timeHigh] = getEstimatedTime();

  const activePhase = useMemo(() => {
    for (let i = phaseNodes.length - 1; i >= 0; i--) {
      const n = phaseNodes[i];
      const done = n.tasks.filter((_, j) => checkedTasks[`${n.id}-${j}`]).length;
      if (done > 0) return n.phase;
    }
    return 1;
  }, [checkedTasks]);

  const activeNode = phaseNodes[activePhase - 1];

  // Auto-scroll to active phase on mount
  const activeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeRef.current) {
      setTimeout(() => activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#0f1428] to-[#141830] text-white">
      {/* ─── Sticky Stats Bar ─── */}
      <div className="sticky top-0 z-50 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-9 h-9 flex-shrink-0">
              <svg width="36" height="36" className="-rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="#22c55e" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - overallProgress / 100) }}
                  transition={{ duration: 0.8 }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-green-400">
                {overallProgress}%
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">{activeNode.title}</p>
              <p className="text-[10px] text-white/40">Fase {activePhase} de 8</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-white/40 flex-shrink-0">
            <span className="flex items-center gap-1">
              <Coins className="w-3 h-3" />€{costLow.toLocaleString()}-{costHigh.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{timeLow}-{timeHigh}m
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* ─── Map Container ─── */}
      <div className="relative max-w-lg mx-auto px-2 pt-6 pb-8">
        <PathLine />

        {/* ─── Journey Title ─── */}
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tu Camino a la Approbation
            </h1>
          </div>
          <p className="text-xs text-white/40">Toca una fase para ver tus tareas</p>
        </motion.div>

        {/* ─── Phase Nodes + Educational Cards ─── */}
        <div className="relative z-10 flex flex-col gap-4">
          {phaseNodes.map((node, idx) => {
            const status = getPhaseStatus(node.id, checkedTasks, node.tasks);
            const progress = getPhaseProgress(node.id, checkedTasks, node.tasks);
            const side: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
            const isActive = node.phase === activePhase;

            return (
              <div key={node.id} className="flex flex-col gap-4">
                {/* Active ref for auto-scroll */}
                {isActive && <div ref={activeRef} />}

                <PhaseNodeView
                  node={node}
                  status={status}
                  progress={progress}
                  checkedTasks={checkedTasks}
                  toggleTask={toggleTask}
                  isExpanded={expandedPhase === node.id}
                  onToggle={() => setExpandedPhase(expandedPhase === node.id ? null : node.id)}
                  side={side}
                />

                {/* Educational card between phases */}
                {idx < educationalCards.length && (
                  <EduCard
                    emoji={educationalCards[idx].emoji}
                    text={educationalCards[idx].text}
                    side={side === 'left' ? 'right' : 'left'}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Finish Line ─── */}
        <motion.div
          className="relative z-10 mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-green-500/30 bg-green-500/10">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-bold text-green-400">
              {overallProgress === 100 ? '¡Lo lograste! 🎉' : 'Meta: Approbation'}
            </span>
            <Sparkles className="w-4 h-4 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* ─── Prepárate para Alemania ─── */}
      <div className="max-w-lg mx-auto px-4 pb-12 mt-4">
        <h2 className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
          🇩🇪 Prepárate para Alemania
        </h2>
        <div className="grid gap-2.5">
          {germanyTips.map((tip, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{tip.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white/90">{tip.title}</p>
                  <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ─── Bottom rotating tip ─── */}
        <motion.div
          className="mt-6 text-center text-[11px] text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p>💬 «La puntualidad en Alemania no es una sugerencia — es un requisito.»</p>
        </motion.div>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle2,
  Lock,
  LogOut,
  Trophy,
  Star,
  X,
  FileText,
  Languages,
  MapPin,
  GraduationCap,
  Stethoscope,
  Award,
  Wallet,
  Sparkles,
  Calendar,
  Newspaper,
  Home,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { generatePersonalizedRoadmap, getTotalTasks, getCompletedCount, RoadmapPhase } from '@/lib/roadmapGenerator';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';
import torito from '@/assets/torito-mascot.png';

interface ProgressRow {
  task_id: string;
  completed: boolean;
  notes: string | null;
}

const PHASE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fase_documentos: FileText,
  fase_idioma: Languages,
  fase_bundesland: MapPin,
  fase_fsp: GraduationCap,
  fase_kenntnis: Stethoscope,
  fase_berufserlaubnis: Award,
  fase_approbation: Trophy,
  fase_finanzas: Wallet,
};

interface PhaseNodeProps {
  phase: RoadmapPhase;
  Icon: React.ComponentType<any>;
  stats: { done: number; total: number; pct: number; complete: boolean };
  isActive: boolean;
  isLocked: boolean;
  isComplete: boolean;
  index: number;
  nodeRef: React.RefObject<HTMLDivElement> | null;
  onOpen: () => void;
}

function PhaseNode({ phase, Icon, stats, isActive, isLocked, isComplete, index, nodeRef, onOpen }: PhaseNodeProps) {
  return (
    <motion.div
      ref={nodeRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center"
    >
      <button
        onClick={() => !isLocked && onOpen()}
        disabled={isLocked}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-200 active:scale-95
          ${isComplete
            ? 'bg-gradient-to-br from-success to-success/70 shadow-[0_6px_0_hsl(var(--success)/0.4)] hover:shadow-[0_4px_0_hsl(var(--success)/0.4)] hover:translate-y-0.5'
            : isActive
              ? 'bg-gradient-to-br from-primary to-primary/70 shadow-[0_6px_0_hsl(var(--primary)/0.4)] hover:shadow-[0_4px_0_hsl(var(--primary)/0.4)] hover:translate-y-0.5 ring-4 ring-primary/20 animate-pulse'
              : isLocked
                ? 'bg-muted shadow-[0_4px_0_hsl(var(--border))] cursor-not-allowed opacity-60'
                : 'bg-secondary shadow-[0_4px_0_hsl(var(--border))]'
          }
        `}
      >
        {isComplete ? (
          <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
        ) : isLocked ? (
          <Lock className="w-7 h-7 text-muted-foreground" />
        ) : (
          <Icon className="w-9 h-9 text-white" strokeWidth={2} />
        )}
        {!isLocked && !isComplete && stats.done > 0 && (
          <div className="absolute -top-1 -right-1 bg-amber-400 text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center text-amber-950 border-2 border-background">
            {stats.done}
          </div>
        )}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 border-2 border-background"
          >
            <Star className="w-3 h-3 text-amber-950 fill-amber-950" />
          </motion.div>
        )}
      </button>
      <div className="mt-2 text-center max-w-[140px]">
        <p className={`text-xs font-semibold leading-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
          {phase.title.replace(/^Fase \d+ — /, '')}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {stats.done}/{stats.total} · {stats.pct}%
        </p>
      </div>
    </motion.div>
  );
}

const DEMO_SUBMISSION = {
  submission_id: 'demo',
  email: 'demo@anerfy.com',
  nombre_completo: 'Dra. Demo García',
  nacionalidad: 'Mexicana',
  nivel_aleman: 'B1',
  tiene_approbation: 'No',
  tiene_berufserlaubnis: 'No',
  presento_fsp: 'No',
  dinero_ahorrado: '5000-10000',
  envio_documentos: 'No',
  recibio_respuesta: 'No',
  documentos: {
    doc_0: 'apostillado',
    doc_1: 'apostillado',
    doc_2: 'tengo',
    doc_5: 'tengo',
    doc_8: 'tengo',
  },
};

export default function MiRoadmap() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const isDemo = submissionId === 'demo';
  const [loading, setLoading] = useState(!isDemo);
  const [submission, setSubmission] = useState<any>(isDemo ? DEMO_SUBMISSION : null);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [openPhase, setOpenPhase] = useState<RoadmapPhase | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(isDemo ? 'demo@anerfy.com' : null);
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isDemo) return;
    async function init() {
      if (authLoading) return;
      if (!user?.email) {
        navigate('/mi-roadmap', { replace: true });
        return;
      }
      setUserEmail(user.email);

      const { data: sub, error: subErr } = await supabase
        .from('diagnostico_submissions')
        .select('*')
        .eq('submission_id', submissionId)
        .maybeSingle();

      if (subErr || !sub) {
        toast({ title: 'No se encontró tu diagnóstico', variant: 'destructive' });
        setLoading(false);
        return;
      }

      if (sub.email?.toLowerCase() !== user.email.toLowerCase()) {
        toast({ title: 'Este roadmap no está asociado a tu email', variant: 'destructive' });
        await supabase.auth.signOut();
        navigate('/mi-roadmap', { replace: true });
        return;
      }

      setSubmission(sub);

      const { data: prog } = await supabase
        .from('client_roadmap_progress')
        .select('task_id, completed, notes')
        .eq('submission_id', submissionId);

      const progMap: Record<string, ProgressRow> = {};
      (prog || []).forEach((p: any) => {
        progMap[p.task_id] = p;
      });
      setProgress(progMap);
      setLoading(false);
    }
    init();
  }, [authLoading, user, submissionId, navigate, toast, isDemo]);

  const phases = useMemo(() => (submission ? generatePersonalizedRoadmap(submission) : []), [submission]);

  const progressMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    phases.forEach(p => p.tasks.forEach(t => {
      map[t.id] = progress[t.id]?.completed ?? !!t.preCompleted;
    }));
    return map;
  }, [phases, progress]);

  const phaseStats = useMemo(() => {
    return phases.map(p => {
      const total = p.tasks.length;
      const done = p.tasks.filter(t => progressMap[t.id]).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return { id: p.id, total, done, pct, complete: pct === 100 };
    });
  }, [phases, progressMap]);

  const activeIndex = useMemo(() => {
    const idx = phaseStats.findIndex(s => !s.complete);
    return idx === -1 ? phaseStats.length - 1 : idx;
  }, [phaseStats]);

  const totalTasks = getTotalTasks(phases);
  const completedTasks = getCompletedCount(phases, progressMap);
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Auto-scroll al nodo activo cuando cargan las fases
  useEffect(() => {
    if (!loading && activeNodeRef.current) {
      setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [loading, activeIndex]);

  const toggleTask = async (taskId: string) => {
    if (!submission || !userEmail) return;
    const newCompleted = !progressMap[taskId];
    const newRow: ProgressRow = {
      task_id: taskId,
      completed: newCompleted,
      notes: progress[taskId]?.notes || null,
    };
    setProgress(p => ({ ...p, [taskId]: newRow }));

    if (isDemo) return;

    const { error } = await supabase
      .from('client_roadmap_progress')
      .upsert({
        submission_id: submission.submission_id,
        email: userEmail,
        task_id: taskId,
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
        notes: newRow.notes,
      }, { onConflict: 'submission_id,task_id' });

    if (error) {
      toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
      setProgress(p => ({ ...p, [taskId]: { ...newRow, completed: !newCompleted } }));
    }
  };

  const updateNote = async (taskId: string, notes: string) => {
    if (!submission || !userEmail) return;
    setProgress(p => ({ ...p, [taskId]: { ...(p[taskId] || { task_id: taskId, completed: false, notes: null }), notes } }));
    if (isDemo) return;
    await supabase
      .from('client_roadmap_progress')
      .upsert({
        submission_id: submission.submission_id,
        email: userEmail,
        task_id: taskId,
        completed: progressMap[taskId],
        notes,
      }, { onConflict: 'submission_id,task_id' });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/mi-roadmap');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">No se encontró tu roadmap.</p>
        <Button onClick={() => navigate('/mi-roadmap')}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header sticky */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={anerfyLogo} alt="Anerfy" className="h-6 brightness-0 invert" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-primary">{overallPct}%</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="h-8 px-2">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 pb-3">
          <Progress value={overallPct} className="h-1.5" />
          <p className="text-[10px] text-muted-foreground mt-1 text-center">
            {completedTasks} / {totalTasks} tareas · {phases.length} fases
          </p>
        </div>
      </header>

      {/* Saludo */}
      <div className="max-w-md mx-auto px-4 pt-6 pb-2 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-3 py-1 mb-3"
        >
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-xs text-primary font-medium">Tu camino a la Approbation</span>
        </motion.div>
        <h1 className="text-xl font-semibold">
          ¡Hola {submission.nombre_completo?.split(' ')[0] || 'Doctor'}! 👋
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Toca cada nodo para ver y completar tareas
        </p>
      </div>

      {/* Islas flotantes: Noticias + Vida en Alemania */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-2 grid grid-cols-2 gap-3">
        {/* Isla Noticias */}
        <motion.div
          initial={{ opacity: 0, y: 10, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          whileHover={{ y: -2, rotate: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-3 shadow-[0_4px_0_hsl(var(--border))] relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Newspaper className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Noticias</p>
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          </div>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.bundesregierung.de/breg-de/themen/fachkraefteeinwanderung"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-[11px] font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  Nueva ley de inmigración facilita reconocimiento médico
                </p>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  <span>Hace 2 días</span>
                </div>
              </a>
            </li>
            <li className="pt-2 border-t border-border/50">
              <a
                href="https://www.aerzteblatt.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-[11px] font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  Hospitales en Bayern aumentan vacantes para extranjeros
                </p>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />
                  <span>Esta semana</span>
                </div>
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Isla Vida en Alemania - Próximamente */}
        <motion.div
          initial={{ opacity: 0, y: 10, rotate: 1 }}
          animate={{ opacity: 1, y: 0, rotate: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-secondary/50 to-secondary/20 border border-dashed border-border rounded-2xl p-3 shadow-[0_4px_0_hsl(var(--border))] relative overflow-hidden"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center">
              <Home className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vida en DE</p>
          </div>
          <p className="text-[11px] font-semibold leading-tight text-foreground/80 mb-2">
            Vivienda, taxes, escuelas, comunidad latina...
          </p>
          <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Próximamente</span>
          </div>
        </motion.div>
      </div>

      {/* Camino zigzag */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="relative">
          {/* Línea SVG zigzag de fondo */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.5" className="fill-border" />
              </pattern>
            </defs>
          </svg>

          {phases.map((phase, i) => {
            const stats = phaseStats[i];
            const isActive = i === activeIndex;
            const isLocked = i > activeIndex;
            const isComplete = stats.complete;
            const Icon = PHASE_ICONS[phase.id] || Star;
            // zigzag fuerte: par = izquierda extrema, impar = derecha extrema
            const isLeft = i % 2 === 0;
            const Connector = i < phases.length - 1 ? (
              <div className="flex justify-center w-full my-1" aria-hidden="true">
                <div className="flex flex-col gap-1.5">
                  {[0, 1, 2, 3].map(d => (
                    <div key={d} className="w-1.5 h-1.5 rounded-full bg-border" />
                  ))}
                </div>
              </div>
            ) : null;

            return (
              <div key={phase.id}>
                <div className={`grid grid-cols-2 gap-2 items-center ${isLeft ? '' : ''}`}>
                  {/* Columna izquierda */}
                  <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} relative`}>
                    {isLeft && (
                      <PhaseNode
                        phase={phase}
                        Icon={Icon}
                        stats={stats}
                        isActive={isActive}
                        isLocked={isLocked}
                        isComplete={isComplete}
                        index={i}
                        nodeRef={isActive ? activeNodeRef : null}
                        onOpen={() => setOpenPhase(phase)}
                      />
                    )}
                  </div>
                  {/* Columna derecha */}
                  <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} relative`}>
                    {!isLeft && (
                      <PhaseNode
                        phase={phase}
                        Icon={Icon}
                        stats={stats}
                        isActive={isActive}
                        isLocked={isLocked}
                        isComplete={isComplete}
                        index={i}
                        nodeRef={isActive ? activeNodeRef : null}
                        onOpen={() => setOpenPhase(phase)}
                      />
                    )}
                    {/* Torito en la columna opuesta al nodo activo */}
                    {isActive && !isComplete && isLeft && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                      >
                        <div className="bg-card border border-border rounded-xl px-2 py-1 shadow-md mb-1">
                          <p className="text-[10px] font-semibold whitespace-nowrap">¡Vamos! 💪</p>
                        </div>
                        <motion.img
                          src={torito}
                          alt="Tu guía"
                          width={88}
                          height={88}
                          className="w-22 h-22 drop-shadow-xl"
                          style={{ width: 88, height: 88 }}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </motion.div>
                    )}
                  </div>
                  {/* Si nodo está a la derecha, torito en la izquierda */}
                  {isActive && !isComplete && !isLeft && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                      style={{ position: 'absolute' }}
                    >
                      <div className="bg-card border border-border rounded-xl px-2 py-1 shadow-md mb-1">
                        <p className="text-[10px] font-semibold whitespace-nowrap">¡Vamos! 💪</p>
                      </div>
                      <motion.img
                        src={torito}
                        alt="Tu guía"
                        width={88}
                        height={88}
                        className="drop-shadow-xl"
                        style={{ width: 88, height: 88 }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </motion.div>
                  )}
                </div>
                {Connector}
              </div>
            );
          })}

          {/* Meta final */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center mt-4"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_6px_0_hsl(var(--border))]">
              <Trophy className="w-12 h-12 text-amber-950" strokeWidth={2} />
            </div>
            <p className="text-sm font-bold mt-2">¡Approbation! 🎉</p>
            <p className="text-[10px] text-muted-foreground">Tu meta final</p>
          </motion.div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-12 px-6">
          Tu progreso se guarda automáticamente. Vuelve cuando quieras desde el link mágico que recibes por email.
        </p>
      </div>

      {/* Bottom Sheet de fase */}
      <AnimatePresence>
        {openPhase && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenPhase(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl z-40 max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = PHASE_ICONS[openPhase.id] || Star;
                    return (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    );
                  })()}
                  <div className="min-w-0">
                    <h2 className="font-semibold text-sm truncate">{openPhase.title}</h2>
                    <p className="text-xs text-muted-foreground truncate">{openPhase.subtitle}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setOpenPhase(null)} className="h-8 w-8 p-0 shrink-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="overflow-y-auto px-4 py-4 space-y-3">
                {openPhase.tasks.map(task => {
                  const checked = progressMap[task.id];
                  return (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          onClick={() => toggleTask(task.id)}
                          className={`text-sm cursor-pointer block ${checked ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}
                        >
                          {task.label}
                        </label>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        )}
                        {checked && (
                          <Textarea
                            placeholder="Notas (opcional)..."
                            value={progress[task.id]?.notes || ''}
                            onChange={(e) => updateNote(task.id, e.target.value)}
                            className="mt-2 text-xs min-h-[60px]"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border p-4 safe-area-inset-bottom space-y-2">
                <a
                  href={`https://wa.me/4915123456789?text=${encodeURIComponent(`Hola, necesito ayuda con la fase: ${openPhase.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    <Calendar className="w-4 h-4" />
                    Agendar llamada de ayuda
                  </Button>
                </a>
                <Button onClick={() => setOpenPhase(null)} className="w-full" size="lg">
                  Listo
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

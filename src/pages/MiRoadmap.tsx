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

      {/* Camino zigzag */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="relative">
          {phases.map((phase, i) => {
            const stats = phaseStats[i];
            const isActive = i === activeIndex;
            const isLocked = i > activeIndex;
            const isComplete = stats.complete;
            const Icon = PHASE_ICONS[phase.id] || Star;
            // zigzag: par = izquierda, impar = derecha
            const side = i % 2 === 0 ? 'left' : 'right';
            const offsetClass = side === 'left' ? '-translate-x-16' : 'translate-x-16';

            return (
              <div key={phase.id} className="relative flex flex-col items-center mb-2">
                {/* Línea conectora hacia el siguiente */}
                {i < phases.length - 1 && (
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-border via-border to-transparent rounded-full" />
                )}

                <motion.div
                  ref={isActive ? activeNodeRef : null}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                  className={`relative ${offsetClass} flex flex-col items-center`}
                >
                  {/* Mascota torito junto al nodo activo */}
                  {isActive && !isComplete && (
                    <motion.div
                      initial={{ opacity: 0, x: side === 'left' ? 30 : -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`absolute top-2 ${side === 'left' ? 'left-24' : 'right-24'} z-10`}
                    >
                      <motion.img
                        src={torito}
                        alt="Tu guía"
                        width={80}
                        height={80}
                        className="w-20 h-20 drop-shadow-lg"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <div className={`absolute -top-1 ${side === 'left' ? '-left-2' : '-right-2'} bg-card border border-border rounded-xl px-2 py-1 shadow-md whitespace-nowrap`}>
                        <p className="text-[10px] font-semibold">¡Vamos! 💪</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Nodo botón */}
                  <button
                    onClick={() => !isLocked && setOpenPhase(phase)}
                    disabled={isLocked}
                    className={`
                      relative w-20 h-20 rounded-full flex items-center justify-center
                      transition-all duration-200 active:scale-95
                      ${isComplete
                        ? 'bg-gradient-to-br from-success to-success/70 shadow-[0_6px_0_hsl(var(--success)/0.4)] hover:shadow-[0_4px_0_hsl(var(--success)/0.4)] hover:translate-y-0.5'
                        : isActive
                          ? 'bg-gradient-to-br from-primary to-primary/70 shadow-[0_6px_0_hsl(var(--primary)/0.4)] hover:shadow-[0_4px_0_hsl(var(--primary)/0.4)] hover:translate-y-0.5 ring-4 ring-primary/20'
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

                    {/* Badge progreso */}
                    {!isLocked && !isComplete && stats.done > 0 && (
                      <div className="absolute -top-1 -right-1 bg-amber-400 text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center text-amber-950 border-2 border-background">
                        {stats.done}
                      </div>
                    )}

                    {/* Estrella final si está completa */}
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

                  {/* Etiqueta debajo */}
                  <div className="mt-2 text-center max-w-[140px]">
                    <p className={`text-xs font-semibold leading-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {phase.title.replace(/^Fase \d+ — /, '')}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {stats.done}/{stats.total} · {stats.pct}%
                    </p>
                  </div>
                </motion.div>

                {/* Espacio entre nodos */}
                <div className="h-12" />
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

              <div className="border-t border-border p-4 safe-area-inset-bottom">
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

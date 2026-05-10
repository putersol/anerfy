import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  Clock,
  CalendarCheck,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { generatePersonalizedRoadmap, getTotalTasks, getCompletedCount, RoadmapPhase } from '@/lib/roadmapGenerator';
import { calculateDashboardScores, getPillarDetails } from '@/lib/dashboardScoring';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';
import torito from '@/assets/torito-mascot.png';
import FloatingShapes from '@/components/FloatingShapes';

interface ProgressRow {
  task_id: string;
  completed: boolean;
  notes: string | null;
}

const PHASE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fase_documentos: FileText,
  fase_idioma: UmlautIcon as any,
  fase_bundesland: MapPin,
  fase_fsp: GraduationCap,
  fase_kenntnis: Stethoscope,
  fase_berufserlaubnis: Award,
  fase_approbation: Trophy,
  fase_finanzas: Wallet,
};

// Letra "ä" estilizada para representar idioma alemán
function UmlautIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <text
        x="12"
        y="20"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fontFamily="Geist, system-ui, sans-serif"
      >
        Ä
      </text>
    </svg>
  );
}

// Tonos dentro de la paleta azul de marca (primary #1a56db)
const PHASE_COLORS: Record<string, { from: string; to: string; shadow: string }> = {
  fase_documentos:     { from: 'from-blue-300',    to: 'to-blue-500',    shadow: 'shadow-[0_6px_0_rgb(59,130,246)]' },
  fase_idioma:         { from: 'from-blue-400',    to: 'to-blue-600',    shadow: 'shadow-[0_6px_0_rgb(37,99,235)]' },
  fase_bundesland:     { from: 'from-indigo-400',  to: 'to-indigo-600',  shadow: 'shadow-[0_6px_0_rgb(79,70,229)]' },
  fase_fsp:            { from: 'from-blue-500',    to: 'to-blue-700',    shadow: 'shadow-[0_6px_0_rgb(29,78,216)]' },
  fase_kenntnis:       { from: 'from-indigo-500',  to: 'to-indigo-700',  shadow: 'shadow-[0_6px_0_rgb(67,56,202)]' },
  fase_berufserlaubnis:{ from: 'from-sky-400',     to: 'to-sky-600',     shadow: 'shadow-[0_6px_0_rgb(2,132,199)]' },
  fase_approbation:    { from: 'from-blue-600',    to: 'to-indigo-700',  shadow: 'shadow-[0_6px_0_rgb(67,56,202)]' },
  fase_finanzas:       { from: 'from-cyan-400',    to: 'to-blue-600',    shadow: 'shadow-[0_6px_0_rgb(37,99,235)]' },
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
  const color = PHASE_COLORS[phase.id] ?? { from: 'from-primary', to: 'to-primary/70', shadow: 'shadow-[0_6px_0_hsl(var(--primary)/0.4)]' };
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
          relative w-20 h-20 rounded-2xl flex items-center justify-center
          transition-all duration-200 active:scale-95
          ${isLocked
            ? 'bg-muted shadow-[0_4px_0_hsl(var(--border))] cursor-not-allowed opacity-60'
            : isComplete
              ? `bg-gradient-to-br ${color.from} ${color.to} ${color.shadow} hover:translate-y-0.5 opacity-90`
              : isActive
                ? `bg-gradient-to-br ${color.from} ${color.to} ${color.shadow} hover:translate-y-0.5 ring-4 ring-primary/30`
                : `bg-gradient-to-br ${color.from} ${color.to} ${color.shadow} hover:translate-y-0.5`
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
      </button>
      <div className="mt-2.5 text-center max-w-[150px] w-[150px]">
        <p className={`text-sm font-semibold leading-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
          {phase.title.replace(/^Fase \d+ — /, '')}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          {stats.done}/{stats.total} · {stats.pct}%
        </p>
        <div className="mt-1.5 h-1 w-full bg-muted/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isComplete ? 'bg-success' : isActive ? 'bg-primary' : 'bg-muted-foreground/40'}`}
            style={{ width: `${stats.pct}%` }}
          />
        </div>
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
  const [searchParams] = useSearchParams();
  const isAdminView = searchParams.get('admin') === '1';
  const isDemo = submissionId === 'demo';
  const isReadOnly = isAdminView; // admins solo pueden ver
  const [loading, setLoading] = useState(!isDemo);
  const [submission, setSubmission] = useState<any>(isDemo ? DEMO_SUBMISSION : null);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [openPhase, setOpenPhase] = useState<RoadmapPhase | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(isDemo ? 'demo@anerfy.com' : null);
  const activeNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isDemo) return;
    async function init() {
      // Modo admin: solo lectura, sin auth de cliente
      if (isAdminView) {
        const { data: sub, error: subErr } = await supabase
          .from('diagnostico_submissions')
          .select('*')
          .eq('submission_id', submissionId)
          .maybeSingle();
        if (subErr || !sub) {
          toast({ title: 'No se encontró el diagnóstico', variant: 'destructive' });
          setLoading(false);
          return;
        }
        setSubmission(sub);
        setUserEmail(sub.email || null);
        const { data: prog } = await supabase
          .from('client_roadmap_progress')
          .select('task_id, completed, notes')
          .eq('submission_id', submissionId);
        const progMap: Record<string, ProgressRow> = {};
        (prog || []).forEach((p: any) => { progMap[p.task_id] = p; });
        setProgress(progMap);
        setLoading(false);
        return;
      }

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

      if (!(sub as any).client_access_unlocked) {
        toast({
          title: 'Acceso aún no disponible',
          description: 'Tu roadmap se habilita después de tu asesoría de 90 min.',
          variant: 'destructive',
        });
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
  }, [authLoading, user, submissionId, navigate, toast, isDemo, isAdminView]);

  const phases = useMemo(() => (submission ? generatePersonalizedRoadmap(submission) : []), [submission]);

  const scores = useMemo(() => (submission ? calculateDashboardScores(submission) : null), [submission]);
  const pillarDetails = useMemo(
    () => (submission && scores ? getPillarDetails(submission, scores) : null),
    [submission, scores],
  );

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
    if (isReadOnly) return;
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
    if (isReadOnly) return;
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Capa de fondo fija (anillos esparcidos + glows) — visible mientras scrolleas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Franja vertical luminosa central (resalta el camino de los nodos) */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[260px] sm:w-[340px]"
          style={{
            background:
              'linear-gradient(to bottom, hsl(var(--primary) / 0) 0%, hsl(var(--primary) / 0.18) 20%, hsl(var(--primary) / 0.22) 50%, hsl(var(--primary) / 0.18) 80%, hsl(var(--primary) / 0) 100%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[120px] sm:w-[160px]"
          style={{
            background:
              'linear-gradient(to bottom, hsl(var(--primary) / 0) 0%, hsl(var(--primary) / 0.28) 50%, hsl(var(--primary) / 0) 100%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Glows de fondo cubriendo la pantalla */}
        <div className="absolute top-[10%] left-[18%] w-[420px] h-[420px] bg-primary/12 rounded-full blur-[130px]" />
        <div className="absolute top-[8%] right-[14%] w-[460px] h-[460px] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] sm:w-[900px] sm:h-[600px] bg-primary/14 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[380px] h-[380px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[12%] right-[12%] w-[420px] h-[420px] bg-primary/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] bg-primary/22 rounded-full blur-[80px]" />

        {/* Anillos centrales (orbitas grandes) */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] sm:w-[1100px] sm:h-[1100px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full border border-primary/8 rounded-[45%]" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] sm:w-[1400px] sm:h-[1400px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 95, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full border border-primary/6 rounded-[50%]" />
        </motion.div>

        {/* Anillos esparcidos en todo el viewport */}
        {[
          { top: '6%',  left: '4%',  size: 170, dur: 55, dir: 1,  op: 14 },
          { top: '12%', left: '78%', size: 220, dur: 75, dir: -1, op: 12 },
          { top: '4%',  left: '42%', size: 140, dur: 42, dir: -1, op: 16 },
          { top: '38%', left: '-3%', size: 280, dur: 85, dir: 1,  op: 10 },
          { top: '42%', left: '85%', size: 200, dur: 62, dir: -1, op: 14 },
          { top: '68%', left: '6%',  size: 240, dur: 78, dir: -1, op: 12 },
          { top: '72%', left: '74%', size: 260, dur: 92, dir: 1,  op: 10 },
          { top: '88%', left: '38%', size: 180, dur: 50, dir: 1,  op: 14 },
          { top: '52%', left: '24%', size: 130, dur: 38, dir: 1,  op: 16 },
          { top: '24%', left: '60%', size: 110, dur: 34, dir: -1, op: 18 },
        ].map((r, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute"
            style={{ top: r.top, left: r.left, width: r.size, height: r.size }}
            animate={{ rotate: 360 * r.dir }}
            transition={{ duration: r.dur, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="w-full h-full border-2 rounded-[42%]"
              style={{ borderColor: `hsl(var(--primary) / ${r.op / 100})` }}
            />
          </motion.div>
        ))}
      </div>
      {isAdminView && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium px-4 py-2 text-center sticky top-0 z-30">
          👁️ Modo admin · Solo lectura · {submission?.nombre_completo || submission?.email || 'Cliente'}
          <button onClick={() => navigate('/admin')} className="ml-3 underline">Volver a /admin</button>
        </div>
      )}
      {/* Header sticky */}
      <header className={`border-b border-border bg-card/80 backdrop-blur-md sticky ${isAdminView ? 'top-9' : 'top-0'} z-20`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="w-20" />
          <Link to="/" className="flex items-center justify-center gap-3">
            <img src={anerfyLogo} alt="Anerfy logo" className="h-10 sm:h-12 brightness-0 invert object-contain scale-[1.4]" />
            <span className="text-base sm:text-lg font-bold tracking-[0.35em] text-foreground/80 font-sans">
              ANERFY
            </span>
          </Link>
          <div className="flex items-center gap-4 w-20 justify-end">
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-primary">{overallPct}%</span>
            </div>
            {!isAdminView && (
              <Button variant="ghost" size="sm" onClick={logout} className="h-9 px-3">
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-3">
          <Progress value={overallPct} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1.5 text-center">
            {completedTasks} / {totalTasks} tareas · {phases.length} fases
          </p>
        </div>
      </header>

      {/* Layout principal: sidebar servicios | mapa central | sidebar noticias */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-8 pb-6 grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-8">
        {/* Sidebar izquierdo: Servicios & Partners */}
        <aside className="space-y-4 lg:sticky lg:top-28 self-start order-2 lg:order-1 lg:mt-40">
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            href={`https://cal.eu/anerfy/asesoria-seguimiento?name=${encodeURIComponent(submission.nombre_completo || '')}&email=${encodeURIComponent(submission.email || '')}&metadata[submission_id]=${submission.submission_id || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5 p-5 hover:border-primary/60 hover:from-primary/20 transition-all group shadow-[0_4px_0_hsl(var(--primary)/0.2)]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
                Asesoría de seguimiento
              </h3>
              <ExternalLink className="w-4 h-4 text-primary shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Agenda tu próxima sesión — repasamos progreso y ajustamos el plan.
            </p>
          </motion.a>

          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            href={`https://wa.me/4915123456789?text=${encodeURIComponent(`Hola, soy ${submission.nombre_completo || 'médico/a'} y me interesa la bolsa de trabajo de Anerfy. Quiero que un asesor me ayude a encontrar un buen empleo en Alemania.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-5 hover:border-emerald-500/60 hover:from-emerald-500/20 transition-all group shadow-[0_4px_0_hsl(160_84%_30%/0.25)]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors flex-1">
                Bolsa de trabajo
              </h3>
              <ExternalLink className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground leading-snug mb-3">
              Contáctanos por WhatsApp — un asesor te ayuda a conseguir un empleo con buen sueldo y condiciones.
            </p>
            <div className="space-y-3">
              {/* Sección Approbation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Approbation
                  </p>
                  <span className="text-[10px] text-muted-foreground">2 vacantes</span>
                </div>
                <div className="space-y-2">
                  <div className="rounded-md border border-emerald-500/30 bg-background/40 p-2.5">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      Medicina física y rehabilitación
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Niedersachsen · Tiempo completo</p>
                  </div>
                  <div className="rounded-md border border-emerald-500/30 bg-background/40 p-2.5">
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      Ortopedia
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Niedersachsen · Tiempo completo</p>
                  </div>
                </div>
              </div>

              {/* Divisor */}
              <div className="border-t border-emerald-500/20" />

              {/* Sección Berufserlaubnis */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Berufserlaubnis
                  </p>
                  <span className="text-[10px] text-muted-foreground">Próximamente</span>
                </div>
                <div className="rounded-md border border-dashed border-emerald-500/25 bg-background/20 p-2.5">
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Sin vacantes activas. Contáctanos para que un asesor te avise en cuanto abramos posiciones.
                  </p>
                </div>
              </div>
            </div>
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-5 shadow-[0_4px_0_hsl(var(--border))]"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Servicios partner</p>
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://virtus-fsp.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group rounded-lg border border-border/60 p-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Virtus FSP
                    </p>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Preparación intensiva para el examen FSP
                  </p>
                </a>
              </li>
              <li>
                <a
                  href="https://hispanoakademie.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group rounded-lg border border-border/60 p-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Hispano Akademie
                    </p>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Cursos de alemán médico para hispanohablantes
                  </p>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/4915123456789?text=Hola,%20quiero%20saber%20m%C3%A1s%20sobre%20servicios%20Anerfy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group rounded-lg border border-dashed border-border/60 p-3 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      Más servicios
                    </p>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Apostilla, traducciones, vivienda, visa…
                  </p>
                </a>
              </li>
            </ul>
          </motion.div>
        </aside>

        {/* Centro: mapa */}
        <div className="min-w-0 order-1 lg:order-2 relative">
          {/* Halo de resalto detrás del mapa */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute -top-[60%] left-1/2 -translate-x-1/2 w-[200%] h-[260%] bg-gradient-to-b from-primary/35 via-primary/25 via-40% to-transparent blur-3xl rounded-[50%]" />
            <div className="absolute inset-0 bg-gradient-to-b from-card/60 via-card/30 to-transparent backdrop-blur-sm rounded-3xl border border-primary/15 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.25)]" />
          </div>

          <div className="relative px-4 sm:px-6 py-6">
          {/* Saludo */}
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm font-light tracking-[0.25em] uppercase text-muted-foreground mb-4"
            >
              Bienvenido, <span className="text-foreground font-normal">{submission.nombre_completo?.split(' ')[0] || 'Doctor'}</span>
            </motion.p>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-4xl sm:text-5xl font-normal leading-tight"
            >
              Tu camino a la{' '}
              <span className="italic font-accent font-semibold text-primary">
                Approbation
              </span>
            </motion.h1>
          </div>

          {/* Camino zigzag */}
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
            // Documentación e Idioma se pueden trabajar en paralelo desde el inicio
            const alwaysUnlocked = phase.id === 'fase_documentos' || phase.id === 'fase_idioma';
            const isLocked = !alwaysUnlocked && i > activeIndex;
            const isComplete = stats.complete;
            const Icon = PHASE_ICONS[phase.id] || Star;
            // zigzag fuerte: par = izquierda extrema, impar = derecha extrema
            const isLeft = i % 2 === 0;
            // Curva tipo "anillo" entre islas; alterna dirección según zigzag
            const Connector = i < phases.length - 1 ? (
              <div className="relative w-full h-14 -my-1" aria-hidden="true">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 64"
                  preserveAspectRatio="none"
                >
                  <path
                    d={isLeft
                      ? 'M 30 0 Q 100 32, 170 64'
                      : 'M 170 0 Q 100 32, 30 64'}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeOpacity="0.18"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : null;

            return (
              <div key={phase.id}>
                <div className="grid grid-cols-2 gap-2 items-center max-w-lg mx-auto">
                  {/* Columna izquierda */}
                  <div className={`flex ${isLeft ? 'justify-end pr-2' : 'justify-end'} relative`}>
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
                  <div className={`flex ${isLeft ? 'justify-start' : 'justify-start pl-2'} relative`}>
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
                  </div>
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f4d97a] via-[#d4af37] to-[#8a6d1f] flex items-center justify-center shadow-[0_6px_24px_-4px_rgba(212,175,55,0.5)] ring-1 ring-[#d4af37]/40">
              <Trophy className="w-12 h-12 text-[#3a2c08]" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-semibold mt-3 tracking-wide bg-gradient-to-r from-[#f4d97a] to-[#d4af37] bg-clip-text text-transparent">¡Approbation!</p>
            <p className="text-[10px] text-muted-foreground">Tu meta final</p>
          </motion.div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-12 px-6">
            Tu progreso se guarda automáticamente. Vuelve cuando quieras desde el link mágico que recibes por email.
          </p>
          </div>
        </div>

        {/* Sidebar derecho: Noticias + Vida en DE */}
        <aside className="space-y-4 lg:sticky lg:top-28 self-start order-3 lg:mt-40">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-5 shadow-[0_4px_0_hsl(var(--border))]"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Noticias</p>
              <div className="ml-auto w-2 h-2 rounded-full bg-success" />
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.bundesregierung.de/breg-de/themen/fachkraefteeinwanderung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    Nueva ley de inmigración facilita reconocimiento médico
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Hace 2 días</span>
                  </div>
                </a>
              </li>
              <li className="pt-3 border-t border-border/50">
                <a
                  href="https://www.aerzteblatt.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                    Hospitales en Bayern aumentan vacantes para extranjeros
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Esta semana</span>
                  </div>
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-secondary/50 to-secondary/20 border border-dashed border-border rounded-lg p-5 shadow-[0_4px_0_hsl(var(--border))]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                <Home className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vida en DE</p>
            </div>
            <p className="text-sm font-semibold leading-snug text-foreground/80 mb-3">
              Vivienda, taxes, escuelas, comunidad latina...
            </p>
            <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Próximamente</span>
            </div>
          </motion.div>
        </aside>
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
                        disabled={isReadOnly}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          onClick={() => !isReadOnly && toggleTask(task.id)}
                          className={`text-sm block ${isReadOnly ? '' : 'cursor-pointer'} ${checked ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}
                        >
                          {task.label}
                        </label>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        )}
                        {checked && (
                          <Textarea
                            placeholder={isReadOnly ? 'Sin notas' : 'Notas (opcional)...'}
                            value={progress[task.id]?.notes || ''}
                            onChange={(e) => updateNote(task.id, e.target.value)}
                            readOnly={isReadOnly}
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

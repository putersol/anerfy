import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Circle, LogOut, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { generatePersonalizedRoadmap, getTotalTasks, getCompletedCount, RoadmapPhase } from '@/lib/roadmapGenerator';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

interface ProgressRow {
  task_id: string;
  completed: boolean;
  notes: string | null;
}

export default function MiRoadmap() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [progress, setProgress] = useState<Record<string, ProgressRow>>({});
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (authLoading) return;

      if (!user?.email) {
        navigate('/mi-roadmap', { replace: true });
        return;
      }
      setUserEmail(user.email);

      // Load submission
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

      // Verify this submission belongs to the logged-in user
      if (sub.email?.toLowerCase() !== user.email.toLowerCase()) {
        toast({ title: 'Este roadmap no está asociado a tu email', variant: 'destructive' });
        await supabase.auth.signOut();
        navigate('/mi-roadmap', { replace: true });
        return;
      }

      setSubmission(sub);

      // Load saved progress
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
  }, [authLoading, user, submissionId, navigate, toast]);

  const phases = useMemo(() => submission ? generatePersonalizedRoadmap(submission) : [], [submission]);

  const progressMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    phases.forEach(p => p.tasks.forEach(t => {
      map[t.id] = progress[t.id]?.completed ?? !!t.preCompleted;
    }));
    return map;
  }, [phases, progress]);

  const totalTasks = getTotalTasks(phases);
  const completedTasks = getCompletedCount(phases, progressMap);
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
      // revert
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
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={anerfyLogo} alt="Anerfy" className="h-6 brightness-0 invert" />
          </Link>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-1" /> Salir
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress overview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">Mi Roadmap Personalizado</p>
            <h1 className="text-2xl font-semibold mt-1">
              Hola {submission.nombre_completo?.split(' ')[0] || 'Doctor'} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Camino hacia tu Approbation en Alemania — adaptado a tu situación
            </p>
          </div>

          <Card className="p-5 mt-5 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="font-medium">Progreso global</span>
              </div>
              <span className="text-2xl font-bold text-primary">{overallPct}%</span>
            </div>
            <Progress value={overallPct} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} de {totalTasks} tareas completadas
            </p>
          </Card>
        </motion.div>

        {/* Phases */}
        <div className="mt-8 space-y-3">
          {phases.map((phase, i) => {
            const phaseTotal = phase.tasks.length;
            const phaseDone = phase.tasks.filter(t => progressMap[t.id]).length;
            const phasePct = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;
            const isExpanded = expandedPhase === phase.id;
            const isComplete = phasePct === 100;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`overflow-hidden ${isComplete ? 'border-success/40 bg-success/5' : ''}`}>
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{phase.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{phase.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-semibold">{phaseDone}/{phaseTotal}</p>
                        <p className="text-[10px] text-muted-foreground">{phasePct}%</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-4 py-3 space-y-3">
                      {phase.tasks.map(task => {
                        const checked = progressMap[task.id];
                        return (
                          <div key={task.id} className="flex items-start gap-3">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <label
                                onClick={() => toggleTask(task.id)}
                                className={`text-sm cursor-pointer ${checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                              >
                                {task.label}
                              </label>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
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
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Tu progreso se guarda automáticamente. Vuelve cuando quieras desde el link mágico que recibes por email.
        </p>
      </div>
    </div>
  );
}

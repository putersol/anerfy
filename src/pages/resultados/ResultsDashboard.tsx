import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDashboardScores } from '@/lib/dashboardScoring';
import { useSlideNavigation } from './useSlideNavigation';
import AdvisorTools from './AdvisorTools';
import SlideCover from './slides/SlideCover';
import SlideTOC from './slides/SlideTOC';
import SlideSectionDivider from './slides/SlideSectionDivider';
import SlideScoreDashboard from './slides/SlideScoreDashboard';
import SlideRoadmap from './slides/SlideRoadmap';
import SlideStrengthsGaps from './slides/SlideStrengthsGaps';
import SlideDocumentos from './slides/SlideDocumentos';
import SlideLanguageTimeline from './slides/SlideLanguageTimeline';
import SlideActionPlan from './slides/SlideActionPlan';
import SlideCompetitiveProfile from './slides/SlideCompetitiveProfile';
import SlideNextSteps from './slides/SlideNextSteps';
import SlideExecutiveSummary from './slides/SlideExecutiveSummary';
import SlideRoadmapPost from './slides/SlideRoadmapPost';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

const TOTAL_SLIDES = 15;

export default function ResultsDashboard() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentSlide, direction, goTo, next, prev } = useSlideNavigation(TOTAL_SLIDES);

  useEffect(() => {
    if (!submissionId) { setError('No se proporcionó ID'); setLoading(false); return; }
    async function load() {
      const { data, error: err } = await supabase
        .from('diagnostico_submissions')
        .select('*')
        .eq('submission_id', submissionId)
        .single();
      if (err || !data) {
        setError('No se encontró el caso');
      } else {
        setSubmission(data);
      }
      setLoading(false);
    }
    load();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">{error || 'Error desconocido'}</p>
        <button onClick={() => navigate('/admin')} className="text-primary text-sm hover:underline">
          Volver al admin
        </button>
      </div>
    );
  }

  const scores = calculateDashboardScores(submission);

  const slides = [
    // 1. Cover
    <SlideCover key="cover" submission={submission} />,
    // 2. TOC
    <SlideTOC key="toc" scores={scores} onNavigate={goTo} />,
    // 3. Section: Estado Actual
    <SlideSectionDivider key="div1" title="¿Dónde Estás Hoy?" subtitle="Estado Actual" description="Diagnóstico y posicionamiento — Evaluación completa del punto de partida" />,
    // 4. Score Dashboard
    <SlideScoreDashboard key="score" submission={submission} scores={scores} />,
    // 5. Roadmap 9 stages
    <SlideRoadmap key="roadmap" submission={submission} scores={scores} />,
    // 6. Strengths vs Gaps
    <SlideStrengthsGaps key="gaps" submission={submission} scores={scores} />,
    // 7. Documentos
    <SlideDocumentos key="docs" submission={submission} scores={scores} />,
    // 8. Section: Recursos
    <SlideSectionDivider key="div2" title="Recursos e Inversión Necesaria" subtitle="Planificación" description="Presupuesto real y timeline de idioma" />,
    // 8. Language Timeline
    <SlideLanguageTimeline key="lang" submission={submission} scores={scores} />,
    // 9. Section: Plan de Acción
    <SlideSectionDivider key="div3" title="Ejecución — Plan de Acción" subtitle="Primeros 90 Días" description="Tareas concretas priorizadas por mes" />,
    // 10. 90-Day Action Plan
    <SlideActionPlan key="action" submission={submission} scores={scores} />,
    // 11. Competitive Profile
    <SlideCompetitiveProfile key="comp" submission={submission} scores={scores} />,
    // 12. Next Steps
    <SlideNextSteps key="next" submission={submission} scores={scores} />,
    // 13. Roadmap Post-Asesoría
    <SlideRoadmapPost key="roadmap-post" submission={submission} scores={scores} />,
    // 14. Executive Summary
    <SlideExecutiveSummary key="summary" submission={submission} scores={scores} />,
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Advisor tools */}
      <AdvisorTools currentSlide={currentSlide} submissionId={submissionId || ''} />

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={anerfyLogo} alt="Anerfy" className="h-6 brightness-0 invert" />
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs text-muted-foreground">
            {submission.nombre_completo || 'Caso'} — Resultados
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{currentSlide + 1}/{TOTAL_SLIDES}</span>
          <button
            onClick={() => {
              if (!document.fullscreenElement) document.documentElement.requestFullscreen();
              else document.exitFullscreen();
            }}
            className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <Maximize className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ x: direction * 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card/50 backdrop-blur-sm">
        <button
          onClick={prev}
          disabled={currentSlide === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentSlide
                  ? 'bg-primary w-4'
                  : 'bg-muted-foreground/20 w-1.5 hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={currentSlide === TOTAL_SLIDES - 1}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Send, Stethoscope, Clock, Shield,
  MessageCircle, Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import anerfyLogo from "@/assets/anerfy-logo-dark.png";
import {
  diagnosticoSchema, DiagnosticoForm, DOCUMENT_NAMES, calculateScores,
} from "./diagnostico/schema";
import { CONDITION_FIELDS, getVisibleQuestions } from "./diagnostico/questions";
import QuestionView from "./diagnostico/QuestionView";
import { markTokenUsed, type TokenData } from "@/hooks/useTokenValidation";

const defaultDocs: Record<string, "no_tengo"> = {};
DOCUMENT_NAMES.forEach((_, i) => {
  defaultDocs[`doc_${i}`] = "no_tengo";
});

interface DiagnosticoProps {
  tokenData?: TokenData;
}

export default function Diagnostico({ tokenData }: DiagnosticoProps = {}) {
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showScore, setShowScore] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<DiagnosticoForm>({
    resolver: zodResolver(diagnosticoSchema),
    mode: "onTouched",
    defaultValues: {
      nombreCompleto: "", paisOrigen: "", nacionalidad: "", edad: "",
      estadoCivil: "", viajaSolo: "", tieneHijos: "", viajaMascota: "",
      ciudadPreferida: "", bundeslandPreferido: "", tieneContactosAlemania: "",
      dondeContactos: "", universidad: "", anioGraduacion: "",
      realizoInternado: "", tieneEspecialidad: "", cualEspecialidad: "",
      aniosExperiencia: "", areasTrabajo: "", nivelAleman: "",
      tieneCertificado: "", cualCertificado: "", estudiaActualmente: "",
      horasPorSemana: "", estudioAlemanMedico: "", presentoFSP: "",
      presentoKenntnis: "", documentos: defaultDocs, envioDocumentos: "",
      bundeslandEnvio: "", recibioRespuesta: "", solicitaronExamen: "",
      tieneBerufserlaubnis: "", tieneApprobation: "", tipoVisa: "",
      viajaConPareja: "", parejaHablaAleman: "", nivelAlemanPareja: "",
      parejaProfesion: "", dineroAhorrado: "", puedeAbrirSperrkonto: "",
      apoyoFamiliar: "", dispuestoCiudadesPequenas: "",
      especialidadInteres: "", dispuestoEspecialidades: [],
      haAplicadoHospitales: "", haTenidoEntrevistas: "",
      cuandoViajar: "", puedeEstudiarIntensivo: "", puedeDedicar1a2Horas: "",
      motivacion: "",
    },
  });

  // Watch only condition fields for efficiency
  const conditionWatch = form.watch(CONDITION_FIELDS);
  const conditionValues = useMemo(() => {
    const map: Partial<Record<keyof DiagnosticoForm, string>> = {};
    CONDITION_FIELDS.forEach((f, i) => {
      map[f] = (conditionWatch[i] as string) || "";
    });
    return map;
  }, [conditionWatch]);

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(conditionValues),
    [conditionValues],
  );
  const totalQ = visibleQuestions.length;

  // Clamp qIndex if questions list shrank
  useEffect(() => {
    if (qIndex >= totalQ && totalQ > 0) setQIndex(totalQ - 1);
  }, [qIndex, totalQ]);

  const currentQuestion = visibleQuestions[qIndex];
  const totalScreens = totalQ + 1; // +1 for score screen
  const progress = showScore ? 100 : ((qIndex + 1) / totalScreens) * 100;

  const goNext = useCallback(() => {
    if (qIndex < totalQ - 1) {
      setDirection(1);
      setQIndex((i) => i + 1);
    } else {
      setDirection(1);
      setShowScore(true);
    }
  }, [qIndex, totalQ]);

  const goBack = useCallback(() => {
    if (showScore) {
      setShowScore(false);
      setDirection(-1);
      return;
    }
    if (qIndex > 0) {
      setDirection(-1);
      setQIndex((i) => i - 1);
    }
  }, [qIndex, showScore]);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    const data = form.getValues();
    const scores = calculateScores(data);
    const submissionId = crypto.randomUUID();

    try {
      const { error } = await supabase.from("diagnostico_submissions").insert({
        submission_id: submissionId,
        token_id: tokenData?.token || null,
        email: tokenData?.email || null,
        nombre_completo: data.nombreCompleto,
        pais_origen: data.paisOrigen,
        nacionalidad: data.nacionalidad,
        edad: data.edad,
        estado_civil: data.estadoCivil,
        viaja_solo: data.viajaSolo,
        tiene_hijos: data.tieneHijos,
        viaja_mascota: data.viajaMascota,
        ciudad_preferida: data.ciudadPreferida || null,
        bundesland_preferido: data.bundeslandPreferido || null,
        tiene_contactos_alemania: data.tieneContactosAlemania,
        donde_contactos: data.dondeContactos || null,
        universidad: data.universidad,
        anio_graduacion: data.anioGraduacion,
        realizo_internado: data.realizoInternado,
        tiene_especialidad: data.tieneEspecialidad,
        cual_especialidad: data.cualEspecialidad || null,
        anios_experiencia: data.aniosExperiencia,
        areas_trabajo: data.areasTrabajo,
        nivel_aleman: data.nivelAleman,
        tiene_certificado: data.tieneCertificado,
        cual_certificado: data.cualCertificado || null,
        estudia_actualmente: data.estudiaActualmente,
        horas_por_semana: data.horasPorSemana || null,
        estudio_aleman_medico: data.estudioAlemanMedico,
        presento_fsp: data.presentoFSP,
        presento_kenntnis: data.presentoKenntnis,
        documentos: data.documentos,
        envio_documentos: data.envioDocumentos,
        bundesland_envio: data.bundeslandEnvio || null,
        recibio_respuesta: data.recibioRespuesta || null,
        solicitaron_examen: data.solicitaronExamen || null,
        tiene_berufserlaubnis: data.tieneBerufserlaubnis,
        tiene_approbation: data.tieneApprobation,
        tipo_visa: data.tipoVisa,
        viaja_con_pareja: data.viajaConPareja,
        pareja_habla_aleman: data.parejaHablaAleman || null,
        nivel_aleman_pareja: data.nivelAlemanPareja || null,
        pareja_profesion: data.parejaProfesion || null,
        dinero_ahorrado: data.dineroAhorrado,
        puede_abrir_sperrkonto: data.puedeAbrirSperrkonto,
        apoyo_familiar: data.apoyoFamiliar,
        dispuesto_ciudades_pequenas: data.dispuestoCiudadesPequenas,
        especialidad_interes: data.especialidadInteres || null,
        dispuesto_especialidades: data.dispuestoEspecialidades || [],
        ha_aplicado_hospitales: data.haAplicadoHospitales,
        ha_tenido_entrevistas: data.haTenidoEntrevistas,
        cuando_viajar: data.cuandoViajar,
        puede_estudiar_intensivo: data.puedeEstudiarIntensivo,
        puede_dedicar_1a2_horas: data.puedeDedicar1a2Horas,
        motivacion: data.motivacion,
        score_idioma: scores.idioma,
        score_documentos: scores.documentos,
        score_homologacion: scores.homologacion,
        score_finanzas: scores.finanzas,
        score_estrategia: scores.estrategia,
        score_total: scores.total,
        clasificacion: scores.clasificacion,
      });

      if (error) throw error;

      // Mark token as used if this was a gated submission
      if (tokenData?.token) {
        await markTokenUsed(tokenData.token, submissionId);
      }

      setSubmitted(true);
      toast({
        title: "Diagnóstico enviado",
        description: "Tu asesor revisará tu caso pronto.",
      });
    } catch (err) {
      console.error("Error saving submission:", err);
      setSubmitted(true);
      toast({
        title: "Diagnóstico completado",
        description: "Hubo un problema al guardar, pero puedes ver tus resultados.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }, [form, toast, tokenData]);

  // ─── Welcome Screen ───
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col p-4 bg-[#0f1729]">
        {/* Logo top-left */}
        <div className="relative z-10 flex items-center justify-center gap-2 pt-8 pb-4">
          <img src={anerfyLogo} alt="Anerfy logo" className="w-8 h-8 sm:w-9 sm:h-9 brightness-0 invert object-contain scale-[1.6]" />
          <span className="text-sm sm:text-base font-bold tracking-[0.35em] text-foreground/80 font-sans">ANERFY</span>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md w-full mx-auto flex-1 flex flex-col justify-center"
        >

          <div className="w-20 h-20 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <Stethoscope className="w-10 h-10 text-blue-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Diagnóstico Migratorio
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Este formulario evalúa tu perfil para ejercer medicina en Alemania.
            Con tus respuestas generamos tu <span className="text-blue-400 font-medium">Migration Score</span> y
            diseñamos una ruta personalizada para tu caso.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400">5-8 minutos</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400">100% confidencial</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Stethoscope className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-400">~50 preguntas</p>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-1"
          >
            Comenzar diagnóstico
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Submitted Results ───
  if (submitted) {
    return <SubmittedScreen form={form} />;
  }

  // ─── Form: Questions + Score ───
  return (
    <div className="min-h-screen bg-[#0f1729] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-[#0f1729]/80 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <img src={anerfyLogo} alt="Anerfy" className="h-7 brightness-0 invert" />
            <div className="h-4 w-px bg-white/20" />
            <span className="text-slate-400 text-sm">Diagnóstico migratorio</span>
          </div>
          <div className="flex items-center gap-3">
            <Progress
              value={progress}
              className="h-1.5 flex-1 bg-white/10 [&>div]:bg-blue-500"
            />
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {showScore ? totalScreens : qIndex + 1}/{totalScreens}
            </span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-3">
        <button
          onClick={goBack}
          disabled={qIndex === 0 && !showScore}
          className="text-sm text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-default transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Atrás
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={showScore ? "score" : qIndex}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {showScore ? (
              <ScorePreview form={form} onSubmit={onSubmit} submitting={submitting} />
            ) : currentQuestion ? (
              <QuestionView
                question={currentQuestion}
                form={form}
                onNext={goNext}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Score Preview (before submit) ───

function ScorePreview({
  form,
  onSubmit,
  submitting,
}: {
  form: ReturnType<typeof useForm<DiagnosticoForm>>;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const data = form.getValues();
  const scores = calculateScores(data);
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (scores.total / 100) * circumference;

  let badgeColor = "bg-red-500";
  if (scores.total >= 70) badgeColor = "bg-emerald-500";
  else if (scores.total >= 40) badgeColor = "bg-amber-500";

  const categories = [
    { label: "🗣️ Idioma alemán", score: scores.idioma },
    { label: "📄 Documentos", score: scores.documentos },
    { label: "📬 Homologación", score: scores.homologacion },
    { label: "💰 Finanzas", score: scores.finanzas },
    { label: "🏥 Estrategia laboral", score: scores.estrategia },
  ];

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-md mx-auto w-full space-y-6">
      <div className="text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">📊 Migration Score</p>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Tu puntuación estimada</h2>
      </div>

      {/* Score circle */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="52" fill="none"
              stroke="#3b82f6" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - strokeDash }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-4xl font-bold text-white">{scores.total}</span>
            <span className="text-slate-400 text-sm block">/100</span>
          </div>
        </div>
        <div className={`inline-block mt-3 px-5 py-2 rounded-full ${badgeColor}`}>
          <span className="text-sm font-bold text-white">{scores.clasificacion}</span>
        </div>
      </motion.div>

      {/* Category bars */}
      <div className="w-full space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
        {categories.map(({ label, score }) => {
          const pct = (score / 20) * 100;
          let color = "bg-red-500";
          if (pct >= 70) color = "bg-emerald-500";
          else if (pct >= 40) color = "bg-amber-500";

          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{label}</span>
                <span className="text-white font-semibold">{score}/20</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="w-full bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
        <h3 className="text-white font-semibold text-sm">Resumen</h3>
        <SummaryRow label="Nombre" value={data.nombreCompleto} />
        <SummaryRow label="País" value={data.paisOrigen} />
        <SummaryRow label="Nivel alemán" value={data.nivelAleman} />
        <SummaryRow label="Especialidad" value={data.cualEspecialidad || data.especialidadInteres || "No indicada"} />
        <SummaryRow label="Experiencia" value={data.aniosExperiencia ? `${data.aniosExperiencia} años` : ""} />
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            Enviar diagnóstico <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

// ─── Submitted Screen ───

function SubmittedScreen({ form }: { form: ReturnType<typeof useForm<DiagnosticoForm>> }) {
  const data = form.getValues();
  const scores = calculateScores(data);
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (scores.total / 100) * circumference;

  let badgeColor = "bg-red-500";
  let badgeBg = "bg-red-500/10 border-red-500/20";
  if (scores.total >= 70) {
    badgeColor = "bg-emerald-500";
    badgeBg = "bg-emerald-500/10 border-emerald-500/20";
  } else if (scores.total >= 40) {
    badgeColor = "bg-amber-500";
    badgeBg = "bg-amber-500/10 border-amber-500/20";
  }

  return (
    <div className="min-h-screen p-4 py-8 bg-[#0f1729]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto space-y-6"
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Diagnóstico completado
          </h2>
          <p className="text-slate-400 text-sm">
            Hemos recibido tus respuestas, {data.nombreCompleto.split(" ")[0] || ""}.
          </p>
        </div>

        {/* Score circle */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="#3b82f6" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-bold text-white">{scores.total}</span>
              <span className="text-slate-400 text-sm block">/100</span>
            </div>
          </div>
          <div className={`inline-block mt-3 px-5 py-2 rounded-full ${badgeColor}`}>
            <span className="text-sm font-bold text-white">{scores.clasificacion}</span>
          </div>
        </div>

        {/* Category bars */}
        <div className={`rounded-xl p-4 border ${badgeBg} space-y-3`}>
          {[
            { label: "🗣️ Idioma", score: scores.idioma },
            { label: "📄 Documentos", score: scores.documentos },
            { label: "📬 Homologación", score: scores.homologacion },
            { label: "💰 Finanzas", score: scores.finanzas },
            { label: "🏥 Estrategia", score: scores.estrategia },
          ].map(({ label, score }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{label}</span>
                <span className="text-white font-semibold">{score}/20</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    score >= 15 ? "bg-emerald-500" : score >= 8 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${(score / 20) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Next steps */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-blue-300 font-semibold text-sm mb-2">Siguientes pasos</h3>
          <ul className="text-slate-400 text-sm space-y-1.5">
            <li>1. Un asesor revisará tu diagnóstico</li>
            <li>2. Recibirás un plan personalizado</li>
            <li>3. Agenda tu asesoría para resolver dudas</li>
          </ul>
        </div>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/4915257607594"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Agenda tu asesoría por WhatsApp
        </a>

        <button
          className="w-full border border-white/20 text-slate-300 hover:bg-white/10 py-3 rounded-xl transition-colors"
          onClick={() => (window.location.href = "/")}
        >
          Volver al inicio
        </button>
      </motion.div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 text-right max-w-[60%]">{value}</span>
    </div>
  );
}

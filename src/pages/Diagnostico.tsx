import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Send, Stethoscope, Clock, Shield, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import anerfyLogo from "@/assets/anerfy-logo-dark.png";
import {
  diagnosticoSchema,
  DiagnosticoForm,
  STEP_TITLES,
  STEP_ICONS,
  STEP_FIELDS,
  DOCUMENT_NAMES,
  calculateScores,
} from "./diagnostico/schema";

import StepDatosPersonales from "./diagnostico/steps/StepDatosPersonales";
import StepFormacion from "./diagnostico/steps/StepFormacion";
import StepIdioma from "./diagnostico/steps/StepIdioma";
import StepDocumentos from "./diagnostico/steps/StepDocumentos";
import StepEstadoProceso from "./diagnostico/steps/StepEstadoProceso";
import StepVisa from "./diagnostico/steps/StepVisa";
import StepFinanzas from "./diagnostico/steps/StepFinanzas";
import StepEstrategia from "./diagnostico/steps/StepEstrategia";
import StepTiempo from "./diagnostico/steps/StepTiempo";
import StepMotivacion from "./diagnostico/steps/StepMotivacion";
import StepMigrationScore from "./diagnostico/steps/StepMigrationScore";

const TOTAL_STEPS = 11;

const defaultDocs: Record<string, "no_tengo"> = {};
DOCUMENT_NAMES.forEach((_, i) => {
  defaultDocs[`doc_${i}`] = "no_tengo";
});

export default function Diagnostico() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
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

  const validateCurrentStep = useCallback(async () => {
    const fields = STEP_FIELDS[step];
    if (!fields || fields.length === 0) return true;
    return form.trigger(fields);
  }, [step, form]);

  const goNext = useCallback(async () => {
    if (!(await validateCurrentStep())) return;
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, validateCurrentStep]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    const data = form.getValues();
    const scores = calculateScores(data);
    const submissionId = crypto.randomUUID();

    try {
      const { error } = await supabase.from("diagnostico_submissions").insert({
        submission_id: submissionId,
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

      setSubmitted(true);
      toast({
        title: "Diagnóstico enviado",
        description: "Tu asesor revisará tu caso pronto.",
      });
    } catch (err) {
      console.error("Error saving submission:", err);
      // Still show results even if save fails
      setSubmitted(true);
      toast({
        title: "Diagnóstico completado",
        description: "Hubo un problema al guardar, pero puedes ver tus resultados.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }, [form, toast]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const isLastStep = step === TOTAL_STEPS - 1;

  // ─── Welcome Screen ───
  if (!started) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(180deg, #0f1729 0%, #1a1040 100%)" }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md w-full"
        >
          <img src={anerfyLogo} alt="Anerfy" className="h-10 mx-auto mb-8 brightness-0 invert" />

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
              <p className="text-xs text-slate-400">11 secciones</p>
            </div>
          </div>

          <Button
            onClick={() => setStarted(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-base py-6 rounded-xl"
          >
            Comenzar diagnóstico
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── Submitted Screen with Score Summary ───
  if (submitted) {
    const data = form.getValues();
    const scores = calculateScores(data);

    let badgeColor = "from-red-500 to-orange-500";
    let badgeBg = "bg-red-500/10 border-red-500/20";
    if (scores.total >= 70) {
      badgeColor = "from-emerald-500 to-teal-500";
      badgeBg = "bg-emerald-500/10 border-emerald-500/20";
    } else if (scores.total >= 40) {
      badgeColor = "from-amber-500 to-yellow-500";
      badgeBg = "bg-amber-500/10 border-amber-500/20";
    }

    return (
      <div
        className="min-h-screen p-4 py-8"
        style={{ background: "linear-gradient(180deg, #0f1729 0%, #1a1040 100%)" }}
      >
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
                  stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(scores.total / 100) * 327} 327`}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-bold text-white">{scores.total}</span>
                <span className="text-slate-400 text-sm block">/100</span>
              </div>
            </div>
            <div className={`inline-block mt-3 px-5 py-2 rounded-full bg-gradient-to-r ${badgeColor}`}>
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

          <Button
            variant="outline"
            className="w-full border-white/20 text-slate-300 hover:bg-white/10"
            onClick={() => (window.location.href = "/")}
          >
            Volver al inicio
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── Form Steps ───
  return (
    <div
      className="min-h-screen pb-8"
      style={{ background: "linear-gradient(180deg, #0f1729 0%, #1a1040 100%)" }}
    >
      {/* Sticky header with logo + progress */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-[#0f1729]/80 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <img src={anerfyLogo} alt="Anerfy" className="h-7 brightness-0 invert" />
            <div className="h-4 w-px bg-white/20" />
            <span className="text-slate-400 text-sm">
              Diagnóstico migratorio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Progress
              value={progress}
              className="h-1.5 flex-1 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500"
            />
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {step + 1}/{TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Save progress indicator */}
        <div className="flex items-center gap-1.5 mb-4 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5" />
          <span>Tus respuestas se guardan automáticamente</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="mb-6">
                  <p className="text-xs text-blue-400 font-medium uppercase tracking-wide">
                    Paso {step + 1} de {TOTAL_STEPS}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
                    <span className="text-2xl">{STEP_ICONS[step]}</span>
                    {STEP_TITLES[step]}
                  </h2>
                </div>

                <div className="min-h-[200px]">
                  {step === 0 && <StepDatosPersonales form={form} />}
                  {step === 1 && <StepFormacion form={form} />}
                  {step === 2 && <StepIdioma form={form} />}
                  {step === 3 && <StepDocumentos form={form} />}
                  {step === 4 && <StepEstadoProceso form={form} />}
                  {step === 5 && <StepVisa form={form} />}
                  {step === 6 && <StepFinanzas form={form} />}
                  {step === 7 && <StepEstrategia form={form} />}
                  {step === 8 && <StepTiempo form={form} />}
                  {step === 9 && <StepMotivacion form={form} />}
                  {step === 10 && <StepMigrationScore form={form} />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 gap-3">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={step === 0}
            className="border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
          </Button>

          {isLastStep ? (
            <Button
              onClick={onSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white min-h-[44px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  Enviar diagnóstico <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white min-h-[44px]"
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Step indicator dots */}
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i < step) {
                  setDirection(-1);
                  setStep(i);
                }
              }}
              className={`h-2 rounded-full transition-all min-h-[8px] min-w-[8px] ${
                i === step
                  ? "w-6 bg-blue-500"
                  : i < step
                    ? "w-2 bg-blue-500/40 cursor-pointer hover:bg-blue-500/60"
                    : "w-2 bg-white/10"
              }`}
              aria-label={`Paso ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

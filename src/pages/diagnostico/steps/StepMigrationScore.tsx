import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { DiagnosticoForm, calculateScores } from "../schema";

interface Props {
  form: UseFormReturn<DiagnosticoForm>;
}

function AnimatedScore({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <>{count}</>;
}

function ScoreBar({ label, score, max, delay }: { label: string; score: number; max: number; delay: number }) {
  const pct = (score / max) * 100;
  let color = "bg-red-500";
  if (pct >= 70) color = "bg-emerald-500";
  else if (pct >= 40) color = "bg-amber-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-1"
    >
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-semibold">{score}/{max}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function StepMigrationScore({ form }: Props) {
  const data = form.getValues();
  const scores = calculateScores(data);

  const circumference = 2 * Math.PI * 52;
  const strokeDash = (scores.total / 100) * circumference;

  let badgeColor = "bg-red-500";
  if (scores.total >= 70) badgeColor = "bg-emerald-500";
  else if (scores.total >= 40) badgeColor = "bg-amber-500";

  const categories = [
    { label: "\u{1F5E3}\u{FE0F} Idioma alemán", score: scores.idioma },
    { label: "\u{1F4C4} Documentos", score: scores.documentos },
    { label: "\u{1F4EC} Homologación", score: scores.homologacion },
    { label: "\u{1F4B0} Finanzas", score: scores.finanzas },
    { label: "\u{1F3E5} Estrategia laboral", score: scores.estrategia },
  ];

  return (
    <div className="space-y-6">
      {/* Animated score circle */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-slate-400 text-sm mb-4">Tu puntuación estimada de migración</p>
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
            <span className="text-4xl font-bold text-white">
              <AnimatedScore target={scores.total} />
            </span>
            <span className="text-slate-400 text-sm block">/100</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className={`inline-block mt-4 px-5 py-2 rounded-full ${badgeColor}`}
        >
          <span className="text-sm font-bold text-white">{scores.clasificacion}</span>
        </motion.div>
      </motion.div>

      {/* Category bars */}
      <div className="space-y-3 bg-white/5 rounded-xl p-4 border border-white/10">
        {categories.map(({ label, score }, i) => (
          <ScoreBar key={label} label={label} score={score} max={20} delay={0.5 + i * 0.15} />
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3"
      >
        <h3 className="text-white font-semibold">Resumen de respuestas</h3>
        <SummaryRow label="Nombre" value={data.nombreCompleto} />
        <SummaryRow label="País" value={data.paisOrigen} />
        <SummaryRow label="Nivel alemán" value={data.nivelAleman} />
        <SummaryRow label="Especialidad" value={data.cualEspecialidad || data.especialidadInteres || "No indicada"} />
        <SummaryRow label="Experiencia" value={data.aniosExperiencia ? `${data.aniosExperiencia} años` : ""} />
        <SummaryRow label="Visa planeada" value={formatVisa(data.tipoVisa)} />
        <SummaryRow label="Viaja" value={data.cuandoViajar ? formatTiempo(data.cuandoViajar) : ""} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4"
      >
        <h3 className="text-blue-300 font-semibold text-sm">Nota del asesor</h3>
        <p className="text-slate-400 text-sm mt-1">
          Este espacio será completado por tu asesor durante la sesión de diagnóstico.
          La puntuación final puede ajustarse según la evaluación personalizada.
        </p>
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

function formatVisa(v: string) {
  const map: Record<string, string> = {
    trabajo: "Visa de trabajo",
    busqueda_empleo: "Búsqueda de empleo",
    estudio: "Visa de estudio",
    oportunidad: "Chancenkarte",
    no_se: "Por definir",
  };
  return map[v] || v;
}

function formatTiempo(v: string) {
  const map: Record<string, string> = {
    "3_meses": "Próximos 3 meses",
    "6_meses": "Próximos 6 meses",
    "1_anio": "Próximo año",
    "mas_1_anio": "Más de 1 año",
    no_se: "Por definir",
  };
  return map[v] || v;
}

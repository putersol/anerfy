import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, ShieldCheck, Clock, Wallet, MapPin, FileText,
  BarChart3, Stethoscope, PlayCircle, CalendarDays, Users, Video, ExternalLink,
  Loader2, Mail, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import FloatingShapes from "@/components/FloatingShapes";
import anerfyLogo from "@/assets/anerfy-logo-dark.png";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "./diagnostico/questions";
import { BUNDESLAENDER, GERMAN_LEVELS } from "./diagnostico/schema";

/* ─────────────────────────────────────────────────────────────
   PRECIO — fuente única de verdad. (Patrón: "precio tbd")
   Mientras esté en null, la página NO muestra ninguna cifra:
   los CTA y el FAQ dicen "Próximamente". Para fijar el precio
   más adelante, basta con poner: const PRECIO = "297€";
   ───────────────────────────────────────────────────────────── */
const PRECIO: string | null = null;
const PRECIO_LABEL = PRECIO ?? "Próximamente";
const CTA_TARGET = "/empezar"; // funnel existente (diagnóstico → roadmap → sesión)
const ANABIN_URL = "https://anabin.kmk.org/anabin.html";

/* Especialidades para el simulador (subset con demanda en Alemania) */
const ESPECIALIDADES_SIM = [
  "Medicina general (Allgemeinmedizin)",
  "Medicina interna (Innere Medizin)",
  "Anestesiología (Anästhesiologie)",
  "Cirugía (Chirurgie)",
  "Pediatría (Pädiatrie)",
  "Ginecología (Gynäkologie)",
  "Psiquiatría (Psychiatrie)",
  "Radiología (Radiologie)",
  "Medicina de emergencia (Notfallmedizin)",
  "Otra especialidad",
];

/* Estimación de salario BRUTO anual (€) por años de experiencia.
   Basado en rangos públicos del convenio TV-Ärzte (Assistenzarzt → Facharzt).
   Es orientativo — se comunica como estimación, nunca como cifra exacta. */
function brutoAnual(anios: number): number {
  if (anios <= 1) return 56000;   // Assistenzarzt 1er año
  if (anios <= 2) return 60000;
  if (anios <= 4) return 66000;
  if (anios <= 6) return 73000;   // ~ Facharzt
  if (anios <= 10) return 88000;  // Facharzt consolidado
  return 100000;                  // Oberarzt-Bereich
}

/* Carga aproximada de impuestos + seguros sociales (Steuerklasse I, soltero).
   Efectiva creciente con el ingreso. Orientativa. */
function cargaEfectiva(bruto: number): number {
  if (bruto < 60000) return 0.37;
  if (bruto < 80000) return 0.40;
  if (bruto < 95000) return 0.43;
  return 0.45;
}

/* Salario médico anual promedio aproximado en país de origen (€/año).
   Para la comparativa emocional. Orientativo. */
const SALARIO_ORIGEN: Record<string, number> = {
  "México": 22000, "Colombia": 18000, "Argentina": 14000, "Venezuela": 6000,
  "Ecuador": 16000, "Perú": 17000, "Chile": 28000, "Bolivia": 12000,
  "Paraguay": 13000, "Uruguay": 24000, "Costa Rica": 26000, "Panamá": 24000,
  "Guatemala": 14000, "Honduras": 11000, "El Salvador": 12000, "Nicaragua": 9000,
  "República Dominicana": 15000, "Cuba": 4000, "Puerto Rico": 40000,
  "España": 42000, "Brasil": 20000,
};

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Section({
  children, className = "", id,
}: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      className={`relative z-10 mx-auto w-full max-w-5xl px-5 py-16 md:py-24 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

function PrimaryCTA({ label = "QUIERO MI ROADMAP", className = "" }: { label?: string; className?: string }) {
  return (
    <Link to={CTA_TARGET} className={className}>
      <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/20">
        {label}
        {PRECIO ? <span className="ml-2 opacity-90">· {PRECIO}</span> : null}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Link>
  );
}

function GuaranteeLine() {
  return (
    <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <ShieldCheck className="h-4 w-4 text-success" />
      Garantía de satisfacción total. Si no es lo que esperabas, te devolvemos el 100%.
    </p>
  );
}

/* ── Lead magnet: mini-diagnóstico de 7 preguntas (gratuito) ────────── */
type LeadAnswers = {
  pais: string; especialidad: string; nivelAleman: string;
  presupuesto: string; etapa: string; familia: string; bundesland: string;
};
const EMPTY_LEAD: LeadAnswers = {
  pais: "", especialidad: "", nivelAleman: "", presupuesto: "",
  etapa: "", familia: "", bundesland: "",
};

const PRESUPUESTOS = ["Menos de €5.000", "€5.000 – €10.000", "€10.000 – €20.000", "Más de €20.000", "Aún no lo sé"];
const ETAPAS = [
  "Apenas estoy investigando",
  "Ya decidí, aún no empiezo trámites",
  "Estoy reuniendo documentos",
  "Ya envié documentos a un Bundesland",
  "Estoy estudiando alemán activamente",
];
const FAMILIA = ["Viajo solo/a", "Con pareja", "Con pareja e hijos"];

/* Mini Anerfy Score (orientativo) a partir de las 7 respuestas.
   Genera deseo mostrando valor, sin entregar el diagnóstico real. */
function computeScore(a: LeadAnswers) {
  const nivelMap: Record<string, number> = {
    Ninguno: 0, A1: 8, A2: 14, B1: 20, B2: 30, C1: 34, C2: 36,
  };
  const presMap: Record<string, number> = {
    "Menos de €5.000": 6, "€5.000 – €10.000": 14, "€10.000 – €20.000": 22,
    "Más de €20.000": 26, "Aún no lo sé": 8,
  };
  const etapaMap: Record<string, number> = {
    "Apenas estoy investigando": 6,
    "Ya decidí, aún no empiezo trámites": 12,
    "Estoy reuniendo documentos": 18,
    "Ya envié documentos a un Bundesland": 24,
    "Estoy estudiando alemán activamente": 22,
  };
  const aleman = nivelMap[a.nivelAleman] ?? 0;
  const score = Math.min(
    98,
    12 + aleman + (presMap[a.presupuesto] ?? 8) + (etapaMap[a.etapa] ?? 6),
  );
  const fortalezas: string[] = [];
  const atencion: string[] = [];
  (aleman >= 30 ? fortalezas : atencion).push(
    aleman >= 30 ? "Tu nivel de alemán ya juega a tu favor" : "El alemán es tu palanca crítica a trabajar",
  );
  ((presMap[a.presupuesto] ?? 0) >= 22 ? fortalezas : atencion).push(
    (presMap[a.presupuesto] ?? 0) >= 22 ? "Tienes margen financiero para el proceso" : "Conviene planificar el presupuesto por fases",
  );
  ((etapaMap[a.etapa] ?? 0) >= 18 ? fortalezas : atencion).push(
    (etapaMap[a.etapa] ?? 0) >= 18 ? "Ya tienes avance real en tus trámites" : "Aún no hay un orden claro de trámites",
  );
  return { score, fortalezas, atencion };
}

function LeadMagnet() {
  const [a, setA] = useState<LeadAnswers>(EMPTY_LEAD);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const set = (k: keyof LeadAnswers) => (v: string) => setA((p) => ({ ...p, [k]: v }));
  const completed = Object.values(a).every(Boolean);
  const result = useMemo(() => computeScore(a), [a]);

  // Paywall: intenta cobro Stripe. Si el price aún no está configurado (503),
  // continúa al diagnóstico actual sin mencionar precio ni "gratis".
  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("create-checkout-session", {
        body: { email: email.trim().toLowerCase(), nombre: nombre.trim(), answers: a },
      });
      if (!fnErr && data?.url) {
        window.location.href = data.url as string;
        return;
      }
    } catch {
      /* cae al fallback */
    }
    setCheckingOut(false);
    navigate("/empezar");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!completed) { setError("Responde las 7 preguntas para ver tu orientación."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nombre.trim() || !emailRegex.test(email.trim())) {
      setError("Introduce tu nombre y un email válido."); return;
    }
    setLoading(true);
    try {
      // Genera un token de orientación gratuita: guarda el lead en
      // `diagnostic_tokens` (created_by='lead_magnet_asesoria') y dispara el
      // trigger que envía el email con el enlace al diagnóstico + Anabin.
      const token = (crypto as any).randomUUID
        ? (crypto as any).randomUUID().replace(/-/g, "").slice(0, 16)
        : Math.random().toString(36).slice(2, 18);
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { error: insErr } = await supabase.from("diagnostic_tokens").insert({
        token,
        email: email.trim().toLowerCase(),
        nombre: nombre.trim(),
        expires_at: expires,
        created_by: "lead_magnet_asesoria",
        metadata: { answers: a, score: result.score, source: "asesoria_lead_magnet" } as any,
      } as any);
      if (insErr) {
        console.error("lead capture failed", insErr);
        setError("No pudimos enviarte el email. Revisa tu dirección e inténtalo de nuevo.");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      setError("No pudimos enviarte el email. Inténtalo de nuevo en unos segundos.");
      setLoading(false);
      return;
    }
    setLoading(false);
    setDone(true);
  }

  const fields: { k: keyof LeadAnswers; label: string; options: readonly string[] }[] = [
    { k: "pais", label: "1. ¿De qué país eres?", options: COUNTRIES.map((c: { name: string }) => c.name) },
    { k: "especialidad", label: "2. ¿Cuál es tu especialidad o área de interés?", options: ESPECIALIDADES_SIM },
    { k: "nivelAleman", label: "3. ¿Cuál es tu nivel actual de alemán?", options: GERMAN_LEVELS },
    { k: "presupuesto", label: "4. ¿Cuánto tienes ahorrado para el proceso?", options: PRESUPUESTOS },
    { k: "etapa", label: "5. ¿En qué etapa del proceso estás?", options: ETAPAS },
    { k: "familia", label: "6. ¿Viajas solo o con familia?", options: FAMILIA },
    { k: "bundesland", label: "7. ¿En qué Bundesland te gustaría ejercer?", options: BUNDESLAENDER },
  ];

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Tu Anerfy Score preliminar</p>
          <div className="relative mt-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/30">
            <span className="font-display text-4xl font-bold text-primary">{result.score}</span>
            <span className="absolute bottom-6 text-xs text-muted-foreground">/ 100</span>
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold">
            Buen primer paso, {nombre.split(" ")[0] || "doctor/a"}.
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Esto es solo una lectura preliminar con 7 variables. Tu diagnóstico completo cruza más de 50
            sobre tu caso real y construye tu roadmap paso a paso.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" /> A tu favor
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {result.fortalezas.map((f) => <li key={f} className="flex gap-2"><span className="text-success">›</span>{f}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-warning">
              <Sparkles className="h-4 w-4" /> A trabajar
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {result.atencion.map((f) => <li key={f} className="flex gap-2"><span className="text-warning">›</span>{f}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> Mientras tanto: verifica tu título en anabin
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>anabin</strong> es la base de datos oficial de la conferencia de ministros de
            educación alemanes (KMK). Ahí compruebas cómo está clasificada tu universidad y tu título
            médico en Alemania — el punto de partida de toda homologación. Búscate por país e institución;
            tu consultor lo revisará contigo.
          </p>
          <a href={ANABIN_URL} target="_blank" rel="noopener noreferrer"
             className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Abrir anabin (base de datos oficial KMK) <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Paywall → diagnóstico completo */}
        <div className="mt-7 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
          <div className="text-center">
            <h4 className="font-display text-2xl font-semibold">Tienes la foto. Te falta el mapa.</h4>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Lo que acabas de ver es <strong className="text-foreground">dónde estás hoy</strong>. Lo que
              todavía no puedes ver es el camino: en qué orden mover cada pieza, cuánto cuesta realmente
              <em> tu</em> caso, qué Bundesland te conviene, qué visa aplica y qué documento tramitar
              primero para no perder meses. Esa ruta no es genérica —{" "}
              <strong className="text-foreground">se construye sobre tus respuestas reales</strong>, y sin
              ella seguirás decidiendo a ciegas. Complétala ahora y deja de avanzar a tientas.
            </p>
          </div>

          <ul className="mx-auto mt-6 grid max-w-xl gap-3 text-sm">
            {[
              ["Tu Roadmap personalizado completo", "fases, tiempos, presupuesto y documentos ordenados según tu caso"],
              ["Tu Anerfy Score real", "cruzando más de 50 variables sobre tu situación, no solo 7"],
              ["Acceso permanente en la plataforma", "seguimiento continuo de tu avance, disponible siempre que lo necesites"],
              ["Sesión privada 1:1 de 90 minutos", "con un consultor experto para resolver cada duda de tu homologación"],
              ["Acceso exclusivo a la bolsa de trabajo Anerfy", "vacantes reales en Alemania, solo para clientes"],
            ].map(([t, d]) => (
              <li key={t} className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <span><strong className="text-foreground">{t}</strong> — <span className="text-muted-foreground">{d}</span></span>
              </li>
            ))}
          </ul>

          <div className="mt-7 text-center">
            {PRECIO ? <p className="mb-3 text-sm text-muted-foreground"><strong className="text-foreground">{PRECIO}, pago único.</strong> Acceso permanente.</p> : null}
            <Button size="lg" onClick={handleCheckout} disabled={checkingOut}
                    className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/20">
              {checkingOut
                ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redirigiendo…</>
                : <>Completar mi hoja de ruta {PRECIO ? `· ${PRECIO}` : ""}<ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>
            <GuaranteeLine />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card/70 p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.k}>
            <label className="mb-2 block text-sm font-medium text-foreground/90">{f.label}</label>
            <Select value={a[f.k]} onValueChange={set(f.k)}>
              <SelectTrigger className="min-h-[48px] border-border bg-secondary/80 text-base">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
               className="min-h-[48px] bg-secondary/80 text-base" />
        <Input placeholder="tu@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
               className="min-h-[48px] bg-secondary/80 text-base" />
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={loading}
              className="mt-6 h-13 w-full py-6 text-base font-semibold">
        {loading
          ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando…</>
          : <><Mail className="mr-2 h-5 w-5" /> Ver mi orientación + acceso a anabin</>}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Gratis y sin compromiso. Te enviamos tu orientación inicial al correo.
      </p>
    </form>
  );
}

/* ── Simulador de salario neto en Alemania ─────────────────────────── */
function SalarySimulator() {
  const [esp, setEsp] = useState(ESPECIALIDADES_SIM[0]);
  const [bundesland, setBundesland] = useState<string>(BUNDESLAENDER[0]);
  const [anios, setAnios] = useState<string>("3");
  const [calc, setCalc] = useState(false);
  const [pais, setPais] = useState<string>("");

  const result = useMemo(() => {
    const yrs = Math.max(0, Math.min(40, Number(anios) || 0));
    const bruto = brutoAnual(yrs);
    const carga = cargaEfectiva(bruto);
    const impuestos = Math.round(bruto * carga);
    const neto = bruto - impuestos;
    const origen = pais ? SALARIO_ORIGEN[pais] : undefined;
    const factor = origen ? Math.round((neto / origen) * 10) / 10 : undefined;
    return { bruto, impuestos, neto, netoMes: Math.round(neto / 12), origen, factor };
  }, [anios, pais]);

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">Especialidad</label>
          <Select value={esp} onValueChange={setEsp}>
            <SelectTrigger className="min-h-[48px] bg-secondary/80"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ESPECIALIDADES_SIM.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Estado federado (Bundesland)</label>
          <Select value={bundesland} onValueChange={setBundesland}>
            <SelectTrigger className="min-h-[48px] bg-secondary/80"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BUNDESLAENDER.filter((b) => b !== "No sé aún").map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Años de experiencia</label>
          <Input type="number" min={0} max={40} value={anios}
                 onChange={(e) => setAnios(e.target.value)} className="min-h-[48px] bg-secondary/80" />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium">Tu país de origen (para comparar)</label>
        <Select value={pais} onValueChange={setPais}>
          <SelectTrigger className="min-h-[48px] bg-secondary/80">
            <SelectValue placeholder="Selecciona tu país" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c: { name: string }) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={() => setCalc(true)} size="lg" className="mt-6 w-full py-6 text-base font-semibold">
        <BarChart3 className="mr-2 h-5 w-5" /> Calcular mi salario neto estimado
      </Button>

      {calc && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-7">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-secondary/40 p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Bruto anual estimado</p>
              <p className="mt-1 font-display text-2xl font-semibold">{fmtEUR(result.bruto)}</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Impuestos + seguros</p>
              <p className="mt-1 font-display text-2xl font-semibold text-warning">−{fmtEUR(result.impuestos)}</p>
            </div>
            <div className="rounded-xl border border-success/40 bg-success/5 p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Neto anual estimado</p>
              <p className="mt-1 font-display text-2xl font-semibold text-success">{fmtEUR(result.neto)}</p>
              <p className="text-xs text-muted-foreground">≈ {fmtEUR(result.netoMes)} / mes</p>
            </div>
          </div>

          {result.origen && result.factor && (
            <p className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center text-sm">
              Tu salario neto estimado en Alemania sería aproximadamente{" "}
              <strong className="text-primary">{result.factor}× </strong>
              el salario médico promedio en {pais}.
            </p>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Cifras orientativas basadas en el convenio TV-Ärzte y carga fiscal promedio (clase I).
            Tu situación real depende de Steuerklasse, hospital y Bundesland — tu consultor la calcula contigo.
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ── Datos de secciones ─────────────────────────────────────────────── */
const PREGUNTAS_DOLOR = [
  "¿Necesito la FSP, la Kenntnisprüfung o un Gutachten?",
  "¿Qué documentos traduzco ahora y cuáles puedo esperar?",
  "¿En qué estado alemán tengo más posibilidades con mi especialidad?",
  "¿Cuánto dinero necesito realmente tener ahorrado antes de irme?",
  "¿Cuánto tiempo tarda mi proceso — el mío, no el de otro médico de otro país?",
];

const SCORE_BULLETS = [
  { icon: BarChart3, text: "Gráficas de fortalezas y áreas de atención — dónde estás bien posicionado y qué preparar." },
  { icon: Clock, text: "Estimaciones reales de tiempo por cada fase del proceso." },
  { icon: Wallet, text: "Presupuesto estimado con los costos reales de cada etapa, para planificar sin sorpresas." },
  { icon: MapPin, text: "Recomendación de Bundesland — el estado alemán más conveniente para tu caso." },
  { icon: ShieldCheck, text: "Ruta de visa personalizada según los requisitos actuales del consulado de tu país." },
  { icon: FileText, text: "Lista de documentos personalizada: qué tramitar, traducir y apostillar, en qué orden." },
];

const TESTIMONIOS = [
  { q: "Pensé que sabía por dónde empezar hasta que vi mi análisis. Tenía cosas que consideraba fortalezas que en realidad no lo eran para el estado que quería. El roadmap me hizo replantear todo desde una base real.", a: "Dra. Masiel — Médica chilena, cliente Anerfy" },
  { q: "Lo que más valoré fue la honestidad. No me dijeron que era fácil. Me dijeron exactamente qué me esperaba y eso me permitió prepararme de verdad.", a: "Dra. María Rodríguez — Médica venezolana, cliente Anerfy" },
  { q: "Después de la sesión pedí información sobre el seguimiento. No quiero perder ese acompañamiento ahora que sé que el plan que tengo es el correcto.", a: "Dra. Gloribel Bolívar — Médica venezolana, cliente Anerfy" },
];

const FAQ = [
  { q: "¿Qué recibo exactamente cuando compro la asesoría Anerfy?", a: "Tres cosas: (1) tu Anerfy Score — un análisis visual interactivo de tu situación migratoria actual, con gráficas de fortalezas y áreas de atención; (2) tu Roadmap personalizado — un dashboard interactivo con tu plan completo: fases, documentos, presupuesto estimado, recomendación de Bundesland, ruta de visa y pasos ordenados según tu caso; y (3) una sesión privada de 90 minutos con un consultor experto. Todo queda disponible en tu perfil Anerfy de forma permanente." },
  { q: "¿La sesión ocurre antes o después de recibir mi roadmap?", a: "Después. Pagas → recibes el formulario de diagnóstico → la IA genera tu roadmap y te lo envía → agendas tu sesión, donde el consultor te lo presenta y aclara todas tus dudas. Es decir: tu roadmap está construido antes de la sesión. La sesión existe para presentarte los resultados, validar que todo corresponde a tu caso y resolver cada pregunta." },
  { q: "¿El roadmap es un PDF descargable o un documento en línea?", a: "Es un dashboard interactivo dentro de tu perfil en la plataforma Anerfy, no un PDF estático. Accedes desde cualquier dispositivo, en cualquier momento, tantas veces como lo necesites durante tu proceso." },
  { q: "¿Qué es el Anerfy Score?", a: "El análisis visual de tu situación migratoria actual. Muestra las fortalezas de tu perfil (edad, años de experiencia, especialidad con demanda en Alemania, capital disponible) y los aspectos que requieren atención (nivel de alemán, documentación pendiente, situación financiera). Es el punto de partida desde el que se construye todo tu roadmap." },
  { q: "¿Con quién es la sesión 1:1?", a: "Con uno de nuestros consultores expertos especializados en migración médica a Alemania. En todos los casos la sesión sigue la misma metodología y los mismos estándares de calidad." },
  { q: "¿La sesión es por videollamada o presencial?", a: "Por videollamada privada. Puedes realizarla desde cualquier país de Latinoamérica, sin importar tu zona horaria. El horario se coordina por correo al momento de agendar." },
  { q: "¿En qué idioma se realiza la asesoría?", a: "Toda la asesoría — el formulario, el dashboard, la sesión y el roadmap — es en español." },
  { q: "¿Qué pasa si no sé responder alguna pregunta del formulario?", a: "El formulario está diseñado para completarse incluso si no tienes claridad sobre algunos aspectos. Precisamente eso es lo que la asesoría resuelve. Responde con la mayor honestidad posible; el consultor revisará contigo cualquier punto que requiera más análisis." },
  { q: "¿Por cuánto tiempo tengo acceso a mi roadmap?", a: "Permanente. No tiene fecha de vencimiento. Puedes consultarlo antes de tramitar un documento, antes de pedir cita en el consulado o en cualquier momento de tu proceso." },
  { q: "¿Qué pasa si después de la sesión necesito más ayuda?", a: "Anerfy cuenta con un servicio de asesoría de seguimiento como producto adicional. Si surgen nuevas preguntas, cambios en tu situación o necesitas actualizar tu plan, puedes contratar una sesión de seguimiento con tu consultor. Verás las opciones en tu perfil tras tu primera sesión." },
  { q: "¿Cuánto cuesta la asesoría Anerfy 1:1?", a: PRECIO ? `La asesoría 1:1 + tu roadmap personalizado tienen un costo de ${PRECIO}, pago único. Incluye el formulario de diagnóstico, la generación de tu Anerfy Score y roadmap, la sesión privada de 90 minutos y el acceso permanente a tu dashboard.` : "Estamos finalizando los detalles del precio. Déjanos tus datos en el diagnóstico gratuito y serás de los primeros en conocerlo, junto con cualquier condición de lanzamiento." },
  { q: "¿Hay garantía de satisfacción?", a: "Sí. Si después de tu sesión sientes que el roadmap no correspondió a lo que necesitabas o que la asesoría no cumplió tus expectativas, te devolvemos el 100% de tu inversión. Sin condiciones complicadas." },
  { q: "¿En qué se diferencia Anerfy de otras consultorías o agencias?", a: "La mayoría ofrecen procesos genéricos diseñados para llevar médicos a Alemania en grandes volúmenes. Anerfy hace lo opuesto: cada análisis es individual, construido sobre las variables específicas de tu caso. Y somos honestos sobre los tiempos reales, los recursos necesarios y la importancia crítica del idioma. No vendemos optimismo — vendemos claridad." },
];

const PASOS = [
  { n: "01", t: "Reserva tu asesoría", d: "Completa el pago seguro y recibes de inmediato el acceso al siguiente paso." },
  { n: "02", t: "Completa el Formulario de Diagnóstico", d: "8 a 10 minutos. Nuestro sistema analiza tu perfil y genera tu Anerfy Score y tu roadmap personalizado." },
  { n: "03", t: "Agenda y realiza tu sesión 1:1", d: "Al recibir tu roadmap, agendas tu sesión privada de 90 minutos con tu consultor para revisarlo y resolver cada duda." },
];

const WEBINARS = [
  { fecha: "Próximamente", titulo: "FSP vs. Kenntnisprüfung: cómo elegir tu ruta", tipo: "Webinar en vivo" },
  { fecha: "Próximamente", titulo: "Documentos y apostillas: el orden correcto", tipo: "Webinar en vivo" },
  { fecha: "Próximamente", titulo: "Networking con reclutadores alemanes", tipo: "Evento de comunidad" },
];

/* ── Página ─────────────────────────────────────────────────────────── */
export default function Asesoria() {
  const [params] = useSearchParams();
  const pago = params.get("pago");
  useEffect(() => {
    if (pago === "ok") window.scrollTo({ top: 0 });
  }, [pago]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <FloatingShapes />

      {pago === "ok" && (
        <div className="relative z-20 bg-success px-4 py-3 text-center text-sm font-medium text-success-foreground">
          ¡Pago recibido! Revisa tu correo — te enviamos el enlace a tu diagnóstico completo.
        </div>
      )}
      {pago === "cancelado" && (
        <div className="relative z-20 bg-warning px-4 py-3 text-center text-sm font-medium text-warning-foreground">
          Tu pago no se completó. Cuando quieras, retoma desde donde lo dejaste.
        </div>
      )}

      {/* HERO */}
      <header className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-12 text-center">
        <img src={anerfyLogo} alt="Anerfy" className="mx-auto h-10 sm:h-12 brightness-0 invert object-contain scale-[1.4]" />
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Stethoscope className="h-3.5 w-3.5 text-primary" />
            Para médicos latinoamericanos que quieren ejercer en Alemania
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
            Tu hoja de ruta para ejercer medicina en Alemania.{" "}
            <span className="text-primary">Construida sobre tu caso.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            La única asesoría que combina análisis por inteligencia artificial con la experiencia de
            consultores que ya han acompañado a médicos en el proceso. Para darte un plan real, honesto
            y ejecutable desde el primer día.
          </p>
          <div className="mt-9 flex flex-col items-center">
            <PrimaryCTA />
            <GuaranteeLine />
          </div>

          {/* VSL placeholder */}
          <div className="mx-auto mt-12 flex aspect-video w-full max-w-3xl items-center justify-center rounded-2xl border border-border bg-card/60">
            <div className="text-center text-muted-foreground">
              <PlayCircle className="mx-auto h-14 w-14 text-primary/80" />
              <p className="mt-3 text-sm">Video de presentación (próximamente)</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* PROBLEMA */}
      <Section>
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          La información gratuita no es el problema. El problema es que ninguna es <span className="text-primary">tuya</span>.
        </h2>
        <p className="mt-5 max-w-3xl text-muted-foreground">
          Probablemente ya pasaste horas buscando. Videos de YouTube, grupos de Facebook, páginas de
          consulados, quizás alguna agencia. Y después de todo eso, sigues sin poder responder estas
          preguntas con certeza:
        </p>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {PREGUNTAS_DOLOR.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4">
              <span className="mt-0.5 text-primary">›</span><span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-muted-foreground">
          Cuando tomas decisiones con información genérica, el costo no es solo frustración. Es tiempo
          perdido, documentos mal tramitados, meses de retraso por un error evitable y miles de euros
          gastados en pasos que no correspondían a tu caso. No es un problema de esfuerzo:{" "}
          <strong className="text-foreground">es no tener el mapa correcto.</strong>
        </p>
      </Section>

      {/* LEAD MAGNET */}
      <Section id="diagnostico-gratis">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Empieza con un diagnóstico gratuito</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Responde 7 preguntas clave y recibe tu orientación inicial — más acceso directo a{" "}
            <strong className="text-foreground">anabin</strong>, la base de datos oficial alemana para
            verificar tu título. Sin costo.
          </p>
        </div>
        <div className="mt-8"><LeadMagnet /></div>
      </Section>

      {/* PRODUCTO */}
      <Section>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center md:p-10">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">El producto</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Asesoría Anerfy 1:1 + Tu Roadmap Personalizado
          </h2>
          <p className="mt-3 text-muted-foreground">
            {PRECIO ? <><strong className="text-foreground">{PRECIO}</strong> · Pago único. </> : null}
            Acceso permanente a tu roadmap.
          </p>
        </div>

        <h3 className="mt-12 font-display text-2xl font-semibold">¿Cómo funciona exactamente?</h3>
        <div className="mt-6 space-y-5">
          <StepCard n="Paso 1" t="Pagas y recibes el formulario de diagnóstico"
            d="Inmediatamente después de tu pago recibes el enlace a nuestro Formulario de Diagnóstico Anerfy — un cuestionario interactivo de 8 a 10 minutos. No es genérico: es el insumo que usan nuestra IA y nuestros consultores para construir tu roadmap antes de reunirnos." />
          <div className="rounded-xl border border-border bg-card/60 p-6">
            <p className="font-semibold">Paso 2 — Nuestra IA genera tu Anerfy Score y tu Roadmap</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {SCORE_BULLETS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Tu roadmap queda disponible en tu perfil Anerfy de forma permanente, para consultarlo
              cada vez que lo necesites durante tu proceso.
            </p>
          </div>
          <StepCard n="Paso 3" t="Sesión 1:1 de 90 minutos con tu consultor"
            d="Entre 24 y 48 horas después de completar el formulario recibes el correo para agendar tu videollamada privada. Tu consultor te presenta tu Score y tu roadmap sección por sección, valida que cada recomendación corresponde a tu caso, aclara si requieres FSP, Kenntnisprüfung o Gutachten con datos concretos, y resuelve cada duda. Sales sabiendo exactamente cuál es tu siguiente paso." />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Nota importante:</strong> tu análisis y roadmap se generan
          con base en la normativa migratoria alemana y los requisitos consulares vigentes al momento de
          tu sesión. Si pasa un período prolongado antes de ejecutar alguna fase, verifica actualizaciones;
          tu consultor puede orientarte sobre las fuentes oficiales.
        </div>
      </Section>

      {/* SIMULADOR */}
      <Section id="simulador">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Simulador de salario neto en Alemania</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Una decisión informada empieza por entender los números reales. Estima tu salario neto como
            médico en Alemania y compáralo con tu país de origen.
          </p>
        </div>
        <div className="mt-8"><SalarySimulator /></div>
      </Section>

      {/* WEBINARS */}
      <Section id="webinars">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Webinars y eventos en vivo</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Aprende del proceso, accede a grabaciones de sesiones pasadas y conecta con reclutadores
            alemanes en nuestros eventos de comunidad.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {WEBINARS.map((w) => (
            <div key={w.titulo} className="flex flex-col rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                {w.tipo.includes("Networking") ? <Users className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                {w.tipo}
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> {w.fecha}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold">{w.titulo}</h3>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          El calendario de próximos eventos y las grabaciones estarán disponibles en tu perfil Anerfy.
        </p>
      </Section>

      {/* GARANTÍA */}
      <Section>
        <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center md:p-12">
          <ShieldCheck className="mx-auto h-12 w-12 text-success" />
          <h2 className="mt-4 font-display text-3xl font-bold">Tu inversión no tiene riesgo</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Si después de tu sesión sientes que el roadmap no corresponde a lo que necesitabas o que la
            asesoría no fue lo que esperabas, te devolvemos el 100% de tu inversión. Sin condiciones
            complicadas, sin formularios interminables. Creemos en lo que construimos.
          </p>
        </div>
      </Section>

      {/* TESTIMONIOS */}
      <Section>
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
          Lo que dicen médicos que ya tienen su roadmap
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {TESTIMONIOS.map((t) => (
            <figure key={t.a} className="flex flex-col rounded-2xl border border-border bg-card/60 p-6">
              <blockquote className="text-sm leading-relaxed text-foreground/90">“{t.q}”</blockquote>
              <figcaption className="mt-4 text-xs font-medium text-muted-foreground">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* PASOS */}
      <Section>
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Tu roadmap en minutos</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PASOS.map((p) => (
            <div key={p.n} className="rounded-2xl border border-border bg-card/60 p-6">
              <span className="font-display text-3xl font-bold text-primary/40">{p.n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-muted-foreground">
          <strong className="text-foreground">Resultado:</strong> tu roadmap activo en tu perfil de forma
          permanente. Tu proceso claro desde el día uno.
        </p>
      </Section>

      {/* FAQ */}
      <Section>
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="mx-auto mt-8 max-w-3xl">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* CTA FINAL */}
      <Section className="text-center">
        <h2 className="mx-auto max-w-3xl font-display text-3xl font-bold md:text-5xl">
          El costo de seguir sin el mapa correcto sí es real.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Haz clic, completa tu diagnóstico y ten tu roadmap en manos con tu sesión agendada.
          Tu inversión no tiene riesgo.
        </p>
        <div className="mt-9 flex flex-col items-center">
          <PrimaryCTA />
          <GuaranteeLine />
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          ¿Tienes una pregunta que no está aquí? Escríbenos a{" "}
          <a href="mailto:info@anerfy.com" className="text-primary hover:underline">info@anerfy.com</a> —
          respondemos antes de que tomes tu decisión.
        </p>
      </Section>
    </div>
  );
}

function StepCard({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{n}</p>
      <h4 className="mt-1 font-display text-lg font-semibold">{t}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{d}</p>
    </div>
  );
}

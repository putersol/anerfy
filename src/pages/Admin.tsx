import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, LogOut, Download, Link2, ChevronDown, ChevronUp,
  BarChart3, Users, Globe, TrendingUp, Search, X,
  Plus, Copy, Check, Ticket, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import anerfyLogo from "@/assets/anerfy-logo-dark.png";

const ADMIN_PASSWORD = "anerfy2026";

interface Submission {
  id: number;
  submission_id: string;
  email: string | null;
  token_id: string | null;
  nombre_completo: string;
  pais_origen: string;
  nacionalidad: string;
  edad: string;
  estado_civil: string;
  viaja_solo: string;
  tiene_hijos: string;
  viaja_mascota: string;
  ciudad_preferida: string | null;
  bundesland_preferido: string | null;
  tiene_contactos_alemania: string;
  donde_contactos: string | null;
  universidad: string;
  anio_graduacion: string;
  realizo_internado: string;
  tiene_especialidad: string;
  cual_especialidad: string | null;
  anios_experiencia: string;
  areas_trabajo: string;
  nivel_aleman: string;
  tiene_certificado: string;
  cual_certificado: string | null;
  estudia_actualmente: string;
  horas_por_semana: string | null;
  estudio_aleman_medico: string;
  presento_fsp: string;
  presento_kenntnis: string;
  documentos: Record<string, string>;
  envio_documentos: string;
  bundesland_envio: string | null;
  recibio_respuesta: string | null;
  solicitaron_examen: string | null;
  tiene_berufserlaubnis: string;
  tiene_approbation: string;
  tipo_visa: string;
  viaja_con_pareja: string;
  pareja_habla_aleman: string | null;
  nivel_aleman_pareja: string | null;
  pareja_profesion: string | null;
  dinero_ahorrado: string;
  puede_abrir_sperrkonto: string;
  apoyo_familiar: string;
  dispuesto_ciudades_pequenas: string;
  especialidad_interes: string | null;
  dispuesto_especialidades: string[];
  ha_aplicado_hospitales: string;
  ha_tenido_entrevistas: string;
  cuando_viajar: string;
  puede_estudiar_intensivo: string;
  puede_dedicar_1a2_horas: string;
  motivacion: string;
  score_idioma: number;
  score_documentos: number;
  score_homologacion: number;
  score_finanzas: number;
  score_estrategia: number;
  score_total: number;
  clasificacion: string;
  status: string;
  created_at: string;
}

function classColor(c: string) {
  if (c === "Ruta rápida") return "text-emerald-400";
  if (c === "Ruta estándar") return "text-amber-400";
  return "text-red-400";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [tokenEmail, setTokenEmail] = useState("");
  const [tokenNombre, setTokenNombre] = useState("");
  const [generatingToken, setGeneratingToken] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (authed) {
      fetchSubmissions();
      fetchTokens();
    }
  }, [authed]);

  async function fetchSubmissions() {
    setLoading(true);
    const { data, error } = await supabase
      .from("diagnostico_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSubmissions((data as Submission[]) || []);
    }
    setLoading(false);
  }

  async function fetchTokens() {
    const { data, error } = await (supabase as any)
      .from("diagnostic_tokens")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setTokens(data);
  }

  function generateShortToken() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async function handleGenerateToken(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenEmail.trim()) {
      toast({ title: "Email requerido", variant: "destructive" });
      return;
    }
    setGeneratingToken(true);
    const token = generateShortToken();
    const { error } = await (supabase as any).from("diagnostic_tokens").insert({
      token,
      email: tokenEmail.trim(),
      nombre: tokenNombre.trim() || null,
      created_by: "admin",
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Token generado", description: `Link listo para ${tokenEmail}` });
      setTokenEmail("");
      setTokenNombre("");
      fetchTokens();
    }
    setGeneratingToken(false);
  }

  function copyTokenLink(token: string) {
    const url = `${window.location.origin}/diagnostico/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    toast({ title: "Link copiado", description: url });
  }

  async function deleteToken(token: string) {
    const { error } = await (supabase as any)
      .from("diagnostic_tokens")
      .delete()
      .eq("token", token);
    if (!error) {
      setTokens((prev) => prev.filter((t) => t.token !== token));
      toast({ title: "Token eliminado" });
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      toast({ title: "Contraseña incorrecta", variant: "destructive" });
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return submissions;
    const q = search.toLowerCase();
    return submissions.filter(
      (s) =>
        (s.nombre_completo && s.nombre_completo.toLowerCase().includes(q)) ||
        (s.pais_origen && s.pais_origen.toLowerCase().includes(q)) ||
        (s.clasificacion && s.clasificacion.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.status && s.status.toLowerCase().includes(q))
    );
  }, [submissions, search]);

  const stats = useMemo(() => {
    if (submissions.length === 0) return { total: 0, avgScore: 0, byCountry: {} as Record<string, number> };
    const avgScore = Math.round(submissions.reduce((a, s) => a + s.score_total, 0) / submissions.length);
    const byCountry: Record<string, number> = {};
    submissions.forEach((s) => {
      const c = s.pais_origen || "Desconocido";
      byCountry[c] = (byCountry[c] || 0) + 1;
    });
    return { total: submissions.length, avgScore, byCountry };
  }, [submissions]);

  function exportCSV() {
    if (submissions.length === 0) return;
    const headers = [
      "Nombre", "País", "Nacionalidad", "Edad", "Universidad", "Nivel Alemán",
      "Score Total", "Clasificación", "Idioma", "Documentos", "Homologación",
      "Finanzas", "Estrategia", "Fecha",
    ];
    const rows = submissions.map((s) => [
      s.nombre_completo, s.pais_origen, s.nacionalidad, s.edad, s.universidad,
      s.nivel_aleman, s.score_total, s.clasificacion, s.score_idioma,
      s.score_documentos, s.score_homologacion, s.score_finanzas,
      s.score_estrategia, s.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anerfy-diagnosticos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyFormLink() {
    const url = `${window.location.origin}/diagnostico`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado", description: url });
  }

  // --- Login Screen ---
  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-sm w-full"
        >
          <img src={anerfyLogo} alt="Anerfy" className="h-8 mx-auto mb-8 brightness-0 invert" />
          <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-blue-400" />
              </div>
              <h1 className="text-xl font-bold text-white text-center mb-1">Panel de administración</h1>
              <p className="text-slate-400 text-sm text-center mb-6">Ingresa la contraseña para continuar</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  autoFocus
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // --- Dashboard ---
  return (
    <div
      className="min-h-screen pb-8 bg-[#0f1729]"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-[#0f1729]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={anerfyLogo} alt="Anerfy" className="h-7 brightness-0 invert" />
            <div className="h-4 w-px bg-white/20" />
            <span className="text-slate-400 text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyFormLink} className="border-white/10 text-slate-300 hover:bg-white/5 text-xs">
              <Link2 className="w-3.5 h-3.5 mr-1" /> Copiar link
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV} className="border-white/10 text-slate-300 hover:bg-white/5 text-xs">
              <Download className="w-3.5 h-3.5 mr-1" /> CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAuthed(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<Users className="w-5 h-5 text-blue-400" />} label="Total" value={stats.total} />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} label="Score promedio" value={stats.avgScore} suffix="/100" />
          <StatCard icon={<Globe className="w-5 h-5 text-purple-400" />} label="Países" value={Object.keys(stats.byCountry).length} />
          <StatCard icon={<BarChart3 className="w-5 h-5 text-amber-400" />} label="Esta semana" value={submissions.filter((s) => {
            const d = new Date(s.created_at);
            const now = new Date();
            return now.getTime() - d.getTime() < 7 * 86400000;
          }).length} />
        </div>

        {/* Country breakdown */}
        {Object.keys(stats.byCountry).length > 0 && (
          <Card className="bg-white/[0.03] border-white/10">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Submissions por país</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byCountry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([country, count]) => (
                    <span key={country} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                      {country} <span className="text-blue-400 font-semibold ml-1">{count}</span>
                    </span>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Token Generation Panel */}
        <Card className="bg-white/[0.03] border-white/10">
          <CardContent className="p-4">
            <button
              onClick={() => setShowTokenPanel(!showTokenPanel)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-medium text-slate-300">Links de diagnóstico</h3>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                  {tokens.filter((t) => !t.used).length} activos
                </span>
              </div>
              {showTokenPanel ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <AnimatePresence>
              {showTokenPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    {/* Generate new token */}
                    <form onSubmit={handleGenerateToken} className="flex flex-col sm:flex-row gap-2">
                      <Input
                        type="email"
                        value={tokenEmail}
                        onChange={(e) => setTokenEmail(e.target.value)}
                        placeholder="Email del cliente *"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 flex-1"
                        required
                      />
                      <Input
                        value={tokenNombre}
                        onChange={(e) => setTokenNombre(e.target.value)}
                        placeholder="Nombre (opcional)"
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 sm:w-48"
                      />
                      <Button
                        type="submit"
                        disabled={generatingToken}
                        className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Generar link
                      </Button>
                    </form>

                    {/* Tokens list */}
                    {tokens.length > 0 && (
                      <div className="space-y-1.5 max-h-60 overflow-y-auto">
                        {tokens.map((t) => (
                          <div
                            key={t.token}
                            className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${
                              t.used ? "bg-white/[0.02] opacity-50" : "bg-white/5"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-200 truncate">
                                  {t.nombre || t.email}
                                </span>
                                {t.used ? (
                                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                    Usado
                                  </span>
                                ) : (
                                  <span className="text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                    Activo
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500">
                                {t.email} · {new Date(t.created_at).toLocaleDateString("es-ES")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyTokenLink(t.token)}
                                className="text-slate-400 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                              >
                                {copiedToken === t.token ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </Button>
                              {!t.used && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteToken(t.token)}
                                  className="text-slate-400 hover:text-red-400 hover:bg-white/5 h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, país o clasificación..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-500 hover:text-white" />
            </button>
          )}
        </div>

        {/* Submissions list */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Cargando submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            {submissions.length === 0 ? "No hay submissions aún" : "Sin resultados"}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s) => (
              <SubmissionRow
                key={s.submission_id}
                submission={s}
                expanded={expandedId === s.submission_id}
                onToggle={() => setExpandedId(expandedId === s.submission_id ? null : s.submission_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) {
  return (
    <Card className="bg-white/[0.03] border-white/10">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-bold text-white">
            {value}{suffix && <span className="text-sm text-slate-400 font-normal">{suffix}</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionRow({ submission: s, expanded, onToggle }: { submission: Submission; expanded: boolean; onToggle: () => void }) {
  return (
    <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
        {/* Score circle */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
          s.score_total >= 70 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
          s.score_total >= 40 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
          "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {s.score_total}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium truncate">{s.nombre_completo || "—"}</span>
            {s.status === "in_progress" ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">En progreso</span>
            ) : (
              <span className={`text-xs font-medium ${classColor(s.clasificacion)}`}>{s.clasificacion}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{s.pais_origen}</span>
            <span>·</span>
            <span>{s.nivel_aleman}</span>
            {s.email && <><span>·</span><span>{s.email}</span></>}
            <span>·</span>
            <span>{formatDate(s.created_at)}</span>
          </div>
        </div>

        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
              {/* Score bars */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "Idioma", score: s.score_idioma },
                  { label: "Docs", score: s.score_documentos },
                  { label: "Homolog.", score: s.score_homologacion },
                  { label: "Finanzas", score: s.score_finanzas },
                  { label: "Estrategia", score: s.score_estrategia },
                ].map(({ label, score }) => (
                  <div key={label} className="text-center">
                    <div className="text-xs text-slate-500 mb-1">{label}</div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score >= 15 ? "bg-emerald-500" : score >= 8 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${(score / 20) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{score}/20</div>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <DetailRow label="Email" value={s.email || "—"} />
                <DetailRow label="Nacionalidad" value={s.nacionalidad} />
                <DetailRow label="Edad" value={s.edad} />
                <DetailRow label="Estado civil" value={s.estado_civil} />
                <DetailRow label="Viaja" value={s.viaja_solo === "solo" ? "Solo" : "Con familia"} />
                <DetailRow label="Universidad" value={s.universidad} />
                <DetailRow label="Graduación" value={s.anio_graduacion} />
                <DetailRow label="Especialidad" value={s.cual_especialidad || (s.tiene_especialidad === "si" ? "Sí" : "No")} />
                <DetailRow label="Experiencia" value={`${s.anios_experiencia} años`} />
                <DetailRow label="Certificado" value={s.cual_certificado || (s.tiene_certificado === "si" ? "Sí" : "No")} />
                <DetailRow label="Alemán médico" value={s.estudio_aleman_medico === "si" ? "Sí" : "No"} />
                <DetailRow label="FSP" value={s.presento_fsp === "si" ? "Presentó" : "No"} />
                <DetailRow label="Kenntnisprüfung" value={s.presento_kenntnis === "si" ? "Presentó" : "No"} />
                <DetailRow label="Envió docs" value={s.envio_documentos === "si" ? "Sí" : "No"} />
                <DetailRow label="Berufserlaubnis" value={s.tiene_berufserlaubnis === "si" ? "Sí" : "No"} />
                <DetailRow label="Approbation" value={s.tiene_approbation === "si" ? "Sí" : "No"} />
                <DetailRow label="Visa" value={s.tipo_visa} />
                <DetailRow label="Ahorro" value={s.dinero_ahorrado} />
                <DetailRow label="Sperrkonto" value={s.puede_abrir_sperrkonto === "si" ? "Sí" : "No"} />
                <DetailRow label="Ciudades pequeñas" value={s.dispuesto_ciudades_pequenas === "si" ? "Sí" : "No"} />
                <DetailRow label="Cuándo viajar" value={s.cuando_viajar} />
              </div>

              {s.motivacion && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Motivación</p>
                  <p className="text-sm text-slate-300 bg-white/5 rounded-lg p-3 border border-white/5 leading-relaxed">
                    {s.motivacion}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1 border-b border-white/5">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 text-right">{value}</span>
    </div>
  );
}

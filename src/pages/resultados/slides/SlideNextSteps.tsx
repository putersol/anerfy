import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Languages,
  PiggyBank,
  MapPin,
  Building2,
  FileText,
  CalendarCheck,
  ExternalLink,
  Stethoscope,
} from 'lucide-react';
import { DashboardScores, SPERRKONTO_AMOUNT, SPERRKONTO_LABEL } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

/* ── helpers ── */

function getLevelLabel(nivel: string) {
  const map: Record<string, string> = {
    Ninguno: 'Sin nivel — Debes empezar YA',
    A1: 'A1 — Nivel insuficiente',
    A2: 'A2 — Aún lejos del B2',
    B1: 'B1 — Falta consolidar',
    B2: 'B2 — Nivel mínimo alcanzado',
    C1: 'C1 — Buen nivel',
    C2: 'C2 — Nivel nativo',
  };
  return map[nivel] || 'Sin nivel — Debes empezar YA';
}

function getLanguageCritical(nivel: string) {
  return ['Ninguno', 'A1', 'A2', 'B1'].includes(nivel);
}

function estimateLanguageCosts(nivel: string) {
  const costs: { label: string; min: number; max: number }[] = [];
  if (['Ninguno', 'A1'].includes(nivel)) {
    costs.push({ label: 'Cursos A1→B2 (intensivo)', min: 2000, max: 4000 });
  } else if (nivel === 'A2') {
    costs.push({ label: 'Cursos A2→B2', min: 1500, max: 3000 });
  } else if (nivel === 'B1') {
    costs.push({ label: 'Cursos B1→B2', min: 800, max: 1500 });
  }
  costs.push({ label: 'Exámenes Goethe/telc', min: 200, max: 350 });
  return costs;
}

function estimateFinancialPlan(nivel: string) {
  const langCosts = estimateLanguageCosts(nivel);
  const langTotal = langCosts.reduce((s, c) => s + c.max, 0);

  const items = [
    ...langCosts,
    { label: 'Traducción jurada de documentos', min: 500, max: 1200 },
    { label: 'Sperrkonto (cuenta bloqueada)', min: SPERRKONTO_AMOUNT, max: SPERRKONTO_AMOUNT },
    { label: 'Vuelo + primer mes en Alemania', min: 1500, max: 2500 },
    { label: 'Colchón 12 meses vivir en Alemania', min: 10000, max: 15000 },
  ];

  const totalMin = items.reduce((s, c) => s + c.min, 0);
  const totalMax = items.reduce((s, c) => s + c.max, 0);

  return { items, totalMin, totalMax };
}

function getBundeslandRecommendations(submission: any) {
  return [
    {
      name: 'Niedersachsen',
      reason: 'Proceso ágil, hospitales periféricos con alta demanda',
      highlight: 'Más rápido',
    },
    {
      name: 'Bayern',
      reason: 'Salarios altos, buena infraestructura para médicos extranjeros',
      highlight: 'Mejor salario',
    },
    {
      name: 'NRW',
      reason: 'Mayor número de plazas, ciudades grandes y accesibles',
      highlight: 'Más plazas',
    },
  ];
}

/* ── Component ── */

const SlideNextSteps = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const nivel = submission.nivel_aleman || 'Ninguno';
  const isCritical = getLanguageCritical(nivel);
  const finance = estimateFinancialPlan(nivel);
  const bundeslands = getBundeslandRecommendations(submission);

  const anim = (i: number) => ({
    initial: { y: 16, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.1 + i * 0.08 },
  });

  return (
    <div ref={ref} className="h-full overflow-y-auto">
      <div className="px-6 sm:px-12 py-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...anim(0)}>
          <h2 className="text-xl font-semibold text-foreground">Próximos Pasos — Plan Personalizado</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Acciones concretas para {submission.nombre_completo || 'tu caso'}
          </p>
        </motion.div>

        {/* ── 3 Columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col 1: Idioma */}
          <motion.div
            {...anim(1)}
            className={`rounded-xl border p-4 ${
              isCritical
                ? 'border-destructive/40 bg-destructive/5'
                : 'border-border bg-secondary/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isCritical ? 'bg-destructive/15' : 'bg-primary/10'
              }`}>
                <Languages className={`w-4 h-4 ${isCritical ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Idioma</h3>
                {isCritical && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Crítico
                  </span>
                )}
              </div>
            </div>

            <p className={`text-xs font-medium mb-2 ${isCritical ? 'text-destructive' : 'text-foreground'}`}>
              {getLevelLabel(nivel)}
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isCritical
                ? 'Debes iniciar tu preparación de alemán de inmediato. El idioma es el factor #1 que determina la velocidad de todo tu proceso. Sin B2, no hay FSP posible.'
                : 'Tu nivel de idioma está en buen camino. Continúa consolidando para presentar la FSP con confianza.'}
            </p>
            {isCritical && (
              <div className="mt-3 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-[11px] font-semibold text-destructive">⏰ Empieza AHORA</p>
                <p className="text-[10px] text-destructive/80">Cada mes sin avanzar retrasa tu llegada a Alemania</p>
              </div>
            )}
          </motion.div>

          {/* Col 2: Finanzas / Ahorro */}
          <motion.div {...anim(2)} className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Plan de Ahorro</h3>
            </div>

            <div className="space-y-1.5">
              {finance.items.map((item, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground truncate mr-2">{item.label}</span>
                  <span className="text-foreground font-medium whitespace-nowrap">
                    {item.min === item.max
                      ? `€${item.min.toLocaleString('de-DE')}`
                      : `€${item.min.toLocaleString('de-DE')}–${item.max.toLocaleString('de-DE')}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-border">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Total estimado</span>
                <span className="font-bold text-primary">
                  €{(Math.round(finance.totalMin / 1000) * 1000).toLocaleString('de-DE')}–{(Math.round(finance.totalMax / 1000) * 1000).toLocaleString('de-DE')}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Mínimo €25.000–30.000 para vivir un año en Alemania mientras presentas la FSP
              </p>
            </div>
          </motion.div>

          {/* Col 3: Bundesland */}
          <motion.div {...anim(3)} className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Bundesland Óptimo</h3>
            </div>

            <div className="space-y-2">
              {bundeslands.map((bl, i) => (
                <div key={i} className="p-2 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-primary" />
                      {bl.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {bl.highlight}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{bl.reason}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground mt-2">
              + Búsqueda de hospitales periféricos convenientes según tu perfil
            </p>
          </motion.div>
        </div>

        {/* ── Products ── */}
        <motion.div {...anim(4)} className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Nuestros Servicios
          </h3>

          {/* Product 1: Asesoría financiera */}
          <a
            href="https://anerfy.com/services"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-border bg-gradient-to-r from-secondary/50 to-secondary/20 p-4 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <PiggyBank className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Asesoría Financiera Anerfy
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Te brindamos una asesoría personalizada con uno de nuestros expertos para elaborar tu plan de ahorro y cumplir tu meta de venirte a Alemania a ejercer como médica.
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </div>
          </a>

          {/* Product 2: Ticket de seguimiento */}
          <a
            href="https://anerfy.com/services"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-border bg-gradient-to-r from-secondary/50 to-secondary/20 p-4 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Ticket de Seguimiento
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  ¿Ya cuentas con tu B2? ¿Necesitas dirección para recibir tu certificado de deficiencias? ¿Dudas sobre tu Bundesland o cuenta bloqueada? Una sesión personalizada con uno de nuestros asesores para acompañarte en dar inicio a tu homologación.
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </div>
          </a>

          {/* Product 3: Virtus FSP */}
          <a
            href="https://virtus-akademie.thinkific.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-border bg-gradient-to-r from-secondary/50 to-secondary/20 p-4 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Preparación FSP — Virtus Akademie
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  ¿Ya alcanzaste tu B2 y necesitas iniciar la presentación de tu FSP? Nuestros partners de Virtus son expertos en este importante proceso para ayudarte a preparar y aprobar tu Fachsprachprüfung.
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </div>
          </a>

        </motion.div>
      </div>
    </div>
  );
});

SlideNextSteps.displayName = 'SlideNextSteps';
export default SlideNextSteps;

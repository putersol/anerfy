import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Download, Calculator as CalcIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const bundeslaender = ['Bayern', 'Berlin', 'NRW', 'Baden-Württemberg', 'Hamburg', 'Hessen', 'Sachsen', 'Niedersachsen'];
const countries = ['México', 'Colombia', 'Argentina', 'Perú', 'Chile', 'Venezuela', 'Ecuador', 'España', 'Otro'];
const speeds = [{ id: 'Acelerado', label: 'Acelerado' }, { id: 'Normal', label: 'Normal' }, { id: 'Relajado', label: 'Relajado' }];
const familyOptions = [{ id: 'Solo', label: 'Solo/a' }, { id: 'Pareja', label: 'Pareja' }, { id: 'Familia', label: 'Familia' }];
const germanLevels = ['Ninguno', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function CalculatorPage() {
  const [country, setCountry] = useState('México');
  const [anabin, setAnabin] = useState(true);
  const [germanLevel, setGermanLevel] = useState('B1');
  const [bundesland, setBundesland] = useState('Berlin');
  const [family, setFamily] = useState('Solo');
  const [speed, setSpeed] = useState('Normal');
  const isMobile = useIsMobile();

  const breakdown = useMemo(() => {
    const items = [
      { name: 'Traducciones + Apostillas', shortName: 'Traducciones', low: 600, high: 1000 },
      { name: 'Tasas administrativas', shortName: 'Tasas admin.', low: 500, high: 750 },
      { name: 'Cursos alemán', shortName: 'Cursos alemán', low: ['C1', 'C2'].includes(germanLevel) ? 0 : ['B1', 'B2'].includes(germanLevel) ? 800 : 1200, high: ['C1', 'C2'].includes(germanLevel) ? 0 : ['B1', 'B2'].includes(germanLevel) ? 1600 : 2400 },
      { name: 'FSP examen', shortName: 'FSP examen', low: 350, high: 500 },
      { name: 'Kenntnisprüfung', shortName: 'Kenntnisp.', low: anabin ? 0 : 400, high: anabin ? 0 : 1400 },
      { name: 'Vivienda (3 meses)', shortName: 'Vivienda', low: 1800, high: 3000 },
      { name: 'Seguro + otros', shortName: 'Seguro+otros', low: 600, high: 900 },
    ];
    if (family === 'Pareja') items.push({ name: 'Costos familia', shortName: 'Familia', low: 2000, high: 3000 });
    if (family === 'Familia') items.push({ name: 'Costos familia', shortName: 'Familia', low: 3000, high: 5000 });
    return items;
  }, [anabin, germanLevel, family]);

  const totalLow = breakdown.reduce((s, i) => s + i.low, 0);
  const totalHigh = breakdown.reduce((s, i) => s + i.high, 0);

  const timeBase = 10 + (speed === 'Acelerado' ? -2 : speed === 'Relajado' ? 3 : 0) + (['C1', 'C2'].includes(germanLevel) ? -2 : 0) + (anabin ? -1 : 0);
  const timeLow = Math.max(timeBase - 1, 6);
  const timeHigh = timeBase + 3;

  const chartData = breakdown.filter(i => i.high > 0).map(i => ({
    name: isMobile ? i.shortName : i.name,
    value: Math.round((i.low + i.high) / 2),
  }));
  const colors = ['hsl(222,80%,40%)', 'hsl(160,84%,39%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)', 'hsl(270,60%,50%)', 'hsl(200,70%,50%)', 'hsl(340,70%,50%)', 'hsl(120,50%,40%)'];

  const RadioGroup = ({ options, value, onChange }: { options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={`px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all min-h-[44px] ${value === o.id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/40'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="container max-w-3xl py-5 sm:py-8 px-3 sm:px-4 space-y-5 sm:space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg gradient-primary flex items-center justify-center">
            <CalcIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl sm:text-3xl font-bold text-foreground">Calculadora de Costos y Tiempos</h1>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:gap-6">
        {/* Inputs */}
        <Card className="p-4 sm:p-6 shadow-card space-y-4 sm:space-y-5">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">País de origen</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm min-h-[44px]">
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">Universidad reconocida ANABIN H+</label>
            <div className="flex gap-1.5 sm:gap-2">
              {[true, false].map((v) => (
                <button key={String(v)} onClick={() => setAnabin(v)}
                  className={`px-4 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all min-h-[44px] ${anabin === v ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/40'}`}>
                  {v ? 'Sí' : 'No'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">Nivel de alemán actual</label>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {germanLevels.map((l) => (
                <button key={l} onClick={() => setGermanLevel(l)}
                  className={`px-2.5 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all min-h-[44px] ${germanLevel === l ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:border-primary/40'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">Bundesland destino</label>
            <select value={bundesland} onChange={(e) => setBundesland(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm min-h-[44px]">
              {bundeslaender.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">Situación familiar</label>
            <RadioGroup options={familyOptions} value={family} onChange={setFamily} />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">Velocidad del proceso</label>
            <RadioGroup options={speeds} value={speed} onChange={setSpeed} />
          </div>
        </Card>

        {/* Results */}
        <Card className="p-4 sm:p-6 shadow-card space-y-4 sm:space-y-5">
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Desglose estimado</h2>

          {/* Chart */}
          <div className="h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `€${v}`} />
                <YAxis type="category" dataKey="name" width={isMobile ? 85 : 140} tick={{ fontSize: isMobile ? 9 : 11 }} />
                <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, 'Promedio']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown */}
          <div className="space-y-1.5 sm:space-y-2">
            {breakdown.filter(i => i.high > 0).map((item) => (
              <div key={item.name} className="flex justify-between text-xs sm:text-sm py-1.5 border-b border-border/50 last:border-0">
                <span className="text-foreground">{item.name}</span>
                <span className="font-medium text-foreground whitespace-nowrap ml-2">€{item.low.toLocaleString()}-€{item.high.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t-2 border-primary/20">
              <span className="font-bold text-foreground text-base sm:text-lg">TOTAL</span>
              <span className="font-bold text-primary text-base sm:text-lg">€{totalLow.toLocaleString()}-€{totalHigh.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Tiempo estimado</span>
              <span className="font-semibold">{timeLow}-{timeHigh} meses</span>
            </div>
          </div>
        </Card>

        {/* Warning */}
        <Card className="p-4 sm:p-5 shadow-card bg-accent/5 border-accent/20">
          <div className="flex gap-2.5 sm:gap-3">
            <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1 text-foreground">
              <p className="font-semibold">Casos reales:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li>30% necesita €2k-3k más que el estimado</li>
                <li>15% completa con menos presupuesto</li>
                <li>Planifica un buffer de 20% adicional</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" className="flex-1 h-11 text-xs sm:text-sm"><Download className="w-4 h-4 mr-1.5 sm:mr-2" /> Descargar PDF</Button>
          <Button className="flex-1 h-11 text-xs sm:text-sm gradient-primary text-primary-foreground hover:opacity-90">Guardar cálculo</Button>
        </div>
      </div>
    </div>
  );
}

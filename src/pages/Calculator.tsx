import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Download } from 'lucide-react';
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
  const grays = ['hsl(0,0%,15%)', 'hsl(0,0%,25%)', 'hsl(0,0%,35%)', 'hsl(0,0%,45%)', 'hsl(0,0%,55%)', 'hsl(0,0%,65%)', 'hsl(0,0%,40%)', 'hsl(0,0%,30%)'];

  const ToggleGroup = ({ options, value, onChange }: { options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={`px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all min-h-[40px] ${value === o.id ? 'border-foreground bg-foreground text-background font-medium' : 'border-border text-foreground hover:border-foreground/30'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="container max-w-2xl py-6 sm:py-10 px-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Calculadora</h1>
        <p className="text-sm text-muted-foreground mt-1">Estima costos y tiempos de tu proceso.</p>
      </motion.div>

      <div className="grid gap-4 sm:gap-5">
        <Card className="p-4 sm:p-6 shadow-card space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">País de origen</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm min-h-[40px]">
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ANABIN H+</label>
            <div className="flex gap-1.5">
              {[true, false].map((v) => (
                <button key={String(v)} onClick={() => setAnabin(v)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all min-h-[40px] ${anabin === v ? 'border-foreground bg-foreground text-background font-medium' : 'border-border text-foreground hover:border-foreground/30'}`}>
                  {v ? 'Sí' : 'No'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nivel de alemán</label>
            <div className="flex gap-1.5 flex-wrap">
              {germanLevels.map((l) => (
                <button key={l} onClick={() => setGermanLevel(l)}
                  className={`px-2.5 py-2 rounded-lg border text-xs sm:text-sm transition-all min-h-[40px] ${germanLevel === l ? 'border-foreground bg-foreground text-background font-medium' : 'border-border text-foreground hover:border-foreground/30'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bundesland</label>
            <select value={bundesland} onChange={(e) => setBundesland(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm min-h-[40px]">
              {bundeslaender.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Situación familiar</label>
            <ToggleGroup options={familyOptions} value={family} onChange={setFamily} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Velocidad</label>
            <ToggleGroup options={speeds} value={speed} onChange={setSpeed} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 shadow-card space-y-4">
          <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">Desglose</h2>

          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(0,0%,45%)' }} tickFormatter={(v) => `€${v}`} />
                <YAxis type="category" dataKey="name" width={isMobile ? 85 : 140} tick={{ fontSize: isMobile ? 9 : 11, fill: 'hsl(0,0%,45%)' }} />
                <Tooltip formatter={(v: number) => [`€${v.toLocaleString()}`, 'Promedio']} />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={grays[i % grays.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5">
            {breakdown.filter(i => i.high > 0).map((item) => (
              <div key={item.name} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-medium text-foreground">€{item.low.toLocaleString()}–€{item.high.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-foreground/10">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-semibold text-foreground">€{totalLow.toLocaleString()}–€{totalHigh.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tiempo estimado</span>
              <span className="font-medium">{timeLow}–{timeHigh} meses</span>
            </div>
          </div>
        </Card>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">Casos reales:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>30% necesita €2k–3k más que el estimado</li>
                <li>15% completa con menos presupuesto</li>
                <li>Planifica un buffer de 20% adicional</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 h-10 text-xs"><Download className="w-3.5 h-3.5 mr-1.5" /> Descargar PDF</Button>
          <Button className="flex-1 h-10 text-xs">Guardar cálculo</Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Play } from 'lucide-react';

const categories = ['Todos', 'Alemán médico', 'Homologación', 'Finanzas', 'Legal', 'Psicología'];

interface ServiceProvider {
  name: string;
  role: string;
  category: string;
  rating: number;
  reviews: number;
  specialty: string;
  includes: string[];
  price: string;
  testimonial?: string;
  testimonialAuthor?: string;
  cta: string;
}

const providers: ServiceProvider[] = [
  {
    name: 'Iris', role: 'Profesora Alemán Médico — Leipzig', category: 'Alemán médico',
    rating: 4.9, reviews: 127, specialty: 'Alemán médico + Preparación FSP + Simulaciones',
    includes: ['8 sesiones 1:1 por mes', 'Simulaciones FSP reales', 'Corrección documentos médicos', 'Grupo práctica otros médicos'],
    price: '€280/mes (mín. 3 meses)', testimonial: 'Aprobé FSP primera vez gracias a simulaciones', testimonialAuthor: 'Dr. Carlos M.',
    cta: 'Agendar consulta gratis',
  },
  {
    name: 'Alberto Díaz', role: 'Especialista Homologación Médica', category: 'Homologación',
    rating: 5.0, reviews: 89, specialty: 'Homologación completa médicos LatAm',
    includes: ['Revisión completa documentos', 'Verificación ANABIN', 'Estrategia por Bundesland', 'Seguimiento proceso completo'],
    price: '€300–€400 por asesoría', testimonial: 'Me ahorró meses de trámites innecesarios', testimonialAuthor: 'Dra. Ana L.',
    cta: 'Consulta inicial gratis',
  },
  {
    name: 'Dieter', role: 'Asesor Financiero Médicos — Hispano Akademie', category: 'Finanzas',
    rating: 4.8, reviews: 156, specialty: 'Optimización fiscal y pensiones médicos',
    includes: ['Análisis situación completa', 'Optimización Steuerklasse', 'Planificación Versorgungswerk', 'Estrategia Berufsunfähigkeit'],
    price: '€200–€500 consulta', cta: 'Agendar cita',
  },
  {
    name: 'Lic. Patricia Ruiz', role: 'Psicóloga especializada migrantes', category: 'Psicología',
    rating: 4.9, reviews: 78, specialty: 'Burnout, integración, síndrome impostor',
    includes: ['Sesiones individuales', 'Grupo de apoyo semanal', 'Recursos de autoayuda', 'Atención en español'],
    price: '€90/sesión', cta: 'Primera sesión gratis',
  },
  {
    name: 'Rechtsanwalt Thomas Weber', role: 'Abogado contratos médicos', category: 'Legal',
    rating: 4.7, reviews: 64, specialty: 'Revisión contratos, Personalvermittler',
    includes: ['Revisión contrato laboral', 'Negociación condiciones', 'Asesoría Aufenthaltstitel', 'Soporte legal general'],
    price: '€250 revisión contrato', cta: 'Consultar',
  },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = activeCategory === 'Todos' ? providers : providers.filter((p) => p.category === activeCategory);

  return (
    <div className="container max-w-3xl py-6 sm:py-10 px-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Servicios</h1>
        <p className="text-sm text-muted-foreground mt-1">Profesionales verificados. Transparencia radical: sabes quién te ayuda y cuánto cuesta.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
              activeCategory === cat
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p, idx) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
            <Card className="p-5 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-3 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-medium text-sm text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{p.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= Math.floor(p.rating) ? 'text-foreground fill-foreground' : 'text-border'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{p.rating} ({p.reviews})</span>
                  </div>
                </div>
              </div>

              <Badge variant="secondary" className="w-fit text-[10px]">{p.specialty}</Badge>

              <button className="w-full h-14 rounded-lg bg-muted flex items-center justify-center gap-2 text-xs text-muted-foreground hover:bg-muted/80 transition-colors">
                <Play className="w-4 h-4" /> Video 30–60 seg
              </button>

              <ul className="space-y-1 flex-1">
                {p.includes.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-foreground/30 mt-px">—</span> {item}
                  </li>
                ))}
              </ul>

              <div className="text-sm font-semibold text-foreground">{p.price}</div>

              {p.testimonial && (
                <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground italic">
                  "{p.testimonial}" — <span className="font-medium text-foreground not-italic">{p.testimonialAuthor}</span>
                </div>
              )}

              <div className="flex gap-2 flex-col sm:flex-row">
                <Button className="flex-1 text-xs h-10">{p.cta}</Button>
                <Button variant="outline" className="text-xs h-10">Ver perfil</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

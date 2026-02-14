import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, User, Play, ShoppingBag } from 'lucide-react';

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
    name: 'Dra. María González', role: 'Profesora Goethe Institut Leipzig', category: 'Alemán médico',
    rating: 4.9, reviews: 127, specialty: 'Alemán médico + Preparación FSP',
    includes: ['8 sesiones 1:1 por mes', 'Simulaciones FSP reales', 'Corrección documentos médicos', 'Grupo práctica otros médicos'],
    price: '€280/mes (mín. 3 meses)', testimonial: 'Aprobé FSP primera vez gracias a simulaciones', testimonialAuthor: 'Dr. Carlos M.',
    cta: 'Agendar consulta gratis 20 min',
  },
  {
    name: 'Alberto Méndez', role: 'Especialista Homologación Médica', category: 'Homologación',
    rating: 5.0, reviews: 89, specialty: 'Homologación completa médicos LatAm',
    includes: ['Revisión completa documentos', 'Verificación ANABIN', 'Estrategia por Bundesland', 'Seguimiento proceso completo'],
    price: '€500-€1.500 según caso', cta: 'Consulta inicial gratis',
  },
  {
    name: 'Dieter Schmidt', role: 'Asesor Financiero Médicos', category: 'Finanzas',
    rating: 4.8, reviews: 156, specialty: 'Optimización fiscal y pensiones médicos',
    includes: ['Análisis situación completa', 'Optimización Steuerklasse', 'Planificación Versorgungswerk', 'Estrategia Berufsunfähigkeit'],
    price: '€200 consulta inicial', cta: 'Agendar cita',
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
    <div className="container max-w-5xl py-8 px-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Servicios Especializados</h1>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'gradient-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((p, idx) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card className="p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 space-y-4 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(p.rating) ? 'text-accent fill-accent' : 'text-border'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{p.rating}/5 ({p.reviews} reseñas)</span>
                  </div>
                </div>
              </div>

              <Badge variant="secondary" className="w-fit">{p.specialty}</Badge>

              {/* Video placeholder */}
              <button className="w-full h-20 rounded-lg bg-muted flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/80 transition-colors">
                <Play className="w-5 h-5" /> Video presentación
              </button>

              {/* Includes */}
              <ul className="space-y-1.5 flex-1">
                {p.includes.map((item) => (
                  <li key={item} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="text-lg font-bold text-primary">{p.price}</div>

              {/* Testimonial */}
              {p.testimonial && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm italic text-muted-foreground">
                  "{p.testimonial}" — <span className="font-medium text-foreground">{p.testimonialAuthor}</span>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-2">
                <Button className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">{p.cta}</Button>
                <Button variant="outline">Ver perfil</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

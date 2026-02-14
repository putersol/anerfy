import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Lock, BookOpen } from 'lucide-react';

const freeGuides = [
  { title: 'Guía Premium Homologación Completa', desc: '6 páginas roadmap detallado · Costos y tiempos · Errores comunes' },
  { title: 'Checklist Documentos por País', desc: 'México, Colombia, Argentina específicos · Dónde conseguir cada documento' },
  { title: 'Guía FSP: Qué evalúan REALMENTE', desc: 'Estructura examen · Casos ejemplo · Frases clave alemán médico' },
  { title: 'Comparativa Bundesländer', desc: 'Tiempos procesamiento · Requisitos específicos' },
  { title: 'Folleto Post-Approbation', desc: 'Próximos pasos financieros · Planificación 12 meses' },
];

const premiumGuides = [
  'Estrategia Kenntnisprüfung por Bundesland',
  'Negociación primer contrato médico',
  'Optimización fiscal médicos migrantes',
  'Reunificación familiar paso a paso',
  'Alemania vs otros países (comparativa completa)',
];

export default function GuidesPage() {
  return (
    <div className="container max-w-4xl py-8 px-4 space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Biblioteca de Recursos</h1>
        </div>
      </motion.div>

      {/* Free */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Guías Gratuitas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {freeGuides.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground flex-1 mb-4">{g.desc}</p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" /> Descargar PDF
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Guías Premium</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {premiumGuides.map((title, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
                <Badge className="absolute top-3 right-3 gradient-accent text-accent-foreground border-0">PREMIUM</Badge>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
                <div className="flex-1" />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-primary">€9.90</span>
                  <Button size="sm" className="gradient-accent text-accent-foreground hover:opacity-90">Comprar</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

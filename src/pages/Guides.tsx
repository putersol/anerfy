import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Lock } from 'lucide-react';

const freeGuides = [
  { title: 'Guía Homologación Completa', desc: '6 páginas roadmap detallado · Costos y tiempos · Errores comunes' },
  { title: 'Checklist Documentos por País', desc: 'México, Colombia, Argentina específicos · Dónde conseguir cada documento' },
  { title: 'Guía FSP: Qué evalúan', desc: 'Estructura examen · Casos ejemplo · Frases clave' },
  { title: 'Comparativa Bundesländer', desc: 'Tiempos procesamiento · Requisitos específicos' },
  { title: 'Folleto Post-Approbation', desc: 'Próximos pasos financieros · Planificación 12 meses' },
];

const premiumGuides = [
  'Estrategia Kenntnisprüfung por Bundesland',
  'Negociación primer contrato médico',
  'Optimización fiscal médicos migrantes',
  'Reunificación familiar paso a paso',
  'Alemania vs otros países (comparativa)',
];

export default function GuidesPage() {
  return (
    <div className="container max-w-3xl py-6 sm:py-10 px-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Recursos</h1>
        <p className="text-sm text-muted-foreground mt-1">Guías y documentos para cada etapa del proceso.</p>
      </motion.div>

      <section className="space-y-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gratuitas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {freeGuides.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                <h3 className="font-display font-medium text-sm text-foreground mb-1.5">{g.title}</h3>
                <p className="text-xs text-muted-foreground flex-1 mb-3 leading-relaxed">{g.desc}</p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Descargar
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Premium</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {premiumGuides.map((title, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col relative">
                <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">PRO</Badge>
                <Lock className="w-4 h-4 text-muted-foreground mb-2" />
                <h3 className="font-display font-medium text-sm text-foreground mb-auto">{title}</h3>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">€9.90</span>
                  <Button size="sm" className="text-xs h-8">Comprar</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

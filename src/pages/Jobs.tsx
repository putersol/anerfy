import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Clock } from 'lucide-react';

const sampleJobs = [
  { title: 'Assistenzarzt/ärztin Innere Medizin', hospital: 'Universitätsklinikum Leipzig', location: 'Leipzig, Sachsen', type: 'Vollzeit', posted: 'hace 2d', berufserlaubnis: true },
  { title: 'Assistenzarzt/ärztin Chirurgie', hospital: 'Charité Berlin', location: 'Berlin', type: 'Vollzeit', posted: 'hace 5d', berufserlaubnis: false },
  { title: 'Assistenzarzt/ärztin Neurologie', hospital: 'Klinikum Stuttgart', location: 'Stuttgart, BW', type: 'Vollzeit', posted: 'hace 1 semana', berufserlaubnis: true },
  { title: 'Assistenzarzt/ärztin Pädiatrie', hospital: 'UKE Hamburg', location: 'Hamburg', type: 'Vollzeit', posted: 'hace 3d', berufserlaubnis: true },
];

export default function JobsPage() {
  return (
    <div className="container max-w-2xl py-6 sm:py-10 px-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl sm:text-2xl font-semibold text-foreground">Bolsa de Empleo</h1>
        <p className="text-sm text-muted-foreground mt-1">Ofertas médicas verificadas en hospitales y clínicas alemanas.</p>
      </motion.div>

      <div className="grid gap-2">
        {sampleJobs.map((job, i) => (
          <motion.div key={job.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                  <h3 className="font-display font-medium text-sm text-foreground">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3 shrink-0" /> {job.hospital}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">{job.type}</Badge>
                    {job.berufserlaubnis && <Badge variant="secondary" className="text-[10px]">Acepta Berufserlaubnis</Badge>}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs shrink-0">Ver</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-muted rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">Bolsa de empleo en desarrollo. Contacto directo con clínicas próximamente.</p>
        <Button variant="outline" size="sm" className="mt-3 text-xs">Notificarme</Button>
      </div>
    </div>
  );
}

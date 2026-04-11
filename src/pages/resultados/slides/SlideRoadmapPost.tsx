import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Shield, TrendingUp, Clock, ArrowRight, Star } from 'lucide-react';
import { DashboardScores } from '@/lib/dashboardScoring';

interface Props {
  submission: any;
  scores: DashboardScores;
}

const services = [
  {
    id: 'aleman-medico',
    icon: Stethoscope,
    title: 'Alemán Médico con Alberto',
    subtitle: 'Preparación FSP & Comunicación Clínica',
    description: 'Curso especializado de alemán médico: terminología, anamnesis, documentación clínica y simulacros de examen FSP.',
    tags: ['Fachsprachprüfung', 'Anamnese', 'Arztbriefe'],
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    trigger: 'A partir de nivel B1',
  },
  {
    id: 'seguros-finanzas',
    icon: Shield,
    title: 'Seguros y Finanzas',
    subtitle: 'Hispano Akademie',
    description: 'Asesoría integral en seguros de salud, responsabilidad civil, Sperrkonto, impuestos y planificación financiera en Alemania.',
    tags: ['Krankenversicherung', 'Sperrkonto', 'Steuern'],
    color: 'from-emerald-500/20 to-green-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    trigger: '3 meses antes de viajar',
  },
  {
    id: 'seguimiento',
    icon: TrendingUp,
    title: 'Seguimiento Personalizado',
    subtitle: 'Acompañamiento continuo',
    description: 'Check-ins mensuales de progreso, alertas de deadlines, ajustes de ruta y soporte en momentos críticos del proceso.',
    tags: ['Progreso', 'Deadlines', 'Soporte'],
    color: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    iconColor: 'text-violet-400',
    trigger: 'Desde hoy',
  },
];

const SlideRoadmapPost = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const nivel = submission.nivel_aleman || 'Ninguno';
  const needsLanguage = ['Ninguno', 'A1', 'A2', 'B1'].includes(nivel);

  return (
    <div ref={ref} className="h-full flex flex-col justify-center px-8 sm:px-16">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Roadmap Post-Asesoría</span>
        </div>
        <h2 className="text-xl font-medium text-foreground">
          Tu Camino Después de la Consulta
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Servicios especializados para acelerar tu proceso — activados según tu avance
        </p>
      </motion.div>

      <div className="grid gap-4">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className={`rounded-xl border ${service.borderColor} bg-gradient-to-r ${service.color} p-4 hover:scale-[1.01] transition-transform`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${service.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{service.title}</h4>
                      <p className="text-xs text-muted-foreground">{service.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background/50 rounded-full px-2 py-0.5 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {service.trigger}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{service.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {needsLanguage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2"
        >
          <ArrowRight className="w-3 h-3 shrink-0" />
          <span>
            Tu nivel actual ({nivel}) indica que el alemán médico se activa tras alcanzar B1/B2. 
            Mientras tanto, el seguimiento personalizado comienza de inmediato.
          </span>
        </motion.div>
      )}
    </div>
  );
});

SlideRoadmapPost.displayName = 'SlideRoadmapPost';
export default SlideRoadmapPost;

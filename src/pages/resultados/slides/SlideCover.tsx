import { motion } from 'framer-motion';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

interface Props { submission: any }

export default function SlideCover({ submission: s }: Props) {
  const specialty = s.cual_especialidad || 'Medicina General';
  const exp = s.anios_experiencia || '0';
  const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <motion.img
        src={anerfyLogo}
        alt="Anerfy"
        className="h-10 brightness-0 invert mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 max-w-2xl"
      >
        <h1 className="text-4xl sm:text-5xl font-normal leading-tight">
          Plan Personalizado{' '}
          <span className="italic font-accent font-semibold text-primary">
            Homologación Médica
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">Roadmap estratégico hacia Approbation</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 space-y-2"
      >
        <p className="text-xl font-medium text-foreground">
          {s.nombre_completo || 'Doctor/a'}
        </p>
        <p className="text-sm text-muted-foreground">
          {specialty} · {exp} años de experiencia
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground/60 mt-4">
          <span>{date}</span>
          <span>·</span>
          <span>{s.pais_origen || 'LATAM'}</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-8 text-xs text-muted-foreground/40 tracking-widest uppercase"
      >
        Presentado por ANERFY
      </motion.p>
    </div>
  );
}

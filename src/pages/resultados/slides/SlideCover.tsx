import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

interface Props { submission: any }

const SlideCover = forwardRef<HTMLDivElement, Props>(({ submission: s }, ref) => {
  const specialty = s.cual_especialidad || 'Medicina General';
  const exp = s.anios_experiencia || '0';
  const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div ref={ref} className="h-full flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />

      <motion.img
        src={anerfyLogo}
        alt="Anerfy"
        className="h-10 brightness-0 invert mb-12 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 max-w-2xl relative z-10"
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
        className="mt-10 space-y-2 relative z-10"
      >
        <p className="text-xl font-medium text-foreground">
          {s.nombre_completo || 'Doctor/a'}
        </p>
        <p className="text-sm text-muted-foreground">
          {specialty} · {exp} años de experiencia
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground/60 mt-4">
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
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
});

SlideCover.displayName = 'SlideCover';
export default SlideCover;

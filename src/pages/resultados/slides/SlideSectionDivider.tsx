import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle: string;
  description: string;
}

const SlideSectionDivider = forwardRef<HTMLDivElement, Props>(({ title, subtitle, description }, ref) => {
  return (
    <div ref={ref} className="h-full flex flex-col items-center justify-center text-center px-8 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02]" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-4"
      >
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-semibold text-primary tracking-[0.2em] uppercase"
        >
          {subtitle}
        </motion.p>

        <motion.h2
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-medium text-foreground max-w-lg mx-auto leading-tight"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-12 h-0.5 bg-primary mx-auto rounded-full"
        />

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-muted-foreground max-w-md mx-auto"
        >
          {description}
        </motion.p>
      </motion.div>
    </div>
  );
});

SlideSectionDivider.displayName = 'SlideSectionDivider';

export default SlideSectionDivider;

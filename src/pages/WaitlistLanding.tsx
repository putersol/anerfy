import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

/* Floating geometric shapes for animated background */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large rotating hexagon */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full border border-primary/10 rounded-[40%]" />
      </motion.div>

      {/* Medium counter-rotating shape */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full border border-primary/8 rounded-[30%]" />
      </motion.div>

      {/* Small pulsing shape */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]"
        animate={{ rotate: 180, scale: [1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full border border-primary/6 rounded-[35%]" />
      </motion.div>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      {/* Floating dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + i * 13}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function WaitlistLanding() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const targetCount = 242;

  /* Animate counter on mount */
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setDisplayCount(targetCount);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <FloatingShapes />

      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-1"
        >
          <img src={anerfyLogo} alt="Anerfy logo" className="w-20 h-20 sm:w-24 sm:h-24 brightness-0 invert object-contain scale-[1.6]" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-lg sm:text-xl font-bold tracking-[0.3em] text-foreground/60">
            ANERFY
          </span>
        </motion.div>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p
            className="font-display text-7xl sm:text-[120px] lg:text-[150px] font-bold leading-none tracking-tight text-foreground"
            style={{
              textShadow: '0 0 20px hsl(220 85% 55% / 0.4), 0 0 60px hsl(220 85% 55% / 0.2), 0 0 100px hsl(220 85% 55% / 0.1)',
            }}
          >
            {displayCount.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mt-2">
            Médicos en la lista de espera
          </p>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3"
        >
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.1]">
            Simplificamos tu{' '}
            <span className="italic text-primary">Anerkennung</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            La plataforma que te da el criterio para ejercer medicina en Alemania. Sin comisiones ocultas.
          </p>
        </motion.div>

        {/* CTA Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-md mx-auto"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
              />
              <Button
                type="submit"
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shrink-0 rounded-lg"
              >
                Unirme
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-primary"
            >
              <Check className="w-5 h-5" />
              <span className="font-semibold">¡Estás dentro!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Subtle tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-muted-foreground/50 text-xs tracking-wide"
        >
          Anerkennung + Simplify
        </motion.p>
      </div>
    </div>
  );
}

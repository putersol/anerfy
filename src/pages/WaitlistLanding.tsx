import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const targetCount = 242;

  /* Animate counter when visible */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
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
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('waitlist').insert({ email: email.trim().toLowerCase() });
      if (error) {
        if (error.code === '23505') {
          toast({ title: '¡Ya estás registrado!', description: 'Este email ya está en la lista de espera.' });
          setSubmitted(true);
        } else {
          toast({ title: 'Error', description: 'No se pudo registrar. Intenta de nuevo.', variant: 'destructive' });
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión. Intenta de nuevo.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <FloatingShapes />

      {/* Top bar - brand name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-center gap-2 pt-8 pb-4"
      >
        <img src={anerfyLogo} alt="Anerfy logo" className="w-8 h-8 sm:w-9 sm:h-9 brightness-0 invert object-contain scale-[1.6]" />
        <span
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-sm sm:text-base font-bold tracking-[0.35em] text-foreground/80"
        >
          ANERFY
        </span>
      </motion.div>

      {/* Main centered content */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl mx-auto space-y-6">
          {/* Counter */}
          <motion.div
            ref={counterRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p
              className="text-8xl sm:text-[140px] lg:text-[180px] font-bold leading-none tracking-tight text-foreground"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                textShadow: '0 0 30px hsl(220 85% 55% / 0.35), 0 0 80px hsl(220 85% 55% / 0.15), 0 0 120px hsl(220 85% 55% / 0.08)',
              }}
            >
              {displayCount.toLocaleString()}
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground"
          >
            Médicos en la lista de espera
          </motion.p>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4 pt-2"
          >
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Simplificamos tu{' '}
              <span className="italic text-primary">Anerkennung</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              La plataforma que te da el criterio para ejercer medicina en Alemania. Sin comisiones ocultas.
            </p>
          </motion.div>

          {/* CTA Form - tohkn style: single rounded pill container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="max-w-lg mx-auto pt-2"
          >
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex items-center bg-secondary/80 border border-border rounded-full p-1.5 pl-6"
              >
                <input
                  type="email"
                  placeholder="Tu dirección de email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 sm:h-11 px-5 sm:px-7 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full text-sm sm:text-base shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Unirme'}
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
        </div>
      </div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 text-center text-muted-foreground/40 text-xs tracking-wide pb-8"
      >
        Anerkennung + Simplify
      </motion.p>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

const emailSchema = z.string().trim().email('Email inválido').max(255, 'Email demasiado largo');

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
  const BASE_COUNT = 242;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const [targetCount, setTargetCount] = useState(BASE_COUNT);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  /* Fetch real count from DB */
  useEffect(() => {
    const fetchCount = async () => {
      const { data, error } = await supabase.rpc('get_waitlist_count');
      if (!error && data !== null) {
        setTargetCount(BASE_COUNT + data);
      }
    };
    fetchCount();

    // Subscribe to realtime inserts
    const channel = supabase
      .channel('waitlist-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waitlist' }, () => {
        setTargetCount((prev) => prev + 1);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
  }, [hasAnimated, targetCount]);

  // After animation, keep displayCount in sync with targetCount changes
  useEffect(() => {
    if (hasAnimated) {
      setDisplayCount(targetCount);
    }
  }, [targetCount, hasAnimated]);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      const validatedEmail = emailSchema.parse(email.trim().toLowerCase());
      const { error } = await supabase.from('waitlist').insert({ email: validatedEmail });
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
          className="text-sm sm:text-base font-bold tracking-[0.35em] text-foreground/80 font-sans"
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
              className="text-8xl sm:text-[120px] lg:text-[150px] font-bold leading-none tracking-tight text-foreground font-sans"
              style={{
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
              className="text-3xl sm:text-5xl lg:text-[60px] font-normal leading-[1.1] font-sans"
            >
              Simplificamos tu{' '}
              <span className="italic text-primary font-accent font-semibold text-4xl sm:text-[55px] lg:text-[65px]">Anerkennung</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed font-normal">
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

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 pb-6 pt-4 space-y-3"
      >
        {/* Social icons */}
        <div className="flex items-center justify-center gap-5">
          <a href="https://x.com/anerfycom" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-foreground transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-foreground transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://instagram.com/anerfycom" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-foreground transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="https://tiktok.com/@anerfycom" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-foreground transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </a>
        </div>

        {/* Legal links */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/40">
          <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          <Link to="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
          <Link to="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
        </div>

        <p className="text-center text-muted-foreground/30 text-[11px]">
          © 2026 ANERFY. Todos los derechos reservados.
        </p>
      </motion.footer>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Check, Shield, Users, TrendingUp, Star } from 'lucide-react';

const painPoints = [
  'Agencias que cobran €5.000+ sin garantías',
  'Información contradictoria en foros y grupos',
  'Procesos opacos que nadie te explica con claridad',
  'Sensación de que estás solo/a en esto',
];

const features = [
  {
    icon: Shield,
    title: 'Transparencia radical',
    desc: 'Sin comisiones ocultas. Sabrás exactamente qué necesitas, cuánto cuesta y cuánto tarda.',
  },
  {
    icon: TrendingUp,
    title: 'Roadmap personalizado',
    desc: 'Un plan paso a paso basado en tu situación real: país, idioma, presupuesto y familia.',
  },
  {
    icon: Users,
    title: 'Comunidad verificada',
    desc: 'Conecta con médicos que ya pasaron por el proceso. Experiencias reales, no marketing.',
  },
];

const stats = [
  { value: '2.400+', label: 'Médicos interesados' },
  { value: '18', label: 'Países representados' },
  { value: '€4.200', label: 'Ahorro promedio vs agencias' },
];

const testimonials = [
  {
    quote: 'Perdí €3.000 con una agencia que no cumplió. Si ANERFY hubiera existido antes, me habría ahorrado meses de frustración.',
    name: 'Dra. Valentina R.',
    country: 'Colombia',
  },
  {
    quote: 'La información que encontré en una hora con el equipo de ANERFY me tomó 6 meses recopilar por mi cuenta.',
    name: 'Dr. Carlos M.',
    country: 'México',
  },
];

export default function WaitlistLanding() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [count] = useState(847);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="bg-foreground text-background">
        <div className="container max-w-3xl py-20 sm:py-28 px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-background block mb-6">ANERFY</span>
            <p className="text-background/40 text-xs sm:text-sm tracking-widest uppercase mb-6">Anerkennung + Simplify</p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Simplificamos tu Anerkennung.
            </h1>
            <p className="text-background/60 text-sm sm:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
              La plataforma que te da el criterio para ejercer medicina en Alemania. Sin comisiones ocultas. Sin intermediarios innecesarios.
            </p>
          </motion.div>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 max-w-md mx-auto"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/30"
                  />
                  <Button type="submit" className="h-12 px-6 bg-background text-foreground hover:bg-background/90 font-semibold shrink-0">
                    Unirme <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <p className="text-background/40 text-xs">
                  Gratis. Sin spam. Acceso anticipado cuando lancemos.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background/10 border border-background/20 rounded-xl p-6 space-y-2"
              >
                <Check className="w-8 h-8 text-background mx-auto" />
                <p className="text-background font-semibold">¡Estás dentro!</p>
                <p className="text-background/60 text-sm">Te avisaremos cuando lancemos. Revisa tu email.</p>
              </motion.div>
            )}
          </motion.div>

          {/* Social proof counter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-background/40 text-xs mt-6"
          >
            {count}+ médicos ya en la lista de espera
          </motion.p>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-xl sm:text-3xl font-bold text-foreground text-center mb-3">
              El problema que nadie te cuenta
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-sm sm:text-base text-center mb-10 max-w-lg mx-auto">
              Miles de médicos latinoamericanos pierden dinero y tiempo porque nadie les da información transparente.
            </motion.p>
          </motion.div>

          <div className="space-y-3">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  ✕
                </span>
                <p className="text-sm sm:text-base text-foreground">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 px-4 bg-muted">
        <div className="container max-w-2xl">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <p className="font-display text-2xl sm:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container max-w-3xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-display text-xl sm:text-3xl font-bold text-foreground text-center mb-12"
          >
            Lo que ANERFY te da
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-foreground mx-auto flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-background" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 px-4 bg-muted">
        <div className="container max-w-2xl space-y-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="font-display text-xl sm:text-3xl font-bold text-foreground text-center mb-8"
          >
            Lo que dicen otros médicos
          </motion.h2>

          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 1}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-foreground italic leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why ANERFY */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-xl sm:text-3xl font-bold text-foreground">
              ¿Por qué ANERFY?
            </motion.h2>
            <motion.div variants={fadeUp} custom={1} className="inline-flex items-center gap-3 bg-muted rounded-full px-6 py-3">
              <span className="font-display font-bold text-foreground text-sm sm:text-base">Aner<span className="text-muted-foreground">kennung</span></span>
              <span className="text-muted-foreground text-lg">+</span>
              <span className="font-display font-bold text-foreground text-sm sm:text-base"><span className="text-muted-foreground">Simpli</span>fy</span>
            </motion.div>
            <motion.p variants={fadeUp} custom={2} className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Nuestro nombre nace de la fusión entre <strong className="text-foreground">Anerkennung</strong> —el proceso de homologación médica en Alemania— y <strong className="text-foreground">Simplify</strong>. Porque creemos que algo tan importante como tu carrera no debería ser un laberinto burocrático.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28 px-4 bg-foreground text-background">
        <div className="container max-w-lg text-center space-y-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-2xl sm:text-4xl font-bold leading-tight">
              No dejes que otros decidan por ti
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-background/60 text-sm sm:text-base mt-4">
              Únete a la lista de espera y sé de los primeros en acceder a ANERFY cuando lancemos.
            </motion.p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/30"
                />
                <Button type="submit" className="h-12 px-6 bg-background text-foreground hover:bg-background/90 font-semibold shrink-0">
                  Unirme
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-background">
                <Check className="w-5 h-5" />
                <span className="font-semibold">¡Ya estás en la lista!</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

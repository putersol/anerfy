import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedicusStore } from '@/stores/medicusStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronDown, Search } from 'lucide-react';
import anerfyLogo from '@/assets/anerfy-logo-dark.png';

const countries = ['México', 'Colombia', 'Argentina', 'Perú', 'Chile', 'Venezuela', 'Ecuador', 'España', 'Otro'];

interface QuestionConfig {
  key: string;
  title: string;
  type: 'radio' | 'select';
  options: string[];
  showCityInput?: boolean;
  infoCondition?: string;
  infoText?: string;
}

const questions: QuestionConfig[] = [
  { key: 'country', title: '¿Dónde obtuviste tu título médico?', type: 'select', options: countries },
  { key: 'anabinStatus', title: '¿Tu universidad está en ANABIN como H+?', type: 'radio', options: ['Sí', 'No', 'No sé'], infoCondition: 'No sé', infoText: 'Verificar en anabin.kmk.org es el primer paso. Ahí podrás comprobar si tu universidad está reconocida.' },
  { key: 'germanLevel', title: '¿Qué nivel de alemán tienes actualmente?', type: 'radio', options: ['Ninguno', 'A1-A2', 'B1-B2', 'C1', 'C2'] },
  { key: 'inGermany', title: '¿Ya estás en Alemania?', type: 'radio', options: ['Sí', 'No'], showCityInput: true },
  { key: 'familyStatus', title: '¿Tienes familia que migrará contigo?', type: 'radio', options: ['Solo/a', 'Pareja', 'Pareja + hijos'] },
  { key: 'budget', title: '¿Cuál es tu presupuesto disponible para el proceso?', type: 'radio', options: ['<3.000€', '3.000-7.000€', '7.000-15.000€', '>15.000€'] },
  { key: 'currentStage', title: '¿En qué etapa del proceso estás?', type: 'radio', options: ['Apenas investigando', 'Preparando documentos', 'Ya solicité Approbation', 'Tengo Berufserlaubnis', 'Preparando FSP', 'Esperando Kenntnisprüfung'] },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const { onboarding, setOnboardingField, completeOnboarding, getEstimatedCost, getEstimatedTime } = useMedicusStore();
  const navigate = useNavigate();

  const currentQ = questions[step];
  const currentValue = onboarding[currentQ.key as keyof typeof onboarding];
  const progress = ((step + 1) / questions.length) * 100;

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setShowSummary(true);
  };

  const handleFinish = () => {
    completeOnboarding();
    navigate('/waitlist');
  };

  if (showSummary) {
    const [costLow, costHigh] = getEstimatedCost();
    const [timeLow, timeHigh] = getEstimatedTime();

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-10"
        >
          <img src={anerfyLogo} alt="Anerfy logo" className="w-8 h-8 brightness-0 invert object-contain scale-[1.6]" />
          <span className="text-sm font-bold tracking-[0.35em] text-foreground/80">ANERFY</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md space-y-8 text-center">
          {/* Check icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-14 h-14 rounded-full bg-primary mx-auto flex items-center justify-center"
          >
            <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">Tu estimación está lista</h2>
            <p className="text-sm text-muted-foreground">Basado en tus respuestas, aquí va un resumen rápido.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/80 border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">Tiempo estimado</p>
              <p className="text-2xl font-bold text-foreground">{timeLow}–{timeHigh}</p>
              <p className="text-xs text-muted-foreground">meses</p>
            </div>
            <div className="bg-secondary/80 border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">Costo estimado</p>
              <p className="text-2xl font-bold text-foreground">€{costLow.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">– €{costHigh.toLocaleString()}</p>
            </div>
          </div>

          {/* CTA - pill style matching waitlist */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleFinish}
              className="w-full h-12 sm:h-13 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-full text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              Unirme a la lista de espera <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-2 pt-8 pb-4"
      >
        <img src={anerfyLogo} alt="Anerfy logo" className="w-8 h-8 brightness-0 invert object-contain scale-[1.6]" />
        <span className="text-sm font-bold tracking-[0.35em] text-foreground/80">ANERFY</span>
      </motion.div>

      {/* Hero - only on first step */}
      {step === 0 && (
        <section className="py-10 sm:py-14 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-foreground">
                Tu criterio para ejercer medicina en{' '}
                <span className="italic text-primary font-accent">Alemania</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
                Responde 7 preguntas y obtén tu estimación personalizada de tiempo y costo.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md space-y-5">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{step + 1} de {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-secondary/60 border border-border rounded-2xl p-5 sm:p-6 space-y-4">
                <h2 className="text-base sm:text-lg font-semibold text-foreground leading-snug">{currentQ.title}</h2>

                {currentQ.type === 'select' ? (
                  <CountryDropdown
                    options={currentQ.options}
                    value={currentValue as string}
                    onChange={(val) => setOnboardingField(currentQ.key as keyof typeof onboarding, val)}
                  />
                ) : (
                  <div className="grid gap-1.5">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setOnboardingField(currentQ.key as keyof typeof onboarding, opt)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                          currentValue === opt
                            ? 'border-primary bg-primary/15 text-foreground font-medium'
                            : 'border-border text-foreground/80 hover:border-primary/30 hover:bg-secondary/80'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {currentQ.showCityInput && currentValue === 'Sí' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                    <input
                      type="text"
                      placeholder="¿En qué ciudad?"
                      value={onboarding.city}
                      onChange={(e) => setOnboardingField('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </motion.div>
                )}

                {currentQ.infoCondition && currentValue === currentQ.infoCondition && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-muted rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
                    {currentQ.infoText}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 h-11 border border-border rounded-full text-sm font-medium text-foreground/80 hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!currentValue}
              className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-1"
            >
              {step === questions.length - 1 ? 'Ver resultados' : 'Siguiente'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

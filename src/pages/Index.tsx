import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedicusStore } from '@/stores/medicusStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <Card className="p-8 shadow-card text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-foreground mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-background" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground">Tu roadmap está listo</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Tiempo estimado</p>
                <p className="text-xl font-semibold text-foreground">{timeLow}–{timeHigh} meses</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Costo estimado</p>
                <p className="text-xl font-semibold text-foreground">€{costLow.toLocaleString()}–€{costHigh.toLocaleString()}</p>
              </div>
            </div>
            <Button onClick={handleFinish} className="w-full h-11">
              Ver mi roadmap <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      {step === 0 && (
        <section className="bg-foreground text-background py-14 sm:py-20 px-4">
          <div className="container max-w-2xl text-center space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Tu criterio para ejercer medicina en Alemania
              </h1>
              <p className="text-background/60 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
                No te decimos qué hacer. Te damos el criterio para decidir por tu cuenta. Responde 7 preguntas y obtén tu plan personalizado.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
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
              <Card className="p-5 sm:p-6 shadow-card space-y-4">
                <h2 className="font-display text-base sm:text-lg font-semibold text-foreground leading-snug">{currentQ.title}</h2>

                <div className="grid gap-1.5">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setOnboardingField(currentQ.key as keyof typeof onboarding, opt)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                        currentValue === opt
                          ? 'border-foreground bg-foreground text-background font-medium'
                          : 'border-border text-foreground hover:border-foreground/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {currentQ.showCityInput && currentValue === 'Sí' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                    <input
                      type="text"
                      placeholder="¿En qué ciudad?"
                      value={onboarding.city}
                      onChange={(e) => setOnboardingField('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    />
                  </motion.div>
                )}

                {currentQ.infoCondition && currentValue === currentQ.infoCondition && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-muted rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
                    {currentQ.infoText}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-11">
                <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!currentValue}
              className="flex-1 h-11"
            >
              {step === questions.length - 1 ? 'Ver resultados' : 'Siguiente'} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

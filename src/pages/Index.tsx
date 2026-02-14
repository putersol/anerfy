import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedicusStore } from '@/stores/medicusStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Stethoscope, CheckCircle2, Globe, BookOpen, MapPin, Users, Wallet, ClipboardList } from 'lucide-react';

const countries = ['México', 'Colombia', 'Argentina', 'Perú', 'Chile', 'Venezuela', 'Ecuador', 'España', 'Otro'];

interface QuestionConfig {
  key: string;
  title: string;
  icon: React.ReactNode;
  type: 'radio' | 'select';
  options: string[];
  showCityInput?: boolean;
  infoCondition?: string;
  infoText?: string;
}

const questions: QuestionConfig[] = [
  { key: 'country', title: '¿Dónde obtuviste tu título médico?', icon: <Globe className="w-6 h-6" />, type: 'select', options: countries },
  { key: 'anabinStatus', title: '¿Tu universidad está en ANABIN como H+?', icon: <BookOpen className="w-6 h-6" />, type: 'radio', options: ['Sí', 'No', 'No sé'], infoCondition: 'No sé', infoText: 'Verificar en anabin.kmk.org es el primer paso. Ahí podrás comprobar si tu universidad está reconocida.' },
  { key: 'germanLevel', title: '¿Qué nivel de alemán tienes actualmente?', icon: <BookOpen className="w-6 h-6" />, type: 'radio', options: ['Ninguno', 'A1-A2', 'B1-B2', 'C1', 'C2'] },
  { key: 'inGermany', title: '¿Ya estás en Alemania?', icon: <MapPin className="w-6 h-6" />, type: 'radio', options: ['Sí', 'No'], showCityInput: true },
  { key: 'familyStatus', title: '¿Tienes familia que migrará contigo?', icon: <Users className="w-6 h-6" />, type: 'radio', options: ['Solo/a', 'Pareja', 'Pareja + hijos'] },
  { key: 'budget', title: '¿Cuál es tu presupuesto disponible para el proceso?', icon: <Wallet className="w-6 h-6" />, type: 'radio', options: ['<3.000€', '3.000-7.000€', '7.000-15.000€', '>15.000€'] },
  { key: 'currentStage', title: '¿En qué etapa del proceso estás?', icon: <ClipboardList className="w-6 h-6" />, type: 'radio', options: ['Apenas investigando', 'Preparando documentos', 'Ya solicité Approbation', 'Tengo Berufserlaubnis', 'Preparando FSP', 'Esperando Kenntnisprüfung'] },
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
    navigate('/roadmap');
  };

  if (showSummary) {
    const [costLow, costHigh] = getEstimatedCost();
    const [timeLow, timeHigh] = getEstimatedTime();

    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
          <Card className="p-8 shadow-card text-center space-y-6">
            <div className="w-16 h-16 rounded-full gradient-success mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">¡Tu roadmap personalizado está listo!</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Tiempo estimado</p>
                <p className="text-2xl font-bold text-foreground">{timeLow}-{timeHigh} meses</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Costo estimado</p>
                <p className="text-2xl font-bold text-foreground">€{costLow.toLocaleString()}-€{costHigh.toLocaleString()}</p>
              </div>
            </div>
            <Button onClick={handleFinish} className="w-full gradient-primary text-primary-foreground hover:opacity-90 h-12 text-base">
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
        <section className="gradient-hero text-primary-foreground py-16 px-4">
          <div className="container max-w-3xl text-center space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 mx-auto flex items-center justify-center mb-6">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Tu roadmap completo para ejercer medicina en Alemania
              </h1>
              <p className="text-primary-foreground/80 text-lg mt-4 max-w-xl mx-auto">
                Responde 7 preguntas y obtén un plan personalizado con costos, tiempos y recursos para tu Approbation.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pregunta {step + 1} de {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-6 shadow-card space-y-5">
                <div className="flex items-center gap-3 text-primary">
                  {currentQ.icon}
                  <h2 className="font-display text-lg font-semibold text-foreground">{currentQ.title}</h2>
                </div>

                {currentQ.type === 'select' ? (
                  <div className="grid gap-2">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setOnboardingField(currentQ.key as keyof typeof onboarding, opt)}
                        className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          currentValue === opt
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-foreground hover:border-primary/40 hover:bg-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setOnboardingField(currentQ.key as keyof typeof onboarding, opt)}
                        className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          currentValue === opt
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-foreground hover:border-primary/40 hover:bg-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Conditional city input */}
                {currentQ.showCityInput && currentValue === 'Sí' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                    <input
                      type="text"
                      placeholder="¿En qué ciudad?"
                      value={onboarding.city}
                      onChange={(e) => setOnboardingField('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </motion.div>
                )}

                {/* Info box */}
                {currentQ.infoCondition && currentValue === currentQ.infoCondition && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-info/5 border border-info/20 rounded-lg p-4 text-sm text-foreground">
                    💡 {currentQ.infoText}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12">
                <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!currentValue}
              className="flex-1 h-12 gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {step === questions.length - 1 ? 'Ver resultados' : 'Siguiente'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

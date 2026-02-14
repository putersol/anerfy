import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OnboardingData {
  country: string;
  anabinStatus: string;
  germanLevel: string;
  inGermany: string;
  city: string;
  familyStatus: string;
  budget: string;
  currentStage: string;
}

export interface RoadmapState {
  checkedTasks: Record<string, boolean>;
}

interface MedicusStore {
  onboarding: OnboardingData;
  onboardingCompleted: boolean;
  roadmap: RoadmapState;
  setOnboardingField: (field: keyof OnboardingData, value: string) => void;
  completeOnboarding: () => void;
  toggleTask: (taskId: string) => void;
  getEstimatedCost: () => [number, number];
  getEstimatedTime: () => [number, number];
  getOverallProgress: () => number;
}

const defaultOnboarding: OnboardingData = {
  country: '',
  anabinStatus: '',
  germanLevel: '',
  inGermany: '',
  city: '',
  familyStatus: '',
  budget: '',
  currentStage: '',
};

export const allTasks: Record<string, string[]> = {
  phase1: ['Verificación ANABIN', 'Recopilar documentos', 'Apostillar documentos', 'Traducir al alemán por traductor jurado', 'Elegir Bundesland estratégicamente'],
  phase2: ['Alemán general hasta B2/C1', 'Alemán médico específico', 'Simulaciones FSP', 'Práctica con paciente simulado'],
  phase3: ['Enviar documentación completa', 'Pagar tasas administrativas', 'Esperar evaluación inicial', 'Responder a solicitudes adicionales'],
  phase4: ['Preparación estructurada (3-6 meses)', 'Simulaciones examen real', 'Anamnesis práctica', 'Documentación médica escrita', 'Comunicación con colega'],
  phase5: ['Evaluación formación', 'Estudiar medicina interna', 'Estudiar cirugía', 'Estudiar urgencias', 'Casos clínicos prácticos'],
  phase6: ['Solicitar licencia temporal', 'Trabajar bajo supervisión', 'Ganar experiencia'],
  phase7: ['Recibir licencia definitiva', 'Ejercer en toda Alemania', 'Planificar Weiterbildung'],
  phase8: ['Revisar primer contrato médico', 'Optimizar Steuerklasse', 'Configurar Versorgungswerk', 'Contratar Berufsunfähigkeit', 'Planificar pensión complementaria'],
};

const totalTaskCount = Object.values(allTasks).flat().length;

export const useMedicusStore = create<MedicusStore>()(
  persist(
    (set, get) => ({
      onboarding: defaultOnboarding,
      onboardingCompleted: false,
      roadmap: { checkedTasks: {} },

      setOnboardingField: (field, value) =>
        set((s) => ({ onboarding: { ...s.onboarding, [field]: value } })),

      completeOnboarding: () => set({ onboardingCompleted: true }),

      toggleTask: (taskId) =>
        set((s) => ({
          roadmap: {
            checkedTasks: {
              ...s.roadmap.checkedTasks,
              [taskId]: !s.roadmap.checkedTasks[taskId],
            },
          },
        })),

      getEstimatedCost: () => {
        const d = get().onboarding;
        let low = 5000, high = 6800;
        if (d.anabinStatus === 'No') { low += 1400; high += 1400; }
        if (d.familyStatus === 'Pareja') { low += 2000; high += 2000; }
        if (d.familyStatus === 'Pareja + hijos') { low += 4000; high += 4000; }
        if (d.germanLevel === 'Ninguno' || d.germanLevel === 'A1-A2') { low += 1000; high += 1500; }
        return [low, high];
      },

      getEstimatedTime: () => {
        const d = get().onboarding;
        let base = 10;
        if (d.germanLevel === 'C1' || d.germanLevel === 'C2') base -= 2;
        if (d.anabinStatus === 'Sí') base -= 1;
        return [Math.max(base - 1, 6), base + 3];
      },

      getOverallProgress: () => {
        const checked = Object.values(get().roadmap.checkedTasks).filter(Boolean).length;
        return Math.round((checked / totalTaskCount) * 100);
      },
    }),
    { name: 'medicus_store' }
  )
);

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { DashboardScores } from '@/lib/dashboardScoring';
import { DOCUMENT_NAMES } from '@/pages/diagnostico/schema';

interface Props {
  submission: any;
  scores: DashboardScores;
}

const DOC_DESCRIPTIONS: Record<number, string> = {
  0: 'Tu diploma universitario con apostilla de La Haya. Obligatorio para iniciar la homologación ante el Landesprüfungsamt.',
  1: 'Récord académico oficial con apostilla. Muestra las materias y horas clínicas cursadas — lo comparan con el estándar alemán.',
  2: 'Plan de estudios detallado con apostilla. Permite al Gutachter evaluar equivalencia de tu formación con la alemana.',
  3: 'Certificado del colegio médico de tu país confirmando que estás habilitado para ejercer sin sanciones.',
  4: 'Registro penal limpio, requerido para la visa y para el registro profesional en Alemania.',
  5: 'Certificado médico que acredita aptitud física y mental para ejercer medicina.',
  6: 'CV en formato europeo y en alemán. Necesario para postularte a hospitales y para el expediente de visa.',
  7: 'Acta de nacimiento con apostilla. Documento de identidad básico para todos los trámites.',
  8: 'Pasaporte con mínimo 6 meses de vigencia. Indispensable para visa y viaje.',
};

const STATUS_CONFIG = {
  tengo: { icon: CheckCircle2, label: 'Listo', colorClass: 'text-success', bgClass: 'bg-success/5 border-success/10' },
  en_proceso: { icon: Clock, label: 'En proceso', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/5 border-amber-500/10' },
  no_tengo: { icon: XCircle, label: 'Pendiente', colorClass: 'text-destructive', bgClass: 'bg-destructive/5 border-destructive/10' },
};

const SlideDocumentos = forwardRef<HTMLDivElement, Props>(({ submission, scores }, ref) => {
  const docs = (submission.documentos || {}) as Record<string, string>;

  const docItems = DOCUMENT_NAMES.map((name, i) => {
    const key = `doc_${i}`;
    const status = (docs[key] || 'no_tengo') as keyof typeof STATUS_CONFIG;
    return { name, status, description: DOC_DESCRIPTIONS[i] || '' };
  });

  const readyCount = docItems.filter(d => d.status === 'tengo').length;
  const pendingCount = docItems.filter(d => d.status === 'no_tengo').length;
  const inProgressCount = docItems.filter(d => d.status === 'en_proceso').length;

  return (
    <div ref={ref} className="h-full flex flex-col justify-start px-8 sm:px-16 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 mb-1"
      >
        <FileText className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-medium text-foreground">Expediente Documental</h2>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-muted-foreground mb-6"
      >
        Estado actual de tu documentación — {readyCount} de {DOCUMENT_NAMES.length} listos
        {inProgressCount > 0 && `, ${inProgressCount} en proceso`}
        {pendingCount > 0 && `, ${pendingCount} pendientes`}
      </motion.p>

      {/* Summary badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-3 mb-6"
      >
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success">
          ✓ {readyCount} listos
        </span>
        {inProgressCount > 0 && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500">
            ◷ {inProgressCount} en proceso
          </span>
        )}
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">
          ✗ {pendingCount} pendientes
        </span>
      </motion.div>

      {/* Document list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {docItems.map((doc, i) => {
          const config = STATUS_CONFIG[doc.status];
          const Icon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${config.bgClass}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.colorClass}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground">{doc.name}</span>
                  <span className={`text-[10px] font-semibold uppercase ${config.colorClass}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{doc.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

SlideDocumentos.displayName = 'SlideDocumentos';
export default SlideDocumentos;

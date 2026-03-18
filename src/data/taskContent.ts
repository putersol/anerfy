export interface TaskDetail {
  description: string;
  tips: string[];
  estimatedTime?: string;
  estimatedCost?: string;
  resources?: { label: string; url: string }[];
}

type TaskContentMap = Record<string, Record<number, TaskDetail>>;

export const taskContent: TaskContentMap = {
  // PHASE 1: Documentación
  phase1: {
    0: {
      description: 'Verifica si tu universidad está registrada en la base de datos ANABIN como H+ (reconocida).',
      tips: [
        'Busca tu universidad en anabin.kmk.org → Institutionen',
        'Si aparece como H+, tu título es reconocido directamente',
        'Si aparece como H+/- o H-, necesitarás evaluación individual',
        'Si no aparece, contacta a la ZAB para una evaluación'
      ],
      estimatedTime: '1-2 días',
      resources: [
        { label: 'ANABIN Database', url: 'https://anabin.kmk.org/anabin.html' },
        { label: 'ZAB - Evaluación de títulos', url: 'https://www.kmk.org/zab/central-office-for-foreign-education.html' }
      ]
    },
    1: {
      description: 'Reúne todos los documentos necesarios: diploma, calificaciones, pasaporte, certificado de nacimiento.',
      tips: [
        'Solicita copias certificadas de tu título universitario',
        'Incluye el pensum académico completo con horas por materia',
        'Prepara certificado de antecedentes penales de tu país',
        'Ten a mano certificado médico de aptitud profesional'
      ],
      estimatedTime: '2-4 semanas',
      estimatedCost: '€100-€300'
    },
    2: {
      description: 'Apostilla todos los documentos oficiales en tu país de origen según el Convenio de La Haya.',
      tips: [
        'La apostilla se tramita en el Ministerio de Relaciones Exteriores de tu país',
        'Cada documento original necesita su propia apostilla',
        'Algunos países permiten hacerlo online (ej: Colombia, México)',
        'No apostilles copias — solo documentos originales'
      ],
      estimatedTime: '1-3 semanas',
      estimatedCost: '€50-€200'
    },
    3: {
      description: 'Traduce todos los documentos al alemán por un traductor jurado (beeidigter Übersetzer).',
      tips: [
        'Solo traducciones de traductores jurados son aceptadas',
        'Puedes buscar traductores en justiz-dolmetscher.de',
        'Algunos traductores en tu país de origen son más económicos',
        'Pide presupuesto para todos los documentos juntos — suele haber descuento'
      ],
      estimatedTime: '1-2 semanas',
      estimatedCost: '€300-€800',
      resources: [
        { label: 'Buscador de traductores jurados', url: 'https://www.justiz-dolmetscher.de/' }
      ]
    },
    4: {
      description: 'Elige estratégicamente el Bundesland donde solicitarás tu reconocimiento.',
      tips: [
        'Cada Bundesland tiene tiempos de procesamiento diferentes',
        'Sachsen, Brandenburg y Mecklenburg-Vorpommern suelen ser más rápidos',
        'Baviera y NRW tienen más demanda → tiempos más largos',
        'El costo de vida varía mucho: Munich vs. Leipzig puede ser 40% de diferencia',
        'Investiga la comunidad latina en la ciudad que elijas'
      ],
      estimatedTime: '1 semana de investigación'
    }
  },

  // PHASE 2: Idioma Alemán
  phase2: {
    0: {
      description: 'Alcanza nivel B2/C1 de alemán general. Es la base para todo lo demás.',
      tips: [
        'B2 es el mínimo para empezar trámites en muchos Bundesländer',
        'C1 te da ventaja en la FSP y en el trabajo diario',
        'Combina curso presencial + apps (Anki, Deutsche Welle)',
        'Practica con nativos: Tandem, HelloTalk, eventos locales',
        'Si estás en tu país: Goethe-Institut o cursos online intensivos'
      ],
      estimatedTime: '6-18 meses',
      estimatedCost: '€1.000-€3.000',
      resources: [
        { label: 'Deutsche Welle - Curso gratuito', url: 'https://learngerman.dw.com/' },
        { label: 'Goethe-Institut', url: 'https://www.goethe.de/' }
      ]
    },
    1: {
      description: 'Domina el alemán médico específico: terminología, anamnesis, documentación clínica.',
      tips: [
        'Aprende vocabulario por especialidad: cirugía, interna, urgencias',
        'Practica la Anamnese (historia clínica) hasta que sea automática',
        'Estudia Arztbrief (carta médica) — estructura y frases estándar',
        'El libro "Deutsch für Ärztinnen und Ärzte" de Elsevier es excelente'
      ],
      estimatedTime: '2-4 meses',
      estimatedCost: '€200-€500'
    },
    2: {
      description: 'Practica simulaciones de la FSP con casos reales y feedback.',
      tips: [
        'La FSP tiene 3 partes: Anamnese, Arztbrief, Arzt-Arzt-Gespräch',
        'Busca grupos de preparación online o presenciales',
        'Graba tus simulaciones y revísalas',
        'Practica con timer — la FSP tiene tiempos estrictos'
      ],
      estimatedTime: '1-3 meses'
    },
    3: {
      description: 'Practica conversaciones con paciente simulado hasta que fluya naturalmente.',
      tips: [
        'Enfócate en empatía + estructura: saludo → motivo → anamnesis → exploración',
        'Practica explicar diagnósticos en lenguaje simple (B1 del paciente)',
        'Aprende a manejar pacientes difíciles: ansiosos, que no hablan bien alemán',
        'El examinador evalúa tanto el alemán como la competencia médica'
      ],
      estimatedTime: '1-2 meses'
    }
  },

  // PHASE 3: Solicitud
  phase3: {
    0: {
      description: 'Envía tu expediente completo a la autoridad competente del Bundesland elegido.',
      tips: [
        'Verifica que tienes TODOS los documentos requeridos antes de enviar',
        'Envía por correo certificado (Einschreiben mit Rückschein)',
        'Guarda copias de absolutamente todo',
        'Incluye una carta de presentación en alemán explicando tu solicitud'
      ],
      estimatedTime: '1 día de preparación'
    },
    1: {
      description: 'Paga las tasas administrativas del proceso de reconocimiento.',
      tips: [
        'Las tasas varían por Bundesland: €100-€600',
        'Algunas autoridades permiten pago a plazos',
        'Guarda todos los comprobantes de pago',
        'Este costo es independiente del resultado'
      ],
      estimatedCost: '€100-€600'
    },
    2: {
      description: 'Espera la evaluación inicial de tu expediente por la Bezirksregierung.',
      tips: [
        'Tiempos típicos: 2-6 meses dependiendo del Bundesland',
        'Puedes llamar para preguntar el estado después de 8 semanas',
        'No envíes documentos adicionales sin que te los pidan',
        'Usa este tiempo para seguir mejorando tu alemán'
      ],
      estimatedTime: '2-6 meses'
    },
    3: {
      description: 'Responde a cualquier solicitud adicional de documentación de la autoridad.',
      tips: [
        'Responde lo más rápido posible — los plazos suelen ser de 4 semanas',
        'Si piden documentos de tu país, coordina con anticipación',
        'Si no entiendes algo, pide aclaración por escrito',
        'Cada retraso en responder suma semanas al proceso total'
      ]
    }
  },

  // PHASE 4: FSP Exam
  phase4: {
    0: {
      description: 'Estructura tu preparación: 3-6 meses antes del examen, con plan semanal.',
      tips: [
        'Dedica mínimo 2 horas diarias a la preparación',
        'Divide: 40% anamnesis, 30% Arztbrief, 30% Arzt-Arzt-Gespräch',
        'Únete a un grupo de estudio — la preparación en grupo es más efectiva',
        'Si puedes, haz una rotación en un hospital antes del examen'
      ],
      estimatedTime: '3-6 meses'
    },
    1: {
      description: 'Realiza simulaciones completas del examen con condiciones reales.',
      tips: [
        'Simula el examen completo con timer',
        'Pide feedback de médicos alemanes o de latinos que ya aprobaron',
        'Practica en un consultorio o sala de hospital si es posible',
        'Graba tus simulaciones para auto-evaluarte'
      ]
    },
    2: {
      description: 'Perfecciona la toma de anamnesis en alemán médico.',
      tips: [
        'Estructura: datos personales → motivo de consulta → historia actual → antecedentes',
        'Memoriza las preguntas clave por sistema (cardiovascular, respiratorio, etc.)',
        'Practica la documentación escrita de la anamnesis',
        'Importante: escucha activa + preguntas abiertas primero, cerradas después'
      ]
    },
    3: {
      description: 'Domina la redacción de documentación médica (Arztbrief).',
      tips: [
        'Estructura estándar: Anrede → Diagnosen → Anamnese → Befund → Therapie → Prozedere',
        'Usa abreviaciones médicas alemanas estándar',
        'Practica con casos de medicina interna (los más comunes en el examen)',
        'El Arztbrief debe ser claro, conciso y profesional'
      ]
    },
    4: {
      description: 'Practica la comunicación profesional médico-médico (Arzt-Arzt-Gespräch).',
      tips: [
        'Simula presentación de caso a un colega/superior',
        'Practica dar y recibir instrucciones clínicas',
        'Aprende a discutir diagnóstico diferencial en alemán',
        'Incluye aspectos de trabajo en equipo y coordinación'
      ]
    }
  },

  // PHASE 5: Kenntnisprüfung
  phase5: {
    0: {
      description: 'Evaluación de tu formación médica por la autoridad competente.',
      tips: [
        'La decisión entre KP y Gleichwertigkeitsprüfung la toma la autoridad',
        'Si te asignan KP, es un examen práctico-oral de medicina',
        'Prepárate para que evalúen tus conocimientos clínicos alemanes',
        'Averigua el formato exacto en tu Bundesland — varía'
      ]
    },
    1: {
      description: 'Estudio intensivo de medicina interna según estándares alemanes.',
      tips: [
        'Usa el Herold (libro de referencia para medicina interna en Alemania)',
        'Enfócate en: cardiología, neumología, gastroenterología, endocrinología',
        'Estudia las guías alemanas (Leitlinien) de las patologías más comunes',
        'Practica el razonamiento clínico al estilo alemán'
      ],
      resources: [
        { label: 'AMBOSS - Plataforma médica', url: 'https://www.amboss.com/de' },
        { label: 'AWMF Leitlinien', url: 'https://www.awmf.org/leitlinien.html' }
      ]
    },
    2: {
      description: 'Estudio de cirugía general y urgencias quirúrgicas.',
      tips: [
        'Enfócate en indicaciones quirúrgicas, no en técnicas operatorias',
        'Estudia: apendicitis, hernias, colecistitis, fracturas comunes',
        'Aprende el manejo perioperatorio según protocolos alemanes',
        'Conoce las diferencias con protocolos de tu país'
      ]
    },
    3: {
      description: 'Preparación en medicina de urgencias (Notfallmedizin).',
      tips: [
        'ABCDE approach es estándar en Alemania',
        'Estudia: infarto, ACV, politrauma, sepsis, anafilaxia',
        'Conoce los algoritmos de reanimación (ERC guidelines)',
        'Practica la toma de decisiones bajo presión (tiempo limitado)'
      ]
    },
    4: {
      description: 'Práctica con casos clínicos reales para el examen.',
      tips: [
        'Practica presentación de casos con diagnóstico diferencial',
        'Trabaja con casos de las 3 áreas: interna, cirugía, urgencias',
        'Simula el examen oral con un médico alemán si es posible',
        'Prepara 2-3 casos por especialidad que domines perfectamente'
      ]
    }
  },

  // PHASE 6: Berufserlaubnis
  phase6: {
    0: {
      description: 'Solicita tu licencia temporal (Berufserlaubnis) para empezar a trabajar.',
      tips: [
        'La Berufserlaubnis te permite trabajar bajo supervisión',
        'Es válida generalmente por 2 años, renovable',
        'Necesitas: FSP aprobada + documentos completos + contrato de trabajo',
        'Algunos Bundesländer la otorgan antes de la KP'
      ],
      estimatedTime: '2-8 semanas'
    },
    1: {
      description: 'Comienza a trabajar como Assistenzarzt bajo supervisión de un Facharzt.',
      tips: [
        'Tu primer contrato será como Assistenzarzt (médico residente)',
        'Salario inicial según TV-Ärzte: ~€5.000-€5.500 bruto/mes',
        'Trabaja en un hospital que apoye tu proceso de homologación',
        'Aprovecha para mejorar tu alemán médico en la práctica diaria'
      ]
    },
    2: {
      description: 'Acumula experiencia clínica documentada para tu expediente.',
      tips: [
        'Cada rotación suma a tu CV profesional alemán',
        'Documenta procedimientos, casos atendidos, formaciones',
        'Pide cartas de recomendación de tus supervisores',
        'Esta experiencia cuenta para tu futura Weiterbildung (especialización)'
      ]
    }
  },

  // PHASE 7: Approbation
  phase7: {
    0: {
      description: '¡Recibe tu licencia médica definitiva! Puedes ejercer sin restricciones en toda Alemania.',
      tips: [
        'La Approbation es el resultado de aprobar la KP + completar requisitos',
        'Con ella puedes trabajar en cualquier Bundesland sin restricción',
        'Puedes abrir tu propia consulta (Praxis) si lo deseas',
        '¡Celebra! Llegaste donde muchos abandonaron'
      ]
    },
    1: {
      description: 'Ejerce libremente en toda Alemania como médico licenciado.',
      tips: [
        'Actualiza tu CV con la Approbation',
        'Regístrate en la Ärztekammer de tu Bundesland',
        'Considera tu especialización (Facharzt) — dura 5-6 años',
        'Tu salario sube significativamente con la Approbation'
      ]
    },
    2: {
      description: 'Planifica tu Weiterbildung (especialización médica) en Alemania.',
      tips: [
        'Elige especialización según demanda + interés personal',
        'Allgemeinmedizin (medicina general): alta demanda, buen balance vida-trabajo',
        'Especialidades quirúrgicas: más competitivas pero mejor pagadas',
        'Busca hospitales con Weiterbildungsermächtigung completa'
      ]
    }
  },

  // PHASE 8: Finanzas
  phase8: {
    0: {
      description: 'Revisa y optimiza tu primer contrato de trabajo médico.',
      tips: [
        'Verifica que el salario corresponda al TV-Ärzte/VKA o TV-Ärzte/TdL',
        'Negocia: reembolso de mudanza, días de formación, guardias',
        'Entiende tu nómina: bruto vs. neto, Steuerklasse, Kirchensteuer',
        'Si eres soltero sin hijos: Steuerklasse I es automática'
      ]
    },
    1: {
      description: 'Optimiza tu clase fiscal (Steuerklasse) según tu situación.',
      tips: [
        'Si te casas: evaluar III/V vs. IV/IV vs. IV con Faktor',
        'Steuerklasse III+V: más neto mensual para el que gana más',
        'Steuerklasse IV+IV: equitativo pero puede resultar en Nachzahlung',
        'Cambio de Steuerklasse es gratuito y se hace en el Finanzamt'
      ]
    },
    2: {
      description: 'Configura tu Versorgungswerk (pensión profesional para médicos).',
      tips: [
        'Como médico, te liberas de la Deutsche Rentenversicherung',
        'El Versorgungswerk suele dar mejores prestaciones',
        'Inscríbete a través de la Ärztekammer de tu Bundesland',
        'Contribución: ~18% de tu ingreso bruto'
      ]
    },
    3: {
      description: 'Contrata un Berufsunfähigkeitsversicherung (seguro de incapacidad laboral).',
      tips: [
        'Como médico, tu capacidad de trabajar ES tu capital',
        'Contrata lo antes posible — más joven = más barato',
        'Busca pólizas con "abstrakte Verweisung" (no te pueden reasignar)',
        'Costo típico: €100-€200/mes para cobertura de €3.000/mes'
      ]
    },
    4: {
      description: 'Planifica tu pensión complementaria e inversiones a largo plazo.',
      tips: [
        'ETFs globales (MSCI World/All-World) como base de inversión',
        'BasisRente/Rürup: deducible fiscalmente como autónomo/médico',
        'Evalúa inversión inmobiliaria: Alemania permite deducir intereses y depreciación',
        'Regla general: invierte mínimo 15-20% de tu neto mensual'
      ]
    }
  }
};

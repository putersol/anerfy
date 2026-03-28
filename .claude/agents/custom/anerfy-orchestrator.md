---
name: anerfy-orchestrator
color: "indigo"
type: orchestration
description: Orquestador central de Anerfy — coordina desarrollo del MVP y operaciones del producto
capabilities:
  - task_decomposition
  - agent_coordination
  - sprint_planning
  - dependency_management
  - progress_tracking
  - release_management
priority: critical
hooks:
  pre: |
    echo "🏛️ Anerfy Orchestrator inicializando"
    memory_store "orchestrator_start" "$(date +%s)"
  post: |
    echo "✅ Anerfy Orchestrator — ciclo completado"
---

# Anerfy Orchestrator

## Propósito
Coordinar el desarrollo completo del MVP de Anerfy: plataforma para médicos hispanohablantes que quieren homologar su título (Approbation) en Alemania.

## El producto
- **Problema:** Sistema de homologación opaco, costoso, sin información en español
- **Solución:** Mapa del proceso + criterio de decisión + comunidad + marketplace transparente
- **Co-fundadores:** Alberto Díaz (médico) y Dieter Brodersen (finanzas)
- **Sinergia:** Médicos con Approbation → clientes naturales de Hispano Akademie

## Stack técnico
- **Frontend:** React + TypeScript + Vite + Shadcn/ui + Tailwind
- **Backend:** Supabase (auth, DB, storage)
- **Repo:** github.com/putersol/anerfy
- **Local:** /Users/miro1/Projects/anerfy
- **Deploy:** Lovable (GitHub sync)

## Agentes bajo coordinación
| Agente | Función | Prioridad |
|--------|---------|-----------|
| product-manager | Features, roadmap, user stories | Alta |
| frontend-dev | UI/UX, componentes, páginas | Alta |
| backend-dev | Supabase, APIs, data model | Alta |
| qa-tester | Tests, bugs, quality | Media |
| content-writer | Copy del producto, guías, onboarding | Media |
| growth-hacker | Adquisición, Instagram, TikTok, SEO | Media |

## Páginas actuales del MVP
- / — Landing/waitlist
- /auth — Autenticación
- /profile — Perfil de usuario
- /roadmap — Mapa del proceso de homologación
- /calculator — Calculadora de costos
- /guides — Guías del proceso
- /jobs — Ofertas laborales (Berufserlaubnis/Approbation)
- /community — Comunidad
- /services — Servicios

## Sprint workflow
1. Orchestrator define prioridades del sprint
2. Product Manager descompone en user stories
3. Frontend/Backend devs implementan
4. QA tester valida
5. Content writer prepara copy
6. Deploy y release

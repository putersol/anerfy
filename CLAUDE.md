# ANERFY — CONTEXTO DE PRODUCTO (leer primero, aplica a TODO dev futuro)

**Qué es:** plataforma para médicos hispanohablantes que homologan su título y ejercen en Alemania. Fundadores: Dieter Brodersen & Alberto Díaz. Contacto: info@anerfy.com. Repo: github.com/putersol/anerfy · local `/Users/miro1/Projects/anerfy`.

**Stack:** React + Vite + TypeScript + Tailwind + shadcn/ui + framer-motion. Backend Supabase (DB + Edge Functions en Deno). Proyecto generado/gestionado en **Lovable**. Pagos: **Stripe**. Booking: **Cal.com**. Emails transaccionales propios.

## 🚫 Reglas duras (NO romper nunca)
- **NUNCA deployar / push / merge / Publish a producción sin aprobación explícita por cambio.** Trabajar siempre en rama, dejar preview, esperar OK del Patrón (Dieter). Esto es ley.
- **La UI nunca dice "gratis".** El precio es premium aunque hoy el flujo no cobre todavía.
- **Precio = TBD** hasta que el Patrón lo fije. Manejar el precio como variable única.
- **Idioma de cara al usuario: español.**
- No commitear secrets ni `.env`.

## Arquitectura del funnel (la cara comercial del producto)
`Landing (/asesoria) → Lead magnet 7 preguntas → resultado parcial (Anerfy Score preliminar) → Paywall Stripe → Diagnóstico completo (/diagnostico/:token) → roadmap + sesión 1:1 (Cal.com)`

**Lo que ya existe y NO se duplica (conectarse):**
- `supabase/functions/stripe-webhook`: en `checkout.session.completed` registra pago → genera `diagnostic_token` (30d) → manda email con `anerfy.com/diagnostico/{token}`.
- `/diagnostico/:token` (`DiagnosticoGated`) desbloquea el form completo con token válido.
- `/empezar` (`Empezar.tsx`): captura email → `diagnostic_tokens`. Flujo "free" actual hasta enchufar Stripe.
- Preguntas/constantes del diagnóstico en `src/pages/diagnostico/questions.ts` (COUNTRIES, SPECIALTIES) y `schema.ts` (BUNDESLAENDER, GERMAN_LEVELS) — **reutilizar**, no redefinir.

**Convenciones front:**
- Páginas full-screen de marketing (Empezar, WaitlistLanding, **Asesoria**) van en las rutas **públicas** de `App.tsx` (sin `Layout`/`ProfileSync`), traen su propio `FloatingShapes`.
- Design tokens en `src/index.css` (tema oscuro, primary azul `220 80% 48%`, fuente Geist + Spectral acento). Usar componentes de `src/components/ui/*`.
- Tras editar: `npx tsc --noEmit -p tsconfig.app.json` (ojo: `Admin.tsx` tiene un error de tipos PREEXISTENTE no relacionado; ignorarlo). `npm run dev` sirve en :8080.

## Estado actual del build (jun-2026)
- Rama: **`feat/pagina-ventas-asesoria`** (sin commit/deploy).
- Hecho: `/asesoria` (landing completa del docx + simulador de salario neto + sección webinars), lead magnet 7-preg con Anerfy Score preliminar + link a anabin (anabin.kmk.org), paywall, y edge function **`create-checkout-session`** lista.
- **Bloqueante para cobro real:** falta `STRIPE_PRICE_ID` (+ `SITE_URL`) en Supabase Secrets. Sin él, el botón del paywall cae a `/empezar` sin mencionar precio; al ponerlo, el mismo botón cobra automáticamente.
- Defaults tomados (corregibles por Patrón): resultado parcial gratis → paywall; filtrado suave.
- Pendientes de contenido: guion VSL (caja "próximamente"), sección "Quién está detrás" (médicos+financieros+abogados, hoy solo en el guion), historia del fundador.

## Workflow de revisión
- Preview móvil = túnel `cloudflared tunnel --url http://localhost:8080` (no toca producción). Mandar link al Patrón.
- Feedback de **Alberto Díaz** (albertodiaz2184@gmail.com) se pide por mail desde miroassist@icloud.com y se implementa directo.

---

# Claude Code Configuration - RuFlo V3

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/ruvnet/claude-flow
- Issues: https://github.com/ruvnet/claude-flow/issues

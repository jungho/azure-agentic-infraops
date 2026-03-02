# Context Optimization — Implementation Plan

**Created**: 2026-03-02
**Source Report**: `agent-output/_meta/11-context-optimization-report.md`
**Baseline Snapshot**: `ctx-opt-20260302-130935`
**Implementation Branch**: `ctx-opt/implement-recommendations`
**Parent Branch**: `main`

---

## Strategy

All changes are implemented on a dedicated branch (`ctx-opt/implement-recommendations`) branched from `main`. Each wave is a discrete commit (or small group of commits) that can be validated independently. After all waves are complete, a before/after diff report is generated using the baseline snapshot.

### Testing Protocol

1. **Pre-flight**: Run `npm run validate:all` on `main` — record pass/fail baseline
2. **Per-wave**: After each wave's commits, run `npm run validate:all` + manual spot-check of affected agents/skills
3. **Post-implementation**: Run `npm run diff:baseline -- --baseline ctx-opt-20260302-130935` to generate the full diff report
4. **Functional test**: Invoke the Conductor agent on a sample project to verify the 7-step workflow still works end-to-end with optimized context
5. **Merge**: PR from `ctx-opt/implement-recommendations` → `main` with diff report attached

### Validation Commands

```bash
npm run validate:all              # Full suite
npm run lint:skills-format        # Skill file structure (critical for skill splits)
npm run lint:agent-frontmatter    # Agent frontmatter after body edits
npm run lint:artifact-templates   # Artifact template compliance
npm run lint:h2-sync              # H2 heading sync
npm run lint:governance-refs      # Governance reference validation
```

---

## Wave 0 — Branch Setup & Baseline Validation

**Effort**: 5 min | **Risk**: None

| #   | Task              | Details                                                                              |
| --- | ----------------- | ------------------------------------------------------------------------------------ |
| 0.1 | Create branch     | `git checkout main && git pull && git checkout -b ctx-opt/implement-recommendations` |
| 0.2 | Validate baseline | `npm run validate:all` — record output for comparison                                |
| 0.3 | Tag start point   | `git tag ctx-opt-impl-start`                                                         |

---

## Wave 1 — P0: Critical Skill Splits (C1, C2)

**Effort**: Medium (~2-3 hours) | **Impact**: ~93,000 tokens/workflow | **Risk**: Medium — agents reference skill by path

These two skills are loaded by virtually every agent. Splitting them yields the single largest improvement.

### 1.1 — Split `azure-defaults/SKILL.md` (C1)

**Finding**: 701 lines loaded by 10+ agents, ~4,500 tokens × ~15 invocations = ~67,500 tokens/workflow

| Step | Action                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Create `references/` subdirectory under `.github/skills/azure-defaults/`                                                                   |
| 2    | Create `references/service-matrices.md` — move detailed service capability tables                                                          |
| 3    | Create `references/pricing-guidance.md` — move pricing tiers, calculator links, estimation methodology                                     |
| 4    | Create `references/security-baseline-full.md` — move full security checklist (keep 5-line summary in SKILL.md)                             |
| 5    | Create `references/naming-full-examples.md` — move extended naming examples (keep CAF abbreviation table in SKILL.md)                      |
| 6    | Trim `SKILL.md` to ~100-line quick-reference: regions, tags, naming table, AVM-first rule, 5-line security summary, unique suffix patterns |
| 7    | Add progressive-loading instructions at bottom of SKILL.md: "For detailed service matrices, read `references/service-matrices.md`" etc.    |
| 8    | Verify no agent bodies contain hardcoded line references to the old skill structure                                                        |

**Target**: SKILL.md ≤ 120 lines; references/ contains 4+ files

### 1.2 — Split `azure-artifacts/SKILL.md` (C2)

**Finding**: 613 lines loaded by every agent, ~4,000 tokens × ~15 invocations = ~60,000 tokens/workflow

| Step | Action                                                                                                                                 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Create `references/` subdirectory under `.github/skills/azure-artifacts/`                                                              |
| 2    | Create per-step template files: `references/01-requirements-template.md`, `references/02-architecture-template.md`, etc. (steps 01-07) |
| 3    | Trim `SKILL.md` to ~80-line quick-reference: artifact list, key rules (H2 compliance, styling, generation protocol)                    |
| 4    | Add loading directives: "When generating Step N artifact, read `references/0N-*-template.md` for full H2 structure"                    |
| 5    | Update agents that generate specific artifacts to reference the per-step template file instead of loading the full skill               |

**Target**: SKILL.md ≤ 100 lines; 7+ reference files (one per step)

### Wave 1 Validation

```bash
npm run lint:skills-format        # Skill structure still valid
npm run lint:h2-sync              # H2 headings still sync between templates and artifacts
npm run lint:artifact-templates   # Artifact templates still pass
npm run validate:all              # Full suite
```

---

## Wave 2 — P1: High-Impact Quick Wins (M1, M6, M8, H2-H6)

**Effort**: Low (~1 hour) | **Impact**: ~6,000+ tokens/session | **Risk**: Low — glob and dedup changes

These are low-risk edits to instruction globs and agent body deduplication.

### 2.1 — Narrow `code-commenting.instructions.md` glob (M1)

**Finding**: `applyTo: "**"` loads 179 lines for every file type, including `.md`, `.json`, `.yaml`

| Step | Action                                                                              |
| ---- | ----------------------------------------------------------------------------------- |
| 1    | Change `applyTo` from `"**"` to `"**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"` |
| 2    | Verify the instruction still loads when editing a `.js` or `.bicep` file            |

### 2.2 — Narrow `governance-discovery.instructions.md` glob (M6)

**Finding**: `applyTo` includes `**/*.bicep, **/*.tf` — irrelevant when editing IaC code files

| Step | Action                                                                               |
| ---- | ------------------------------------------------------------------------------------ |
| 1    | Remove `**/*.bicep` and `**/*.tf` from the `applyTo` glob                            |
| 2    | Keep `**/04-governance-constraints.md` and `**/04-governance-constraints.json` globs |

### 2.3 — Remove `**/*.agent.md` from policy compliance globs (M8)

**Finding**: `bicep-policy-compliance.instructions.md` and `terraform-policy-compliance.instructions.md` load for agent definition edits

| Step | Action                                                                                 |
| ---- | -------------------------------------------------------------------------------------- |
| 1    | Remove `**/*.agent.md` from `applyTo` in `bicep-policy-compliance.instructions.md`     |
| 2    | Remove `**/*.agent.md` from `applyTo` in `terraform-policy-compliance.instructions.md` |

### 2.4 — Extract shared policy effect decision tree (H2)

**Finding**: Identical 5-row policy effect table duplicated in 05b, 05t, 06b, 06t agent bodies

| Step | Action                                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------------------------ |
| 1    | Add the policy effect decision tree to `governance-discovery.instructions.md` (already loads for governance files) |
| 2    | Remove the duplicated table from 05b, 05t, 06b, 06t agent bodies                                                   |
| 3    | Add a one-line reference: "Policy effect decision tree: see `governance-discovery.instructions.md`"                |

### 2.5 — Extract adversarial review boilerplate (H3)

**Finding**: ~250 tokens of identical 3-pass orchestration instructions in 03, 05b, 05t, 06b, 06t

| Step | Action                                                                                                                                                                                        |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Create a `## Challenger Orchestration Protocol` section in `challenger-review-subagent.agent.md` (or a new instruction file `challenger-orchestration.instructions.md` with appropriate glob) |
| 2    | Remove duplicated boilerplate from 5 agent bodies                                                                                                                                             |
| 3    | Replace with one-line reference to the shared protocol                                                                                                                                        |

### 2.6 — Consolidate session state protocol (H4)

**Finding**: ~100 tokens of bespoke session-state instructions repeated in all 10 agents

| Step | Action                                                                                                                     |
| ---- | -------------------------------------------------------------------------------------------------------------------------- |
| 1    | Ensure `session-resume/SKILL.md` has a clear "Standard Session State Protocol" section that agents can reference           |
| 2    | Replace inline session-state instructions in each agent with: "Follow session state protocol in `session-resume/SKILL.md`" |

### 2.7 — Remove redundant security baseline from agent bodies (H5)

**Finding**: TLS 1.2, HTTPS-only, no public blob, managed identity list repeated in 6+ agents — already in `azure-defaults/SKILL.md` and `AGENTS.md`

| Step | Action                                                                                 |
| ---- | -------------------------------------------------------------------------------------- |
| 1    | Remove inline security baseline lists from agent bodies (05b, 05t, 06b, 06t, 07b, 07t) |
| 2    | These agents already read `azure-defaults` which contains the authoritative list       |

### 2.8 — Extract shared Azure CLI auth validation (H6)

**Finding**: ~300 tokens of `az account show` + `get-access-token` duplicated in 07b and 07t

| Step | Action                                                                                  |
| ---- | --------------------------------------------------------------------------------------- |
| 1    | Add an "Azure CLI Auth Validation" section to `azure-defaults/SKILL.md` (or references) |
| 2    | Remove duplicated auth blocks from 07b and 07t agent bodies                             |

### Wave 2 Validation

```bash
npm run lint:instruction-frontmatter   # Instruction applyTo globs valid
npm run lint:agent-frontmatter         # Agent definitions still valid
npm run validate:instruction-refs      # Instruction references intact
npm run validate:all
```

---

## Wave 3 — P1: Agent Body Optimization (C3, M7)

**Effort**: Medium (~1.5 hours) | **Impact**: ~8,000+ tokens | **Risk**: Medium — agent behavior changes possible

### 3.1 — Trim `06t-terraform-codegen.agent.md` (C3)

**Finding**: 432-line body (largest), 8 skill reads, 6 fenced HCL blocks duplicating skill content

| Step | Action                                                                                                                                        |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Extract bootstrap script (~25 lines) to `.github/skills/terraform-patterns/references/bootstrap-script.sh`                                    |
| 2    | Extract deploy script (~25 lines) to `.github/skills/terraform-patterns/references/deploy-script.sh`                                          |
| 3    | Remove inline HCL blocks that duplicate content in `terraform-patterns/SKILL.md`                                                              |
| 4    | Change `microsoft-code-reference` load from init-time to on-demand (add conditional: "Read this skill ONLY when SDK method lookup is needed") |
| 5    | Target: body < 300 lines                                                                                                                      |

### 3.2 — Trim `05t-terraform-planner.agent.md` (M7)

**Finding**: 379-line body with 6 fenced HCL blocks duplicating `azure-defaults/SKILL.md`

| Step | Action                                                                      |
| ---- | --------------------------------------------------------------------------- |
| 1    | Remove backend config HCL block (exists in skills)                          |
| 2    | Remove provider requirements HCL block (exists in skills)                   |
| 3    | Move `HCP GUARDRAIL` block to `terraform-patterns/SKILL.md` (also fixes L5) |
| 4    | Target: body < 300 lines                                                    |

### Wave 3 Validation

```bash
npm run lint:agent-frontmatter
npm run lint:skills-format
npm run validate:all
```

---

## Wave 4 — P1: Challenger Subagent Optimization (H1, L3)

**Effort**: Medium (~1.5 hours) | **Impact**: ~60,000 tokens/workflow | **Risk**: Medium — review quality must be maintained

### 4.1 — Restructure `challenger-review-subagent` (H1 + L3)

**Finding**: Loads 3 full skills (~9,000 tokens) per invocation × 10-15 invocations/workflow; 70-line inline checklist covers all artifact types

| Step | Action                                                                                                                                                                                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Create `references/` subdirectory under the challenger skill (or within the subagent's referenced skill)                                                                                                                                                             |
| 2    | Split the 70-line checklist into per-artifact-type files: `references/requirements-checklist.md`, `references/architecture-checklist.md`, `references/implementation-plan-checklist.md`, `references/code-review-checklist.md`, `references/deployment-checklist.md` |
| 3    | Update subagent body to load only the relevant checklist based on the `artifact_type` parameter                                                                                                                                                                      |
| 4    | Change skill reads from full `azure-defaults` to the quick-ref version (depends on Wave 1 being complete)                                                                                                                                                            |
| 5    | Create a ~50-line compact review protocol in the body; artifact-specific addons loaded on-demand                                                                                                                                                                     |
| 6    | Target: body < 200 lines; per-invocation context reduced by ~5,000 tokens                                                                                                                                                                                            |

### Wave 4 Validation

```bash
npm run lint:agent-frontmatter
npm run lint:skills-format
# Manual test: invoke the challenger on a sample artifact to verify review quality
```

---

## Wave 5 — P2: Remaining Skill Splits (M9, M10, H7, H8, M3, M4, M5)

**Effort**: Medium-High (~2-3 hours) | **Impact**: ~15,000+ tokens when loaded | **Risk**: Low-Medium

### 5.1 — Split `session-resume/SKILL.md` (M9)

**Finding**: 344 lines loaded by all 10 agents

| Step | Action                                                                                             |
| ---- | -------------------------------------------------------------------------------------------------- |
| 1    | Create `references/` under `.github/skills/session-resume/`                                        |
| 2    | Move detailed recovery flow, examples, and edge-case handling to `references/recovery-protocol.md` |
| 3    | Keep ~80-line quick-ref: JSON schema, standard protocol, resume detection logic                    |

### 5.2 — Split `terraform-patterns/SKILL.md` (M10)

**Finding**: 509 lines with pattern libraries

| Step | Action                                                                                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Create `references/` under `.github/skills/terraform-patterns/`                                                                                                                                            |
| 2    | Move pattern libraries to separate files: `references/hub-spoke.md`, `references/private-endpoints.md`, `references/diagnostics.md`, `references/conditional-deployments.md`, `references/avm-pitfalls.md` |
| 3    | Keep ~100-line overview with pattern index and quick-reference                                                                                                                                             |

### 5.3 — Split `cost-estimate.instructions.md` (H7)

**Finding**: 414 lines — heaviest instruction file

| Step | Action                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------- |
| 1    | Create a `cost-estimate` skill with `references/` (or add references to existing skill structure) |
| 2    | Move detailed pricing tables and methodology to reference files                                   |
| 3    | Keep ~80-line instruction with core rules                                                         |

### 5.4 — Split `terraform-code-best-practices.instructions.md` (H8)

**Finding**: 393 lines loads on every `.tf` edit

| Step | Action                                                                             |
| ---- | ---------------------------------------------------------------------------------- |
| 1    | Move detailed patterns to `terraform-patterns/references/` (consolidates with M10) |
| 2    | Keep ~100-line instruction with quick rules and references to patterns skill       |

### 5.5 — Split `code-review.instructions.md` (M3)

**Finding**: 313 lines loads on all code file edits

| Step | Action                                                       |
| ---- | ------------------------------------------------------------ |
| 1    | Move detailed checklist templates to a reference file        |
| 2    | Keep ~80-line instruction with core rules and priority tiers |

### 5.6 — Split `markdown.instructions.md` (M4)

**Finding**: 256 lines loads for all markdown edits

| Step | Action                                             |
| ---- | -------------------------------------------------- |
| 1    | Move detailed formatting rules to a reference file |
| 2    | Keep ~80-line essentials                           |

### 5.7 — Deduplicate `azure-artifacts.instructions.md` vs SKILL.md (M5)

**Finding**: 284-line instruction overlaps significantly with 613-line skill

| Step | Action                                                                       |
| ---- | ---------------------------------------------------------------------------- |
| 1    | Audit overlap between the instruction and skill                              |
| 2    | Instruction should contain only enforcement rules (validation, compliance)   |
| 3    | Move template content to skill `references/` (if not already done in Wave 1) |
| 4    | Target: instruction ≤ 80 lines                                               |

### Wave 5 Validation

```bash
npm run lint:skills-format
npm run lint:instruction-frontmatter
npm run lint:h2-sync
npm run lint:artifact-templates
npm run validate:all
```

---

## Wave 6 — P2-P3: Agent Body Cleanup & Remaining Items

**Effort**: Low (~1 hour) | **Impact**: ~2,500+ tokens | **Risk**: Low

### 6.1 — Trim remaining agent bodies

| Agent                | Action                                                                                    | Finding         |
| -------------------- | ----------------------------------------------------------------------------------------- | --------------- |
| 06b-Bicep CodeGen    | Remove duplicated module composition patterns from body; defer `microsoft-code-reference` | C3 corollary    |
| 05b-Bicep Planner    | Remove duplicated policy table (done in Wave 2); trim to < 300 lines                      | M7 corollary    |
| 03-Architect         | Defer `waf-cost-charts.md` load to chart generation phase                                 | Agent-specific  |
| 02-Requirements      | Will benefit from Wave 1 skill splits automatically                                       | No body changes |
| 07b-Bicep Deploy     | Remove auth validation duplication (done in Wave 2); consolidate Known Issues with 07t    | L4              |
| 07t-Terraform Deploy | Same consolidation as 07b                                                                 | L4              |

### 6.2 — Extract Conductor handoff template (L2)

| Step | Action                                                                      |
| ---- | --------------------------------------------------------------------------- |
| 1    | Create `.github/skills/azure-artifacts/templates/00-handoff.template.md`    |
| 2    | Replace 30-line inline block in `01-conductor.agent.md` with path reference |

### 6.3 — Move HCP GUARDRAIL to skill (L5)

If not already done in Wave 3 (step 3.2), move the `HCP GUARDRAIL` block from 05t and 06t to `terraform-patterns/SKILL.md`.

### 6.4 — Error pattern audit (C5)

| Step | Action                                                                                       |
| ---- | -------------------------------------------------------------------------------------------- |
| 1    | Analyze the 30 failed requests from parsed log data (`/tmp/context-audit.json`) for patterns |
| 2    | Document which agents/operations trigger retries                                             |
| 3    | Add retry-mitigation guidance to affected agents if patterns emerge                          |

### Wave 6 Validation

```bash
npm run lint:agent-frontmatter
npm run validate:all
```

---

## Wave 7 — Remaining Skills Progressive Loading (Other 13 Skills)

**Effort**: High (~3-4 hours) | **Impact**: Variable ~2,000-3,000/skill | **Risk**: Low

**Finding**: 13 of 17 skills exceed 200 lines without `references/` subdirectories

| Skill                      | Lines | Action                                             |
| -------------------------- | ----: | -------------------------------------------------- |
| `azure-bicep-patterns`     |  400+ | Create `references/` with per-pattern files        |
| `azure-diagrams`           |  500+ | Move chart templates and examples to `references/` |
| `azure-troubleshooting`    |  300+ | Move KQL templates to `references/`                |
| `azure-adr`                |  200+ | Move ADR template examples to `references/`        |
| `context-optimizer`        |   295 | Move template and methodology to `references/`     |
| `docs-writer`              |  200+ | Move detailed update rules to `references/`        |
| `git-commit`               |  200+ | Move detailed diff analysis rules to `references/` |
| `github-operations`        |  300+ | Move MCP tool reference tables to `references/`    |
| `golden-principles`        |  200+ | Evaluate — may be intentionally compact            |
| `make-skill-template`      |  200+ | Move scaffold templates to `references/`           |
| `microsoft-code-reference` |  200+ | Move SDK lookup patterns to `references/`          |
| `microsoft-docs`           |  200+ | Move workflow examples to `references/`            |
| `microsoft-skill-creator`  |  200+ | Move creation workflow to `references/`            |

**Protocol for each**:

1. Identify content that is reference material (examples, templates, detailed tables) vs. core directives
2. Create `references/` subdirectory
3. Move reference material to appropriately named files
4. Keep SKILL.md at ≤ 150 lines with progressive-loading directives
5. Run `npm run lint:skills-format` after each split

### Wave 7 Validation

```bash
npm run lint:skills-format
npm run validate:all
```

---

## Wave 8 — Diff Report & Final Validation

**Effort**: Low (~30 min) | **Risk**: None

| #   | Task                 | Details                                                                                |
| --- | -------------------- | -------------------------------------------------------------------------------------- |
| 8.1 | Run full validation  | `npm run validate:all` — must pass with zero regressions                               |
| 8.2 | Generate diff report | `npm run diff:baseline -- --baseline ctx-opt-20260302-130935`                          |
| 8.3 | Review diff report   | Verify token savings estimates from each wave                                          |
| 8.4 | Functional test      | Invoke Conductor on a sample project; verify 7-step workflow completes                 |
| 8.5 | Document results     | Update `11-context-optimization-report.md` Phase 6 section with actual diff results    |
| 8.6 | Create PR            | PR from `ctx-opt/implement-recommendations` → `main` with diff report and test results |

---

## Summary

|      Wave | Scope                       | Findings Addressed          | Effort         |       Estimated Token Savings |
| --------: | --------------------------- | --------------------------- | -------------- | ----------------------------: |
|         0 | Branch setup                | —                           | 5 min          |                             — |
|         1 | P0 skill splits             | C1, C2                      | 2-3 hrs        |              ~93,000/workflow |
|         2 | P1 glob fixes + dedup       | M1, M6, M8, H2-H6           | 1 hr           |               ~6,000+/session |
|         3 | P1 agent body trim          | C3, M7, L5                  | 1.5 hrs        |                ~8,000+ tokens |
|         4 | P1 challenger optimization  | H1, L3                      | 1.5 hrs        |              ~60,000/workflow |
|         5 | P2 skill/instruction splits | M9, M10, H7, H8, M3, M4, M5 | 2-3 hrs        |          ~15,000+ when loaded |
|         6 | P2-P3 agent cleanup         | L2, L4, C5, agent trims     | 1 hr           |                ~2,500+ tokens |
|         7 | Remaining skill splits      | 13 skills                   | 3-4 hrs        |       ~26,000-39,000 variable |
|         8 | Diff report & validation    | Phase 6                     | 30 min         |                             — |
| **Total** |                             | **29 findings**             | **~13-16 hrs** | **~150,000+ tokens/workflow** |

### Findings Coverage Matrix

| Finding | Wave | Status                                   |
| ------- | ---: | ---------------------------------------- |
| C1      |    1 | Planned                                  |
| C2      |    1 | Planned                                  |
| C3      |    3 | Planned                                  |
| C4      |    — | Not actionable (internal infrastructure) |
| C5      |    6 | Planned (audit)                          |
| H1      |    4 | Planned                                  |
| H2      |    2 | Planned                                  |
| H3      |    2 | Planned                                  |
| H4      |    2 | Planned                                  |
| H5      |    2 | Planned                                  |
| H6      |    2 | Planned                                  |
| H7      |    5 | Planned                                  |
| H8      |    5 | Planned                                  |
| H9      |    — | Monitor after other optimizations        |
| M1      |    2 | Planned                                  |
| M2      |    — | No change needed                         |
| M3      |    5 | Planned                                  |
| M4      |    5 | Planned                                  |
| M5      |    5 | Planned                                  |
| M6      |    2 | Planned                                  |
| M7      |    3 | Planned                                  |
| M8      |    2 | Planned                                  |
| M9      |    5 | Planned                                  |
| M10     |    5 | Planned                                  |
| L1      |    — | No change needed                         |
| L2      |    6 | Planned                                  |
| L3      |    4 | Planned                                  |
| L4      |    6 | Planned                                  |
| L5      |    3 | Planned                                  |

---

## Risk Mitigation

| Risk                                                  | Mitigation                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------- |
| Skill split breaks agent behavior                     | Run `npm run validate:all` after each wave; functional test in Wave 8       |
| Progressive loading directives not followed by model  | Use explicit imperative language: "You MUST read `references/X.md` when..." |
| Agents cannot find moved content                      | Keep references in predictable paths; add index in SKILL.md quick-ref       |
| Review quality degrades after challenger optimization | Manual test with sample artifact before and after Wave 4                    |
| Merge conflicts with other PRs                        | Rebase frequently; waves are self-contained commits                         |
| Validation scripts fail after skill restructure       | Update validation scripts if they check for specific file structures        |

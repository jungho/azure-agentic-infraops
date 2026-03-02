# Context Window Optimization Report

**Generated**: 2026-03-02T13:09:00Z
**Project**: \_meta (cross-project)
**Sessions Analyzed**: 1
**Total Requests**: 530
**Baseline Snapshot**: `ctx-opt-20260302-130935`

---

## Executive Summary

| Metric                          | Current    | Target   | Impact              |
| ------------------------------- | ---------- | -------- | ------------------- |
| Avg turns per task              | 530 req/4h | —        | Baseline            |
| Avg latency (Opus)              | 11,792 ms  | < 8,000  | Moderate            |
| Avg latency (Sonnet)            | 11,379 ms  | < 8,000  | Moderate            |
| Long turns (> 15 s)             | 58 (11.0%) | < 5%     | High                |
| Burst sequences (< 2 s gap)     | 123        | < 60     | Tool-loop indicator |
| P95 latency                     | 28,561 ms  | < 15,000 | High                |
| Max latency                     | 179,012 ms | < 60,000 | Critical            |
| Estimated wasted tokens/session | ~15,000+   | < 3,000  | High                |
| Latency trend                   | stable     | stable   | OK                  |

## Session Profile

| Session       | Requests | Avg Latency | Max Latency | Long Turns | Bursts | Errors | Trend  |
| ------------- | -------: | ----------: | ----------: | ---------: | -----: | -----: | ------ |
| 20260302T0913 |      530 |    7,969 ms |  179,012 ms |         58 |    123 |     30 | stable |

### Model Distribution — Agent Turns (User-Controlled)

| Model                  | Requests |     Share | Avg Latency | P95 Latency |
| ---------------------- | -------: | --------: | ----------: | ----------: |
| claude-opus-4-6        |      204 |     59.3% |   11,792 ms |   31,072 ms |
| claude-sonnet-4-6      |      116 |     33.7% |   11,379 ms |   33,777 ms |
| gpt-5-mini-2025-08-07  |       13 |      3.8% |    5,710 ms |   21,829 ms |
| gemini-3-flash-preview |        4 |      1.2% |    1,836 ms |    2,334 ms |
| **Subtotal**           |  **337** | **97.9%** |             |             |

> [!NOTE]
> **gpt-4o-mini excluded** — all 186 gpt-4o-mini requests (35.1% of raw total)
> are **internal VS Code Copilot infrastructure calls**, not user-controlled agent
> turns. Breakdown: 180 `copilotLanguageModelWrapper` (extension/tool routing),
> 4 `title` (auto-generated conversation titles), 2 `progressMessages`
> (status indicators). These are hardcoded in the Copilot Chat extension and
> cannot be changed via agent configuration.
> Similarly excluded: `copilot-nes-oct` (3) and `copilot-suggestions-himalia-001`
> (3) — internal suggestion/completion models.

### Model Distribution — All Requests (Including Internal)

| Model                           | Requests | Share | Avg Latency | P95 Latency | Notes             |
| ------------------------------- | -------: | ----: | ----------: | ----------: | ----------------- |
| claude-opus-4-6                 |      204 | 38.5% |   11,792 ms |   31,072 ms | Agent turns       |
| gpt-4o-mini-2024-07-18          |      186 | 35.1% |    2,200 ms |    1,860 ms | **Internal only** |
| claude-sonnet-4-6               |      116 | 21.9% |   11,379 ms |   33,777 ms | Agent turns       |
| gpt-5-mini-2025-08-07           |       13 |  2.5% |    5,710 ms |   21,829 ms | Agent turns       |
| gemini-3-flash-preview          |        4 |  0.8% |    1,836 ms |    2,334 ms | Agent turns       |
| copilot-nes-oct                 |        3 |  0.6% |      908 ms |    1,185 ms | **Internal only** |
| copilot-suggestions-himalia-001 |        3 |  0.6% |      736 ms |      846 ms | **Internal only** |

### Request Type Distribution

| Type                         | Count | Share |
| ---------------------------- | ----: | ----: |
| panel/editAgent              |   319 | 60.2% |
| copilotLanguageModelWrapper  |   181 | 34.2% |
| tool/runSubagent             |    11 |  2.1% |
| searchSubagentTool           |     4 |  0.8% |
| title                        |     4 |  0.8% |
| XtabProvider                 |     3 |  0.6% |
| progressMessages             |     2 |  0.4% |
| retry-\*                     |     2 |  0.4% |
| summarizeConversationHistory |     1 |  0.2% |

### Top 10 Longest Turns

| Timestamp           | Model             |    Latency | Type                                        |
| ------------------- | ----------------- | ---------: | ------------------------------------------- |
| 2026-03-02 09:59:08 | gpt-4o-mini       | 179,012 ms | copilotLanguageModelWrapper ⚠️ **internal** |
| 2026-03-02 09:30:39 | claude-opus-4-6   | 109,867 ms | panel/editAgent                             |
| 2026-03-02 09:59:29 | claude-opus-4-6   |  92,676 ms | summarizeConversationHistory                |
| 2026-03-02 09:32:58 | claude-opus-4-6   |  92,366 ms | panel/editAgent                             |
| 2026-03-02 09:30:39 | claude-opus-4-6   |  87,018 ms | retry-server-error                          |
| 2026-03-02 10:33:23 | claude-sonnet-4-6 |  84,456 ms | panel/editAgent                             |
| 2026-03-02 09:46:22 | claude-opus-4-6   |  72,586 ms | tool/runSubagent                            |
| 2026-03-02 09:54:28 | claude-opus-4-6   |  72,293 ms | panel/editAgent                             |
| 2026-03-02 09:50:43 | claude-opus-4-6   |  70,672 ms | panel/editAgent                             |
| 2026-03-02 10:44:38 | claude-sonnet-4-6 |  58,800 ms | panel/editAgent                             |

---

## Findings

### Critical — Context Overflow Risk

| #   | Agent/File                       | Issue                                                                                                                                                                                                      | Evidence                                                                                                                                                                                        | Recommendation                                                                                                                                                                                                                              |                   Est. Token Savings |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------: |
| C1  | `azure-defaults/SKILL.md`        | **701-line skill loaded by every agent** — all 10+ agents read this skill at init, accumulating ~4,500 tokens per invocation × ~15 invocations per workflow = **~67,500 tokens**                           | File is 701 lines / 32,890 chars; no `references/` subdirectory; no progressive loading                                                                                                         | Split into ~100-line quick-reference (naming, regions, tags, security baseline summary) + move detailed service matrices, pricing guidance, and full tables to `references/` subdirectory. Only agents that need full details load Level 3. |                    ~3,000/invocation |
| C2  | `azure-artifacts/SKILL.md`       | **613-line skill loaded by every agent** — same pattern as C1; ~4,000 tokens per invocation × ~15 invocations = **~60,000 tokens**                                                                         | File is 613 lines / 20,455 chars; no `references/` subdirectory                                                                                                                                 | Split into ~80-line quick-reference (template list + key rules) + move full H2 structures and styling rules to `references/` per artifact type (01-template.md, 02-template.md, etc.). Agents load only the template they need.             |                    ~3,200/invocation |
| C3  | `06t-terraform-codegen.agent.md` | **Largest agent body** at 432 lines (~4,900 tokens) plus 8 skill/instruction reads at init — estimated total context load at agent start: **~25,000+ tokens** before any user interaction                  | Body: 19,679 chars; reads 8 files; 6 fenced code blocks inline                                                                                                                                  | Extract bootstrap/deploy scripts to `terraform-patterns` references; remove inline HCL that duplicates `terraform-patterns/SKILL.md`; defer `microsoft-code-reference` load to when SDK lookups are needed                                  | ~2,000 body + ~3,000 deferred skills |
| C4  | Session 179s turn                | **179-second internal gpt-4o-mini turn** — an internal `copilotLanguageModelWrapper` call (not user-controlled) took nearly 3 minutes, suggesting massive context was passed to the internal routing layer | `copilotLanguageModelWrapper` call at 09:59:08; this is a VS Code Copilot infrastructure call, not an agent turn; likely triggered by conversation history summarization with oversized context | Not directly actionable — this is internal to the Copilot Chat extension. However, reducing overall context accumulation (C1, C2 fixes) will indirectly reduce the payload passed to these internal calls                                   |        N/A — internal infrastructure |
| C5  | 30 request errors                | **30 failed/error requests** in one session (5.7%)                                                                                                                                                         | `total_errors: 30` in parsed session data                                                                                                                                                       | Audit error patterns — server errors trigger retries that double context cost per turn; 2 retries observed in request types                                                                                                                 |                     ~500/retry saved |

### High — Significant Token Waste

| #   | Agent/File                                      | Issue                                                                                                                                     | Evidence                                                                                                           | Recommendation                                                                                                                                                                                   | Est. Token Savings |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -----------------: |
| H1  | `challenger-review-subagent`                    | **Loads 3 skills (~9,000 tokens) per invocation × 10-15 invocations** per workflow — subagent runs for every review pass across Steps 2-5 | 315-line body + reads `azure-defaults` (701 lines) + `azure-artifacts` (613 lines) + policy compliance instruction | The subagent should load a compact ~50-line checklist per artifact type, not the full 701-line defaults skill. Extract artifact-type-specific checklists to `references/` files loaded on-demand |  ~5,000/invocation |
| H2  | Cross-agent duplication                         | **Policy effect decision tree** duplicated in 4 agents (05b, 05t, 06b, 06t)                                                               | Identical 5-row table in each agent body                                                                           | Extract to `governance-discovery.instructions.md` or a shared skill section — single source of truth                                                                                             |         ~600 total |
| H3  | Cross-agent duplication                         | **Adversarial review 3-pass orchestration boilerplate** duplicated in 5 agents (03, 05b, 05t, 06b, 06t)                                   | ~250 tokens of identical pass-loop instructions, compact_for_parent encoding, result-writing pattern               | Create a shared `challenger-orchestration` section in the challenger skill or a new instruction file referenced by all 5 agents                                                                  |       ~1,250 total |
| H4  | Cross-agent duplication                         | **Session state protocol section** repeated in all 10 agents                                                                              | Each agent has ~100 tokens of bespoke session-state instructions that follow the same pattern                      | Consolidate into `session-resume/SKILL.md` as a standard protocol section; agents reference the skill instead of inlining                                                                        |       ~1,000 total |
| H5  | Cross-agent duplication                         | **Security baseline list** (TLS 1.2, HTTPS-only, no public blob, managed identity) repeated in 6+ agent bodies                            | ~50 tokens each × 6 agents = ~300 tokens; already in `azure-defaults/SKILL.md` and `AGENTS.md`                     | Remove from agent bodies — the skill and instruction system provide this automatically                                                                                                           |         ~300 total |
| H6  | Cross-agent duplication                         | **Azure CLI auth validation** duplicated in 07b and 07t                                                                                   | ~300 tokens of nearly identical `az account show` + `get-access-token` command blocks                              | Extract to a shared `azure-auth-validation` section in `azure-defaults` or deploy-focused skill                                                                                                  |         ~300 total |
| H7  | `cost-estimate.instructions.md`                 | **414 lines** — heaviest instruction file; loads on 3 narrow globs but content is extremely detailed                                      | 414 lines / 12,903 chars; `applyTo` is correctly narrow                                                            | Split into ~80-line instruction + move detailed pricing tables and methodology to a `cost-estimate` skill `references/` file                                                                     | ~2,500 when loaded |
| H8  | `terraform-code-best-practices.instructions.md` | **393 lines** — loads on every `.tf` file edit                                                                                            | 393 lines / 12,816 chars                                                                                           | This loads for ALL Terraform file edits. Split quick rules (~100 lines) from detailed patterns (move to `terraform-patterns/references/`)                                                        | ~2,000 when loaded |
| H9  | 123 burst sequences                             | **123 burst sequences** (< 2s gap between calls) indicate frequent tool-call loops                                                        | Session statistics                                                                                                 | While some bursts are expected (parallel tool calls), this rate suggests some agents enter rapid read-search-read cycles. Consider caching strategies or batch tool calls                        |           Variable |

### Medium — Optimization Opportunity

| #   | Agent/File                             | Issue                                                                                             | Evidence                                                                               | Recommendation                                                                                                                                                                  |  Est. Token Savings |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------: |
| M1  | `code-commenting.instructions.md`      | **179 lines with `applyTo: "**"`\*\* — loads for EVERY file type in the workspace                 | 179 lines / 5,600 chars                                                                | Narrow to `"**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"` — commenting guidelines are irrelevant for `.md`, `.json`, `.yaml` files                                          |      ~1,200/session |
| M2  | `context-optimization.instructions.md` | **89 lines with effective `applyTo` covering all agent/skill/instruction files**                  | Loads whenever editing any agent, skill, or instruction file                           | This is acceptable — the glob is reasonably scoped. No change needed.                                                                                                           |                   — |
| M3  | `code-review.instructions.md`          | **313 lines** — loads on all code file edits                                                      | 313 lines / 10,526 chars; `applyTo: "**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"` | Split into ~80-line core rules + move detailed checklist templates to a `code-review` skill                                                                                     |  ~1,500 when loaded |
| M4  | `markdown.instructions.md`             | **256 lines with `applyTo: "**/\*.md"`\*\* — loads for all markdown edits including agent outputs | 256 lines / 9,024 chars                                                                | Split into ~80-line essentials + move detailed formatting rules to `references/`                                                                                                |  ~1,200 when loaded |
| M5  | `azure-artifacts.instructions.md`      | **284 lines** — loads for all agent-output markdown files                                         | 284 lines / 8,518 chars; `applyTo: "**/agent-output/**/*.md"`                          | This overlaps significantly with `azure-artifacts/SKILL.md` (613 lines). Deduplicate — instruction should contain only enforcement rules, not template content                  |  ~1,000 when loaded |
| M6  | `governance-discovery.instructions.md` | **202 lines** — loads on governance files AND all Bicep/Terraform files                           | 202 lines / 8,975 chars; glob includes `**/*.bicep` and `**/*.tf`                      | Narrow: governance discovery instructions are irrelevant when editing IaC code; they matter only for governance constraint files. Remove `**/*.bicep, **/*.tf` from glob        |      ~1,500/session |
| M7  | `05t-terraform-planner.agent.md`       | **379-line body** — second largest agent; contains 6 fenced code blocks                           | 18,061 chars / ~4,500 tokens in body                                                   | Inline HCL blocks for backend config and provider requirements duplicate `azure-defaults/SKILL.md` content — remove                                                             |           ~400 body |
| M8  | Agent `.agent.md` edit context load    | **~883 lines of instructions auto-load** when editing any `.agent.md` file                        | 7 instruction files auto-match `.agent.md` glob pattern                                | `bicep-policy-compliance` and `terraform-policy-compliance` shouldn't load for agent definitions — they're for Bicep/TF code. Remove `**/*.agent.md` from their `applyTo` globs | ~260 per agent edit |
| M9  | `session-resume/SKILL.md`              | **344 lines without `references/` subdirectory** — loaded by all 10 agents                        | 14,301 chars / ~3,600 tokens                                                           | Split into ~80-line quick-reference (JSON schema + protocol) + move detailed recovery flow and examples to `references/`                                                        |   ~2,500/invocation |
| M10 | `terraform-patterns/SKILL.md`          | **509 lines without `references/` subdirectory**                                                  | 15,832 chars / ~4,000 tokens                                                           | Move pattern libraries (hub-spoke, PE, diagnostics etc.) to `references/` subdirectory, keep ~100-line overview                                                                 |  ~2,500 when loaded |

### Low — Minor Improvements

| #   | Agent/File                       | Issue                                                  | Evidence                           | Recommendation                                                                 | Est. Token Savings |
| --- | -------------------------------- | ------------------------------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------ | -----------------: |
| L1  | `no-heredoc.instructions.md`     | 23 lines with `applyTo: "**"` — acceptable overhead    | 23 lines / 844 chars               | No change needed — file is small enough to justify universal loading           |                  — |
| L2  | `01-conductor.agent.md`          | 30-line inline handoff template in body                | Fenced markdown block at ~L240-270 | Extract to `azure-artifacts/templates/00-handoff.template.md`                  |               ~100 |
| L3  | `challenger-review-subagent`     | 70-line inline checklist covering all 7 artifact types | Lines ~175-280                     | Move artifact-specific addons to `references/` files, load per `artifact_type` |    ~150/invocation |
| L4  | Agent body `Known Issues` tables | 07b and 07t share 3 of 5 identical known-issue rows    | ~150 tokens duplicated             | Consolidate into a shared `deploy-known-issues` reference                      |         ~150 total |
| L5  | `HCP GUARDRAIL` warning          | Duplicated in 05t and 06t                              | ~50 tokens                         | Move to `terraform-patterns/SKILL.md` as a standard warning                    |          ~50 total |

---

## Recommended Hand-Off Points

| Current Agent                  | Breakpoint                                     | New Subagent / Extraction                                           |           Est. Context Saved |
| ------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------- | ---------------------------: |
| 06t-TF CodeGen                 | Phase 2.5 (bootstrap script generation)        | New `terraform-scaffold-subagent` or extract to skill `references/` |                ~2,000 tokens |
| 03-Architect + 05b/05t/06b/06t | Adversarial review orchestration boilerplate   | Shared `challenger-orchestration` instruction file                  |       ~250 tokens × 5 agents |
| 07b + 07t deploy agents        | Azure CLI auth validation section              | Shared `azure-auth-validation` instruction or skill section         |       ~300 tokens × 2 agents |
| challenger-review-subagent     | Artifact-type-specific checklists              | Load only relevant checklist from `references/{artifact_type}.md`   | ~150 tokens × 12 invocations |
| All agents                     | `azure-defaults` + `azure-artifacts` full load | Progressive loading with Level 1 quick-ref (~100 lines)             |     ~6,200 tokens/invocation |

---

## Instruction Consolidation

| Action                                                                                                                          | Files Affected |                                         Est. Token Savings |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------: |
| **Narrow `applyTo` glob**: `code-commenting.instructions.md` from `"**"` to `"**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"` | 1 file         | ~1,200/session (stops loading for .md, .json, .yaml edits) |
| **Narrow `applyTo` glob**: Remove `**/*.agent.md` from `bicep-policy-compliance` and `terraform-policy-compliance`              | 2 files        |                                            ~260/agent-edit |
| **Narrow `applyTo` glob**: Remove `**/*.bicep, **/*.tf` from `governance-discovery.instructions.md`                             | 1 file         |                                             ~1,500/session |
| **Split large instruction**: `cost-estimate.instructions.md` (414 lines) → 80-line core + reference file                        | 1 file         |                                         ~2,500 when loaded |
| **Split large instruction**: `terraform-code-best-practices.instructions.md` (393 lines) → 100-line core + patterns in skill    | 1 file         |                                         ~2,000 when loaded |
| **Split large instruction**: `code-review.instructions.md` (313 lines) → 80-line core + reference file                          | 1 file         |                                         ~1,500 when loaded |
| **Deduplicate**: `azure-artifacts.instructions.md` (284 lines) overlaps with `azure-artifacts/SKILL.md` (613 lines)             | 2 files        |                                         ~1,000 when loaded |
| **Split large skill**: `azure-defaults/SKILL.md` (701 lines) → 100-line quick-ref + `references/`                               | 1 skill        |                                          ~3,000/invocation |
| **Split large skill**: `azure-artifacts/SKILL.md` (613 lines) → 80-line quick-ref + `references/` per artifact                  | 1 skill        |                                          ~3,200/invocation |
| **Split large skill**: `session-resume/SKILL.md` (344 lines) → 80-line quick-ref + `references/`                                | 1 skill        |                                          ~2,500/invocation |
| **Split large skill**: `terraform-patterns/SKILL.md` (509 lines) → 100-line overview + `references/`                            | 1 skill        |                                         ~2,500 when loaded |
| **Add progressive loading**: 13 of 17 skills exceed 200 lines without `references/` subdirectories                              | 13 skills      |        Variable — estimated ~2,000-3,000/skill when loaded |

---

## Agent-Specific Recommendations

### 01-Conductor (460 lines total, body: 321 lines)

- **Issue**: 30-line inline handoff template duplicates what should be in `azure-artifacts/templates/`
- **Evidence**: Fenced markdown block at ~L240-270 containing full `00-handoff.md` structure
- **Recommendation**: Extract to `azure-artifacts/templates/00-handoff.template.md`; reference by path
- **Estimated Impact**: ~100 tokens saved in body; cleaner separation of concerns

### 02-Requirements (355 lines total, body: 262 lines)

- **Issue**: Reads 5 files at init including full `azure-defaults` and `azure-artifacts`
- **Evidence**: 5 distinct Read directives in body
- **Recommendation**: Use progressive-loaded quick-refs for defaults and artifacts
- **Estimated Impact**: ~5,000 tokens/invocation if skills are split

### 03-Architect (397 lines total, body: 285 lines)

- **Issue**: Reads 7 files including `azure-diagrams/references/waf-cost-charts.md` at init — this is only needed during chart generation, not during assessment writing
- **Evidence**: WAF chart reference loaded upfront; adversarial review boilerplate duplicated with 4 other agents
- **Recommendation**: Defer `waf-cost-charts.md` load to chart generation phase; extract adversarial boilerplate to shared file
- **Estimated Impact**: ~500 deferred + ~250 dedup = ~750 tokens

### 05b-Bicep Planner (389 lines total, body: 302 lines)

- **Issue**: Body exceeds 300 lines; contains policy effect decision tree duplicated with 3 other agents
- **Evidence**: 302-line body; identical table appears in 05t, 06b, 06t
- **Recommendation**: Remove duplicated policy table (it's in `governance-discovery.instructions.md` which loads via applyTo); trim body to < 300 lines
- **Estimated Impact**: ~200 tokens

### 05t-Terraform Planner (466 lines total, body: 379 lines)

- **Issue**: Largest total agent file at 466 lines; body at 379 lines far exceeds 300-line guideline; 6 fenced HCL blocks duplicate skill content
- **Evidence**: Backend config + provider requirements HCL blocks identical to `azure-defaults/SKILL.md`; `HCP GUARDRAIL` block duplicated with 06t
- **Recommendation**: Remove inline HCL that exists in skills; move `HCP GUARDRAIL` to `terraform-patterns/SKILL.md`; target body < 280 lines
- **Estimated Impact**: ~500 tokens

### 06b-Bicep CodeGen (419 lines total, body: 331 lines)

- **Issue**: 8 file reads at init (joint heaviest); body at 331 lines; `main.bicep` structure section overlaps with `azure-bicep-patterns/SKILL.md`
- **Evidence**: 8 Read directives; body contains module composition patterns already in the patterns skill
- **Recommendation**: Remove duplicated patterns from body; defer `microsoft-code-reference` skill load to when SDK lookups are actually needed
- **Estimated Impact**: ~1,000 tokens (body trim + deferred load)

### 06t-Terraform CodeGen (524 lines total, body: 432 lines)

- **Issue**: **Largest agent by all metrics** — 524 total lines, 432-line body, 8 file reads; contains 2 inline bootstrap scripts (~25 lines each) and phased deployment patterns that exist in `terraform-patterns/SKILL.md`
- **Evidence**: 19,679 chars body (~4,900 tokens); `locals.tf` key pattern and phased deployment variable pattern duplicated with skills
- **Recommendation**: Extract bootstrap scripts to `references/` files; remove duplicated patterns from body; defer `microsoft-code-reference`; target body < 300 lines
- **Estimated Impact**: ~2,500 tokens (body) + ~3,000 (deferred skills) = ~5,500

### 07b-Bicep Deploy (386 lines total, body: 282 lines)

- **Issue**: 10 fenced code blocks (most of any agent) spanning ~40 lines of preflight CLI commands; auth validation section duplicated with 07t; 3 of 5 Known Issues rows shared with 07t
- **Evidence**: Extensive inline Azure CLI command sequences; nearly identical auth block
- **Recommendation**: Extract shared deploy patterns and auth validation to a skill section; consolidate Known Issues
- **Estimated Impact**: ~600 tokens

### 07t-Terraform Deploy (394 lines total, body: 295 lines)

- **Issue**: 9 fenced code blocks; same auth and Known Issues duplication as 07b
- **Evidence**: Terraform init/plan/apply command sequences inline; auth validation duplicated
- **Recommendation**: Same consolidation as 07b
- **Estimated Impact**: ~600 tokens

### 08-As-Built (266 lines total, body: 189 lines)

- **Issue**: Within guidelines; no significant issues found
- **Recommendation**: None — well-structured agent with reasonable context load

### challenger-review-subagent (323 lines total, body: 315 lines)

- **Issue**: 315-line body is nearly all inline content with a 70-line checklist covering all artifact types; loads 3 full skills per invocation and runs 10-15 times per workflow
- **Evidence**: 16,449 chars body; loads `azure-defaults` (701 lines) + `azure-artifacts` (613 lines); called repeatedly across Steps 2-5
- **Recommendation**: Split checklists into `references/{artifact_type}.md` loaded on-demand; use progressive-loaded skill quick-refs
- **Estimated Impact**: ~5,000 tokens/invocation × 12 average invocations = **~60,000 tokens/workflow**

---

## Implementation Priority

| Priority | Action                                                                                 | Effort | Impact   |                          Savings Estimate |
| :------: | -------------------------------------------------------------------------------------- | ------ | -------- | ----------------------------------------: |
|  **P0**  | Split `azure-defaults/SKILL.md` into quick-ref + `references/`                         | Medium | Critical | ~3,000/invocation × 15 = ~45,000/workflow |
|  **P0**  | Split `azure-artifacts/SKILL.md` into quick-ref + `references/`                        | Medium | Critical | ~3,200/invocation × 15 = ~48,000/workflow |
|  **P1**  | Optimize `challenger-review-subagent` — progressive load + per-artifact checklists     | Medium | High     | ~5,000/invocation × 12 = ~60,000/workflow |
|  **P1**  | Trim `06t-terraform-codegen.agent.md` body from 432 to < 300 lines; extract scripts    | Low    | High     |       ~2,500 body tokens + deferred loads |
|  **P1**  | Narrow `code-commenting.instructions.md` glob from `"**"` to code files only           | Low    | High     |                            ~1,200/session |
|  **P1**  | Narrow `governance-discovery.instructions.md` — remove `**/*.bicep, **/*.tf` from glob | Low    | High     |                            ~1,500/session |
|  **P2**  | Split `session-resume/SKILL.md` into quick-ref + `references/`                         | Medium | Medium   |                         ~2,500/invocation |
|  **P2**  | Split `terraform-patterns/SKILL.md` into overview + `references/`                      | Medium | Medium   |                        ~2,500 when loaded |
|  **P2**  | Extract adversarial review boilerplate to shared instruction                           | Low    | Medium   |              ~1,250 total across 5 agents |
|  **P2**  | Split `cost-estimate.instructions.md` (414 lines)                                      | Low    | Medium   |                        ~2,500 when loaded |
|  **P2**  | Split `terraform-code-best-practices.instructions.md` (393 lines)                      | Low    | Medium   |                        ~2,000 when loaded |
|  **P2**  | Split `code-review.instructions.md` (313 lines)                                        | Low    | Medium   |                        ~1,500 when loaded |
|  **P2**  | Remove `**/*.agent.md` from bicep/terraform policy compliance globs                    | Low    | Medium   |                           ~260/agent-edit |
|  **P3**  | Extract 01-Conductor inline handoff template                                           | Low    | Low      |                                      ~100 |
|  **P3**  | Consolidate Known Issues across 07b/07t                                                | Low    | Low      |                                      ~150 |
|  **P3**  | Move HCP GUARDRAIL to `terraform-patterns/SKILL.md`                                    | Low    | Low      |                                       ~50 |

---

## Audit Coverage

| Category          | Total Files | Audited | Notes                         |
| ----------------- | ----------: | ------: | ----------------------------- |
| Agent definitions |          23 |      23 | 14 top-level + 9 subagents    |
| Instruction files |          26 |      26 | All `.instructions.md` files  |
| Skill files       |          17 |      17 | All `SKILL.md` files          |
| Chat log sessions |           1 |       1 | ~4-hour session, 530 requests |

---

## Quality Checklist

- [x] Baseline snapshot created before analysis (`ctx-opt-20260302-130935`)
- [x] All 23 agent definitions analyzed
- [x] All 26 instruction files audited
- [x] All 17 skills audited
- [x] Log parser ran successfully (1 session, 530 requests)
- [x] Report follows optimization-report template
- [x] Findings prioritized P0 → P3 (5 Critical, 9 High, 10 Medium, 5 Low)
- [x] Token savings estimates included for each recommendation
- [ ] Diff report generated after changes applied (Phase 6 — pending)

---

## Phase 6: Diff Report

No changes have been applied yet. To generate the before/after diff report after implementing recommendations, run:

```bash
npm run diff:baseline -- --baseline ctx-opt-20260302-130935
```

The full diff report will be saved to `agent-output/_baselines/ctx-opt-20260302-130935/diff-report.md`.

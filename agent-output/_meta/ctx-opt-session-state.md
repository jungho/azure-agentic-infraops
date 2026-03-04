# Context Optimization — Session State

> **Last Updated**: 2026-03-04
> **Branch**: `ctx-opt/milestone-1`
> **Purpose**: Full state capture for session resume without context loss

---

## Overall Progress

| Phase | Title                          | Status          | Commit    | Notes                                                                        |
| ----: | ------------------------------ | --------------- | --------- | ---------------------------------------------------------------------------- |
|     0 | Baseline & KPI Definition      | **complete**    | `fcb4327` | Removed phantom refs, tagged `ctx-opt-m1-baseline`                           |
|     1 | P0 Skill Splits                | **complete**    | `b0de949` | azure-defaults 702→141, azure-artifacts 614→102, 16 ref files, 9 skill descs |
|     2 | Instruction Optimization+Dedup | **complete**    | `d883b37` | Glob narrows, cross-agent dedup, sharing framework                           |
|     3 | Instruction Splits             | **complete**    | `97e0dcb` | 5 instruction files: 1660→389 lines (77% reduction)                          |
|     4 | Error Rate & Burst Reduction   | **complete**    | `85c4a8b` | Remediation messages added to 4 validators                                   |
|     5 | Agent Body Optimization        | **complete**    | `d0b142a` | 7 agents trimmed (6416→5574), 3 ref files, Boundaries on all 14    |
|     6 | M1 Measurement Gate            | not-started     | —         | —                                                                            |

**Branch history**: `fcb4327` → `b0de949` → `d883b37` → `97e0dcb` → `85c4a8b` → `d0b142a` (HEAD)

---

## Phase 5 Detailed Plan (Current Focus)

Phase 5 has 3 sub-parts. None have been implemented yet — only research was completed.

### 5.1 — Trim Agent Bodies

#### 06t-terraform-codegen (501 lines → target <300)

This is the largest agent file. Specific extraction plan:

**A. Remove duplicate HCL (~55 lines)**:

- Lines ~416-437: `locals.tf` pattern — duplicates `terraform-patterns/SKILL.md`
- Lines ~439-464: Phased deployment pattern — duplicates skill
- Lines ~240-249: Phase 2 snippet — also duplicated

**B. Extract scripts to references (~70 lines)**:

- Lines ~280-312: Bootstrap scripts → create `terraform-patterns/references/bootstrap-backend-template.md`
- Lines ~314-350: Deploy scripts → create `terraform-patterns/references/deploy-script-template.md`

**C. HCP GUARDRAIL**: Keep the 4-line block inline (lines 104-107). Remove redundant DON'T bullets that just restate it.

**D. Defer microsoft-code-reference** (lines 118-119): Move to Phase 1 step instead of upfront read.

**E. Trim prose (~70 lines)**:

- DO/DON'T section → compact table (remove 8+ redundant bullets, ~15 lines saved)
- Phase 2 rounds → 4-row table (~12 lines saved)
- Phase 4/4.5 adversarial → reference pointer (~25 lines saved)
- File Structure tree → extract to `terraform-patterns/references/project-scaffold.md` (~15 lines saved)

**MUST KEEP inline**: HCP GUARDRAIL, MANDATORY Read Skills, Prerequisites, Session State, Phase 1 Preflight, Phase 1.5 Governance.

Estimated result: ~300 lines (97 frontmatter + ~203 body).

#### 05t-terraform-planner (443 lines → target <300)

**A. Remove duplicate HCL (~40 lines)**:

- Lines ~332-348: Backend config — already in skills
- Lines ~358-377: Provider requirements — already in skills
- Lines ~352-356: Resource naming — already in skills

**C. HCP GUARDRAIL**: Keep inline, remove redundant DON'T bullets (~3 lines saved)

**D. Defer terraform-patterns** skill read to Phase 2 instead of upfront.

**E. Trim prose (~105 lines)**:

- DO/DON'T → table (~15 lines saved)
- Phase 3 deprecation checks → 3 lines + pointer (~8 lines saved)
- Phase 3.5 deployment strategy → compact table (~12 lines saved)
- Phase 4.3/4.5/5 adversarial + approval → reference pointers (~20 lines saved)
- Terraform-Specific Concerns entire section → pointer to skills (~40 lines saved)
- Phase 4 prose trim (~10 lines saved)

Estimated result: ~295 lines (84 frontmatter + ~211 body).

#### Other agents (less detail needed)

| Agent                | Current | Target | Key Actions                                                                           |
| -------------------- | ------- | ------ | ------------------------------------------------------------------------------------- |
| 06b-bicep-codegen    | 396     | <300   | Defer microsoft-code-reference, remove duplicated patterns                            |
| 07b-bicep-deploy     | 364     | ~350   | Consolidate shared Known Issues into reference                                        |
| 07t-terraform-deploy | 381     | ~350   | Consolidate shared Known Issues into reference                                        |
| 01-conductor         | 460     | <430   | Extract 30-line handoff template → `azure-artifacts/templates/00-handoff.template.md` |

#### New reference files to create

| File                                                          | Source                             | Content                                |
| ------------------------------------------------------------- | ---------------------------------- | -------------------------------------- |
| `terraform-patterns/references/bootstrap-backend-template.md` | 06t lines ~280-312                 | Bootstrap script templates (bash + PS) |
| `terraform-patterns/references/deploy-script-template.md`     | 06t lines ~314-350                 | Deploy script templates (bash + PS)    |
| `terraform-patterns/references/project-scaffold.md`           | 06t file structure tree + patterns | Standard project layout                |

### 5.2 — Add Three-Tier Boundaries

Add to all 14 top-level agents:

```markdown
## Boundaries

- **Always**: {autonomous actions for this agent}
- **Ask first**: {human-approval actions}
- **Never**: {hard constraints}
```

Top-level agents: 01, 02, 03, 04, 05b, 05t, 06b, 06t, 07b, 07t, 08, 09, 10, 11

### 5.3 — Surface Commands Early

Ensure key commands section appears right after core workflow in all trimmed agents, not buried deep.

---

## Current File Sizes (as of 2026-03-03)

### Agent Files

| File                       | Lines    |
| -------------------------- | -------- |
| 01-conductor               | 398      |
| 06t-terraform-codegen      | 242      |
| 05t-terraform-planner      | 239      |
| 06b-bicep-codegen          | 235      |
| 05b-bicep-planner          | 265      |
| 07t-terraform-deploy       | 323      |
| 07b-bicep-deploy           | 305      |
| 03-architect               | 383      |
| 02-requirements            | 361      |
| challenger-review-subagent | 323      |
| 11-context-optimizer       | 285      |
| 09-diagnose                | 273      |
| 08-as-built                | 272      |
| tf-review-subagent         | 236      |
| bicep-review-subagent      | 225      |
| 04-design                  | 211      |
| gov-discovery-subagent     | 200      |
| cost-est-subagent          | 183      |
| tf-plan-subagent           | 150      |
| bicep-whatif-subagent      | 147      |
| tf-lint-subagent           | 112      |
| 10-challenger              | 91       |
| **Total**                  | **5574** |

### Instruction Files (post-Phase 3 sizes)

| File                                       | Lines | Phase 3 Change |
| ------------------------------------------ | ----- | -------------- |
| azure-artifacts.instructions               | 70    | 284→70         |
| code-review.instructions                   | 67    | 313→67         |
| cost-estimate.instructions                 | 73    | 414→73         |
| markdown.instructions                      | 77    | 256→77         |
| terraform-code-best-practices.instructions | 102   | 393→102        |

### Skill Files (post-Phase 1 sizes)

| File                     | Lines | Phase 1 Change              |
| ------------------------ | ----- | --------------------------- |
| azure-defaults/SKILL.md  | 144   | 702→141 (Phase 1), then 144 |
| azure-artifacts/SKILL.md | 102   | 614→102                     |

---

## Reference Files Created (Phases 1-3)

### Skills references (Phase 1)

- `azure-defaults/references/` — 11 files (service-matrices, pricing-guidance, security-baseline-full, naming-full-examples, waf-criteria, governance-discovery, terraform-conventions, azure-cli-auth-validation, research-workflow, adversarial-review-protocol, policy-effect-decision-tree, avm-modules)
- `azure-artifacts/references/` — 8 files (01-07 step templates + styling-standards + cost-estimate-sections)

### Instruction references (Phase 3)

- `instructions/references/code-review-checklists.md` (211 lines)
- `instructions/references/markdown-formatting-guide.md` (176 lines)

### Skill references added in Phase 3

- `azure-artifacts/references/cost-estimate-sections.md` (357 lines)
- `terraform-patterns/references/tf-best-practices-examples.md` (205 lines)

### Skill references added in Phase 5

- `terraform-patterns/references/bootstrap-backend-template.md` (bootstrap scripts)
- `terraform-patterns/references/deploy-script-template.md` (deploy scripts)
- `terraform-patterns/references/project-scaffold.md` (file structure + patterns)

---

## Known Issues & Gotchas

### Untracked file modifications

`.devcontainer/README.md` and `docs/dev-containers.md` appear as modified from the parent branch. Always run `git reset HEAD -- .devcontainer/README.md docs/dev-containers.md` before commits to exclude these.

### Session tracker not fully updated

The `plan-agenticWorkflowOverhaul.prompt.md` tracker still shows Phases 3-5 as `not-started` — it was last updated after Phase 2. It needs to be updated to reflect Phases 3-4 as complete and Phase 5 as in-progress.

### Missing baseline error data

`/tmp/context-audit.json` (original session error data) no longer exists. Phase 4 item 1 (audit 30 failed requests) was skipped. Context reduction from Phases 1-3 addresses the root cause.

### H2 sync validator adjustment

Phase 3 required making H2-reference source optional in `validate-h2-sync.mjs` since heading blocks moved from instruction files to skill reference files.

### Commit hooks

lefthook v2.1.0 — pre-commit (markdown-lint + validators), commit-msg (commitlint: conventional commits, body lines ≤100 chars), post-commit (deprecated-refs, json-syntax, version-sync). These run automatically on every commit.

---

## Validation Status

All phases validated with `npm run validate:all` passing. Suite chains 17 validators.

---

## Plan File Locations

| File                                                      | Purpose                                      |
| --------------------------------------------------------- | -------------------------------------------- |
| `.github/prompts/plan-ctxopt/m1-core-optimization.md`     | Phase 0-6 detailed specs (242 lines)         |
| `.github/prompts/plan-ctxopt/m2-extended-optimization.md` | Phase 7-9 specs                              |
| `.github/prompts/plan-ctxopt/m3-new-capabilities.md`      | Phase 10-12 specs                            |
| `.github/prompts/plan-ctxopt/appendix-decisions.md`       | Decision log                                 |
| `.github/prompts/plan-ctxopt/appendix-findings.md`        | Findings traceability                        |
| `.github/prompts/plan-agenticWorkflowOverhaul.prompt.md`  | Session resume prompt (needs tracker update) |
| `agent-output/_meta/11-context-optimization-report.md`    | Original analysis report                     |
| `agent-output/_meta/11-implementation-plan.md`            | Original implementation plan                 |

---

## Resume Checklist

When resuming in a new session:

1. Read THIS file first
2. Verify branch: `git branch --show-current` → should be `ctx-opt/milestone-1`
3. Verify HEAD: `git log --oneline -1` → should be `d0b142a`
4. Current task: **Phase 6** — M1 Measurement Gate
5. Re-run e2e conductor test from Phase 0 with the same project/prompt
6. Parse chat logs, measure 3 KPIs against baseline
7. Document results in M1 PR description
8. Create M1 PR from `ctx-opt/milestone-1` → `main`

---

## KPI Targets

| KPI              | Baseline                            | Target    |
| ---------------- | ----------------------------------- | --------- |
| Avg latency/turn | 11,792ms (Opus) / 11,379ms (Sonnet) | <8,000ms  |
| P95 latency      | 28,561ms                            | <15,000ms |
| Burst sequences  | 123                                 | <60       |

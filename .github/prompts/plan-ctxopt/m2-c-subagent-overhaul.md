# M2-C: Subagent Overhaul + iac-common (Phase 9)

> **Branch**: `ctx-opt/milestone-2` | **Effort**: 3-4 hrs | **Risk**: Medium
> **Prerequisite**: Phase 8 complete

---

## Objective

Restructure subagents to use shared references, create the `iac-common`
skill, and run M2 measurement gate.

## 9.1 — Restructure Challenger Review Subagent

| Current | Target | Actions |
|---------|--------|---------|
| 315-line body | <100 lines | Split 70-line checklist into per-artifact `references/` files; use progressive-loaded quick-refs from Phase 1 |

## 9.2 — Golden Principles Integration

| Agent | Change |
|-------|--------|
| `01-conductor` | Make `golden-principles/SKILL.md` a mandatory first-read |
| `challenger-review-subagent` | Make `golden-principles/SKILL.md` a mandatory first-read |

## 9.3 — Create `iac-common` Skill

**Hard cap: 150 lines** (enforced by Phase 7 validator).

| Content | Source |
|---------|--------|
| Azure CLI auth validation | Extracted from 07b, 07t in Phase 2 |
| Deploy patterns shared between Bicep and Terraform | Consolidated from 07b, 07t |
| Known Issues table | Consolidated from 07b, 07t |
| Governance-to-code property mapping reference | New cross-cutting content |

## 9.4 — Trim Review Subagents

| Subagent | Current | Target | Action |
|----------|---------|--------|--------|
| `bicep-review-subagent` | 226 lines | ≤150 | Extract AVM standards, naming, security → reference `azure-defaults` quick-ref + `iac-common` |
| `terraform-review-subagent` | 237 lines | ≤150 | Same pattern |

## 9.5 — M2 Measurement Gate

- [ ] Canary prompt test of challenger on a sample artifact
- [ ] Re-run KPIs, compare against M1 results
- [ ] Create M2 PR from `ctx-opt/milestone-2` → `main`

## Acceptance Criteria

- [ ] Challenger subagent <100 lines
- [ ] `iac-common` skill created, ≤150 lines
- [ ] Both review subagents ≤150 lines
- [ ] `npm run validate:all` passes

## Adversarial Review Gate

Run 2x reviews on iac-common skill, challenger restructure,
golden-principles integration.

## Validation

```bash
npm run validate:all
```

# M3-C: Final Measurement & Ship (Phase 12)

> **Branch**: `ctx-opt/milestone-3` | **Effort**: 2 hrs | **Risk**: None
> **Prerequisite**: Phases 10-11 complete

---

## Objective

Run final measurement, compare all KPIs across milestones, and ship.

## Tasks

| # | Action |
|---|--------|
| 1 | Re-run full e2e conductor test |
| 2 | Compare all KPI measurements: Phase 0 baseline → M1 → M2 → M3 |
| 3 | Generate final diff report via `npm run diff:baseline` |
| 4 | Create M3 PR from `ctx-opt/milestone-3` → `main` with measurement comparison table |
| 5 | Update `QUALITY_SCORE.md` to reflect improvements |

## Acceptance Criteria

- [ ] KPI comparison table: Phase 0 → M1 → M2 → M3
- [ ] Final diff report generated
- [ ] `QUALITY_SCORE.md` updated
- [ ] M3 PR created with full measurement data
- [ ] `npm run validate:all` passes

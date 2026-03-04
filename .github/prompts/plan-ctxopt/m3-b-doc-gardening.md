# M3-B: Doc-Gardening & GC Automation (Phase 11)

> **Branch**: `ctx-opt/milestone-3` | **Effort**: 3-4 hrs | **Risk**: Low
> **Prerequisite**: Phase 10 complete

---

## Objective

Automate staleness detection and context auditing so optimization
gains are maintained over time.

## Tasks

| # | Action |
|---|--------|
| 1 | Add `lint:docs-freshness` to weekly GitHub Actions cron → opens issue when staleness detected |
| 2 | Create quarterly context audit cadence: checklist/script that re-runs the context optimizer skill every 3 months |
| 3 | Extend `check-docs-freshness.mjs` to cover skills and `references/` files |
| 4 | Fix any remaining phantom references found by `validate-orphaned-content.mjs` |

## Acceptance Criteria

- [ ] GitHub Actions workflow created with weekly cron for freshness
- [ ] `check-docs-freshness.mjs` covers skills and references
- [ ] Quarterly audit checklist documented
- [ ] No orphaned references remain
- [ ] `npm run validate:all` passes

## Validation

```bash
npm run validate:all
```

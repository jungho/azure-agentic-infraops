# M2-A: CI Enforcement Validators (Phase 7)

> **Branch**: `ctx-opt/milestone-2` | **Effort**: 4-5 hrs | **Risk**: Low
> **Prerequisite**: M1 PR #200 merged

---

## Objective

Create 5 new validators that enforce the structural rules established
in M1, preventing context bloat regression.

## Validators to Create

| # | Validator | Rule | Remediation |
|---|-----------|------|-------------|
| 1 | `validate-skill-size.mjs` | SKILL.md >200 lines needs `references/` | "Move content to `references/`" |
| 2 | `validate-agent-body-size.mjs` | Agent body >350 lines | "Extract to skill refs or scripts" |
| 3 | `validate-glob-audit.mjs` | Warn `applyTo: "**"` if >50 lines | "Narrow glob to extensions" |
| 4 | `validate-skill-references.mjs` | All `references/` paths resolve; no orphans | "Add directive or remove file" |
| 5 | `validate-orphaned-content.mjs` | Detect unreferenced skills/instructions | "Add reference or delete" |

## Additional Tasks

- [ ] Register all 5 validators in `package.json` `validate:all` chain
- [ ] Add `lint:docs-freshness` to `validate:all` (currently excluded)

## Acceptance Criteria

- [ ] All 5 validators implemented with remediation-rich error messages
- [ ] `npm run validate:all` includes all new validators and passes
- [ ] Existing agent/skill/instruction files pass all new size checks

## Validation

```bash
npm run validate:all  # all new + existing validators pass
```

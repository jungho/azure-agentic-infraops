# M2-B: Remaining Skill Splits (Phase 8)

> **Branch**: `ctx-opt/milestone-2` | **Effort**: 3-4 hrs | **Risk**: Low
> **Prerequisite**: Phase 7 complete

---

## Objective

Split remaining large skills into compact SKILL.md + `references/`
using the same pattern established in M1 Phase 1.

## Prioritization

| Priority | Skill | Lines | Load Frequency | Action |
|----------|-------|-------|----------------|--------|
| **High** | `session-resume` | 345 | Every agent (10+) | Split → ≤80 lines + `references/recovery-protocol.md` |
| **High** | `terraform-patterns` | 510 | 2 agents but large | Split → ≤100 lines + `references/` per pattern |
| **High** | `azure-bicep-patterns` | 305 | 2 agents | Split → ≤100 lines + `references/` per pattern |
| **Medium** | `azure-troubleshooting` | 271 | 1 agent | Split KQL templates to `references/` |
| **Medium** | `azure-diagrams` | 551 | 3 agents | Already has references/; trim SKILL.md to ≤150 |
| **Low** | `github-operations` | 306 | On-demand | Defer |
| **Low** | `azure-adr` | 263 | 1 agent | Defer |
| **Low** | `make-skill-template` | 262 | Utility | Defer |
| **Low** | `microsoft-skill-creator` | 231 | Utility | Defer |
| **Skip** | `golden-principles` | 122 | Compact enough | No split needed |
| **Skip** | `git-commit` | 129 | Compact enough | No split needed |
| **Skip** | `microsoft-code-reference` | 82 | Compact enough | No split needed |
| **Skip** | `microsoft-docs` | 59 | Compact enough | No split needed |

## Per-Skill Checklist

For each split:

- [ ] Create `references/` directory if not exists
- [ ] Move detailed content to reference files with `<!-- ref:{name}-v1 -->` canary markers
- [ ] Trim SKILL.md to target size with Reference Index section
- [ ] Update `description` frontmatter for trigger optimization
- [ ] Run `npm run lint:skills-format`

## Acceptance Criteria

- [ ] All High + Medium skills split to target sizes
- [ ] Each reference file has a canary marker
- [ ] `npm run validate:all` passes

## Validation

```bash
npm run lint:skills-format
npm run validate:all
```

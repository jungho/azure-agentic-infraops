# M3-A: Challenger Model & Fast Path (Phase 10)

> **Branch**: `ctx-opt/milestone-3` | **Effort**: 4-5 hrs | **Risk**: High
> **Prerequisite**: M2 merged

---

## Objective

Evaluate challenger model change and implement complexity-based fast
path as a separate experimental conductor.

## 10.1 — Challenger Model Change

| Current Model | Target Model | Required Before Shipping |
|---------------|-------------|--------------------------|
| GPT-5.3-Codex | Claude Sonnet 4.6 | Controlled A/B comparison on one existing artifact |

- [ ] Apply tiered approach: Sonnet for 3-pass rotating-lens reviews
  (Steps 2, 4, 5); evaluate for single-pass reviews (Steps 1, 6)
- [ ] Document model selection rationale in the agent's frontmatter

## 10.2 — Complexity-Based Fast Path

| Component | Action |
|-----------|--------|
| Requirements output | Add `complexity: simple / standard / complex` field |
| Threshold criteria | `simple` ≤3 resources, no custom policies, single env; `standard` 4-20; `complex` 20+ or PCI-DSS |
| Implementation | **Separate experimental conductor** (`01-conductor-fastpath.agent.md`) — NOT inline in main Conductor |
| Simple path | 1-pass comprehensive review, skip governance discovery, combine Plan+Code |
| Promotion | After validation, merge approach into main Conductor |

## Acceptance Criteria

- [ ] A/B model comparison documented with results
- [ ] `01-conductor-fastpath.agent.md` created and functional
- [ ] Full e2e test on both simple and complex projects
- [ ] `npm run validate:all` passes

## Adversarial Review Gate

Run 2x reviews on experimental conductor and model comparison results.
Verify fast path doesn't break normal path and model quality is demonstrated.

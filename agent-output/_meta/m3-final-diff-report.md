# Context Optimization Diff Report

**Baseline**: m1-baseline-main (2026-03-04T06:46:56Z, git: dd5c19a)
**Current**: 2026-03-04T15:31:34Z (git: d9a1f45)

## Summary

| Metric | Count |
| ------ | ----- |
| Files added | 51 |
| Files modified | 61 |
| Files deleted | 0 |
| Files unchanged | 70 |
| **Total files compared** | **182** |
| Lines added | +5902 |
| Lines removed | -4825 |
| **Net line change** | **1077** |

## By Category

| Category | Added | Modified | Deleted | Unchanged |
| -------- | ----- | -------- | ------- | --------- |
| Agents | 1 | 17 | 0 | 6 |
| Instructions | 2 | 9 | 0 | 17 |
| Prompts | 6 | 4 | 0 | 17 |
| Skills | 42 | 30 | 0 | 30 |
| AGENTS.md | 0 | 1 | 0 | 0 |


## Detailed Changes

### Agents

#### Modified: `.github/agents/01-conductor.agent.md` (+37/-44)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/01-conductor.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/01-conductor.agent.md	2026-03-04 14:49:25.377606977 +0000
@@ -156,9 +156,10 @@
 
 **After confirming the project name**, read:
 
-1. **Read** `.github/skills/session-resume/SKILL.md` — JSON state schema, context budgets, resume protocol
-2. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags
-3. **Read** `.github/skills/azure-artifacts/SKILL.md` — artifact file naming and structure overview
+1. **Read** `.github/skills/golden-principles/SKILL.md` — foundational quality principles for all agents
+2. **Read** `.github/skills/session-resume/SKILL.md` — JSON state schema, context budgets, resume protocol
+3. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags
+4. **Read** `.github/skills/azure-artifacts/SKILL.md` — artifact file naming and structure overview
 
 ## Core Principles
 
@@ -169,28 +170,16 @@
 
 ## DO / DON'T
 
-### DO
-
-- ✅ Pause at EVERY approval gate and wait for explicit user confirmation
-- ✅ Delegate to subagents via `#runSubagent` for each workflow step
-- ✅ Track progress by checking artifact files in `agent-output/{project}/`
-- ✅ Summarize subagent results concisely (don't dump raw output)
-- ✅ Create `agent-output/{project}/` directory at project start
-- ✅ Create `agent-output/{project}/00-session-state.json` from template at project start
-- ✅ Ensure `agent-output/{project}/README.md` exists — Requirements agent creates it, all agents update it
-- ✅ Write `agent-output/{project}/00-handoff.md` at EVERY gate before presenting it to the user
-- ✅ Update `agent-output/{project}/00-session-state.json` at EVERY gate (machine source of truth)
-
-### DON'T
-
-- ❌ Read skills or templates before asking the project folder name via `askQuestions`
-- ❌ Skip approval gates — EVER
-- ❌ Deploy without validation (Deploy agent handles preflight)
-- ❌ Modify files directly — delegate to the appropriate agent
-- ❌ Include raw subagent dumps — summarize and present key findings
-- ❌ Combine multiple steps without approval between them
-- ❌ Skip writing `00-handoff.md` — it is the context seed for thread resumption
-- ❌ Skip updating `00-session-state.json` — it is the machine-readable state for resume
+| ✅ DO                                                               | ❌ DON'T                                                            |
+| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
+| Pause at EVERY approval gate; wait for confirmation                 | Read skills/templates before asking project name via `askQuestions` |
+| Delegate to subagents via `#runSubagent`                            | Skip approval gates — EVER                                          |
+| Track progress via artifact files in `agent-output/{project}/`      | Deploy without validation (Deploy agent handles preflight)          |
+| Summarize subagent results concisely                                | Modify files directly — delegate to appropriate agent               |
+| Create `agent-output/{project}/` + `00-session-state.json` at start | Include raw subagent dumps                                          |
+| Ensure `README.md` exists (Requirements agent creates it)           | Combine multiple steps without approval between them                |
+| Write `00-handoff.md` at EVERY gate before presenting               | Skip `00-handoff.md` or `00-session-state.json` updates             |
+| Update `00-session-state.json` at EVERY gate                        |                                                                     |
 
 ## The 7-Step Workflow
 
@@ -282,73 +271,28 @@
 
 ## Phase Handoff Document
 
-At every approval gate, write `agent-output/{project}/00-handoff.md` **before presenting the gate**.
-This file is a compact project state snapshot that lets the user resume in a fresh chat thread
-without re-summarizing a large conversation history.
+At every approval gate, write `agent-output/{project}/00-handoff.md`
+**before presenting the gate** (compact state snapshot for thread resumption).
 
 ### Format
 
-```markdown
-# {Project} — Handoff (Step {N} complete)
-
-Updated: {ISO timestamp} | IaC: {Bicep | Terraform} | Branch: {git branch}
-
-## Completed Steps
-
-- [x] Step 1: Requirements → `agent-output/{project}/01-requirements.md`
-- [x] Step 2: Architecture → `agent-output/{project}/02-architecture-assessment.md`
-- [ ] Step 3: Design (optional — skipped | complete)
-- [ ] Step 4: IaC Plan
-- [ ] Step 5: IaC Code
-- [ ] Step 6: Deploy
-- [ ] Step 7: As-Built
-
-## Key Decisions
-
-- Region: {region}
-- Compliance: {frameworks or "None"}
-- Budget: {monthly estimate}
-- IaC tool: {Bicep | Terraform}
-- Architecture pattern: {brief description}
-
-## Open Challenger Findings (must_fix only)
-
-{List of unresolved must_fix titles from all challenge-findings-\*.json files, or "None"}
+Header: `# {Project} — Handoff (Step {N} complete)` with metadata line (`Updated: {ISO} | IaC: {tool} | Branch: {branch}`).
 
-## Context for Next Step
+**Required H2 sections:**
 
-{1-3 sentences describing exactly what the next agent needs to know to continue}
+- `## Completed Steps` — checklist with artifact paths (e.g., `- [x] Step 1 → agent-output/{project}/01-requirements.md`)
+- `## Key Decisions` — region, compliance, budget, IaC tool, architecture pattern
+- `## Open Challenger Findings (must_fix only)` — unresolved must_fix titles or "None"
+- `## Context for Next Step` — 1-3 sentences for next agent
+- `## Artifacts` — bulleted list of files in `agent-output/{project}/` and `infra/`
 
-## Artifacts
-
-{Bulleted list of all files that exist in agent-output/{project}/ and infra/}
-```
-
-### Rules
-
-- **Overwrite** on each gate — always reflects the latest state
-- **Never embed file contents** — paths only
-- **Keep under 50 lines** — this is a reference, not a doc
-- **List only unresolved must_fix items** — closed items are noise
+**Rules**: Overwrite on each gate · paths only (never embed content) · under 50 lines · only unresolved must_fix items.
 
 ## Subagent Delegation
 
-Use `#runSubagent` for each workflow step:
-
-| Step | Agent              | Key Prompt                                                                                                      |
-| ---- | ------------------ | --------------------------------------------------------------------------------------------------------------- |
-| 1    | Requirements       | FIRST call askQuestions (Phase 1 Round 1), then guide through all 4 phases before generating 01-requirements.md |
-| 2    | Architect          | Create WAF assessment for requirements in 01-requirements.md                                                    |
-| 3    | Design             | Generate architecture diagrams and ADRs (optional)                                                              |
-| 4    | Bicep Plan         | Create implementation plan for architecture in 02-architecture-assessment.md                                    |
-| 5    | Bicep Code         | Implement Bicep templates per 04-implementation-plan.md                                                         |
-| 6    | Deploy             | Deploy templates in infra/bicep/{project}/ to Azure                                                             |
-| 7    | As-Built           | Generate workload documentation for deployed infrastructure                                                     |
-| 4†   | Terraform Planner  | Create Terraform implementation plan for architecture in 02-architecture-assessment.md                          |
-| 5†   | Terraform Code Gen | Implement Terraform configuration per 04-implementation-plan.md                                                 |
-| 6†   | Terraform Deploy   | Deploy Terraform config in infra/terraform/{project}/ to Azure                                                  |
-
-† Terraform path — used when `iac_tool: Terraform` in `01-requirements.md`.
+Use `#runSubagent` to delegate each step. Step→Agent mapping follows
+the handoff labels above; Terraform path (Steps 4†/5†/6†) used when
+`iac_tool: Terraform` in `01-requirements.md`.
 
 ### Subagent Integration
 
@@ -393,17 +337,14 @@
 
 ## Starting a New Project
 
-1. **Ask for the project folder name** — ALWAYS use `askQuestions` to prompt:
-   - Derive a suggested folder name from the user's project description (lowercase, kebab-case, max 30 chars, e.g. `payment-gateway-poc`)
-   - Present the suggestion as the recommended option
-   - Enable free-form input so the user can type their own preferred name
-   - Example question: _"What should I name the project folder? This will be used for `agent-output/{name}/` and `infra/{iac_tool}/{name}/`."_
-   - NEVER silently pick a name — the user must always confirm or override
+1. **Ask for the project folder name** via `askQuestions` — suggest a kebab-case name
+   (max 30 chars, e.g. `payment-gateway-poc`) derived from description;
+   user must confirm or override (NEVER silently pick a name)
 2. Create `agent-output/{project-name}/`
-3. Create `agent-output/{project-name}/00-session-state.json` from
+3. Create `00-session-state.json` from
    `.github/skills/azure-artifacts/templates/00-session-state.template.json`
-   — set `project`, `branch`, `updated`, and `current_step: 1`
-4. Delegate to Requirements agent for Step 1 (creates initial `README.md` from PROJECT-README template)
+   — set `project`, `branch`, `updated`, `current_step: 1`
+4. Delegate to Requirements agent for Step 1 (creates initial `README.md`)
 5. Wait for Gate 1 approval
 
 ## Resuming a Project
@@ -458,3 +399,9 @@
 | Terraform Deploy   | GPT-5.3-Codex            | Deployment execution |
 | As-Built           | GPT-5.3-Codex            | Documentation gen    |
 | Subagents          | GPT-5.3-Codex            | Fast validation      |
+
+## Boundaries
+
+- **Always**: Follow 7-step workflow order, require approval at gates, delegate to specialized agents
+- **Ask first**: Skipping optional steps, changing IaC tool choice, deviating from workflow
+- **Never**: Generate IaC code directly, skip approval gates, bypass governance discovery
```

#### Modified: `.github/agents/02-requirements.agent.md` (+4/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/02-requirements.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/02-requirements.agent.md	2026-03-04 06:47:05.099983781 +0000
@@ -339,6 +339,12 @@
 
 If `askQuestions` is unavailable, gather via chat questions instead.
 
+## Boundaries
+
+- **Always**: Gather requirements through structured questions, validate completeness, save to `01-requirements.md`
+- **Ask first**: Scope expansions, tech stack changes, non-standard compliance requirements
+- **Never**: Make architecture decisions, generate IaC code, skip requirements validation
+
 ## Validation Checklist
 
 Before saving the requirements document:
```

#### Modified: `.github/agents/03-architect.agent.md` (+8/-20)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/03-architect.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/03-architect.agent.md	2026-03-04 06:47:05.099983781 +0000
@@ -289,42 +289,22 @@
 ## Adversarial Review — 3-Pass Architecture + 1-Pass Cost Estimate
 
 After generating the assessment and cost estimate, run adversarial reviews.
+Read `azure-defaults/references/adversarial-review-protocol.md` for the
+lens table, compact prior_findings guidance, and invocation template.
 
 ### Architecture Review (3 passes — rotating lenses)
 
-| Pass | `review_focus`             | Lens Description                                            |
-| ---- | -------------------------- | ----------------------------------------------------------- |
-| 1    | `security-governance`      | Policy compliance, identity, network isolation, encryption  |
-| 2    | `architecture-reliability` | WAF balance, SLA feasibility, failure modes, dependencies   |
-| 3    | `cost-feasibility`         | SKU sizing, pricing realism, budget alignment, reservations |
-
 For each pass, invoke `challenger-review-subagent` via `#runSubagent`:
 
 - `artifact_path` = `agent-output/{project}/02-architecture-assessment.md`
 - `project_name` = `{project}`
 - `artifact_type` = `architecture`
-- `review_focus` = per-pass value from table above
+- `review_focus` = per-pass value from protocol lens table
 - `pass_number` = `1` / `2` / `3`
-- `prior_findings` = `null` for pass 1; **compact prior findings string for passes 2-3** (see below)
+- `prior_findings` = `null` for pass 1; compact string for passes 2-3
 
 Write each result to `agent-output/{project}/challenge-findings-architecture-pass{N}.json`.
 
-> [!IMPORTANT]
-> **Context efficiency — compact prior_findings**
->
-> After writing each pass result to disk, **do NOT keep the full JSON in working context**.
-> Extract only the `compact_for_parent` string from the subagent response and discard the rest.
->
-> For passes 2 and 3, set `prior_findings` to a compact multi-line string built from
-> previous `compact_for_parent` values — **not the full JSON objects**:
->
-> ```text
-> prior_findings: "Pass 1: <compact_for_parent>\nPass 2: <compact_for_parent>"
-> ```
->
-> This prevents each subagent call from re-injecting thousands of tokens of prior findings
-> into the parent context. The full detail is already saved to disk.
-
 ### Cost Estimate Review (1 pass)
 
 After architecture passes, invoke `challenger-review-subagent` once more:
@@ -382,6 +362,12 @@
 
 Include attribution header from the template file (do not hardcode).
 
+## Boundaries
+
+- **Always**: Evaluate against WAF pillars, generate cost estimates, document architecture decisions
+- **Ask first**: Non-standard SKU/tier selections, deviation from Well-Architected recommendations
+- **Never**: Generate IaC code, skip WAF evaluation, deploy infrastructure
+
 ## Validation Checklist
 
 - [ ] All 5 WAF pillars scored with rationale and confidence level
```

#### Modified: `.github/agents/04-design.agent.md` (+4/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/04-design.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/04-design.agent.md	2026-03-04 06:47:05.099983781 +0000
@@ -195,6 +195,12 @@
 
 Include attribution: `> Generated by design agent | {YYYY-MM-DD}`
 
+## Boundaries
+
+- **Always**: Generate architecture diagrams, create ADRs for key decisions, follow diagram skill patterns
+- **Ask first**: Non-standard diagram formats, skipping ADRs for minor decisions
+- **Never**: Generate IaC code, make architecture decisions without ADR, skip diagram generation
+
 ## Validation Checklist
 
 - [ ] Architecture assessment read before generating artifacts
```

#### Modified: `.github/agents/05b-bicep-planner.agent.md` (+71/-116)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/05b-bicep-planner.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/05b-bicep-planner.agent.md	2026-03-04 06:47:05.099983781 +0000
@@ -107,48 +107,29 @@
 
 ## DO / DON'T
 
-### DO
-
-- ✅ Verify Azure connectivity (`az account show`) FIRST — governance is a hard gate
-- ✅ Use REST API for policy discovery (includes management group-inherited policies)
-- ✅ Validate REST API count matches Azure Portal (Policy > Assignments) total
-- ✅ Run governance discovery via REST API + ARG BEFORE planning (see azure-defaults skill)
-- ✅ Check AVM availability for EVERY resource via `mcp_bicep_list_avm_metadata`
-- ✅ Use AVM module defaults for SKUs — add deprecation research only for overrides
-- ✅ Check service deprecation status for non-AVM / custom SKU selections
-- ✅ Include governance constraints in the implementation plan
-- ✅ Define tasks as YAML-structured specs (resource, module, dependencies, config)
-- ✅ Generate both `04-implementation-plan.md` and `04-governance-constraints.md`
-- ✅ Auto-generate Step 4 diagrams in the same run:
-  - `04-dependency-diagram.py` + `04-dependency-diagram.png`
-  - `04-runtime-diagram.py` + `04-runtime-diagram.png`
-- ✅ Match H2 headings from azure-artifacts skill exactly
-- ✅ Update `agent-output/{project}/README.md` — mark Step 4 complete, add your artifacts (see azure-artifacts skill)
-- ✅ Ask user for deployment strategy (phased vs single) — MANDATORY GATE
-- ✅ Default recommendation: phased deployment (especially for >5 resources)
-- ✅ Wait for user approval before handoff to bicep-code
-
-### DON'T
-
-- ❌ Write ANY Bicep code — this agent plans, bicep-code implements
-- ❌ Skip governance discovery — this is a HARD GATE, not optional
-- ❌ Generate the implementation plan before asking the user about deployment strategy (Phase 3.5 `askQuestions` is mandatory)
-- ❌ Use `az policy assignment list` alone — it misses management group-inherited policies
-- ❌ Proceed with incomplete policy data (if REST API fails, STOP)
-- ❌ Assume SKUs are valid without checking deprecation status
-- ❌ Hardcode SKUs without AVM verification or live deprecation research
-- ❌ Proceed to bicep-code without explicit user approval
-- ❌ Add H2 headings not in the template (use H3 inside nearest H2)
-- ❌ Ignore policy `effect` field — `Deny` = blocker, `Audit` = warning only
-- ❌ Generate governance constraints from best-practice assumptions
+| DO                                                                             | DON'T                                                        |
+| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
+| Verify Azure connectivity (`az account show`) FIRST                            | Write ANY Bicep code — this agent plans only                 |
+| Use REST API for policy discovery (includes inherited policies)                | Skip governance discovery — **HARD GATE**                    |
+| Validate REST API count matches Portal total                                   | Generate plan before asking deployment strategy              |
+| Run governance discovery via REST API + ARG BEFORE planning                    | Use `az policy assignment list` alone (misses inherited)     |
+| Check AVM via `mcp_bicep_list_avm_metadata` for every resource                 | Proceed with incomplete policy data — STOP if REST fails     |
+| Use AVM defaults for SKUs; deprecation research only for overrides             | Assume SKUs valid without deprecation checks                 |
+| Check deprecation for non-AVM / custom SKU selections                          | Hardcode SKUs without AVM verification                       |
+| Include governance constraints in the plan                                     | Proceed to bicep-code without user approval                  |
+| Define tasks as YAML-structured specs                                          | Add H2 headings not in the template                          |
+| Generate `04-implementation-plan.md` and `04-governance-constraints.md`        | Ignore policy `effect` — `Deny` = blocker, `Audit` = warning |
+| Auto-generate `04-dependency-diagram.py/.png` and `04-runtime-diagram.py/.png` | Generate governance from best-practice assumptions           |
+| Match H2 headings from azure-artifacts skill exactly                           |                                                              |
+| Update `agent-output/{project}/README.md` — mark Step 4 complete               |                                                              |
+| Ask user for deployment strategy — **MANDATORY GATE**                          |                                                              |
+| Default: phased deployment (>5 resources). Wait for approval before handoff    |                                                              |
 
 ## Prerequisites Check
 
-Before starting, validate `02-architecture-assessment.md` exists in `agent-output/{project}/`.
+Validate `02-architecture-assessment.md` exists in `agent-output/{project}/`.
 If missing, STOP and request handoff to Architect agent.
-
-Read `02-architecture-assessment.md` for: resource list, SKU recommendations, WAF scores,
-architecture decisions, and compliance requirements.
+Read it for: resource list, SKU recommendations, WAF scores, architecture decisions, compliance requirements.
 
 ## Session State Protocol
 
@@ -159,42 +140,28 @@
 - **Sub-step checkpoints**: `phase_1_governance` → `phase_2_avm` →
   `phase_3_plan` → `phase_3.5_strategy` → `phase_4_diagrams` →
   `phase_5_challenger` → `phase_6_artifact`
-- **Resume detection**: Read `00-session-state.json` BEFORE reading skills. If `steps.4.status`
-  is `"in_progress"` with a `sub_step`, skip to that checkpoint (e.g. if `phase_3_plan`,
-  governance is already done — read `04-governance-constraints.json` on-demand and proceed to planning).
-- **State writes**: Update `00-session-state.json` after each phase. On completion, set
-  `steps.4.status = "complete"` and populate `decisions.deployment_strategy`.
+- **Resume**: Read `00-session-state.json` first. If `steps.4.status` is `"in_progress"`,
+  skip to the saved `sub_step` checkpoint.
+- **State writes**: Update after each phase. On completion, set `steps.4.status = "complete"`
+  and populate `decisions.deployment_strategy`.
 
 ## Core Workflow
 
 ### Phase 1: Governance Discovery (MANDATORY GATE)
 
 > [!CAUTION]
-> This is a **hard gate**. If governance discovery fails, STOP and inform the user.
-> Do NOT proceed to Phase 2 with incomplete policy data.
+> **Hard gate.** If governance discovery fails, STOP. Do NOT proceed with incomplete policy data.
 
-Delegate governance discovery to `governance-discovery-subagent`:
+1. **Delegate** to `governance-discovery-subagent` — verifies Azure connectivity, queries ALL
+   effective policy assignments via REST API (including management group-inherited), classifies effects
+2. **Review result** — Status must be COMPLETE (if PARTIAL or FAILED, STOP)
+3. **Integrate findings** — populate `04-governance-constraints.md` and `.json` from subagent output
+4. **Adapt plan** — `Deny` policies are hard blockers; adjust accordingly
 
-1. **Delegate** to `governance-discovery-subagent` — it verifies Azure connectivity, queries ALL
-   effective policy assignments via REST API (including management group-inherited), classifies
-   effects, and returns a structured governance report
-2. **Review the subagent's result** — check Status is COMPLETE (if PARTIAL or FAILED, STOP)
-3. **Integrate findings** — use the Blockers/Warnings/Auto-Remediation tables from the subagent
-   output to populate `04-governance-constraints.md` and `04-governance-constraints.json`
-4. **Adapt plan** — any `Deny` policies are hard blockers; adjust the implementation plan accordingly
-
-**Policy Effect Decision Tree:**
-
-| Effect              | Action                                     | Code Generator Action                                   |
-| ------------------- | ------------------------------------------ | ------------------------------------------------------- |
-| `Deny`              | Hard blocker — adapt plan to comply        | MUST set property to compliant value                    |
-| `Audit`             | Warning — document, proceed                | Set compliant value where feasible (best effort)        |
-| `DeployIfNotExists` | Azure auto-remediates — note in plan       | Document auto-deployed resource in implementation ref   |
-| `Modify`            | Azure auto-modifies — verify compatibility | Document expected modification — do NOT set conflicting |
-| `Disabled`          | Ignore                                     | No action required                                      |
+**Policy effects:** Read `azure-defaults/references/policy-effect-decision-tree.md`.
 
-Save findings to `agent-output/{project}/04-governance-constraints.md` matching H2 template.
-After saving, run `npm run lint:artifact-templates` and fix any errors for your artifacts.
+Save to `agent-output/{project}/04-governance-constraints.md` matching H2 template.
+After saving, run `npm run lint:artifact-templates` and fix any errors.
 
 ### Phase 2: AVM Module Verification
 
@@ -207,172 +174,81 @@
 
 ### Phase 3: Deprecation & Lifecycle Checks
 
-**Only required for**: Non-AVM resources and custom SKU overrides.
-
-Use deprecation research patterns from azure-defaults skill:
-
-- Check Azure Updates for retirement notices
-- Verify SKU availability in target region
-- Scan for "Classic" / "v1" patterns
-
+**Only for** non-AVM resources and custom SKU overrides.
+Use deprecation patterns from azure-defaults skill (Azure Updates, regional SKU availability, Classic/v1).
 If deprecation detected: document alternative, adjust plan.
 
 ### Phase 3.5: Deployment Strategy Gate (MANDATORY)
 
 > [!CAUTION]
-> This is a **mandatory gate**. You MUST ask the user before generating
-> the implementation plan. Do NOT assume single or phased — ask.
+> **Mandatory gate.** Ask the user BEFORE generating the plan. Do NOT assume single or phased.
 
-Use `askQuestions` to present the deployment strategy choice:
+Use `askQuestions` to present:
 
-- **Phased deployment** (recommended) — deploy in logical phases with
-  approval gates between each. Reduces blast radius, isolates failures,
-  enables incremental validation. Recommended for >5 resources or any
-  production/compliance workload.
-- **Single deployment** — deploy all resources in one operation.
-  Suitable only for small dev/test environments with <5 resources.
+- **Phased** (recommended, pre-selected) — logical phases with approval gates. For >5 resources or production/compliance.
+- **Single** — one operation. Only for small dev/test (<5 resources).
 
-**Default: Phased** (pre-selected as recommended).
-
-If the user selects phased, also ask for phase grouping preference:
-
-- **Standard** (recommended): Foundation → Security → Data → Compute →
-  Edge/Integration
-- **Custom**: Let the user define phase boundaries
-
-Record the user's choice and use it to structure the `## Deployment
-Phases` section of the implementation plan.
+If phased, ask grouping: **Standard** (Foundation → Security → Data → Compute → Edge) or **Custom**.
+Record choice for `## Deployment Phases` section.
 
 ### Phase 4: Implementation Plan Generation
 
-Generate structured plan with these elements per resource:
+Generate structured plan with YAML specs per resource (resource, module, SKU, dependencies, config, tags, naming).
 
-```yaml
-- resource: "Key Vault"
-  module: "br/public:avm/res/key-vault/vault:0.11.0"
-  sku: "Standard"
-  dependencies: ["resource-group"]
-  config:
-    enableRbacAuthorization: true
-    enablePurgeProtection: true
-    softDeleteRetentionInDays: 90
-  tags: [Environment, ManagedBy, Project, Owner] # baseline — governance may add more
-  naming: "kv-{short}-{env}-{suffix}"
-```
+Include: resource inventory, module structure (`main.bicep` + `modules/`), tasks in dependency order,
+deployment phases (from Phase 3.5 choice), diagram artifacts (`04-dependency-diagram.py/.png`,
+`04-runtime-diagram.py/.png`), naming conventions table, security config matrix, estimated time.
 
-Include:
+### Phase 4.3–4.5: Adversarial Review (1 governance + 3 plan passes)
 
-- Resource inventory with SKUs and dependencies
-- Module structure (`main.bicep` + `modules/`)
-- Implementation tasks in dependency order
-- **Deployment Phases** section (from user's Phase 3.5 choice):
-  - If **phased**: group tasks into phases with approval gates,
-    validation criteria, and estimated deploy time per phase
-  - If **single**: note single deployment with one what-if gate
-- Python dependency diagram artifact (`04-dependency-diagram.py` + `.png`)
-- Python runtime flow diagram artifact (`04-runtime-diagram.py` + `.png`)
-- Naming conventions table (from azure-defaults CAF section)
-- Security configuration matrix
-- Estimated implementation time
-
-### Phase 4.3: Governance Constraints Review (1 pass)
-
-After governance discovery completes, invoke `challenger-review-subagent` via `#runSubagent`:
-
-- `artifact_path` = `agent-output/{project}/04-governance-constraints.md`
-- `project_name` = `{project}`
-- `artifact_type` = `governance-constraints`
-- `review_focus` = `comprehensive`
-- `pass_number` = `1`
-- `prior_findings` = `null`
-
-Write result to `agent-output/{project}/challenge-findings-governance-constraints.json`.
-
-### Phase 4.5: Adversarial Plan Review (3 passes — rotating lenses)
-
-After generating the implementation plan, run 3 adversarial passes:
-
-| Pass | `review_focus`             | Lens Description                                            |
-| ---- | -------------------------- | ----------------------------------------------------------- |
-| 1    | `security-governance`      | Policy compliance, identity, network isolation, encryption  |
-| 2    | `architecture-reliability` | WAF balance, SLA feasibility, failure modes, dependencies   |
-| 3    | `cost-feasibility`         | SKU sizing, pricing realism, budget alignment, reservations |
-
-For each pass, invoke `challenger-review-subagent` via `#runSubagent`:
-
-- `artifact_path` = `agent-output/{project}/04-implementation-plan.md`
-- `project_name` = `{project}`
-- `artifact_type` = `implementation-plan`
-- `review_focus` = per-pass value from table above
-- `pass_number` = `1` / `2` / `3`
-- `prior_findings` = `null` for pass 1; **compact prior findings string for passes 2-3** (see below)
+Read `azure-defaults/references/adversarial-review-protocol.md` for lens table, prior_findings format, and invocation template.
 
-Write each result to `agent-output/{project}/challenge-findings-implementation-plan-pass{N}.json`.
+- **Phase 4.3**: Invoke `challenger-review-subagent` on
+  `04-governance-constraints.md` (`review_focus=comprehensive`, 1 pass)
+- **Phase 4.5**: Invoke `challenger-review-subagent` on `04-implementation-plan.md` (3 passes, rotating lenses per protocol)
 
-> [!IMPORTANT]
-> **Context efficiency — compact prior_findings**
->
-> After writing each pass result to disk, **do NOT keep the full JSON in working context**.
-> Extract only the `compact_for_parent` string from the subagent response and discard the rest.
->
-> For passes 2 and 3, set `prior_findings` to a compact string built from previous
-> `compact_for_parent` values — **not the full JSON objects**:
->
-> ```text
-> prior_findings: "Pass 1: <compact_for_parent>\nPass 2: <compact_for_parent>"
-> ```
+Write results to `agent-output/{project}/challenge-findings-{artifact}-pass{N}.json`.
 
 ### Phase 5: Approval Gate
 
-Present plan summary and wait for approval:
+Present summary and wait for approval:
 
 ```text
 📝 Implementation Plan Complete
+Resources: {count} | AVM: {count} | Custom: {count}
+Governance: {blockers} blockers, {warnings} warnings
+Deployment: {Phased (N phases) | Single} | Est: {time}
+
+⚠️ Adversarial Review (1 governance + 3 plan passes)
+  must_fix: {n} | should_fix: {n} | suggestions: {n}
+  Key concerns: {top 2-3 must_fix titles}
 
-Resources: {count} | AVM Modules: {count} | Custom: {count}
-Governance: {blocker_count} blockers, {warning_count} warnings
-Deployment: {Phased (N phases) | Single}
-Est. Implementation: {time}
-```
-
-Append challenger summary merging ALL passes:
-
-```text
-⚠️ Adversarial Review Summary (1 governance pass + 3 plan passes)
-  must_fix: {total} | should_fix: {total} | suggestions: {total}
-  Key concerns: {top 2-3 must_fix titles across all passes}
-  Findings:
-    - agent-output/{project}/challenge-findings-governance-constraints.json
-    - agent-output/{project}/challenge-findings-implementation-plan-pass1.json
-    - agent-output/{project}/challenge-findings-implementation-plan-pass2.json
-    - agent-output/{project}/challenge-findings-implementation-plan-pass3.json
-```
-
-```text
 Reply "approve" to proceed to bicep-code, or provide feedback.
 ```
 
 ## Output Files
 
-| File                        | Location                                                | Template                     |
-| --------------------------- | ------------------------------------------------------- | ---------------------------- |
-| Implementation Plan         | `agent-output/{project}/04-implementation-plan.md`      | From azure-artifacts skill   |
-| Governance Constraints      | `agent-output/{project}/04-governance-constraints.md`   | From azure-artifacts skill   |
-| Governance Constraints JSON | `agent-output/{project}/04-governance-constraints.json` | Machine-readable policy data |
+| File                   | Location                                                   | Template                     |
+| ---------------------- | ---------------------------------------------------------- | ---------------------------- |
+| Implementation Plan    | `agent-output/{project}/04-implementation-plan.md`         | From azure-artifacts skill   |
+| Governance Constraints | `agent-output/{project}/04-governance-constraints.md`      | From azure-artifacts skill   |
+| Governance JSON        | `agent-output/{project}/04-governance-constraints.json`    | Machine-readable policy data |
+| Dependency Diagram     | `agent-output/{project}/04-dependency-diagram.py` + `.png` | Python diagrams              |
+| Runtime Diagram        | `agent-output/{project}/04-runtime-diagram.py` + `.png`    | Python diagrams              |
 
 > [!IMPORTANT]
-> `04-governance-constraints.json` is consumed downstream by the Code Generator (Phase 1.5)
-> and the `bicep-review-subagent` (Governance Compliance checklist). Its completeness directly
-> impacts downstream code quality. Each `Deny` policy MUST include `azurePropertyPath` (preferred,
-> IaC-agnostic REST API path) AND `bicepPropertyPath` (Bicep-specific fallback) plus `requiredValue`
-> (not just the policy display name) to make the JSON machine-actionable by both Bicep and Terraform agents.
-> | Dependency Diagram Source | `agent-output/{project}/04-dependency-diagram.py` | Python diagrams |
-> | Dependency Diagram Image | `agent-output/{project}/04-dependency-diagram.png` | Generated from source |
-> | Runtime Diagram Source | `agent-output/{project}/04-runtime-diagram.py` | Python diagrams |
-> | Runtime Diagram Image | `agent-output/{project}/04-runtime-diagram.png` | Generated from source |
+> `04-governance-constraints.json` is consumed downstream by Code Generator (Phase 1.5) and
+> `bicep-review-subagent`. Each `Deny` policy MUST include `azurePropertyPath` (preferred) AND
+> `bicepPropertyPath` (fallback) plus `requiredValue` to be machine-actionable.
 
 Include attribution header from the template file (do not hardcode).
 
+## Boundaries
+
+- **Always**: Run governance discovery, verify AVM modules, ask deployment strategy, generate diagrams
+- **Ask first**: Non-standard phase groupings, deviation from architecture assessment
+- **Never**: Write Bicep/Terraform code, skip governance, assume deployment strategy
+
 ## Validation Checklist
 
 - [ ] Governance discovery completed via ARG query
```

#### Modified: `.github/agents/05t-terraform-planner.agent.md` (+82/-190)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/05t-terraform-planner.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/05t-terraform-planner.agent.md	2026-03-04 06:47:05.099983781 +0000
@@ -92,79 +92,37 @@
 
 > [!CAUTION]
 > **HCP GUARDRAIL**: Never plan for `terraform { cloud { } }` or assume `TFE_TOKEN`.
-> Always specify Azure Storage Account backend only. If a reference file contains HCP
-> patterns, replace them with Azure Storage backend configuration.
+> Always specify Azure Storage Account backend only.
 
 ## MANDATORY: Read Skills First
 
-**Before doing ANY work**, read these skills for configuration and template structure:
+**Before doing ANY work**, read these skills:
 
-1. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags, AVM-TF modules,
-   governance discovery, naming, and the **Terraform Conventions** section
-2. **Read** `.github/skills/azure-artifacts/SKILL.md` — H2 templates for
-   `04-implementation-plan.md` and `04-governance-constraints.md`
-3. **Read** the template files for your artifacts:
-   - `.github/skills/azure-artifacts/templates/04-implementation-plan.template.md`
-   - `.github/skills/azure-artifacts/templates/04-governance-constraints.template.md`
-     Use as structural skeletons (replicate badges, TOC, navigation, attribution exactly).
-4. **Read** `.github/skills/terraform-patterns/SKILL.md` — reusable patterns for hub-spoke,
-   private endpoints, diagnostic settings, managed identity, module composition
+1. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags, AVM-TF, governance, naming, Terraform Conventions
+2. **Read** `.github/skills/azure-artifacts/SKILL.md` — H2 templates for `04-implementation-plan.md` and `04-governance-constraints.md`
+3. **Read** artifact template files: `azure-artifacts/templates/04-implementation-plan.template.md` + `04-governance-constraints.template.md`
 
-These skills are your single source of truth. Do NOT use hardcoded values.
+> Read `.github/skills/terraform-patterns/SKILL.md` on-demand during Phase 2 for hub-spoke, PE, diagnostics patterns.
 
 ## DO / DON'T
 
-### DO
-
-- ✅ Verify Azure connectivity (`az account show`) FIRST — governance is a hard gate
-- ✅ Use REST API for policy discovery (includes management group-inherited policies)
-- ✅ Validate REST API count matches Azure Portal (Policy > Assignments) total
-- ✅ Run governance discovery via REST API + ARG BEFORE planning (see azure-defaults skill)
-- ✅ Check AVM-TF availability for EVERY resource via `terraform/search_modules` +
-  `terraform/get_module_details`
-- ✅ Use AVM-TF module defaults for resource configurations — add deprecation research only
-  for non-AVM resources
-- ✅ Check `azurerm` provider resource arguments via `terraform/search_providers` +
-  `terraform/get_provider_details`
-- ✅ Check latest provider version via `terraform/get_latest_provider_version`
-- ✅ Include governance constraints in the implementation plan
-- ✅ Define tasks as YAML-structured specs (resource, module, dependencies, config)
-- ✅ Generate both `04-implementation-plan.md` and `04-governance-constraints.md`
-- ✅ Use `azurePropertyPath` (not `bicepPropertyPath`) for property mapping in plan
-- ✅ Auto-generate Step 4 diagrams in the same run:
-  - `04-dependency-diagram.py` + `04-dependency-diagram.png`
-  - `04-runtime-diagram.py` + `04-runtime-diagram.png`
-- ✅ Match H2 headings from azure-artifacts skill exactly
-- ✅ Update `agent-output/{project}/README.md` — mark Step 4 complete, add your artifacts
-- ✅ Ask user for deployment strategy (phased vs single) — MANDATORY GATE
-- ✅ Default recommendation: phased deployment (especially for >5 resources)
-- ✅ Wait for user approval before handoff to terraform-code
-
-### DON'T
-
-- ❌ Write ANY Terraform code — this agent plans, terraform-code implements
-- ❌ Skip governance discovery — this is a HARD GATE, not optional
-- ❌ Generate the implementation plan before asking the user about deployment strategy (Phase 3.5 `askQuestions` is mandatory)
-- ❌ Use `az policy assignment list` alone — it misses management group-inherited policies
-- ❌ Proceed with incomplete policy data (if REST API fails, STOP)
-- ❌ Assume module inputs are valid without checking AVM-TF variable schema
-- ❌ Use `bicepPropertyPath` in plan output — always use `azurePropertyPath`
-- ❌ Plan `terraform { cloud { } }` blocks or `TFE_TOKEN` usage
-- ❌ Plan backends other than Azure Storage Account
-- ❌ Proceed to terraform-code without explicit user approval
-- ❌ Add H2 headings not in the template (use H3 inside nearest H2)
-- ❌ Ignore policy `effect` field — `Deny` = blocker, `Audit` = warning only
-- ❌ Generate governance constraints from best-practice assumptions
-- ❌ Use community package tool names (`moduleSearch`, `providerDetails`, etc.) — that
-  package is archived; use `terraform/search_modules` and `terraform/search_providers`
+| DO                                                                    | DON'T                                                                 |
+| --------------------------------------------------------------------- | --------------------------------------------------------------------- |
+| Verify Azure connectivity (`az account show`) FIRST                   | Write ANY Terraform code — this agent plans only                      |
+| Run governance discovery via REST API + ARG BEFORE planning           | Skip governance discovery (HARD GATE)                                 |
+| Check AVM-TF for EVERY resource (`terraform/search_modules`)          | Generate plan before asking deployment strategy (Phase 3.5 mandatory) |
+| Use `terraform/get_module_details` for variable schema                | Use `az policy assignment list` alone (misses mgmt group policies)    |
+| always use `azurePropertyPath` (not `bicepPropertyPath`) in plan      | Plan `terraform { cloud { } }` or `TFE_TOKEN` usage                   |
+| Define tasks as YAML specs (resource, module, dependencies, config)   | Plan backends other than Azure Storage Account                        |
+| Generate `04-implementation-plan.md` + `04-governance-constraints.md` | Proceed to terraform-code without explicit user approval              |
+| Auto-generate `04-dependency-diagram.py/.png` + `04-runtime-diagram`  | Ignore policy `effect` — `Deny` = blocker, `Audit` = warning only     |
+| Ask user for deployment strategy (phased vs single) — MANDATORY GATE  | Use archived tool names (`moduleSearch` etc.) — use `terraform/*` MCP |
+| Match H2 headings from azure-artifacts templates exactly              | Generate governance from best-practice assumptions                    |
 
 ## Prerequisites Check
 
-Before starting, validate `02-architecture-assessment.md` exists in `agent-output/{project}/`.
-If missing, STOP and request handoff to Architect agent.
-
-Read `02-architecture-assessment.md` for: resource list, SKU/tier recommendations, WAF
-scores, architecture decisions, and compliance requirements.
+Validate `02-architecture-assessment.md` exists in `agent-output/{project}/`.
+If missing, STOP → handoff to Architect agent. Read for: resource list, SKUs, WAF scores.
 
 ## Session State Protocol
 
@@ -172,295 +130,110 @@
 
 - **Context budget**: 2 files at startup (`00-session-state.json` + `02-architecture-assessment.md`)
 - **My step**: 4
-- **Sub-step checkpoints**: `phase_1_governance` → `phase_2_avm` →
-  `phase_3_plan` → `phase_3.5_strategy` → `phase_4_diagrams` →
-  `phase_5_challenger` → `phase_6_artifact`
-- **Resume detection**: Read `00-session-state.json` BEFORE reading skills. If `steps.4.status`
-  is `"in_progress"` with a `sub_step`, skip to that checkpoint (e.g. if `phase_3_plan`,
-  governance is already done — read `04-governance-constraints.json` on-demand and proceed to planning).
-- **State writes**: Update `00-session-state.json` after each phase. On completion, set
-  `steps.4.status = "complete"` and populate `decisions.deployment_strategy`.
+- **Sub-steps**: `phase_1_governance` → `phase_2_avm` → `phase_3_plan` →
+  `phase_3.5_strategy` → `phase_4_diagrams` → `phase_5_challenger` →
+  `phase_6_artifact`
+- **Resume**: Read `00-session-state.json` first. If `steps.4.status = "in_progress"` with a `sub_step`, skip to that checkpoint.
+- **State writes**: Update `00-session-state.json` after each phase.
 
 ## Core Workflow
 
 ### Phase 1: Governance Discovery (MANDATORY GATE)
 
 > [!CAUTION]
-> This is a **hard gate**. If governance discovery fails, STOP and inform the user.
-> Do NOT proceed to Phase 2 with incomplete policy data.
-
-Delegate governance discovery to `governance-discovery-subagent`:
+> **Hard gate**. If governance discovery fails, STOP. Do NOT proceed with incomplete policy data.
 
-1. **Delegate** to `governance-discovery-subagent` — it verifies Azure connectivity, queries
-   ALL effective policy assignments via REST API (including management group-inherited),
-   classifies effects, and returns a structured governance report
-2. **Review the subagent's result** — check Status is COMPLETE (if PARTIAL or FAILED, STOP)
-3. **Integrate findings** — use the Blockers/Warnings/Auto-Remediation tables from the
-   subagent output to populate `04-governance-constraints.md` and
-   `04-governance-constraints.json`
-4. **Adapt plan** — any `Deny` policies are hard blockers; adjust the implementation plan
-
-**Policy Effect Decision Tree:**
-
-| Effect              | Action                                     | Code Generator Action                                    |
-| ------------------- | ------------------------------------------ | -------------------------------------------------------- |
-| `Deny`              | Hard blocker — adapt plan to comply        | MUST set `azurePropertyPath` property to compliant value |
-| `Audit`             | Warning — document, proceed                | Set compliant value where feasible (best effort)         |
-| `DeployIfNotExists` | Azure auto-remediates — note in plan       | Document auto-deployed resource in implementation ref    |
-| `Modify`            | Azure auto-modifies — verify compatibility | Document expected modification — do NOT set conflicting  |
-| `Disabled`          | Ignore                                     | No action required                                       |
+1. Delegate to `governance-discovery-subagent` (queries REST API + ARG, classifies effects)
+2. Review result — Status must be COMPLETE (if PARTIAL/FAILED, STOP)
+3. Integrate into `04-governance-constraints.md` + `.json`; `Deny` = hard blocker
+4. Run `npm run lint:artifact-templates` after saving
 
-Save findings to `agent-output/{project}/04-governance-constraints.md` matching H2 template.
-After saving, run `npm run lint:artifact-templates` and fix any errors for your artifacts.
+**Policy Effect Reference**: `azure-defaults/references/policy-effect-decision-tree.md`
 
 ### Phase 2: AVM-TF Module Verification
 
 For EACH resource in the architecture:
 
-1. Query `terraform/search_modules` to find the AVM-TF module (namespace `Azure`, provider `azurerm`)
-2. If AVM-TF module found → use `terraform/get_module_details` to retrieve variable schema,
-   outputs, and examples; use it as the implementation basis
-3. If no AVM-TF module → plan a raw `azurerm` provider resource and run deprecation checks
-4. Verify the latest module version via `terraform/get_latest_module_version`
-5. Document module source path + version in the implementation plan
+1. `terraform/search_modules` → find AVM-TF module (namespace `Azure`, provider `azurerm`)
+2. If found: `terraform/get_module_details` → variable schema, outputs, examples
+3. If not found: plan raw `azurerm` resource + deprecation checks
+4. `terraform/get_latest_module_version` → pin version; document in plan
 
-**AVM-TF module naming convention**: `Azure/avm-res-{service}-{resource}/azurerm`
-(e.g., `Azure/avm-res-keyvault-vault/azurerm`).
-
-**Fallback if MCP unavailable**: Use the Terraform Registry REST API directly:
-`https://registry.terraform.io/v1/modules/Azure/{module-name}/azurerm`
+**AVM-TF naming**: `Azure/avm-res-{service}-{resource}/azurerm`
+**MCP fallback**: `https://registry.terraform.io/v1/modules/Azure/{module-name}/azurerm`
 
 ### Phase 3: Deprecation & Lifecycle Checks
 
-**Only required for**: Non-AVM resources and custom tier/SKU overrides.
-
-Use deprecation research patterns from azure-defaults skill:
-
-- Check Azure Updates for retirement notices
-- Verify SKU/tier availability in target region
-- Scan for "Classic" / "v1" / "Basic" tier patterns (often deprecated)
-
-If deprecation detected: document alternative, adjust plan.
+Only for non-AVM resources and custom tier/SKU overrides. Check Azure Updates for
+retirement notices, verify SKU availability in target region, scan for Classic/v1/Basic patterns.
 
 ### Phase 3.5: Deployment Strategy Gate (MANDATORY)
 
 > [!CAUTION]
-> This is a **mandatory gate**. You MUST ask the user before generating the
-> implementation plan. Do NOT assume single or phased — ask.
-
-Use `askQuestions` to present the deployment strategy choice:
+> You MUST ask the user before generating the plan. Do NOT assume single or phased.
 
-- **Phased deployment** (recommended) — deploy in logical phases with approval gates
-  between each. Reduces blast radius, isolates failures, enables incremental validation.
-  Recommended for >5 resources or any production/compliance workload.
-  Uses `var.deployment_phase` with `count` conditionals to enable selective deployment.
-- **Single deployment** — deploy all resources in one `terraform apply` operation.
-  Suitable only for small dev/test environments with <5 resources.
+Use `askQuestions`:
 
-**Default: Phased** (pre-selected as recommended).
+- **Phased** (recommended for >5 resources): Foundation → Security →
+  Data → Compute → Edge. Uses `var.deployment_phase` + `count`
+- **Single**: All resources in one apply. Only for small dev/test (<5 resources)
 
-If the user selects phased, also ask for phase grouping preference:
+If phased, also ask: Standard grouping (recommended) or Custom boundaries.
 
-- **Standard** (recommended): Foundation → Security → Data → Compute → Edge/Integration
-- **Custom**: Let the user define phase boundaries
+### Phase 4: Implementation Plan Generation
 
-Record the user's choice and use it to structure the `## Deployment Phases` section.
+Generate YAML-structured resource specs per resource. Include:
+resource inventory, module structure, dependencies, deployment phases,
+diagrams (`04-dependency-diagram.py/.png` + `04-runtime-diagram.py/.png`),
+naming table, security matrix, backend config template, estimated time.
 
-### Phase 4: Implementation Plan Generation
+For Terraform-specific patterns (backend, state locking, provider pin, naming),
+read `terraform-patterns/references/tf-best-practices-examples.md`.
 
-Generate structured plan with these elements per resource:
+### Phase 4.3: Governance Review (1 pass)
 
-```yaml
-- resource: "Key Vault"
-  module: "Azure/avm-res-keyvault-vault/azurerm"
-  version: "~> 0.9"
-  sku_name: "standard"
-  dependencies: ["resource_group", "virtual_network"]
-  config:
-    enable_rbac_authorization: true
-    purge_protection_enabled: true
-    soft_delete_retention_days: 90
-  azurePropertyPath: "keyVault.properties.softDeleteRetentionInDays"
-  tags: [Environment, ManagedBy, Project, Owner]
-  naming: "kv-{short}-{env}-{suffix}"
-```
-
-Include:
-
-- Resource inventory with tiers/SKUs and dependencies
-- Module structure (root module + `modules/` optional)
-- Implementation tasks in dependency order
-- **Deployment Phases** section (from user's Phase 3.5 choice):
-  - If **phased**: group tasks into phases with `var.deployment_phase` values,
-    approval gates, validation criteria, and estimated deploy time per phase
-  - If **single**: note single deployment with one plan gate
-- Python dependency diagram artifact (`04-dependency-diagram.py` + `.png`)
-- Python runtime flow diagram artifact (`04-runtime-diagram.py` + `.png`)
-- Naming conventions table (from azure-defaults CAF + Terraform Conventions sections)
-- Security configuration matrix
-- Azure Storage backend configuration template
-- Estimated implementation time
-
-#### Terraform-Specific Concerns
-
-##### Backend Configuration
-
-Always plan an Azure Storage Account backend:
-
-```hcl
-terraform {
-  backend "azurerm" {
-    resource_group_name  = "{rg-name}"
-    storage_account_name = "{sa-name}"
-    container_name       = "tfstate"
-    key                  = "{project}.terraform.tfstate"
-  }
-}
-```
-
-Note: bootstrap script must create the storage account BEFORE `terraform init`.
-Never plan `terraform { cloud { } }` or `TFE_TOKEN`.
-
-##### State Locking
-
-Azure Blob Storage provides native state locking via blob leases — document this in
-the plan. No additional configuration required.
-
-##### Resource Naming in Terraform
-
-Terraform uses underscores in resource labels: `azurerm_key_vault.this`.
-Follow CAF naming for the actual Azure resource `name` attribute.
-
-##### Provider Requirements
-
-Always pin the `azurerm` provider to a minor version band:
-
-```hcl
-terraform {
-  required_providers {
-    azurerm = {
-      source  = "hashicorp/azurerm"
-      version = "~> 4.0"
-    }
-  }
-  required_version = ">= 1.9"
-}
-```
-
-Use `terraform/get_latest_provider_version` to confirm current stable version.
-
-### Phase 4.3: Governance Constraints Review (1 pass)
-
-After governance discovery completes, invoke `challenger-review-subagent` via `#runSubagent`:
-
-- `artifact_path` = `agent-output/{project}/04-governance-constraints.md`
-- `project_name` = `{project}`
-- `artifact_type` = `governance-constraints`
-- `review_focus` = `comprehensive`
-- `pass_number` = `1`
-- `prior_findings` = `null`
-
-Write result to `agent-output/{project}/challenge-findings-governance-constraints.json`.
-
-### Phase 4.5: Adversarial Plan Review (3 passes — rotating lenses)
-
-After generating the implementation plan, run 3 adversarial passes:
-
-| Pass | `review_focus`             | Lens Description                                            |
-| ---- | -------------------------- | ----------------------------------------------------------- |
-| 1    | `security-governance`      | Policy compliance, identity, network isolation, encryption  |
-| 2    | `architecture-reliability` | WAF balance, SLA feasibility, failure modes, dependencies   |
-| 3    | `cost-feasibility`         | SKU sizing, pricing realism, budget alignment, reservations |
-
-For each pass, invoke `challenger-review-subagent` via `#runSubagent`:
-
-- `artifact_path` = `agent-output/{project}/04-implementation-plan.md`
-- `project_name` = `{project}`
-- `artifact_type` = `implementation-plan`
-- `review_focus` = per-pass value from table above
-- `pass_number` = `1` / `2` / `3`
-- `prior_findings` = `null` for pass 1; **compact prior findings string for passes 2-3** (see below)
+Invoke `challenger-review-subagent`: `artifact_type = "governance-constraints"`,
+`review_focus = "comprehensive"`, pass 1. Save to `challenge-findings-governance-constraints.json`.
 
-Write each result to `agent-output/{project}/challenge-findings-implementation-plan-pass{N}.json`.
+### Phase 4.5: Adversarial Plan Review (3 passes)
 
-> [!IMPORTANT]
-> **Context efficiency — compact prior_findings**
->
-> After writing each pass result to disk, **do NOT keep the full JSON in working context**.
-> Extract only the `compact_for_parent` string from the subagent response and discard the rest.
->
-> For passes 2 and 3, set `prior_findings` to a compact string built from previous
-> `compact_for_parent` values — **not the full JSON objects**:
->
-> ```text
-> prior_findings: "Pass 1: <compact_for_parent>\nPass 2: <compact_for_parent>"
-> ```
+Read `azure-defaults/references/adversarial-review-protocol.md` for lens table.
+Invoke `challenger-review-subagent` 3× with `artifact_type = "implementation-plan"`,
+rotating `review_focus`. Save to `challenge-findings-implementation-plan-pass{N}.json`.
 
 ### Phase 5: Approval Gate
 
-Present plan summary and wait for approval:
+Present summary: resource count, AVM-TF vs raw, governance blockers/warnings,
+deployment strategy, backend, challenger findings. Wait for "approve" before handoff.
 
-```text
-📝 Implementation Plan Complete
+## Boundaries
 
-Resources: {count} | AVM-TF Modules: {count} | Raw azurerm: {count}
-Governance: {blocker_count} blockers, {warning_count} warnings
-Deployment: {Phased (N phases) | Single}
-Backend: Azure Storage Account (Azure Blob State Locking)
-Est. Implementation: {time}
-```
-
-Append challenger summary merging ALL passes:
-
-```text
-⚠️ Adversarial Review Summary (1 governance pass + 3 plan passes)
-  must_fix: {total} | should_fix: {total} | suggestions: {total}
-  Key concerns: {top 2-3 must_fix titles across all passes}
-  Findings:
-    - agent-output/{project}/challenge-findings-governance-constraints.json
-    - agent-output/{project}/challenge-findings-implementation-plan-pass1.json
-    - agent-output/{project}/challenge-findings-implementation-plan-pass2.json
-    - agent-output/{project}/challenge-findings-implementation-plan-pass3.json
-```
-
-```text
-Reply "approve" to proceed to terraform-code, or provide feedback.
-```
+- **Always**: Run governance discovery, verify AVM-TF modules, ask deployment strategy, generate diagrams
+- **Ask first**: Non-standard phase groupings, custom provider versions, deviation from architecture assessment
+- **Never**: Write Terraform code, skip governance, assume deployment strategy, plan HCP/cloud backends
 
 ## Output Files
 
-| File                        | Location                                                | Template                     |
-| --------------------------- | ------------------------------------------------------- | ---------------------------- |
-| Implementation Plan         | `agent-output/{project}/04-implementation-plan.md`      | From azure-artifacts skill   |
-| Governance Constraints      | `agent-output/{project}/04-governance-constraints.md`   | From azure-artifacts skill   |
-| Governance Constraints JSON | `agent-output/{project}/04-governance-constraints.json` | Machine-readable policy data |
-| Dependency Diagram Source   | `agent-output/{project}/04-dependency-diagram.py`       | Python diagrams              |
-| Dependency Diagram Image    | `agent-output/{project}/04-dependency-diagram.png`      | Generated from source        |
-| Runtime Diagram Source      | `agent-output/{project}/04-runtime-diagram.py`          | Python diagrams              |
-| Runtime Diagram Image       | `agent-output/{project}/04-runtime-diagram.png`         | Generated from source        |
+| File                   | Location                                                |
+| ---------------------- | ------------------------------------------------------- |
+| Implementation Plan    | `agent-output/{project}/04-implementation-plan.md`      |
+| Governance Constraints | `agent-output/{project}/04-governance-constraints.md`   |
+| Governance JSON        | `agent-output/{project}/04-governance-constraints.json` |
+| Dependency Diagram     | `agent-output/{project}/04-dependency-diagram.py/.png`  |
+| Runtime Diagram        | `agent-output/{project}/04-runtime-diagram.py/.png`     |
 
 > [!IMPORTANT]
-> `04-governance-constraints.json` is consumed downstream by the Terraform Code Generator
-> (Phase 1.5) and `terraform-review-subagent`. Its completeness directly impacts downstream
-> code quality. Each `Deny` policy MUST include `azurePropertyPath` and `requiredValue` fields
-> to make the JSON machine-actionable.
-
-Include attribution header from the template file (do not hardcode).
+> `04-governance-constraints.json` is consumed by Terraform CodeGen (Phase 1.5) and
+> `terraform-review-subagent`. Each `Deny` policy MUST include `azurePropertyPath` +
+> `requiredValue` to be machine-actionable.
 
 ## Validation Checklist
 
-- [ ] Governance discovery completed via ARG query
-- [ ] AVM-TF availability checked for every resource via `terraform/search_modules`
-- [ ] Provider resource arguments verified via `terraform/search_providers`/`terraform/get_provider_details`
-- [ ] Deprecation checks done for non-AVM / custom tier resources
-- [ ] All resources have naming patterns following CAF conventions
-- [ ] Dependency graph is acyclic and complete
-- [ ] H2 headings match azure-artifacts templates exactly
-- [ ] All 4 required tags listed for every resource
-- [ ] `azurePropertyPath` used (not `bicepPropertyPath`) in plan YAML
-- [ ] Azure Storage backend configuration template included
-- [ ] Security configuration includes managed identity where applicable
+- [ ] Governance discovery completed via REST API + ARG
+- [ ] AVM-TF checked for every resource
+- [ ] Deprecation checks done for non-AVM resources
+- [ ] `azurePropertyPath` used (not `bicepPropertyPath`) in YAML
+- [ ] H2 headings match templates; all 4 required tags per resource
+- [ ] Azure Storage backend template included
+- [ ] Diagrams generated and referenced
 - [ ] Approval gate presented before handoff
-- [ ] `04-implementation-plan.md` and governance artifacts saved to `agent-output/{project}/`
-- [ ] `04-dependency-diagram.py/.png` generated and referenced in plan
-- [ ] `04-runtime-diagram.py/.png` generated and referenced in plan
```

#### Modified: `.github/agents/06b-bicep-codegen.agent.md` (+73/-140)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/06b-bicep-codegen.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/06b-bicep-codegen.agent.md	2026-03-04 06:47:05.099983781 +0000
@@ -97,68 +97,36 @@
 
 1. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags, naming, AVM, security, unique suffix
 2. **Read** `.github/skills/azure-artifacts/SKILL.md` — H2 templates for `04-preflight-check.md` and `05-implementation-reference.md`
-3. **Read** the template files for your artifacts:
-   - `.github/skills/azure-artifacts/templates/04-preflight-check.template.md`
-   - `.github/skills/azure-artifacts/templates/05-implementation-reference.template.md`
-     Use as structural skeletons (replicate badges, TOC, navigation, attribution exactly).
-4. **Read** `.github/skills/microsoft-code-reference/SKILL.md` — verify AVM module parameters,
-   check API versions, find correct Bicep patterns via official docs
-5. **Read** `.github/skills/azure-bicep-patterns/SKILL.md` — hub-spoke, private endpoints,
-   diagnostic settings, managed identity, module composition patterns
-6. **Read** `.github/instructions/bicep-policy-compliance.instructions.md` — governance
-   compliance mandate, dynamic tag list, anti-patterns
+3. **Read** artifact template files: `azure-artifacts/templates/04-preflight-check.template.md` + `05-implementation-reference.template.md`
+4. **Read** `.github/skills/azure-bicep-patterns/SKILL.md` — hub-spoke, PE, diagnostics, managed identity, module composition
+5. **Read** `.github/instructions/bicep-policy-compliance.instructions.md` — governance mandate, dynamic tag list
 
-These skills are your single source of truth. Do NOT use hardcoded values.
+> When verifying AVM module parameters or API versions, read `.github/skills/microsoft-code-reference/SKILL.md` on-demand.
 
 ## DO / DON'T
 
-### DO
-
-- ✅ Run preflight check BEFORE writing any Bicep (Phase 1 below)
-- ✅ Use AVM modules for EVERY resource that has one — never raw Bicep when AVM exists
-- ✅ Generate `uniqueSuffix` ONCE in `main.bicep`, pass to ALL modules
-- ✅ Apply baseline tags (`Environment`, `ManagedBy`, `Project`, `Owner`) plus any extras from governance
-- ✅ Parse `04-governance-constraints.json` and map every Deny policy to specific Bicep parameters
-- ✅ Apply security baseline (TLS 1.2, HTTPS-only, no public blob access, managed identity)
-- ✅ Follow CAF naming conventions (from azure-defaults skill)
-- ✅ Use `take()` for length-constrained resources (Key Vault ≤24, Storage ≤24)
-- ✅ Generate `deploy.ps1` PowerShell deployment script
-- ✅ Generate `.bicepparam` parameter file for each environment
-- ✅ If plan specifies phased deployment, add `phase` parameter to
-  `main.bicep` that conditionally deploys resource groups per phase
-- ✅ Run `bicep build` and `bicep lint` after generating templates
-- ✅ Save implementation reference to `05-implementation-reference.md`
-- ✅ Update `agent-output/{project}/README.md` — mark Step 5 complete, add your artifacts (see azure-artifacts skill)
-
-### DON'T
-
-- ❌ Start coding before preflight check (Phase 1)
-- ❌ Write raw Bicep for resources with AVM modules available
-- ❌ Hardcode unique strings — always derive from `uniqueString(resourceGroup().id)`
-- ❌ Use deprecated settings (see AVM Known Pitfalls in azure-defaults skill)
-- ❌ Use `APPINSIGHTS_INSTRUMENTATIONKEY` — use `APPLICATIONINSIGHTS_CONNECTION_STRING`
-- ❌ Put hyphens in Storage Account names
-- ❌ Skip `bicep build` / `bicep lint` validation
-- ❌ Deploy — that's the Deploy agent's job
-- ❌ Proceed without checking AVM parameter types (known type mismatches exist)
-- ❌ Use hardcoded tag lists when governance constraints specify additional tags
-- ❌ Skip governance compliance mapping — this is a HARD GATE
+| DO                                                                     | DON'T                                                             |
+| ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
+| Run preflight check BEFORE writing any Bicep (Phase 1)                 | Start coding before preflight check                               |
+| Use AVM modules for EVERY resource that has one                        | Write raw Bicep when AVM exists                                   |
+| Generate `uniqueSuffix` ONCE in `main.bicep`, pass to ALL modules      | Hardcode unique strings                                           |
+| Apply baseline tags + governance extras                                | Use hardcoded tag lists ignoring governance                       |
+| Parse `04-governance-constraints.json` — map each Deny policy to Bicep | Skip governance compliance mapping (HARD GATE)                    |
+| Apply security baseline (TLS 1.2, HTTPS, managed identity, no public)  | Use `APPINSIGHTS_INSTRUMENTATIONKEY` (use CONNECTION_STRING)      |
+| Use `take()` for length-constrained resources (KV≤24, Storage≤24)      | Put hyphens in Storage Account names                              |
+| Generate `deploy.ps1` + `.bicepparam` per environment                  | Deploy — that's the Deploy agent's job                            |
+| Run `bicep build` + `bicep lint` after generation                      | Proceed without checking AVM parameter types (known issues exist) |
+| Save `05-implementation-reference.md` + update project README          | Use phase parameter if plan specifies single deployment           |
 
 ## Prerequisites Check
 
 Before starting, validate these files exist in `agent-output/{project}/`:
 
-1. `04-implementation-plan.md` — **REQUIRED**. If missing, STOP and request handoff to Bicep Plan agent.
-2. `04-governance-constraints.json` — **REQUIRED**. If missing, STOP and request governance discovery.
-   This file is consumed in Phase 1.5 for programmatic compliance mapping.
-3. `04-governance-constraints.md` — **REQUIRED**. Human-readable governance constraints.
-
-Read these for context:
-
-- `04-implementation-plan.md` — resource inventory, module structure, dependencies
-- `04-governance-constraints.md` — policy blockers and required adaptations
-- `04-governance-constraints.json` — machine-actionable policy data for compliance mapping
-- `02-architecture-assessment.md` — SKU recommendations and WAF considerations
+1. `04-implementation-plan.md` — **REQUIRED**. If missing, STOP → handoff to Bicep Plan agent
+2. `04-governance-constraints.json` — **REQUIRED**. If missing, STOP → request governance discovery
+3. `04-governance-constraints.md` — **REQUIRED**. Human-readable governance constraints
+
+Also read `02-architecture-assessment.md` for SKU/tier context.
 
 ## Session State Protocol
 
@@ -166,189 +134,78 @@
 
 - **Context budget**: 3 files at startup (`00-session-state.json` + `04-implementation-plan.md` + `04-governance-constraints.json`)
 - **My step**: 5
-- **Sub-step checkpoints**: `phase_1_preflight` → `phase_1.5_governance` →
+- **Sub-steps**: `phase_1_preflight` → `phase_1.5_governance` →
   `phase_2_scaffold` → `phase_3_modules` → `phase_4_lint` →
   `phase_5_challenger` → `phase_6_artifact`
-- **Resume detection**: Read `00-session-state.json` BEFORE reading skills. If `steps.5.status`
-  is `"in_progress"` with a `sub_step`, skip to that checkpoint (e.g. if `phase_3_modules`,
-  preflight and governance are done — read `04-preflight-check.md` on-demand and continue module coding).
-- **State writes**: Update `00-session-state.json` after each phase. On completion, set
-  `steps.5.status = "complete"` and list all generated Bicep files in `steps.5.artifacts`.
+- **Resume**: Read `00-session-state.json` first. If `steps.5.status = "in_progress"`
+  with a `sub_step`, skip to that checkpoint.
+- **State writes**: Update `00-session-state.json` after each phase.
 
 ## Workflow
 
 ### Phase 1: Preflight Check (MANDATORY)
 
-Before writing ANY Bicep code, validate AVM compatibility:
+For EACH resource in `04-implementation-plan.md`:
 
-1. For EACH resource in `04-implementation-plan.md`:
-   - Query `mcp_bicep_list_avm_metadata` for AVM availability
-   - If AVM exists: query `mcp_bicep_resolve_avm_module` for parameter schema
-   - Cross-check planned parameters against actual AVM schema
-   - Flag type mismatches (see AVM Known Pitfalls in azure-defaults skill)
-2. Check region limitations for all services
-3. Save results to `agent-output/{project}/04-preflight-check.md`
-4. If blockers found → STOP and report to user
+1. `mcp_bicep_list_avm_metadata` → check AVM availability
+2. `mcp_bicep_resolve_avm_module` → retrieve parameter schema
+3. Cross-check planned parameters against schema; flag type mismatches (see AVM Known Pitfalls)
+4. Check region limitations
+5. Save to `agent-output/{project}/04-preflight-check.md`; STOP if blockers found
 
 ### Phase 1.5: Governance Compliance Mapping (MANDATORY)
 
 > [!CAUTION]
-> This is a **HARD GATE**. Do NOT proceed to Phase 2 with unresolved policy violations.
-> See `.github/instructions/bicep-policy-compliance.instructions.md` for the full mandate.
-
-1. **Read** `agent-output/{project}/04-governance-constraints.json`
-2. **Extract** all `Deny` policies and their property path + `requiredValue` fields:
-   - Prefer `azurePropertyPath` (IaC-agnostic REST API path, e.g. `storageAccount.properties.minimumTlsVersion`)
-   - Fall back to `bicepPropertyPath` if `azurePropertyPath` is absent
-3. **Build a compliance map** — for each Deny policy, identify:
-   - Target resource type(s)
-   - Bicep property to set — if using `azurePropertyPath`, drop the leading resource-type segment
-     and map the remainder to the Bicep ARM property path (e.g. `.properties.minimumTlsVersion`)
-   - Required value to avoid policy denial
-4. **Extract tag requirements** — merge governance-discovered tags with the 4 baseline defaults.
-   Governance constraints always win (the 4 defaults are a MINIMUM)
-5. **Validate** that every resource in `04-implementation-plan.md` can be configured to comply
-6. **Document** the compliance map in the implementation reference
-7. If any Deny policy **cannot** be satisfied → STOP and report to user
-
-**Policy Effect → Code Generator Action:**
-
-| Effect              | Code Generator Action                                          |
-| ------------------- | -------------------------------------------------------------- |
-| `Deny`              | MUST set property to compliant value                           |
-| `Modify`            | Document expected modification — do NOT set conflicting values |
-| `DeployIfNotExists` | Document auto-deployed resource in implementation reference    |
-| `Audit`             | Set compliant value where feasible (best effort)               |
-| `Disabled`          | No action required                                             |
-
-### Phase 2: Progressive Implementation
-
-Build templates in dependency order.
-
-**Check `04-implementation-plan.md` for deployment strategy:**
-
-- If **phased**: add a `@allowed` `phase` parameter to `main.bicep`
-  (values: `'all'`, `'foundation'`, `'security'`, `'data'`,
-  `'compute'`, `'edge'` — matching the plan’s phase names).
-  Wrap each module call in a conditional:
-  `if phase == 'all' || phase == '{phaseName}'`.
-  This lets `deploy.ps1` deploy one phase at a time.
-- If **single**: no `phase` parameter needed; deploy everything.
-
-**Round 1 — Foundation:**
+> **HARD GATE**. Do NOT proceed to Phase 2 with unresolved policy violations.
 
-- `main.bicep` (parameters, variables, `uniqueSuffix`, resource group if sub-scope)
-- `main.bicepparam` (environment-specific values)
+1. Read `04-governance-constraints.json` — extract all `Deny` policies
+2. Use `azurePropertyPath` (fall back to `bicepPropertyPath` if absent).
+   Drop leading resource-type segment → map to Bicep ARM property path
+3. Build compliance map: resource type → Bicep property → required value
+4. Merge governance tags with 4 baseline defaults (governance wins)
+5. Validate every planned resource can comply; STOP if any Deny unsatisfiable
 
-**Round 2 — Shared Infrastructure:**
+**Policy Effect Reference**: `azure-defaults/references/policy-effect-decision-tree.md`
 
-- Networking (VNet, subnets, NSGs)
-- Key Vault
-- Log Analytics + App Insights
-
-**Round 3 — Application Resources:**
+### Phase 2: Progressive Implementation
 
-- Compute (App Service, Container Apps, Functions)
-- Data (SQL, Cosmos, Storage)
-- Messaging (Service Bus, Event Grid)
+Build templates in dependency order from `04-implementation-plan.md`.
 
-**Round 4 — Integration:**
+If **phased**: add `@allowed` `phase` parameter, wrap modules in `if phase == 'all' || phase == '{name}'`.
+If **single**: no phase parameter needed.
 
-- Diagnostic settings on all resources
-- Role assignments (managed identity → Key Vault, Storage, etc.)
-- `deploy.ps1` deployment script
+| Round | Content                                                        |
+| ----- | -------------------------------------------------------------- |
+| 1     | `main.bicep` (params, vars, `uniqueSuffix`), `main.bicepparam` |
+| 2     | Networking, Key Vault, Log Analytics + App Insights            |
+| 3     | Compute, Data, Messaging                                       |
+| 4     | Diagnostic settings, role assignments, `deploy.ps1`            |
 
-After each round: run `bicep build` to catch errors early.
+After each round: `bicep build` to catch errors early.
 
 ### Phase 3: Deployment Script
 
 Generate `infra/bicep/{project}/deploy.ps1` with:
 
-```text
-╔════════════════════════════════════════╗
-║   {Project Name} - Azure Deployment    ║
-╚════════════════════════════════════════╝
-```
-
-Script must include:
-
-- Parameter validation (ResourceGroup, Location, Environment)
-- **Phase parameter** (`-Phase` with default `all`):
-  - If phased plan: accept phase names from the implementation plan
-  - Loop through phases sequentially with approval prompts between
-  - If single plan: ignore phase parameter, deploy everything
-- `az group create` for resource group
-- `az deployment group create` with `--template-file` and `--parameters`
-- Output parsing with deployment results table
-- Error handling with meaningful messages
+- Banner, parameter validation (ResourceGroup, Location, Environment, Phase)
+- `az group create` + `az deployment group create --template-file --parameters`
+- Phase-aware looping if phased; approval prompts between phases
+- Output parsing and error handling
 
 ### Phase 4: Validation (Subagent-Driven)
 
-Delegate validation to specialized subagents for thorough, isolated analysis:
-
-**Step 1 — Lint Validation** (run in parallel with Step 2):
-
-Delegate to `bicep-lint-subagent`:
+1. Delegate to `bicep-lint-subagent` (path: `infra/bicep/{project}/main.bicep`) — expect PASS
+2. Delegate to `bicep-review-subagent` (path: `infra/bicep/{project}/`) — expect APPROVED
+3. Both must pass before Phase 4.5
 
-- Provide the project path: `infra/bicep/{project}/main.bicep`
-- Expect PASS/FAIL result with diagnostics
-- If FAIL: fix errors, then re-run lint subagent
+### Phase 4.5: Adversarial Code Review (3 passes)
 
-**Step 2 — Code Review** (run in parallel with Step 1):
+Read `azure-defaults/references/adversarial-review-protocol.md` for lens table and invocation template.
 
-Delegate to `bicep-review-subagent`:
+Invoke `challenger-review-subagent` 3× with `artifact_type = "iac-code"`, rotating `review_focus` per protocol.
+Write results to `challenge-findings-iac-code-pass{N}.json`. Fix any `must_fix` items, re-validate, re-run failing pass.
 
-- Provide the project path: `infra/bicep/{project}/`
-- Expect APPROVED/NEEDS_REVISION/FAILED verdict
-- If NEEDS_REVISION: address feedback, then re-run review subagent
-- If FAILED: address critical issues before proceeding
-
-**Step 3 — Finalize**:
-
-Both subagents must return passing results before proceeding to adversarial review.
-
-### Phase 4.5: Adversarial Code Review (3 passes — rotating lenses)
-
-After lint and review subagents pass, run 3 adversarial passes on the generated code:
-
-| Pass | `review_focus`             | Lens Description                                            |
-| ---- | -------------------------- | ----------------------------------------------------------- |
-| 1    | `security-governance`      | Policy compliance, identity, network isolation, encryption  |
-| 2    | `architecture-reliability` | WAF balance, SLA feasibility, failure modes, dependencies   |
-| 3    | `cost-feasibility`         | SKU sizing, pricing realism, budget alignment, reservations |
-
-For each pass, invoke `challenger-review-subagent` via `#runSubagent`:
-
-- `artifact_path` = `infra/bicep/{project}/`
-- `project_name` = `{project}`
-- `artifact_type` = `iac-code`
-- `review_focus` = per-pass value from table above
-- `pass_number` = `1` / `2` / `3`
-- `prior_findings` = `null` for pass 1; **compact prior findings string for passes 2-3** (see below)
-
-Write each result to `agent-output/{project}/challenge-findings-iac-code-pass{N}.json`.
-
-> [!IMPORTANT]
-> **Context efficiency — compact prior_findings**
->
-> After writing each pass result to disk, **do NOT keep the full JSON in working context**.
-> Extract only the `compact_for_parent` string from the subagent response and discard the rest.
->
-> For passes 2 and 3, set `prior_findings` to a compact string built from previous
-> `compact_for_parent` values — **not the full JSON objects**:
->
-> ```text
-> prior_findings: "Pass 1: <compact_for_parent>\nPass 2: <compact_for_parent>"
-> ```
-
-If any pass returns `must_fix` items:
-
-1. Fix the code
-2. Re-run `bicep-lint-subagent` and `bicep-review-subagent`
-3. Re-run only the failing adversarial pass
-
-Save validation status (including all subagent verdicts) in `05-implementation-reference.md`.
-Run `npm run lint:artifact-templates` and fix any H2 structure errors for your artifacts.
+Save validation status in `05-implementation-reference.md`. Run `npm run lint:artifact-templates`.
 
 ## File Structure
 
@@ -360,60 +217,23 @@
 └── modules/
     ├── key-vault.bicep     # Per-resource modules
     ├── networking.bicep
-    ├── app-service.bicep
     └── ...
 ```
 
-### main.bicep Structure
-
-```bicep
-targetScope = 'subscription'  // or 'resourceGroup'
-
-// Parameters
-param location string = 'swedencentral'
-param environment string = 'dev'
-param projectName string
-param owner string
-
-// Variables
-var uniqueSuffix = uniqueString(subscription().id, resourceGroup().id)
-var tags = {
-  Environment: environment
-  ManagedBy: 'Bicep'
-  Project: projectName
-  Owner: owner
-}
-
-// Modules — in dependency order
-module keyVault 'modules/key-vault.bicep' = { ... }
-module networking 'modules/networking.bicep' = { ... }
-```
-
-## Output Files
-
-| File               | Location                                                |
-| ------------------ | ------------------------------------------------------- |
-| Preflight Check    | `agent-output/{project}/04-preflight-check.md`          |
-| Implementation Ref | `agent-output/{project}/05-implementation-reference.md` |
-| IaC Templates      | `infra/bicep/{project}/`                                |
-| Deploy Script      | `infra/bicep/{project}/deploy.ps1`                      |
+## Boundaries
 
-Include attribution header from the template file (do not hardcode).
+- **Always**: Run preflight + governance mapping, use AVM modules, generate deploy script, validate with subagents
+- **Ask first**: Non-standard module sources, custom API versions, phase grouping changes
+- **Never**: Deploy infrastructure, skip governance mapping, use deprecated parameters
 
 ## Validation Checklist
 
-- [ ] Preflight check completed and saved to `04-preflight-check.md`
-- [ ] AVM modules used for all resources with AVM availability
-- [ ] `uniqueSuffix` generated once in `main.bicep`, passed to all modules
-- [ ] Governance compliance mapping completed (Phase 1.5)
-- [ ] All tags from governance constraints applied to every resource (4 baseline + discovered)
-- [ ] Every Deny policy in `04-governance-constraints.json` is satisfied in Bicep code
+- [ ] Preflight check saved to `04-preflight-check.md`
+- [ ] AVM modules used for all available resources
+- [ ] `uniqueSuffix` generated once, passed to all modules
+- [ ] Governance compliance map complete — all Deny policies satisfied
 - [ ] Security baseline applied (TLS 1.2, HTTPS, managed identity)
-- [ ] CAF naming conventions followed (from azure-defaults skill)
-- [ ] Length constraints respected (Key Vault ≤24, Storage ≤24)
-- [ ] No deprecated parameters used (checked against AVM pitfalls)
-- [ ] `bicep-lint-subagent` returns PASS
-- [ ] `bicep-review-subagent` returns APPROVED
-- [ ] `challenger-review-subagent` 3-pass adversarial code review completed
-- [ ] `deploy.ps1` generated with proper error handling
-- [ ] `05-implementation-reference.md` saved with validation status
+- [ ] Length constraints respected (KV≤24, Storage≤24)
+- [ ] `bicep-lint-subagent` PASS + `bicep-review-subagent` APPROVED
+- [ ] 3-pass adversarial review completed
+- [ ] `deploy.ps1` generated; `05-implementation-reference.md` saved
```

#### Modified: `.github/agents/06t-terraform-codegen.agent.md` (+82/-223)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/06t-terraform-codegen.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/06t-terraform-codegen.agent.md	2026-03-04 06:47:05.104320879 +0000
@@ -104,77 +104,39 @@
 
 **Before doing ANY work**, read these skills:
 
-1. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags, naming, AVM-TF modules,
-   unique suffix, and the **Terraform Conventions** section
-2. **Read** `.github/skills/azure-artifacts/SKILL.md` — H2 templates for
-   `04-preflight-check.md` and `05-implementation-reference.md`
-3. **Read** the template files for your artifacts:
-   - `.github/skills/azure-artifacts/templates/04-preflight-check.template.md`
-   - `.github/skills/azure-artifacts/templates/05-implementation-reference.template.md`
-     Use as structural skeletons (replicate badges, TOC, navigation, attribution exactly).
-4. **Read** `.github/skills/microsoft-code-reference/SKILL.md` — verify AVM-TF module
-   variables, check azurerm provider argument types, find correct Terraform patterns
-5. **Read** `.github/skills/terraform-patterns/SKILL.md` — hub-spoke, private endpoints,
-   diagnostic settings, managed identity, module composition patterns, and **AVM Known Pitfalls**
-6. **Read** `.github/instructions/terraform-policy-compliance.instructions.md` — governance
-   compliance mandate, `azurePropertyPath` translation table, anti-patterns
+1. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags, naming, AVM-TF, unique suffix, Terraform Conventions
+2. **Read** `.github/skills/azure-artifacts/SKILL.md` — H2 templates for `04-preflight-check.md` and `05-implementation-reference.md`
+3. **Read** artifact template files: `azure-artifacts/templates/04-preflight-check.template.md` + `05-implementation-reference.template.md`
+4. **Read** `.github/skills/terraform-patterns/SKILL.md` — patterns, AVM Known Pitfalls, module composition
+5. **Read** `.github/instructions/terraform-policy-compliance.instructions.md` — governance mandate, translation table
 
-These skills are your single source of truth. Do NOT use hardcoded values.
+> When verifying AVM-TF module variables or `azurerm` argument types,
+> read `.github/skills/microsoft-code-reference/SKILL.md` on-demand.
 
 ## DO / DON'T
 
-### DO
-
-- ✅ Run preflight check BEFORE writing any Terraform (Phase 1 below)
-- ✅ Use AVM-TF modules for EVERY resource that has one — never raw `azurerm` when AVM-TF exists
-- ✅ Generate a unique suffix ONCE in `locals.tf`, pass to ALL resources
-- ✅ Apply baseline tags (`Environment`, `ManagedBy`, `Project`, `Owner`) plus any extras
-  from governance via `local.tags`
-- ✅ Parse `04-governance-constraints.json` and map every Deny policy `azurePropertyPath`
-  to the corresponding Terraform argument
-- ✅ Apply security baseline (TLS 1.2, HTTPS-only, no public access, managed identity)
-- ✅ Follow CAF naming conventions (from azure-defaults skill Terraform Conventions section)
-- ✅ Use `var.deployment_phase` with `count` conditionals for phased deployment
-- ✅ Generate bootstrap scripts: `bootstrap-backend.sh` AND `bootstrap-backend.ps1`
-- ✅ Generate deploy scripts: `deploy.sh` AND `deploy.ps1`
-- ✅ Run `terraform validate` and `terraform fmt -check` after generating configurations
-- ✅ Save implementation reference to `05-implementation-reference.md`
-- ✅ Update `agent-output/{project}/README.md` — mark Step 5 complete, add your artifacts
-
-### DON'T
-
-- ❌ Start coding before preflight check (Phase 1)
-- ❌ Write raw `azurerm` resources for resources with AVM-TF modules available
-- ❌ Hardcode unique strings — always derive from `substr`/`lower` + `random_id` or
-  `md5(azurerm_resource_group.this.id)`
-- ❌ Use `terraform -target` for phased deployment — use `count` conditionals
-- ❌ Write `terraform { cloud { } }` blocks or any HCP Terraform configuration
-- ❌ Use `TFE_TOKEN` or HCP Terraform workspace references
-- ❌ Put hyphens in Storage Account names (Azure constraint)
-- ❌ Skip `terraform validate` / `terraform fmt -check` validation
-- ❌ Deploy — that's the Deploy agent's job
-- ❌ Proceed without checking AVM-TF module variable types (known type issues exist)
-- ❌ Use hardcoded tag maps when governance constraints specify additional tags
-- ❌ Skip governance compliance mapping — this is a HARD GATE
-- ❌ Use `APPINSIGHTS_INSTRUMENTATIONKEY` — use `APPLICATIONINSIGHTS_CONNECTION_STRING`
+| DO                                                                    | DON'T                                                               |
+| --------------------------------------------------------------------- | ------------------------------------------------------------------- |
+| Run preflight check BEFORE writing any Terraform (Phase 1)            | Start coding before preflight check                                 |
+| Use AVM-TF modules for EVERY resource that has one                    | Write raw `azurerm` when AVM-TF exists                              |
+| Generate unique suffix ONCE in `locals.tf`, pass to ALL resources     | Hardcode unique strings                                             |
+| Apply baseline tags + governance extras via `local.tags`              | Use hardcoded tag maps ignoring governance                          |
+| Parse `04-governance-constraints.json` — map Deny policies to TF args | Skip governance compliance mapping (HARD GATE)                      |
+| Apply security baseline (TLS 1.2, HTTPS, managed identity, no public) | Use `APPINSIGHTS_INSTRUMENTATIONKEY` (use CONNECTION_STRING)        |
+| Use `var.deployment_phase` + `count` for phased deployment            | Use `terraform -target` or `terraform { cloud { } }` / `TFE_TOKEN`  |
+| Generate bootstrap + deploy scripts (bash + PS)                       | Put hyphens in Storage Account names                                |
+| Run `terraform validate` + `terraform fmt -check` after generation    | Deploy — that's the Deploy agent's job                              |
+| Save `05-implementation-reference.md` + update project README         | Proceed without checking AVM-TF variable types (known issues exist) |
 
 ## Prerequisites Check
 
 Before starting, validate these files exist in `agent-output/{project}/`:
 
-1. `04-implementation-plan.md` — **REQUIRED**. If missing, STOP and request
-   handoff to Terraform Plan agent.
-2. `04-governance-constraints.json` — **REQUIRED**. If missing, STOP and request
-   governance discovery. This file is consumed in Phase 1.5.
-3. `04-governance-constraints.md` — **REQUIRED**. Human-readable governance constraints.
-
-Read these for context:
-
-- `04-implementation-plan.md` — resource inventory, module sources, dependencies,
-  deployment phase strategy
-- `04-governance-constraints.md` — policy blockers and required adaptations
-- `04-governance-constraints.json` — machine-actionable policy data for compliance mapping
-- `02-architecture-assessment.md` — tier/SKU recommendations and WAF considerations
+1. `04-implementation-plan.md` — **REQUIRED**. If missing, STOP → handoff to Terraform Plan agent
+2. `04-governance-constraints.json` — **REQUIRED**. If missing, STOP → request governance discovery
+3. `04-governance-constraints.md` — **REQUIRED**. Human-readable governance constraints
+
+Also read `02-architecture-assessment.md` for tier/SKU context.
 
 ## Session State Protocol
 
@@ -182,343 +144,99 @@
 
 - **Context budget**: 3 files at startup (`00-session-state.json` + `04-implementation-plan.md` + `04-governance-constraints.json`)
 - **My step**: 5
-- **Sub-step checkpoints**: `phase_1_preflight` → `phase_1.5_governance` →
+- **Sub-steps**: `phase_1_preflight` → `phase_1.5_governance` →
   `phase_2_scaffold` → `phase_3_modules` → `phase_4_lint` →
   `phase_5_challenger` → `phase_6_artifact`
-- **Resume detection**: Read `00-session-state.json` BEFORE reading skills. If `steps.5.status`
-  is `"in_progress"` with a `sub_step`, skip to that checkpoint (e.g. if `phase_3_modules`,
-  preflight and governance are done — read `04-preflight-check.md` on-demand and continue module coding).
-- **State writes**: Update `00-session-state.json` after each phase. On completion, set
-  `steps.5.status = "complete"` and list all generated Terraform files in `steps.5.artifacts`.
+- **Resume**: Read `00-session-state.json` first. If `steps.5.status = "in_progress"`
+  with a `sub_step`, skip to that checkpoint.
+- **State writes**: Update `00-session-state.json` after each phase.
 
 ## Workflow
 
 ### Phase 1: Preflight Check (MANDATORY)
 
-Before writing ANY Terraform code, validate AVM-TF compatibility:
+For EACH resource in `04-implementation-plan.md`:
 
-1. For EACH resource in `04-implementation-plan.md`:
-   - Query `terraform/search_modules` to confirm AVM-TF module exists (use `Azure` namespace)
-   - If AVM-TF exists: use `terraform/get_module_details` to retrieve variable schema
-   - Cross-check planned variables against actual module schema
-   - Check `terraform/get_latest_module_version` to pin correct version band (`~> X.Y`)
-   - Flag any type mismatches or missing required variables (see AVM Known Pitfalls in
-     terraform-patterns skill)
-2. Verify `azurerm` provider arguments via `terraform/search_providers` for resources without AVM-TF
-3. Check region limitations for all services
-4. Save results to `agent-output/{project}/04-preflight-check.md`
-5. If blockers found → STOP and report to user
+1. `terraform/search_modules` → confirm AVM-TF exists (namespace `Azure`)
+2. `terraform/get_module_details` → retrieve variable schema
+3. Cross-check planned variables against schema; flag type mismatches (see AVM Known Pitfalls in terraform-patterns skill)
+4. `terraform/get_latest_module_version` → pin version band (`~> X.Y`)
+5. For non-AVM resources: verify `azurerm` provider arguments via `terraform/search_providers`
+6. Check region limitations
+7. Save to `agent-output/{project}/04-preflight-check.md`; STOP if blockers found
 
 ### Phase 1.5: Governance Compliance Mapping (MANDATORY)
 
 > [!CAUTION]
-> This is a **HARD GATE**. Do NOT proceed to Phase 2 with unresolved policy violations.
-> See `.github/instructions/terraform-policy-compliance.instructions.md` for the full mandate.
-
-1. **Read** `agent-output/{project}/04-governance-constraints.json`
-2. **Extract** all `Deny` policies and their `azurePropertyPath` + `requiredValue` fields
-3. **Translate** `azurePropertyPath` to the corresponding Terraform argument using the
-   translation table in `terraform-policy-compliance.instructions.md`
-4. **Build a compliance map** — for each Deny policy, identify:
-   - Target resource type(s) in Terraform
-   - Terraform argument that must be set
-   - Required value to avoid policy denial
-5. **Extract tag requirements** — merge governance-discovered tags with the 4 baseline defaults.
-   Governance constraints always win (the 4 baseline tags are a MINIMUM)
-6. **Validate** that every resource in `04-implementation-plan.md` can be configured to comply
-7. **Document** the compliance map in the implementation reference
-8. If any Deny policy **cannot** be satisfied → STOP and report to user
-
-**Policy Effect → Code Generator Action:**
-
-| Effect              | Code Generator Action                                            |
-| ------------------- | ---------------------------------------------------------------- |
-| `Deny`              | MUST set the translated Terraform argument to the required value |
-| `Modify`            | Document expected Azure modification — do NOT set conflicting    |
-| `DeployIfNotExists` | Document auto-deployed resource in implementation reference      |
-| `Audit`             | Set compliant value where feasible (best effort)                 |
-| `Disabled`          | No action required                                               |
-
-### Phase 2: Progressive Implementation
-
-Build configurations in dependency order.
-
-**Check `04-implementation-plan.md` for deployment strategy:**
-
-- If **phased**: add `variable "deployment_phase"` to `variables.tf`
-  (default: `"all"`, type: `string`). Wrap each module call with:
-  ```hcl
-  count = var.deployment_phase == "all" || var.deployment_phase == "{phase_name}" ? 1 : 0
-  ```
-  Phase name values match the plan (e.g., `"foundation"`, `"security"`, `"data"`,
-  `"compute"`, `"edge"`). This lets `deploy.sh`/`deploy.ps1` pass `-var deployment_phase=foundation`.
-- If **single**: no `deployment_phase` variable needed.
-
-**Round 1 — Foundation:**
-
-- `versions.tf` (Terraform + provider requirements, `azurerm` version pinned to `~> X.Y`)
-- `providers.tf` (`provider "azurerm" { features {} }`)
-- `backend.tf` (Azure Storage Account backend — parameterised, NOT hardcoded)
-- `variables.tf` (all input variables with descriptions and validation)
-- `locals.tf` (`unique_suffix`, `tags`, project-wide computed values)
-- `main.tf` header + resource group
-
-**Round 2 — Shared Infrastructure:**
+> **HARD GATE**. Do NOT proceed to Phase 2 with unresolved policy violations.
 
-- Networking (VNet, subnets, NSGs) — use AVM-TF modules where available
-- Key Vault — use `Azure/avm-res-keyvault-vault/azurerm`
-- Log Analytics + Application Insights
+1. Read `04-governance-constraints.json` — extract all `Deny` policies
+2. Translate `azurePropertyPath` → Terraform argument (use translation table in `terraform-policy-compliance.instructions.md`)
+3. Build compliance map: resource type → TF argument → required value
+4. Merge governance tags with 4 baseline defaults (governance wins)
+5. Validate every planned resource can comply; STOP if any Deny unsatisfiable
 
-**Round 3 — Application Resources:**
+**Policy Effect Reference**: `azure-defaults/references/policy-effect-decision-tree.md`
 
-- Compute (App Service, Container Apps, Functions) — use AVM-TF modules
-- Data (SQL, Cosmos DB, Storage Account) — use AVM-TF modules
-- Messaging (Service Bus, Event Grid)
-
-**Round 4 — Integration:**
-
-- Diagnostic settings on all resources (use `azurerm_monitor_diagnostic_setting`)
-- Role assignments (managed identity → Key Vault, Storage, etc.)
-- `outputs.tf` (resource IDs, endpoints, connection info)
-
-After each round: run `terraform validate` to catch errors early.
-
-### Phase 2.5: State Backend Bootstrap
-
-Generate two idempotent bootstrap scripts that provision the Azure Storage Account
-backend BEFORE `terraform init` can be run.
-
-**Both scripts MUST be:**
-
-- **Parameterized** — accept `RESOURCE_GROUP`, `STORAGE_ACCOUNT`, `CONTAINER`,
-  `LOCATION` as parameters (with sensible defaults)
-- **Idempotent** — check whether the resource exists before creating it
-- **Governance-aware** — read `04-governance-constraints.json` for naming policies
-  BEFORE setting default names (e.g., if a naming convention policy is in effect,
-  default names must comply)
-
-**`bootstrap-backend.sh`** (Bash, for Linux/macOS/Codespaces):
+### Phase 2: Progressive Implementation
 
-```bash
-#!/usr/bin/env bash
-# Bootstrap Azure Storage Account for Terraform remote state
-set -euo pipefail
+Build configurations in dependency order from `04-implementation-plan.md`.
 
-RESOURCE_GROUP="${1:-rg-tfstate-{project}}"
-STORAGE_ACCOUNT="${2:-sttfstate{suffix}}"
-CONTAINER="${3:-tfstate}"
-LOCATION="${4:-swedencentral}"
+If **phased**: add `variable "deployment_phase"` with `count` conditionals per module.
+If **single**: no `deployment_phase` variable needed.
 
-# Check before create (idempotent)
-az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none || true
-# ... storage account and container creation with checks
-```
+| Round | Files                                                                                                |
+| ----- | ---------------------------------------------------------------------------------------------------- |
+| 1     | `versions.tf`, `providers.tf`, `backend.tf`, `variables.tf`, `locals.tf`, `main.tf` (resource group) |
+| 2     | Networking (VNet, subnets, NSGs), Key Vault, Log Analytics + App Insights                            |
+| 3     | Compute, Data, Messaging — all via AVM-TF modules                                                    |
+| 4     | Diagnostic settings, role assignments, `outputs.tf`                                                  |
 
-**`bootstrap-backend.ps1`** (PowerShell, for Windows/CI):
+After each round: `terraform validate` to catch errors early.
 
-```powershell
-param(
-    [string]$ResourceGroup = "rg-tfstate-{project}",
-    [string]$StorageAccount = "sttfstate{suffix}",
-    [string]$Container = "tfstate",
-    [string]$Location = "swedencentral"
-)
-# Check before create (idempotent)
-```
+### Phase 2.5: Bootstrap Scripts
 
-Save both files to `infra/terraform/{project}/`.
+Generate `bootstrap-backend.sh` + `bootstrap-backend.ps1`. Read
+`terraform-patterns/references/bootstrap-backend-template.md` for templates.
 
 ### Phase 3: Deploy Scripts
 
-Generate BOTH `deploy.sh` (Bash) AND `deploy.ps1` (PowerShell).
+Generate `deploy.sh` + `deploy.ps1`. Read
+`terraform-patterns/references/deploy-script-template.md` for templates.
 
-Both scripts must include:
+### Phase 4: Validation (Subagent-Driven)
 
-- Parameter validation (`RESOURCE_GROUP`, `LOCATION`, `ENVIRONMENT`, and optionally
-  `DEPLOYMENT_PHASE` if phased plan)
-- **Phase-aware execution** (if phased plan):
-  - Accept phase name as parameter (default: `all`)
-  - Pass `-var deployment_phase={phase}` to `terraform plan`/`apply`
-  - For full deploy: loop through phases sequentially with approval prompts
-- `terraform init` with backend config values
-- `terraform plan -out=tfplan -var-file=...`
-- User approval prompt before `terraform apply`
-- `terraform apply tfplan`
-- Output of `terraform output` after successful apply
-- Error handling with meaningful messages
-
-**`deploy.sh`** banner:
-
-```text
-╔════════════════════════════════════════╗
-║   {Project Name} - Terraform Deploy    ║
-╚════════════════════════════════════════╝
-```
+1. Delegate to `terraform-lint-subagent` (path: `infra/terraform/{project}/`) — expect PASS
+2. Delegate to `terraform-review-subagent` (same path) — expect APPROVED
+3. Both must pass before Phase 4.5
 
-**`deploy.ps1`** banner mirrors the same format.
+### Phase 4.5: Adversarial Code Review (3 passes)
 
-Save both to `infra/terraform/{project}/`.
+Read `azure-defaults/references/adversarial-review-protocol.md` for lens table and invocation template.
 
-### Phase 4: Validation (Subagent-Driven)
+Invoke `challenger-review-subagent` 3× with `artifact_type = "iac-code"`, rotating `review_focus` per protocol.
+Write results to `challenge-findings-iac-code-pass{N}.json`. Fix any `must_fix` items, re-validate, re-run failing pass.
 
-Delegate validation to specialized subagents for thorough analysis:
+Save validation status in `05-implementation-reference.md`. Run `npm run lint:artifact-templates`.
 
-**Step 1 — Lint Validation** (run in parallel with Step 2):
+## Project Structure & Patterns
 
-Delegate to `terraform-lint-subagent`:
+Read `terraform-patterns/references/project-scaffold.md` for the standard
+file structure, `locals.tf` pattern, and phased deployment pattern.
 
-- Provide the project path: `infra/terraform/{project}/`
-- Expect PASS/FAIL result with diagnostics
-- If FAIL: fix errors, then re-run lint subagent
-
-**Step 2 — Code Review** (run in parallel with Step 1):
-
-Delegate to `terraform-review-subagent`:
-
-- Provide the project path: `infra/terraform/{project}/`
-- Expect APPROVED/NEEDS_REVISION/FAILED verdict
-- If NEEDS_REVISION: address feedback, then re-run review subagent
-- If FAILED: address critical issues before proceeding
-
-**Step 3 — Finalize**:
-
-Both subagents must return passing results before proceeding to adversarial review.
-
-### Phase 4.5: Adversarial Code Review (3 passes — rotating lenses)
-
-After lint and review subagents pass, run 3 adversarial passes on the generated code:
-
-| Pass | `review_focus`             | Lens Description                                            |
-| ---- | -------------------------- | ----------------------------------------------------------- |
-| 1    | `security-governance`      | Policy compliance, identity, network isolation, encryption  |
-| 2    | `architecture-reliability` | WAF balance, SLA feasibility, failure modes, dependencies   |
-| 3    | `cost-feasibility`         | SKU sizing, pricing realism, budget alignment, reservations |
-
-For each pass, invoke `challenger-review-subagent` via `#runSubagent`:
-
-- `artifact_path` = `infra/terraform/{project}/`
-- `project_name` = `{project}`
-- `artifact_type` = `iac-code`
-- `review_focus` = per-pass value from table above
-- `pass_number` = `1` / `2` / `3`
-- `prior_findings` = `null` for pass 1; **compact prior findings string for passes 2-3** (see below)
-
-Write each result to `agent-output/{project}/challenge-findings-iac-code-pass{N}.json`.
-
-> [!IMPORTANT]
-> **Context efficiency — compact prior_findings**
->
-> After writing each pass result to disk, **do NOT keep the full JSON in working context**.
-> Extract only the `compact_for_parent` string from the subagent response and discard the rest.
->
-> For passes 2 and 3, set `prior_findings` to a compact string built from previous
-> `compact_for_parent` values — **not the full JSON objects**:
->
-> ```text
-> prior_findings: "Pass 1: <compact_for_parent>\nPass 2: <compact_for_parent>"
-> ```
-
-If any pass returns `must_fix` items:
-
-1. Fix the code
-2. Re-run `terraform-lint-subagent` and `terraform-review-subagent`
-3. Re-run only the failing adversarial pass
-
-Save validation status (including all subagent verdicts) in `05-implementation-reference.md`.
-Run `npm run lint:artifact-templates` and fix any H2 structure errors for your artifacts.
-
-## File Structure
-
-```text
-infra/terraform/{project}/
-├── versions.tf             # Terraform + provider requirements
-├── providers.tf            # Provider configuration (features {})
-├── backend.tf              # Azure Storage Account backend
-├── variables.tf            # All input variable declarations
-├── locals.tf               # unique_suffix, tags, computed values
-├── main.tf                 # Resource group + module calls
-├── outputs.tf              # Resource IDs, endpoints, connection info
-├── bootstrap-backend.sh    # Bash script: provision storage account for state
-├── bootstrap-backend.ps1   # PowerShell script: same
-├── deploy.sh               # Bash deployment script
-├── deploy.ps1              # PowerShell deployment script
-└── modules/                # Optional — only for complex sub-compositions
-    └── {component}/
-        ├── main.tf
-        ├── variables.tf
-        └── outputs.tf
-```
-
-### Key Pattern: `locals.tf`
-
-```hcl
-locals {
-  unique_suffix = substr(md5(azurerm_resource_group.this.id), 0, 6)
-
-  tags = merge(
-    {
-      Environment = var.environment
-      ManagedBy   = "Terraform"
-      Project     = var.project_name
-      Owner       = var.owner
-    },
-    var.additional_tags  # extra tags from governance constraints
-  )
-}
-```
-
-### Key Pattern: Phased Deployment
-
-```hcl
-variable "deployment_phase" {
-  description = "Deployment phase to execute. Use 'all' for full deployment."
-  type        = string
-  default     = "all"
-
-  validation {
-    condition     = contains(["all", "foundation", "security", "data", "compute", "edge"], var.deployment_phase)
-    error_message = "Invalid deployment_phase value."
-  }
-}
-
-module "key_vault" {
-  source  = "Azure/avm-res-keyvault-vault/azurerm"
-  version = "~> 0.9"
-  count   = var.deployment_phase == "all" || var.deployment_phase == "security" ? 1 : 0
-  # ...
-}
-```
-
-## Output Files
-
-| File                     | Location                                                |
-| ------------------------ | ------------------------------------------------------- |
-| Preflight Check          | `agent-output/{project}/04-preflight-check.md`          |
-| Implementation Ref       | `agent-output/{project}/05-implementation-reference.md` |
-| Terraform Configurations | `infra/terraform/{project}/`                            |
-| Bootstrap Backend (Bash) | `infra/terraform/{project}/bootstrap-backend.sh`        |
-| Bootstrap Backend (PS)   | `infra/terraform/{project}/bootstrap-backend.ps1`       |
-| Deploy Script (Bash)     | `infra/terraform/{project}/deploy.sh`                   |
-| Deploy Script (PS)       | `infra/terraform/{project}/deploy.ps1`                  |
+## Boundaries
 
-Include attribution header from the template file (do not hardcode).
+- **Always**: Run preflight + governance mapping, use AVM-TF modules, generate bootstrap/deploy scripts, validate with subagents
+- **Ask first**: Non-standard module sources, custom provider versions, phased deployment grouping changes
+- **Never**: Deploy infrastructure, write `terraform { cloud {} }` blocks, use `TFE_TOKEN`, skip governance mapping
 
 ## Validation Checklist
 
-- [ ] Preflight check completed and saved to `04-preflight-check.md`
-- [ ] AVM-TF modules used for all resources with module availability
-- [ ] `unique_suffix` generated once in `locals.tf`, used across all resources
-- [ ] Governance compliance mapping completed (Phase 1.5)
-- [ ] All tags from governance constraints applied to every resource
-- [ ] Every Deny policy `azurePropertyPath` translated to Terraform argument and satisfied
-- [ ] `var.deployment_phase` + `count` conditionals used (not `-target`)
-- [ ] No `terraform { cloud { } }` blocks present anywhere
-- [ ] Azure Storage Account backend configured in `backend.tf`
-- [ ] Security baseline applied (TLS 1.2, HTTPS, managed identity, no public access)
-- [ ] CAF naming conventions followed (from azure-defaults Terraform Conventions section)
-- [ ] `bootstrap-backend.sh` and `bootstrap-backend.ps1` generated and idempotent
-- [ ] `deploy.sh` and `deploy.ps1` generated with error handling
-- [ ] `terraform-lint-subagent` returns PASS
-- [ ] `terraform-review-subagent` returns APPROVED
-- [ ] `challenger-review-subagent` 3-pass adversarial code review completed
-- [ ] `05-implementation-reference.md` saved with validation status
+- [ ] Preflight check saved to `04-preflight-check.md`
+- [ ] AVM-TF modules used for all available resources
+- [ ] Governance compliance map complete — all Deny policies satisfied
+- [ ] Security baseline applied (TLS 1.2, HTTPS, managed identity)
+- [ ] Bootstrap + deploy scripts generated (bash + PS)
+- [ ] `terraform-lint-subagent` PASS + `terraform-review-subagent` APPROVED
+- [ ] 3-pass adversarial review completed
+- [ ] `05-implementation-reference.md` saved
```

#### Modified: `.github/agents/07b-bicep-deploy.agent.md` (+42/-63)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/07b-bicep-deploy.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/07b-bicep-deploy.agent.md	2026-03-04 06:47:05.104320879 +0000
@@ -118,29 +118,19 @@
 
 ## DO / DON'T
 
-### DO
-
-- ✅ ALWAYS run preflight validation BEFORE deployment (Steps 1-4 below)
-- ✅ Check `04-implementation-plan.md` for deployment strategy (phased/single)
-- ✅ If phased: deploy one phase at a time with approval gates between
-- ✅ Use **default output** for what-if commands (no `--output` flag) for VS Code rendering
-- ✅ Check Azure authentication with **token validation** (`az account get-access-token`) — NOT just `az account show`
-- ✅ Present what-if change summary and wait for user approval before deploying
-- ✅ Require explicit approval for ANY Delete (`-`) operations
-- ✅ Generate `06-deployment-summary.md` after deployment
-- ✅ Verify deployed resources via Azure Resource Graph post-deployment
-- ✅ Scan what-if output for deprecation signals
-- ✅ Update `agent-output/{project}/README.md` — mark Step 6 complete, add your artifacts (see azure-artifacts skill)
-
-### DON'T
-
-- ❌ Deploy without running what-if first
-- ❌ Skip phase gates when plan specifies phased deployment
-- ❌ Use `--output yaml` or `--output json` for what-if (disables VS Code rendering)
-- ❌ Auto-approve production deployments (require explicit user confirmation)
-- ❌ Proceed if what-if shows Delete operations without user approval
-- ❌ Proceed if `bicep build` fails
-- ❌ Create or modify Bicep templates — hand back to Bicep Code agent
+| ✅ DO                                                             | ❌ DON'T                                                  |
+| ----------------------------------------------------------------- | --------------------------------------------------------- |
+| Run preflight validation BEFORE deployment                        | Deploy without running what-if first                      |
+| Check `04-implementation-plan.md` for deployment strategy         | Skip phase gates when plan specifies phased deployment    |
+| Deploy phases one at a time with approval gates                   | Use `--output yaml/json` for what-if (disables rendering) |
+| Use **default output** for what-if (no `--output` flag)           | Auto-approve production deployments                       |
+| Validate auth via `az account get-access-token` (not just `show`) | Proceed if what-if shows Delete ops without approval      |
+| Present what-if summary; wait for user approval                   | Proceed if `bicep build` fails                            |
+| Require explicit approval for Delete (`-`) operations             | Create/modify Bicep templates — hand back to Code agent   |
+| Generate `06-deployment-summary.md` after deployment              |                                                           |
+| Verify resources via Azure Resource Graph post-deploy             |                                                           |
+| Scan what-if output for deprecation signals                       |                                                           |
+| Update `agent-output/{project}/README.md` — mark Step 6 complete  |                                                           |
 
 ## Prerequisites Check
 
@@ -165,32 +155,10 @@
 
 ## MANDATORY: Azure CLI Token Validation
 
-> **CRITICAL**: `az account show` can succeed with stale cached metadata even when
-> no valid ARM token exists. This causes repeated auth prompts and deployment
-> failures, especially in devcontainers and WSL environments.
-
-**ALWAYS validate auth with a real token acquisition — NEVER rely on `az account show` alone.**
-
-```bash
-# Step 1: Quick context check (informational only — NOT sufficient for auth)
-az account show --output table
-
-# Step 2: MANDATORY — Validate real ARM token acquisition
-az account get-access-token --resource https://management.azure.com/ --output none
-```
-
-**If Step 2 fails** ("User does not exist in MSAL token cache"):
-
-1. Run `az login --use-device-code` (works reliably in devcontainers/WSL/Codespaces)
-2. Run `az account set --subscription {subscription-id}`
-3. Re-run Step 2 to confirm token is valid
-4. Only then proceed with what-if/deployment
-
-**Why this matters**: Azure CLI stores account metadata (`~/.azure/azureProfile.json`)
-separately from MSAL tokens. Container restarts, session timeouts, or interrupted
-logins can leave metadata intact while tokens are missing or expired.
-The Azure VS Code extension auth context is also separate from CLI auth —
-being signed in via the extension does NOT mean CLI commands will work.
+Read `azure-defaults/references/azure-cli-auth-validation.md` for the
+full two-step validation procedure and recovery steps.
+Key rule: `az account show` alone is NOT sufficient — always validate
+with `az account get-access-token`.
 
 ## Preflight Validation Workflow
 
@@ -224,39 +192,16 @@
 
 > **CRITICAL**: Use default output (NO `--output` flag) for VS Code rendering.
 
-**For azd projects:**
-
-```bash
-azd provision --preview
-```
-
-**For standalone Bicep (resource group scope):**
-
 ```bash
+# Resource group scope (most common)
 az deployment group what-if \
   --resource-group rg-{project}-{env} \
   --template-file main.bicep \
   --parameters main.bicepparam \
   --validation-level Provider
-```
-
-**For subscription scope:**
-
-```bash
-az deployment sub what-if \
-  --location {location} \
-  --template-file main.bicep \
-  --parameters main.bicepparam
-```
-
-**Fallback if RBAC check fails:**
-
-```bash
-az deployment group what-if \
-  --resource-group rg-{project}-{env} \
-  --template-file main.bicep \
-  --parameters main.bicepparam \
-  --validation-level ProviderNoRbac
+# Subscription scope: az deployment sub what-if --location {location} ...
+# azd project: azd provision --preview
+# RBAC fallback: use --validation-level ProviderNoRbac
 ```
 
 ### Step 5: Classify and Present Changes
@@ -278,48 +223,30 @@
 
 ### Step 5.5: Pre-Deploy Adversarial Review (1 pass)
 
-After what-if analysis completes and before deployment execution, invoke `challenger-review-subagent` via `#runSubagent`:
-
-- `artifact_path` = `agent-output/{project}/06-deployment-summary.md` (or the what-if output captured above)
-- `project_name` = `{project}`
-- `artifact_type` = `deployment-preview`
-- `review_focus` = `comprehensive`
-- `pass_number` = `1`
-- `prior_findings` = `null`
-
+After what-if, invoke `challenger-review-subagent` via `#runSubagent` with
+`artifact_type=deployment-preview`, `review_focus=comprehensive`, `pass_number=1`.
 Write result to `agent-output/{project}/challenge-findings-deployment.json`.
 
-Include findings in the deployment approval gate.
-If `must_fix` count > 0, flag prominently and require explicit user acknowledgement before proceeding.
+Include findings in the deployment approval gate. If `must_fix` count > 0,
+flag prominently and require explicit user acknowledgement before proceeding.
 
 ## Deployment Execution
 
-### Phase-Aware Deployment
-
-Before deploying, read `04-implementation-plan.md` and check the
-`## Deployment Phases` section:
+Read `04-implementation-plan.md` `## Deployment Phases` to determine phased vs single deployment.
 
-- If **phased**: deploy each phase sequentially
-  1. Run what-if for the current phase:
-     `pwsh -File deploy.ps1 -Phase {phaseName} -WhatIf`
-  2. Present what-if results and wait for user approval
-  3. Execute: `pwsh -File deploy.ps1 -Phase {phaseName}`
-  4. Verify phase resources via ARG query
-  5. Present phase completion summary with approval gate
-  6. Repeat for next phase
-- If **single**: deploy everything in one what-if + deploy cycle
+**Phased**: Deploy each phase sequentially — run what-if
+(`deploy.ps1 -Phase {name} -WhatIf`), get approval,
+execute (`deploy.ps1 -Phase {name}`), verify via ARG, then repeat.
 
-### Option 1: PowerShell Script (Recommended)
+**Single**: One what-if + deploy cycle.
 
 ```bash
+# Option 1: PowerShell (recommended)
 cd infra/bicep/{project}
 pwsh -File deploy.ps1 -WhatIf   # Preview first
 pwsh -File deploy.ps1            # Execute (after approval)
-```
-
-### Option 2: Direct Azure CLI (Fallback)
 
-```bash
+# Option 2: Azure CLI (fallback)
 az group create --name rg-{project}-{env} --location swedencentral
 az deployment group create \
   --resource-group rg-{project}-{env} \
@@ -341,18 +268,13 @@
 
 ## Stopping Rules
 
-**STOP IMMEDIATELY if:**
-
-- `bicep build` returns errors
-- What-if shows Delete (`-`) operations — require explicit user approval
-- What-if shows >10 modified resources — summarize and confirm
-- User has not approved deployment
-- Azure authentication not configured
-- Deprecation signals detected in what-if output
-
-**PREFLIGHT ONLY MODE:**
-If user selects "Preflight Only" handoff, generate `06-deployment-summary.md`
-with preflight results but DO NOT execute deployment. Mark status as "Simulated".
+**STOP IMMEDIATELY if:** `bicep build` errors · Delete (`-`) ops without
+approval · >10 modified resources (summarize first) · user hasn't approved ·
+auth not configured · deprecation signals detected.
+
+**PREFLIGHT ONLY MODE:** If user selects "Preflight Only", generate
+`06-deployment-summary.md` with preflight results only.
+Mark status as "Simulated".
 
 ## Known Issues
 
@@ -373,6 +295,12 @@
 Include attribution header from the template file (do not hardcode).
 After saving, run `npm run lint:artifact-templates` and fix any errors for your artifact.
 
+## Boundaries
+
+- **Always**: Run what-if analysis before deployment, require user approval, validate prerequisites
+- **Ask first**: Non-standard deployment parameters, skipping what-if, deploying to production
+- **Never**: Deploy without user approval, modify IaC templates, skip what-if for production
+
 ## Validation Checklist
 
 - [ ] Azure CLI authenticated (`az account get-access-token --resource https://management.azure.com/` succeeds)
```

#### Modified: `.github/agents/07t-terraform-deploy.agent.md` (+43/-64)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/07t-terraform-deploy.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/07t-terraform-deploy.agent.md	2026-03-04 06:47:05.104320879 +0000
@@ -115,30 +115,19 @@
 
 ## DO / DON'T
 
-### DO
-
-- ✅ Validate Azure CLI token FIRST (`az account get-access-token`) — NOT just `az account show`
-- ✅ Verify the state backend storage account exists BEFORE running `terraform init`
-- ✅ Offer to run `bootstrap-backend.sh`/`bootstrap-backend.ps1` if backend resources are missing
-- ✅ Run `terraform validate` and `terraform fmt -check` before planning
-- ✅ Check `04-implementation-plan.md` for deployment strategy (phased/single)
-- ✅ If phased: deploy one phase at a time with `var.deployment_phase` and approval gates
-- ✅ Present `terraform plan` output summary and wait for user approval before applying
-- ✅ Require explicit approval for ANY resource destruction (`- destroy`) operations
-- ✅ Generate `06-deployment-summary.md` after deployment
-- ✅ Run `terraform output` and query Azure Resource Graph post-deployment
-- ✅ Update `agent-output/{project}/README.md` — mark Step 6 complete, add your artifacts
-
-### DON'T
-
-- ❌ Deploy without running `terraform plan` first
-- ❌ Skip phase gates when plan specifies phased deployment
-- ❌ Use `terraform -target` — the code is already phase-gated via `var.deployment_phase`
-- ❌ Auto-approve production deployments (require explicit user confirmation)
-- ❌ Proceed if `terraform plan` shows resource destruction without user approval
-- ❌ Proceed if `terraform validate` fails
-- ❌ Create or modify Terraform configurations — hand back to Terraform Code agent
-- ❌ Run `terraform init` without verifying the backend storage account exists first
+| ✅ DO                                                                    | ❌ DON'T                                                                 |
+| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
+| Validate Azure CLI token FIRST (`az account get-access-token`)           | Deploy without running `terraform plan` first                            |
+| Verify state backend storage account BEFORE `terraform init`             | Skip phase gates when plan specifies phased deployment                   |
+| Offer `bootstrap-backend.sh/.ps1` if backend missing                     | Use `terraform -target` — code is phase-gated via `var.deployment_phase` |
+| Run `terraform validate` and `terraform fmt -check` before planning      | Auto-approve production deployments                                      |
+| Check `04-implementation-plan.md` for deployment strategy                | Proceed if plan shows resource destruction without approval              |
+| Deploy phases one at a time with `var.deployment_phase` + approval gates | Proceed if `terraform validate` fails                                    |
+| Present plan summary; wait for user approval before applying             | Create/modify Terraform configs — hand back to Code agent                |
+| Require explicit approval for destruction (`- destroy`) operations       | Run `terraform init` without verifying backend exists                    |
+| Generate `06-deployment-summary.md` after deployment                     |                                                                          |
+| Run `terraform output` + Azure Resource Graph post-deployment            |                                                                          |
+| Update `agent-output/{project}/README.md` — mark Step 6 complete         |                                                                          |
 
 ## Prerequisites Check
 
@@ -165,59 +154,29 @@
 
 ### Step 1: Azure CLI Authentication Validation
 
-> **CRITICAL**: `az account show` can succeed with stale cached metadata even when
-> no valid ARM token exists. Always validate with a real token acquisition.
-
-```bash
-# Informational check only — NOT sufficient for auth validation
-az account show --output table
-
-# MANDATORY: Verify real ARM token acquisition
-az account get-access-token --resource https://management.azure.com/ --output none
-```
-
-**If token acquisition fails** ("User does not exist in MSAL token cache"):
-
-1. Run `az login --use-device-code` — works reliably in devcontainers/Codespaces
-2. Run `az account set --subscription {subscription-id}`
-3. Re-run `az account get-access-token` to confirm
-4. Only then proceed with planning/deployment
+Read `azure-defaults/references/azure-cli-auth-validation.md` for the
+full two-step validation procedure and recovery steps.
+Key rule: `az account show` alone is NOT sufficient — always validate
+with `az account get-access-token`.
 
 ### Step 2: State Backend Verification
 
 Verify the Azure Storage Account backend exists before initializing:
 
 ```bash
-# Check if the backend resource group and storage account exist
 az storage account show \
   --name {storage_account_name} \
   --resource-group {resource_group_name} \
   --output none 2>/dev/null && echo "Backend exists" || echo "Backend missing"
 ```
 
-**If backend is missing:**
-
-Present the user with the option to run the bootstrap script:
-
-```text
-⚠️ State backend not found.
-  Storage Account: {name}
-  Resource Group: {rg}
-
-Would you like to run bootstrap-backend.sh to create it?
-Reply "bootstrap" to proceed, or create manually first.
-```
-
-On approval, run:
+**If backend is missing:** Prompt user to run `bootstrap-backend.sh` (or `bootstrap-backend.ps1` on Windows). On approval:
 
 ```bash
 cd infra/terraform/{project}
-chmod +x bootstrap-backend.sh
-./bootstrap-backend.sh
+chmod +x bootstrap-backend.sh && ./bootstrap-backend.sh
 ```
 
-Or on Windows: `pwsh -File bootstrap-backend.ps1`
-
 ### Step 3: Validate Configuration
 
 ```bash
@@ -266,56 +225,27 @@
 
 ### Step 4.5: Pre-Deploy Adversarial Review (1 pass)
 
-After terraform plan completes and before apply, invoke `challenger-review-subagent` via `#runSubagent`:
+After terraform plan, invoke `challenger-review-subagent` via `#runSubagent`
+with `artifact_type=deployment-preview`, `review_focus=comprehensive`,
+`pass_number=1`. Write result to
+`agent-output/{project}/challenge-findings-deployment.json`.
 
-- `artifact_path` = `agent-output/{project}/06-deployment-summary.md` (or the terraform plan output captured above)
-- `project_name` = `{project}`
-- `artifact_type` = `deployment-preview`
-- `review_focus` = `comprehensive`
-- `pass_number` = `1`
-- `prior_findings` = `null`
-
-Write result to `agent-output/{project}/challenge-findings-deployment.json`.
-
-Include findings in the deployment approval gate.
-If `must_fix` count > 0, flag prominently and require explicit user acknowledgement before proceeding.
+Include findings in the deployment approval gate. If `must_fix` count > 0,
+flag prominently and require explicit user acknowledgement before proceeding.
 
 ### Step 5: Phase-Aware Deployment
 
-Read `04-implementation-plan.md` and check the `## Deployment Phases` section:
-
-**If phased deployment:**
-
-Deploy each phase sequentially:
+Read `04-implementation-plan.md` `## Deployment Phases` to determine phased vs single deployment.
 
-1. Run plan for the current phase:
-   ```bash
-   terraform plan -out=tfplan -var="deployment_phase={phase_name}" [-var-file=...]
-   ```
-2. Present plan summary and wait for user approval
-3. Execute: `terraform apply tfplan`
-4. Run `terraform output` for the completed phase
-5. Verify phase resources via Azure Resource Graph (Step 6 below)
-6. Present phase completion summary with approval gate to continue
-7. Repeat for next phase
+**Phased**: Deploy each phase sequentially:
 
-Or use the deploy script:
+1. `terraform plan -out=tfplan -var="deployment_phase={phase}"` — present summary, get approval
+2. `terraform apply tfplan` — run `terraform output`, verify via ARG, present completion gate
+3. Repeat for next phase
 
-```bash
-# Linux/macOS
-bash deploy.sh --phase foundation
-
-# Windows
-pwsh -File deploy.ps1 -Phase foundation
-```
+Or use deploy scripts: `bash deploy.sh --phase {name}` / `pwsh -File deploy.ps1 -Phase {name}`
 
-**If single deployment:**
-
-```bash
-terraform plan -out=tfplan
-# Present plan, get approval
-terraform apply tfplan
-```
+**Single**: `terraform plan -out=tfplan` → get approval → `terraform apply tfplan`
 
 ### Step 6: Post-Deployment Verification
 
@@ -343,20 +273,14 @@
 
 ## Stopping Rules
 
-**STOP IMMEDIATELY if:**
-
-- `az account get-access-token` fails (auth not valid)
-- State backend storage account does not exist AND user hasn't approved bootstrap
-- `terraform validate` returns errors
-- `terraform plan` shows Destroy (`-`) or Replace (`-/+`) operations without explicit approval
-- `terraform plan` shows >10 resource changes — summarize and confirm
-- User has not approved deployment
-- Deprecation signals detected in plan output
-
-**PLAN-ONLY MODE:**
-If user selects "Run Plan Only" handoff, execute plan and present summary but
-DO NOT run `terraform apply`. Generate `06-deployment-summary.md` with plan results
-and mark status as "Plan Only — Not Applied".
+**STOP IMMEDIATELY if:** `az account get-access-token` fails ·
+backend missing without bootstrap approval · `terraform validate` errors ·
+Destroy/Replace ops without approval · >10 resource changes
+(summarize first) · user hasn't approved · deprecation signals detected.
+
+**PLAN-ONLY MODE:** If user selects "Run Plan Only", execute plan and
+present summary but DO NOT apply. Generate `06-deployment-summary.md`
+with plan results, mark status as "Plan Only — Not Applied".
 
 ## Known Issues
 
@@ -378,6 +302,12 @@
 Include attribution header from the template file (do not hardcode).
 After saving, run `npm run lint:artifact-templates` and fix any errors for your artifact.
 
+## Boundaries
+
+- **Always**: Run terraform plan before apply, require user approval, validate prerequisites
+- **Ask first**: Non-standard deployment parameters, skipping plan, deploying to production
+- **Never**: Deploy without user approval, modify IaC configurations, skip plan for production
+
 ## Validation Checklist
 
 - [ ] Azure CLI authenticated (`az account get-access-token` succeeds)
```

#### Modified: `.github/agents/08-as-built.agent.md` (+4/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/08-as-built.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/08-as-built.agent.md	2026-03-04 06:47:05.104320879 +0000
@@ -252,6 +252,12 @@
 | Design vs As-Built Chart  | `agent-output/{project}/07-ab-cost-comparison.png`   |
 | Compliance Gaps Chart     | `agent-output/{project}/07-ab-compliance-gaps.png`   |
 
+## Boundaries
+
+- **Always**: Read all prior artifacts (Steps 1-6), generate complete documentation suite, verify deployment state
+- **Ask first**: Non-standard documentation formats, skipping optional sections
+- **Never**: Modify deployed infrastructure, change IaC templates, skip prior artifact review
+
 ## Validation Checklist
 
 - [ ] All prior artifacts (01-06) read and cross-referenced
```

#### Modified: `.github/agents/09-diagnose.agent.md` (+4/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/09-diagnose.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/09-diagnose.agent.md	2026-03-04 06:47:05.104320879 +0000
@@ -258,6 +258,12 @@
 | Query timeout            | Break into smaller time windows    |
 | MCP tool unavailable     | Fall back to Azure CLI             |
 
+## Boundaries
+
+- **Always**: Use approval-first execution, analyze single resources, save reports to agent-output
+- **Ask first**: Remediation actions, resource modifications, diagnostic commands with side effects
+- **Never**: Modify resources without approval, diagnose multiple resources simultaneously, skip health checks
+
 ## Validation Checklist
 
 - [ ] Target resource confirmed with user before diagnostics
```

#### Modified: `.github/agents/10-challenger.agent.md` (+4/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/10-challenger.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/10-challenger.agent.md	2026-03-04 06:47:05.104320879 +0000
@@ -83,3 +83,9 @@
    - `prior_findings` = `null`
 5. **Write the returned JSON** to `agent-output/{project}/challenge-findings-{artifact_type}.json`
 6. **Present findings** to the user with a summary of `must_fix`, `should_fix`, and `suggestion` counts
+
+## Boundaries
+
+- **Always**: Delegate to challenger-review-subagent, report findings objectively
+- **Ask first**: Non-standard review lenses, reviewing artifacts outside the workflow
+- **Never**: Modify artifacts directly, approve artifacts, skip adversarial review protocol
```

#### Modified: `.github/agents/11-context-optimizer.agent.md` (+4/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/11-context-optimizer.agent.md	2026-03-04 06:46:56.599173548 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/11-context-optimizer.agent.md	2026-03-04 06:47:05.104320879 +0000
@@ -277,3 +277,9 @@
 | Log format changed         | Fall back to manual pattern analysis     |
 | No agent definitions found | Analyze logs only, skip definition audit |
 | Permission denied on logs  | Suggest `chmod` or copy to workspace     |
+
+## Boundaries
+
+- **Always**: Analyze debug logs, produce optimization recommendations, identify token waste
+- **Ask first**: Implementing changes to agent definitions, modifying skill files
+- **Never**: Modify agent definitions directly (recommendations only), change workflow behavior
```

#### Modified: `.github/agents/_subagents/bicep-review-subagent.agent.md` (+34/-101)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/_subagents/bicep-review-subagent.agent.md	2026-03-04 06:46:56.603467052 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/_subagents/bicep-review-subagent.agent.md	2026-03-04 14:49:25.377606977 +0000
@@ -25,17 +25,20 @@
 
 **Your scope**: Review uncommitted or specified Bicep code for quality, security, and standards
 
+## Mandatory Skill Reads
+
+Before starting any review, read these skills for domain knowledge:
+
+1. Read `.github/skills/azure-defaults/SKILL.md` — AVM versions, CAF naming, required tags, security baseline, region defaults
+2. Read `.github/skills/iac-common/SKILL.md` — governance compliance checks, unique suffix patterns, shared IaC review procedures
+
 ## Core Workflow
 
 1. **Receive template path** from parent agent
 2. **Read all Bicep files** in the specified directory
-3. **Review against checklist**:
-   - AVM module usage
-   - Naming conventions (CAF)
-   - Required tags
-   - Security settings
-   - Code quality
-4. **Return structured verdict** to parent
+3. **Read mandatory skills** (above) for current standards
+4. **Review against checklist** (below)
+5. **Return structured verdict** to parent
 
 ## Output Format
 
@@ -67,66 +70,31 @@
 Recommendation: {specific next action}
 ```
 
-## Review Checklist
+## Review Areas
 
-### 1. Azure Verified Modules (AVM)
+### 1. AVM Module Usage (HIGH)
 
-| Check                     | Severity | Details                                         |
-| ------------------------- | -------- | ----------------------------------------------- |
-| Uses AVM modules          | HIGH     | Prefer `br/public:avm/res/*` over raw resources |
-| AVM version current       | MEDIUM   | Check for outdated module versions              |
-| Parameters match AVM spec | HIGH     | Verify required params are provided             |
-
-**AVM Reference Versions**:
-
-- Key Vault: `br/public:avm/res/key-vault/vault:0.11.0`
-- Virtual Network: `br/public:avm/res/network/virtual-network:0.5.0`
-- Storage Account: `br/public:avm/res/storage/storage-account:0.14.0`
-- App Service: `br/public:avm/res/web/site:0.12.0`
-- SQL Server: `br/public:avm/res/sql/server:0.10.0`
-
-### 2. Naming Conventions (CAF)
-
-| Check           | Pattern                                          | Example                 |
-| --------------- | ------------------------------------------------ | ----------------------- |
-| Resource groups | `rg-{workload}-{env}-{region}`                   | `rg-ecommerce-prod-swc` |
-| Key Vault       | `kv-{short}-{env}-{suffix}` (≤24 chars)          | `kv-app-dev-a1b2c3`     |
-| Storage Account | `st{short}{env}{suffix}` (≤24 chars, no hyphens) | `stappdevswca1b2c3`     |
-| Virtual Network | `vnet-{workload}-{env}-{region}`                 | `vnet-hub-prod-swc`     |
-
-### 3. Required Tags
-
-Every resource MUST have these tags:
-
-```bicep
-tags: {
-  Environment: environment    // dev, staging, prod
-  ManagedBy: 'Bicep'          // or 'Terraform'
-  Project: projectName
-  Owner: owner
-}
-```
+Verify all resources use `br/public:avm/res/*` modules with current versions.
+Refer to **azure-defaults** skill for reference versions.
+
+### 2. CAF Naming & Required Tags (HIGH)
+
+Validate resource names follow CAF patterns and all resources carry
+required tags (including `ManagedBy: 'Bicep'`).
+Refer to **azure-defaults** skill for patterns and tag requirements.
+
+### 3. Security Baseline (CRITICAL)
 
-### 4. Security Baseline
+Verify TLS 1.2+, HTTPS-only, no public blob access, Azure AD-only SQL auth,
+managed identities, Key Vault for secrets.
+Refer to **azure-defaults** skill for the full security baseline.
 
-| Check                      | Required Value                    | Severity |
-| -------------------------- | --------------------------------- | -------- |
-| `supportsHttpsTrafficOnly` | `true`                            | CRITICAL |
-| `minimumTlsVersion`        | `'TLS1_2'` or higher              | CRITICAL |
-| `allowBlobPublicAccess`    | `false`                           | CRITICAL |
-| SQL Azure AD-only auth     | `azureADOnlyAuthentication: true` | HIGH     |
-| Managed Identities         | Preferred over connection strings | HIGH     |
-| Key Vault for secrets      | Never hardcode secrets            | CRITICAL |
-
-### 5. Unique Resource Names
-
-| Check                  | Details                                         |
-| ---------------------- | ----------------------------------------------- |
-| `uniqueString()` usage | Generated once in main.bicep, passed to modules |
-| Suffix pattern         | `take(uniqueString(resourceGroup().id), 6)`     |
-| Length constraints     | Key Vault ≤24, Storage ≤24 chars                |
+### 4. Unique Suffix Pattern
 
-### 6. Code Quality
+Verify `uniqueString(resourceGroup().id)` is generated once in `main.bicep`
+and passed to modules. Refer to **iac-common** skill for the pattern.
+
+### 5. Code Quality
 
 | Check               | Severity | Details                                |
 | ------------------- | -------- | -------------------------------------- |
@@ -137,31 +105,24 @@
 
 ### 7. Governance Compliance
 
-> [!IMPORTANT]
-> This section requires the governance constraints file path from the parent Code Generator agent.
-> If the path is not provided, request it before proceeding. Read `04-governance-constraints.md`
-> from `agent-output/{project}/`.
-
-| Check                         | Severity | Details                                                             |
-| ----------------------------- | -------- | ------------------------------------------------------------------- |
-| Tag count matches governance  | HIGH     | Tags MUST match governance constraints, not just 4 defaults         |
-| Deny policies satisfied       | CRITICAL | Every Deny policy constraint is satisfied in the Bicep code         |
-| `publicNetworkAccess` checked | HIGH     | Verify value matches network policies from governance constraints   |
-| `networkAcls` configured      | HIGH     | Verify network ACLs match governance network policy requirements    |
-| SKU restrictions respected    | HIGH     | Verify SKU selections comply with SKU restriction policies          |
-| Security settings compliant   | CRITICAL | Verify TLS, HTTPS, auth settings match security policy requirements |
+Read `04-governance-constraints.md` from `agent-output/{project}/`.
+Follow the governance review procedure in **iac-common** skill.
+
+- Tag count matches governance constraints (4 baseline + discovered)
+- All Deny policy constraints satisfied in resource configs
+- publicNetworkAccess disabled for production data services
+- SKU restriction policies respected
 
-**Governance compliance failures produce `NEEDS_REVISION` (HIGH) or `FAILED` (CRITICAL) verdicts.**
 A template CANNOT pass review with unresolved policy violations.
 
 ## Severity Levels
 
 | Level    | Impact                     | Action                           |
 | -------- | -------------------------- | -------------------------------- |
-| CRITICAL | Security risk or will fail | FAILED - must fix                |
-| HIGH     | Standards violation        | NEEDS_REVISION - should fix      |
-| MEDIUM   | Best practice              | NEEDS_REVISION - recommended fix |
-| LOW      | Code quality               | APPROVED - optional improvement  |
+| CRITICAL | Security risk or will fail | FAILED — must fix                |
+| HIGH     | Standards violation        | NEEDS_REVISION — should fix      |
+| MEDIUM   | Best practice              | NEEDS_REVISION — recommended fix |
+| LOW      | Code quality               | APPROVED — optional improvement  |
 
 ## Verdict Interpretation
 
@@ -169,52 +130,7 @@
 | ----------------------- | -------------- | ------------------------------------ |
 | No critical/high issues | APPROVED       | Proceed to deployment                |
 | High issues only        | NEEDS_REVISION | Return to Bicep Code agent for fixes |
-| Any critical issues     | FAILED         | Stop - human intervention required   |
-
-## Example Review
-
-```text
-BICEP CODE REVIEW
-─────────────────
-Status: NEEDS_REVISION
-Template: infra/bicep/webapp-sql/main.bicep
-Files Reviewed: 4
-
-Summary:
-Template uses AVM modules correctly but is missing required tags on 2 resources
-and has a security warning for SQL authentication.
-
-✅ Passed Checks:
-  - Uses AVM modules (key-vault, storage-account)
-  - Naming follows CAF conventions
-  - uniqueSuffix generated correctly
-  - TLS 1.2 enforced on all resources
-
-❌ Failed Checks:
-  - [HIGH] modules/database.bicep:45 - SQL server missing azureADOnlyAuthentication
-  - [HIGH] modules/storage.bicep:12 - Missing required 'Owner' tag
-
-⚠️ Warnings:
-  - [MEDIUM] main.bicep:23 - Consider adding @description() to environment param
-  - [LOW] modules/network.bicep - Could use AVM network module instead of raw resource
-
-Detailed Findings:
-
-1. File: modules/database.bicep
-   Line: 45
-   Severity: HIGH
-   Issue: SQL server created without Azure AD-only authentication
-   Recommendation: Add `administrators.azureADOnlyAuthentication: true`
-
-2. File: modules/storage.bicep
-   Line: 12
-   Severity: HIGH
-   Issue: Storage account missing required 'Owner' tag
-   Recommendation: Add `Owner: owner` to tags object
-
-Verdict: NEEDS_REVISION
-Recommendation: Fix HIGH severity issues, then re-run review
-```
+| Any critical issues     | FAILED         | Stop — human intervention required   |
 
 ## Constraints
 
```

#### Modified: `.github/agents/_subagents/challenger-review-subagent.agent.md` (+44/-62)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/_subagents/challenger-review-subagent.agent.md	2026-03-04 06:46:56.603467052 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/_subagents/challenger-review-subagent.agent.md	2026-03-04 15:16:41.214291167 +0000
@@ -1,7 +1,9 @@
 ---
 name: challenger-review-subagent
 description: "Adversarial review subagent that challenges Azure infrastructure artifacts. Finds untested assumptions, governance gaps, WAF blind spots, and architectural weaknesses. Returns structured JSON findings to the parent agent. Supports 3-pass rotating-lens reviews for critical steps."
-model: "GPT-5.3-Codex (copilot)"
+model: "Claude Sonnet 4.6 (copilot)"
+# Model rationale: Sonnet 4.6 for all review passes. Provides strong adversarial
+# analysis with lower latency than Opus. Validated via A/B comparison in Phase 10.
 user-invokable: false
 agents: []
 tools: [read, search, web, vscode/askQuestions, "azure-mcp/*"]
@@ -19,11 +21,12 @@
 
 ## MANDATORY: Read Skills First
 
-**Before doing ANY work**, read these skills:
+**Before doing ANY work**, read these skills in order:
 
-1. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags, naming, AVM, security baselines, governance
-2. **Read** `.github/skills/azure-artifacts/SKILL.md` — artifact H2 templates (to validate structural completeness)
-3. **Read** `.github/instructions/bicep-policy-compliance.instructions.md` — governance enforcement rules
+1. **Read** `.github/skills/golden-principles/SKILL.md` — agent operating principles and invariants
+2. **Read** `.github/skills/azure-defaults/SKILL.md` — regions, tags, naming, AVM, security baselines, governance
+3. **Read** `.github/skills/azure-artifacts/SKILL.md` — artifact H2 templates (to validate structural completeness)
+4. **Read** `.github/instructions/bicep-policy-compliance.instructions.md` — governance enforcement rules
 
 ## Inputs
 
@@ -47,201 +50,47 @@
    your adversarial energy on the `review_focus` lens
 5. **Challenge every assumption** — what is taken for granted that could be wrong?
 6. **Find failure modes** — where could deployment fail? What edge cases would break it?
-7. **Uncover hidden dependencies** — what unstated requirements exist? What must be true for this to work?
+7. **Uncover hidden dependencies** — what unstated requirements exist?
 8. **Question optimism** — where is the plan overly optimistic about complexity, cost, or timeline?
-9. **Identify architectural weaknesses** — what design decisions create risk? What alternatives were ignored?
+9. **Identify architectural weaknesses** — what design decisions create risk?
 10. **Test scope boundaries** — what happens at the edges? What is excluded that should be included?
 
 ## Review Focus Lenses
 
-When `review_focus` is set to a specific lens, concentrate your adversarial energy:
+When `review_focus` is set, concentrate adversarial energy on that lens:
 
-### `security-governance`
-
-- Governance gap detection: are ALL Azure Policies discovered and mapped?
-- Security baseline completeness: TLS 1.2, HTTPS-only, managed identity, no public access
-- Compliance requirement → concrete control mapping
-- Tag enforcement beyond baseline 4
-- Deny policy → resource property mapping correctness
-- RBAC least-privilege analysis
-- Secret management (Key Vault vs hardcoded)
-
-### `architecture-reliability`
-
-- SLA achievability with proposed architecture (single-region vs multi-region)
-- RTO/RPO targets backed by actual backup/replication config
-- Dependency chain failure analysis (single points of failure)
-- Resource dependency ordering correctness (acyclic graph)
-- Scaling strategy adequacy for stated growth projections
-- WAF pillar balance (over-optimization of one at expense of others)
-- Monitoring and alerting coverage
-
-### `cost-feasibility`
-
-- SKU-to-requirement mismatch (over-provisioned or under-provisioned)
-- Hidden costs: egress, transactions, log ingestion, cross-region replication
-- Free-tier production risk (features that stop working at scale)
-- Consumption assumptions realism
-- Budget vs stated requirements alignment
-- Cost optimization opportunities missed
-- Reserved Instance / Savings Plan applicability
-
-### `comprehensive`
-
-- All three lenses above applied broadly
-- Used for single-pass reviews (Steps 1, 6) where rotating lenses are unnecessary
+- **`security-governance`** — Governance gaps, policy mapping, TLS/HTTPS/MI enforcement, RBAC, secrets management
+- **`architecture-reliability`** — SLA achievability, RTO/RPO validation, SPOF analysis, dependency ordering, WAF balance
+- **`cost-feasibility`** — SKU-to-requirement mismatch,
+  hidden costs (egress/transactions/logs), free-tier risk, budget alignment
+- **`comprehensive`** — All three lenses applied broadly (used for single-pass reviews at Steps 1, 6)
 
 ## Analysis Categories
 
-### Core Categories (All Artifact Types)
+**Core** (all artifact types): Untested Assumption · Missing Failure Mode · Hidden Dependency ·
+Scope Risk · Architectural Weakness · Governance Gap · WAF Blind Spot.
 
-- **Untested Assumption**: Something the artifact assumes without verification
-- **Missing Failure Mode**: Scenario where the approach fails but the artifact doesn't address it
-- **Hidden Dependency**: Unstated requirement for success
-- **Scope Risk**: Requirement at the boundary that could expand scope
-- **Architectural Weakness**: Design decision that creates reliability, security, or cost risk
-- **Governance Gap**: Policy or compliance requirement not reflected in the artifact
-- **WAF Blind Spot**: WAF pillar insufficiently addressed
-
-### Additional Categories by Artifact Type
-
-#### `governance-constraints`
-
-- Were ALL Azure Policies discovered (including management group-inherited)?
-- Are `azurePropertyPath` translations correct for each Deny policy?
-- Is the Deny vs Audit effect properly identified and classified?
-- Are tag requirements complete (not just baseline 4)?
-- Are `DeployIfNotExists` and `Modify` policies documented for downstream awareness?
-
-#### `iac-code`
-
-- **Plan-to-code drift**: resources in the implementation plan but missing in code
-- **Security hardening gaps**: governance constraints not reflected in resource properties
-- **AVM module parameter correctness**: do parameter values match the module schema?
-- **Naming convention violations**: CAF patterns not followed
-- **Unique suffix strategy**: is `uniqueString()` / `random_string` generated once and shared?
-- **Tag completeness**: are governance-discovered tags applied to all resources?
-- **Deployment phase correctness**: does conditional logic match the planned phases?
-
-#### `cost-estimate`
-
-- **Consumption assumptions**: are usage projections realistic or optimistic?
-- **Hidden costs**: egress charges, transaction fees, log ingestion volume, IP addresses
-- **SKU-to-requirement mismatch**: over/under-provisioned SKUs for the stated workload
-- **Free-tier production risk**: features or limits that don't scale to production
-- **Missing line items**: services in architecture but absent from cost estimate
-- **Price source verification**: are figures from Azure Pricing MCP or guessed?
-
-#### `deployment-preview`
-
-- **Blast radius**: how many resources change? What's the rollback strategy?
-- **Resource deletion risks**: any unexpected Destroy operations?
-- **Dependency ordering**: will resources deploy in the correct order?
-- **Phase boundary correctness**: are phase gates in the right places?
-- **State drift**: does the plan output match expected infrastructure?
-
-## Azure Infrastructure Skepticism Surfaces
-
-When challenging artifacts in this repository, be skeptical about:
-
-- **Governance**: Does the plan rely on hardcoded tag lists or security settings instead of reading
-  discovered Azure Policy constraints from `04-governance-constraints.json`?
-- **AVM Modules**: Are resources planned with raw Bicep/Terraform when AVM modules exist?
-- **Naming**: Do naming conventions follow CAF patterns from azure-defaults skill, or are they ad-hoc?
-- **Region Availability**: Are all planned SKUs and services actually available in the target region?
-- **WAF Balance**: Does the architecture over-optimize one WAF pillar at the expense of others?
-- **Cost Estimates**: Are prices sourced from Azure Pricing MCP, or are they parametric guesses?
-- **Security Baseline**: Is TLS 1.2 enforced? HTTPS-only? Managed identity over keys? Public access disabled?
-- **Deployment Strategy**: Is a single deployment assumed for >5 resources? (Should be phased.)
-- **Dependency Ordering**: Are resource dependencies acyclic and correct?
-- **Compliance Gaps**: Do stated compliance requirements (PCI-DSS, SOC2, etc.) actually map to
-  concrete controls in the architecture?
+**Additional categories by artifact type** → Read `.github/skills/azure-defaults/references/artifact-type-categories.md`
 
 ## Severity Levels
 
-- **must_fix**: Artifact would likely lead to failed deployment or non-compliant
-  infrastructure — missing critical governance constraint, dangerous assumption,
-  WAF violation
-- **should_fix**: Significant risk that should be mitigated — region availability
-  unchecked, dependency not verified, optimistic cost estimate
-- **suggestion**: Minor concern worth considering — alternative SKU, additional
-  monitoring, future scaling path
-
-## Adversarial Checklist
-
-For **every** artifact, ask:
-
-### Governance & Compliance
-
-- [ ] Does the artifact account for ALL Azure Policy constraints (not just a hardcoded subset)?
-- [ ] Are required tags dynamic (from governance discovery) or hardcoded to the 4-tag baseline?
-- [ ] If Deny policies exist, are they explicitly mapped to resource properties?
-- [ ] Are compliance requirements (SOC2, PCI-DSS, ISO 27001) backed by concrete controls?
-- [ ] Does the plan rely on features that might be blocked by subscription-level policies?
-
-### Architecture & WAF
-
-- [ ] Are all 5 WAF pillars addressed, or are some hand-waved?
-- [ ] Is the SLA target achievable with the proposed architecture (single-region vs multi-region)?
-- [ ] Are RTO/RPO targets backed by actual backup/replication configuration?
-- [ ] Is the cost estimate realistic, or does it assume lowest-tier SKUs for production workloads?
-- [ ] Are managed identities used everywhere, or do some resources still rely on keys/passwords?
-
-### Implementation Feasibility
-
-- [ ] Does every resource have a verified AVM module, or are some assumed?
-- [ ] Are all planned SKUs available in the target region?
-- [ ] Are resource dependencies acyclic and correctly ordered?
-- [ ] Is the deployment strategy appropriate for the resource count?
-- [ ] Are there circular dependencies or implicit ordering assumptions?
-
-### Missing Pieces
-
-- [ ] What happens if the deployment partially fails (rollback strategy)?
-- [ ] Are Private Endpoints planned for all data-plane resources?
-- [ ] Is monitoring/alerting defined, or just "planned for later"?
-- [ ] Are diagnostic settings included for every resource?
-- [ ] What networking assumptions remain unvalidated (VNet sizing, NSG rules, DNS)?
-
-### Requirements-Specific (when `artifact_type` = `requirements`)
-
-- [ ] Are NFRs specific and measurable, or vague ("high availability")?
-- [ ] Is the budget realistic for the stated requirements?
-- [ ] Are there contradictory requirements (e.g., lowest cost + 99.99% SLA)?
-- [ ] Are data residency and sovereignty requirements addressed?
-
-### Governance-Constraints-Specific (when `artifact_type` = `governance-constraints`)
-
-- [ ] Were management group-inherited policies included (not just subscription-level)?
-- [ ] Is the REST API policy count validated against Azure Portal total?
-- [ ] Are `azurePropertyPath` values correct for each Deny policy?
-- [ ] Are Deny vs Audit effects correctly classified?
-- [ ] Are `DeployIfNotExists` auto-remediation resources documented?
-
-### IaC-Code-Specific (when `artifact_type` = `iac-code`)
-
-- [ ] Does every resource in the implementation plan have corresponding code?
-- [ ] Are all Deny policy constraints satisfied in resource configurations?
-- [ ] Are AVM module parameters correct (no type mismatches)?
-- [ ] Is the unique suffix generated once and passed to all modules?
-- [ ] Are all governance-discovered tags applied (not just baseline 4)?
-- [ ] Does phased deployment logic match the planned phases?
-
-### Cost-Estimate-Specific (when `artifact_type` = `cost-estimate`)
-
-- [ ] Are all prices sourced from Azure Pricing MCP (not guessed)?
-- [ ] Are egress, transaction, and log ingestion costs included?
-- [ ] Do SKU selections match the stated workload requirements?
-- [ ] Are free-tier limitations documented for production use?
-- [ ] Does the monthly total match the sum of line items?
-
-### Deployment-Preview-Specific (when `artifact_type` = `deployment-preview`)
-
-- [ ] Are any Destroy operations unexpected?
-- [ ] Is the blast radius acceptable for the deployment scope?
-- [ ] Is there a rollback strategy if deployment fails mid-way?
-- [ ] Are phase boundaries correctly placed for phased deployments?
-- [ ] Are deprecation signals present in the preview output?
+- **must_fix**: Deployment likely fails or non-compliant infrastructure
+- **should_fix**: Significant risk that should be mitigated
+- **suggestion**: Minor concern worth considering
+
+## Adversarial Checklists
+
+Read `.github/skills/azure-defaults/references/adversarial-checklists.md` for the full
+per-category and per-artifact-type checklists, plus Azure Infrastructure Skepticism Surfaces.
+
+## Reference Index
+
+| Reference                                    | Path                                                                      |
+| -------------------------------------------- | ------------------------------------------------------------------------- |
+| Adversarial checklists & skepticism surfaces | `.github/skills/azure-defaults/references/adversarial-checklists.md`      |
+| Artifact-type-specific categories            | `.github/skills/azure-defaults/references/artifact-type-categories.md`    |
+| Adversarial review protocol                  | `.github/skills/azure-defaults/references/adversarial-review-protocol.md` |
+| Golden Principles                            | `.github/skills/golden-principles/SKILL.md`                               |
 
 ## Output Format
 
@@ -275,42 +124,27 @@
 
 ### `compact_for_parent` Format
 
-This single-line field is what **parent agents keep in context** after writing the full JSON to disk.
-
 ```text
 Format:  Pass {N} ({review_focus}) | {RISK_LEVEL} | {N} must_fix, {N} should_fix | Key: title1; title2; title3
-Example: Pass 2 (architecture-reliability) | HIGH | 2 must_fix, 3 should_fix | Key: Single-region SLA gap; Missing RTO; No health probe
 ```
 
-Keep it under 200 characters. Include only the top 3 `must_fix` titles (or fewer if less than 3 exist).
-
-If no significant risks are found, return an empty `issues` array with a `challenge_summary`
-explaining why the artifact is robust, and `risk_level: "low"`.
+Keep under 200 characters. Include only the top 3 `must_fix` titles.
 
-Do NOT repeat issues already in `prior_findings`. Focus your adversarial energy on the
-`review_focus` lens.
+If no significant risks found, return empty `issues` array with `risk_level: "low"`.
+Do NOT repeat issues already in `prior_findings`.
 
 ## Rules
 
 1. **Be adversarial, not obstructive** — find real risks, not style preferences
-2. **Propose specific failure scenarios** — not vague "this might fail" but
-   "if Deny policy X blocks resource Y, deployment fails at step Z"
-3. **Suggest mitigations, not just problems** — every issue must have an
-   actionable mitigation
-4. **Focus on high-impact risks** — ignore purely theoretical issues with no
-   evidence of occurrence
-5. **Challenge assumptions, not decisions** — if the artifact explicitly chose
-   an approach, question the assumptions behind the choice
-6. **Calibrate severity carefully** — must_fix = deployment likely fails or
-   non-compliant; should_fix = significant risk; suggestion = worth considering
-7. **Verify before claiming** — use search tools to confirm assumptions about
-   the project's artifacts and skills before labelling them as risks
-8. **Read prior artifacts** — check what earlier steps produced to avoid
-   challenging something already resolved
-9. **Cross-reference governance** — if `04-governance-constraints.json` exists,
-   verify the artifact respects ALL discovered policies
-10. **Do NOT duplicate prior_findings** — when `prior_findings` is provided,
-    skip issues already identified in previous passes
+2. **Propose specific failure scenarios** — "if Deny policy X blocks resource Y, deployment fails at step Z"
+3. **Suggest mitigations, not just problems** — every issue must have an actionable mitigation
+4. **Focus on high-impact risks** — ignore purely theoretical issues with no evidence
+5. **Challenge assumptions, not decisions** — question the assumptions behind explicit choices
+6. **Calibrate severity carefully** — must_fix = likely fails; should_fix = significant risk; suggestion = worth considering
+7. **Verify before claiming** — use search tools to confirm assumptions before labelling as risks
+8. **Read prior artifacts** — avoid challenging something already resolved
+9. **Cross-reference governance** — verify artifact respects ALL discovered policies in `04-governance-constraints.json`
+10. **Do NOT duplicate prior_findings** — skip issues already identified in previous passes
 
 ## You Are NOT Responsible For
 
```

#### Modified: `.github/agents/_subagents/terraform-review-subagent.agent.md` (+41/-100)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/agents/_subagents/terraform-review-subagent.agent.md	2026-03-04 06:46:56.603467052 +0000
+++ /workspaces/azure-agentic-infraops/.github/agents/_subagents/terraform-review-subagent.agent.md	2026-03-04 14:49:25.476492975 +0000
@@ -16,19 +16,20 @@
 
 **Your scope**: Review uncommitted or specified Terraform code for quality, security, and standards
 
+## Mandatory Skill Reads
+
+Before starting any review, read these skills for domain knowledge:
+
+1. Read `.github/skills/azure-defaults/SKILL.md` — AVM versions, CAF naming, required tags, security baseline, region defaults
+2. Read `.github/skills/iac-common/SKILL.md` — governance compliance checks, unique suffix patterns, shared IaC review procedures
+
 ## Core Workflow
 
 1. **Receive module path** from parent agent
 2. **Read all `.tf` files** in the specified directory
-3. **Review against checklist**:
-   - AVM-TF module usage
-   - CAF naming conventions
-   - Required tags
-   - Security baseline
-   - Unique name strategy
-   - Code quality
-   - Governance compliance
-4. **Return structured verdict** to parent
+3. **Read mandatory skills** (above) for current standards
+4. **Review against checklist** (below)
+5. **Return structured verdict** to parent
 
 ## Output Format
 
@@ -60,68 +61,32 @@
 Recommendation: {specific next action}
 ```
 
-## Review Checklist
+## Review Areas
 
-### 1. Azure Verified Modules — AVM-TF
+### 1. AVM-TF Module Usage (HIGH)
 
-| Check                     | Severity | Details                                                      |
-| ------------------------- | -------- | ------------------------------------------------------------ |
-| Uses AVM-TF modules       | HIGH     | All resources use `Azure/avm-res-*/azurerm` registry modules |
-| AVM version pinned        | MEDIUM   | Version constraint present (e.g. `version = "~> 0.1"`)       |
-| Parameters match AVM spec | HIGH     | Required inputs are provided, no unknown attributes          |
-
-**AVM-TF Registry Pattern**: `registry.terraform.io/Azure/avm-res-{rp}-{resource}/azurerm`
-
-Examples:
-
-- Key Vault: `Azure/avm-res-keyvault-vault/azurerm`
-- Virtual Network: `Azure/avm-res-network-virtualnetwork/azurerm`
-- Storage Account: `Azure/avm-res-storage-storageaccount/azurerm`
-- App Service: `Azure/avm-res-web-site/azurerm`
-
-### 2. CAF Naming Conventions
-
-| Check           | Pattern                                          | Example                  |
-| --------------- | ------------------------------------------------ | ------------------------ |
-| Resource groups | `rg-{workload}-{env}-{region}`                   | `rg-ecommerce-prod-swc`  |
-| Key Vault       | `kv-{short}-{env}-{suffix}` (≤24 chars)          | `kv-app-dev-a1b2c3`      |
-| Storage Account | `st{short}{env}{suffix}` (≤24 chars, no hyphens) | `stappdevswca1b2c3`      |
-| Virtual Network | `vnet-{workload}-{env}-{region}`                 | `vnet-hub-prod-swc`      |
-| `random_string` | Used for unique suffix, keepers set              | `resource.suffix.result` |
-
-### 3. Required Tags
-
-Every resource MUST have these tags:
-
-```hcl
-tags = {
-  Environment = var.environment       # dev, staging, prod
-  ManagedBy   = "Terraform"
-  Project     = var.project_name
-  Owner       = var.owner
-}
-```
+Verify all resources use `Azure/avm-res-*/azurerm` registry modules
+with pinned versions.
+Refer to **azure-defaults** skill for registry patterns and reference versions.
+
+### 2. CAF Naming & Required Tags (HIGH)
+
+Validate resource names follow CAF patterns and all resources carry required tags
+(including `ManagedBy = "Terraform"`).
+Refer to **azure-defaults** skill for patterns and tag requirements.
+
+### 3. Security Baseline (CRITICAL)
 
-### 4. Security Baseline
+Verify TLS 1.2+, HTTPS-only, no public blob access, Azure AD-only SQL auth,
+managed identities, no inline secrets.
+Refer to **azure-defaults** skill for the full security baseline.
 
-| Check                      | Required Value                                      | Severity |
-| -------------------------- | --------------------------------------------------- | -------- |
-| Storage HTTPS-only         | `https_traffic_only_enabled = true`                 | CRITICAL |
-| Minimum TLS version        | `min_tls_version = "TLS1_2"`                        | CRITICAL |
-| Storage no public blob     | `blob_properties { public_access_enabled = false }` | CRITICAL |
-| SQL Azure AD-only auth     | `azuread_authentication_only = true`                | HIGH     |
-| Managed identity preferred | `identity { type = "SystemAssigned" }`              | HIGH     |
-| No inline secrets          | Use Key Vault references, not plaintext             | CRITICAL |
-
-### 5. Unique Resource Names
-
-| Check                 | Details                                                        |
-| --------------------- | -------------------------------------------------------------- |
-| `random_string` usage | Declared once, `keepers` map set to prevent unexpected changes |
-| Suffix integration    | `"${var.prefix}-${random_string.suffix.result}"`               |
-| Length constraints    | Key Vault ≤24, Storage ≤24 chars (no hyphens)                  |
+### 4. Unique Suffix Pattern
 
-### 6. Code Quality
+Verify `random_string` resource is declared once with `keepers` map and integrated into names.
+Refer to **iac-common** skill for the pattern.
+
+### 5. Code Quality
 
 | Check                      | Severity | Details                                                          |
 | -------------------------- | -------- | ---------------------------------------------------------------- |
@@ -129,56 +94,35 @@
 | Module organization        | LOW      | Logical split across files (main, variables, outputs, providers) |
 | No hardcoded values        | HIGH     | Use variables for all configurable values                        |
 | Outputs defined            | MEDIUM   | Expose resource IDs and endpoints as `output`                    |
-| `terraform fmt` clean      | LOW      | No format drift (validated by lint subagent)                     |
+| `terraform fmt` clean      | LOW      | No format drift                                                  |
 
 ### 7. Governance Compliance
 
-> [!IMPORTANT]
-> This section requires the governance constraints file path from the parent Code Generator agent.
-> If the path is not provided, request it before proceeding. Read `04-governance-constraints.json`
-> from `agent-output/{project}/` and translate `azurePropertyPath` entries to Terraform attributes.
-
-| Check                           | Severity | Details                                                                     |
-| ------------------------------- | -------- | --------------------------------------------------------------------------- |
-| Tag count matches governance    | HIGH     | Tags MUST include all governance-mandated tags, not just the 4 defaults     |
-| Deny policies satisfied         | CRITICAL | Every `Deny` effect policy is addressed via `azurePropertyPath` translation |
-| `public_network_access_enabled` | HIGH     | Verify value matches network policies from governance constraints           |
-| `network_rules` configured      | HIGH     | Verify network rules match governance network policy requirements           |
-| SKU restrictions respected      | HIGH     | Verify `sku_name` / `sku_tier` comply with SKU restriction policies         |
-| Security settings compliant     | CRITICAL | Verify TLS, HTTPS, auth settings match security policy requirements         |
-
-**`azurePropertyPath` → Terraform Attribute Translation Examples**:
-
-- `properties.minimumTlsVersion` → `min_tls_version`
-- `properties.supportsHttpsTrafficOnly` → `https_traffic_only_enabled`
-- `properties.publicNetworkAccess` → `public_network_access_enabled`
+Read `04-governance-constraints.json` from `agent-output/{project}/` and translate
+`azurePropertyPath` entries to Terraform attributes.
+Follow the governance review procedure in **iac-common** skill.
+
+- Tag count matches governance constraints (4 baseline + discovered)
+- All Deny policy constraints satisfied
+- publicNetworkAccess disabled for production data services
+- SKU restriction policies respected
 
-**Governance compliance failures produce `NEEDS_REVISION` (HIGH) or `FAILED` (CRITICAL) verdicts.**
 A configuration CANNOT pass review with unresolved policy violations.
 
 ### 8. RBAC Least Privilege (MANDATORY)
 
 Review all `azurerm_role_assignment` resources and classify role/scope risk.
 
-| Check                                         | Severity | Details                                                        |
-| --------------------------------------------- | -------- | -------------------------------------------------------------- |
-| App identity gets `Owner`                     | CRITICAL | FAIL unless explicit approval marker exists                    |
-| App identity gets `Contributor`               | CRITICAL | FAIL unless explicit approval marker exists                    |
-| App identity gets `User Access Administrator` | CRITICAL | FAIL unless explicit approval marker exists                    |
-| Scope is broader than required                | HIGH     | Server/subscription scope when resource/db scope is sufficient |
-
-**App identity** means managed identities and service principals used by apps:
-
-- App Service / Function / Container App system-assigned identity
-- User-assigned managed identity attached to application workloads
-- Service principal used by runtime application code
-
-**Explicit approval marker (required for exception):**
-
-- A nearby comment on the role assignment: `RBAC_EXCEPTION_APPROVED: <ticket-or-ADR>`
-- And a matching record in implementation docs (ADR or implementation reference)
-
-If the marker is missing, classify as CRITICAL and return `FAILED`.
+| Check                                         | Severity | Details                                              |
+| --------------------------------------------- | -------- | ---------------------------------------------------- |
+| App identity gets `Owner`                     | CRITICAL | FAIL unless explicit approval marker exists          |
+| App identity gets `Contributor`               | CRITICAL | FAIL unless explicit approval marker exists          |
+| App identity gets `User Access Administrator` | CRITICAL | FAIL unless explicit approval marker exists          |
+| Scope is broader than required                | HIGH     | Subscription scope when resource scope is sufficient |
+
+**Explicit approval marker**: A nearby comment `RBAC_EXCEPTION_APPROVED: <ticket-or-ADR>`
+plus a matching record in implementation docs.
+If missing, classify as CRITICAL → `FAILED`.
 
 ## Severity Levels
 
@@ -197,37 +141,6 @@
 | High issues only        | NEEDS_REVISION | Return to Terraform Code agent for fixes |
 | Any critical issues     | FAILED         | Stop — human intervention required       |
 
-## Example Review
-
-```text
-TERRAFORM CODE REVIEW
-─────────────────────
-Status: NEEDS_REVISION
-Module: infra/terraform/webapp-sql
-Files Reviewed: 5
-
-Summary:
-Configuration uses AVM-TF modules correctly but is missing required tags on 2 resources
-and has a security finding for SQL Azure AD-only auth.
-
-✅ Passed Checks:
-  - Uses AVM-TF modules (keyvault-vault, storage-storageaccount)
-  - CAF naming conventions followed
-  - random_string suffix declared with keepers
-  - TLS 1.2 enforced on all resources
-
-❌ Failed Checks:
-  - [HIGH] modules/database.tf:45 — azuread_authentication_only not set to true
-  - [HIGH] modules/storage.tf:12 — Missing required 'Owner' tag
-
-⚠️ Warnings:
-  - [MEDIUM] variables.tf:23 — variable "environment" missing description
-  - [LOW] main.tf — SQL module could be replaced with AVM-TF module
-
-Verdict: NEEDS_REVISION
-Recommendation: Fix HIGH findings and rerun lint + review subagents
-```
-
 ## Constraints
 
 - **READ-ONLY**: Do not modify any files
```

#### Added: `.github/agents/01-conductor-fastpath.agent.md` (+128 lines)

### Instructions

#### Modified: `.github/instructions/azure-artifacts.instructions.md` (+20/-199)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/azure-artifacts.instructions.md	2026-03-04 06:46:56.612054059 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/azure-artifacts.instructions.md	2026-03-04 06:47:05.104320879 +0000
@@ -5,223 +5,27 @@
 
 # Artifact Generation Rules - MANDATORY
 
-> **CRITICAL**: This file is the ENFORCEMENT TRIGGER for artifact H2 headings.
-> All agents MUST use these EXACT headings when generating artifacts.
-> Violations block commits (pre-commit) and PRs (CI validation).
+> **CRITICAL**: ENFORCEMENT TRIGGER for artifact H2 headings.
+> Agents MUST use exact headings. Violations block commits and PRs.
 
 > [!NOTE]
-> This instruction file and the `azure-artifacts` skill (`SKILL.md`) intentionally
-> contain the same H2 heading lists. The `SKILL.md` is the authoritative source;
-> this instruction file is the enforcement trigger via `applyTo` scope.
-> For template mapping, generation workflow, styling, and standard components,
-> read the SKILL.md directly.
+> This file enforces artifact H2 headings via `applyTo` scope.
+> `azure-artifacts/SKILL.md` is authoritative — read it for templates, workflow, styling.
 
 ## Complete H2 Heading Reference
 
-> **IMPORTANT**: Copy-paste these headings. Do not paraphrase or abbreviate.
+> **IMPORTANT**: Copy-paste headings from the template files. Do not paraphrase.
 
-### 01-requirements.md
+Canonical H2 heading lists for all 15 artifact types live in the template files:
 
-```text
-## 🎯 Project Overview
-## 🚀 Functional Requirements
-## ⚡ Non-Functional Requirements (NFRs)
-## 🔒 Compliance & Security Requirements
-## 💰 Budget
-## 🔧 Operational Requirements
-## 🌍 Regional Preferences
-## 📋 Summary for Architecture Assessment
-## References <!-- Optional, add at end -->
-```
-
-### 02-architecture-assessment.md
-
-```text
-## ✅ Requirements Validation
-## 💎 Executive Summary
-## 🏛️ WAF Pillar Assessment
-## 📦 Resource SKU Recommendations
-## 🎯 Architecture Decision Summary
-## 🚀 Implementation Handoff
-## 🔒 Approval Gate
-## References <!-- Optional, add at end -->
-```
-
-### 03-des-cost-estimate.md
-
-```text
-## 💵 Cost At-a-Glance
-## ✅ Decision Summary
-## 🔁 Requirements → Cost Mapping
-## 📊 Top 5 Cost Drivers
-## 🏛️ Architecture Overview
-## 🧾 What We Are Not Paying For (Yet)
-## ⚠️ Cost Risk Indicators
-## 🎯 Quick Decision Matrix
-## 💰 Savings Opportunities
-## 🧾 Detailed Cost Breakdown
-## References <!-- Required -->
-```
-
-### 04-implementation-plan.md
-
-```text
-## 📋 Overview
-## 📦 Resource Inventory
-## 🗂️ Module Structure
-## 🔨 Implementation Tasks
-## 🚀 Deployment Phases
-## 🔗 Dependency Graph
-## 🔄 Runtime Flow Diagram
-## 🏷️ Naming Conventions
-## 🔐 Security Configuration
-## ⏱️ Estimated Implementation Time
-## 🔒 Approval Gate
-## References <!-- Optional, add at end -->
-```
-
-### 04-governance-constraints.md
-
-```text
-## 🔍 Discovery Source
-## 📋 Azure Policy Compliance
-## 🔄 Plan Adaptations Based on Policies
-## 🚫 Deployment Blockers
-## 🏷️ Required Tags
-## 🔐 Security Policies
-## 💰 Cost Policies
-## 🌐 Network Policies
-## References <!-- Optional, add at end -->
-```
-
-### 04-preflight-check.md
-
-```text
-## 🎯 Purpose
-## ✅ AVM Schema Validation Results
-## 🔎 Parameter Type Analysis
-## 🌍 Region Limitations Identified
-## ⚠️ Pitfalls Checklist
-## 🚀 Ready for Implementation
-## References <!-- Optional, add at end -->
-```
-
-### 05-implementation-reference.md
-
-```text
-## 📁 IaC Templates Location
-## 🗂️ File Structure
-## ✅ Validation Status
-## 🏗️ Resources Created
-## 🚀 Deployment Instructions
-## 📝 Key Implementation Notes
-## References <!-- Optional, add at end -->
-```
-
-### 06-deployment-summary.md
-
-```text
-## ✅ Preflight Validation
-## 📋 Deployment Details
-## 🏗️ Deployed Resources
-## 📤 Outputs (Expected)
-## 🚀 To Actually Deploy
-## 📝 Post-Deployment Tasks
-## References <!-- Optional, add at end -->
-```
-
-### 07-documentation-index.md
-
-```text
-## 📦 1. Document Package Contents
-## 📚 2. Source Artifacts
-## 📋 3. Project Summary
-## 🔗 4. Related Resources
-## ⚡ 5. Quick Links
-## References <!-- Optional, add at end -->
-```
-
-### 07-design-document.md
-
-```text
-## 📝 1. Introduction
-## 🏛️ 2. Azure Architecture Overview
-## 🌐 3. Networking
-## 💾 4. Storage
-## 💻 5. Compute
-## 👤 6. Identity & Access
-## 🔐 7. Security & Compliance
-## 🔄 8. Backup & Disaster Recovery
-## 📊 9. Management & Monitoring
-## 📎 10. Appendix
-## References <!-- Optional, add at end -->
-```
-
-### 07-operations-runbook.md
-
-```text
-## ⚡ Quick Reference
-## 📋 1. Daily Operations
-## 🚨 2. Incident Response
-## 🔧 3. Common Procedures
-## 🕐 4. Maintenance Windows
-## 📞 5. Contacts & Escalation
-## 📝 6. Change Log
-## References <!-- Optional, add at end -->
-```
-
-### 07-resource-inventory.md
-
-```text
-## 📊 Summary
-## 📦 Resource Listing
-## References <!-- Optional, add at end -->
-```
-
-### 07-backup-dr-plan.md
-
-```text
-## 📋 Executive Summary
-## 🎯 1. Recovery Objectives
-## 💾 2. Backup Strategy
-## 🌍 3. Disaster Recovery Procedures
-## 🧪 4. Testing Schedule
-## 📢 5. Communication Plan
-## 👥 6. Roles and Responsibilities
-## 🔗 7. Dependencies
-## 📖 8. Recovery Runbooks
-## 📎 9. Appendix
-## References <!-- Optional, add at end -->
-```
-
-### 07-compliance-matrix.md
-
-```text
-## 📋 Executive Summary
-## 🗺️ 1. Control Mapping
-## 🔍 2. Gap Analysis
-## 📁 3. Evidence Collection
-## 📝 4. Audit Trail
-## 🔧 5. Remediation Tracker
-## 📎 6. Appendix
-## References <!-- Optional, add at end -->
-```
-
-### 07-ab-cost-estimate.md
-
-```text
-## 💵 Cost At-a-Glance
-## ✅ Decision Summary
-## 🔁 Requirements → Cost Mapping
-## 📊 Top 5 Cost Drivers
-## 🏛️ Architecture Overview
-## 🧾 What We Are Not Paying For (Yet)
-## ⚠️ Cost Risk Indicators
-## 🎯 Quick Decision Matrix
-## 💰 Savings Opportunities
-## 🧾 Detailed Cost Breakdown
-## References <!-- Required -->
-```
+| Artifacts                            | Template Reference                       |
+| ------------------------------------ | ---------------------------------------- |
+| 01-requirements                      | `references/01-requirements-template.md` |
+| 02-architecture, 03-cost-estimate    | `references/02-architecture-template.md` |
+| 04-plan, 04-governance, 04-preflight | `references/04-plan-template.md`         |
+| 05-implementation-reference          | `references/05-code-template.md`         |
+| 06-deployment-summary                | `references/06-deploy-template.md`       |
+| 07-\* (all Step 7 docs)              | `references/07-docs-template.md`         |
 
 ## Enforcement Layers
 
@@ -235,34 +39,16 @@
 ## Quick Fix Command
 
 ```bash
-# Analyze what's wrong
-npm run fix:artifact-h2 agent-output/{project}/{file}.md
-
-# Auto-fix where possible
-npm run fix:artifact-h2 agent-output/{project}/{file}.md --apply
+npm run fix:artifact-h2 agent-output/{project}/{file}.md          # analyze
+npm run fix:artifact-h2 agent-output/{project}/{file}.md --apply  # auto-fix
 ```
 
 ## Common Errors and Fixes
 
-If you see:
-
-```text
-missing required H2 headings: ## Outputs (Expected)
-```
-
-**Fix**: You used `## Outputs` instead of `## Outputs (Expected)`. Use the EXACT text.
-
-If you see:
-
-```text
-contains extra H2 headings: ## Cost Summary
-```
-
-**Fix**: `## Cost Summary` is not in the template. Either:
-
-1. Remove it
-2. Change to H3: `### Cost Summary` (under a valid H2)
-3. Move after `## References` as optional section
+- `missing required H2 headings: ## Outputs (Expected)`
+  **Fix**: Use EXACT heading text. `## Outputs` ≠ `## Outputs (Expected)`.
+- `contains extra H2 headings: ## Cost Summary`
+  **Fix**: Remove, change to H3, or move after `## References`.
 
 ## Quick Reference Card
 
```

#### Modified: `.github/instructions/bicep-policy-compliance.instructions.md` (+1/-1)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/bicep-policy-compliance.instructions.md	2026-03-04 06:46:56.612054059 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/bicep-policy-compliance.instructions.md	2026-03-04 06:47:05.104320879 +0000
@@ -1,6 +1,6 @@
 ---
 description: "MANDATORY Azure Policy compliance rules for Bicep code generation and agent definitions"
-applyTo: "**/*.bicep, **/*.agent.md"
+applyTo: "**/*.bicep"
 ---
 
 # Bicep Policy Compliance Instructions
```

#### Modified: `.github/instructions/code-commenting.instructions.md` (+22/-17)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/code-commenting.instructions.md	2026-03-04 06:46:56.616347562 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/code-commenting.instructions.md	2026-03-04 06:47:05.104320879 +0000
@@ -1,6 +1,6 @@
 ---
-description: 'Guidelines for GitHub Copilot to write comments to achieve self-explanatory code with less comments. Examples are in JavaScript but it should work on any language that has comments.'
-applyTo: '**'
+description: "Guidelines for GitHub Copilot to write comments to achieve self-explanatory code with less comments. Examples are in JavaScript but it should work on any language that has comments."
+applyTo: "**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"
 ---
 
 # Self-explanatory Code Commenting Instructions
@@ -23,6 +23,7 @@
 follows the minimal-comment philosophy below.
 
 ## Core Principle
+
 **Write code that speaks for itself. Comment only when necessary to explain WHY, not WHAT.**
 We do not need comments most of the time.
 
@@ -31,51 +32,57 @@
 ### ❌ AVOID These Comment Types
 
 **Obvious Comments**
+
 ```javascript
 // Bad: States the obvious
-let counter = 0;  // Initialize counter to zero
-counter++;  // Increment counter by one
+let counter = 0; // Initialize counter to zero
+counter++; // Increment counter by one
 ```
 
 **Redundant Comments**
+
 ```javascript
 // Bad: Comment repeats the code
 function getUserName() {
-    return user.name;  // Return the user's name
+  return user.name; // Return the user's name
 }
 ```
 
 **Outdated Comments**
+
 ```javascript
 // Bad: Comment doesn't match the code
 // Calculate tax at 5% rate
-const tax = price * 0.08;  // Actually 8%
+const tax = price * 0.08; // Actually 8%
 ```
 
 ### ✅ WRITE These Comment Types
 
 **Complex Business Logic**
+
 ```javascript
 // Good: Explains WHY this specific calculation
 // Apply progressive tax brackets: 10% up to 10k, 20% above
-const tax = calculateProgressiveTax(income, [0.10, 0.20], [10000]);
+const tax = calculateProgressiveTax(income, [0.1, 0.2], [10000]);
 ```
 
 **Non-obvious Algorithms**
+
 ```javascript
 // Good: Explains the algorithm choice
 // Using Floyd-Warshall for all-pairs shortest paths
 // because we need distances between all nodes
 for (let k = 0; k < vertices; k++) {
-    for (let i = 0; i < vertices; i++) {
-        for (let j = 0; j < vertices; j++) {
-            // ... implementation
-        }
+  for (let i = 0; i < vertices; i++) {
+    for (let j = 0; j < vertices; j++) {
+      // ... implementation
     }
+  }
 }
 ```
 
 **Regex Patterns**
+
 ```javascript
 // Good: Explains what the regex matches
 // Match email format: username@domain.extension
@@ -83,6 +90,7 @@
 ```
 
 **API Constraints or Gotchas**
+
 ```javascript
 // Good: Explains external constraint
 // GitHub API rate limit: 5000 requests/hour for authenticated users
@@ -93,6 +101,7 @@
 ## Decision Framework
 
 Before writing a comment, ask:
+
 1. **Is the code self-explanatory?** → No comment needed
 2. **Would a better variable/function name eliminate the need?** → Refactor instead
 3. **Does this explain WHY, not WHAT?** → Good comment
@@ -101,29 +110,37 @@
 ## Special Cases for Comments
 
 ### Public APIs
+
 ```javascript
 /**
  * Calculate compound interest using the standard formula.
- * 
+ *
  * @param {number} principal - Initial amount invested
  * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
  * @param {number} time - Time period in years
  * @param {number} compoundFrequency - How many times per year interest compounds (default: 1)
  * @returns {number} Final amount after compound interest
  */
-function calculateCompoundInterest(principal, rate, time, compoundFrequency = 1) {
-    // ... implementation
+function calculateCompoundInterest(
+  principal,
+  rate,
+  time,
+  compoundFrequency = 1,
+) {
+  // ... implementation
 }
 ```
 
 ### Configuration and Constants
+
 ```javascript
 // Good: Explains the source or reasoning
-const MAX_RETRIES = 3;  // Based on network reliability studies
-const API_TIMEOUT = 5000;  // AWS Lambda timeout is 15s, leaving buffer
+const MAX_RETRIES = 3; // Based on network reliability studies
+const API_TIMEOUT = 5000; // AWS Lambda timeout is 15s, leaving buffer
 ```
 
 ### Annotations
+
 ```javascript
 // TODO: Replace with proper user authentication after security review
 // FIXME: Memory leak in production - investigate connection pooling
@@ -140,6 +157,7 @@
 ## Anti-Patterns to Avoid
 
 ### Dead Code Comments
+
 ```javascript
 // Bad: Don't comment out code
 // const oldFunction = () => { ... };
@@ -147,16 +165,18 @@
 ```
 
 ### Changelog Comments
+
 ```javascript
 // Bad: Don't maintain history in comments
 // Modified by John on 2023-01-15
 // Fixed bug reported by Sarah on 2023-02-03
 function processData() {
-    // ... implementation
+  // ... implementation
 }
 ```
 
 ### Divider Comments
+
 ```javascript
 // Bad: Don't use decorative comments
 //=====================================
@@ -167,6 +187,7 @@
 ## Quality Checklist
 
 Before committing, ensure your comments:
+
 - [ ] Explain WHY, not WHAT
 - [ ] Are grammatically correct and clear
 - [ ] Will remain accurate as code evolves
```

#### Modified: `.github/instructions/code-review.instructions.md` (+22/-119)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/code-review.instructions.md	2026-03-04 06:46:56.616347562 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/code-review.instructions.md	2026-03-04 06:47:05.104320879 +0000
@@ -5,24 +5,10 @@
 
 # Code Review Instructions
 
-Structured code review guidelines for this repository. These complement
-the language-specific instructions already in place:
+Complements language-specific instructions:
 
-- **Bicep**: `bicep-code-best-practices.instructions.md` (AVM-first,
-  TLS 1.2, managed identity, naming limits)
-- **PowerShell**: `powershell.instructions.md` (comment-based help,
-  parameter validation, `$ErrorActionPreference = 'Stop'`)
-- **Shell**: `shell.instructions.md` (`set -euo pipefail`, `trap`,
-  `jq`/`yq` for structured data)
-- **JavaScript**: `javascript.instructions.md` (ES modules, `node:`
-  protocol imports, validation script patterns)
-- **Python**: `python.instructions.md` (Ruff linting, `uv` packages,
-  diagrams library, async MCP patterns)
-- **Markdown**: `markdown.instructions.md` (120-char lines, ATX headings)
-
-When reviewing code, apply these general guidelines **in addition to**
-the language-specific rules. Language-specific instructions take
-precedence on any conflicting point.
+See `{lang}.instructions.md` for Bicep, PowerShell, Shell, JavaScript, Python, Markdown.
+Language-specific rules take precedence on any conflicting point.
 
 ## Review Language
 
@@ -30,111 +16,21 @@
 
 ## Review Priorities
 
-When performing a code review, prioritize issues in the following order:
+Prioritize in this order:
 
-### 🔴 CRITICAL (Block merge)
+**🔴 CRITICAL** (Block merge): Security vulns, logic errors, breaking changes, data loss
 
-- **Security**: Vulnerabilities, exposed secrets, authentication/authorization issues
-- **Correctness**: Logic errors, data corruption risks, race conditions
-- **Breaking Changes**: API contract changes without versioning
-- **Data Loss**: Risk of data loss or corruption
+**🟡 IMPORTANT** (Discuss): SOLID violations, missing tests, perf bottlenecks, architecture drift
 
-### 🟡 IMPORTANT (Requires discussion)
-
-- **Code Quality**: Severe violations of SOLID principles, excessive duplication
-- **Test Coverage**: Missing tests for critical paths or new functionality
-- **Performance**: Obvious performance bottlenecks (N+1 queries, memory leaks)
-- **Architecture**: Significant deviations from established patterns
-
-### 🟢 SUGGESTION (Non-blocking improvements)
-
-- **Readability**: Poor naming, complex logic that could be simplified
-- **Optimization**: Performance improvements without functional impact
-- **Best Practices**: Minor deviations from conventions
-- **Documentation**: Missing or incomplete comments/documentation
+**🟢 SUGGESTION** (Non-blocking): Readability, optimization, best practices, documentation
 
 ## General Review Principles
 
-When performing a code review, follow these principles:
-
-1. **Be specific**: Reference exact lines, files, and provide concrete examples
-2. **Provide context**: Explain WHY something is an issue and the potential impact
-3. **Suggest solutions**: Show corrected code when applicable, not just what's wrong
-4. **Be constructive**: Focus on improving the code, not criticizing the author
-5. **Recognize good practices**: Acknowledge well-written code and smart solutions
-6. **Be pragmatic**: Not every suggestion needs immediate implementation
-7. **Group related comments**: Avoid multiple comments about the same topic
-
-## Code Quality Standards
-
-When performing a code review, check for:
-
-### Clean Code
-
-- Descriptive and meaningful names for variables, functions, and classes
-- Single Responsibility Principle: each function/class does one thing well
-- DRY (Don't Repeat Yourself): no code duplication
-- Functions should be small and focused (ideally < 20-30 lines)
-- Avoid deeply nested code (max 3-4 levels)
-- Avoid magic numbers and strings (use constants)
-- Code should be self-documenting; comments only when necessary
-
-### Examples
-
-```javascript
-// ❌ BAD: Poor naming and magic numbers
-function calc(x, y) {
-  if (x > 100) return y * 0.15;
-  return y * 0.1;
-}
-
-// ✅ GOOD: Clear naming and constants
-const PREMIUM_THRESHOLD = 100;
-const PREMIUM_DISCOUNT_RATE = 0.15;
-const STANDARD_DISCOUNT_RATE = 0.1;
-
-function calculateDiscount(orderTotal, itemPrice) {
-  const isPremiumOrder = orderTotal > PREMIUM_THRESHOLD;
-  const discountRate = isPremiumOrder
-    ? PREMIUM_DISCOUNT_RATE
-    : STANDARD_DISCOUNT_RATE;
-  return itemPrice * discountRate;
-}
-```
-
-### Error Handling
-
-- Proper error handling at appropriate levels
-- Meaningful error messages
-- No silent failures or ignored exceptions
-- Fail fast: validate inputs early
-- Use appropriate error types/exceptions
-
-### Examples
-
-```python
-# ❌ BAD: Silent failure and generic error
-def process_user(user_id):
-    try:
-        user = db.get(user_id)
-        user.process()
-    except:
-        pass
-
-# ✅ GOOD: Explicit error handling
-def process_user(user_id):
-    if not user_id or user_id <= 0:
-        raise ValueError(f"Invalid user_id: {user_id}")
-
-    try:
-        user = db.get(user_id)
-    except UserNotFoundError:
-        raise UserNotFoundError(f"User {user_id} not found in database")
-    except DatabaseError as e:
-        raise ProcessingError(f"Failed to retrieve user {user_id}: {e}")
-
-    return user.process()
-```
+1. Be specific — reference exact lines with concrete examples
+2. Explain WHY + potential impact
+3. Suggest solutions, not just problems
+4. Be constructive and pragmatic
+5. Group related comments; recognize good practices
 
 ## Security Review
 
@@ -148,166 +44,24 @@
 - **Cryptography**: Use established libraries, never roll your own crypto
 - **Dependency Security**: Check for known vulnerabilities in dependencies
 
-### Examples
-
-```javascript
-// BAD: Exposed secret in code
-const API_KEY = "sk_live_abc123xyz789";
-
-// GOOD: Use environment variables
-const API_KEY = process.env.API_KEY;
-```
-
-## Testing Standards
-
-When performing a code review, verify test quality:
-
-- **Coverage**: Critical paths and new functionality must have tests
-- **Test Names**: Descriptive names that explain what is being tested
-- **Test Structure**: Clear Arrange-Act-Assert or Given-When-Then pattern
-- **Independence**: Tests should not depend on each other or external state
-- **Assertions**: Use specific assertions, avoid generic assertTrue/assertFalse
-- **Edge Cases**: Test boundary conditions, null values, empty collections
-- **Mock Appropriately**: Mock external dependencies, not domain logic
-
-### Examples
-
-```javascript
-// GOOD: Descriptive name and specific assertion
-test("should calculate 10% discount for orders under $100", () => {
-  const orderTotal = 50;
-  const itemPrice = 20;
-
-  const discount = calculateDiscount(orderTotal, itemPrice);
-
-  expect(discount).toBe(2.0);
-});
-```
-
-## Performance Considerations
-
-When performing a code review, check for performance issues:
-
-- **Database Queries**: Avoid N+1 queries, use proper indexing
-- **Algorithms**: Appropriate time/space complexity for the use case
-- **Caching**: Utilize caching for expensive or repeated operations
-- **Resource Management**: Proper cleanup of connections, files, streams
-- **Pagination**: Large result sets should be paginated
-- **Lazy Loading**: Load data only when needed
-
-### Examples
-
-```python
-# ❌ BAD: N+1 query problem
-users = User.query.all()
-for user in users:
-    orders = Order.query.filter_by(user_id=user.id).all()  # N+1!
-
-# ✅ GOOD: Use JOIN or eager loading
-users = User.query.options(joinedload(User.orders)).all()
-for user in users:
-    orders = user.orders
-```
-
-## Architecture and Design
-
-When performing a code review, verify architectural principles:
-
-- **Separation of Concerns**: Clear boundaries between layers/modules
-- **Dependency Direction**: High-level modules don't depend on low-level details
-- **Interface Segregation**: Prefer small, focused interfaces
-- **Loose Coupling**: Components should be independently testable
-- **High Cohesion**: Related functionality grouped together
-- **Consistent Patterns**: Follow established patterns in the codebase
-
-## Documentation Standards
-
-When performing a code review, check documentation:
-
-- **API Documentation**: Public APIs must be documented (purpose, parameters, returns)
-- **Complex Logic**: Non-obvious logic should have explanatory comments
-- **README Updates**: Update README when adding features or changing setup
-- **Breaking Changes**: Document any breaking changes clearly
-- **Examples**: Provide usage examples for complex features
-
 ## Comment Format Template
 
-When performing a code review, use this format for comments:
-
 ```markdown
 **[PRIORITY] Category: Brief title**
 
-Detailed description of the issue or suggestion.
-
-**Why this matters:**
-Explanation of the impact or reason for the suggestion.
-
-**Suggested fix:**
-[code example if applicable]
-
-**Reference:** [link to relevant documentation or standard]
+Description. **Why this matters**: impact explanation.
+**Suggested fix**: code example if applicable.
+**Reference**: [link to relevant documentation]
 ```
 
-## Review Checklist
-
-When performing a code review, systematically verify:
-
-### Code Quality
-
-- [ ] Code follows consistent style and conventions
-- [ ] Names are descriptive and follow naming conventions
-- [ ] Functions/methods are small and focused
-- [ ] No code duplication
-- [ ] Complex logic is broken into simpler parts
-- [ ] Error handling is appropriate
-- [ ] No commented-out code or TODO without tickets
-
-### Security
-
-- [ ] No sensitive data in code or logs
-- [ ] Input validation on all user inputs
-- [ ] No SQL injection vulnerabilities
-- [ ] Authentication and authorization properly implemented
-- [ ] Dependencies are up-to-date and secure
-
-### Testing
-
-- [ ] New code has appropriate test coverage
-- [ ] Tests are well-named and focused
-- [ ] Tests cover edge cases and error scenarios
-- [ ] Tests are independent and deterministic
-- [ ] No tests that always pass or are commented out
-
-### Performance
-
-- [ ] No obvious performance issues (N+1, memory leaks)
-- [ ] Appropriate use of caching
-- [ ] Efficient algorithms and data structures
-- [ ] Proper resource cleanup
-
-### Architecture
-
-- [ ] Follows established patterns and conventions
-- [ ] Proper separation of concerns
-- [ ] No architectural violations
-- [ ] Dependencies flow in correct direction
-
-### Documentation
-
-- [ ] Public APIs are documented
-- [ ] Complex logic has explanatory comments
-- [ ] README is updated if needed
-- [ ] Breaking changes are documented
-
 ## Project Context
 
-This repository's primary tech stack:
+- **IaC**: Azure Bicep (AVM-first), Terraform
+- **Scripts**: PowerShell 7+, Node.js (`.mjs`), bash, Python 3.10+
+- **Build**: `npm run lint:md`, `npm run validate:all`
+- **Style**: Conventional Commits, 120-char lines, TLS 1.2+, managed identity
+
+## Reference
 
-- **Infrastructure as Code**: Azure Bicep (AVM-first), future Terraform
-- **Scripting**: PowerShell 7+, Node.js (`.mjs`), bash
-- **Diagrams**: Python 3.10+ (diagrams library)
-- **Architecture**: Multi-agent orchestration (8 agents + 3 subagents)
-- **Build/Lint**: `npm run lint:md`, `npm run validate:all`
-- **Code Style**: Conventional Commits, 120-char markdown lines
-- **Security Baseline**: TLS 1.2+, HTTPS-only, managed identity,
-  Azure AD-only SQL auth
+Detailed checklists and examples:
+`.github/instructions/references/code-review-checklists.md`
```

#### Modified: `.github/instructions/cost-estimate.instructions.md` (+44/-243)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/cost-estimate.instructions.md	2026-03-04 06:46:56.616347562 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/cost-estimate.instructions.md	2026-03-04 06:47:05.104320879 +0000
@@ -7,391 +7,50 @@
 
 ## Document Purpose
 
-Cost estimates provide:
-
-- Financial clarity for budget approvals
-- Architecture context linking cost to design decisions
-- Optimization guidance for reducing costs
-- Fast decisions via "what changes cost" tables
+Cost estimates provide financial clarity, architecture-to-cost traceability,
+optimization guidance, and fast "what changes cost" decisions.
 
 ## General Requirements
 
-- Keep markdown lines <= 120 characters.
-- Use ATX headings (`##`, `###`) for sections.
-- Use emoji callouts consistently (see "Visual Standards").
-- Prefer tables for compare-and-decide content.
-- If the workload is small, keep the same sections but shorten them.
+- Lines ≤ 120 chars; ATX headings; consistent emoji callouts; prefer tables.
+- Small workloads: same sections, shorter content.
 
 ## Canonical Templates (Golden Source)
 
-The canonical cost-estimate structure is defined in these templates:
-
-- `.github/skills/azure-artifacts/templates/03-des-cost-estimate.template.md` (design estimate)
-- `.github/skills/azure-artifacts/templates/07-ab-cost-estimate.template.md` (as-built estimate)
-
-Agents MUST start from the appropriate template and fill it in.
-Do not re-embed long templates in agent bodies.
-
-### Core Heading Contract
-
-The required H2 headings are defined in `azure-artifacts.instructions.md`
-and validated by `validate-artifact-templates.mjs`. Use the unicode
-arrow `→` (not `->`) in the Requirements heading.
-
-## Required Header
-
-```markdown
-# Azure Cost Estimate: {Project Name}
-
-**Generated**: {YYYY-MM-DD}
-**Region**: {primary-region}
-**Environment**: {Production|Staging|Development}
-**MCP Tools Used**: {azure_price_search, azure_cost_estimate, azure_bulk_estimate, azure_region_recommend, azure_sku_discovery}
-**Architecture Reference**: {relative link to assessment doc, if available}
-```
-
-## 💵 Cost At-a-Glance (Required)
-
-Include immediately after the header:
-
-````markdown
-## 💵 Cost At-a-Glance
-
-> **Monthly Total: ~$X,XXX** | Annual: ~$XX,XXX
->
-> ```
-> Budget: $X/month (soft|hard) | Utilization: NN% ($X of $X)
-> ```
->
-> | Status            | Indicator                    |
-> | ----------------- | ---------------------------- |
-> | Cost Trend        | ➡️ Stable                    |
-> | Savings Available | 💰 $X/year with reservations |
-> | Compliance        | ✅ {e.g., PCI-DSS aligned}   |
-````
-
-If no budget is provided, use:
-
-- `Budget: No fixed budget (explain in one sentence)`
-
-## ✅ Decision Summary (Required)
-
-Immediately after "Cost At-a-Glance", include a 2-3 bullet decision summary:
-
-- What's approved now
-- What's deferred (intentionally not paying for yet)
-- What requirement change would trigger a redesign
-
-Also include a confidence line:
-
-```markdown
-**Confidence**: High|Medium|Low | **Expected Variance**: ±X% (1 sentence why)
-```
-
-## Visual Standards
-
-### Status Indicators
-
-| Status         | Indicator | Usage                                 |
-| -------------- | --------- | ------------------------------------- |
-| Under budget   | ✅        | < 80% utilized                        |
-| Near budget    | ⚠️        | 80-100% utilized                      |
-| Over budget    | ❌        | > 100% utilized                       |
-| Recommendation | 💡        | Optimization suggestions              |
-| Savings        | 💰        | Money saved                           |
-| High risk      | 🔴        | Potential to materially increase cost |
-| Medium risk    | 🟡        | Could increase cost under growth      |
-| Low risk       | 🟢        | Predictable                           |
-
-### Category Icons
-
-| Category            | Emoji |
-| ------------------- | ----- |
-| Compute             | 💻    |
-| Data Services       | 💾    |
-| Networking          | 🌐    |
-| Messaging           | 📨    |
-| Security/Management | 🔐    |
-
-### Trend Indicators
-
-- ➡️ Stable
-- 📈 Increasing
-- 📉 Decreasing
-- ⚠️ Volatile/unknown
-
-## Required Sections (Recommended Order)
-
-### 1. ✅ Decision Summary
-
-```markdown
-## ✅ Decision Summary
-
-- ✅ Approved: {what is in-scope and funded}
-- ⏳ Deferred: {what is explicitly not included yet}
-- 🔁 Redesign Trigger: {what requirement change forces SKU/region redesign}
-
-**Confidence**: High|Medium|Low | **Expected Variance**: ±X% (1 sentence why)
-```
-
-### 2. 🔁 Requirements → Cost Mapping
-
-Map business requirements and NFRs to concrete SKU decisions.
-
-```markdown
-## 🔁 Requirements → Cost Mapping
-
-| Requirement | Architecture Decision | Cost Impact  | Mandatory |
-| ----------- | --------------------- | ------------ | --------- |
-| SLA 99.9%   | Use {service/SKU}     | +$X/month 📈 | Yes       |
-| RTO/RPO     | {backup/DR choice}    | +$X/month    | No        |
-| Compliance  | {WAF/PE/CMK choice}   | +$X/month 📈 | Yes       |
-```
-
-### 3. 📊 Top 5 Cost Drivers
-
-```markdown
-## 📊 Top 5 Cost Drivers
-
-| Rank | Resource | Monthly Cost | % of Total | Trend |
-| ---- | -------- | ------------ | ---------- | ----- |
-| 1️⃣   | ...      | $...         | ...        | ➡️    |
-
-> 💡 **Quick Win**: One low-effort action that saves meaningful cost
-```
-
-### 4. Summary
-
-```markdown
-## Summary
-
-| Metric              | Value             |
-| ------------------- | ----------------- |
-| 💵 Monthly Estimate | $X - $Y           |
-| 📅 Annual Estimate  | $X - $Y           |
-| 🌍 Primary Region   | swedencentral     |
-| 💳 Pricing Type     | List Price (PAYG) |
-| ⭐ WAF Score        | X.X/10 (or TBD)   |
-| 🎯 Target Users     | N concurrent      |
-```
-
-Add a short "Business Context" narrative (2-5 lines) linking spend to outcomes.
-
-### 5. Architecture Overview
-
-Include both subsections:
-
-1. Cost distribution (table + optional generated image)
-2. Key design decisions affecting cost
-
-Cost distribution is required for all workloads. Preferred format is a markdown table.
-Optional: include a generated chart image (PNG/SVG) when available.
-
-```markdown
-## 🏛️ Architecture Overview
-
-### Cost Distribution
-
-| Category         | Monthly Cost (USD) | Share |
-| ---------------- | -----------------: | ----: |
-| 💻 Compute       |                535 |   39% |
-| 💾 Data Services |                466 |   34% |
-| 🌐 Networking    |                376 |   27% |
-
-![Monthly Cost Distribution](./03-des-cost-distribution.png)
-```
-
-### Key Design Decisions Affecting Cost
-
-| Decision | Cost Impact    | Business Rationale | Status   |
-| -------- | -------------- | ------------------ | -------- |
-| ...      | +$.../month 📈 | ...                | Required |
-
-````text
-
-### 6. 🧾 What We Are Not Paying For (Yet)
-
-Make trade-offs explicit so stakeholders see conscious deferrals.
-
-```markdown
-## 🧾 What We Are Not Paying For (Yet)
-
-> Examples: multi-region active-active, private endpoints for all services, premium HA cache, DDoS Standard
-```
-
-### 7. ⚠️ Cost Risk Indicators
-
-```markdown
-## ⚠️ Cost Risk Indicators
-
-| Resource | Risk Level | Issue | Mitigation |
-| -------- | ---------- | ----- | ---------- |
-| ... | 🔴 High | ... | ... |
-
-> **⚠️ Watch Item**: One sentence on the biggest budget uncertainty
-````
-
-### 8. 🎯 Quick Decision Matrix
-
-```markdown
-## 🎯 Quick Decision Matrix
-
-_"If you need X, expect to pay Y more"_
-
-| Requirement | Additional Cost | SKU Change | Notes |
-| ----------- | --------------- | ---------- | ----- |
-| ...         | +$.../month     | ...        | ...   |
-```
-
-### 9. 🧩 Change Control (Top 3 Change Requests)
-
-Standardize the 3 most likely changes and their delta.
-
-```markdown
-## 🧩 Change Control
-
-| Change Request      | Delta     | Notes                |
-| ------------------- | --------- | -------------------- |
-| Add multi-region DR | +$X/month | From decision matrix |
-| Add WAF             | +$X/month | From decision matrix |
-| Upgrade DB tier     | +$X/month | From decision matrix |
-```
-
-### 10. 💰 Savings Opportunities
-
-Always include a savings section.
-If already optimized, say so and list what is already applied.
-
-```markdown
-## 💰 Savings Opportunities
-
-> ### Total Potential Savings: $X/year
->
-> | Commitment | Monthly Savings | Annual Savings |
-> | ---------- | --------------- | -------------- |
-> | 1-Year ... | $...            | $...           |
-
-### Additional Optimization Strategies
-
-| Strategy | Potential Savings | Effort | Notes |
-| -------- | ----------------- | ------ | ----- |
-| ...      | ...               | 🟢 Low | ...   |
-```
-
-### 11. Detailed Cost Breakdown
-
-Break down by category, include subtotals.
-
-```markdown
-## 🧾 Detailed Cost Breakdown
-
-### 💻 Compute Services
-
-| Resource | SKU | Qty | $/Hour | $/Month | Notes |
-| -------- | --- | --- | ------ | ------- | ----- |
-
-**💻 Compute Subtotal**: ~$X/month
-```
-
-### 12. 📋 Monthly Cost Summary
-
-Include:
-
-- A category summary table
-- An ASCII bar distribution (simple, readable)
-
-### 13. 🧮 Base Run Cost vs Growth-Variable Cost
-
-Make variance drivers explicit.
-
-```markdown
-## 🧮 Base Run Cost vs Growth-Variable Cost
-
-| Cost Type       | Drivers     | Examples                   | How It Scales                 |
-| --------------- | ----------- | -------------------------- | ----------------------------- |
-| Base run        | fixed SKUs  | App Service plan, SQL tier | step-changes (SKU upgrades)   |
-| Growth-variable | usage-based | egress, logs, queries      | linear/near-linear with usage |
-```
-
-### 14. 🌍 Regional Comparison
-
-Include the primary region and at least one alternative.
-Add one sentence explaining why the primary was chosen.
-
-### 15. 🔧 Environment Strategy (FinOps)
-
-Explicitly state prod vs non-prod sizing rules and whether non-prod auto-shutdown is used.
-
-```markdown
-## 🔧 Environment Strategy (FinOps)
-
-- Production: {HA/zone strategy, baseline capacity}
-- Non-prod: {smaller SKUs, single instance, auto-shutdown schedule}
-```
-
-### 16. 🔄 Environment Cost Comparison
-
-If there are multiple environments (prod/staging/dev), include the table.
-If single environment, include a short table and state "single environment".
-
-### 17. 🛡️ Cost Guardrails
-
-Tie the estimate to operational enforcement.
-
-```markdown
-## 🛡️ Cost Guardrails
-
-| Guardrail      | Threshold   | Action                   |
-| -------------- | ----------- | ------------------------ |
-| Budget alert   | 80% / 100%  | Notify / block approvals |
-| DB utilization | >80%        | Review tier/queries      |
-| Log ingestion  | >X GB/day   | Tune sampling/retention  |
-| Egress         | >X GB/month | Investigate CDN/traffic  |
-```
-
-### 18. 📝 Testable Assumptions
-
-List 3-5 assumptions most likely to change spend, and how to measure them.
-
-```markdown
-## 📝 Testable Assumptions
-
-| Assumption         | Why It Matters             | How to Measure            | Threshold / Trigger |
-| ------------------ | -------------------------- | ------------------------- | ------------------- |
-| Egress < 100 GB/mo | keeps networking costs low | Azure Cost Mgmt + metrics | >100 GB/mo          |
-| Logs < 5 GB/mo     | avoids ingestion costs     | Log Analytics usage       | >5 GB/mo            |
-```
-
-### 19. 📊 Pricing Data Accuracy
-
-Required bullets:
-
-- Usage basis (e.g., 730 hours/month)
-- Pricing type (PAYG list price unless otherwise stated)
-- Data/egress assumptions
-- Prices queried date
-
-### 19. 📊 Pricing Data Accuracy
-
-```markdown
-## 📊 Pricing Data Accuracy
+Agents MUST start from the appropriate template:
 
-> **📊 Data Source**: Prices retrieved from Azure Retail Prices API via Azure Pricing MCP
->
-> ✅ **Included**: Retail list prices (PAYG)
->
-> ❌ **Not Included**: EA discounts, CSP pricing, negotiated rates, Azure Hybrid Benefit
->
-> 💡 For official quotes, validate with Azure Pricing Calculator
-```
+- `.github/skills/azure-artifacts/templates/03-des-cost-estimate.template.md`
+- `.github/skills/azure-artifacts/templates/07-ab-cost-estimate.template.md`
 
-### 20. 🔗 References
+H2 headings validated by `azure-artifacts.instructions.md` + `validate-artifact-templates.mjs`.
+Use `→` (not `->`) in the Requirements heading.
 
-Always include links to:
+## Required Sections (21)
+
+1. 💵 Cost At-a-Glance — monthly/annual, budget utilization
+2. ✅ Decision Summary — approved, deferred, redesign triggers
+3. 🔁 Requirements → Cost Mapping — req-to-SKU mapping
+4. 📊 Top 5 Cost Drivers — top contributors
+5. Summary — aggregates + business context
+6. 🏛️ Architecture Overview — cost distribution + design decisions
+7. 🧾 What We Are Not Paying For (Yet) — conscious deferrals
+8. ⚠️ Cost Risk Indicators — risk levels + mitigations
+9. 🎯 Quick Decision Matrix — "if X, pay Y more"
+10. 🧩 Change Control — top 3 likely changes + delta
+11. 💰 Savings Opportunities — potential savings + strategies
+12. 🧾 Detailed Cost Breakdown — by category with subtotals
+13. 📋 Monthly Cost Summary — summary + distribution
+14. 🧮 Base Run vs Growth-Variable — variance drivers
+15. 🌍 Regional Comparison — primary vs alternative
+16. 🔧 Environment Strategy (FinOps) — prod vs non-prod
+17. 🔄 Environment Cost Comparison — multi-env table
+18. 🛡️ Cost Guardrails — enforcement thresholds
+19. 📝 Testable Assumptions — assumptions + measurement
+20. 📊 Pricing Data Accuracy — sources + disclaimers
+21. 🔗 References — pricing calculator, API, docs
 
-- Azure Pricing Calculator
-- Azure Retail Prices API
-- Any assessment/plan/docs used
+Section templates and visual styling:
+`azure-artifacts/references/cost-estimate-sections.md`
 
 ## Pricing Sources (Priority Order)
 
@@ -401,14 +60,14 @@
 
 ## Patterns to Avoid
 
-| Anti-Pattern           | Solution                                           |
-| ---------------------- | -------------------------------------------------- |
-| Missing cost drivers   | Include top 5 drivers table                        |
-| Missing assumptions    | Document usage and pricing basis                   |
-| No "what changes cost" | Include the decision matrix                        |
-| No risk callouts       | Include cost risk indicators + a watch item        |
-| No savings section     | Always include savings and what is already applied |
-| Stale prices           | Note query date; re-validate periodically          |
-| Missing change control | Include top 3 likely change requests + delta       |
-| Hidden trade-offs      | Add "What we are not paying for (yet)"             |
-| Unclear variance       | Add confidence, variance, base vs variable split   |
+| Anti-Pattern           | Solution                                         |
+| ---------------------- | ------------------------------------------------ |
+| Missing cost drivers   | Include top 5 drivers table                      |
+| Missing assumptions    | Document usage and pricing basis                 |
+| No "what changes cost" | Include the decision matrix                      |
+| No risk callouts       | Include cost risk indicators + watch item        |
+| No savings section     | Always include savings, even if optimized        |
+| Stale prices           | Note query date; re-validate periodically        |
+| Missing change control | Include top 3 likely change requests + delta     |
+| Hidden trade-offs      | Add "What we are not paying for (yet)"           |
+| Unclear variance       | Add confidence, variance, base vs variable split |
```

#### Modified: `.github/instructions/governance-discovery.instructions.md` (+1/-1)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/governance-discovery.instructions.md	2026-03-04 06:46:56.616347562 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/governance-discovery.instructions.md	2026-03-04 06:47:05.108657976 +0000
@@ -1,5 +1,5 @@
 ---
-applyTo: "**/04-governance-constraints.md, **/04-governance-constraints.json, **/*.bicep, **/*.tf"
+applyTo: "**/04-governance-constraints.md, **/04-governance-constraints.json"
 description: "MANDATORY Azure Policy discovery requirements for governance constraints"
 ---
 
```

#### Modified: `.github/instructions/markdown.instructions.md` (+21/-117)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/markdown.instructions.md	2026-03-04 06:46:56.616347562 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/markdown.instructions.md	2026-03-04 06:47:05.108657976 +0000
@@ -10,35 +10,14 @@
 
 ## General Instructions
 
-- Use ATX-style headings (`##`, `###`) - never use H1 (`#`) in content (reserved for document title)
-- **CRITICAL: Limit line length to 120 characters** - this is enforced by CI/CD and pre-commit hooks
-- Break long lines at natural points (after punctuation, before conjunctions)
-- Use LF line endings (enforced by `.gitattributes`)
-- Include meaningful alt text for all images
-- Validate with `markdownlint` before committing
-- These standards serve as the canonical style reference for all markdown in this repository
+- ATX-style headings (`##`, `###`) — never H1 in content
+- **CRITICAL: 120-char line limit** (CI + pre-commit enforced)
+- Break at natural points; LF line endings
+- Meaningful alt text for images; validate with `markdownlint`
 
-## Line Length Guidelines
+## Line Length
 
-The 120-character limit is strictly enforced. When lines exceed this limit:
-
-1. **Sentences**: Break after punctuation (period, comma, em-dash)
-2. **Lists**: Break after the list marker or continue on next line with indentation
-3. **Links**: Break before `[` or use reference-style links for long URLs
-4. **Code spans**: If unavoidable, use a code block instead
-
-**Example - Breaking long lines:**
-
-```markdown
-<!-- BAD: 130+ characters -->
-
-This is a very long line that contains important information about Azure resources and best practices that exceeds the limit.
-
-<!-- GOOD: Natural break after punctuation -->
-
-This is a very long line that contains important information about Azure resources
-and best practices that stays within the limit.
-```
+120 chars max (CI enforced). Break after punctuation, before `[`, code block for long spans.
 
 ## Content Structure
 
@@ -53,177 +32,27 @@
 
 ## Code Blocks
 
-Specify the language after opening backticks for syntax highlighting:
-
-### Good Example - Language-specified code block
-
-````markdown
-```bicep
-param location string = 'swedencentral'
-```
-````
-
-### Bad Example - No language specified
-
-````markdown
-```
-param location string = 'swedencentral'
-```
-````
+Specify language after backticks. Never bare fences.
 
 ## Diagram Embeds
 
-For Azure architecture artifacts, prefer **non-Mermaid** diagram files generated via
-Python diagrams (`.png`/`.svg`) and embed with Markdown images.
-
-### Good Example - External diagram embed
-
-```markdown
-![Design Architecture](./03-des-diagram.png)
-
-Source: `03-des-diagram.py`
-```
-
-### Mermaid Usage
-
-Mermaid is allowed only when explicitly required by template/instruction.
-If Mermaid is used, include a neutral theme directive for dark mode compatibility.
-
-## Template-First Approach for Workflow Artifacts
-
-**MANDATORY for all workflow artifacts:**
-
-When generating workflow artifacts, agents **MUST** follow the canonical templates in
-`.github/skills/azure-artifacts/templates/`. Key examples:
-
-| Artifact                        | Template                                 | Producing Agent |
-| ------------------------------- | ---------------------------------------- | --------------- |
-| `01-requirements.md`            | `01-requirements.template.md`            | requirements    |
-| `02-architecture-assessment.md` | `02-architecture-assessment.template.md` | architect       |
-| `04-implementation-plan.md`     | `04-implementation-plan.template.md`     | bicep-plan      |
-| `06-deployment-summary.md`      | `06-deployment-summary.template.md`      | deploy          |
-
-All 15 artifact types have corresponding templates. See `azure-artifacts.instructions.md`
-for the complete heading reference.
-
-**Requirements:**
-
-1. **Preserve H2 heading order**: Templates define invariant H2 sections that MUST appear in order
-2. **No embedded skeletons**: Agents must link to templates, never embed structure inline
-3. **Optional sections**: May appear after the last required H2 (anchor), with warnings if before
-4. **Validation**: All artifacts are validated by `scripts/validate-artifact-templates.mjs`
-
-**Enforcement:**
-
-- Pre-commit hooks via Lefthook run validation on every commit
-- CI validates on PR/push via GitHub Actions
-- Auto-fix available: `npm run fix:artifact-h2`
-
-## Visual Styling Standards
-
-**MANDATORY**: All agent-generated documentation MUST follow the styling standards defined in:
+Prefer PNG/SVG from Python `diagrams` over Mermaid. Mermaid only when required.
 
-📚 **[Azure Artifacts Skill](../skills/azure-artifacts/SKILL.md)**
+## Template-First Approach
 
-### Quick Reference
+Agents MUST follow `azure-artifacts/templates/`.
+See `azure-artifacts.instructions.md` for the complete heading reference.
 
-| Element        | Usage               | Example                                        |
-| -------------- | ------------------- | ---------------------------------------------- |
-| Callouts       | Emphasis & warnings | `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`        |
-| Status Emoji   | Progress indicators | ✅ ⚠️ ❌ 💡                                    |
-| Category Icons | Resource sections   | 💻 💾 🌐 🔐 📊                                 |
-| Collapsible    | Long content        | `<details><summary>...</summary>...</details>` |
-| References     | Evidence links      | Microsoft Learn URLs at document bottom        |
+1. Preserve H2 heading order (invariant sections)
+2. No embedded skeletons — link to templates
+3. Optional sections after last required H2
+4. Validated by `scripts/validate-artifact-templates.mjs`
 
-### Callout Types
+Enforcement: Lefthook pre-commit + CI + `npm run fix:artifact-h2`.
 
-Supported: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`.
-Full examples and emoji tables are in the SKILL.md linked above.
+## Visual Styling
 
-## Lists and Formatting
-
-- Use `-` for bullet points (not `*` or `+`)
-- Use `1.` for numbered lists (auto-increment)
-- Indent nested lists with 2 spaces
-- Add blank lines before and after lists
-
-### Good Example - Proper list formatting
-
-```markdown
-Prerequisites:
-
-- Azure CLI 2.50+
-- Bicep CLI 0.20+
-- PowerShell 7+
-
-Steps:
-
-1. Clone the repository
-2. Run the setup script
-3. Verify installation
-```
-
-### Bad Example - Inconsistent list markers
-
-```markdown
-Prerequisites:
-
-- Azure CLI 2.50+
-
-* Bicep CLI 0.20+
-
-- PowerShell 7+
-```
-
-## Tables
-
-- Include header row with alignment
-- Keep columns aligned for readability
-- Use tables for structured comparisons
-
-```markdown
-| Resource  | Purpose            | Example          |
-| --------- | ------------------ | ---------------- |
-| Key Vault | Secrets management | `kv-contoso-dev` |
-| Storage   | Blob storage       | `stcontosodev`   |
-```
-
-## Links and References
-
-- Use descriptive link text (not "click here")
-- Verify all links are valid and accessible
-- Prefer relative paths for internal links
-
-### Good Example - Descriptive links
-
-```markdown
-See the [getting started guide](../../docs/quickstart.md) for setup instructions.
-Refer to [Azure Bicep documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/) for syntax details.
-```
-
-### Bad Example - Non-descriptive links
-
-```markdown
-Click [here](../../docs/quickstart.md) for more info.
-```
-
-## Front Matter (Optional)
-
-For blog posts or published content, include YAML front matter:
-
-```yaml
----
-post_title: "Article Title"
-author1: "Author Name"
-post_slug: "url-friendly-slug"
-post_date: "2025-01-15"
-summary: "Brief description of the content"
-categories: ["Azure", "Infrastructure"]
-tags: ["bicep", "iac", "azure"]
----
-```
-
-**Note**: Front matter fields are project-specific. General documentation files may not require all fields.
+See `azure-artifacts/SKILL.md` for styling standards, emoji, callouts, formatting.
 
 ## Patterns to Avoid
 
@@ -238,19 +67,11 @@
 
 ## Validation
 
-Run these commands before committing markdown:
-
 ```bash
-# Lint all markdown files
 markdownlint '**/*.md' --ignore node_modules --config .markdownlint.json
-
-# Check for broken links (if using markdown-link-check)
-markdown-link-check ../../README.md
 ```
 
-## Maintenance
+## Reference
 
-- Review documentation when code changes
-- Update examples to reflect current patterns
-- Remove references to deprecated features
-- Verify all links remain valid
+Full examples and formatting guide:
+`.github/instructions/references/markdown-formatting-guide.md`
```

#### Modified: `.github/instructions/terraform-code-best-practices.instructions.md` (+44/-266)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/terraform-code-best-practices.instructions.md	2026-03-04 06:46:56.620641066 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/terraform-code-best-practices.instructions.md	2026-03-04 06:47:05.108657976 +0000
@@ -17,377 +17,86 @@
 | State backend | Azure Storage Account — **NEVER** HCP Terraform Cloud                    |
 
 > [!IMPORTANT]
-> The 4 tags above are baseline defaults. Discovered Azure Policy constraints
-> (`04-governance-constraints.md`) ALWAYS take precedence. See
-> `terraform-policy-compliance.instructions.md`.
+> Policy constraints (`04-governance-constraints.md`) always override these defaults.
 
 ## File Structure (MANDATORY)
 
-Every root module MUST follow this file layout:
-
-| File           | Purpose                                      |
-| -------------- | -------------------------------------------- |
-| `main.tf`      | Root module resources and module calls       |
-| `variables.tf` | Input variable declarations                  |
-| `outputs.tf`   | Output value declarations                    |
-| `providers.tf` | Provider configuration blocks                |
-| `versions.tf`  | `terraform {}` block with required_providers |
-| `locals.tf`    | Local value computations                     |
-| `backend.tf`   | Remote state backend configuration           |
+| File                           | Purpose                                |
+| ------------------------------ | -------------------------------------- |
+| `main.tf`                      | Root module resources and module calls |
+| `variables.tf` / `outputs.tf`  | Input/output declarations              |
+| `providers.tf` / `versions.tf` | Provider and required_providers blocks |
+| `locals.tf`                    | Local value computations               |
+| `backend.tf`                   | Remote state backend configuration     |
 
 ## Naming Conventions
 
-### Resource Identifiers
-
-Use `azurerm_resource_group.this` for singleton resources (single instance per module).
-Use descriptive names for multiple instances: `azurerm_subnet.app`, `azurerm_subnet.data`.
-
-```hcl
-# Singleton resource pattern
-resource "azurerm_resource_group" "this" {
-  name     = "rg-${var.project}-${var.environment}"
-  location = var.location
-  tags     = local.tags
-}
-```
-
-### Azure Resource Names
-
-Use lowercase with hyphens for Azure resource names. Follow CAF abbreviations:
+Singletons: `.this`. Multiples: `.app`, `.data`.
+Lowercase with hyphens. CAF abbreviations:
 
 | Resource        | Pattern                        | Example                |
 | --------------- | ------------------------------ | ---------------------- |
 | Resource Group  | `rg-{project}-{env}`           | `rg-contoso-dev`       |
 | Virtual Network | `vnet-{project}-{env}`         | `vnet-contoso-dev`     |
 | Key Vault       | `kv-{short}-{env}-{suffix}`    | `kv-contoso-dev-a1b2`  |
-| Storage Account | `st{short}{env}{suffix}`       | `stcontosodevа1b2`     |
+| Storage Account | `st{short}{env}{suffix}`       | `stcontosodeva1b2`     |
 | App Service     | `app-{project}-{env}-{suffix}` | `app-contoso-dev-a1b2` |
 | SQL Server      | `sql-{project}-{env}-{suffix}` | `sql-contoso-dev-a1b2` |
 
-> [!CAUTION]
-> Storage Account names have a 24-char limit and no hyphens. Key Vault names have a
-> 24-char limit. Always use `substr()` to trim long names.
-
-## Unique Suffix Pattern (CRITICAL)
-
-Generate ONCE in the root module, pass to ALL child modules:
-
-```hcl
-# versions.tf or locals.tf
-resource "random_string" "suffix" {
-  length  = 4
-  lower   = true
-  numeric = true
-  special = false
-}
-
-locals {
-  suffix = random_string.suffix.result
-
-  # Length-constrained names
-  kv_name  = "kv-${substr(var.project, 0, 8)}-${substr(var.environment, 0, 3)}-${local.suffix}"
-  st_name  = "st${substr(replace(var.project, "-", ""), 0, 8)}${substr(var.environment, 0, 3)}${local.suffix}"
-}
-```
-
-## Provider Configuration
-
-```hcl
-# versions.tf
-terraform {
-  required_version = ">= 1.9"
-
-  required_providers {
-    azurerm = {
-      source  = "hashicorp/azurerm"
-      version = "~> 4.0"
-    }
-    random = {
-      source  = "hashicorp/random"
-      version = "~> 3.0"
-    }
-  }
-}
-```
-
-```hcl
-# providers.tf
-provider "azurerm" {
-  features {}
-  subscription_id = var.subscription_id
-}
-```
-
-## State Backend (MANDATORY)
-
-Use Azure Storage Account for remote state. **NEVER** use HCP Terraform Cloud.
-
-```hcl
-# backend.tf
-terraform {
-  backend "azurerm" {
-    resource_group_name  = "rg-tfstate-prod"
-    storage_account_name = "sttfstate{suffix}"
-    container_name       = "tfstate"
-    key                  = "{project}.terraform.tfstate"
-  }
-}
-```
-
-## Tags (MANDATORY)
-
-> [!IMPORTANT]
-> These 4 tags are the MINIMUM baseline. Azure Policy in your subscription may enforce
-> additional tags. Always defer to `04-governance-constraints.md` for the actual required tag list.
+## Core Configuration
 
-```hcl
-# locals.tf
-locals {
-  tags = merge(var.tags, {
-    Environment = var.environment
-    ManagedBy   = "Terraform"
-    Project     = var.project
-    Owner       = var.owner
-  })
-}
-```
-
-Pass `local.tags` to every resource and AVM module.
-
-## Security Defaults (MANDATORY)
+- **Unique Suffix**: `random_string` (length 4, lower+numeric) — generate once, pass everywhere.
+- **Provider**: Pin `azurerm ~> 4.0`, `random ~> 3.0`. Terraform >= 1.9.
+- **State Backend**: Azure Storage Account. **NEVER** HCP Terraform Cloud.
+- **Tags**: 4 mandatory (Environment, ManagedBy, Project, Owner) — `local.tags` everywhere.
+- **Security**: TLS 1.2+, HTTPS-only, no public blob, managed identity preferred.
 
 > [!IMPORTANT]
-> The security settings below are baseline defaults. Discovered Azure Policy
-> security constraints (`04-governance-constraints.md`) ALWAYS take precedence.
-> See `terraform-policy-compliance.instructions.md`.
-
-```hcl
-# Storage Account
-resource "azurerm_storage_account" "this" {
-  # ...
-  https_traffic_only_enabled    = true
-  min_tls_version               = "TLS1_2"
-  allow_nested_items_to_be_public = false
-  shared_access_key_enabled     = false  # Policy may require this
-}
-
-# SQL Server
-resource "azurerm_mssql_server" "this" {
-  # ...
-  minimum_tls_version          = "1.2"
-  public_network_access_enabled = false
-  azuread_administrator {
-    azuread_authentication_only = true
-  }
-}
-```
+> Policy constraints (`04-governance-constraints.md`) ALWAYS override defaults above.
 
 ## RBAC Least Privilege (MANDATORY)
 
-Do not grant broad built-in control-plane roles to runtime app identities.
-
-### Forbidden by Default
-
-The following roles are **not allowed** for application runtime identities unless
-explicitly approved in a tracked exception:
-
-- `Owner`
-- `Contributor`
-- `User Access Administrator`
-
-### Approved Role Mappings
-
-Use the smallest role and narrowest scope that satisfies the workload.
-
-| Resource Type | Approved Role(s)                                                    | Required Scope Pattern             |
-| ------------- | ------------------------------------------------------------------- | ---------------------------------- |
-| Key Vault     | `Key Vault Secrets User`                                            | Specific Key Vault resource ID     |
-| Storage Blob  | `Storage Blob Data Reader` / `Storage Blob Data Contributor`        | Storage account or container scope |
-| SQL Database  | `SQL DB Contributor` (or DB-level Entra roles)                      | Database scope, not server scope   |
-| Service Bus   | `Azure Service Bus Data Sender` / `Azure Service Bus Data Receiver` | Namespace or queue/topic scope     |
-| Event Hubs    | `Azure Event Hubs Data Sender` / `Azure Event Hubs Data Receiver`   | Namespace or hub scope             |
-| ACR Pull      | `AcrPull`                                                           | Specific registry scope            |
-
-### SQL-Specific Rule
+**Blocked** for app runtime: `Owner`, `Contributor`, `User Access Administrator`.
 
-For app-to-SQL access, prefer:
+| Resource Type | Approved Role(s)                       | Required Scope        |
+| ------------- | -------------------------------------- | --------------------- |
+| Key Vault     | `Key Vault Secrets User`               | Key Vault resource ID |
+| Storage Blob  | `Storage Blob Data Reader/Contributor` | Account or container  |
+| SQL Database  | `SQL DB Contributor` / Entra DB roles  | Database scope        |
+| Service Bus   | `Service Bus Data Sender/Receiver`     | NS or queue/topic     |
+| Event Hubs    | `Event Hubs Data Sender/Receiver`      | NS or hub             |
+| ACR Pull      | `AcrPull`                              | Registry scope        |
 
-1. Entra-based DB user and DB roles (`db_datareader`, `db_datawriter`) where possible
-2. Otherwise `SQL DB Contributor` at database scope
+**SQL**: Prefer Entra DB roles. Never `Contributor` at server scope.
 
-Never assign `Contributor` at SQL server scope for app runtime identities.
-
-### Exception Process
-
-If a broad role is unavoidable, all of the following are required:
-
-1. Inline comment marker on the role assignment:
-   `RBAC_EXCEPTION_APPROVED: <ticket-or-ADR>`
-2. Matching justification in implementation docs (ADR or implementation reference)
-3. Time-bound review date and owner in the justification
-
-Without all three, the configuration is non-compliant.
+**Exceptions**: (1) `RBAC_EXCEPTION_APPROVED: <ticket>`, (2) docs justification,
+(3) time-bound review. Missing any = non-compliant.
 
 ## Azure Verified Modules (AVM-TF)
 
-**MANDATORY: Use AVM-TF modules for ALL resources where an AVM module exists.**
-
-Raw `azurerm_*` resources are only permitted when no AVM module exists AND the user
-explicitly approves. Document the rationale in the implementation reference.
-
-```hcl
-# ✅ Use AVM-TF for Key Vault
-module "key_vault" {
-  source  = "Azure/avm-res-keyvault-vault/azurerm"
-  version = "~> 0.9"
-
-  name                = local.kv_name
-  resource_group_name = azurerm_resource_group.this.name
-  location            = var.location
-  tenant_id           = data.azurerm_client_config.current.tenant_id
-  tags                = local.tags
-}
-
-# ❌ Only use raw azurerm_* if no AVM module exists
-# Requires explicit user approval: "approve raw terraform"
-```
-
-### AVM-TF Module Source Format
-
-```hcl
-source  = "Azure/avm-res-{service}-{resource}/azurerm"
-version = "~> {major}.{minor}"
-```
-
-Examples:
-
-| Resource        | Source                                         |
-| --------------- | ---------------------------------------------- |
-| Key Vault       | `Azure/avm-res-keyvault-vault/azurerm`         |
-| Storage         | `Azure/avm-res-storage-storageaccount/azurerm` |
-| Virtual Network | `Azure/avm-res-network-virtualnetwork/azurerm` |
-| App Service     | `Azure/avm-res-web-site/azurerm`               |
-
-Use `mcp_terraform_get_latest_module_version` or `registry.terraform.io/modules/Azure`
-to find the latest version before generating code. Update pinned minor version
-(`~> X.Y`) to the latest available.
-
-## Variables
-
-```hcl
-# variables.tf
-variable "location" {
-  description = "Azure region for all resources."
-  type        = string
-  default     = "swedencentral"
-
-  validation {
-    condition     = contains(["swedencentral", "germanywestcentral", "northeurope"], var.location)
-    error_message = "Location must be an approved EU region."
-  }
-}
-
-variable "environment" {
-  description = "Deployment environment."
-  type        = string
-  validation {
-    condition     = contains(["dev", "staging", "prod"], var.environment)
-    error_message = "Environment must be dev, staging, or prod."
-  }
-}
-
-variable "tags" {
-  description = "Additional tags to merge with baseline tags."
-  type        = map(string)
-  default     = {}
-}
-```
-
-## Outputs
-
-```hcl
-# outputs.tf — every module must output BOTH ID and name
-output "resource_group_id" {
-  description = "Resource group resource ID."
-  value       = azurerm_resource_group.this.id
-}
-
-output "resource_group_name" {
-  description = "Resource group name."
-  value       = azurerm_resource_group.this.name
-}
-```
-
-## Managed Identity Pattern
-
-Prefer SystemAssigned managed identity over access keys or connection strings:
-
-```hcl
-resource "azurerm_linux_web_app" "this" {
-  # ...
-  identity {
-    type = "SystemAssigned"
-  }
-}
-
-resource "azurerm_role_assignment" "app_kv" {
-  scope                = module.key_vault.resource_id
-  role_definition_name = "Key Vault Secrets User"
-  principal_id         = azurerm_linux_web_app.this.identity[0].principal_id
-}
-```
-
-## Lifecycle Rules
-
-```hcl
-# Avoid phantom diffs on externally-managed tags
-lifecycle {
-  ignore_changes = [tags["DateCreated"]]
-}
-
-# Prevent accidental deletion of stateful resources
-lifecycle {
-  prevent_destroy = true
-}
-```
-
-## Resource Renaming Without Destroy
-
-Use `moved` blocks instead of destroying and re-creating:
-
-```hcl
-moved {
-  from = azurerm_key_vault.main
-  to   = azurerm_key_vault.this
-}
-```
+**MANDATORY**: Use `Azure/avm-res-{service}-{resource}/azurerm` for all resources.
+Lookup: `mcp_terraform_get_latest_module_version`. Raw `azurerm_*` only with approval.
 
 ## Patterns to Avoid
 
-| Anti-Pattern                    | Problem                       | Solution                               |
-| ------------------------------- | ----------------------------- | -------------------------------------- |
-| Hardcoded resource names        | Naming collisions             | Use `random_string.suffix`             |
-| `count` for named resources     | Index-based drift on deletion | Use `for_each` with string keys        |
-| Missing `description` on vars   | Poor documentation            | Document all input variables           |
-| `>= 3.0` provider version range | Unintended major upgrades     | Use `~> 4.0` for minor-version pinning |
-| HCP Terraform Cloud as backend  | Vendor lock-in                | Use Azure Storage Account backend      |
-| Raw `azurerm_*` when AVM exists | Policy drift and maintenance  | Use AVM-TF modules or get approval     |
-| `connection_string` auth        | Credential exposure           | Use managed identity RBAC              |
+| Anti-Pattern                    | Problem                      | Solution                               |
+| ------------------------------- | ---------------------------- | -------------------------------------- |
+| Hardcoded resource names        | Naming collisions            | Use `random_string.suffix`             |
+| Missing `description` on vars   | Poor documentation           | Document all input variables           |
+| `>= 3.0` provider version range | Unintended major upgrades    | Use `~> 4.0` for minor-version pinning |
+| Raw `azurerm_*` when AVM exists | Policy drift and maintenance | Use AVM-TF modules or get approval     |
+| `connection_string` auth        | Credential exposure          | Use managed identity RBAC              |
 
 ## Validation Commands
 
 ```bash
-terraform fmt -recursive
-terraform validate
+terraform fmt -recursive && terraform validate
 terraform plan -out=plan.tfplan
-terraform show -json plan.tfplan | python scripts/analyze_plan.py  # optional: set-diff analysis
 ```
 
-Always run `terraform fmt` before committing. Always run `terraform validate` before planning.
-
 ## Cross-References
 
-- **Policy compliance**: `.github/instructions/terraform-policy-compliance.instructions.md`
-- **Governance discovery**: `.github/instructions/governance-discovery.instructions.md`
-- **Terraform patterns**: `.github/skills/terraform-patterns/SKILL.md`
-- **Azure defaults**: `.github/skills/azure-defaults/SKILL.md`
+- **Policy**: `terraform-policy-compliance.instructions.md`
+- **Governance**: `governance-discovery.instructions.md`
+- **Patterns**: `terraform-patterns/SKILL.md` | **Defaults**: `azure-defaults/SKILL.md`
+- **HCL examples**: `terraform-patterns/references/tf-best-practices-examples.md`
```

#### Modified: `.github/instructions/terraform-policy-compliance.instructions.md` (+1/-1)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/instructions/terraform-policy-compliance.instructions.md	2026-03-04 06:46:56.620641066 +0000
+++ /workspaces/azure-agentic-infraops/.github/instructions/terraform-policy-compliance.instructions.md	2026-03-04 06:47:05.108657976 +0000
@@ -1,6 +1,6 @@
 ---
 description: "MANDATORY Azure Policy compliance rules for Terraform code generation. Azure Policy always wins."
-applyTo: "**/*.tf, **/*.agent.md"
+applyTo: "**/*.tf"
 ---
 
 # Terraform Policy Compliance Instructions
```

#### Added: `.github/instructions/references/code-review-checklists.md` (+212 lines)

#### Added: `.github/instructions/references/markdown-formatting-guide.md` (+177 lines)

### Prompts

#### Modified: `.github/prompts/plan-agenticWorkflowOverhaul.prompt.md` (+71/-50)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/prompts/plan-agenticWorkflowOverhaul.prompt.md	2026-03-04 06:46:56.633521576 +0000
+++ /workspaces/azure-agentic-infraops/.github/prompts/plan-agenticWorkflowOverhaul.prompt.md	2026-03-04 15:30:02.509653236 +0000
@@ -12,45 +12,54 @@
 
 ### Milestone 1: Core Optimization (Phases 0-6) — ~15-20 hrs
 
-| Phase | Title | Status | Blocker |
-|------:|-------|--------|---------|
-| 0 | Baseline & KPI Definition | not-started | — |
-| 1 | P0 Skill Splits | not-started | — |
-| 2 | Instruction Optimization + Dedup | not-started | — |
-| 3 | Instruction Splits | not-started | — |
-| 4 | Error Rate & Burst Reduction | not-started | — |
-| 5 | Agent Body Optimization | not-started | — |
-| 6 | M1 Measurement Gate | not-started | — |
+| Phase | Title                            | Status   | Blocker |
+| ----: | -------------------------------- | -------- | ------- |
+|     0 | Baseline & KPI Definition        | complete | —       |
+|     1 | P0 Skill Splits                  | complete | —       |
+|     2 | Instruction Optimization + Dedup | complete | —       |
+|     3 | Instruction Splits               | complete | —       |
+|     4 | Error Rate & Burst Reduction     | complete | —       |
+|     5 | Agent Body Optimization          | complete | —       |
+|     6 | M1 Measurement Gate              | complete | —       |
 
 ### Milestone 2: Extended Optimization (Phases 7-9) — ~10-15 hrs
 
-| Phase | Title | Status | Blocker |
-|------:|-------|--------|---------|
-| 7 | CI Enforcement Validators | not-started | — |
-| 8 | Remaining Skill Splits | not-started | — |
-| 9 | Subagent Overhaul + iac-common | not-started | — |
+| Phase | Task | Detail File                 | Status   | Blocker |
+| ----: | ---- | --------------------------- | -------- | ------- |
+|     7 | M2-A | `m2-a-ci-enforcement.md`    | complete | —       |
+|     8 | M2-B | `m2-b-skill-splits.md`      | complete | —       |
+|     9 | M2-C | `m2-c-subagent-overhaul.md` | complete | —       |
 
 ### Milestone 3: New Capabilities (Phases 10-12) — ~10-15 hrs
 
-| Phase | Title | Status | Blocker |
-|------:|-------|--------|---------|
-| 10 | Challenger Model & Fast Path | not-started | — |
-| 11 | Doc-Gardening & GC Automation | not-started | — |
-| 12 | Final Measurement & Ship | not-started | — |
+| Phase | Task | Detail File                   | Status      | Blocker |
+| ----: | ---- | ----------------------------- | ----------- | ------- |
+|    10 | M3-A | `m3-a-challenger-fastpath.md` | complete    | —       |
+|    11 | M3-B | `m3-b-doc-gardening.md`       | complete    | —       |
+|    12 | M3-C | `m3-c-final-measurement.md`   | not-started | —       |
 
 ### KPI Targets
 
-| KPI | Baseline | Target |
-|-----|----------|--------|
-| Avg latency/turn | 11,792ms (Opus) / 11,379ms (Sonnet) | <8,000ms |
-| P95 latency | 28,561ms | <15,000ms |
-| Burst sequences | 123 | <60 |
+| KPI              | Baseline                            | Target    |
+| ---------------- | ----------------------------------- | --------- |
+| Avg latency/turn | 11,792ms (Opus) / 11,379ms (Sonnet) | <8,000ms  |
+| P95 latency      | 28,561ms                            | <15,000ms |
+| Burst sequences  | 123                                 | <60       |
 
 ### Session Log
 
-| Date | Session | Phases Completed | Notes |
-|------|---------|-----------------|-------|
-| — | — | — | — |
+| Date       | Session | Phases Completed | Notes                                                                                                                                                                                     |
+| ---------- | ------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
+| 2025-07-03 | 1       | 0, 1             | Removed phantom toolsets ref; split azure-defaults (702->141) and azure-artifacts (614->102); 16 ref files; 9 skill descs optimized; validator + parser fixes. Commits: fcb4327, b0de949. |
+| 2026-03-03 | 2       | 2, 3, 4          | Glob narrows + dedup (d883b37); instruction splits 1660->389 lines (97e0dcb); validator remediation messages (85c4a8b).                                                                   |
+| 2026-03-03 | 3       | 5 (partial)      | Phase 5 research complete: detailed extraction plan for 06t (501->~300) and 05t (443->~295). Implementation not started. Full state in agent-output/\_meta/ctx-opt-session-state.md.      |
+| 2026-03-04 | 4       | 5                | Phase 5 implementation: 7 agents trimmed (6416->5574 total, 13%); 3 TF ref files created; DO/DON'T->tables; Boundaries added to all 14 agents. Commit: d0b142a.                           |
+| 2026-03-04 | 5       | 6                | M1 gate: baseline snapshot from main, diff report generated. Agents -15%, Skills -20%, Instructions -32%. 43 ref files (on-demand). PR created.                                           |
+| 2026-03-04 | 6       | 7                | Phase 7: 5 CI enforcement validators created (skill-size, agent-body-size, glob-audit, skill-references, orphaned-content) + lint:docs-freshness added to validate:all.                   |
+| 2026-03-04 | 7       | 8                | Phase 8: 5 skills split (session-resume 347->78, terraform-patterns 512->84, azure-bicep-patterns 307->78, azure-troubleshooting 275->77, azure-diagrams 553->149). 15 new ref files.     |
+| 2026-03-04 | 8       | 9                | Phase 9: challenger 323->154, bicep-review 225->141, tf-review 236->150. iac-common skill (118 lines). golden-principles integrated. M2 complete.                                         |
+| 2026-03-04 | 9       | 10               | Phase 10: Challenger model GPT-5.3->Sonnet 4.6. Fast-path conductor created. Complexity field added to requirements template. Validator + template emoji fix.                             |
+| 2026-03-04 | 10      | 11               | Phase 11: Weekly freshness cron workflow, quarterly audit checklist in AGENTS.md, freshness script extended to cover skill refs, canary markers added to 17 pre-existing reference files. |
 
 ---
 
@@ -61,18 +70,34 @@
 Scan the **Session State Tracker** above. Find the first row with
 `Status = not-started` or `Status = in-progress`. That is the active phase.
 
+### Step 1.5 — Load session state (if any phase is `in-progress`)
+
+If ANY phase in the tracker has `Status = in-progress`, read the detailed
+session state file FIRST — it contains extraction plans, file sizes, and
+implementation specifics that are NOT in the milestone detail files:
+
+```text
+agent-output/_meta/ctx-opt-session-state.md
+```
+
+This file has the exact resume checklist. Follow it before proceeding.
+
 ### Step 2 — Load phase-specific context
 
 Based on the active milestone, read ONLY the detail file listed below.
 Do NOT load other milestone files — they are out of scope.
 
-| Active Milestone | Detail File | Max Additional Reads |
-|-----------------|-------------|---------------------|
-| M1 (Phases 0-6) | `.github/prompts/plan-ctxopt/m1-core-optimization.md` | 3 (target files being modified) |
-| M2 (Phases 7-9) | `.github/prompts/plan-ctxopt/m2-extended-optimization.md` | 3 |
-| M3 (Phases 10-12) | `.github/prompts/plan-ctxopt/m3-new-capabilities.md` | 3 |
-| Decisions/Risk questions | `.github/prompts/plan-ctxopt/appendix-decisions.md` | 0 |
-| Findings traceability | `.github/prompts/plan-ctxopt/appendix-findings.md` | 0 |
+| Active Phase | Detail File                                               | Max Additional Reads            |
+| ------------ | --------------------------------------------------------- | ------------------------------- |
+| M1 (0-6)     | `.github/prompts/plan-ctxopt/m1-core-optimization.md`     | 3 (target files being modified) |
+| M2-A (7)     | `.github/prompts/plan-ctxopt/m2-a-ci-enforcement.md`      | 3                               |
+| M2-B (8)     | `.github/prompts/plan-ctxopt/m2-b-skill-splits.md`        | 3                               |
+| M2-C (9)     | `.github/prompts/plan-ctxopt/m2-c-subagent-overhaul.md`   | 3                               |
+| M3-A (10)    | `.github/prompts/plan-ctxopt/m3-a-challenger-fastpath.md` | 3                               |
+| M3-B (11)    | `.github/prompts/plan-ctxopt/m3-b-doc-gardening.md`       | 3                               |
+| M3-C (12)    | `.github/prompts/plan-ctxopt/m3-c-final-measurement.md`   | 3                               |
+| Decisions    | `.github/prompts/plan-ctxopt/appendix-decisions.md`       | 0                               |
+| Findings     | `.github/prompts/plan-ctxopt/appendix-findings.md`        | 0                               |
 
 ### Step 3 — Verify branch state
 
@@ -117,27 +142,27 @@
 
 Run 2x adversarial reviews (Sonnet 4.6 + GPT 5.3 lenses) at these points:
 
-| After Phase | What's Reviewed |
-|------------|----------------|
-| 1 | Split skill structure, reference index, canary patterns |
-| 5 | Trimmed agents, boundary definitions, command placement |
-| 9 | iac-common skill, challenger restructure, golden-principles |
-| 10 | Experimental conductor, model comparison results |
+| After Phase | What's Reviewed                                             |
+| ----------- | ----------------------------------------------------------- |
+| 1           | Split skill structure, reference index, canary patterns     |
+| 5           | Trimmed agents, boundary definitions, command placement     |
+| 9           | iac-common skill, challenger restructure, golden-principles |
+| 10          | Experimental conductor, model comparison results            |
 
 ---
 
 ## Quick Reference
 
-| Concept | Value |
-|---------|-------|
-| Total phases | 13 (0-12) across 3 milestones |
-| Total effort | ~35-50 hrs |
-| Validation | `npm run validate:all` after every phase |
-| Canary tests | After Phases 1, 5, 9 |
-| Detail files | `.github/prompts/plan-ctxopt/m1-*.md`, `m2-*.md`, `m3-*.md` |
-| Appendices | `appendix-findings.md`, `appendix-decisions.md` |
-| Source report | `agent-output/_meta/11-context-optimization-report.md` |
-| Original plan | `agent-output/_meta/11-implementation-plan.md` |
+| Concept       | Value                                                                   |
+| ------------- | ----------------------------------------------------------------------- |
+| Total phases  | 13 (0-12) across 3 milestones                                           |
+| Total effort  | ~35-50 hrs                                                              |
+| Validation    | `npm run validate:all` after every phase                                |
+| Canary tests  | After Phases 1, 5, 9                                                    |
+| Detail files  | `.github/prompts/plan-ctxopt/m1-*.md`, `m2-a/b/c-*.md`, `m3-a/b/c-*.md` |
+| Appendices    | `appendix-findings.md`, `appendix-decisions.md`                         |
+| Source report | `agent-output/_meta/11-context-optimization-report.md`                  |
+| Original plan | `agent-output/_meta/11-implementation-plan.md`                          |
 
 ---
 
```

#### Modified: `.github/prompts/plan-ctxopt/m1-core-optimization.md` (+87/-72)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/prompts/plan-ctxopt/m1-core-optimization.md	2026-03-04 06:46:56.633521576 +0000
+++ /workspaces/azure-agentic-infraops/.github/prompts/plan-ctxopt/m1-core-optimization.md	2026-03-04 06:47:05.108657976 +0000
@@ -13,7 +13,9 @@
    - **Avg latency per agent turn**: target <8,000ms (baseline: 11,792ms Opus / 11,379ms Sonnet)
    - **P95 latency**: target <15,000ms (baseline: 28,561ms)
    - **Burst sequences**: target <60 (baseline: 123)
-2. Fix phantom `infraops.toolsets.jsonc` reference in `AGENTS.md` and `copilot-instructions.md` — file doesn't exist; either create it or remove references
+2. Fix phantom `infraops.toolsets.jsonc` reference in `AGENTS.md` and
+   `copilot-instructions.md` — file doesn't exist; either create it or
+   remove references
 3. Create branch `ctx-opt/milestone-1`, tag start point
 4. Run `npm run validate:all` — record baseline
 5. Run e2e conductor test on a fixed simple project with a saved prompt — record latency metrics from chat logs
@@ -28,35 +30,37 @@
 
 ### 1.1 — Split `azure-defaults/SKILL.md` (702 lines → ≤120 lines)
 
-| Step | Action |
-|------|--------|
-| 1 | Create `references/` subdirectory under `.github/skills/azure-defaults/` |
-| 2 | Create `references/service-matrices.md` — move detailed service capability tables |
-| 3 | Create `references/pricing-guidance.md` — move pricing tiers, calculator links, estimation methodology |
-| 4 | Create `references/security-baseline-full.md` — move full security checklist (keep 5-line summary in SKILL.md) |
-| 5 | Create `references/naming-full-examples.md` — move extended naming examples (keep CAF abbreviation table in SKILL.md) |
-| 6 | Trim `SKILL.md` to ~100-line quick-reference: regions, tags, naming table, AVM-first rule, 5-line security summary, unique suffix patterns |
-| 7 | Add `## Reference Index` section at bottom with progressive-loading directives using imperative language |
-| 8 | **Canary pattern**: Each reference file starts with `<!-- ref:{filename}-v1 -->` marker |
-| 9 | **Keep 1 compact canonical example** (5-10 lines) per major pattern inline |
+| Step | Action                                                                                                                                     |
+| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
+| 1    | Create `references/` subdirectory under `.github/skills/azure-defaults/`                                                                   |
+| 2    | Create `references/service-matrices.md` — move detailed service capability tables                                                          |
+| 3    | Create `references/pricing-guidance.md` — move pricing tiers, calculator links, estimation methodology                                     |
+| 4    | Create `references/security-baseline-full.md` — move full security checklist (keep 5-line summary in SKILL.md)                             |
+| 5    | Create `references/naming-full-examples.md` — move extended naming examples (keep CAF abbreviation table in SKILL.md)                      |
+| 6    | Trim `SKILL.md` to ~100-line quick-reference: regions, tags, naming table, AVM-first rule, 5-line security summary, unique suffix patterns |
+| 7    | Add `## Reference Index` section at bottom with progressive-loading directives using imperative language                                   |
+| 8    | **Canary pattern**: Each reference file starts with `<!-- ref:{filename}-v1 -->` marker                                                    |
+| 9    | **Keep 1 compact canonical example** (5-10 lines) per major pattern inline                                                                 |
 
 **Target**: SKILL.md ≤ 120 lines; references/ contains 4+ files
 
 ### 1.2 — Split `azure-artifacts/SKILL.md` (614 lines → ≤100 lines)
 
-| Step | Action |
-|------|--------|
-| 1 | Create `references/` subdirectory under `.github/skills/azure-artifacts/` |
-| 2 | Create per-step template files: `references/01-requirements-template.md`, `references/02-architecture-template.md`, etc. (steps 01-07) |
-| 3 | Trim `SKILL.md` to ~80-line quick-reference: artifact list, key rules (H2 compliance, styling, generation protocol) |
-| 4 | Add loading directives: "When generating Step N artifact, read `references/0N-*-template.md` for full H2 structure" |
-| 5 | Same canary + reference index pattern |
+| Step | Action                                                                                                                                 |
+| ---- | -------------------------------------------------------------------------------------------------------------------------------------- |
+| 1    | Create `references/` subdirectory under `.github/skills/azure-artifacts/`                                                              |
+| 2    | Create per-step template files: `references/01-requirements-template.md`, `references/02-architecture-template.md`, etc. (steps 01-07) |
+| 3    | Trim `SKILL.md` to ~80-line quick-reference: artifact list, key rules (H2 compliance, styling, generation protocol)                    |
+| 4    | Add loading directives: "When generating Step N artifact, read `references/0N-*-template.md` for full H2 structure"                    |
+| 5    | Same canary + reference index pattern                                                                                                  |
 
 **Target**: SKILL.md ≤ 100 lines; 7+ reference files (one per step)
 
 ### 1.3 — Merge Skill Description Optimization
 
-While touching each skill, update the `description` frontmatter to be trigger-optimized with USE FOR / DO NOT USE FOR patterns per mgechev criteria.
+While touching each skill, update the `description` frontmatter to be
+trigger-optimized with USE FOR / DO NOT USE FOR patterns per mgechev
+criteria.
 
 ### Validation
 
@@ -67,11 +71,15 @@
 npm run validate:all
 ```
 
-**Canary prompt test**: Invoke the Architect agent (03) with a canned prompt → verify output structure and security content are correct with the split skills.
+**Canary prompt test**: Invoke the Architect agent (03) with a canned
+prompt → verify output structure and security content are correct with
+the split skills.
 
 ### Adversarial Review Gate
 
-After Phase 1: Run 2x reviews (Sonnet 4.6 + GPT 5.3) on split skill structure, reference index, and canary patterns. Verify splits don't lose critical content and progressive loading directives are clear.
+After Phase 1: Run 2x reviews (Sonnet 4.6 + GPT 5.3) on split skill
+structure, reference index, and canary patterns. Verify splits don't
+lose critical content and progressive loading directives are clear.
 
 ---
 
@@ -81,32 +89,32 @@
 
 ### Part A — Glob Narrows (zero-risk edits)
 
-| # | File | Change |
-|---|------|--------|
-| 1 | `code-commenting.instructions.md` | `applyTo` from `"**"` to `"**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"` |
-| 2 | `governance-discovery.instructions.md` | Remove `**/*.bicep, **/*.tf` from `applyTo` |
-| 3 | `bicep-policy-compliance.instructions.md` | Remove `**/*.agent.md` from `applyTo` |
-| 4 | `terraform-policy-compliance.instructions.md` | Remove `**/*.agent.md` from `applyTo` |
+| #   | File                                          | Change                                                                       |
+| --- | --------------------------------------------- | ---------------------------------------------------------------------------- |
+| 1   | `code-commenting.instructions.md`             | `applyTo` from `"**"` to `"**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"` |
+| 2   | `governance-discovery.instructions.md`        | Remove `**/*.bicep, **/*.tf` from `applyTo`                                  |
+| 3   | `bicep-policy-compliance.instructions.md`     | Remove `**/*.agent.md` from `applyTo`                                        |
+| 4   | `terraform-policy-compliance.instructions.md` | Remove `**/*.agent.md` from `applyTo`                                        |
 
 ### Part B — Cross-Agent Dedup
 
-| # | Action | Source Agents |
-|---|--------|---------------|
-| 5 | Extract policy effect decision tree → `governance-discovery.instructions.md` | 05b, 05t, 06b, 06t |
-| 6 | Extract adversarial review boilerplate → new section in `challenger-review-subagent.agent.md` | 03, 05b, 05t, 06b, 06t |
-| 7 | Consolidate session state protocol → reference `session-resume/SKILL.md` | 10 agents |
-| 8 | Remove redundant security baseline (already in `azure-defaults`) | 6+ agents |
-| 9 | Extract Azure CLI auth validation → `azure-defaults/references/auth-validation.md` | 07b, 07t |
+| #   | Action                                                                                        | Source Agents          |
+| --- | --------------------------------------------------------------------------------------------- | ---------------------- |
+| 5   | Extract policy effect decision tree → `governance-discovery.instructions.md`                  | 05b, 05t, 06b, 06t     |
+| 6   | Extract adversarial review boilerplate → new section in `challenger-review-subagent.agent.md` | 03, 05b, 05t, 06b, 06t |
+| 7   | Consolidate session state protocol → reference `session-resume/SKILL.md`                      | 10 agents              |
+| 8   | Remove redundant security baseline (already in `azure-defaults`)                              | 6+ agents              |
+| 9   | Extract Azure CLI auth validation → `azure-defaults/references/auth-validation.md`            | 07b, 07t               |
 
 ### Part C — Sharing Decision Framework
 
 Add to `AGENTS.md`:
 
-| Content Type | Mechanism | When to Use |
-|-------------|-----------|-------------|
-| Enforcement rules | Instructions (auto-loaded by glob) | Rules that must apply to all files of a type |
-| Shared domain knowledge | Skill `references/` | Deep content loaded on-demand by agents |
-| Executable scripts | Skill `scripts/` (NOT `references/`) | Deterministic operations, build/deploy scripts |
+| Content Type            | Mechanism                                | When to Use                                    |
+| ----------------------- | ---------------------------------------- | ---------------------------------------------- |
+| Enforcement rules       | Instructions (auto-loaded by glob)       | Rules that must apply to all files of a type   |
+| Shared domain knowledge | Skill `references/`                      | Deep content loaded on-demand by agents        |
+| Executable scripts      | Skill `scripts/` (NOT `references/`)     | Deterministic operations, build/deploy scripts |
 | Cross-agent boilerplate | Subagent or instruction with narrow glob | Repeated patterns across multiple agent bodies |
 
 ### Validation
@@ -124,13 +132,13 @@
 
 **Effort**: 2-3 hrs | **Addresses**: H7, H8, M3, M4, M5 | **Risk**: Low
 
-| # | Instruction File | Current | Target | Action |
-|---|-----------------|---------|--------|--------|
-| 1 | `cost-estimate.instructions.md` | 414 lines | ≤80 + refs | Move detailed pricing tables to reference files |
-| 2 | `terraform-code-best-practices.instructions.md` | 393 lines | ≤100 + refs | Move patterns to `terraform-patterns/references/` |
-| 3 | `code-review.instructions.md` | 313 lines | ≤80 + refs | Move checklist templates to reference file |
-| 4 | `markdown.instructions.md` | 256 lines | ≤80 + refs | Move detailed formatting rules to reference file |
-| 5 | `azure-artifacts.instructions.md` | 284 lines | ≤80 | Dedup vs now-split `azure-artifacts/SKILL.md` — retain enforcement rules only |
+| #   | Instruction File                                | Current   | Target      | Action                                                                        |
+| --- | ----------------------------------------------- | --------- | ----------- | ----------------------------------------------------------------------------- |
+| 1   | `cost-estimate.instructions.md`                 | 414 lines | ≤80 + refs  | Move detailed pricing tables to reference files                               |
+| 2   | `terraform-code-best-practices.instructions.md` | 393 lines | ≤100 + refs | Move patterns to `terraform-patterns/references/`                             |
+| 3   | `code-review.instructions.md`                   | 313 lines | ≤80 + refs  | Move checklist templates to reference file                                    |
+| 4   | `markdown.instructions.md`                      | 256 lines | ≤80 + refs  | Move detailed formatting rules to reference file                              |
+| 5   | `azure-artifacts.instructions.md`               | 284 lines | ≤80         | Dedup vs now-split `azure-artifacts/SKILL.md` — retain enforcement rules only |
 
 ### Validation
 
@@ -147,13 +155,16 @@
 
 **Effort**: 2-3 hrs | **Addresses**: C5, H9 | **Risk**: Medium
 
-Moved after skill splits because reduced context should independently lower burst sequences and some errors. Now we can isolate remaining errors.
-
-| # | Action |
-|---|--------|
-| 1 | Audit the 30 failed requests from session data for patterns — which agents, which operations, which error types |
-| 2 | For server errors triggering retries: add retry-awareness guidance to affected agent bodies ("If tool call fails, wait 3s before retry; do not retry identical calls more than twice") |
-| 3 | Add remediation-rich error messages to the **top-5 most-frequently-failing validators** — format: `❌ {what's wrong}\n   🔧 Fix: {exact edit to resolve}` |
+Moved after skill splits because reduced context should independently
+lower burst sequences and some errors. Now we can isolate remaining
+errors.
+
+| #   | Action                                                                                 |
+| --- | -------------------------------------------------------------------------------------- |
+| 1   | Audit the 30 failed requests from session data for patterns                            |
+|     | — which agents, which operations, which error types                                    |
+| 2   | Add retry guidance to affected agents: "wait 3s before retry; max 2 identical retries" |
+| 3   | Add remediation-rich error messages to top-5 failing validators                        |
 
 ### Validation
 
@@ -169,14 +180,14 @@
 
 ### 5.1 — Trim Agent Bodies
 
-| Agent | Current | Target | Key Actions |
-|-------|---------|--------|-------------|
-| `06t-terraform-codegen` | 432 lines | <300 | Extract bootstrap/deploy scripts to `terraform-patterns/scripts/` (NOT `references/`); remove inline HCL duplicating skills; defer `microsoft-code-reference` to on-demand |
-| `05t-terraform-planner` | 379 lines | <300 | Remove HCL blocks; move HCP GUARDRAIL to `terraform-patterns/SKILL.md` |
-| `06b-bicep-codegen` | 331 lines | <300 | Defer `microsoft-code-reference`; remove patterns duplicating skills |
-| `05b-bicep-planner` | 302 lines | <280 | Remove duplicated policy table (done in Phase 2) |
-| `01-conductor` | 461 lines | <430 | Extract handoff template → `azure-artifacts/templates/00-handoff.template.md` |
-| `07b + 07t` | ~390 each | ~350 | Consolidate Known Issues into shared `iac-common` reference |
+| Agent                   | Current   | Target | Key Actions                                                                                                                                                                |
+| ----------------------- | --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
+| `06t-terraform-codegen` | 432 lines | <300   | Extract bootstrap/deploy scripts to `terraform-patterns/scripts/` (NOT `references/`); remove inline HCL duplicating skills; defer `microsoft-code-reference` to on-demand |
+| `05t-terraform-planner` | 379 lines | <300   | Remove HCL blocks; move HCP GUARDRAIL to `terraform-patterns/SKILL.md`                                                                                                     |
+| `06b-bicep-codegen`     | 331 lines | <300   | Defer `microsoft-code-reference`; remove patterns duplicating skills                                                                                                       |
+| `05b-bicep-planner`     | 302 lines | <280   | Remove duplicated policy table (done in Phase 2)                                                                                                                           |
+| `01-conductor`          | 461 lines | <430   | Extract handoff template → `azure-artifacts/templates/00-handoff.template.md`                                                                                              |
+| `07b + 07t`             | ~390 each | ~350   | Consolidate Known Issues into shared `iac-common` reference                                                                                                                |
 
 **Keep 1 compact canonical code example** per pattern (5-10 lines) inline — per GitHub Blog: "code examples over prose"
 
@@ -186,6 +197,7 @@
 
 ```markdown
 ## Boundaries
+
 - **Always**: {autonomous actions for this agent}
 - **Ask first**: {human-approval actions}
 - **Never**: {hard constraints — files not to touch, actions not to take}
@@ -193,7 +205,8 @@
 
 ### 5.3 — Surface Commands Early
 
-In all trimmed agent bodies, ensure key commands section appears immediately after the core workflow section — not buried deep.
+In all trimmed agent bodies, ensure key commands section appears
+immediately after the core workflow section — not buried deep.
 
 ### Validation
 
@@ -206,7 +219,9 @@
 
 ### Adversarial Review Gate
 
-After Phase 5: Run 2x reviews on trimmed agents, boundary definitions, command placement. Verify agent behavior preserved and three-tier boundaries are meaningful.
+After Phase 5: Run 2x reviews on trimmed agents, boundary definitions,
+command placement. Verify agent behavior preserved and three-tier
+boundaries are meaningful.
 
 ---
 
@@ -214,13 +229,14 @@
 
 **Effort**: 2 hrs | **Risk**: None
 
-Both adversarial reviews insisted on an intermediate measurement after pure context optimization, before any behavioral/architectural changes.
+Both adversarial reviews insisted on an intermediate measurement after
+pure context optimization, before any behavioral/architectural changes.
 
-| # | Action |
-|---|--------|
-| 1 | Re-run the same e2e conductor test from Phase 0 on the same project with the same prompt |
-| 2 | Parse new chat logs — measure the 3 KPIs against Phase 0 baseline |
-| 3 | Generate diff report: `npm run diff:baseline -- --baseline ctx-opt-20260302-130935` |
-| 4 | Document results in the M1 PR description |
-| 5 | **Decision gate**: If KPIs improved but not to target, M2 proceeds. If KPIs worsened, investigate regression before M2. |
-| 6 | Create M1 PR from `ctx-opt/milestone-1` → `main` |
+| #   | Action                                                                                                                  |
+| --- | ----------------------------------------------------------------------------------------------------------------------- |
+| 1   | Re-run the same e2e conductor test from Phase 0 on the same project with the same prompt                                |
+| 2   | Parse new chat logs — measure the 3 KPIs against Phase 0 baseline                                                       |
+| 3   | Generate diff report: `npm run diff:baseline -- --baseline ctx-opt-20260302-130935`                                     |
+| 4   | Document results in the M1 PR description                                                                               |
+| 5   | **Decision gate**: If KPIs improved but not to target, M2 proceeds. If KPIs worsened, investigate regression before M2. |
+| 6   | Create M1 PR from `ctx-opt/milestone-1` → `main`                                                                        |
```

#### Modified: `.github/prompts/plan-ctxopt/m2-extended-optimization.md` (+47/-43)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/prompts/plan-ctxopt/m2-extended-optimization.md	2026-03-04 06:46:56.633521576 +0000
+++ /workspaces/azure-agentic-infraops/.github/prompts/plan-ctxopt/m2-extended-optimization.md	2026-03-04 06:47:05.108657976 +0000
@@ -10,22 +10,24 @@
 
 **Effort**: 4-5 hrs | **Addresses**: Principle 7 + 10 gaps | **Risk**: Low
 
-Both adversarial reviews said "build validators with their changes." By Phase 7, all structural changes from M1 are merged — we now know the exact rules to enforce.
-
-| # | Validator | Rule | Remediation Message |
-|---|-----------|------|---------------------|
-| 1 | `validate-skill-size.mjs` | SKILL.md > 200 lines requires `references/` dir | `🔧 Fix: Move detailed content to references/ subdirectory` |
-| 2 | `validate-agent-body-size.mjs` | Agent body > 350 lines | `🔧 Fix: Extract inline code blocks to skill references/ or scripts/` |
-| 3 | `validate-glob-audit.mjs` | Warn on `applyTo: "**"` for instructions > 50 lines | `🔧 Fix: Narrow glob to specific file extensions` |
-| 4 | `validate-skill-references.mjs` | Every `references/` file mentioned in SKILL.md; no orphans; every path resolves | `🔧 Fix: Add loading directive in SKILL.md or remove orphaned file` |
-| 5 | `validate-orphaned-content.mjs` | Detect unreferenced skills, dead references, unused instructions | `🔧 Fix: Add reference or delete unused file` |
+Both adversarial reviews said "build validators with their changes."
+By Phase 7, all structural changes from M1 are merged — we now know
+the exact rules to enforce.
+
+| #   | Validator                       | Rule                                        | Remediation                      |
+| --- | ------------------------------- | ------------------------------------------- | -------------------------------- |
+| 1   | `validate-skill-size.mjs`       | SKILL.md >200 lines needs `references/`     | Move content to `references/`    |
+| 2   | `validate-agent-body-size.mjs`  | Agent body >350 lines                       | Extract to skill refs or scripts |
+| 3   | `validate-glob-audit.mjs`       | Warn `applyTo: "**"` if >50 lines           | Narrow glob to extensions        |
+| 4   | `validate-skill-references.mjs` | All `references/` paths resolve; no orphans | Add directive or remove file     |
+| 5   | `validate-orphaned-content.mjs` | Detect unreferenced skills/instructions     | Add reference or delete          |
 
 Additional:
 
-| # | Action |
-|---|--------|
-| 6 | Add all 5 validators to `validate:all` in `package.json` |
-| 7 | Add `lint:docs-freshness` to `validate:all` (currently excluded) |
+| #   | Action                                                           |
+| --- | ---------------------------------------------------------------- |
+| 6   | Add all 5 validators to `validate:all` in `package.json`         |
+| 7   | Add `lint:docs-freshness` to `validate:all` (currently excluded) |
 
 ### Validation
 
@@ -41,21 +43,21 @@
 
 ### Prioritization
 
-| Priority | Skill | Lines | Load Frequency | Action |
-|----------|-------|-------|----------------|--------|
-| **High** | `session-resume` | 345 | Every agent (10+) | Split → ≤80 lines + `references/recovery-protocol.md` |
-| **High** | `terraform-patterns` | 510 | 2 agents but large | Split → ≤100 lines + `references/` per pattern |
-| **High** | `azure-bicep-patterns` | 305 | 2 agents | Split → ≤100 lines + `references/` per pattern |
-| **Medium** | `azure-troubleshooting` | 271 | 1 agent | Split KQL templates to `references/` |
-| **Medium** | `azure-diagrams` | 551 | 3 agents | Already has references/; trim SKILL.md to ≤150 |
-| **Low** | `github-operations` | 306 | On-demand | Defer |
-| **Low** | `azure-adr` | 263 | 1 agent | Defer |
-| **Low** | `make-skill-template` | 262 | Utility | Defer |
-| **Low** | `microsoft-skill-creator` | 231 | Utility | Defer |
-| **Skip** | `golden-principles` | 122 | Compact enough | No split needed |
-| **Skip** | `git-commit` | 129 | Compact enough | No split needed |
-| **Skip** | `microsoft-code-reference` | 82 | Compact enough | No split needed |
-| **Skip** | `microsoft-docs` | 59 | Compact enough | No split needed |
+| Priority   | Skill                      | Lines | Load Frequency     | Action                                                |
+| ---------- | -------------------------- | ----- | ------------------ | ----------------------------------------------------- |
+| **High**   | `session-resume`           | 345   | Every agent (10+)  | Split → ≤80 lines + `references/recovery-protocol.md` |
+| **High**   | `terraform-patterns`       | 510   | 2 agents but large | Split → ≤100 lines + `references/` per pattern        |
+| **High**   | `azure-bicep-patterns`     | 305   | 2 agents           | Split → ≤100 lines + `references/` per pattern        |
+| **Medium** | `azure-troubleshooting`    | 271   | 1 agent            | Split KQL templates to `references/`                  |
+| **Medium** | `azure-diagrams`           | 551   | 3 agents           | Already has references/; trim SKILL.md to ≤150        |
+| **Low**    | `github-operations`        | 306   | On-demand          | Defer                                                 |
+| **Low**    | `azure-adr`                | 263   | 1 agent            | Defer                                                 |
+| **Low**    | `make-skill-template`      | 262   | Utility            | Defer                                                 |
+| **Low**    | `microsoft-skill-creator`  | 231   | Utility            | Defer                                                 |
+| **Skip**   | `golden-principles`        | 122   | Compact enough     | No split needed                                       |
+| **Skip**   | `git-commit`               | 129   | Compact enough     | No split needed                                       |
+| **Skip**   | `microsoft-code-reference` | 82    | Compact enough     | No split needed                                       |
+| **Skip**   | `microsoft-docs`           | 59    | Compact enough     | No split needed                                       |
 
 While splitting each skill, also update its `description` frontmatter for trigger optimization per Phase 1 pattern.
 
@@ -74,34 +76,34 @@
 
 ### 9.1 — Restructure Challenger Review Subagent
 
-| Current | Target | Actions |
-|---------|--------|---------|
+| Current       | Target     | Actions                                                                                                       |
+| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
 | 315-line body | <100 lines | Split 70-line checklist into per-artifact `references/` files; use progressive-loaded quick-refs from Phase 1 |
 
 ### 9.2 — Golden Principles Integration
 
-| Agent | Change |
-|-------|--------|
-| `01-conductor` | Make `golden-principles/SKILL.md` a mandatory first-read |
+| Agent                        | Change                                                   |
+| ---------------------------- | -------------------------------------------------------- |
+| `01-conductor`               | Make `golden-principles/SKILL.md` a mandatory first-read |
 | `challenger-review-subagent` | Make `golden-principles/SKILL.md` a mandatory first-read |
 
 ### 9.3 — Create `iac-common` Skill
 
 **Hard cap: 150 lines** (enforced by Phase 7 validator). Content:
 
-| Content | Source |
-|---------|--------|
-| Azure CLI auth validation | Extracted from 07b, 07t in Phase 2 |
-| Deploy patterns shared between Bicep and Terraform | Consolidated from 07b, 07t |
-| Known Issues table | Consolidated from 07b, 07t |
-| Governance-to-code property mapping reference | New cross-cutting content |
+| Content                                            | Source                             |
+| -------------------------------------------------- | ---------------------------------- |
+| Azure CLI auth validation                          | Extracted from 07b, 07t in Phase 2 |
+| Deploy patterns shared between Bicep and Terraform | Consolidated from 07b, 07t         |
+| Known Issues table                                 | Consolidated from 07b, 07t         |
+| Governance-to-code property mapping reference      | New cross-cutting content          |
 
 ### 9.4 — Address Review Subagents with Baked-In Knowledge
 
-| Subagent | Current | Target | Action |
-|----------|---------|--------|--------|
-| `bicep-review-subagent` | 226 lines | ≤150 | Extract AVM standards, naming, security → reference `azure-defaults` quick-ref + `iac-common` |
-| `terraform-review-subagent` | 237 lines | ≤150 | Same pattern |
+| Subagent                    | Current   | Target | Action                                                                                        |
+| --------------------------- | --------- | ------ | --------------------------------------------------------------------------------------------- |
+| `bicep-review-subagent`     | 226 lines | ≤150   | Extract AVM standards, naming, security → reference `azure-defaults` quick-ref + `iac-common` |
+| `terraform-review-subagent` | 237 lines | ≤150   | Same pattern                                                                                  |
 
 ### Validation + Measurement
 
@@ -115,4 +117,6 @@
 
 ### Adversarial Review Gate
 
-After Phase 9: Run 2x reviews on iac-common skill, challenger restructure, golden-principles integration. Verify shared content is complete and no maintenance gaps created.
+After Phase 9: Run 2x reviews on iac-common skill, challenger
+restructure, golden-principles integration. Verify shared content is
+complete and no maintenance gaps created.
```

#### Modified: `.github/prompts/plan-ctxopt/m3-new-capabilities.md` (+27/-23)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/prompts/plan-ctxopt/m3-new-capabilities.md	2026-03-04 06:46:56.633521576 +0000
+++ /workspaces/azure-agentic-infraops/.github/prompts/plan-ctxopt/m3-new-capabilities.md	2026-03-04 06:47:05.108657976 +0000
@@ -12,22 +12,23 @@
 
 ### 10.1 — Challenger Model Change
 
-| Current Model | Target Model | Required Before Shipping |
-|------|------|------|
+| Current Model | Target Model      | Required Before Shipping                           |
+| ------------- | ----------------- | -------------------------------------------------- |
 | GPT-5.3-Codex | Claude Sonnet 4.6 | Controlled A/B comparison on one existing artifact |
 
-- Apply tiered approach: Sonnet for 3-pass rotating-lens reviews (Steps 2, 4, 5); evaluate whether single-pass reviews (Steps 1, 6) also benefit
+- Apply tiered approach: Sonnet for 3-pass rotating-lens reviews
+  (Steps 2, 4, 5); evaluate for single-pass reviews (Steps 1, 6)
 - Document model selection rationale in the agent's frontmatter
 
 ### 10.2 — Complexity-Based Fast Path
 
-| Component | Action |
-|-----------|--------|
-| Requirements output | Add `complexity: simple \| standard \| complex` field |
-| Threshold criteria | `simple` = ≤3 resources, no custom policies, single environment; `standard` = 4-20 resources; `complex` = 20+ resources or PCI-DSS/compliance |
-| Implementation | **Separate experimental conductor** (`01-conductor-fastpath.agent.md`) initially — NOT inline in main Conductor |
-| Simple path | 1-pass comprehensive review, skip governance discovery, combine Plan+Code |
-| Promotion | After validation, merge approach into main Conductor |
+| Component           | Action                                                                                                          |
+| ------------------- | --------------------------------------------------------------------------------------------------------------- |
+| Requirements output | Add `complexity: simple \| standard \| complex` field                                                           |
+| Threshold criteria  | `simple` ≤3 resources, no custom policies, single env; `standard` 4-20; `complex` 20+ or PCI-DSS                |
+| Implementation      | **Separate experimental conductor** (`01-conductor-fastpath.agent.md`) initially — NOT inline in main Conductor |
+| Simple path         | 1-pass comprehensive review, skip governance discovery, combine Plan+Code                                       |
+| Promotion           | After validation, merge approach into main Conductor                                                            |
 
 ### Validation
 
@@ -35,7 +36,9 @@
 
 ### Adversarial Review Gate
 
-After Phase 10: Run 2x reviews on experimental conductor and model comparison results. Verify fast path doesn't break normal path and model quality is demonstrated.
+After Phase 10: Run 2x reviews on experimental conductor and model
+comparison results. Verify fast path doesn't break normal path and
+model quality is demonstrated.
 
 ---
 
@@ -43,12 +46,12 @@
 
 **Effort**: 3-4 hrs | **Risk**: Low
 
-| # | Action |
-|---|--------|
-| 1 | Add `lint:docs-freshness` to weekly GitHub Actions cron → opens issue when staleness detected |
-| 2 | Create quarterly context audit cadence: checklist/script that re-runs the context optimizer skill every 3 months |
-| 3 | Extend `check-docs-freshness.mjs` to cover skills and `references/` files |
-| 4 | Fix any remaining phantom references found by `validate-orphaned-content.mjs` |
+| #   | Action                                                                                                           |
+| --- | ---------------------------------------------------------------------------------------------------------------- |
+| 1   | Add `lint:docs-freshness` to weekly GitHub Actions cron → opens issue when staleness detected                    |
+| 2   | Create quarterly context audit cadence: checklist/script that re-runs the context optimizer skill every 3 months |
+| 3   | Extend `check-docs-freshness.mjs` to cover skills and `references/` files                                        |
+| 4   | Fix any remaining phantom references found by `validate-orphaned-content.mjs`                                    |
 
 ---
 
@@ -56,10 +59,10 @@
 
 **Effort**: 2 hrs | **Risk**: None
 
-| # | Action |
-|---|--------|
-| 1 | Re-run full e2e conductor test |
-| 2 | Compare all KPI measurements: Phase 0 baseline → M1 → M2 → M3 |
-| 3 | Generate final diff report |
-| 4 | Create M3 PR from `ctx-opt/milestone-3` → `main` with measurement comparison table |
-| 5 | Update `QUALITY_SCORE.md` to reflect improvements |
+| #   | Action                                                                             |
+| --- | ---------------------------------------------------------------------------------- |
+| 1   | Re-run full e2e conductor test                                                     |
+| 2   | Compare all KPI measurements: Phase 0 baseline → M1 → M2 → M3                      |
+| 3   | Generate final diff report                                                         |
+| 4   | Create M3 PR from `ctx-opt/milestone-3` → `main` with measurement comparison table |
+| 5   | Update `QUALITY_SCORE.md` to reflect improvements                                  |
```

#### Added: `.github/prompts/plan-ctxopt/m2-a-ci-enforcement.md` (+38 lines)

#### Added: `.github/prompts/plan-ctxopt/m2-b-skill-splits.md` (+52 lines)

#### Added: `.github/prompts/plan-ctxopt/m2-c-subagent-overhaul.md` (+66 lines)

#### Added: `.github/prompts/plan-ctxopt/m3-a-challenger-fastpath.md` (+43 lines)

#### Added: `.github/prompts/plan-ctxopt/m3-b-doc-gardening.md` (+34 lines)

#### Added: `.github/prompts/plan-ctxopt/m3-c-final-measurement.md` (+28 lines)

### Skills

#### Modified: `.github/skills/azure-adr/SKILL.md` (+4/-1)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-adr/SKILL.md	2026-03-04 06:46:56.646402087 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-adr/SKILL.md	2026-03-04 06:47:05.108657976 +0000
@@ -1,6 +1,9 @@
 ---
 name: azure-adr
-description: Creates Azure Architecture Decision Records (ADRs) with WAF mapping, alternatives, consequences, and implementation guidance; use for architecture decision documentation requests.
+description: >-
+  Creates Azure Architecture Decision Records with WAF mapping, alternatives, and consequences.
+  USE FOR: ADR creation, architecture decisions, trade-off analysis, WAF pillar justification.
+  DO NOT USE FOR: Bicep/Terraform code generation, diagram creation, cost estimates.
 compatibility: Works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool; no external dependencies required.
 license: MIT
 metadata:
```

#### Modified: `.github/skills/azure-artifacts/SKILL.md` (+48/-414)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-artifacts/SKILL.md	2026-03-04 06:46:56.650695590 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-artifacts/SKILL.md	2026-03-04 06:47:05.108657976 +0000
@@ -1,613 +1,102 @@
 ---
 name: azure-artifacts
-description: Defines canonical artifact templates, H2 structures, and documentation styling rules for agent outputs (Steps 1-7); use for artifact generation, formatting, and template compliance.
+description: >-
+  Artifact template structures, H2 compliance rules, and documentation styling
+  for agent outputs (Steps 1-7).
+  USE FOR: generating any agent artifact, checking H2 structure compliance.
+  DO NOT USE FOR: Azure resource configuration (use azure-defaults),
+  Bicep/Terraform patterns (use bicep-patterns or terraform-patterns).
 compatibility: Works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool.
 license: MIT
 metadata:
   author: jonathan-vella
-  version: "1.0"
+  version: "2.0"
   category: workflow-automation
 ---
 
 # Azure Artifacts Skill
 
-Single source of truth for all artifact template structures and documentation styling.
-Replaces individual template file lookups with embedded H2 definitions.
+Single source of truth for artifact template structures and styling.
+Per-step H2 definitions live in `references/` — load only the step
+you are generating.
 
 ---
 
 ## Artifact Generation Rules
 
-> [!NOTE]
-> This skill is the SINGLE SOURCE OF TRUTH for artifact H2 headings and templates.
-> The similar section in `azure-defaults/SKILL.md` defers to this skill for template compliance.
-
 ### Mandatory Compliance
 
-| Rule                  | Requirement                                                    |
-| --------------------- | -------------------------------------------------------------- |
-| **Template skeleton** | Read `.template.md` file and replicate its structure           |
-| **Exact text**        | Use H2 text from this skill verbatim                           |
-| **Exact order**       | Required H2s appear in the order listed below                  |
-| **Anchor rule**       | Extra sections allowed ONLY after last required H2             |
-| **No omissions**      | Every H2 listed must appear in output                          |
-| **Attribution**       | Include header: `> Generated by {agent} agent \| {YYYY-MM-DD}` |
+| Rule                  | Requirement                                          |
+| --------------------- | ---------------------------------------------------- |
+| **Template skeleton** | Read step template from `references/` and replicate  |
+| **Exact text**        | Use H2 text from templates verbatim                  |
+| **Exact order**       | Required H2s appear in the order listed              |
+| **Anchor rule**       | Extra sections allowed ONLY after last required H2   |
+| **No omissions**      | Every H2 listed must appear in output                |
+| **Attribution**       | `> Generated by {agent} agent \| {YYYY-MM-DD}`      |
 
 ### DO / DON'T
 
-- **DO**: Read this skill BEFORE generating any artifact
-- **DO**: Copy H2 text character-for-character (including emoji prefixes)
-- **DO**: Include `## References` section at bottom when listed
-- **DO**: Use callout styles from the Styling section below
+- **DO**: Read the step-specific template before generating
+- **DO**: Copy H2 text character-for-character (including emoji)
 - **DO**: Save all output to `agent-output/{project}/`
-- **DON'T**: Generate artifacts without checking H2 structure first
 - **DON'T**: Reorder H2 headings from the listed sequence
 - **DON'T**: Use placeholder text like "TBD" or "Insert here"
-- **DON'T**: Skip sections — empty sections are better than missing ones
 - **DON'T**: Add custom H2 sections BEFORE the last required H2
 
 ---
 
 ## Mandatory: Project README
 
-Every project in `agent-output/{project}/` **MUST** have a `README.md`.
-This is a cross-agent requirement — not owned by a single step.
+Every project in `agent-output/{project}/` **MUST** have a
+`README.md`.
 
-| Responsibility                                              | Agent                        |
-| ----------------------------------------------------------- | ---------------------------- |
-| **Create** initial README from `PROJECT-README.template.md` | Requirements (Step 1)        |
-| **Update** workflow progress after saving step artifacts    | Every step agent (Steps 2-7) |
-
-### README Update Rules (All Agents)
-
-After saving your step artifact(s), update `agent-output/{project}/README.md`:
-
-1. Mark your step as **complete** in the `## ✅ Workflow Progress` table
-2. Add your artifact files to the `## 📄 Generated Artifacts` section
-3. Update the `Last Updated` date in `## 📋 Project Summary`
-4. Update the progress bar percentage (each of the 7 steps = ~14%)
-5. If README doesn't exist (e.g., resuming a mid-workflow project), create it
-   from `PROJECT-README.template.md` and backfill completed steps
+After saving step artifact(s), update the README:
 
-Template: `.github/skills/azure-artifacts/templates/PROJECT-README.template.md`
+1. Mark your step as **complete** in `## ✅ Workflow Progress`
+2. Add artifact files to `## 📄 Generated Artifacts`
+3. Update `Last Updated` date and progress bar percentage
 
 ---
 
-## Standard Components
-
-Reusable building blocks that templates embed. Agents copy these patterns
-verbatim, replacing only `{placeholder}` values.
-
-### Badge Row
-
-Every artifact opens with a badge row immediately after the title.
-Use Shields.io static badges with `?style=for-the-badge` for visual scanning:
-
-```markdown
-![Step](https://img.shields.io/badge/Step-{n}-blue?style=for-the-badge)
-![Status](https://img.shields.io/badge/Status-{Draft|Complete}-{orange|brightgreen}?style=for-the-badge)
-![Agent](https://img.shields.io/badge/Agent-{agent--name}-purple?style=for-the-badge)
-```
-
-Badge values use `--` for hyphens (Shields.io escaping).
-The `Status` badge is `Draft|orange` on first generation and
-`Complete|brightgreen` after review.
-Agents may optionally add a fourth `Date` badge
-(`![Date](https://img.shields.io/badge/Generated-{YYYY--MM--DD}-grey?style=for-the-badge)`)
-when generating final artifacts.
-
-### Collapsible Table of Contents
-
-Include in every artifact after the badge row using `<details open>`
-so the TOC is expanded by default. Use a contextual label that matches
-the artifact type (not a generic "Table of Contents"):
-
-```markdown
-<details open>
-<summary><strong>📑 {Contextual Label}</strong></summary>
-
-- Section Name (#section-name)
-- Section Name (#section-name)
-<!-- auto-generate from H2 headings -->
-
-</details>
-```
-
-**Contextual label examples:**
-
-| Artifact Type          | Label                       |
-| ---------------------- | --------------------------- |
-| 01-requirements        | 📑 Requirements Overview    |
-| 02-architecture        | 📑 Assessment Contents      |
-| 03-des-cost-estimate   | 📑 Cost Estimate Contents   |
-| 04-implementation-plan | 📑 Implementation Contents  |
-| 04-governance          | 📑 Governance Contents      |
-| 04-preflight-check     | 📑 Pre-Flight Contents      |
-| 05-implementation-ref  | 📑 Implementation Reference |
-| 06-deployment          | 📑 Deployment Contents      |
-| 07-documentation-index | 📑 Documentation Contents   |
-| 07-design-document     | 📑 Design Contents          |
-| 07-operations-runbook  | 📑 Runbook Contents         |
-| 07-resource-inventory  | 📑 Inventory Contents       |
-| 07-backup-dr-plan      | 📑 DR Plan Contents         |
-| 07-compliance-matrix   | 📑 Compliance Contents      |
-| 07-ab-cost-estimate    | 📑 As-Built Cost Contents   |
-
-### Attribution Header
-
-Appears immediately after the TOC:
-
-```markdown
-> Generated by {agent} agent | {YYYY-MM-DD}
-```
-
-### Cross-Navigation
-
-Every artifact includes header and footer navigation links
-to adjacent workflow steps:
-
-**Header** (after attribution):
-
-```markdown
-| ⬅️ Previous     | 📑 Index  | Next ➡️         |
-| --------------- | --------- | --------------- |
-| {prev-filename} | README.md | {next-filename} |
-```
-
-**Footer** (before References or at document end):
-
-Wrap the footer navigation in a centered `<div>` for consistent alignment:
-
-```markdown
----
-
-<div align="center">
-
-| ⬅️ {prev-step-name} ({prev-filename}) | 🏠 Project Index (README.md) | ➡️ {next-step-name} ({next-filename}) |
-| ------------------------------------- | ---------------------------- | ------------------------------------- |
-
-</div>
-```
-
-For the first artifact (01), omit the Previous link.
-For the last artifact (07), omit the Next link.
-
-### Placeholder Syntax
+## Placeholder Syntax
 
 All templates use single-brace `{placeholder-name}` syntax:
 
 - Lowercase, hyphen-separated: `{project-name}`, `{monthly-cost}`
 - No Mustache/Handlebars `{{double-braces}}`
-- No conditional blocks — use HTML comments for optional sections:
-  `<!-- If {condition} -->...<!-- End {condition} -->`
-
-### Collapsible Detail Blocks
-
-Use for content exceeding 10 table rows, lengthy code, or
-reference material:
-
-```markdown
-<details>
-<summary>📋 {Section Title}</summary>
-
-| Column | Column |
-| ------ | ------ |
-| ...    | ...    |
-
-</details>
-```
-
-Always include a blank line after `<summary>` and before `</details>`.
 
 ---
 
-## Template H2 Structures
-
-### 01-requirements.md (Requirements Agent)
-
-```text
-## 🎯 Project Overview
-## 🚀 Functional Requirements
-## ⚡ Non-Functional Requirements (NFRs)
-## 🔒 Compliance & Security Requirements
-## 💰 Budget
-## 🔧 Operational Requirements
-## 🌍 Regional Preferences
-## 📋 Summary for Architecture Assessment
-## References
-```
-
-### 02-architecture-assessment.md (Architect Agent)
-
-```text
-## ✅ Requirements Validation
-## 💎 Executive Summary
-## 🏛️ WAF Pillar Assessment
-## 📦 Resource SKU Recommendations
-## 🎯 Architecture Decision Summary
-## 🚀 Implementation Handoff
-## 🔒 Approval Gate
-## References
-```
-
-### 03-des-cost-estimate.md (Architect Agent)
-
-```text
-## 💵 Cost At-a-Glance
-## ✅ Decision Summary
-## 🔁 Requirements → Cost Mapping
-## 📊 Top 5 Cost Drivers
-## 🏛️ Architecture Overview
-## 🧾 What We Are Not Paying For (Yet)
-## ⚠️ Cost Risk Indicators
-## 🎯 Quick Decision Matrix
-## 💰 Savings Opportunities
-## 🧾 Detailed Cost Breakdown
-## References
-```
-
-### 04-governance-constraints.md (Bicep Plan Agent)
-
-```text
-## 🔍 Discovery Source
-## 📋 Azure Policy Compliance
-## 🔄 Plan Adaptations Based on Policies
-## 🚫 Deployment Blockers
-## 🏷️ Required Tags
-## 🔐 Security Policies
-## 💰 Cost Policies
-## 🌐 Network Policies
-## References
-```
-
-### 04-implementation-plan.md (Bicep Plan Agent)
-
-```text
-## 📋 Overview
-## 📦 Resource Inventory
-## 🗂️ Module Structure
-## 🔨 Implementation Tasks
-## 🚀 Deployment Phases
-## 🔗 Dependency Graph
-## 🔄 Runtime Flow Diagram
-## 🏷️ Naming Conventions
-## 🔐 Security Configuration
-## ⏱️ Estimated Implementation Time
-## 🔒 Approval Gate
-## References
-```
-
-### 04-preflight-check.md (Bicep Code Agent)
-
-```text
-## 🎯 Purpose
-## ✅ AVM Schema Validation Results
-## 🔎 Parameter Type Analysis
-## 🌍 Region Limitations Identified
-## ⚠️ Pitfalls Checklist
-## 🚀 Ready for Implementation
-```
-
-### 05-implementation-reference.md (Bicep Code Agent)
-
-```text
-## 📁 IaC Templates Location
-## 🗂️ File Structure
-## ✅ Validation Status
-## 🏗️ Resources Created
-## 🚀 Deployment Instructions
-## 📝 Key Implementation Notes
-```
-
-### 06-deployment-summary.md (Deploy Agent)
-
-```text
-## ✅ Preflight Validation
-## 📋 Deployment Details
-## 🏗️ Deployed Resources
-## 📤 Outputs (Expected)
-## 🚀 To Actually Deploy
-## 📝 Post-Deployment Tasks
-## References
-```
-
-### 07-documentation-index.md
-
-```text
-## 📦 1. Document Package Contents
-## 📚 2. Source Artifacts
-## 📋 3. Project Summary
-## 🔗 4. Related Resources
-## ⚡ 5. Quick Links
-```
-
-### 07-design-document.md
-
-```text
-## 📝 1. Introduction
-## 🏛️ 2. Azure Architecture Overview
-## 🌐 3. Networking
-## 💾 4. Storage
-## 💻 5. Compute
-## 👤 6. Identity & Access
-## 🔐 7. Security & Compliance
-## 🔄 8. Backup & Disaster Recovery
-## 📊 9. Management & Monitoring
-## 📎 10. Appendix
-## References
-```
-
-### 07-operations-runbook.md
-
-```text
-## ⚡ Quick Reference
-## 📋 1. Daily Operations
-## 🚨 2. Incident Response
-## 🔧 3. Common Procedures
-## 🕐 4. Maintenance Windows
-## 📞 5. Contacts & Escalation
-## 📝 6. Change Log
-## References
-```
-
-### 07-resource-inventory.md
-
-```text
-## 📊 Summary
-## 📦 Resource Listing
-## References
-```
-
-### 07-ab-cost-estimate.md
-
-```text
-## 💵 Cost At-a-Glance
-## ✅ Decision Summary
-## 🔁 Requirements → Cost Mapping
-## 📊 Top 5 Cost Drivers
-## 🏛️ Architecture Overview
-## 🧾 What We Are Not Paying For (Yet)
-## ⚠️ Cost Risk Indicators
-## 🎯 Quick Decision Matrix
-## 💰 Savings Opportunities
-## 🧾 Detailed Cost Breakdown
-## References
-```
-
-### 07-backup-dr-plan.md
-
-```text
-## 📋 Executive Summary
-## 🎯 1. Recovery Objectives
-## 💾 2. Backup Strategy
-## 🌍 3. Disaster Recovery Procedures
-## 🧪 4. Testing Schedule
-## 📢 5. Communication Plan
-## 👥 6. Roles and Responsibilities
-## 🔗 7. Dependencies
-## 📖 8. Recovery Runbooks
-## 📎 9. Appendix
-## References
-```
-
-### 07-compliance-matrix.md
-
-```text
-## 📋 Executive Summary
-## 🗺️ 1. Control Mapping
-## 🔍 2. Gap Analysis
-## 📁 3. Evidence Collection
-## 📝 4. Audit Trail
-## 🔧 5. Remediation Tracker
-## 📎 6. Appendix
-## References
-```
-
-### PROJECT-README.md
-
-```text
-## Template Instructions
-## Required Structure
-## 📋 Project Summary
-## ✅ Workflow Progress
-## 🏛️ Architecture
-## 📄 Generated Artifacts
-## 🔗 Related Resources
-```
-
----
-
-## Step 7: Workload Documentation Generation
-
-### When to Generate
-
-| Trigger                           | Action                               |
-| --------------------------------- | ------------------------------------ |
-| After Step 6 (Deploy)             | Generate full documentation package  |
-| "Generate workload documentation" | Create all 7 document types          |
-| "Document the deployment"         | Synthesize from deployment artifacts |
-| "Create operations runbook"       | Generate specific document           |
-| Conductor handoff                 | Auto-generate post-deployment docs   |
-
-### Output Files (Step 7)
-
-| File                        | Purpose                       | Required |
-| --------------------------- | ----------------------------- | -------- |
-| `07-documentation-index.md` | Master index linking all docs | Yes      |
-| `07-design-document.md`     | 10-section technical design   | Yes      |
-| `07-operations-runbook.md`  | Day-2 operational procedures  | Yes      |
-| `07-resource-inventory.md`  | Complete resource listing     | Yes      |
-| `07-ab-cost-estimate.md`    | As-built cost analysis        | Yes      |
-| `07-compliance-matrix.md`   | Security control mapping      | Optional |
-| `07-backup-dr-plan.md`      | Disaster recovery procedures  | Optional |
-
-### Source Artifacts for Step 7
-
-| Source                          | Information Extracted              |
-| ------------------------------- | ---------------------------------- |
-| `01-requirements.md`            | Business context, NFRs, compliance |
-| `02-architecture-assessment.md` | WAF scores, SKU recommendations    |
-| `04-implementation-plan.md`     | Resource inventory, dependencies   |
-| `06-deployment-summary.md`      | Deployed resources, outputs        |
-| `infra/bicep/{project}/`        | Actual Bicep configuration values  |
-
-### Generation Workflow
-
-1. **Gather Context** — Read project artifacts (01-06) and Bicep templates
-2. **Check H2 Structures** — Reference the template sections above
-3. **Extract Resources** — Parse deployed resources from `06-deployment-summary.md`
-4. **Query Pricing** — Use Azure Pricing MCP for cost estimates (if available)
-5. **Generate Documents** — Create each document following H2 structure exactly
-6. **Cross-Reference** — Ensure consistency across all documents
-7. **Create Index** — Generate `07-documentation-index.md` linking all documents
-
-### Step 7 DO / DON'T
-
-- **DO**: Read ALL source artifacts before generating
-- **DO**: Use actual SKU names and config from Bicep, not placeholders
-- **DO**: Include specific Azure CLI/PowerShell commands in runbooks
-- **DO**: Map compliance controls to actual resource configurations
-- **DO**: Calculate costs from deployed SKUs, not estimates
-- **DON'T**: Generate docs without reading source artifacts
-- **DON'T**: Create generic runbooks without project-specific commands
-- **DON'T**: Skip required documents (index, design, runbook, inventory, cost)
-- **DON'T**: Generate cost estimates without checking actual SKUs
-
-### What This Skill Does NOT Do
-
-- Generate Bicep or Terraform code (use bicep-code agent)
-- Create architecture diagrams (use azure-diagrams skill)
-- Deploy resources (use deploy agent)
-- Create ADRs (use azure-adr skill)
-- Perform WAF assessments (use architect agent)
-
----
-
-## Documentation Styling Standards
-
-### Callout Styles
-
-```markdown
-> [!NOTE]
-> Informational — background context, tips, FYI
-
-> [!TIP]
-> Best practice recommendation or optimization
-
-> [!IMPORTANT]
-> Critical configuration that must not be overlooked
-
-> [!WARNING]
-> Security concern, reliability risk, potential issue
-
-> [!CAUTION]
-> Data loss risk, breaking change, irreversible action
-```
-
-### Status Emoji
-
-| Purpose           | Emoji | Example                      |
-| ----------------- | ----- | ---------------------------- |
-| Success/Complete  | ✅    | `✅ Health check passed`     |
-| Warning/Attention | ⚠️    | `⚠️ Requires manual config`  |
-| Error/Critical    | ❌    | `❌ Validation failed`       |
-| Info/Tip          | 💡    | `💡 Consider Premium tier`   |
-| Security          | 🔐    | `🔐 Requires Key Vault`      |
-| Cost              | 💰    | `💰 Estimated: $50/month`    |
-| Reference         | 📚    | `📚 See: Microsoft Learn`    |
-| Time              | ⏰    | `⏰ Runs daily at 02:00 UTC` |
-| Pending           | ⏳    | `⏳ Awaiting approval`       |
-
-### Category Icons
-
-| Category   | Icon | Usage                         |
-| ---------- | ---- | ----------------------------- |
-| Compute    | 💻   | `### 💻 Compute Resources`    |
-| Data       | 💾   | `### 💾 Data Services`        |
-| Networking | 🌐   | `### 🌐 Networking Resources` |
-| Messaging  | 📨   | `### 📨 Messaging Resources`  |
-| Security   | 🔐   | `### 🔐 Security Resources`   |
-| Monitoring | 📊   | `### 📊 Monitoring Resources` |
-| Identity   | 👤   | `### 👤 Identity & Access`    |
-| Storage    | 📦   | `### 📦 Storage Resources`    |
-
-### WAF Pillar Icons
-
-| Pillar      | Icon |
-| ----------- | ---- |
-| Security    | 🔒   |
-| Reliability | 🔄   |
-| Performance | ⚡   |
-| Cost        | 💰   |
-| Operations  | 🔧   |
-
-### Collapsible Sections
-
-Use for lengthy content (>10 rows, reference material, code examples):
-
-```markdown
-<details>
-<summary>📋 Detailed Configuration</summary>
-
-| Setting | Value |
-| ------- | ----- |
-| ...     | ...   |
-
-</details>
-```
-
-### References Section (Required on Most Artifacts)
-
-```markdown
----
-
-## References
-
-> [!NOTE]
-> 📚 The following Microsoft Learn resources provide additional guidance.
+## Automated Validation
 
-| Topic      | Link                                            |
-| ---------- | ----------------------------------------------- |
-| Topic Name | [Display Text](https://learn.microsoft.com/...) |
+```bash
+npm run lint:artifact-templates   # H2 order and required headings
+npm run lint:h2-sync              # Template ↔ artifact sync
+npm run validate:all              # All validators together
 ```
 
-### Common Reference Links
-
-| Topic                    | URL                                                                                      |
-| ------------------------ | ---------------------------------------------------------------------------------------- |
-| WAF Overview             | `https://learn.microsoft.com/azure/well-architected/`                                    |
-| Security Checklist       | `https://learn.microsoft.com/azure/well-architected/security/checklist`                  |
-| Reliability Checklist    | `https://learn.microsoft.com/azure/well-architected/reliability/checklist`               |
-| Cost Optimization        | `https://learn.microsoft.com/azure/well-architected/cost-optimization/checklist`         |
-| Azure Backup             | `https://learn.microsoft.com/azure/backup/backup-best-practices`                         |
-| Azure Monitor            | `https://learn.microsoft.com/azure/azure-monitor/overview`                               |
-| Managed Identities       | `https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview` |
-| Key Vault Practices      | `https://learn.microsoft.com/azure/key-vault/general/best-practices`                     |
-| Azure Pricing Calculator | `https://azure.microsoft.com/pricing/calculator/`                                        |
-
 ---
 
-## Automated Validation
-
-Templates and generated artifacts are validated by the unified validator in `scripts/`:
-
-| Script                            | Scope                                                                                                                           | npm Command                       |
-| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
-| `validate-artifact-templates.mjs` | All 16 artifact types — H2 order, required headings, strictness, and required diagram/chart artifact checks (non-Mermaid-first) | `npm run lint:artifact-templates` |
+## Quality Checklist
 
-Run `npm run validate:all` to execute all validators together.
+- [ ] H2 headings match template exactly (text + order)
+- [ ] Attribution header present with agent name and date
+- [ ] No placeholder text ("TBD", "Insert here", "TODO")
+- [ ] File saved to `agent-output/{project}/` with correct name
 
 ---
 
-## Quality Checklist
+## Reference Index
 
-Before finalizing any artifact:
+When generating a Step N artifact, read the corresponding template:
 
-- [ ] H2 headings match this skill's template exactly (text + order)
-- [ ] Attribution header present with agent name and date
-- [ ] No placeholder text ("TBD", "Insert here", "TODO")
-- [ ] Callout styles used for emphasis (not bold text alone)
-- [ ] Status emoji consistent with the table above
-- [ ] References section included (when template specifies it)
-- [ ] Collapsible sections used for tables >10 rows
-- [ ] File saved to `agent-output/{project}/` with correct filename
+| Reference | When to Load |
+| --------- | ------------ |
+| `references/01-requirements-template.md` | Generating Step 1 requirements |
+| `references/02-architecture-template.md` | Generating Step 2 assessment or Step 3 cost estimate |
+| `references/04-plan-template.md` | Generating Step 4 plan, governance, or preflight |
+| `references/05-code-template.md` | Generating Step 5 implementation reference |
+| `references/06-deploy-template.md` | Generating Step 6 deployment summary |
+| `references/07-docs-template.md` | Generating Step 7 workload documentation |
+| `references/styling-standards.md` | Applying callouts, badges, emoji, navigation |
```

#### Modified: `.github/skills/azure-artifacts/templates/01-requirements.template.md` (+10/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-artifacts/templates/01-requirements.template.md	2026-03-04 06:46:56.646402087 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-artifacts/templates/01-requirements.template.md	2026-03-04 15:16:41.318204203 +0000
@@ -14,6 +14,7 @@
 - [💰 Budget](#-budget)
 - [🔧 Operational Requirements](#-operational-requirements)
 - [🌍 Regional Preferences](#-regional-preferences)
+- [📊 Complexity Classification](#-complexity-classification)
 - [📋 Summary for Architecture Assessment](#-summary-for-architecture-assessment)
 - [References](#references)
 
@@ -272,6 +273,18 @@
 
 ---
 
+## 📊 Complexity Classification
+
+| Field      | Value                                                |
+| ---------- | ---------------------------------------------------- |
+| Complexity | `simple` / `standard` / `complex`                    |
+| Criteria   | simple: ≤3 resources, no custom policies, single env |
+|            | standard: 4-20 resources                             |
+|            | complex: 20+ resources or PCI-DSS/SOC2 compliance    |
+| Rationale  | {explain why this classification was chosen}         |
+
+---
+
 ## 📋 Summary for Architecture Assessment
 
 ### Handoff Summary
```

#### Modified: `.github/skills/azure-bicep-patterns/SKILL.md` (+38/-198)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-bicep-patterns/SKILL.md	2026-03-04 06:46:56.650695590 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-bicep-patterns/SKILL.md	2026-03-04 08:01:16.433878343 +0000
@@ -1,304 +1,78 @@
 ---
 name: azure-bicep-patterns
-description: Common Azure Bicep infrastructure patterns including hub-spoke networking, private endpoints, diagnostic settings, conditional deployments, and AVM module composition. Use when designing or generating Bicep templates that combine multiple Azure resources into repeatable patterns.
+description: >-
+  Reusable Azure Bicep patterns: hub-spoke, private endpoints, diagnostics, AVM composition.
+  USE FOR: Bicep template design, hub-spoke networking, private endpoint patterns, AVM modules.
+  DO NOT USE FOR: Terraform code, architecture decisions, troubleshooting, diagram generation.
 compatibility: Requires Azure CLI with Bicep extension
 ---
 
 # Azure Bicep Patterns Skill
 
-Reusable infrastructure patterns for Azure Bicep templates. These patterns complement
-the `bicep-code-best-practices.instructions.md` (style rules) and `azure-defaults`
-skill (naming, tags, regions) with composable architecture building blocks.
+Reusable infrastructure patterns for Azure Bicep templates. Complements
+`bicep-code-best-practices.instructions.md` (style) and `azure-defaults` skill (naming, tags, regions).
 
 ---
 
 ## Quick Reference
 
-| Pattern                  | When to Use                                     |
-| ------------------------ | ----------------------------------------------- |
-| Hub-Spoke Networking     | Multi-workload environments with shared services |
-| Private Endpoint Wiring  | Any PaaS service requiring private connectivity  |
-| Diagnostic Settings      | Every deployed resource (mandatory)              |
-| Conditional Deployment   | Optional resources controlled by parameters      |
-| Module Composition       | Breaking main.bicep into reusable modules        |
-| Managed Identity Binding | Any service-to-service authentication            |
-| What-If Interpretation   | Pre-deployment validation                        |
+| Pattern                  | When to Use                                      | Reference                                                          |
+| ------------------------ | ------------------------------------------------ | ------------------------------------------------------------------ |
+| Hub-Spoke Networking     | Multi-workload environments with shared services | [hub-spoke-pattern](references/hub-spoke-pattern.md)               |
+| Private Endpoint Wiring  | Any PaaS service requiring private connectivity  | [private-endpoint-pattern](references/private-endpoint-pattern.md) |
+| Diagnostic Settings      | Every deployed resource (mandatory)              | [common-patterns](references/common-patterns.md)                   |
+| Conditional Deployment   | Optional resources controlled by parameters      | [common-patterns](references/common-patterns.md)                   |
+| Module Composition       | Breaking main.bicep into reusable modules        | [common-patterns](references/common-patterns.md)                   |
+| Managed Identity Binding | Any service-to-service authentication            | [common-patterns](references/common-patterns.md)                   |
+| What-If / AVM Pitfalls   | Pre-deployment validation & AVM gotchas          | [avm-pitfalls](references/avm-pitfalls.md)                         |
 
 ---
 
-## Hub-Spoke Networking
-
-Standard pattern for shared services hub with workload spokes:
-
-```bicep
-// main.bicep — hub-spoke orchestration
-module hub 'modules/hub-vnet.bicep' = {
-  name: 'hub-vnet'
-  params: {
-    vnetName: 'vnet-hub-${uniqueSuffix}'
-    addressPrefix: '10.0.0.0/16'
-    subnets: [
-      { name: 'AzureFirewallSubnet', prefix: '10.0.1.0/24' }
-      { name: 'GatewaySubnet', prefix: '10.0.2.0/24' }
-    ]
-    tags: tags
-  }
-}
-
-module spoke 'modules/spoke-vnet.bicep' = {
-  name: 'spoke-vnet-${workloadName}'
-  params: {
-    vnetName: 'vnet-spoke-${workloadName}-${uniqueSuffix}'
-    addressPrefix: spokeAddressPrefix
-    hubVnetId: hub.outputs.resourceId
-    tags: tags
-  }
-}
-```
-
-Key rules:
-
-- Hub contains shared infrastructure (firewall, gateway, DNS)
-- Spokes peer to hub — never to each other directly
-- Use `hubVnetId` output to wire peering in spoke modules
-- Apply NSGs per subnet, not per VNet
-
----
-
-## Private Endpoint Wiring
-
-Standard three-resource pattern for private connectivity:
-
-```bicep
-// Private endpoint for a PaaS service
-resource privateEndpoint 'Microsoft.Network/privateEndpoints@2024-01-01' = {
-  name: 'pe-${serviceName}-${uniqueSuffix}'
-  location: location
-  tags: tags
-  properties: {
-    subnet: {
-      id: subnetId
-    }
-    privateLinkServiceConnections: [
-      {
-        name: 'plsc-${serviceName}'
-        properties: {
-          privateLinkServiceId: targetResourceId
-          groupIds: [groupId]
-        }
-      }
-    ]
-  }
-}
-
-resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2024-01-01' = {
-  parent: privateEndpoint
-  name: 'default'
-  properties: {
-    privateDnsZoneConfigs: [
-      {
-        name: 'config'
-        properties: {
-          privateDnsZoneId: privateDnsZoneId
-        }
-      }
-    ]
-  }
-}
-```
-
-Group IDs by service type:
-
-| Service          | Group ID       | DNS Zone                                  |
-| ---------------- | -------------- | ----------------------------------------- |
-| Storage Blob     | `blob`         | `privatelink.blob.core.windows.net`       |
-| Storage Table    | `table`        | `privatelink.table.core.windows.net`      |
-| Key Vault        | `vault`        | `privatelink.vaultcore.azure.net`         |
-| SQL Server       | `sqlServer`    | `privatelink.database.windows.net`        |
-| Cosmos DB        | `Sql`          | `privatelink.documents.azure.com`         |
-| App Service      | `sites`        | `privatelink.azurewebsites.net`           |
-| Event Hub        | `namespace`    | `privatelink.servicebus.windows.net`      |
-| Container Reg    | `registry`     | `privatelink.azurecr.io`                  |
-
----
-
-## Diagnostic Settings
-
-Every resource must send logs and metrics to a workspace:
-
-```bicep
-// Pass workspace NAME (not ID) to modules — resolve inside with existing keyword
-param logAnalyticsWorkspaceName string
-
-resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
-  name: logAnalyticsWorkspaceName
-}
-
-resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
-  name: 'diag-${parentResourceName}'
-  scope: parentResource
-  properties: {
-    workspaceId: workspace.id
-    logs: [
-      {
-        categoryGroup: 'allLogs'
-        enabled: true
-      }
-    ]
-    metrics: [
-      {
-        category: 'AllMetrics'
-        enabled: true
-      }
-    ]
-  }
-}
-```
-
-- Use `categoryGroup: 'allLogs'` instead of listing individual categories
-- Always include `AllMetrics`
-- Pass workspace **name** not ID — use `existing` keyword to resolve
-
----
-
-## Conditional Deployment
-
-Use parameters to control optional resource deployment:
+## Canonical Example — Module Interface
 
 ```bicep
-@description('Deploy a Redis cache for session state')
-param deployRedis bool = false
-
-module redis 'modules/redis.bicep' = if (deployRedis) {
-  name: 'redis-cache'
-  params: {
-    name: 'redis-${projectName}-${environment}-${uniqueSuffix}'
-    location: location
-    tags: tags
-  }
-}
-
-// Conditional output — empty string when not deployed
-output redisHostName string = deployRedis ? redis.outputs.hostName : ''
-```
-
-- Use `bool` parameters with sensible defaults
-- Guard outputs with ternary expressions
-- Group related optional resources (e.g., `deployMonitoring` enables workspace + alerts + dashboard)
-
----
-
-## Module Composition
-
-Standard module interface pattern — every module follows this contract:
-
-```bicep
-// modules/storage.bicep
-@description('Storage account name (max 24 chars)')
+// modules/storage.bicep — every module follows this contract
+@description('Storage account name')
 param name string
-
-@description('Azure region')
 param location string
-
-@description('Resource tags')
 param tags object
-
-@description('Log Analytics workspace name for diagnostics')
 param logAnalyticsWorkspaceName string
 
-// ... resource definition ...
-
-// MANDATORY outputs
-@description('Resource ID of the storage account')
 output resourceId string = storageAccount.id
-
-@description('Name of the storage account')
 output resourceName string = storageAccount.name
-
-@description('Principal ID of the managed identity (empty if none)')
 output principalId string = storageAccount.identity.?principalId ?? ''
 ```
 
-Module conventions:
-
-- Every module accepts `name`, `location`, `tags`, `logAnalyticsWorkspaceName`
-- Every module outputs `resourceId`, `resourceName`, `principalId`
-- Use `@description` on all parameters and outputs
-- Use AVM modules when available — wrap with project-specific defaults if needed
+Accept `name`, `location`, `tags`, `logAnalyticsWorkspaceName`; output `resourceId`, `resourceName`, `principalId`.
 
 ---
 
-## Managed Identity Binding
-
-Standard pattern for granting service-to-service access:
-
-```bicep
-// Grant App Service access to Key Vault secrets
-resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
-  name: guid(keyVault.id, appService.id, keyVaultSecretsUserRoleId)
-  scope: keyVault
-  properties: {
-    roleDefinitionId: subscriptionResourceId(
-      'Microsoft.Authorization/roleDefinitions',
-      keyVaultSecretsUserRoleId
-    )
-    principalId: appService.identity.principalId
-    principalType: 'ServicePrincipal'
-  }
-}
-```
-
-Common role definition IDs:
+## Key Rules Summary
 
-| Role                        | ID                                     |
-| --------------------------- | -------------------------------------- |
-| Key Vault Secrets User      | `4633458b-17de-408a-b874-0445c86b69e6` |
-| Storage Blob Data Reader    | `2a2b9908-6ea1-4ae2-8e65-a410df84e7d1` |
-| Storage Blob Data Contrib   | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` |
-| Cosmos DB Account Reader    | `fbdf93bf-df7d-467e-a4d2-9458aa1360c8` |
-| SQL DB Contributor          | `9b7fa17d-e63e-47b0-bb0a-15c516ac86ec` |
-
-- Always use `guid()` for deterministic, idempotent assignment names
-- Set `principalType: 'ServicePrincipal'` for managed identities
-- Scope to the narrowest resource possible
+- **Hub-Spoke**: Hub holds shared infra; spokes peer to hub only; NSGs per subnet
+- **Private Endpoints**: Always wire PE + DNS Zone Group + DNS Zone; see group ID table in reference
+- **Diagnostics**: `categoryGroup: 'allLogs'` + `AllMetrics`; pass workspace **name** not ID
+- **Conditional**: `bool` params with defaults; guard outputs with ternary
+- **Identity**: `guid()` for idempotent role names; `principalType: 'ServicePrincipal'`; scope narrowly
+- **What-If**: Run before every deploy; watch for unexpected deletes and SKU downgrades
+- **AVM**: Always pin versions; wrap modules to override defaults; verify outputs in README
 
 ---
 
-## What-If Interpretation
-
-Before deploying, always run what-if to preview changes:
-
-```bash
-az deployment group what-if \
-  --resource-group "$rgName" \
-  --template-file main.bicep \
-  --parameters main.bicepparam \
-  --no-pretty-print
-```
+## Reference Index
 
-Interpret results:
-
-| Change Type  | Icon   | Action Required                                |
-| ------------ | ------ | ---------------------------------------------- |
-| Create       | green  | New resource — verify name and configuration   |
-| Modify       | yellow | Property change — check for breaking changes   |
-| Delete       | red    | Resource removal — confirm intentional         |
-| NoChange     | grey   | Idempotent — no action needed                  |
-| Deploy       | blue   | Child resource deployment                      |
-| Ignore       | grey   | Read-only property change — safe to ignore     |
-
-Red flags to catch: unexpected deletes, SKU downgrades, public access changes,
-authentication mode changes, or identity removal.
+| File                                                                  | Content                                                               |
+| --------------------------------------------------------------------- | --------------------------------------------------------------------- |
+| [hub-spoke-pattern.md](references/hub-spoke-pattern.md)               | Hub-spoke VNet orchestration with peering                             |
+| [private-endpoint-pattern.md](references/private-endpoint-pattern.md) | PE wiring + DNS zone groups + group ID table                          |
+| [common-patterns.md](references/common-patterns.md)                   | Diagnostics, conditional deploy, module composition, managed identity |
+| [avm-pitfalls.md](references/avm-pitfalls.md)                         | What-if interpretation, AVM gotchas, learn more links                 |
 
 ---
 
 ## Learn More
 
-For patterns not covered here, query official documentation:
-
-| Topic                    | How to Find                                                                |
-| ------------------------ | -------------------------------------------------------------------------- |
-| AVM module catalog       | `microsoft_docs_search(query="Azure Verified Modules registry Bicep")`     |
-| Resource type schema     | `microsoft_docs_search(query="{resource-type} Bicep template reference")` |
-| Networking patterns      | `microsoft_docs_search(query="Azure hub-spoke network topology Bicep")`   |
-| Security baseline        | `microsoft_docs_search(query="{service} security baseline")`              |
+| Topic                | How to Find                                                               |
+| -------------------- | ------------------------------------------------------------------------- |
+| AVM module catalog   | `microsoft_docs_search(query="Azure Verified Modules registry Bicep")`    |
+| Resource type schema | `microsoft_docs_search(query="{resource-type} Bicep template reference")` |
```

#### Modified: `.github/skills/azure-defaults/SKILL.md` (+77/-443)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-defaults/SKILL.md	2026-03-04 06:46:56.650695590 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-defaults/SKILL.md	2026-03-04 06:47:05.112995073 +0000
@@ -1,18 +1,23 @@
 ---
 name: azure-defaults
-description: Provides Azure defaults for naming, regions, tags, AVM-first modules, security baselines, WAF criteria, governance discovery, and pricing guidance across all agents.
+description: >-
+  Azure infrastructure defaults: regions, tags, naming (CAF), AVM-first policy,
+  security baseline, unique suffix patterns.
+  USE FOR: any agent generating or planning Azure resources.
+  DO NOT USE FOR: artifact template structures (use azure-artifacts),
+  pricing lookups (read references/pricing-guidance.md on demand).
 compatibility: Works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool.
 license: MIT
 metadata:
   author: jonathan-vella
-  version: "1.0"
+  version: "2.0"
   category: azure-infrastructure
 ---
 
 # Azure Defaults Skill
 
-Single source of truth for all Azure infrastructure configuration used across agents.
-Replaces individual `_shared/` file lookups with one consolidated reference.
+Single source of truth for Azure infrastructure configuration.
+Deep-dive content lives in `references/` — load on demand.
 
 ---
 
@@ -20,682 +25,120 @@
 
 ### Default Regions
 
-| Service             | Default Region       | Reason                              |
-| ------------------- | -------------------- | ----------------------------------- |
-| **All resources**   | `swedencentral`      | EU GDPR-compliant                   |
-| **Static Web Apps** | `westeurope`         | Not available in swedencentral      |
-| **Azure OpenAI**    | `swedencentral`      | Limited availability — verify first |
-| **Failover**        | `germanywestcentral` | EU paired alternative               |
+| Service             | Default Region       | Reason                         |
+| ------------------- | -------------------- | ------------------------------ |
+| **All resources**   | `swedencentral`      | EU GDPR-compliant              |
+| **Static Web Apps** | `westeurope`         | Not available in swedencentral |
+| **Failover**        | `germanywestcentral` | EU paired alternative          |
 
 ### Required Tags (Azure Policy Enforced)
 
 > [!IMPORTANT]
-> These 4 tags are the MINIMUM baseline. Azure Policy in your subscription may enforce
-> additional tags. Always defer to `04-governance-constraints.md` for the actual required tag list.
+> These 4 tags are the MINIMUM baseline. Always defer to
+> `04-governance-constraints.md` for the actual required tag list.
 
 | Tag           | Required | Example Values           |
 | ------------- | -------- | ------------------------ |
 | `Environment` | Yes      | `dev`, `staging`, `prod` |
-| `ManagedBy`   | Yes      | `Bicep`                  |
+| `ManagedBy`   | Yes      | `Bicep` or `Terraform`   |
 | `Project`     | Yes      | Project identifier       |
 | `Owner`       | Yes      | Team or individual name  |
 
-Bicep pattern:
-
-```bicep
-tags: {
-  Environment: environment
-  ManagedBy: 'Bicep'
-  Project: projectName
-  Owner: owner
-}
-```
-
 ### Unique Suffix Pattern
 
-Generate ONCE in `main.bicep`, pass to ALL modules:
+Generate ONCE, pass to ALL modules:
 
 ```bicep
-// main.bicep
 var uniqueSuffix = uniqueString(resourceGroup().id)
-
-module keyVault 'modules/key-vault.bicep' = {
-  params: { uniqueSuffix: uniqueSuffix }
-}
 ```
 
-### Security Baseline
+### Security Baseline (5-Line Summary)
 
-| Setting                    | Value               | Applies To                        |
-| -------------------------- | ------------------- | --------------------------------- |
-| `supportsHttpsTrafficOnly` | `true`              | Storage accounts                  |
-| `minimumTlsVersion`        | `'TLS1_2'`          | All services                      |
-| `allowBlobPublicAccess`    | `false`             | Storage accounts                  |
-| `publicNetworkAccess`      | `'Disabled'` (prod) | Data services                     |
-| Authentication             | Managed Identity    | Prefer over keys/strings          |
-| SQL Auth                   | Azure AD-only       | `azureADOnlyAuthentication: true` |
+| Setting               | Value            | Applies To       |
+| --------------------- | ---------------- | ---------------- |
+| HTTPS-only            | `true`           | Storage, all     |
+| TLS minimum           | `'TLS1_2'`       | All services     |
+| Public blob access    | `false`          | Storage          |
+| Public network (prod) | `'Disabled'`     | Data services    |
+| Authentication        | Managed Identity | Prefer over keys |
+
+For AVM pitfalls and deprecation patterns, read
+`references/security-baseline-full.md`.
 
 ---
 
 ## CAF Naming Conventions
 
-### Standard Abbreviations
-
-| Resource         | Abbreviation | Name Pattern                | Max Length |
-| ---------------- | ------------ | --------------------------- | ---------- |
-| Resource Group   | `rg`         | `rg-{project}-{env}`        | 90         |
-| Virtual Network  | `vnet`       | `vnet-{project}-{env}`      | 64         |
-| Subnet           | `snet`       | `snet-{purpose}-{env}`      | 80         |
-| NSG              | `nsg`        | `nsg-{purpose}-{env}`       | 80         |
-| Key Vault        | `kv`         | `kv-{short}-{env}-{suffix}` | **24**     |
-| Storage Account  | `st`         | `st{short}{env}{suffix}`    | **24**     |
-| App Service Plan | `asp`        | `asp-{project}-{env}`       | 40         |
-| App Service      | `app`        | `app-{project}-{env}`       | 60         |
-| SQL Server       | `sql`        | `sql-{project}-{env}`       | 63         |
-| SQL Database     | `sqldb`      | `sqldb-{project}-{env}`     | 128        |
-| Static Web App   | `stapp`      | `stapp-{project}-{env}`     | 40         |
-| CDN / Front Door | `fd`         | `fd-{project}-{env}`        | 64         |
-| Log Analytics    | `log`        | `log-{project}-{env}`       | 63         |
-| App Insights     | `appi`       | `appi-{project}-{env}`      | 255        |
-| Container App    | `ca`         | `ca-{project}-{env}`        | 32         |
-| Container Env    | `cae`        | `cae-{project}-{env}`       | 60         |
-| Cosmos DB        | `cosmos`     | `cosmos-{project}-{env}`    | 44         |
-| Service Bus      | `sb`         | `sb-{project}-{env}`        | 50         |
+| Resource         | Abbr    | Pattern                     | Max |
+| ---------------- | ------- | --------------------------- | --- |
+| Resource Group   | `rg`    | `rg-{project}-{env}`        | 90  |
+| Virtual Network  | `vnet`  | `vnet-{project}-{env}`      | 64  |
+| Subnet           | `snet`  | `snet-{purpose}-{env}`      | 80  |
+| NSG              | `nsg`   | `nsg-{purpose}-{env}`       | 80  |
+| Key Vault        | `kv`    | `kv-{short}-{env}-{suffix}` | 24  |
+| Storage Account  | `st`    | `st{short}{env}{suffix}`    | 24  |
+| App Service Plan | `asp`   | `asp-{project}-{env}`       | 40  |
+| App Service      | `app`   | `app-{project}-{env}`       | 60  |
+| SQL Server       | `sql`   | `sql-{project}-{env}`       | 63  |
+| SQL Database     | `sqldb` | `sqldb-{project}-{env}`     | 128 |
+| Static Web App   | `stapp` | `stapp-{project}-{env}`     | 40  |
+| Log Analytics    | `log`   | `log-{project}-{env}`       | 63  |
+| App Insights     | `appi`  | `appi-{project}-{env}`      | 255 |
 
-### Length-Constrained Resources
-
-Key Vault and Storage Account have 24-char limits. Always include `uniqueSuffix`:
-
-```bicep
-// Key Vault: kv-{8chars}-{3chars}-{6chars} = 21 chars max
-var kvName = 'kv-${take(projectName, 8)}-${take(environment, 3)}-${take(uniqueSuffix, 6)}'
-
-// Storage: st{8chars}{3chars}{6chars} = 19 chars max (no hyphens!)
-var stName = 'st${take(replace(projectName, '-', ''), 8)}${take(environment, 3)}${take(uniqueSuffix, 6)}'
-```
-
-### Naming Rules
-
-- **DO**: Use lowercase with hyphens (`kv-myapp-dev-abc123`)
-- **DO**: Include `uniqueSuffix` in globally unique names (Key Vault, Storage, SQL Server)
-- **DO**: Use `take()` to truncate long names within limits
-- **DON'T**: Use hyphens in Storage Account names (only lowercase + numbers)
-- **DON'T**: Hardcode unique values — always derive from `uniqueString(resourceGroup().id)`
-- **DON'T**: Exceed max length — Bicep won't warn, deployment will fail
+For extended abbreviations and length-constraint examples, read
+`references/naming-full-examples.md`.
 
 ---
 
 ## Azure Verified Modules (AVM)
 
-### AVM-First Policy
-
-1. **ALWAYS** check AVM availability first via `mcp_bicep_list_avm_metadata`
-2. Use AVM module defaults for SKUs when available
-3. If custom SKU needed, require live deprecation research
-4. **NEVER** hardcode SKUs without validation
-5. **NEVER** write raw Bicep for a resource that has an AVM module
-
-### Common AVM Modules
-
-| Resource           | Module Path                                        | Min Version |
-| ------------------ | -------------------------------------------------- | ----------- |
-| Key Vault          | `br/public:avm/res/key-vault/vault`                | `0.11.0`    |
-| Virtual Network    | `br/public:avm/res/network/virtual-network`        | `0.5.0`     |
-| Storage Account    | `br/public:avm/res/storage/storage-account`        | `0.14.0`    |
-| App Service Plan   | `br/public:avm/res/web/serverfarm`                 | `0.4.0`     |
-| App Service        | `br/public:avm/res/web/site`                       | `0.12.0`    |
-| SQL Server         | `br/public:avm/res/sql/server`                     | `0.10.0`    |
-| Log Analytics      | `br/public:avm/res/operational-insights/workspace` | `0.9.0`     |
-| App Insights       | `br/public:avm/res/insights/component`             | `0.4.0`     |
-| NSG                | `br/public:avm/res/network/network-security-group` | `0.5.0`     |
-| Static Web App     | `br/public:avm/res/web/static-site`                | `0.4.0`     |
-| Container App      | `br/public:avm/res/app/container-app`              | `0.11.0`    |
-| Container Env      | `br/public:avm/res/app/managed-environment`        | `0.8.0`     |
-| Cosmos DB          | `br/public:avm/res/document-db/database-account`   | `0.10.0`    |
-| Front Door         | `br/public:avm/res/cdn/profile`                    | `0.7.0`     |
-| Service Bus        | `br/public:avm/res/service-bus/namespace`          | `0.10.0`    |
-| Container Registry | `br/public:avm/res/container-registry/registry`    | `0.6.0`     |
-
-### Finding Latest AVM Version
-
-```text
-// Use Bicep MCP tool:
-mcp_bicep_list_avm_metadata → filter by resource type → use latest version
-
-// Or check: https://aka.ms/avm/index
-```
-
-### AVM Usage Pattern
+1. **ALWAYS** check AVM availability first
+2. Use AVM defaults for SKUs when available
+3. **NEVER** write raw Bicep/TF for a resource that has an AVM module
 
-```bicep
-module keyVault 'br/public:avm/res/key-vault/vault:0.11.0' = {
-  name: '${kvName}-deploy'
-  params: {
-    name: kvName
-    location: location
-    tags: tags
-    enableRbacAuthorization: true
-    enablePurgeProtection: true
-  }
-}
-```
-
----
-
-## AVM Known Pitfalls
-
-### Region Limitations
-
-| Service         | Limitation                                                                  | Workaround                                |
-| --------------- | --------------------------------------------------------------------------- | ----------------------------------------- |
-| Static Web Apps | Only 5 regions: `westus2`, `centralus`, `eastus2`, `westeurope`, `eastasia` | Use `westeurope` for EU                   |
-| Azure OpenAI    | Limited regions per model                                                   | Check availability before planning        |
-| Container Apps  | Most regions but not all                                                    | Verify `cae` environment in target region |
-
-### Parameter Type Mismatches
-
-Known issues when using AVM modules — verify before coding:
-
-**Log Analytics Workspace** (`operational-insights/workspace`):
-
-- `dailyQuotaGb` is `int` in AVM, not `string`
-- **DO**: `dailyQuotaGb: 5`
-- **DON'T**: `dailyQuotaGb: '5'`
-
-**Container Apps Managed Environment** (`app/managed-environment`):
-
-- `appLogsConfiguration` deprecated in newer versions
-- **DO**: Use `logsConfiguration` with destination object
-- **DON'T**: Use `appLogsConfiguration.destination: 'log-analytics'`
-
-**Container Apps** (`app/container-app`):
-
-- `scaleSettings` is an object, not array of rules
-- **DO**: Check AVM schema for exact object shape
-- **DON'T**: Assume `scaleRules: [...]` array format
-
-**SQL Server** (`sql/server`):
-
-- `sku` parameter is a typed object `{name, tier, capacity}`
-- **DO**: Pass full SKU object matching schema
-- **DON'T**: Pass just string `'S0'`
-- `availabilityZone` requires specific format per region
-
-**App Service** (`web/site`):
-
-- `APPINSIGHTS_INSTRUMENTATIONKEY` deprecated
-- **DO**: Use `APPLICATIONINSIGHTS_CONNECTION_STRING` instead
-- **DON'T**: Set instrumentation key directly
-
-**Key Vault** (`key-vault/vault`):
-
-- `softDeleteRetentionInDays` is immutable after creation
-- **DO**: Set correctly on first deploy (default: 90)
-- **DON'T**: Try to change after vault exists
-
-**Static Web App** (`web/static-site`):
-
-- Free SKU may not be deployable via ARM in all regions
-- **DO**: Use `Standard` SKU for reliable ARM deployment
-- **DON'T**: Assume Free tier works everywhere via Bicep
-
----
-
-## Terraform Conventions
-
-### AVM-TF Registry Lookup
-
-Find the latest AVM-TF module version before generating code:
-
-```text
-// Use Terraform MCP tool:
-mcp_terraform_get_latest_module_version → registry.terraform.io/modules/Azure/{module}/azurerm
-
-// Or browse: https://registry.terraform.io/modules/Azure
-```
-
-### Tag Syntax (HCL)
-
-```hcl
-# locals.tf — merge baseline tags with caller-supplied extras
-locals {
-  tags = merge(var.tags, {
-    Environment = var.environment
-    ManagedBy   = "Terraform"
-    Project     = var.project
-    Owner       = var.owner
-  })
-}
-```
-
-### Required Commands
-
-```bash
-# Format all .tf files before committing
-terraform fmt -recursive
-
-# Validate syntax and provider schema
-terraform validate
-
-# Preview changes before applying
-terraform plan -out=plan.tfplan
-```
-
-### State Backend
-
-Use Azure Storage Account for all remote state. **Never** use HCP Terraform Cloud:
-
-```hcl
-# backend.tf
-terraform {
-  backend "azurerm" {
-    resource_group_name  = "rg-tfstate-prod"
-    storage_account_name = "sttfstate{suffix}"
-    container_name       = "tfstate"
-    key                  = "{project}.terraform.tfstate"
-  }
-}
-```
-
-### Unique Suffix
-
-Generate once per root module, pass to all child modules:
-
-```hcl
-resource "random_string" "suffix" {
-  length  = 4
-  lower   = true
-  numeric = true
-  special = false
-}
-```
-
----
-
-## Common AVM-TF Modules
-
-| Resource               | Bicep AVM                                                | Terraform AVM                                                          |
-| ---------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------- |
-| Key Vault              | `br/public:avm/res/key-vault/vault`                      | `Azure/avm-res-keyvault-vault/azurerm`                                 |
-| Storage Account        | `br/public:avm/res/storage/storage-account`              | `Azure/avm-res-storage-storageaccount/azurerm`                         |
-| Virtual Network        | `br/public:avm/res/network/virtual-network`              | `Azure/avm-res-network-virtualnetwork/azurerm`                         |
-| App Service Plan       | `br/public:avm/res/web/serverfarm`                       | `Azure/avm-res-web-serverfarm/azurerm`                                 |
-| Web App                | `br/public:avm/res/web/site`                             | `Azure/avm-res-web-site/azurerm`                                       |
-| Container Registry     | `br/public:avm/res/container-registry/registry`          | `Azure/avm-res-containerregistry-registry/azurerm`                     |
-| AKS                    | `br/public:avm/res/container-service/managed-cluster`    | `Azure/avm-res-containerservice-managedcluster/azurerm`                |
-| SQL Database           | `br/public:avm/res/sql/server`                           | `Azure/avm-res-sql-server/azurerm`                                     |
-| Cosmos DB              | `br/public:avm/res/document-db/database-account`         | `Azure/avm-res-documentdb-databaseaccount/azurerm`                     |
-| Service Bus            | `br/public:avm/res/service-bus/namespace`                | `Azure/avm-res-servicebus-namespace/azurerm`                           |
-| Event Hub              | `br/public:avm/res/event-hub/namespace`                  | `Azure/avm-res-eventhub-namespace/azurerm`                             |
-| Log Analytics          | `br/public:avm/res/operational-insights/workspace`       | `Azure/avm-res-operationalinsights-workspace/azurerm`                  |
-| App Insights           | `br/public:avm/res/insights/component`                   | `Azure/avm-res-insights-component/azurerm`                             |
-| Private DNS Zone       | `br/public:avm/res/network/private-dns-zone`             | `Azure/avm-res-network-privatednszones/azurerm`                        |
-| User-Assigned Identity | `br/public:avm/res/managed-identity/user-assigned-identity` | `Azure/avm-res-managedidentity-userassignedidentity/azurerm`        |
-| API Management         | `br/public:avm/res/api-management/service`               | `Azure/avm-res-apimanagement-service/azurerm`                          |
-
----
-
-## WAF Assessment Criteria
-
-### Scoring Scale
-
-| Score | Definition                                  |
-| ----- | ------------------------------------------- |
-| 9-10  | Exceeds best practices, production-ready    |
-| 7-8   | Meets best practices with minor gaps        |
-| 5-6   | Adequate but improvements needed            |
-| 3-4   | Significant gaps, address before production |
-| 1-2   | Critical deficiencies, not production-ready |
-
-### Pillar Definitions
-
-| Pillar      | Icon | Focus Areas                                              |
-| ----------- | ---- | -------------------------------------------------------- |
-| Security    | 🔒   | Identity, network, data protection, threat detection     |
-| Reliability | 🔄   | SLA, redundancy, disaster recovery, health monitoring    |
-| Performance | ⚡   | Response time, scalability, caching, load testing        |
-| Cost        | 💰   | Right-sizing, reserved instances, monitoring spend       |
-| Operations  | 🔧   | IaC, CI/CD, monitoring, incident response, documentation |
-
-### Assessment Rules
-
-- **DO**: Score each pillar 1-10 with confidence level (High/Medium/Low)
-- **DO**: Identify specific gaps with remediation recommendations
-- **DO**: Calculate composite WAF score as average of all pillars
-- **DON'T**: Give perfect 10/10 scores without exceptional justification
-- **DON'T**: Skip any pillar even if requirements seem light
-- **DON'T**: Provide generic recommendations — be specific to the workload
-
----
-
-## Azure Pricing MCP Service Names
-
-Exact names for the Azure Pricing MCP tool. Using wrong names returns 0 results.
-
-| Azure Service       | Correct `service_name`          | Common SKUs                                |
-| ------------------- | ------------------------------- | ------------------------------------------ |
-| AKS                 | `Azure Kubernetes Service`      | `Free`, `Standard`, `Premium`              |
-| API Management      | `API Management`                | `Consumption`, `Developer`, `Standard`     |
-| App Insights        | `Application Insights`          | `Enterprise`, `Basic`                      |
-| App Service         | `Azure App Service`             | `B1`, `S1`, `P1v3`, `P1v4`                 |
-| Application Gateway | `Application Gateway`           | `Standard_v2`, `WAF_v2`                    |
-| Azure Bastion       | `Azure Bastion`                 | `Basic`, `Standard`                        |
-| Azure DNS           | `Azure DNS`                     | `Public`, `Private`                        |
-| Azure Firewall      | `Azure Firewall`                | `Standard`, `Premium`                      |
-| Azure Functions     | `Functions`                     | `Consumption`, `Premium`                   |
-| Azure Monitor       | `Azure Monitor`                 | `Logs`, `Metrics`                          |
-| Container Apps      | `Azure Container Apps`          | `Consumption`                              |
-| Container Instances | `Container Instances`           | `Standard`                                 |
-| Container Registry  | `Container Registry`            | `Basic`, `Standard`, `Premium`             |
-| Cosmos DB           | `Azure Cosmos DB`               | `Serverless`, `Provisioned`                |
-| Data Factory        | `Azure Data Factory v2`         | `Data Flow`, `Pipeline`                    |
-| Event Grid          | `Event Grid`                    | `Basic`                                    |
-| Event Hubs          | `Event Hubs`                    | `Basic`, `Standard`, `Premium`             |
-| Front Door          | `Azure Front Door`              | `Standard`, `Premium`                      |
-| Key Vault           | `Key Vault`                     | `Standard`                                 |
-| Load Balancer       | `Load Balancer`                 | `Basic`, `Standard`                        |
-| Log Analytics       | `Log Analytics`                 | `Per GB`, `Commitment Tier`                |
-| Logic Apps          | `Logic Apps`                    | `Consumption`, `Standard`                  |
-| MySQL Flexible      | `Azure Database for MySQL`      | `B1ms`, `D2ds_v4`, `E2ds_v4`               |
-| NAT Gateway         | `NAT Gateway`                   | `Standard`                                 |
-| PostgreSQL Flexible | `Azure Database for PostgreSQL` | `B1ms`, `D2ds_v4`, `E2ds_v4`               |
-| Redis Cache         | `Azure Cache for Redis`         | `Basic`, `Standard`, `Premium`             |
-| SQL Database        | `SQL Database`                  | `Basic`, `Standard`, `S0`, `S1`, `Premium` |
-| Service Bus         | `Service Bus`                   | `Basic`, `Standard`, `Premium`             |
-| Static Web Apps     | `Azure Static Web Apps`         | `Free`, `Standard`                         |
-| Storage             | `Storage`                       | `Standard`, `Premium`, `LRS`, `GRS`        |
-| VPN Gateway         | `VPN Gateway`                   | `Basic`, `VpnGw1`, `VpnGw2`                |
-| Virtual Machines    | `Virtual Machines`              | `D4s_v5`, `B2s`, `E4s_v5`                  |
-
-- **DO**: Use exact names from the table above
-- **DON'T**: Use "Azure SQL" (returns 0 results) — use "SQL Database"
-- **DON'T**: Use "Web App" — use "Azure App Service"
-
-### Bulk Estimates
-
-For multi-resource cost estimates, prefer `azure_bulk_estimate` over calling `azure_cost_estimate`
-per resource. It accepts a `resources` array and returns aggregated totals.
-
-Each resource supports a `quantity` parameter (default: 1) for multi-instance scenarios.
-Use `output_format: "compact"` to reduce response size when detailed metadata is not needed.
-
----
-
-## Service Recommendation Matrix
-
-### Workload Patterns
-
-| Pattern           | Cost-Optimized Tier        | Balanced Tier                    | Enterprise Tier                         |
-| ----------------- | -------------------------- | -------------------------------- | --------------------------------------- |
-| **Static Site**   | SWA Free + Blob            | SWA Std + CDN + KV               | SWA Std + FD + KV + Monitor             |
-| **API-First**     | App Svc B1 + SQL Basic     | App Svc S1 + SQL S1 + KV         | App Svc P1v3 + SQL Premium + APIM       |
-| **N-Tier Web**    | App Svc B1 + SQL Basic     | App Svc S1 + SQL S1 + Redis + KV | App Svc P1v4 + SQL Premium + Redis + FD |
-| **Serverless**    | Functions Consumption      | Functions Premium + CosmosDB     | Functions Premium + CosmosDB + APIM     |
-| **Container**     | Container Apps Consumption | Container Apps + ACR + KV        | AKS + ACR + KV + Monitor                |
-| **Data Platform** | SQL Basic + Blob           | Synapse Serverless + ADLS        | Synapse Dedicated + ADLS + Purview      |
-
-### Detection Signals
-
-Map user language to workload pattern:
-
-| User Says                              | Likely Pattern |
-| -------------------------------------- | -------------- |
-| "website", "landing page", "blog"      | Static Site    |
-| "REST API", "microservices", "backend" | API-First      |
-| "web app", "portal", "dashboard"       | N-Tier Web     |
-| "event-driven", "triggers", "webhooks" | Serverless     |
-| "Docker", "Kubernetes", "containers"   | Container      |
-| "analytics", "data warehouse", "ETL"   | Data Platform  |
-
-### Business Domain Signals
-
-| Industry          | Common Compliance | Default Security                      |
-| ----------------- | ----------------- | ------------------------------------- |
-| Healthcare        | HIPAA             | Private endpoints, encryption at rest |
-| Financial         | PCI-DSS, SOC 2    | WAF, private endpoints, audit logging |
-| Government        | FedRAMP, IL4/5    | Azure Gov, private endpoints          |
-| Retail/E-commerce | PCI-DSS           | WAF, DDoS protection                  |
-| Education         | FERPA             | Data residency, access controls       |
-
-### Company Size Heuristics
-
-| Size                | Budget Signal  | Default Tier   | Security Posture       |
-| ------------------- | -------------- | -------------- | ---------------------- |
-| Startup (<50)       | "$50-200/mo"   | Cost-Optimized | Basic managed identity |
-| Mid-Market (50-500) | "$500-2000/mo" | Balanced       | Private endpoints, KV  |
-| Enterprise (500+)   | "$2000+/mo"    | Enterprise     | Full WAF compliance    |
-
-### Industry Compliance Pre-Selection
-
-| Industry   | Auto-Select                       |
-| ---------- | --------------------------------- |
-| Healthcare | HIPAA checkbox, private endpoints |
-| Finance    | PCI-DSS + SOC 2, WAF required     |
-| Government | Data residency, enhanced audit    |
-| Retail     | PCI-DSS if payments, DDoS         |
-
----
-
-## Governance Discovery
-
-### MANDATORY Gate
-
-Governance discovery is a **hard gate**. If Azure connectivity is unavailable or policies cannot
-be fully retrieved (including management group-inherited), STOP and inform the user.
-Do NOT proceed to implementation planning with incomplete policy data.
-
-### Discovery Commands (Ordered by Completeness)
-
-**1. REST API (MANDATORY — includes management group-inherited policies)**:
-
-```bash
-SUB_ID=$(az account show --query id -o tsv)
-az rest --method GET \
-  --url "https://management.azure.com/subscriptions/\
-${SUB_ID}/providers/Microsoft.Authorization/\
-policyAssignments?api-version=2022-06-01" \
-  --query "value[].{name:name, \
-displayName:properties.displayName, \
-scope:properties.scope, \
-enforcementMode:properties.enforcementMode, \
-policyDefinitionId:properties.policyDefinitionId}" \
-  -o json
-```
-
-> [!CAUTION]
-> `az policy assignment list` only returns subscription-scoped assignments.
-> Management group policies (often Deny/tag enforcement) are invisible to it.
-> **ALWAYS use the REST API above as the primary discovery method.**
-
-**2. Policy Definition Drill-Down (for each Deny/DeployIfNotExists)**:
-
-```bash
-# For built-in or subscription-scoped policies
-az policy definition show --name "{guid}" \
-  --query "{displayName:displayName, \
-effect:policyRule.then.effect, \
-conditions:policyRule.if}" -o json
-
-# For management-group-scoped custom policies
-az policy definition show --name "{guid}" \
-  --management-group "{mgId}" \
-  --query "{displayName:displayName, \
-effect:policyRule.then.effect}" -o json
-
-# For policy set definitions (initiatives)
-az policy set-definition show --name "{guid}" \
-  --query "{displayName:displayName, \
-policyCount:policyDefinitions | length(@)}" -o json
-```
-
-**3. ARG KQL (supplemental — subscription-scoped only)**:
-
-```kusto
-PolicyResources
-| where type == 'microsoft.authorization/policyassignments'
-| where properties.enforcementMode == 'Default'
-| project name, displayName=properties.displayName,
-  effect=properties.parameters.effect.value,
-  scope=properties.scope
-| order by name asc
-```
-
-### Azure Policy Discovery Workflow
-
-Before creating implementation plans, discover active policies:
-
-```text
-1. Verify Azure connectivity: az account show
-2. REST API: Get ALL effective policy assignments (subscription + MG inherited)
-3. Compare count with Azure Portal (Policy > Assignments) — must match
-4. For each Deny/DeployIfNotExists: drill into policy definition JSON
-5. Check tag enforcement policies (names containing 'tag' or 'Tag')
-6. Check allowed resource types and locations
-7. Document ALL findings in 04-governance-constraints.md
-```
-
-### Common Policy Constraints
-
-> [!NOTE]
-> The governance constraints JSON output schema must include `bicepPropertyPath`,
-> `azurePropertyPath`, and `requiredValue` fields for each Deny policy to enable
-> downstream programmatic consumption by the Code Generator and review subagent.
-> `azurePropertyPath` follows the Azure REST API resource property path (dot-separated,
-> resource type camelCase first) and enables IaC-tool-agnostic enforcement.
-
-| Policy             | Impact                          | Solution                              |
-| ------------------ | ------------------------------- | ------------------------------------- |
-| Required tags      | Deployment fails without tags   | Include all 4 required tags           |
-| Allowed locations  | Resources rejected outside list | Use `swedencentral` default           |
-| SQL AAD-only auth  | SQL password auth blocked       | Use `azureADOnlyAuthentication: true` |
-| Storage shared key | Shared key access denied        | Use managed identity RBAC             |
-| Zone redundancy    | Non-zonal SKUs rejected         | Use P1v4+ for App Service Plans       |
-
----
-
-## Research Workflow (All Agents)
-
-### Standard 4-Step Pattern
-
-1. **Validate Prerequisites** — Confirm previous artifact exists. If missing, STOP.
-2. **Read Agent Context** — Read previous artifact for context. Read template for H2 structure.
-3. **Domain-Specific Research** — Query ONLY for NEW information not in artifacts.
-4. **Confidence Gate (80% Rule)** — Proceed at 80%+ confidence. Below 80%, ASK user.
-
-### Confidence Levels
-
-| Level           | Indicators                  | Action                                      |
-| --------------- | --------------------------- | ------------------------------------------- |
-| High (80-100%)  | All critical info available | Proceed                                     |
-| Medium (60-79%) | Some assumptions needed     | Document assumptions, ask for critical gaps |
-| Low (0-59%)     | Major gaps                  | STOP — request clarification                |
-
-### Context Reuse Rules
-
-- **DO**: Read previous agent's artifact for context
-- **DO**: Cache shared defaults (read once per session)
-- **DO**: Query external sources only for NEW information
-- **DON'T**: Re-query Azure docs for resources already in artifacts
-- **DON'T**: Search workspace repeatedly (context flows via artifacts)
-- **DON'T**: Re-validate previous agent's work (trust artifact chain)
-
-### Agent-Specific Research Focus
-
-| Agent        | Primary Research                      | Skip (Already in Artifacts)      |
-| ------------ | ------------------------------------- | -------------------------------- |
-| Requirements | User needs, business context          | —                                |
-| Architect    | WAF gaps, SKU comparisons, pricing    | Service list (from 01)           |
-| Bicep Plan   | AVM availability, governance policies | Architecture decisions (from 02) |
-| Bicep Code   | AVM schemas, parameter types          | Resource list (from 04). NOTE: Governance constraints from `04-governance-constraints.md` MUST still be read and enforced — "trust artifact chain" means accepting decisions, not skipping compliance checks.          |
-| Deploy       | Azure state (what-if), credentials    | Template structure (from 05)     |
-
----
-
-## Service Lifecycle Validation
-
-### AVM Default Trust
-
-When using AVM modules with default SKU parameters:
-
-- Trust the AVM default — Microsoft maintains these
-- No additional deprecation research needed for defaults
-- If overriding SKU parameter, run deprecation research
-
-### Deprecation Research (For Non-AVM or Custom SKUs)
-
-| Source            | Query Pattern                                              | Reliability |
-| ----------------- | ---------------------------------------------------------- | ----------- |
-| Azure Updates     | `azure.microsoft.com/updates/?query={service}+deprecated`  | High        |
-| Microsoft Learn   | Check "Important" / "Note" callouts on service pages       | High        |
-| Azure CLI         | `az provider show --namespace {provider}` for API versions | Medium      |
-| Resource Provider | Check available SKUs in target region                      | High        |
-
-### Known Deprecation Patterns
-
-| Pattern                    | Status            | Replacement           |
-| -------------------------- | ----------------- | --------------------- |
-| "Classic" anything         | DEPRECATED        | ARM equivalents       |
-| CDN `Standard_Microsoft`   | DEPRECATED 2027   | Azure Front Door      |
-| App Gateway v1             | DEPRECATED        | App Gateway v2        |
-| "v1" suffix services       | Likely deprecated | Check for v2          |
-| Old API versions (2020-xx) | Outdated          | Use latest stable API |
-
-### What-If Deprecation Signals
-
-Deploy agent should scan what-if output for:
-`deprecated|sunset|end.of.life|no.longer.supported|classic.*not.*supported|retiring`
-
-If detected, STOP and report before deployment.
+For the full Bicep + Terraform AVM module registry, read
+`references/avm-modules.md`.
 
 ---
 
 ## Template-First Output Rules
 
-### Mandatory Compliance
-
-| Rule         | Requirement                                            |
-| ------------ | ------------------------------------------------------ |
-| Exact text   | Use template H2 text verbatim                          |
-| Exact order  | Required H2s appear in template-defined order          |
-| Anchor rule  | Extra sections allowed only AFTER last required H2     |
-| No omissions | All template H2s must appear in output                 |
-| Attribution  | Include `> Generated by {agent} agent \| {YYYY-MM-DD}` |
-
-### Output Location
-
-All agent outputs go to `agent-output/{project}/`:
-
-| Step | Output File                      | Agent                   |
-| ---- | -------------------------------- | ----------------------- |
-| 1    | `01-requirements.md`             | Requirements            |
-| 2    | `02-architecture-assessment.md`  | Architect               |
-| 3    | `03-des-*.{py,md}`               | Design                  |
-| 4    | `04-implementation-plan.md`      | Bicep Plan              |
-| 4    | `04-governance-constraints.md`   | Bicep Plan              |
-| 4    | `04-preflight-check.md`          | Bicep Code (pre-flight) |
-| 5    | `05-implementation-reference.md` | Bicep Code              |
-| 6    | `06-deployment-summary.md`       | Deploy                  |
-| 7    | `07-*.md` (7 documents)          | azure-artifacts skill   |
-
-### Header Format
-
-```markdown
-# Step {N}: {Title} - {project-name}
-
-> Generated by {agent} agent | {YYYY-MM-DD}
-```
+| Rule         | Requirement                                    |
+| ------------ | ---------------------------------------------- |
+| Exact text   | Use template H2 text verbatim                  |
+| Exact order  | Required H2s in template-defined order         |
+| Anchor rule  | Extra sections only AFTER last required H2     |
+| No omissions | All template H2s must appear in output         |
+| Attribution  | `> Generated by {agent} agent \| {YYYY-MM-DD}` |
 
 ---
 
 ## Validation Checklist
 
-Before completing any agent task, verify:
-
-- [ ] Output file saved to `agent-output/{project}/`
-- [ ] All required H2 headings from template are present
-- [ ] H2 headings match template text exactly
+- [ ] Output saved to `agent-output/{project}/`
+- [ ] All required H2 headings present and correctly ordered
 - [ ] All 4 required tags included in resource definitions
 - [ ] Unique suffix used for globally unique names
 - [ ] Security baseline settings applied
-- [ ] Region defaults correct (swedencentral, or exception documented)
-- [ ] Attribution header included with agent name and date
+- [ ] Region defaults correct
+
+---
+
+## Reference Index
+
+Load these on demand — do NOT read all at once:
+
+| Reference                                   | When to Load                                            |
+| ------------------------------------------- | ------------------------------------------------------- |
+| `references/naming-full-examples.md`        | Generating names for length-constrained resources       |
+| `references/avm-modules.md`                 | Looking up AVM module paths or versions                 |
+| `references/security-baseline-full.md`      | Debugging AVM parameter issues or checking deprecations |
+| `references/pricing-guidance.md`            | Running cost estimates with Azure Pricing MCP           |
+| `references/service-matrices.md`            | Mapping user requirements to Azure service tiers        |
+| `references/waf-criteria.md`                | Scoring WAF pillar assessments                          |
+| `references/governance-discovery.md`        | Discovering Azure Policy constraints                    |
+| `references/policy-effect-decision-tree.md` | Translating policy effects into plan/code actions       |
+| `references/adversarial-review-protocol.md` | Running challenger-review-subagent passes               |
+| `references/azure-cli-auth-validation.md`   | Validating Azure CLI auth before deployments            |
+| `references/terraform-conventions.md`       | Generating Terraform (HCL) code                         |
+| `references/research-workflow.md`           | Following the standard 4-step research pattern          |
```

#### Modified: `.github/skills/azure-diagrams/references/azure-components.md` (+1/-55)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/azure-components.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/azure-components.md	2026-03-04 15:30:02.934193739 +0000
@@ -1,3 +1,5 @@
+<!-- ref:azure-components-v1 -->
+
 # Azure Components Reference
 
 Complete list of 700+ Azure components available in the `diagrams` library with official Microsoft icons.
@@ -25,6 +27,7 @@
 ## AI & Machine Learning (42 components)
 
 ### diagrams.azure.aimachinelearning
+
 ```python
 from diagrams.azure.aimachinelearning import (
     AIStudio, AnomalyDetector, AzureAppliedAIServices, AzureOpenai,
@@ -36,6 +39,7 @@
 ```
 
 ### diagrams.azure.ml
+
 ```python
 from diagrams.azure.ml import (
     AzureOpenAI, AzureSpeechService, BatchAI, BotServices,
@@ -69,18 +73,18 @@
     # Core Compute
     VM, VMLinux, VMWindows, VirtualMachine, VMSS, VMScaleSet,
     AvailabilitySets, AutomanagedVM,
-    
+
     # Containers
     AKS, ACR, ContainerApps, ContainerInstances, ContainerRegistries,
     KubernetesServices, ServiceFabricClusters, ManagedServiceFabric,
-    
+
     # App Services
     AppServices, FunctionApps, AzureSpringApps, SpringCloud,
-    
+
     # Virtual Desktop
     ApplicationGroup, HostGroups, HostPools, Hosts, Workspaces,
     CitrixVirtualDesktopsEssentials,
-    
+
     # Other
     BatchAccounts, CloudServices, DiskEncryptionSets, Disks,
     DiskSnapshots, Images, SAPHANAOnAzure, SharedImageGalleries
@@ -104,6 +108,7 @@
 ## Database (51 components)
 
 ### diagrams.azure.database
+
 ```python
 from diagrams.azure.database import (
     CosmosDb, SQL, SQLDatabases, SQLServers, SQLManagedInstances,
@@ -114,6 +119,7 @@
 ```
 
 ### diagrams.azure.databases
+
 ```python
 from diagrams.azure.databases import (
     AzureCosmosDb, AzureSQL, AzureSQLVM, AzureSynapseAnalytics,
@@ -143,21 +149,21 @@
 from diagrams.azure.identity import (
     # Core Identity
     ActiveDirectory, AzureActiveDirectory, ADB2C, AzureADB2C,
-    
+
     # Entra ID (new naming)
     EntraConnect, EntraDomainServices, EntraIDProtection,
     EntraManagedIdentities, EntraPrivlegedIdentityManagement, EntraVerifiedID,
-    
+
     # Identity Protection
     ADIdentityProtection, ADPrivilegedIdentityManagement,
     ConditionalAccess, ManagedIdentities, AccessReview,
-    
+
     # App Registration
     AppRegistrations, EnterpriseApplications, APIProxy,
-    
+
     # Groups & Users
     Users, Groups, ExternalIdentities, AdministrativeUnits,
-    
+
     # Security Features
     IdentityGovernance, GlobalSecureAccess, PrivateAccess, InternetAccess,
     AzureInformationProtection, InformationProtection, VerifiableCredentials
@@ -172,21 +178,21 @@
 from diagrams.azure.integration import (
     # API Management
     APIManagement, APIManagementServices, APIConnections,
-    
+
     # Messaging
     ServiceBus, AzureServiceBus, ServiceBusRelays, Relays,
-    
+
     # Events
     EventGridDomains, EventGridTopics, EventGridSubscriptions,
     SystemTopic, PartnerTopic, PartnerNamespace, PartnerRegistration,
-    
+
     # Logic Apps
     LogicApps, LogicAppsCustomConnector, IntegrationAccounts,
     IntegrationServiceEnvironments, IntegrationEnvironments,
-    
+
     # Data
     DataFactories, DataCatalog, AzureDataCatalog,
-    
+
     # Other
     AppConfiguration, PowerPlatform, SendgridAccounts,
     SoftwareAsAService, StorsimpleDeviceManagers
@@ -202,24 +208,24 @@
     # Core IoT
     IotHub, IotEdge, IotCentralApplications, IotHubSecurity,
     DeviceProvisioningServices, AzureIotOperations,
-    
+
     # Digital Twins & Maps
     DigitalTwins, Maps, AzureMapsAccounts,
-    
+
     # Events & Streaming
     EventHubs, EventHubClusters, EventGridSubscriptions,
     StreamAnalyticsJobs,
-    
+
     # Time Series
     TimeSeriesInsightsEnvironments, TimeSeriesInsightsEventSources,
     TimeSeriesDataSets,
-    
+
     # Edge & Stack
     AzureStack, StackHciPremium, Sphere,
-    
+
     # Notifications
     NotificationHubs, NotificationHubNamespaces,
-    
+
     # Windows IoT
     Windows10IotCoreServices, Windows10CoreServices
 )
@@ -234,13 +240,13 @@
     # Monitoring
     Monitor, ApplicationInsights, Alerts, Metrics, ActivityLog,
     DiagnosticsSettings, LogAnalyticsWorkspaces,
-    
+
     # Governance
     Policy, Blueprints, Compliance, CostManagementAndBilling,
-    
+
     # Azure Arc
     AzureArc, ArcMachines, Machinesazurearc,
-    
+
     # Other
     Advisor, AutomationAccounts, AzureLighthouse,
     CustomerLockboxForMicrosoftAzure, RecoveryServicesVaults,
@@ -266,36 +272,38 @@
 ## Networking (79 components)
 
 ### diagrams.azure.network
+
 ```python
 from diagrams.azure.network import (
     # Gateways & Load Balancing
     ApplicationGateway, LoadBalancers, FrontDoors,
     VirtualNetworkGateways, LocalNetworkGateways,
-    
+
     # Virtual Networks
     VirtualNetworks, Subnets, NetworkInterfaces,
     VirtualWans, Connections,
-    
+
     # Security
     Firewall, ApplicationSecurityGroups, DDOSProtectionPlans,
     NetworkSecurityGroupsClassic,
-    
+
     # DNS
     DNSZones, DNSPrivateZones,
-    
+
     # Routing
     RouteTables, RouteFilters, TrafficManagerProfiles,
-    
+
     # Connectivity
     ExpressrouteCircuits, PrivateEndpoint,
     OnPremisesDataGateways, PublicIpAddresses,
-    
+
     # Monitoring
     NetworkWatcher, CDNProfiles
 )
 ```
 
 ### diagrams.azure.networking (extended)
+
 ```python
 from diagrams.azure.networking import (
     # Additional components
@@ -317,26 +325,26 @@
 from diagrams.azure.security import (
     # Key & Secret Management
     KeyVaults,
-    
+
     # Security Center & Defender
     SecurityCenter, Defender, MicrosoftDefenderForCloud,
     MicrosoftDefenderForIot, MicrosoftDefenderEasm,
-    
+
     # Sentinel (SIEM/SOAR)
     Sentinel, AzureSentinel,
-    
+
     # Identity Security
     AzureADIdentityProtection, AzureADPrivlegedIdentityManagement,
     AzureADRiskySignins, AzureADRiskyUsers,
     AzureADAuthenticationMethods, ConditionalAccess,
     MultifactorAuthentication, IdentitySecureScore,
-    
+
     # Network Security
     ApplicationSecurityGroups,
-    
+
     # Information Protection
     AzureInformationProtection,
-    
+
     # Other
     ExtendedSecurityUpdates, Detonation
 )
@@ -351,24 +359,24 @@
     # Core Storage
     StorageAccounts, BlobStorage, QueuesStorage, TableStorage,
     AzureFileshares, GeneralStorage, ArchiveStorage,
-    
+
     # Data Lake
     DataLakeStorage, DataLakeStorageGen1,
-    
+
     # Premium Storage
     AzureNetappFiles, NetappFiles, AzureHcpCache,
-    
+
     # Edge & Hybrid
     DataBox, DataBoxEdgeDataBoxGateway, AzureStackEdge,
     AzureDataboxGateway, Azurefxtedgefiler,
-    
+
     # Data Management
     DataShares, DataShareInvitations, StorageSyncServices,
     StorsimpleDataManagers, StorsimpleDeviceManagers,
-    
+
     # Backup
     RecoveryServicesVaults, ImportExportJobs,
-    
+
     # Tools
     StorageExplorer
 )
@@ -383,25 +391,25 @@
     # App Service
     AppServices, AppServicePlans, AppServiceEnvironments,
     AppServiceCertificates, AppServiceDomains, AppSpace,
-    
+
     # Static & Spring
     StaticApps, AzureSpringApps,
-    
+
     # API
     APICenter, APIConnections, APIManagementServices,
-    
+
     # CDN & Front Door
     FrontDoorAndCDNProfiles,
-    
+
     # Media
     AzureMediaService, MediaServices,
-    
+
     # Search & Cognitive
     Search, CognitiveSearch, CognitiveServices,
-    
+
     # Communication
     Signalr, NotificationHubNamespaces,
-    
+
     # Power Platform
     PowerPlatform
 )
@@ -430,22 +438,22 @@
     # Resources
     AllResources, Resource, ResourceGroups, Subscriptions,
     ManagementGroups, Tags, Templates,
-    
+
     # Files & Storage
     File, Files, FolderBlank, FolderWebsite, BlobBlock, BlobPage,
-    
+
     # Development
     Code, Commit, Branch, Builds, Developertools, Powershell, Ftp,
-    
+
     # Monitoring
     Dashboard, Workflow, Heart, Error, Information, Download,
-    
+
     # Support
     HelpAndSupport, Support, Troubleshoot, Guide, Learn,
-    
+
     # Marketplace
     Marketplace, MarketplaceManagement, FreeServices,
-    
+
     # Management
     Gear, Controls, Extensions, Module, Scheduler
 )
@@ -456,6 +464,7 @@
 ## Special Categories
 
 ### Blockchain
+
 ```python
 from diagrams.azure.blockchain import (
     AzureBlockchainService, BlockchainApplications, Consortium
@@ -463,6 +472,7 @@
 ```
 
 ### Mixed Reality
+
 ```python
 from diagrams.azure.mixedreality import (
     RemoteRendering, SpatialAnchorAccounts
@@ -470,6 +480,7 @@
 ```
 
 ### Azure Stack
+
 ```python
 from diagrams.azure.azurestack import (
     Capacity, InfrastructureBackup, MultiTenancy, Offers,
@@ -478,6 +489,7 @@
 ```
 
 ### Intune
+
 ```python
 from diagrams.azure.intune import (
     Intune, IntuneAppProtection, Devices, DeviceCompliance,
@@ -490,7 +502,9 @@
 ## Finding the Right Component
 
 ### By Service Name
+
 If you know the Azure service name, look in the relevant category:
+
 - **App Service** → `compute` or `web`
 - **Azure SQL** → `database` or `databases`
 - **Cosmos DB** → `database`
@@ -502,13 +516,17 @@
 - **Event Hubs** → `analytics` or `iot`
 
 ### Duplicate Components
+
 Some services appear in multiple modules. Generally:
+
 - Use the **most specific** module for your diagram type
 - `database` vs `databases` - both work, choose by personal preference
 - `network` vs `networking` - `networking` has more modern components
 
 ### Missing Components
+
 If a component isn't available:
+
 1. Use `diagrams.azure.general` for generic icons
 2. Use a related service icon
 3. Create a custom node with `diagrams.custom.Custom`
@@ -518,6 +536,7 @@
 ## Best Practices
 
 ### Importing
+
 ```python
 # Good - import what you need
 from diagrams.azure.compute import FunctionApps, AKS
@@ -528,6 +547,7 @@
 ```
 
 ### Naming Consistency
+
 ```python
 # Use descriptive variable names
 with Diagram("Architecture"):
@@ -537,11 +557,12 @@
 ```
 
 ### Grouping Related Services
+
 ```python
 with Cluster("Data Tier"):
     cosmos = CosmosDb("Primary")
     redis = CacheForRedis("Cache")
-    
+
 with Cluster("Integration"):
     bus = ServiceBus("Events")
     logic = LogicApps("Workflows")
```

#### Modified: `.github/skills/azure-diagrams/references/business-process-flows.md` (+10/-20)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/business-process-flows.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/business-process-flows.md	2026-03-04 15:30:02.890137649 +0000
@@ -1,3 +1,5 @@
+<!-- ref:business-process-flows-v1 -->
+
 # Business Process Flow Diagrams
 
 Generate professional business process flow diagrams showing user actions, system steps, and outcomes.
@@ -123,15 +125,15 @@
 
 ### Style Guide
 
-| Element | Shape | Color | Use For |
-|---------|-------|-------|---------|
-| Start/End | ellipse | Green (#4CAF50) | Process boundaries |
-| Process | rounded box | Blue (#2196F3) | System/automated steps |
-| Decision | diamond | Amber (#FFC107) | Yes/No branching |
-| User Action | box | Purple (#9C27B0) | Manual user steps |
-| System | box | Cyan (#00BCD4) | Backend processing |
-| Document | note | Yellow (#FFEB3B) | Document/form |
-| Data/Storage | cylinder | Orange (#FF5722) | Database/storage |
+| Element      | Shape       | Color            | Use For                |
+| ------------ | ----------- | ---------------- | ---------------------- |
+| Start/End    | ellipse     | Green (#4CAF50)  | Process boundaries     |
+| Process      | rounded box | Blue (#2196F3)   | System/automated steps |
+| Decision     | diamond     | Amber (#FFC107)  | Yes/No branching       |
+| User Action  | box         | Purple (#9C27B0) | Manual user steps      |
+| System       | box         | Cyan (#00BCD4)   | Backend processing     |
+| Document     | note        | Yellow (#FFEB3B) | Document/form          |
+| Data/Storage | cylinder    | Orange (#FF5722) | Database/storage       |
 
 ---
 
@@ -157,25 +159,25 @@
 
 # Example: Document Processing Workflow
 with Diagram("Document Processing Flow", show=False, filename="process-flow", direction="TB"):
-    
+
     start = StartEnd("Start")
-    
+
     with Cluster("User Actions"):
         user = Users("User")
         scan = ManualInput("Scan Document")
-    
+
     with Cluster("System Processing"):
         validate = Decision("Valid\nFormat?")
         ocr = Action("OCR\nExtraction")
         classify = Action("Auto\nClassification")
         store = Database("Store in\nDocument DB")
-    
+
     with Cluster("Outcomes"):
         success = Display("Document\nIndexed")
         error = Display("Error\nNotification")
-    
+
     end = StartEnd("End")
-    
+
     start >> user >> scan >> validate
     validate >> Edge(label="Yes") >> ocr >> classify >> store >> success >> end
     validate >> Edge(label="No") >> error >> end
@@ -220,21 +222,21 @@
     dot = graphviz.Digraph(title, filename=filename, format='png')
     dot.attr(rankdir='TB', splines='spline')
     dot.attr('node', shape='box', style='rounded,filled', fillcolor='lightblue')
-    
+
     # Start/End nodes
     dot.node('start', 'Start', shape='ellipse', fillcolor='lightgreen')
     dot.node('end', 'End', shape='ellipse', fillcolor='lightcoral')
-    
+
     # Decision nodes
     dot.node('decision1', 'Valid?', shape='diamond', fillcolor='lightyellow')
-    
+
     # Process nodes
     dot.node('step1', 'Receive\nDocument')
     dot.node('step2', 'Validate\nFormat')
     dot.node('step3', 'Process')
     dot.node('step4', 'Store')
     dot.node('error', 'Handle\nError', fillcolor='lightcoral')
-    
+
     # Edges
     dot.edge('start', 'step1')
     dot.edge('step1', 'step2')
@@ -244,7 +246,7 @@
     dot.edge('step3', 'step4')
     dot.edge('step4', 'end')
     dot.edge('error', 'end')
-    
+
     dot.render(cleanup=True)
     return f"{filename}.png"
 
@@ -255,11 +257,13 @@
 ## Common Process Flow Patterns
 
 ### Pattern 1: Linear Process
+
 ```python
 start >> step1 >> step2 >> step3 >> end
 ```
 
 ### Pattern 2: Decision Branch
+
 ```python
 step >> decision
 decision >> Edge(label="Yes") >> path_a >> end
@@ -267,11 +271,13 @@
 ```
 
 ### Pattern 3: Parallel Processing
+
 ```python
 step >> [parallel_a, parallel_b, parallel_c] >> merge >> next_step
 ```
 
 ### Pattern 4: Loop/Retry
+
 ```python
 process >> decision
 decision >> Edge(label="Success") >> next
@@ -279,6 +285,7 @@
 ```
 
 ### Pattern 5: Swimlanes (Actors)
+
 ```python
 with Cluster("Customer"):
     customer_actions = [Action("Submit"), Action("Review")]
@@ -293,6 +300,7 @@
 ## Styling Guide
 
 ### Node Shapes by Type
+
 - **Start/End**: Ellipse (rounded)
 - **Process/Action**: Rectangle with rounded corners
 - **Decision**: Diamond
@@ -301,6 +309,7 @@
 - **Delay/Wait**: Half-circle
 
 ### Color Coding
+
 ```python
 # Suggested colors
 USER_ACTION = "#E3F2FD"      # Light blue
@@ -333,6 +342,7 @@
 ```
 
 Map to:
+
 1. Identify actors/swimlanes (User, System)
 2. Identify decision points (diamonds in ASCII)
 3. Identify process steps (boxes)
```

#### Modified: `.github/skills/azure-diagrams/references/common-patterns.md` (+1/-52)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/common-patterns.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/common-patterns.md	2026-03-04 15:30:02.934193739 +0000
@@ -1,3 +1,5 @@
+<!-- ref:common-patterns-v1 -->
+
 # Common Azure Architecture Patterns
 
 Ready-to-use patterns for Azure architecture diagrams.
@@ -14,21 +16,21 @@
 
 with Diagram("Web Application", show=False, direction="TB"):
     cdn = CDNProfiles("CDN")
-    
+
     with Cluster("Frontend"):
         gateway = ApplicationGateway("App Gateway")
         web = AppServices("Web App")
-    
+
     with Cluster("Backend"):
         api = AppServices("API")
         cache = CacheForRedis("Redis")
-    
+
     with Cluster("Data"):
         db = SQLDatabases("SQL Database")
         storage = BlobStorage("Static Assets")
-    
+
     kv = KeyVaults("Key Vault")
-    
+
     cdn >> gateway >> web >> api
     api >> [cache, db]
     api >> kv
@@ -49,21 +51,21 @@
 with Diagram("Microservices Architecture", show=False, direction="LR"):
     with Cluster("Ingress"):
         gateway = ApplicationGateway("App Gateway")
-    
+
     with Cluster("AKS Cluster"):
         acr = ACR("Container Registry")
         aks = AKS("AKS")
-    
+
     with Cluster("Data Services"):
         cosmos = CosmosDb("Cosmos DB")
         redis = CacheForRedis("Redis")
-    
+
     with Cluster("Messaging"):
         bus = ServiceBus("Service Bus")
-    
+
     insights = ApplicationInsights("App Insights")
     kv = KeyVaults("Key Vault")
-    
+
     gateway >> aks
     acr >> aks
     aks >> [cosmos, redis, bus]
@@ -85,16 +87,16 @@
         blob = BlobStorage("Blob Trigger")
         queue = QueuesStorage("Queue Trigger")
         eventgrid = EventGridTopics("Event Grid")
-    
+
     with Cluster("Processing"):
         func1 = FunctionApps("Processor 1")
         func2 = FunctionApps("Processor 2")
         logic = LogicApps("Orchestrator")
-    
+
     with Cluster("Output"):
         bus = ServiceBus("Service Bus")
         cosmos = CosmosDb("Cosmos DB")
-    
+
     blob >> func1 >> cosmos
     queue >> func2 >> bus
     eventgrid >> logic >> [func1, func2]
@@ -114,19 +116,19 @@
         blob = BlobStorage("Raw Data")
         events = EventHubs("Streaming")
         sql = SQLDatabases("Operational DB")
-    
+
     with Cluster("Ingestion"):
         adf = DataFactories("Data Factory")
-    
+
     with Cluster("Storage"):
         lake = DataLakeStorage("Data Lake")
-    
+
     with Cluster("Processing"):
         databricks = Databricks("Databricks")
         synapse = SynapseAnalytics("Synapse")
-    
+
     ml = MachineLearningServiceWorkspaces("ML Workspace")
-    
+
     [blob, events, sql] >> adf >> lake
     lake >> databricks >> synapse
     databricks >> ml
@@ -145,15 +147,15 @@
         firewall = Firewall("Azure Firewall")
         bastion = Bastions("Bastion")
         vpn = VirtualNetworkGateways("VPN Gateway")
-    
+
     with Cluster("Spoke 1 - Web"):
         web_vm = VM("Web Server")
-    
+
     with Cluster("Spoke 2 - Data"):
         db = SQLDatabases("SQL Database")
-    
+
     onprem = VirtualNetworkGateways("On-Premises")
-    
+
     onprem >> Edge(label="VPN") >> vpn >> firewall
     web_vm >> Edge(label="Peering") >> firewall
     db >> Edge(label="Peering") >> firewall
@@ -172,21 +174,21 @@
 
 with Diagram("API-First Architecture", show=False, direction="TB"):
     users = ActiveDirectory("Entra ID")
-    
+
     with Cluster("API Layer"):
         apim = APIManagement("API Management")
-    
+
     with Cluster("Backend Services"):
         app = AppServices("Core API")
         func = FunctionApps("Async Processor")
         logic = LogicApps("Integrations")
-    
+
     with Cluster("Data"):
         cosmos = CosmosDb("Cosmos DB")
         bus = ServiceBus("Service Bus")
-    
+
     kv = KeyVaults("Key Vault")
-    
+
     users >> apim >> [app, func, logic]
     app >> cosmos
     func >> bus
@@ -207,19 +209,19 @@
 with Diagram("IoT Architecture", show=False, direction="LR"):
     with Cluster("Edge"):
         edge = IotEdge("IoT Edge")
-    
+
     with Cluster("Ingestion"):
         hub = IotHub("IoT Hub")
-    
+
     with Cluster("Processing"):
         stream = StreamAnalyticsJobs("Stream Analytics")
         func = FunctionApps("Functions")
-    
+
     with Cluster("Storage"):
         twins = DigitalTwins("Digital Twins")
         cosmos = CosmosDb("Warm Storage")
         blob = BlobStorage("Cold Storage")
-    
+
     edge >> hub >> stream
     stream >> [cosmos, blob]
     hub >> func >> twins
@@ -237,22 +239,22 @@
 with Diagram("DevOps Pipeline", show=False, direction="LR"):
     with Cluster("Source Control"):
         repos = Repos("Azure Repos")
-    
+
     with Cluster("Build"):
         build = Pipelines("Build Pipeline")
         artifacts = Artifacts("Artifacts")
-    
+
     with Cluster("Release"):
         release = Pipelines("Release Pipeline")
-    
+
     with Cluster("Environments"):
         acr = ACR("Container Registry")
         aks_dev = AKS("Dev")
         aks_prod = AKS("Prod")
-    
+
     kv = KeyVaults("Key Vault")
     insights = ApplicationInsights("App Insights")
-    
+
     repos >> build >> artifacts >> release
     release >> acr >> [aks_dev, aks_prod]
     release >> kv
@@ -270,18 +272,18 @@
 
 with Diagram("Multi-Region HA", show=False, direction="TB"):
     frontdoor = FrontDoors("Front Door")
-    
+
     with Cluster("Region 1 - Primary"):
         app1 = AppServices("App Service")
         sql1 = SQLDatabases("SQL (Primary)")
-    
+
     with Cluster("Region 2 - Secondary"):
         app2 = AppServices("App Service")
         sql2 = SQLDatabases("SQL (Secondary)")
-    
+
     cosmos = CosmosDb("Cosmos DB\n(Multi-Region)")
     blob = BlobStorage("Blob\n(GRS)")
-    
+
     frontdoor >> [app1, app2]
     app1 >> [sql1, cosmos]
     app2 >> [sql2, cosmos]
@@ -303,23 +305,23 @@
     with Cluster("Identity"):
         aad = ActiveDirectory("Entra ID")
         ca = ConditionalAccess("Conditional Access")
-    
+
     with Cluster("Network Security"):
         waf = ApplicationGateway("WAF")
         firewall = Firewall("Firewall")
-    
+
     with Cluster("Application"):
         app = AppServices("App Service")
         mi = ManagedIdentities("Managed Identity")
-    
+
     with Cluster("Data"):
         sql = SQLDatabases("SQL")
         kv = KeyVaults("Key Vault")
-    
+
     with Cluster("Security Operations"):
         sentinel = Sentinel("Sentinel")
         defender = Defender("Defender")
-    
+
     aad >> ca >> waf >> app
     app >> mi >> [kv, sql]
     firewall >> [app, sql]
@@ -341,17 +343,17 @@
     with Cluster("Data"):
         blob = BlobStorage("Training Data")
         cosmos = CosmosDb("Feature Store")
-    
+
     with Cluster("ML Platform"):
         mlws = MachineLearningServiceWorkspaces("ML Workspace")
         cognitive = CognitiveServices("Cognitive Services")
-    
+
     with Cluster("Serving"):
         aks = AKS("Model Serving")
         func = FunctionApps("Inference API")
-    
+
     apim = APIManagement("API Management")
-    
+
     blob >> mlws >> aks
     cosmos >> mlws
     cognitive >> func
@@ -373,18 +375,18 @@
     with Cluster("On-Premises"):
         onprem_server = Server("App Server")
         onprem_db = MSSQL("SQL Server")
-    
+
     with Cluster("Connectivity"):
         expressroute = ExpressrouteCircuits("ExpressRoute")
         vpn = VirtualNetworkGateways("VPN Gateway")
-    
+
     with Cluster("Azure"):
         with Cluster("VNet"):
             vnet = VirtualNetworks("Hub VNet")
             app = AppServices("App Service")
             sql = SQLDatabases("Azure SQL")
         bus = ServiceBus("Service Bus")
-    
+
     onprem_server >> expressroute >> vnet
     onprem_db >> Edge(label="Data Sync", style="dashed") >> sql
     app >> bus >> onprem_server
@@ -395,19 +397,23 @@
 ## Tips for Professional Diagrams
 
 ### Consistent Direction
+
 - `direction="TB"` (top-bottom) for hierarchical architectures
 - `direction="LR"` (left-right) for flow/pipeline diagrams
 
 ### Meaningful Clustering
+
 - Group by: Resource Group, Subnet, Service tier, or Logical function
 - Avoid too many nested clusters (max 2-3 levels)
 
 ### Edge Styling
+
 - Solid lines: Primary data flow
 - Dashed lines: Configuration, secrets, replication
 - Colored lines: Highlight critical paths
 
 ### Labels
+
 - Keep node labels short (1-3 words)
 - Add context in cluster names
 - Use edge labels sparingly
```

#### Modified: `.github/skills/azure-diagrams/references/entity-relationship-diagrams.md` (+1/-26)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/entity-relationship-diagrams.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/entity-relationship-diagrams.md	2026-03-04 15:30:02.934193739 +0000
@@ -1,3 +1,5 @@
+<!-- ref:entity-relationship-diagrams-v1 -->
+
 # Entity Relationship Diagrams (ERD)
 
 Generate professional database entity relationship diagrams showing tables, columns, and relationships.
@@ -14,7 +16,7 @@
     dot = graphviz.Digraph(title, filename=filename, format='png')
     dot.attr(rankdir='LR', splines='spline', nodesep='0.8', ranksep='1.2')
     dot.attr('node', shape='none', margin='0')
-    
+
     # Helper function to create table HTML
     def table_node(name, columns):
         """
@@ -23,22 +25,22 @@
         """
         html = f'''<<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4">
         <TR><TD BGCOLOR="#4472C4" COLSPAN="3"><FONT COLOR="white"><B>{name}</B></FONT></TD></TR>'''
-        
+
         for col_name, data_type, key_type in columns:
             key_indicator = ""
             if key_type == 'PK':
                 key_indicator = '🔑 '
             elif key_type == 'FK':
                 key_indicator = '🔗 '
-            
+
             html += f'''<TR>
                 <TD ALIGN="LEFT">{key_indicator}{col_name}</TD>
                 <TD ALIGN="LEFT"><FONT COLOR="gray">{data_type}</FONT></TD>
             </TR>'''
-        
+
         html += '</TABLE>>'
         return html
-    
+
     # Define tables
     dot.node('Documents', table_node('Documents', [
         ('DocumentId', 'INT', 'PK'),
@@ -48,33 +50,33 @@
         ('CreatedDate', 'DATETIME', None),
         ('CreatedBy', 'INT', 'FK'),
     ]))
-    
+
     dot.node('Accounts', table_node('Accounts', [
         ('AccountId', 'INT', 'PK'),
         ('AccountName', 'VARCHAR(100)', None),
         ('AccountType', 'VARCHAR(50)', None),
         ('Status', 'VARCHAR(20)', None),
     ]))
-    
+
     dot.node('Users', table_node('Users', [
         ('UserId', 'INT', 'PK'),
         ('Username', 'VARCHAR(50)', None),
         ('Email', 'VARCHAR(100)', None),
         ('RoleId', 'INT', 'FK'),
     ]))
-    
+
     dot.node('Roles', table_node('Roles', [
         ('RoleId', 'INT', 'PK'),
         ('RoleName', 'VARCHAR(50)', None),
         ('Permissions', 'TEXT', None),
     ]))
-    
+
     # Define relationships
     # Crow's foot notation using edge labels
     dot.edge('Documents', 'Accounts', label='N:1', arrowhead='crow', arrowtail='tee')
     dot.edge('Documents', 'Users', label='N:1', arrowhead='crow', arrowtail='tee')
     dot.edge('Users', 'Roles', label='N:1', arrowhead='crow', arrowtail='tee')
-    
+
     dot.render(cleanup=True)
     return f"{filename}.png"
 ```
@@ -87,19 +89,19 @@
 from diagrams.onprem.database import PostgreSQL, MySQL
 
 with Diagram("Database Schema", show=False, filename="erd-simple", direction="LR"):
-    
+
     with Cluster("Core Entities"):
         documents = PostgreSQL("Documents")
         accounts = PostgreSQL("Accounts")
         users = PostgreSQL("Users")
-    
+
     with Cluster("Reference Data"):
         roles = PostgreSQL("Roles")
         permissions = PostgreSQL("Permissions")
-    
+
     with Cluster("Audit"):
         audit_log = PostgreSQL("AuditLog")
-    
+
     # Relationships
     documents >> Edge(label="belongs to") >> accounts
     documents >> Edge(label="created by") >> users
@@ -114,7 +116,7 @@
 def generate_mermaid_erd(entities):
     """Generate Mermaid ERD syntax."""
     mermaid = "erDiagram\n"
-    
+
     for entity in entities:
         name = entity['name']
         mermaid += f"    {name} {{\n"
@@ -126,7 +128,7 @@
                 mermaid += " FK"
             mermaid += "\n"
         mermaid += "    }\n"
-    
+
     return mermaid
 
 # Example
@@ -159,6 +161,7 @@
 ## Relationship Notation
 
 ### Crow's Foot Notation
+
 ```text
 ||--||  One to One
 ||--o{  One to Many (optional)
@@ -167,6 +170,7 @@
 ```
 
 ### In Graphviz
+
 ```python
 # One to Many
 dot.edge('Parent', 'Child', arrowhead='crow', arrowtail='tee')
@@ -188,7 +192,7 @@
     dot = graphviz.Digraph('ERD', filename=filename, format='png')
     dot.attr(rankdir='TB', splines='spline')
     dot.attr('node', shape='none')
-    
+
     def make_table(name, columns, color="#4472C4"):
         rows = "".join([
             f'<TR><TD ALIGN="LEFT" PORT="{c[0]}">{c[0]}</TD><TD ALIGN="LEFT"><FONT COLOR="gray">{c[1]}</FONT></TD></TR>'
@@ -198,7 +202,7 @@
             <TR><TD BGCOLOR="{color}" COLSPAN="2"><FONT COLOR="white"><B>{name}</B></FONT></TD></TR>
             {rows}
         </TABLE>>'''
-    
+
     # Core entities
     dot.node('Documents', make_table('Documents', [
         ('DocumentId', 'INT PK'),
@@ -211,7 +215,7 @@
         ('ModifiedDate', 'DATETIME2'),
         ('CreatedBy', 'INT FK'),
     ]))
-    
+
     dot.node('Accounts', make_table('Accounts', [
         ('AccountId', 'INT PK'),
         ('AccountRef', 'VARCHAR(50)'),
@@ -219,34 +223,34 @@
         ('ServiceAreaId', 'INT FK'),
         ('Status', 'VARCHAR(20)'),
     ], color="#548235"))
-    
+
     dot.node('Processes', make_table('Processes', [
         ('ProcessId', 'INT PK'),
         ('ProcessName', 'NVARCHAR(100)'),
         ('Description', 'NVARCHAR(500)'),
         ('ServiceAreaId', 'INT FK'),
     ], color="#548235"))
-    
+
     dot.node('Users', make_table('Users', [
         ('UserId', 'INT PK'),
         ('EntraId', 'UNIQUEIDENTIFIER'),
         ('DisplayName', 'NVARCHAR(200)'),
         ('Email', 'NVARCHAR(200)'),
     ], color="#BF9000"))
-    
+
     dot.node('ServiceAreas', make_table('ServiceAreas', [
         ('ServiceAreaId', 'INT PK'),
         ('AreaName', 'NVARCHAR(100)'),
         ('AreaCode', 'VARCHAR(20)'),
     ], color="#7030A0"))
-    
+
     # Relationships
     dot.edge('Documents:AccountId', 'Accounts:AccountId')
     dot.edge('Documents:ProcessId', 'Processes:ProcessId')
     dot.edge('Documents:CreatedBy', 'Users:UserId')
     dot.edge('Accounts:ServiceAreaId', 'ServiceAreas:ServiceAreaId')
     dot.edge('Processes:ServiceAreaId', 'ServiceAreas:ServiceAreaId')
-    
+
     dot.render(cleanup=True)
     print(f"Generated: {filename}.png")
 
@@ -264,7 +268,7 @@
     dot = graphviz.Digraph('Access Matrix', filename=filename, format='png')
     dot.attr(rankdir='TB')
     dot.attr('node', shape='none')
-    
+
     # Create matrix as HTML table
     matrix = '''<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0" CELLPADDING="8">
         <TR>
@@ -303,7 +307,7 @@
             <TD BGCOLOR="#FFC7CE">-</TD>
         </TR>
     </TABLE>>'''
-    
+
     dot.node('matrix', matrix)
     dot.render(cleanup=True)
     print(f"Generated: {filename}.png")
@@ -314,6 +318,7 @@
 ## Converting ASCII ERDs
 
 When you see ASCII like:
+
 ```text
 ┌─────────────┐       ┌─────────────┐
 │  Documents  │       │  Accounts   │
@@ -325,6 +330,7 @@
 ```
 
 Extract:
+
 1. Table names (headers)
 2. Column names (rows in boxes)
 3. Relationships (arrows between boxes)
```

#### Modified: `.github/skills/azure-diagrams/references/iac-to-diagram.md` (+1/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/iac-to-diagram.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/iac-to-diagram.md	2026-03-04 15:30:02.890137649 +0000
@@ -1,3 +1,5 @@
+<!-- ref:iac-to-diagram-v1 -->
+
 # Infrastructure as Code to Diagram
 
 Generate architecture diagrams directly from your Bicep, Terraform, ARM templates, or Azure Pipeline definitions.
```

#### Modified: `.github/skills/azure-diagrams/references/integration-services.md` (+1/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/integration-services.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/integration-services.md	2026-03-04 15:30:02.938198838 +0000
@@ -1,3 +1,5 @@
+<!-- ref:integration-services-v1 -->
+
 # Azure Integration Components Reference
 
 Complete import reference for Azure architecture diagrams.
```

#### Modified: `.github/skills/azure-diagrams/references/migration-patterns.md` (+2/-55)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/migration-patterns.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/migration-patterns.md	2026-03-04 15:30:02.938198838 +0000
@@ -1,3 +1,5 @@
+<!-- ref:migration-patterns-v1 -->
+
 # Integration Migration Patterns
 
 Common migration scenarios for Transparity presales - from legacy integration platforms to Azure Integration Services.
@@ -7,7 +9,7 @@
 ```python
 from diagrams import Diagram, Cluster, Edge
 from diagrams.azure.integration import (
-    LogicApps, ServiceBus, APIManagement, IntegrationAccounts, 
+    LogicApps, ServiceBus, APIManagement, IntegrationAccounts,
     EventGridTopics, DataFactories
 )
 from diagrams.azure.compute import FunctionApps
@@ -18,34 +20,34 @@
 from diagrams.onprem.database import MSSQL
 
 with Diagram("BizTalk Migration to Azure", show=False, filename="biztalk-migration", direction="TB"):
-    
+
     with Cluster("Legacy BizTalk (Decommission)"):
         biztalk = Server("BizTalk Server")
-    
+
     with Cluster("Azure Integration Services"):
         with Cluster("Orchestration (replaces Orchestrations)"):
             logic = LogicApps("Logic Apps\\nStandard")
-        
+
         with Cluster("Messaging (replaces MessageBox)"):
             bus = ServiceBus("Service Bus")
             grid = EventGridTopics("Event Grid")
-        
+
         with Cluster("Transformation (replaces Maps/Pipelines)"):
             ia = IntegrationAccounts("Integration Account\\nMaps, Schemas")
             func = FunctionApps("Functions\\nCustom Transforms")
-        
+
         with Cluster("APIs (replaces WCF Adapters)"):
             apim = APIManagement("API Management")
-        
+
         with Cluster("B2B (replaces EDI)"):
             ia_b2b = IntegrationAccounts("B2B Trading\\nAS2, X12, EDIFACT")
-    
+
     with Cluster("Data"):
         sql = SQL("Azure SQL")
         blob = BlobStorage("Blob Storage")
-    
+
     kv = KeyVaults("Key Vault")
-    
+
     biztalk >> Edge(style="dashed", label="Migrate") >> logic
     apim >> logic >> bus >> func
     logic - Edge(style="dashed") - ia
@@ -63,24 +65,24 @@
 from diagrams.azure.security import KeyVaults
 
 with Diagram("MuleSoft Migration to Azure", show=False, filename="mulesoft-migration", direction="LR"):
-    
+
     with Cluster("Azure Replacement"):
         with Cluster("API Layer (Anypoint → APIM)"):
             apim = APIManagement("API Management")
-        
+
         with Cluster("Integration (Mule Flows → Logic Apps)"):
             logic = LogicApps("Logic Apps")
             func = FunctionApps("Functions")
-        
+
         with Cluster("Messaging (MQ → Service Bus)"):
             bus = ServiceBus("Service Bus")
-        
+
         with Cluster("Runtime (Mule Runtime → Container Apps)"):
             containers = ContainerApps("Container Apps\\n(Custom Code)")
-    
+
     cosmos = CosmosDb("Cosmos DB")
     kv = KeyVaults("Key Vault")
-    
+
     apim >> [logic, containers]
     logic >> bus >> func
     containers >> cosmos
@@ -98,25 +100,25 @@
 from diagrams.onprem.database import MSSQL
 
 with Diagram("SSIS Migration to Azure Data Factory", show=False, filename="ssis-migration", direction="LR"):
-    
+
     with Cluster("Legacy SSIS"):
         ssis = MSSQL("SSIS Packages")
-    
+
     with Cluster("Azure Data Platform"):
         with Cluster("Orchestration"):
             adf = DataFactories("Data Factory\\nPipelines & Data Flows")
-        
+
         with Cluster("Transformation"):
             databricks = AzureDatabricks("Databricks\\n(Complex ETL)")
             mapping = DataFactories("ADF Mapping\\nData Flows")
-        
+
         with Cluster("Storage"):
             lake = DataLakeStorage("Data Lake Gen2")
-        
+
         with Cluster("Serving"):
             synapse = AzureSynapseAnalytics("Synapse")
             sql = SQL("Azure SQL")
-    
+
     ssis >> Edge(style="dashed", label="Migrate") >> adf
     adf >> [mapping, databricks] >> lake
     lake >> [synapse, sql]
@@ -132,26 +134,26 @@
 from diagrams.azure.monitor import ApplicationInsights
 
 with Diagram("Boomi Migration to Azure", show=False, filename="boomi-migration", direction="LR"):
-    
+
     with Cluster("Azure Integration Platform"):
         with Cluster("API Management (API Gateway)"):
             apim = APIManagement("APIM")
-        
+
         with Cluster("Process Orchestration (Boomi Processes)"):
             logic = LogicApps("Logic Apps\\nWorkflows")
-        
+
         with Cluster("Custom Logic (Scripting)"):
             func = FunctionApps("Functions")
-        
+
         with Cluster("Messaging"):
             bus = ServiceBus("Service Bus")
-        
+
         with Cluster("Configuration"):
             config = AppConfiguration("App Config")
-    
+
     kv = KeyVaults("Key Vault")
     insights = ApplicationInsights("Monitoring")
-    
+
     apim >> logic >> bus >> func
     [logic, func] >> Edge(style="dashed") >> kv
     [logic, func] >> Edge(style="dashed") >> config
@@ -171,20 +173,20 @@
 from diagrams.onprem.database import MSSQL
 
 with Diagram("Dynamics 365 Integration", show=False, filename="d365-integration", direction="LR"):
-    
+
     with Cluster("Dynamics 365"):
         d365 = SQL("Dataverse")
-    
+
     with Cluster("Azure Integration"):
         apim = APIManagement("API Management")
         logic = LogicApps("Logic Apps")
         bus = ServiceBus("Service Bus")
         adf = DataFactories("Data Factory")
-    
+
     with Cluster("Backend Systems"):
         erp = MSSQL("ERP")
         lake = DataLakeStorage("Data Lake")
-    
+
     d365 >> apim >> logic >> bus >> erp
     d365 >> adf >> lake
 ```
@@ -199,22 +201,22 @@
 from diagrams.azure.database import SQL
 
 with Diagram("SharePoint M365 Integration", show=False, filename="sharepoint-integration", direction="LR"):
-    
+
     with Cluster("Microsoft 365"):
         sharepoint = BlobStorage("SharePoint")
         # Note: Using generic icon for M365
-    
+
     grid = EventGridTopics("Event Grid\\n(M365 Events)")
-    
+
     with Cluster("Processing"):
         logic = LogicApps("Logic Apps")
         func = FunctionApps("Functions")
-    
+
     with Cluster("Backend"):
         bus = ServiceBus("Service Bus")
         sql = SQL("Azure SQL")
         blob = BlobStorage("Archive")
-    
+
     sharepoint >> grid >> [logic, func]
     logic >> bus
     func >> [sql, blob]
@@ -231,24 +233,24 @@
 from diagrams.onprem.compute import Server
 
 with Diagram("SAP Integration", show=False, filename="sap-integration", direction="LR"):
-    
+
     with Cluster("SAP Landscape"):
         sap_ecc = Server("SAP ECC/S4")
         sap_bw = Server("SAP BW")
-    
+
     with Cluster("Azure Integration"):
         with Cluster("Real-time"):
             apim = APIManagement("APIM\\n(OData/RFC)")
             logic = LogicApps("Logic Apps\\n(SAP Connector)")
             bus = ServiceBus("Service Bus")
-        
+
         with Cluster("Batch"):
             adf = DataFactories("Data Factory\\n(SAP Table/CDC)")
-    
+
     with Cluster("Azure Data"):
         cosmos = CosmosDb("Cosmos DB")
         lake = DataLakeStorage("Data Lake")
-    
+
     sap_ecc >> apim >> logic >> bus >> cosmos
     [sap_ecc, sap_bw] >> adf >> lake
 ```
@@ -263,23 +265,23 @@
 from diagrams.generic.compute import Rack
 
 with Diagram("Salesforce Integration", show=False, filename="salesforce-integration", direction="LR"):
-    
+
     salesforce = Rack("Salesforce")
-    
+
     with Cluster("Event Capture"):
         grid = EventGridTopics("Event Grid\\n(Platform Events)")
         webhook = FunctionApps("Webhook\\nReceiver")
-    
+
     with Cluster("Integration"):
         logic = LogicApps("Logic Apps\\n(SF Connector)")
         bus = ServiceBus("Service Bus")
-    
+
     with Cluster("Azure Systems"):
         sql = SQL("Azure SQL")
         cosmos = CosmosDb("Cosmos DB")
-    
+
     apim = APIManagement("APIM\\n(Outbound)")
-    
+
     salesforce >> [webhook, grid] >> logic >> bus
     logic >> [sql, cosmos]
     apim >> salesforce
@@ -304,32 +306,32 @@
 from diagrams.azure.managementgovernance import Policy
 
 with Diagram("Landing Zone Integration", show=False, filename="landing-zone", direction="TB"):
-    
+
     with Cluster("Platform"):
         aad = ActiveDirectory("Azure AD")
         policy = Policy("Azure Policy")
         sentinel = Sentinel("Sentinel")
         logs = LogAnalyticsWorkspaces("Log Analytics")
-    
+
     with Cluster("Connectivity"):
         expressroute = ExpressrouteCircuits("ExpressRoute")
         firewall = Firewalls("Azure Firewall")
-    
+
     with Cluster("Landing Zone - Integration"):
         with Cluster("DMZ"):
             appgw = ApplicationGateways("App Gateway WAF")
-        
+
         with Cluster("Integration VNet"):
             apim = APIManagement("APIM")
             logic = LogicApps("Logic Apps")
             func = FunctionApps("Functions")
             bus = ServiceBus("Service Bus")
-        
+
         with Cluster("Data VNet"):
             sql = SQL("Azure SQL")
             cosmos = CosmosDb("Cosmos DB")
             kv = KeyVaults("Key Vault")
-    
+
     expressroute >> firewall >> appgw >> apim
     apim >> [logic, func] >> bus
     [logic, func] >> [sql, cosmos]
```

#### Modified: `.github/skills/azure-diagrams/references/preventing-overlaps.md` (+13/-19)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/preventing-overlaps.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/preventing-overlaps.md	2026-03-04 15:30:02.878122351 +0000
@@ -1,3 +1,5 @@
+<!-- ref:preventing-overlaps-v1 -->
+
 # Preventing Overlaps in Complex Diagrams
 
 Guide for avoiding node and edge overlaps in Graphviz-based diagrams.
@@ -24,6 +26,7 @@
 ```
 
 **For sequence-style numbered flows**:
+
 ```python
 # Don't label edges - use intermediate nodes instead
 dot.node('step1', '1. Redirect', shape='plaintext')
@@ -50,6 +53,7 @@
 ```
 
 **For the diagrams library** (Python diagrams):
+
 ```python
 with Diagram(
     "Title",
@@ -96,15 +100,15 @@
     # Increase spacing between nodes
     nodesep='1.0',      # Horizontal spacing (default 0.25)
     ranksep='1.0',      # Vertical spacing between ranks (default 0.5)
-    
+
     # Add padding around the graph
     pad='0.5',
     margin='0.5',
-    
+
     # Overlap prevention
     overlap='false',     # Prevent node overlaps (for neato/fdp engines)
     splines='spline',    # Curved lines that route around nodes
-    
+
     # For very complex diagrams
     sep='+25,25',        # Minimum separation added to nodes
 )
@@ -112,12 +116,12 @@
 
 ## Spline Types - Choosing the Right Edge Style
 
-| Spline Type | Best For | Pros | Cons |
-|-------------|----------|------|------|
-| `spline` | General architecture diagrams | Smooth curves, avoids nodes | Can look busy with many edges |
-| `ortho` | Pipeline/flow diagrams | Clean right-angles, professional | Labels may not display, can fail with complex graphs |
-| `polyline` | Fallback when ortho fails | Reliable, follows angles | Less elegant than ortho |
-| `line` | Simple diagrams | Direct, fast rendering | Lines may cross nodes |
+| Spline Type | Best For                      | Pros                             | Cons                                                 |
+| ----------- | ----------------------------- | -------------------------------- | ---------------------------------------------------- |
+| `spline`    | General architecture diagrams | Smooth curves, avoids nodes      | Can look busy with many edges                        |
+| `ortho`     | Pipeline/flow diagrams        | Clean right-angles, professional | Labels may not display, can fail with complex graphs |
+| `polyline`  | Fallback when ortho fails     | Reliable, follows angles         | Less elegant than ortho                              |
+| `line`      | Simple diagrams               | Direct, fast rendering           | Lines may cross nodes                                |
 
 **Recommendation by diagram type:**
 
@@ -136,6 +140,7 @@
 ```
 
 **Note**: With `splines="ortho"`, edge labels may not render. Use `xlabel` instead of `label`:
+
 ```python
 # With ortho splines, use xlabel
 dot.edge('a', 'b', xlabel='connection')  # Works
@@ -145,6 +150,7 @@
 ## Recommended Settings by Diagram Complexity
 
 ### Simple (< 10 nodes)
+
 ```python
 dot.attr(nodesep='0.5', ranksep='0.75')
 ```
@@ -184,7 +190,7 @@
 # Less informative
 sql = SQLDatabases("SQL")
 
-# More informative  
+# More informative
 sql = SQLDatabases("Orders DB")
 
 # With tier/environment info
@@ -192,15 +198,17 @@
 ```
 
 ### Medium (10-25 nodes)
+
 ```python
 dot.attr(nodesep='0.8', ranksep='1.0', pad='0.5')
 ```
 
 ### Complex (25+ nodes) - Like the W2 Architecture
+
 ```python
 dot.attr(
     nodesep='1.2',       # More horizontal space
-    ranksep='1.2',       # More vertical space  
+    ranksep='1.2',       # More vertical space
     pad='0.75',
     splines='spline',    # Curved edges route better
     concentrate='false', # Don't merge edges (can cause confusion)
@@ -212,12 +220,14 @@
 ### Problem: Database cylinder overlapping adjacent nodes
 
 **Solution 1: Increase node width**
+
 ```python
-dot.node('database', 'W2 Database\nSQL Server 2008 R2', 
+dot.node('database', 'W2 Database\nSQL Server 2008 R2',
          shape='cylinder', width='2.0', height='1.5')
 ```
 
 **Solution 2: Use rank constraints to force positioning**
+
 ```python
 # Force nodes to be on the same horizontal level
 with dot.subgraph() as s:
@@ -233,6 +243,7 @@
 ```
 
 **Solution 3: Add invisible spacer nodes**
+
 ```python
 dot.node('spacer1', '', style='invis', width='0.5')
 dot.edge('node_before', 'spacer1', style='invis')
@@ -242,6 +253,7 @@
 ### Problem: Edges crossing through nodes
 
 **Solution: Use xlabel instead of label for edge labels**
+
 ```python
 # Instead of:
 dot.edge('a', 'b', label='connection')
@@ -251,6 +263,7 @@
 ```
 
 **Solution: Change spline type**
+
 ```python
 # Try different spline options
 dot.attr(splines='spline')    # Curved - usually best
@@ -261,6 +274,7 @@
 ### Problem: Clusters overlapping
 
 **Solution: Add margin inside clusters**
+
 ```python
 with dot.subgraph(name='cluster_0') as c:
     c.attr(
@@ -290,7 +304,7 @@
 
 # External Interfaces
 with dot.subgraph(name='cluster_external') as c:
-    c.attr(label='EXTERNAL INTERFACES', style='filled', fillcolor='#F3E5F5', 
+    c.attr(label='EXTERNAL INTERFACES', style='filled', fillcolor='#F3E5F5',
            color='#9C27B0', fontcolor='#9C27B0', margin='20')
     c.node('scanners', 'Scanners\n(Kyocera)', shape='box', style='filled', fillcolor='white')
     c.node('email', 'Email\n(SMTP)', shape='box', style='filled', fillcolor='white')
@@ -301,7 +315,7 @@
 with dot.subgraph(name='cluster_w2') as c:
     c.attr(label='W2 DOCUMENT MANAGEMENT', style='filled', fillcolor='#E8F5E9',
            color='#4CAF50', fontcolor='#4CAF50', margin='20')
-    
+
     # Application Server row
     with c.subgraph(name='cluster_appserver') as app:
         app.attr(label='W2 Application Server', style='filled', fillcolor='#C8E6C9', margin='15')
@@ -311,7 +325,7 @@
         app.node('ui', 'User\nInterface', shape='box', style='filled', fillcolor='white')
         app.node('reporting', 'Reporting\nModule', shape='box', style='filled', fillcolor='white')
         app.node('security', 'Security\n(Windows Auth)', shape='box', style='filled', fillcolor='white')
-    
+
     # Force app server nodes to same rank
     with c.subgraph() as s:
         s.attr(rank='same')
@@ -321,9 +335,9 @@
         s.node('ui')
         s.node('reporting')
         s.node('security')
-    
+
     # Database on its own rank with more space
-    c.node('w2db', 'W2 Database\nSQL Server 2008 R2', 
+    c.node('w2db', 'W2 Database\nSQL Server 2008 R2',
            shape='cylinder', style='filled', fillcolor='#2196F3', fontcolor='white',
            width='2.5', height='1.2')  # Explicit size
 
@@ -347,7 +361,7 @@
 with dot.subgraph(name='cluster_backend') as c:
     c.attr(label='BACKEND SYSTEMS', style='filled', fillcolor='#E8EAF6',
            color='#3F51B5', fontcolor='#3F51B5', margin='20')
-    
+
     with c.subgraph(name='cluster_mri') as mri:
         mri.attr(label='MRI REVS & BENS', style='filled', fillcolor='#C5CAE9', margin='15')
         mri.node('benefits', 'Benefits\n(HB/CTR)', shape='box', style='filled', fillcolor='white')
@@ -399,7 +413,7 @@
 ```python
 dot.attr(
     nodesep='1.2',
-    ranksep='1.2', 
+    ranksep='1.2',
     pad='0.5',
     splines='spline',
 )
```

#### Modified: `.github/skills/azure-diagrams/references/quick-reference.md` (+7/-6)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/quick-reference.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/quick-reference.md	2026-03-04 15:30:02.878122351 +0000
@@ -1,3 +1,5 @@
+<!-- ref:quick-reference-v1 -->
+
 # Quick Reference Card
 
 Copy-paste snippets for rapid diagram creation.
@@ -127,36 +129,41 @@
 
 ## Direction Guide
 
-| Direction | Use Case |
-|-----------|----------|
-| `LR` | Workflows, data flows, pipelines |
-| `TB` | Layered architectures, hierarchy |
-| `RL` | Right-to-left flows |
-| `BT` | Bottom-up hierarchy |
+| Direction | Use Case                         |
+| --------- | -------------------------------- |
+| `LR`      | Workflows, data flows, pipelines |
+| `TB`      | Layered architectures, hierarchy |
+| `RL`      | Right-to-left flows              |
+| `BT`      | Bottom-up hierarchy              |
 
 ## Quick Patterns
 
 ### API Gateway Pattern
+
 ```python
 users >> apim >> [logic, func] >> [cosmos, sql]
 ```
 
 ### Event-Driven Pattern
+
 ```python
 source >> event_grid >> [handler1, handler2, handler3]
 ```
 
 ### Pub/Sub Pattern
+
 ```python
 [producer1, producer2] >> service_bus >> [consumer1, consumer2]
 ```
 
 ### Hybrid Pattern
+
 ```python
 on_prem >> data_gateway >> logic_apps >> azure_services
 ```
 
 ### Security Pattern
+
 ```python
 component >> Edge(style="dashed") >> key_vault
 component >> Edge(style="dotted") >> app_insights
```

#### Modified: `.github/skills/azure-diagrams/references/sequence-auth-flows.md` (+2/-6)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/sequence-auth-flows.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/sequence-auth-flows.md	2026-03-04 15:30:02.890137649 +0000
@@ -1,3 +1,5 @@
+<!-- ref:sequence-auth-flows-v1 -->
+
 # Sequence and Authentication Flow Diagrams
 
 Guide for creating clean authentication flows, sequence diagrams, and numbered step flows.
@@ -5,6 +7,7 @@
 ## The Problem with Numbered Edge Labels
 
 When you have a flow like:
+
 1. Redirect → 2. Login → 3. Token → 4. Access → 5. Validate
 
 Graphviz often struggles to place numbered labels correctly, resulting in floating labels.
@@ -125,7 +128,7 @@
     )
     dot.attr('node', fontname='Segoe UI', fontsize='11')
     dot.attr('edge', fontname='Segoe UI', fontsize='9')
-    
+
     # Config box
     config = '''<<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="8" BGCOLOR="#FFF8E1">
         <TR><TD><B>Authentication Methods</B></TD></TR>
@@ -135,29 +138,29 @@
         <TR><TD ALIGN="LEFT">Function triggers: Managed Identity</TD></TR>
     </TABLE>>'''
     dot.node('config', config, shape='none')
-    
+
     # Actors
-    dot.node('user', 'User\nBrowser', shape='box', style='rounded,filled', 
+    dot.node('user', 'User\nBrowser', shape='box', style='rounded,filled',
              fillcolor='#4CAF50', fontcolor='white', width='1.5')
     dot.node('app', 'PlymDocs\nApplication', shape='box', style='rounded,filled',
              fillcolor='#4CAF50', fontcolor='white', width='1.5')
     dot.node('entra', 'Microsoft\nEntra ID', shape='box', style='rounded,filled',
              fillcolor='#2196F3', fontcolor='white', width='1.5')
-    
+
     # Force horizontal arrangement
     with dot.subgraph() as s:
         s.attr(rank='same')
         s.node('user')
         s.node('app')
         s.node('entra')
-    
+
     # Edges with external labels
     dot.edge('user', 'app', xlabel='4. Access', color='#4CAF50')
     dot.edge('app', 'entra', xlabel='1. Redirect', color='#2196F3')
     dot.edge('entra', 'user', xlabel='2. Login\n(MFA if req.)', style='dashed', color='#2196F3')
     dot.edge('user', 'entra', xlabel='3. Token', style='dashed', color='#4CAF50', constraint='false')
     dot.edge('app', 'entra', xlabel='5. Validate', style='dashed', color='#9E9E9E', constraint='false')
-    
+
     dot.render(filename, cleanup=True)
     print(f"Generated: {filename}.png")
 
```

#### Modified: `.github/skills/azure-diagrams/references/timeline-gantt-diagrams.md` (+7/-47)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/timeline-gantt-diagrams.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/timeline-gantt-diagrams.md	2026-03-04 15:30:02.934193739 +0000
@@ -1,3 +1,5 @@
+<!-- ref:timeline-gantt-diagrams-v1 -->
+
 # Timeline and Gantt Diagrams
 
 Generate professional timeline, roadmap, and Gantt chart diagrams for project planning.
@@ -13,7 +15,7 @@
 def create_gantt_chart(tasks, filename="gantt-chart"):
     """
     Create a Gantt chart.
-    
+
     tasks: list of dicts with keys:
         - name: task name
         - start: start date (datetime or string)
@@ -30,37 +32,37 @@
         'Training': '#9E480E',
         'default': '#5B9BD5'
     }
-    
+
     fig, ax = plt.subplots(figsize=(14, len(tasks) * 0.5 + 2))
-    
+
     # Parse dates if strings
     for task in tasks:
         if isinstance(task['start'], str):
             task['start'] = datetime.strptime(task['start'], '%Y-%m-%d')
-    
+
     # Find date range
     min_date = min(t['start'] for t in tasks)
     max_date = max(t['start'] + timedelta(days=t['duration']) for t in tasks)
-    
+
     # Plot tasks
     for i, task in enumerate(tasks):
         start_num = (task['start'] - min_date).days
         color = colors.get(task.get('category', 'default'), colors['default'])
-        
+
         # Main bar
-        ax.barh(i, task['duration'], left=start_num, height=0.6, 
+        ax.barh(i, task['duration'], left=start_num, height=0.6,
                 color=color, alpha=0.8, edgecolor='black', linewidth=0.5)
-        
+
         # Progress overlay if specified
         if 'progress' in task:
             progress_width = task['duration'] * (task['progress'] / 100)
             ax.barh(i, progress_width, left=start_num, height=0.6,
                     color=color, alpha=1.0)
-        
+
         # Task label
-        ax.text(start_num + task['duration'] + 1, i, task['name'], 
+        ax.text(start_num + task['duration'] + 1, i, task['name'],
                 va='center', fontsize=9)
-    
+
     # Formatting
     ax.set_yticks(range(len(tasks)))
     ax.set_yticklabels([t['name'] for t in tasks])
@@ -68,12 +70,12 @@
     ax.set_title('Project Timeline', fontsize=14, fontweight='bold')
     ax.grid(axis='x', alpha=0.3)
     ax.invert_yaxis()
-    
+
     # Legend
-    legend_patches = [mpatches.Patch(color=c, label=cat) 
+    legend_patches = [mpatches.Patch(color=c, label=cat)
                       for cat, c in colors.items() if cat != 'default']
     ax.legend(handles=legend_patches, loc='lower right')
-    
+
     plt.tight_layout()
     plt.savefig(f"{filename}.png", dpi=150, bbox_inches='tight')
     plt.close()
@@ -103,7 +105,7 @@
 def create_phase_timeline(phases, filename="phase-timeline"):
     """
     Create a horizontal phase timeline.
-    
+
     phases: list of dicts with keys:
         - name: phase name
         - duration: e.g., "4 weeks"
@@ -113,31 +115,31 @@
     dot = graphviz.Digraph('Timeline', filename=filename, format='png')
     dot.attr(rankdir='LR', splines='spline')
     dot.attr('node', shape='none')
-    
+
     colors = ['#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#9E480E', '#5B9BD5']
-    
+
     prev_node = None
-    
+
     for i, phase in enumerate(phases):
         color = phase.get('color', colors[i % len(colors)])
-        
+
         # Build deliverables list
         deliverables = "<BR/>".join([f"• {d}" for d in phase.get('deliverables', [])])
-        
+
         html = f'''<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="8">
             <TR><TD BGCOLOR="{color}"><FONT COLOR="white"><B>{phase['name']}</B></FONT></TD></TR>
             <TR><TD><FONT POINT-SIZE="10">{phase.get('duration', '')}</FONT></TD></TR>
             <TR><TD ALIGN="LEFT"><FONT POINT-SIZE="9">{deliverables}</FONT></TD></TR>
         </TABLE>>'''
-        
+
         node_id = f"phase{i}"
         dot.node(node_id, html)
-        
+
         if prev_node:
             dot.edge(prev_node, node_id)
-        
+
         prev_node = node_id
-    
+
     dot.render(cleanup=True)
     print(f"Generated: {filename}.png")
 
@@ -150,7 +152,7 @@
     },
     {
         'name': 'Phase 2: Build',
-        'duration': '6 weeks', 
+        'duration': '6 weeks',
         'deliverables': ['Core Platform', 'Integrations', 'Testing']
     },
     {
@@ -176,7 +178,7 @@
 def create_roadmap(milestones, filename="roadmap"):
     """
     Create a vertical roadmap/timeline.
-    
+
     milestones: list of dicts with keys:
         - date: date string
         - title: milestone title
@@ -186,35 +188,35 @@
     dot = graphviz.Digraph('Roadmap', filename=filename, format='png')
     dot.attr(rankdir='TB')
     dot.attr('node', shape='none')
-    
+
     status_colors = {
         'complete': '#70AD47',
         'in-progress': '#FFC000',
         'planned': '#B4C7E7'
     }
-    
+
     # Create timeline spine
     dot.node('title', '''<<TABLE BORDER="0">
         <TR><TD><FONT POINT-SIZE="18"><B>Project Roadmap</B></FONT></TD></TR>
     </TABLE>>''')
-    
+
     prev_node = 'title'
-    
+
     for i, milestone in enumerate(milestones):
         color = status_colors.get(milestone.get('status', 'planned'), '#B4C7E7')
         items_html = "<BR/>".join([f"• {item}" for item in milestone.get('items', [])])
-        
+
         html = f'''<<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="8">
             <TR><TD BGCOLOR="{color}"><B>{milestone['date']}</B></TD></TR>
             <TR><TD><B>{milestone['title']}</B></TD></TR>
             <TR><TD ALIGN="LEFT"><FONT POINT-SIZE="9">{items_html}</FONT></TD></TR>
         </TABLE>>'''
-        
+
         node_id = f"m{i}"
         dot.node(node_id, html)
         dot.edge(prev_node, node_id)
         prev_node = node_id
-    
+
     dot.render(cleanup=True)
     print(f"Generated: {filename}.png")
 
@@ -255,7 +257,7 @@
 def generate_mermaid_gantt(title, sections):
     """
     Generate Mermaid Gantt chart syntax.
-    
+
     sections: list of dicts with keys:
         - name: section name
         - tasks: list of (task_name, start_date, duration) tuples
@@ -263,14 +265,14 @@
     mermaid = f"""gantt
     title {title}
     dateFormat YYYY-MM-DD
-    
+
 """
     for section in sections:
         mermaid += f"    section {section['name']}\n"
         for task in section['tasks']:
             task_name, start, duration = task
             mermaid += f"    {task_name} : {start}, {duration}\n"
-    
+
     return mermaid
 
 # Example
@@ -283,7 +285,7 @@
         ]
     },
     {
-        'name': 'Development', 
+        'name': 'Development',
         'tasks': [
             ('Core Platform', '2025-01-10', '21d'),
             ('Integrations', '2025-01-20', '14d'),
@@ -311,7 +313,7 @@
 def create_parallel_tracks(tracks, filename="parallel-timeline"):
     """
     Create a diagram showing parallel workstreams.
-    
+
     tracks: list of dicts with keys:
         - name: track name
         - phases: list of phase names
@@ -319,31 +321,31 @@
     """
     dot = graphviz.Digraph('Parallel', filename=filename, format='png')
     dot.attr(rankdir='LR')
-    
+
     colors = ['#4472C4', '#ED7D31', '#70AD47', '#FFC000']
-    
+
     # Create subgraphs for alignment
     for i, track in enumerate(tracks):
         color = track.get('color', colors[i % len(colors)])
-        
+
         with dot.subgraph() as s:
             s.attr(rank='same')
-            
+
             prev_node = None
             for j, phase in enumerate(track['phases']):
                 node_id = f"t{i}p{j}"
-                s.node(node_id, phase, shape='box', style='filled', 
+                s.node(node_id, phase, shape='box', style='filled',
                        fillcolor=color, fontcolor='white')
-                
+
                 if prev_node:
                     dot.edge(prev_node, node_id)
                 prev_node = node_id
-        
+
         # Track label
         label_id = f"label{i}"
         dot.node(label_id, track['name'], shape='plaintext', fontsize='12')
         dot.edge(label_id, f"t{i}p0", style='invis')
-    
+
     # Align phases vertically
     max_phases = max(len(t['phases']) for t in tracks)
     for j in range(max_phases):
@@ -352,7 +354,7 @@
             for i in range(len(tracks)):
                 if j < len(tracks[i]['phases']):
                     s.node(f"t{i}p{j}")
-    
+
     dot.render(cleanup=True)
     print(f"Generated: {filename}.png")
 
@@ -376,6 +378,7 @@
 ## Converting ASCII Timelines
 
 When you see:
+
 ```text
 Q1 2025          Q2 2025          Q3 2025          Q4 2025
 |                |                |                |
@@ -386,6 +389,7 @@
 ```
 
 Extract:
+
 1. Time periods (quarters, months, weeks)
 2. Phase/task names
 3. Duration (spans between markers)
```

#### Modified: `.github/skills/azure-diagrams/references/ui-wireframe-diagrams.md` (+8/-41)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/ui-wireframe-diagrams.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/ui-wireframe-diagrams.md	2026-03-04 15:30:02.890137649 +0000
@@ -1,3 +1,5 @@
+<!-- ref:ui-wireframe-diagrams-v1 -->
+
 # UI Wireframe Diagrams
 
 Generate professional UI wireframe mockups showing screen layouts and components.
@@ -13,7 +15,7 @@
 def create_wireframe_html(title, components, filename="wireframe"):
     """
     Create a wireframe as HTML, then convert to PNG.
-    
+
     components: list of dicts describing UI elements
     """
     html = f'''<!DOCTYPE html>
@@ -23,9 +25,9 @@
     <title>{title}</title>
     <style>
         * {{ margin: 0; padding: 0; box-sizing: border-box; }}
-        body {{ 
-            font-family: 'Segoe UI', Arial, sans-serif; 
-            background: #f5f5f5; 
+        body {{
+            font-family: 'Segoe UI', Arial, sans-serif;
+            background: #f5f5f5;
             padding: 20px;
         }}
         .wireframe {{
@@ -188,22 +190,22 @@
     </div>
 </body>
 </html>'''
-    
+
     # Save HTML
     html_path = Path(f"{filename}.html")
     html_path.write_text(html)
-    
+
     # Convert to PNG using wkhtmltoimage or similar
     # Alternative: use playwright, puppeteer, or selenium
     try:
         subprocess.run([
-            'wkhtmltoimage', '--quality', '90', 
+            'wkhtmltoimage', '--quality', '90',
             str(html_path), f"{filename}.png"
         ], check=True, capture_output=True)
         print(f"Generated: {filename}.png")
     except FileNotFoundError:
         print(f"Generated: {filename}.html (install wkhtmltoimage for PNG conversion)")
-    
+
     return html
 
 
@@ -212,44 +214,44 @@
     html = ""
     for comp in components:
         comp_type = comp.get('type')
-        
+
         if comp_type == 'header':
-            nav_items = "".join([f'<div class="nav-item">{item}</div>' 
+            nav_items = "".join([f'<div class="nav-item">{item}</div>'
                                   for item in comp.get('nav', [])])
             html += f'''<div class="header">
                 <h1>{comp.get('title', 'Application')}</h1>
                 <div class="nav">{nav_items}</div>
             </div>'''
-        
+
         elif comp_type == 'sidebar':
             items = ""
             for item in comp.get('items', []):
                 active = ' active' if item.get('active') else ''
                 items += f'<div class="sidebar-item{active}">{item.get("label", "")}</div>'
             html += f'<div class="sidebar">{items}</div>'
-        
+
         elif comp_type == 'main-start':
             html += '<div class="main">'
-        
+
         elif comp_type == 'main-end':
             html += '</div>'
-        
+
         elif comp_type == 'breadcrumb':
             crumbs = " <span>›</span> ".join(comp.get('items', []))
             html += f'<div class="breadcrumb">{crumbs}</div>'
-        
+
         elif comp_type == 'card':
             content = comp.get('content', '')
             if comp.get('placeholder_lines'):
                 content = "".join([
-                    f'<div class="placeholder {line}"></div>' 
+                    f'<div class="placeholder {line}"></div>'
                     for line in comp.get('placeholder_lines')
                 ])
             html += f'''<div class="card">
                 <div class="card-title">{comp.get('title', 'Card')}</div>
                 {content}
             </div>'''
-        
+
         elif comp_type == 'stats':
             stats_html = ""
             for stat in comp.get('items', []):
@@ -258,13 +260,13 @@
                     <div class="stat-label">{stat.get('label', '')}</div>
                 </div>'''
             html += f'<div class="grid">{stats_html}</div>'
-        
+
         elif comp_type == 'search':
             html += f'''<div class="search-box">
                 <input class="input" placeholder="{comp.get('placeholder', 'Search...')}">
                 <div class="button">Search</div>
             </div>'''
-        
+
         elif comp_type == 'table':
             headers = "".join([f'<th>{h}</th>' for h in comp.get('headers', [])])
             rows = ""
@@ -275,17 +277,17 @@
                 <thead><tr>{headers}</tr></thead>
                 <tbody>{rows}</tbody>
             </table>'''
-        
+
         elif comp_type == 'buttons':
             btns = ""
             for btn in comp.get('items', []):
                 btn_class = 'button secondary' if btn.get('secondary') else 'button'
                 btns += f'<div class="{btn_class}">{btn.get("label", "Button")}</div>'
             html += f'<div style="margin-top: 15px;">{btns}</div>'
-        
+
         elif comp_type == 'footer':
             html += f'<div class="footer">{comp.get("text", "")}</div>'
-    
+
     return html
 ```
 
@@ -407,7 +409,7 @@
 ```python
 def create_svg_wireframe(title, width=800, height=600, filename="wireframe"):
     """Create a wireframe as SVG."""
-    
+
     svg = f'''<?xml version="1.0" encoding="UTF-8"?>
 <svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
     <defs>
@@ -417,19 +419,19 @@
             .small {{ font: 10px sans-serif; fill: #666; }}
         </style>
     </defs>
-    
+
     <!-- Background -->
     <rect width="{width}" height="{height}" fill="#f5f5f5"/>
-    
+
     <!-- Window frame -->
-    <rect x="20" y="20" width="{width-40}" height="{height-40}" 
+    <rect x="20" y="20" width="{width-40}" height="{height-40}"
           fill="white" stroke="#333" stroke-width="2" rx="8"/>
-    
+
     <!-- Header -->
     <rect x="20" y="20" width="{width-40}" height="50" fill="#4472C4" rx="8"/>
     <rect x="20" y="50" width="{width-40}" height="20" fill="#4472C4"/>
     <text x="40" y="52" class="title">{title}</text>
-    
+
     <!-- Navigation items -->
     <rect x="500" y="35" width="60" height="25" fill="rgba(255,255,255,0.2)" rx="4"/>
     <text x="515" y="52" class="small" fill="white">Home</text>
@@ -437,11 +439,11 @@
     <text x="580" y="52" class="small" fill="white">Documents</text>
     <rect x="660" y="35" width="70" height="25" fill="rgba(255,255,255,0.2)" rx="4"/>
     <text x="675" y="52" class="small" fill="white">Settings</text>
-    
+
     <!-- Sidebar -->
     <rect x="20" y="70" width="150" height="{height-110}" fill="#f0f0f0"/>
     <line x1="170" y1="70" x2="170" y2="{height-40}" stroke="#ddd"/>
-    
+
     <!-- Sidebar items -->
     <rect x="30" y="85" width="130" height="30" fill="#4472C4" rx="4"/>
     <text x="45" y="105" class="small" fill="white">📊 Dashboard</text>
@@ -451,55 +453,55 @@
     <text x="45" y="185" class="small">👥 Accounts</text>
     <rect x="30" y="205" width="130" height="30" fill="white" stroke="#ddd" rx="4"/>
     <text x="45" y="225" class="small">📋 Reports</text>
-    
+
     <!-- Main content area -->
     <!-- Stats cards -->
     <rect x="190" y="85" width="180" height="80" fill="white" stroke="#ddd" rx="8"/>
     <text x="250" y="125" class="label" text-anchor="middle">12,456</text>
     <text x="250" y="145" class="small" text-anchor="middle">Total Documents</text>
-    
+
     <rect x="385" y="85" width="180" height="80" fill="white" stroke="#ddd" rx="8"/>
     <text x="475" y="125" class="label" text-anchor="middle">342</text>
     <text x="475" y="145" class="small" text-anchor="middle">Pending Review</text>
-    
+
     <rect x="580" y="85" width="180" height="80" fill="white" stroke="#ddd" rx="8"/>
     <text x="670" y="125" class="label" text-anchor="middle">28</text>
     <text x="670" y="145" class="small" text-anchor="middle">New Today</text>
-    
+
     <!-- Content placeholder -->
     <rect x="190" y="180" width="570" height="350" fill="white" stroke="#ddd" rx="8"/>
     <text x="200" y="205" class="label">Recent Documents</text>
     <line x1="190" y1="220" x2="760" y2="220" stroke="#eee"/>
-    
+
     <!-- Table header -->
     <rect x="200" y="235" width="550" height="25" fill="#f5f5f5"/>
     <text x="210" y="252" class="small">Document</text>
     <text x="380" y="252" class="small">Account</text>
     <text x="500" y="252" class="small">Date</text>
     <text x="620" y="252" class="small">Status</text>
-    
+
     <!-- Table rows (placeholders) -->
     <rect x="210" y="270" width="150" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="380" y="270" width="80" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="500" y="270" width="70" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="620" y="270" width="50" height="12" fill="#e0e0e0" rx="2"/>
-    
+
     <rect x="210" y="295" width="140" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="380" y="295" width="85" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="500" y="295" width="70" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="620" y="295" width="60" height="12" fill="#e0e0e0" rx="2"/>
-    
+
     <rect x="210" y="320" width="160" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="380" y="320" width="75" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="500" y="320" width="70" height="12" fill="#e0e0e0" rx="2"/>
     <rect x="620" y="320" width="55" height="12" fill="#e0e0e0" rx="2"/>
-    
+
 </svg>'''
-    
+
     # Save SVG
     with open(f"{filename}.svg", 'w') as f:
         f.write(svg)
-    
+
     # Convert to PNG if cairosvg is available
     try:
         import cairosvg
@@ -514,6 +516,7 @@
 ## Converting ASCII Wireframes
 
 When you see ASCII mockups like:
+
 ```text
 ┌────────────────────────────────────────────────────────────┐
 │  Document Management System          [Home] [Docs] [⚙️]   │
@@ -535,6 +538,7 @@
 ```
 
 Extract:
+
 1. **Header** - Title, navigation items
 2. **Sidebar** - Menu items, active state
 3. **Main content** - Cards, stats, tables
```

#### Modified: `.github/skills/azure-diagrams/references/waf-cost-charts.md` (+1/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/references/waf-cost-charts.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/references/waf-cost-charts.md	2026-03-04 15:30:02.934193739 +0000
@@ -1,3 +1,5 @@
+<!-- ref:waf-cost-charts-v1 -->
+
 # WAF Pillar & Cost Visualization Charts
 
 Generate professional, styled data-visualization charts for Azure Well-Architected
```

#### Modified: `.github/skills/azure-diagrams/SKILL.md` (+101/-348)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-diagrams/SKILL.md	2026-03-04 06:46:56.654989094 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-diagrams/SKILL.md	2026-03-04 08:01:16.521878343 +0000
@@ -1,6 +1,9 @@
 ---
 name: azure-diagrams
-description: "Generates professional Azure architecture diagrams and data-visualization charts (WAF pillar scores, cost distribution, cost projection). Produces Python `diagrams` + matplotlib artifacts (`.py` + `.png`) for Step 2 WAF charts, Step 3 design visuals, and Step 7 as-built documentation."
+description: >-
+  Generates Azure architecture diagrams and WAF/cost charts as Python + PNG artifacts.
+  USE FOR: architecture diagrams, WAF radar charts, cost pie charts, dependency visuals.
+  DO NOT USE FOR: Bicep/Terraform code, ADR writing, troubleshooting, cost calculations.
 compatibility: Requires graphviz system package and Python diagrams library; works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool.
 license: MIT
 metadata:
@@ -11,392 +14,134 @@
 
 # Azure Architecture Diagrams Skill
 
-A comprehensive technical diagramming toolkit for solutions architects, presales engineers,
-and developers. Generate professional diagrams for proposals, documentation, and architecture
-reviews using Python's `diagrams` library.
-
-## 🎯 Output Format
-
-**Default behavior**: Generate PNG images via Python code
-
-| Format         | File Extension | Tool             | Use Case                             |
-| -------------- | -------------- | ---------------- | ------------------------------------ |
-| **Python PNG** | `.py` + `.png` | diagrams library | Programmatic, version-controlled, CI |
-| **SVG**        | `.svg`         | diagrams library | Web documentation (optional)         |
-
-### Output Naming Convention
-
-```text
-agent-output/{project}/
-├── 03-des-diagram.py          # Python source (version controlled)
-├── 03-des-diagram.png         # PNG from Python diagrams
-└── 07-ab-diagram.py/.png      # As-built diagrams
-```
-
-## ⚡ Execution Method
+Generate professional Azure architecture diagrams, WAF bar charts, and cost charts
+using Python `diagrams` + `matplotlib`.
+Output: `.py` source + `.png` in `agent-output/{project}/`.
 
-**Always save diagram source to file first**, then execute it:
+## Prerequisites
 
 ```bash
-# Example (Design phase)
-python3 agent-output/{project}/03-des-diagram.py
-
-# Example (As-built phase)
-python3 agent-output/{project}/07-ab-diagram.py
+pip install diagrams matplotlib pillow && apt-get install -y graphviz
 ```
 
-Required workflow:
+## Execution Method
 
-- ✅ Generate and save `.py` source in `agent-output/{project}/`
-- ✅ Execute saved script to produce `.png` (and optional `.svg`)
-- ✅ Keep source version-controlled for deterministic regeneration
-- ✅ Never use inline heredoc execution for diagram generation
+Save `.py` source in `agent-output/{project}/`, then run to produce `.png`. Never use heredoc execution.
 
-## 📊 Architecture Diagram Contract (Mandatory)
+```bash
+python3 agent-output/{project}/03-des-diagram.py
+```
 
-For Azure workflow artifacts, generate **non-Mermaid** diagrams using Python `diagrams` only.
+## Architecture Diagram Contract
 
 ### Required outputs
 
-- `03-des-diagram.py` + `03-des-diagram.png` (Step 3)
-- `04-dependency-diagram.py` + `04-dependency-diagram.png` (Step 4)
-- `04-runtime-diagram.py` + `04-runtime-diagram.png` (Step 4)
-- `07-ab-diagram.py` + `07-ab-diagram.png` (Step 7, when requested)
-
-### Required naming conventions
-
-- Cluster vars: `clu_<scope>_<slug>` where scope ∈ `sub|rg|net|tier|zone|ext`
-- Node vars: `n_<domain>_<service>_<role>` where domain ∈ `edge|web|app|data|id|sec|ops|int`
-- Edge vars (if reused): `e_<source>_to_<target>_<flow>`
-- Flow taxonomy only: `auth|request|response|read|write|event|replicate|secret|telemetry|admin`
+| Step | Files                                                         |
+| ---- | ------------------------------------------------------------- |
+| 3    | `03-des-diagram.py/.png`                                      |
+| 4    | `04-dependency-diagram.py/.png`, `04-runtime-diagram.py/.png` |
+| 7    | `07-ab-diagram.py/.png` (when requested)                      |
+
+### Naming conventions
+
+- Cluster vars: `clu_<scope>_<slug>` — scope ∈ `sub|rg|net|tier|zone|ext`
+- Node vars: `n_<domain>_<service>_<role>` — domain ∈ `edge|web|app|data|id|sec|ops|int`
+- Edge vars: `e_<source>_to_<target>_<flow>` — flow ∈ `auth|request|response|read|write|event|replicate|secret|telemetry|admin`
 
-### Required layout/style defaults
+### Layout defaults
 
 - `direction="LR"` unless explicitly justified
-- deterministic spacing via `graph_attr` (`nodesep`, `ranksep`, `splines`)
-- short labels (2–4 words)
-- max 3 edge styles (runtime/control/observability)
-
-### Quality gate (score /10)
-
-1. Readable at 100% zoom
-2. No major label overlap
-3. Minimal line crossing
-4. Clear tier grouping
-5. Correct Azure icons
-6. Security boundary visible
-7. Data flow direction clear
-8. Identity/auth flow visible
-9. Telemetry path visible
-10. Naming conventions followed
-
-If score < 9/10, regenerate once with simplification.
-
-## 🔥 Generate from Infrastructure Code
-
-Create diagrams directly from Bicep, Terraform, or ARM templates:
-
-```text
-Read the Bicep files in /infra and generate an architecture diagram
-```
+- Deterministic spacing via `graph_attr` (`nodesep`, `ranksep`, `splines`)
+- Short labels (2–4 words), max 3 edge styles
 
-```text
-Analyze our Terraform modules and create a diagram grouped by subnet
-```
+### Quality gate (/10)
 
-See `references/iac-to-diagram.md` for detailed prompts and examples.
+Readable at 100% zoom · No label overlap · Minimal line crossing ·
+Clear tier grouping · Correct Azure icons · Security boundary visible ·
+Data flow direction clear · Identity/auth flow visible ·
+Telemetry path visible · Naming conventions followed.
+If < 9/10, regenerate with simplification.
 
----
+## Professional Output Standards
 
-## Prerequisites
+Critical settings for clean output — use `labelloc="t"` to keep labels inside clusters:
 
-```bash
-# Core requirements
-pip install diagrams matplotlib pillow
-
-# Graphviz (required for PNG generation)
-apt-get install -y graphviz  # Ubuntu/Debian
-# or: brew install graphviz  # macOS
-# or: choco install graphviz  # Windows
+```python
+node_attr = {"fontname": "Arial Bold", "fontsize": "11", "labelloc": "t"}
+graph_attr = {"bgcolor": "white", "pad": "0.8", "nodesep": "0.9", "ranksep": "0.9",
+              "splines": "spline", "fontname": "Arial Bold", "fontsize": "16", "dpi": "150"}
+cluster_style = {"margin": "30", "fontname": "Arial Bold", "fontsize": "14"}
 ```
 
-## Quick Start
+Requirements: `labelloc='t'` · `Arial Bold` fonts ·
+full resource names from IaC · `dpi="150"+` · `margin="30"+` ·
+CIDR blocks in VNet/Subnet labels.
 
-```python
-from diagrams import Diagram, Cluster, Edge
-from diagrams.azure.compute import FunctionApps, KubernetesServices, AppServices
-from diagrams.azure.network import ApplicationGateway, LoadBalancers
-from diagrams.azure.database import CosmosDb, SQLDatabases, CacheForRedis
-from diagrams.azure.storage import BlobStorage
-from diagrams.azure.integration import LogicApps, ServiceBus, APIManagement
-from diagrams.azure.security import KeyVaults
-from diagrams.azure.identity import ActiveDirectory
-from diagrams.azure.ml import CognitiveServices
-
-with Diagram("Azure Solution Architecture", show=False, direction="TB"):
-    users = ActiveDirectory("Users")
-
-    with Cluster("Frontend"):
-        gateway = ApplicationGateway("App Gateway")
-        web = AppServices("Web App")
-
-    with Cluster("Backend"):
-        api = APIManagement("API Management")
-        functions = FunctionApps("Functions")
-        aks = KubernetesServices("AKS")
-
-    with Cluster("Data"):
-        cosmos = CosmosDb("Cosmos DB")
-        sql = SQLDatabases("SQL Database")
-        redis = CacheForRedis("Redis Cache")
-        blob = BlobStorage("Blob Storage")
-
-    with Cluster("Integration"):
-        bus = ServiceBus("Service Bus")
-        logic = LogicApps("Logic Apps")
-
-    users >> gateway >> web >> api
-    api >> [functions, aks]
-    functions >> [cosmos, bus]
-    aks >> [sql, redis]
-    bus >> logic >> blob
-```
+See `references/quick-reference.md` for full template, connection syntax, cluster hierarchy, and diagram attributes.
 
 ## Azure Service Categories
 
-| Category        | Import                       | Key Services                                                         |
-| --------------- | ---------------------------- | -------------------------------------------------------------------- |
-| **Compute**     | `diagrams.azure.compute`     | VM, AKS, Functions, App Service, Container Apps, Batch               |
-| **Networking**  | `diagrams.azure.network`     | VNet, Load Balancer, App Gateway, Front Door, Firewall, ExpressRoute |
-| **Database**    | `diagrams.azure.database`    | SQL, Cosmos DB, PostgreSQL, MySQL, Redis, Synapse                    |
-| **Storage**     | `diagrams.azure.storage`     | Blob, Files, Data Lake, NetApp, Queue, Table                         |
-| **Integration** | `diagrams.azure.integration` | Logic Apps, Service Bus, Event Grid, APIM, Data Factory              |
-| **Security**    | `diagrams.azure.security`    | Key Vault, Sentinel, Defender, Security Center                       |
-| **Identity**    | `diagrams.azure.identity`    | Entra ID, B2C, Managed Identity, Conditional Access                  |
-| **AI/ML**       | `diagrams.azure.ml`          | Azure OpenAI, Cognitive Services, ML Workspace, Bot Service          |
-| **Analytics**   | `diagrams.azure.analytics`   | Synapse, Databricks, Data Explorer, Stream Analytics, Event Hubs     |
-| **IoT**         | `diagrams.azure.iot`         | IoT Hub, IoT Edge, Digital Twins, Time Series Insights               |
-| **DevOps**      | `diagrams.azure.devops`      | Azure DevOps, Pipelines, Repos, Boards, Artifacts                    |
-| **Web**         | `diagrams.azure.web`         | App Service, Static Web Apps, CDN, Media Services                    |
-| **Monitor**     | `diagrams.azure.monitor`     | Monitor, App Insights, Log Analytics                                 |
+13 categories: Compute, Networking, Database, Storage, Integration, Security,
+Identity, AI/ML, Analytics, IoT, DevOps, Web, Monitor — all under `diagrams.azure.*`.
 
 See `references/azure-components.md` for the complete list of **700+ components**.
 
 ## Common Architecture Patterns
 
-### Web Application (3-Tier)
-
-```python
-from diagrams.azure.network import ApplicationGateway
-from diagrams.azure.compute import AppServices
-from diagrams.azure.database import SQLDatabases
-
-gateway >> AppServices("Web") >> SQLDatabases("DB")
-```
-
-### Microservices with AKS
-
-```python
-from diagrams.azure.compute import KubernetesServices, ContainerRegistries
-from diagrams.azure.network import ApplicationGateway
-from diagrams.azure.database import CosmosDb
-
-gateway >> KubernetesServices("Cluster") >> CosmosDb("Data")
-ContainerRegistries("Registry") >> KubernetesServices("Cluster")
-```
-
-### Serverless / Event-Driven
-
-```python
-from diagrams.azure.compute import FunctionApps
-from diagrams.azure.integration import EventGridTopics, ServiceBus
-from diagrams.azure.storage import BlobStorage
-
-EventGridTopics("Events") >> FunctionApps("Process") >> ServiceBus("Queue")
-BlobStorage("Trigger") >> FunctionApps("Process")
-```
-
-### Data Platform
-
-```python
-from diagrams.azure.analytics import DataFactories, Databricks, SynapseAnalytics
-from diagrams.azure.storage import DataLakeStorage
-
-DataFactories("Ingest") >> DataLakeStorage("Lake") >> Databricks("Transform") >> SynapseAnalytics("Serve")
-```
-
-### Hub-Spoke Networking
-
-```python
-from diagrams.azure.network import VirtualNetworks, Firewall, VirtualNetworkGateways
-
-with Cluster("Hub"):
-    firewall = Firewall("Firewall")
-    vpn = VirtualNetworkGateways("VPN")
-
-with Cluster("Spoke 1"):
-    spoke1 = VirtualNetworks("Workload 1")
-
-spoke1 >> firewall
-```
-
-## Connection Syntax
-
-```python
-# Basic connections
-a >> b                              # Simple arrow
-a >> b >> c                         # Chain
-a >> [b, c, d]                      # Fan-out (one to many)
-[a, b] >> c                         # Fan-in (many to one)
-
-# Labeled connections
-a >> Edge(label="HTTPS") >> b       # With label
-a >> Edge(label="443") >> b         # Port number
-
-# Styled connections
-a >> Edge(style="dashed") >> b      # Dashed line (config/secrets)
-a >> Edge(style="dotted") >> b      # Dotted line
-a >> Edge(color="red") >> b         # Colored
-a >> Edge(color="red", style="bold") >> b  # Combined
-
-# Bidirectional
-a >> Edge(label="sync") << b        # Two-way
-a - Edge(label="peer") - b          # Undirected
-```
-
-## Diagram Attributes
-
-```python
-with Diagram(
-    "Title",
-    show=False,                    # Don't auto-open
-    filename="output",             # Output filename (no extension)
-    direction="TB",                # TB, BT, LR, RL
-    outformat="png",               # png, jpg, svg, pdf
-    graph_attr={
-        "splines": "spline",       # Curved edges
-        "nodesep": "1.0",          # Horizontal spacing
-        "ranksep": "1.0",          # Vertical spacing
-        "pad": "0.5",              # Graph padding
-        "bgcolor": "white",        # Background color
-        "dpi": "150",              # Resolution
-    }
-):
-```
-
-## Clusters (Azure Hierarchy)
-
-Use `Cluster()` for proper Azure hierarchy: Subscription → Resource Group → VNet → Subnet
-
-```python
-with Cluster("Azure Subscription"):
-    with Cluster("rg-app-prod"):
-        with Cluster("vnet-spoke (10.1.0.0/16)"):
-            with Cluster("snet-app"):
-                vm1 = VM("VM 1")
-                vm2 = VM("VM 2")
-            with Cluster("snet-data"):
-                db = SQLDatabases("Database")
-```
-
-Cluster styling:
-
-```python
-with Cluster("Styled", graph_attr={"bgcolor": "#E8F4FD", "style": "rounded"}):
-```
-
-## ⚠️ Professional Output Standards
-
-### The Key Setting: `labelloc='t'`
-
-To keep labels inside cluster boundaries, **put labels ABOVE icons**:
-
-```python
-node_attr = {
-    "fontname": "Arial Bold",
-    "fontsize": "11",
-    "labelloc": "t",  # KEY: Labels at TOP - stays inside clusters!
-}
-
-with Diagram("Title", node_attr=node_attr, ...):
-    # Your diagram code
-```
-
-### Full Professional Template
-
-```python
-from diagrams import Diagram, Cluster, Edge
-from diagrams.azure.compute import KubernetesServices
-from diagrams.azure.database import SQLDatabases
-
-graph_attr = {
-    "bgcolor": "white",
-    "pad": "0.8",
-    "nodesep": "0.9",
-    "ranksep": "0.9",
-    "splines": "spline",
-    "fontname": "Arial Bold",
-    "fontsize": "16",
-    "dpi": "150",
-}
-
-node_attr = {
-    "fontname": "Arial Bold",
-    "fontsize": "11",
-    "labelloc": "t",           # Labels ABOVE icons - KEY!
-}
-
-cluster_style = {"margin": "30", "fontname": "Arial Bold", "fontsize": "14"}
-
-with Diagram("My Architecture",
-             direction="TB",
-             graph_attr=graph_attr,
-             node_attr=node_attr):
+Ready-to-use patterns: 3-Tier Web App, Microservices (AKS),
+Serverless/Event-Driven, Data Platform, Hub-Spoke Networking, and more.
 
-    with Cluster("Data Tier", graph_attr=cluster_style):
-        sql = SQLDatabases("sql-myapp-prod\nS3 tier")
-```
-
-### Professional Standards Checklist
-
-| Check                      | Requirement                              |
-| -------------------------- | ---------------------------------------- |
-| ✅ **labelloc='t'**        | Labels above icons (stays in clusters)   |
-| ✅ **Bold fonts**          | `fontname="Arial Bold"` for readability  |
-| ✅ **Full resource names** | Actual names from IaC, not abbreviations |
-| ✅ **High DPI**            | `dpi="150"` or higher for crisp text     |
-| ✅ **Azure icons**         | Use `diagrams.azure.*` components        |
-| ✅ **Cluster margins**     | `margin="30"` or higher                  |
-| ✅ **CIDR blocks**         | Include IP ranges in VNet/Subnet labels  |
-
-## Troubleshooting
+See `references/common-patterns.md` for all patterns with code.
+See `references/iac-to-diagram.md` to generate diagrams from Bicep/Terraform/ARM.
 
-### Overlapping Nodes
+## Workflow Integration
 
-Increase spacing for complex diagrams:
+| Step | Files                                                                | Description                               |
+| ---- | -------------------------------------------------------------------- | ----------------------------------------- |
+| 2    | `02-waf-scores.py/.png`                                              | WAF pillar score bar chart                |
+| 3    | `03-des-diagram.py/.png`                                             | Proposed architecture                     |
+| 3    | `03-des-cost-distribution.py/.png`, `03-des-cost-projection.py/.png` | Cost donut + projection                   |
+| 7    | `07-ab-diagram.py/.png`                                              | Deployed architecture                     |
+| 7    | `07-ab-cost-*.py/.png`                                               | Cost distribution, projection, comparison |
+| 7    | `07-ab-compliance-gaps.py/.png`                                      | Compliance gaps by severity               |
+
+Suffix rules: `-des` for design (Step 3), `-ab` for as-built (Step 7).
+
+## Data Visualization Charts
 
-```python
-graph_attr={
-    "nodesep": "1.2",   # Horizontal (default 0.25)
-    "ranksep": "1.2",   # Vertical (default 0.5)
-    "pad": "0.5"
-}
-```
+WAF and cost charts use `matplotlib` (never Mermaid). See `references/waf-cost-charts.md` for full implementations.
 
-### Labels Outside Clusters
+**Design tokens:** Background `#F8F9FA` · Azure blue `#0078D4` ·
+Min line `#DC3545` · Target line `#28A745` · Trend `#FF8C00` · Grid `#E0E0E0` · DPI 150.
 
-Use `labelloc="t"` in `node_attr` to place labels above icons.
+**WAF pillar colours:** Security `#C00000` · Reliability `#107C10` ·
+Performance `#FF8C00` · Cost `#FFB900` · Operational Excellence `#8764B8`.
 
-### Missing Icons
+## Generation Workflow
 
-Check available icons:
+1. **Gather Context** — Read Bicep/Terraform templates or architecture assessment
+2. **Identify Resources & Hierarchy** — List Azure resources, map Subscription → RG → VNet → Subnet
+3. **Generate Python Code** — Create diagram with proper clusters and edges
+4. **Execute & Verify** — Run Python to generate PNG, confirm file exists
 
-```python
-from diagrams.azure import network
-print(dir(network))
-```
+## Guardrails
 
-See `references/preventing-overlaps.md` for detailed guidance.
+**DO:** Create files in `agent-output/{project}/` with step-prefixed names ·
+Use valid `diagrams.azure.*` imports · Include docstring with prerequisites ·
+Use `Cluster()` for Azure hierarchy · Include CIDR blocks ·
+Always execute script and verify PNG · Apply design tokens to every chart ·
+Generate `02-waf-scores.png` when WAF scores are assigned.
+
+**DON'T:** Use invalid node types · Create diagrams mismatched to architecture ·
+Skip PNG generation · Overwrite diagrams without consent ·
+Output to legacy `docs/diagrams/` · Use placeholder names ·
+Use Mermaid for WAF/cost charts.
+
+## Scope Exclusions
+
+Does NOT: generate Bicep/Terraform code · create workload docs ·
+deploy resources · create ADRs · perform WAF assessments ·
+build dashboards · render Mermaid diagrams.
 
 ## Scripts
 
@@ -407,144 +152,20 @@
 | `scripts/ascii_to_diagram.py`        | Convert ASCII diagrams from markdown |
 | `scripts/verify_installation.py`     | Check prerequisites                  |
 
-## Reference Files
-
-| File                                         | Content                                            |
-| -------------------------------------------- | -------------------------------------------------- |
-| `references/iac-to-diagram.md`               | **Generate diagrams from Bicep/Terraform/ARM**     |
-| `references/azure-components.md`             | Complete list of 700+ Azure components             |
-| `references/common-patterns.md`              | Ready-to-use architecture patterns                 |
-| `references/business-process-flows.md`       | Workflow and swimlane diagrams                     |
-| `references/entity-relationship-diagrams.md` | Database ERD patterns                              |
-| `references/timeline-gantt-diagrams.md`      | Project timeline diagrams                          |
-| `references/ui-wireframe-diagrams.md`        | UI mockup patterns                                 |
-| `references/preventing-overlaps.md`          | Layout troubleshooting guide                       |
-| `references/sequence-auth-flows.md`          | Authentication flow patterns                       |
-| `references/quick-reference.md`              | Copy-paste code snippets                           |
-| `references/waf-cost-charts.md`              | **WAF pillar bar, cost donut & projection charts** |
-
-## Workflow Integration
-
-This skill produces artifacts in **Step 3** (design) or **Step 7** (as-built).
-
-| Workflow Step     | File Pattern                                                  | Description                                |
-| ----------------- | ------------------------------------------------------------- | ------------------------------------------ |
-| Step 2            | `02-waf-scores.py`, `02-waf-scores.png`                       | WAF pillar score bar chart                 |
-| Step 3 (Design)   | `03-des-diagram.py`, `03-des-diagram.png`                     | Proposed architecture visualization        |
-| Step 3 (Design)   | `03-des-cost-distribution.py`, `03-des-cost-distribution.png` | Monthly cost distribution donut chart      |
-| Step 3 (Design)   | `03-des-cost-projection.py`, `03-des-cost-projection.png`     | 6-month cost projection bar + trend chart  |
-| Step 7 (As-Built) | `07-ab-diagram.py`, `07-ab-diagram.png`                       | Deployed architecture documentation        |
-| Step 7 (As-Built) | `07-ab-cost-distribution.py`, `07-ab-cost-distribution.png`   | As-built cost distribution donut chart     |
-| Step 7 (As-Built) | `07-ab-cost-projection.py`, `07-ab-cost-projection.png`       | As-built 6-month cost projection chart     |
-| Step 7 (As-Built) | `07-ab-cost-comparison.py`, `07-ab-cost-comparison.png`       | Design estimate vs as-built grouped bars   |
-| Step 7 (As-Built) | `07-ab-compliance-gaps.py`, `07-ab-compliance-gaps.png`       | Compliance gaps by severity horizontal bar |
-
-### Artifact Suffix Convention
-
-Apply the appropriate suffix based on when the diagram is generated:
-
-- **`-des`**: Design diagrams (Step 3 artifacts)
-  - Example: `03-des-diagram.py`, `03-des-diagram.png`
-  - Represents: Proposed architecture, conceptual design
-  - Called after: Architecture assessment (Step 2)
-
-- **`-ab`**: As-built diagrams (Step 7 artifacts)
-  - Example: `07-ab-diagram.py`, `07-ab-diagram.png`
-  - Represents: Actual deployed infrastructure
-  - Called after: Deployment (Step 6)
-
-**Suffix Rules:**
-
-1. Design/proposal/planning language → use `-des`
-2. Deployed/implemented/current state language → use `-ab`
-
-## 📊 Data Visualization Charts
-
-Beyond architecture topology diagrams, this skill also generates **styled matplotlib
-charts** for WAF pillar scores and cost estimates. These supplement (not replace)
-the architecture diagrams.
-
-### When to generate
-
-| Trigger           | Chart(s) to generate                                                                      |
-| ----------------- | ----------------------------------------------------------------------------------------- |
-| After WAF scoring | `02-waf-scores.png` — horizontal bar, one colour per pillar                               |
-| After cost design | `03-des-cost-distribution.png` + `03-des-cost-projection.png`                             |
-| After as-built    | `07-ab-cost-distribution.png` + `07-ab-cost-projection.png` + `07-ab-cost-comparison.png` |
-| After compliance  | `07-ab-compliance-gaps.png` — gap counts grouped by severity                              |
-
-### Design tokens (use consistently)
-
-| Token         | Value     | Usage                      |
-| ------------- | --------- | -------------------------- |
-| Background    | `#F8F9FA` | Figure + axes fill         |
-| Title colour  | `#1A1A2E` | Chart title                |
-| Azure blue    | `#0078D4` | Primary bars               |
-| Minimum line  | `#DC3545` | Red dashed WAF reference   |
-| Target line   | `#28A745` | Green dashed WAF reference |
-| Trend line    | `#FF8C00` | Orange dashed projection   |
-| Grid / border | `#E0E0E0` | Subtle grid                |
-| DPI           | 150       | Crisp PNG output           |
-
-### WAF pillar colours
-
-| Pillar                    | Hex colour |
-| ------------------------- | ---------- |
-| 🔒 Security               | `#C00000`  |
-| 🔄 Reliability            | `#107C10`  |
-| ⚡ Performance Efficiency | `#FF8C00`  |
-| 💰 Cost Optimization      | `#FFB900`  |
-| 🔧 Operational Excellence | `#8764B8`  |
-
-See **`references/waf-cost-charts.md`** for full copy-paste Python implementations.
-
----
-
-## Generation Workflow
-
-Follow these steps when creating diagrams:
-
-1. **Gather Context** - Read Bicep templates, deployment summary, or architecture assessment
-2. **Identify Resources** - List all Azure resources to visualize
-3. **Determine Hierarchy** - Map Subscription → RG → VNet → Subnet structure
-4. **Generate Python Code** - Create diagram with proper clusters and edges
-5. **Execute Script** - Run Python to generate PNG
-6. **Verify Output** - Confirm PNG file was created successfully
-
-## Guardrails
-
-### DO
+## Reference Index
 
-- ✅ Create diagram files in `agent-output/{project}/`
-- ✅ Use step-prefixed filenames (`03-des-*` or `07-ab-*`)
-- ✅ Use valid `diagrams.azure.*` imports only
-- ✅ Include docstring with prerequisites and generation command
-- ✅ Match diagram to actual architecture design/deployment
-- ✅ Use `Cluster()` for Azure hierarchy (Subscription → RG → VNet → Subnet)
-- ✅ Include CIDR blocks in VNet/Subnet labels
-- ✅ **ALWAYS execute the Python script to generate the PNG file**
-- ✅ Verify PNG file exists after generation
-- ✅ Use `references/waf-cost-charts.md` patterns for WAF / cost charts
-- ✅ Apply the design tokens table (background, dpi, colours) to every chart
-- ✅ Generate `02-waf-scores.png` whenever WAF pillar scores are assigned
-
-### DO NOT
-
-- ❌ Use invalid or made-up diagram node types
-- ❌ Create diagrams that don't match the actual architecture
-- ❌ Skip the PNG generation step
-- ❌ Overwrite existing diagrams without user consent
-- ❌ Output to legacy `docs/diagrams/` folder (use `agent-output/` instead)
-- ❌ Leave diagram in Python-only state without generating PNG
-- ❌ Use placeholder or generic names instead of actual resource names
-- ❌ Use Mermaid `xychart-beta` for WAF or cost charts (always use matplotlib PNGs)
-
-## What This Skill Does NOT Do
-
-- ❌ Generate Bicep or Terraform code (use `bicep-code` agent)
-- ❌ Create workload documentation (use `azure-artifacts` skill)
-- ❌ Deploy resources (use `deploy` agent)
-- ❌ Create ADRs (use `azure-adr` skill)
-- ❌ Perform WAF assessments (use `architect` agent)
-- ❌ Build interactive dashboards or Power BI reports
-- ❌ Render Mermaid diagrams (all chart outputs are Python-generated PNGs)
+| File                                         | Content                                                                           |
+| -------------------------------------------- | --------------------------------------------------------------------------------- |
+| `references/azure-components.md`             | Complete list of 700+ Azure diagram components                                    |
+| `references/business-process-flows.md`       | Workflow and swimlane diagram patterns                                            |
+| `references/common-patterns.md`              | Ready-to-use architecture patterns (3-tier, microservices, serverless, hub-spoke) |
+| `references/entity-relationship-diagrams.md` | Database ERD patterns                                                             |
+| `references/iac-to-diagram.md`               | Generate diagrams from Bicep/Terraform/ARM templates                              |
+| `references/integration-services.md`         | Integration service diagram patterns                                              |
+| `references/migration-patterns.md`           | Migration architecture patterns                                                   |
+| `references/preventing-overlaps.md`          | Layout troubleshooting and overlap prevention                                     |
+| `references/quick-reference.md`              | Copy-paste snippets: connections, attributes, clusters, templates                 |
+| `references/sequence-auth-flows.md`          | Authentication flow sequence patterns                                             |
+| `references/timeline-gantt-diagrams.md`      | Project timeline and Gantt diagrams                                               |
+| `references/ui-wireframe-diagrams.md`        | UI mockup and wireframe patterns                                                  |
+| `references/waf-cost-charts.md`              | WAF pillar bar, cost donut & projection chart implementations                     |
```

#### Modified: `.github/skills/azure-troubleshooting/SKILL.md` (+41/-180)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/azure-troubleshooting/SKILL.md	2026-03-04 06:46:56.659282597 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/azure-troubleshooting/SKILL.md	2026-03-04 08:01:16.579078343 +0000
@@ -1,270 +1,77 @@
 ---
 name: azure-troubleshooting
-description: Azure resource troubleshooting patterns including KQL templates, metric thresholds, health checks, and remediation playbooks. Use when diagnosing unhealthy Azure resources or building diagnostic workflows.
+description: >-
+  Azure resource diagnostics: KQL templates, metric thresholds, health checks, remediation.
+  USE FOR: resource errors, unhealthy alerts, KQL queries, diagnostic workflows, remediation.
+  DO NOT USE FOR: new infrastructure design, Bicep/Terraform code, architecture diagrams.
 compatibility: Requires Azure CLI with resource-graph extension
 ---
 
 # Azure Troubleshooting Skill
 
 Structured diagnostic patterns for Azure resource health assessment and
-remediation. Provides KQL templates, metric baselines, severity classifications,
-and per-resource-type diagnostic workflows.
+remediation. Load reference files for detailed queries, checks, and playbooks.
 
 ---
 
 ## Quick Reference
 
-| Capability              | Description                                                      |
-| ----------------------- | ---------------------------------------------------------------- |
-| Resource Discovery      | Azure Resource Graph queries to find and inventory resources     |
-| Health Checks           | Per-resource-type diagnostic commands and metric thresholds      |
-| KQL Templates           | Log Analytics queries for common failure scenarios               |
-| Severity Classification | Standardised impact/urgency mapping for findings                 |
-| Remediation Playbooks   | Step-by-step resolution for common issues                        |
+| Capability              | Description                                                  |
+| ----------------------- | ------------------------------------------------------------ |
+| Resource Discovery      | Azure Resource Graph queries to find and inventory resources |
+| Health Checks           | Per-resource-type diagnostic commands and metric thresholds  |
+| KQL Templates           | Log Analytics queries for common failure scenarios           |
+| Severity Classification | Standardised impact/urgency mapping for findings             |
+| Remediation Playbooks   | Step-by-step resolution for common issues                    |
 
 ---
 
-## Resource Discovery via Resource Graph
+## Reference Index
 
-Find resources before diagnosing them:
+Load these files for detailed procedures:
 
-```kql
-// List all resources in a resource group with their health status
-resources
-| where resourceGroup == '{resourceGroupName}'
-| project name, type, location, properties.provisioningState
-| order by type asc, name asc
-```
-
-```kql
-// Find resources with non-Succeeded provisioning state
-resources
-| where resourceGroup == '{resourceGroupName}'
-| where properties.provisioningState != 'Succeeded'
-| project name, type, properties.provisioningState
-```
-
-```kql
-// Inventory resources by type
-resources
-| where resourceGroup == '{resourceGroupName}'
-| summarize count() by type
-| order by count_ desc
-```
-
----
-
-## Diagnostic Settings Check
-
-Verify every resource has diagnostic settings configured:
-
-```bash
-# List resources missing diagnostic settings
-az monitor diagnostic-settings list \
-  --resource "$resourceId" \
-  --query "[].{name:name, workspace:workspaceId}" \
-  --output table
-```
-
-If no diagnostic settings exist, create them using the pattern from the
-`azure-bicep-patterns` skill (Diagnostic Settings section).
-
----
-
-## Per-Resource Health Checks
-
-### App Service / Web Apps
-
-| Check                  | Command / Query                                                          | Healthy Threshold          |
-| ---------------------- | ------------------------------------------------------------------------ | -------------------------- |
-| HTTP health            | `az webapp show --name {name} --query state`                             | `Running`                  |
-| Response time          | KQL: `AzureMetrics \| where MetricName == "HttpResponseTime"`            | p95 < 2 seconds            |
-| HTTP 5xx rate          | KQL: `AzureMetrics \| where MetricName == "Http5xx"`                     | < 1% of total requests     |
-| CPU usage              | KQL: `AzureMetrics \| where MetricName == "CpuPercentage"`              | < 80% sustained            |
-| Memory usage           | KQL: `AzureMetrics \| where MetricName == "MemoryPercentage"`           | < 85% sustained            |
-| App Service Plan SKU   | `az appservice plan show --name {plan} --query sku`                      | Matches architecture spec  |
-
-```kql
-// App Service error rate over last 24h
-AzureMetrics
-| where ResourceId contains '{appName}'
-| where MetricName == 'Http5xx'
-| where TimeGenerated > ago(24h)
-| summarize Total5xx = sum(Total) by bin(TimeGenerated, 1h)
-| order by TimeGenerated desc
-```
-
-### Virtual Machines
-
-| Check             | Command / Query                                                         | Healthy Threshold        |
-| ----------------- | ----------------------------------------------------------------------- | ------------------------ |
-| Power state       | `az vm get-instance-view --name {name} --query instanceView.statuses`   | `PowerState/running`     |
-| CPU utilisation   | KQL: `Perf \| where ObjectName == "Processor"`                          | < 85% sustained          |
-| Available memory  | KQL: `Perf \| where ObjectName == "Memory"`                             | > 20% free               |
-| Disk latency      | KQL: `Perf \| where CounterName == "Avg. Disk sec/Transfer"`           | < 20 ms                  |
-| Boot diagnostics  | `az vm boot-diagnostics get-boot-log --name {name}`                     | No kernel panic / errors |
-
-```kql
-// VM CPU spikes in last 6h
-Perf
-| where Computer == '{vmName}'
-| where ObjectName == 'Processor' and CounterName == '% Processor Time'
-| where TimeGenerated > ago(6h)
-| summarize AvgCPU = avg(CounterValue), MaxCPU = max(CounterValue) by bin(TimeGenerated, 5m)
-| where MaxCPU > 85
-| order by TimeGenerated desc
-```
-
-### Storage Accounts
-
-| Check              | Command / Query                                                          | Healthy Threshold          |
-| ------------------ | ------------------------------------------------------------------------ | -------------------------- |
-| Availability       | KQL: `AzureMetrics \| where MetricName == "Availability"`               | > 99.9%                    |
-| E2E latency        | KQL: `AzureMetrics \| where MetricName == "SuccessE2ELatency"`          | < 100 ms (hot), <1s (cool)|
-| Throttling         | KQL: `StorageBlobLogs \| where StatusCode == 503`                        | 0 in normal operation      |
-| Used capacity      | `az storage account show --name {name} --query primaryEndpoints`         | < 80% quota                |
-| HTTPS enforcement  | `az storage account show --name {name} --query enableHttpsTrafficOnly`   | `true`                     |
-
-### SQL Database
-
-| Check              | Command / Query                                                          | Healthy Threshold          |
-| ------------------ | ------------------------------------------------------------------------ | -------------------------- |
-| DTU/vCore usage    | KQL: `AzureMetrics \| where MetricName == "dtu_consumption_percent"`     | < 80% sustained            |
-| Connection failures| KQL: `AzureMetrics \| where MetricName == "connection_failed"`           | < 5 per 5-min window       |
-| Deadlocks          | KQL: `AzureMetrics \| where MetricName == "deadlock"`                    | 0                          |
-| Storage usage      | KQL: `AzureMetrics \| where MetricName == "storage_percent"`             | < 85%                      |
-| Long queries       | `sys.dm_exec_query_stats` via Azure Portal                               | No queries > 30s           |
-
-### Static Web Apps
-
-| Check              | Command / Query                                                          | Healthy Threshold          |
-| ------------------ | ------------------------------------------------------------------------ | -------------------------- |
-| Deployment status  | `az staticwebapp show --name {name} --query defaultHostname`             | Resolves correctly         |
-| Custom domain      | `az staticwebapp hostname list --name {name}`                            | SSL valid, not expired     |
-| Function health    | Check managed function app logs in Log Analytics                         | No 5xx in API routes       |
+| Reference                             | Contents                                                                                               |
+| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
+| `references/kql-templates.md`         | Resource Graph discovery, App Service / VM / generic error KQL, activity log queries                   |
+| `references/health-checks.md`         | Diagnostic settings check, per-resource health tables (App Service, VM, Storage, SQL, Static Web Apps) |
+| `references/remediation-playbooks.md` | Six-phase diagnostic workflow, report template, CPU / throttling / DTU playbooks                       |
 
 ---
 
 ## Severity Classification
 
-Classify every finding with consistent severity:
-
-| Severity | Criteria                                                                | Response Time    |
-| -------- | ----------------------------------------------------------------------- | ---------------- |
-| Critical | Service down, data loss risk, security breach                           | Immediate        |
-| High     | Degraded performance, failing redundancy, auth issues                   | Within 4 hours   |
-| Medium   | Suboptimal configuration, missing best practices, capacity warnings     | Within 24 hours  |
-| Low      | Cosmetic issues, documentation gaps, minor optimisations                | Next sprint      |
+| Severity | Criteria                                                            | Response Time   |
+| -------- | ------------------------------------------------------------------- | --------------- |
+| Critical | Service down, data loss risk, security breach                       | Immediate       |
+| High     | Degraded performance, failing redundancy, auth issues               | Within 4 hours  |
+| Medium   | Suboptimal configuration, missing best practices, capacity warnings | Within 24 hours |
+| Low      | Cosmetic issues, documentation gaps, minor optimisations            | Next sprint     |
 
 ---
 
-## Diagnostic Workflow
-
-Follow this six-phase sequence for any resource investigation:
-
-### Phase 1 — Discovery
-
-```bash
-# Get resource details
-az resource show --ids "$resourceId" --query "{name:name, type:type, location:location, sku:sku, tags:tags}"
-```
-
-### Phase 2 — Health Assessment
-
-Run the resource-type-specific health checks from the tables above.
-
-### Phase 3 — Log Analysis
-
-```kql
-// Generic error search — last 24h
-AzureDiagnostics
-| where ResourceId contains '{resourceName}'
-| where TimeGenerated > ago(24h)
-| where Level == 'Error' or Level == 'Warning'
-| summarize Count = count() by Level, OperationName
-| order by Count desc
-```
+## Diagnostic Workflow (Summary)
 
-### Phase 4 — Activity Log Review
-
-```bash
-# Recent operations that may have caused issues
-az monitor activity-log list \
-  --resource-id "$resourceId" \
-  --start-time "$(date -d '24 hours ago' -u +%Y-%m-%dT%H:%M:%SZ)" \
-  --query "[?status.value=='Failed'].{op:operationName.localizedValue, time:eventTimestamp, status:status.value, caller:caller}" \
-  --output table
-```
-
-### Phase 5 — Classification
-
-Rate each finding using the severity table above. Include:
-
-- **Finding**: What is wrong
-- **Severity**: Critical / High / Medium / Low
-- **Evidence**: KQL query result or CLI output
-- **Remediation**: Specific fix steps
-
-### Phase 6 — Report Generation
-
-Structure the diagnostic report as:
-
-```markdown
-## Diagnostic Report: {resource-name}
-
-**Assessment Date**: {date}
-**Assessed By**: InfraOps Diagnose Agent
-**Overall Health**: 🟢 Healthy | 🟡 Degraded | 🔴 Unhealthy
-
-### Findings Summary
-
-| # | Finding | Severity | Status |
-|---|---------|----------|--------|
-| 1 | ...     | High     | Open   |
-
-### Detailed Findings
-
-#### Finding 1: {title}
-...
-
-### Recommended Actions
-1. ...
-```
+1. **Discovery** — `az resource show` to get resource details
+2. **Health Assessment** — Run resource-type checks (`references/health-checks.md`)
+3. **Log Analysis** — KQL error search (`references/kql-templates.md`)
+4. **Activity Log Review** — Failed operations query (`references/kql-templates.md`)
+5. **Classification** — Rate findings using severity table above
+6. **Report Generation** — Use report template (`references/remediation-playbooks.md`)
 
 ---
 
-## Common Remediation Playbooks
-
-### High CPU on App Service
-
-1. Check if autoscale is configured — if not, add scale-out rule at 70% CPU
-2. Review Application Insights for slow dependencies
-3. Check for synchronous blocking calls in application code
-4. Consider scaling up the App Service Plan SKU
+## Supported Resource Types
 
-### Storage Account Throttling
-
-1. Check current request rate against [storage scalability targets](https://learn.microsoft.com/azure/storage/common/scalability-targets-standard-account)
-2. Enable CDN for read-heavy blob workloads
-3. Distribute across multiple storage accounts if partition limits hit
-4. Switch to Premium storage for high-IOPS requirements
-
-### SQL Database DTU Exhaustion
-
-1. Identify top resource-consuming queries via Query Performance Insight
-2. Add missing indexes suggested by Azure SQL advisor
-3. Scale up DTU tier or switch to vCore for more granular control
-4. Review connection pooling settings in application
+App Service, Virtual Machines, Storage Accounts, SQL Database, Static Web Apps.
+See `references/health-checks.md` for thresholds and commands per type.
 
 ---
 
 ## Learn More
 
-For issues not covered here, query official documentation:
-
-| Topic                    | How to Find                                                                      |
-| ------------------------ | -------------------------------------------------------------------------------- |
-| Service-specific limits  | `microsoft_docs_search(query="{service} limits quotas")`                         |
-| KQL reference            | `microsoft_docs_search(query="KQL quick reference Azure Monitor")`               |
-| Metric definitions       | `microsoft_docs_search(query="{service} supported metrics Azure Monitor")`       |
-| Troubleshooting guides   | `microsoft_docs_search(query="{service} troubleshoot common issues")`            |
+| Topic                   | How to Find                                                                |
+| ----------------------- | -------------------------------------------------------------------------- |
+| Service-specific limits | `microsoft_docs_search(query="{service} limits quotas")`                   |
+| KQL reference           | `microsoft_docs_search(query="KQL quick reference Azure Monitor")`         |
+| Metric definitions      | `microsoft_docs_search(query="{service} supported metrics Azure Monitor")` |
+| Troubleshooting guides  | `microsoft_docs_search(query="{service} troubleshoot common issues")`      |
```

#### Modified: `.github/skills/context-optimizer/references/token-estimation.md` (+1/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/context-optimizer/references/token-estimation.md	2026-03-04 06:46:56.676456611 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/context-optimizer/references/token-estimation.md	2026-03-04 15:30:02.822050964 +0000
@@ -1,3 +1,5 @@
+<!-- ref:token-estimation-v1 -->
+
 # Token Estimation Reference
 
 Detailed heuristics for estimating context window token costs from observable
```

#### Modified: `.github/skills/context-optimizer/SKILL.md` (+9/-1)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/context-optimizer/SKILL.md	2026-03-04 06:46:56.676456611 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/context-optimizer/SKILL.md	2026-03-04 15:30:02.577739921 +0000
@@ -1,6 +1,9 @@
 ---
 name: context-optimizer
-description: "Analyzes Copilot Chat debug logs, agent definitions, skills, and instruction files to audit context window utilization. Provides log parsing, turn-cost profiling, redundancy detection, hand-off gap analysis, and optimization recommendations. Use when optimizing agent context efficiency, identifying where to add subagent hand-offs, or reducing token waste across agent systems."
+description: >-
+  Audits agent context window usage via debug logs, token profiling, and redundancy detection.
+  USE FOR: context optimization, token waste analysis, debug log parsing, hand-off gap analysis.
+  DO NOT USE FOR: Azure infrastructure, Bicep/Terraform code, architecture design, deployments.
 compatibility: Requires Python 3.10+ for log parser script
 ---
 
@@ -292,3 +295,11 @@
 - `scripts/parse-chat-logs.py` — Log parser producing structured JSON
 - `templates/optimization-report.md` — Report output template
 - `references/token-estimation.md` — Detailed token cost heuristics
+
+---
+
+## Reference Index
+
+| Reference                        | When to Load                                          |
+| -------------------------------- | ----------------------------------------------------- |
+| `references/token-estimation.md` | When estimating token counts for context optimization |
```

#### Modified: `.github/skills/docs-writer/references/doc-standards.md` (+44/-36)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/docs-writer/references/doc-standards.md	2026-03-04 06:46:56.663576101 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/docs-writer/references/doc-standards.md	2026-03-04 15:30:02.733938785 +0000
@@ -1,3 +1,5 @@
+<!-- ref:doc-standards-v1 -->
+
 # Documentation Standards Reference
 
 > For use by the `docs-writer` skill. Consolidates rules from
@@ -18,11 +20,11 @@
 
 ## Heading Rules
 
-| Rule | Detail |
-| --- | --- |
-| Single H1 | Only the document title uses `#` |
-| ATX style | Always `##`, `###` — never underline style |
-| No H4+ | Avoid `####` and deeper; restructure content instead |
+| Rule      | Detail                                                |
+| --------- | ----------------------------------------------------- |
+| Single H1 | Only the document title uses `#`                      |
+| ATX style | Always `##`, `###` — never underline style            |
+| No H4+    | Avoid `####` and deeper; restructure content instead  |
 | Numbering | Template artifacts use numbered H2s (`## 1. Section`) |
 
 ## Line Length
@@ -38,12 +40,12 @@
 
 ## Link Conventions
 
-| Type | Format |
-| --- | --- |
-| Internal docs | `[Quickstart](quickstart.md)` — relative paths |
-| Cross-folder | `[Workflow](../docs/workflow.md)` — relative from source |
+| Type          | Format                                                                               |
+| ------------- | ------------------------------------------------------------------------------------ |
+| Internal docs | `[Quickstart](quickstart.md)` — relative paths                                       |
+| Cross-folder  | `[Workflow](../docs/workflow.md)` — relative from source                             |
 | External URLs | Reference-style: `[Azure docs][azure-waf]` with `[azure-waf]: https://...` at bottom |
-| Anchors | `[Section](#section-name)` — lowercase, hyphenated |
+| Anchors       | `[Section](#section-name)` — lowercase, hyphenated                                   |
 
 ## Mermaid Diagrams
 
@@ -76,32 +78,32 @@
 
 Always specify language after opening backticks:
 
-- Bicep: `` ```bicep ``
-- PowerShell: `` ```powershell ``
-- Bash: `` ```bash ``
-- JSON: `` ```json ``
-- YAML: `` ```yaml ``
-- Markdown: `` ```markdown ``
-- Plain text: `` ```text ``
+- Bicep: ` ```bicep `
+- PowerShell: ` ```powershell `
+- Bash: ` ```bash `
+- JSON: ` ```json `
+- YAML: ` ```yaml `
+- Markdown: ` ```markdown `
+- Plain text: ` ```text `
 
 ## Tables
 
-| Standard | Rule |
-| --- | --- |
-| Header row | Always include |
-| Alignment | Left-align by default (use `\| --- \|`) |
+| Standard     | Rule                                                |
+| ------------ | --------------------------------------------------- |
+| Header row   | Always include                                      |
+| Alignment    | Left-align by default (use `\| --- \|`)             |
 | Pipe spacing | Space after opening pipe, space before closing pipe |
-| Column width | Keep readable; align pipes vertically |
+| Column width | Keep readable; align pipes vertically               |
 
 ## Prohibited References
 
 These agents were removed and converted to skills. Never reference them:
 
-| Removed Agent | Replacement Skill |
-| --- | --- |
-| `diagram.agent.md` | `azure-diagrams` skill |
-| `adr.agent.md` | `azure-adr` skill |
-| `docs.agent.md` | `azure-artifacts` skill |
+| Removed Agent      | Replacement Skill       |
+| ------------------ | ----------------------- |
+| `diagram.agent.md` | `azure-diagrams` skill  |
+| `adr.agent.md`     | `azure-adr` skill       |
+| `docs.agent.md`    | `azure-artifacts` skill |
 
 Also avoid references to removed paths:
 
@@ -111,12 +113,12 @@
 
 ## Content Principles
 
-| Principle | Application |
-| --- | --- |
-| **DRY** | Single source of truth per topic |
-| **Current state** | No historical context in main docs |
-| **Action-oriented** | Every section answers "how do I...?" |
-| **Minimal** | If it doesn't help users today, remove it |
+| Principle                  | Application                                |
+| -------------------------- | ------------------------------------------ |
+| **DRY**                    | Single source of truth per topic           |
+| **Current state**          | No historical context in main docs         |
+| **Action-oriented**        | Every section answers "how do I...?"       |
+| **Minimal**                | If it doesn't help users today, remove it  |
 | **Prompt guide for depth** | Point to `docs/prompt-guide/` for examples |
 
 ## Validation Commands
@@ -150,15 +152,15 @@
 
 Personas use consistent emoji in `docs/README.md`:
 
-| Persona | Emoji | Agent |
-| --- | --- | --- |
-| Maestro | 🎼 | InfraOps Conductor |
-| Scribe | 📜 | Requirements |
-| Oracle | 🏛️ | Architect |
-| Artisan | 🎨 | Design |
-| Strategist | 📐 | Bicep Plan |
-| Forge | ⚒️ | Bicep Code |
-| Envoy | 🚀 | Deploy |
-| Sentinel | 🔍 | Diagnose |
+| Persona    | Emoji | Agent              |
+| ---------- | ----- | ------------------ |
+| Maestro    | 🎼    | InfraOps Conductor |
+| Scribe     | 📜    | Requirements       |
+| Oracle     | 🏛️    | Architect          |
+| Artisan    | 🎨    | Design             |
+| Strategist | 📐    | Bicep Plan         |
+| Forge      | ⚒️    | Bicep Code         |
+| Envoy      | 🚀    | Deploy             |
+| Sentinel   | 🔍    | Diagnose           |
 
 When adding a new agent, choose a unique emoji + persona name.
```

#### Modified: `.github/skills/docs-writer/references/freshness-checklist.md` (+1/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/docs-writer/references/freshness-checklist.md	2026-03-04 06:46:56.667869604 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/docs-writer/references/freshness-checklist.md	2026-03-04 15:30:02.822050964 +0000
@@ -1,3 +1,5 @@
+<!-- ref:freshness-checklist-v1 -->
+
 # Freshness Checklist
 
 > For use by the `docs-writer` skill. Defines audit targets and auto-fix
```

#### Modified: `.github/skills/docs-writer/references/repo-architecture.md` (+1/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/docs-writer/references/repo-architecture.md	2026-03-04 06:46:56.667869604 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/docs-writer/references/repo-architecture.md	2026-03-04 15:30:02.822050964 +0000
@@ -1,3 +1,5 @@
+<!-- ref:repo-architecture-v1 -->
+
 # Repo Architecture Reference
 
 > For use by the `docs-writer` skill. Last verified: 2026-02-26.
```

#### Modified: `.github/skills/docs-writer/SKILL.md` (+6/-0)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/docs-writer/SKILL.md	2026-03-04 06:46:56.659282597 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/docs-writer/SKILL.md	2026-03-04 15:30:02.645826605 +0000
@@ -225,3 +225,11 @@
 - `references/repo-architecture.md` — Repo structure, entity inventory
 - `references/doc-standards.md` — Formatting conventions, validation
 - `references/freshness-checklist.md` — Audit targets and auto-fix rules
+
+## Reference Index
+
+| Reference                           | When to Load                          |
+| ----------------------------------- | ------------------------------------- |
+| `references/doc-standards.md`       | When checking documentation standards |
+| `references/freshness-checklist.md` | When running freshness audits         |
+| `references/repo-architecture.md`   | When analyzing repo structure         |
```

#### Modified: `.github/skills/golden-principles/SKILL.md` (+4/-1)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/golden-principles/SKILL.md	2026-03-04 06:46:56.680750115 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/golden-principles/SKILL.md	2026-03-04 06:47:05.121669268 +0000
@@ -1,6 +1,9 @@
 ---
 name: golden-principles
-description: Agent-first operating principles adapted from Harness Engineering philosophy. The 10 invariants that govern how agents work in this repository.
+description: >-
+  The 10 agent-first operating principles governing how agents work in this repository.
+  USE FOR: agent behavior rules, operating philosophy, principle lookup, governance invariants.
+  DO NOT USE FOR: Azure infrastructure, code generation, troubleshooting, diagram creation.
 ---
 
 # Golden Principles
```

#### Modified: `.github/skills/make-skill-template/SKILL.md` (+9/-6)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/make-skill-template/SKILL.md	2026-03-04 06:46:56.672163108 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/make-skill-template/SKILL.md	2026-03-04 06:47:05.121669268 +0000
@@ -1,6 +1,9 @@
 ---
 name: make-skill-template
-description: Scaffolds new GitHub Copilot Agent Skills from prompts or templates, generating SKILL.md frontmatter, folder structure, and optional bundled resources.
+description: >-
+  Scaffolds new Agent Skills with SKILL.md frontmatter, folder structure, and bundled resources.
+  USE FOR: create a skill, scaffold skill, new skill template, add agent capability.
+  DO NOT USE FOR: Azure infrastructure, Bicep/Terraform code, architecture decisions.
 ---
 
 # Make Skill Template
@@ -155,7 +158,7 @@
 
 ## Project-Specific Scaffold Templates
 
-When creating skills for *this* project, use one of these skeletons that match
+When creating skills for _this_ project, use one of these skeletons that match
 the conventions already established in the repository.
 
 ### Azure Knowledge Skill Skeleton
@@ -170,7 +173,7 @@
 ---
 ```
 
-```markdown
+````markdown
 # Azure {Topic} Skill
 
 One-sentence overview of what this skill provides.
@@ -197,10 +200,10 @@
 
 ## Learn More
 
-| Topic | How to Find |
-| ----- | ----------- |
+| Topic | How to Find                          |
+| ----- | ------------------------------------ |
 | ...   | `microsoft_docs_search(query="...")` |
-```
+````
 
 ### Integration Skill Skeleton
 
@@ -232,6 +235,7 @@
 ## Workflow
 
 ### Step 1: ...
+
 ### Step 2: ...
 
 ---
```

#### Modified: `.github/skills/session-resume/SKILL.md` (+47/-251)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/session-resume/SKILL.md	2026-03-04 06:46:56.693630625 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/session-resume/SKILL.md	2026-03-04 07:44:19.400555937 +0000
@@ -1,344 +1,78 @@
 ---
 name: session-resume
-description: "Session state tracking and resume protocol for the 7-step agent workflow. Defines the 00-session-state.json schema, context budget per step, sub-step checkpoints, and resume detection logic. Agents read this skill to persist progress and recover from mid-step interruptions, cross-step handoffs, or direct invocations in fresh chat threads."
+description: >-
+  Session state tracking and resume protocol for the 7-step agent workflow.
+  USE FOR: resume session, persist progress, checkpoint recovery, session-state.json schema.
+  DO NOT USE FOR: Azure infrastructure, code generation, architecture design, troubleshooting.
 compatibility: All agents (01-Conductor through 08-As-Built)
 ---
 
 # Session Resume Skill
 
-Enables any agent in the 7-step workflow to persist its progress to a
-machine-readable JSON state file and resume from the last checkpoint after
-an interruption — whether mid-step, cross-step, or via direct invocation.
+Persist agent progress to `00-session-state.json` and resume from the last
+checkpoint after any interruption — mid-step, cross-step, or direct invocation.
 
----
-
-## When to Use This Skill
+## When to Use
 
-- Starting any agent step (read state → detect resume vs fresh start)
-- Completing a sub-step checkpoint (write state update)
-- Finishing a step (mark complete, list produced artifacts)
-- Conductor gate transitions (update state alongside `00-handoff.md`)
-- Resuming work after a chat crash or thread switch
-
----
+- Starting / resuming any agent step
+- Completing a sub-step checkpoint or finishing a step
+- Conductor gate transitions
+- Recovering after a chat crash or thread switch
 
 ## Quick Reference
 
-| Concept           | Description                                                 |
-| ----------------- | ----------------------------------------------------------- |
-| State file        | `agent-output/{project}/00-session-state.json`              |
-| Human companion   | `agent-output/{project}/00-handoff.md` (unchanged)          |
-| Resume detection  | Read JSON → check step status → branch accordingly          |
-| Context budget    | Hard limit on files loaded at startup per step              |
-| Sub-step tracking | Numbered checkpoints within each step for mid-step recovery |
-
----
-
-## JSON Schema: `00-session-state.json`
-
-```json
-{
-  "schema_version": "1.0",
-  "project": "{project-name}",
-  "iac_tool": "Bicep | Terraform",
-  "region": "swedencentral",
-  "branch": "main",
-  "updated": "2026-03-02T10:00:00Z",
-  "current_step": 1,
-  "decisions": {
-    "region": "swedencentral",
-    "compliance": "None",
-    "budget": "~$50/mo",
-    "architecture_pattern": "",
-    "deployment_strategy": ""
-  },
-  "open_findings": [],
-  "steps": {
-    "1": {
-      "name": "Requirements",
-      "agent": "02-Requirements",
-      "status": "pending",
-      "sub_step": null,
-      "started": null,
-      "completed": null,
-      "artifacts": [],
-      "context_files_used": []
-    },
-    "2": {
-      "name": "Architecture",
-      "agent": "03-Architect",
-      "status": "pending",
-      "sub_step": null,
-      "started": null,
-      "completed": null,
-      "artifacts": [],
-      "context_files_used": []
-    },
-    "3": {
-      "name": "Design",
-      "agent": "04-Design",
-      "status": "pending",
-      "sub_step": null,
-      "started": null,
-      "completed": null,
-      "artifacts": [],
-      "context_files_used": []
-    },
-    "4": {
-      "name": "IaC Plan",
-      "agent": "05b-Bicep Planner | 05t-Terraform Planner",
-      "status": "pending",
-      "sub_step": null,
-      "started": null,
-      "completed": null,
-      "artifacts": [],
-      "context_files_used": []
-    },
-    "5": {
-      "name": "IaC Code",
-      "agent": "06b-Bicep CodeGen | 06t-Terraform CodeGen",
-      "status": "pending",
-      "sub_step": null,
-      "started": null,
-      "completed": null,
-      "artifacts": [],
-      "context_files_used": []
-    },
-    "6": {
-      "name": "Deploy",
-      "agent": "07b-Bicep Deploy | 07t-Terraform Deploy",
-      "status": "pending",
-      "sub_step": null,
-      "started": null,
-      "completed": null,
-      "artifacts": [],
-      "context_files_used": []
-    },
-    "7": {
-      "name": "As-Built",
-      "agent": "08-As-Built",
-      "status": "pending",
-      "sub_step": null,
-      "started": null,
-      "completed": null,
-      "artifacts": [],
-      "context_files_used": []
-    }
-  }
-}
-```
-
-### Field Definitions
-
-| Field               | Type           | Description                                                   |
-| ------------------- | -------------- | ------------------------------------------------------------- |
-| `schema_version`    | string         | Always `"1.0"` — increment on breaking changes                |
-| `project`           | string         | Project folder name (kebab-case)                              |
-| `iac_tool`          | string         | `"Bicep"` or `"Terraform"` — set after Step 1                 |
-| `region`            | string         | Primary Azure region                                          |
-| `branch`            | string         | Active Git branch                                             |
-| `updated`           | ISO string     | Last modification timestamp                                   |
-| `current_step`      | integer        | Step number currently in progress (1-7)                       |
-| `decisions`         | object         | Key project decisions (accumulated across steps)              |
-| `open_findings`     | array          | Unresolved `must_fix` challenger findings (titles only)       |
-| `steps.N.status`    | string         | `pending` / `in_progress` / `complete` / `skipped`            |
-| `steps.N.sub_step`  | string or null | Current sub-step checkpoint identifier (e.g. `"phase_2_waf"`) |
-| `steps.N.artifacts` | array          | File paths produced by this step                              |
-
----
-
-## Context Budget Table
-
-Each agent loads ONLY the files listed below at startup. No exceptions.
-Skills are loaded AFTER the prerequisites check, not at agent init.
-
-| Step | Agent        | Max Files | Allowed Files                                                                            |
-| ---- | ------------ | --------- | ---------------------------------------------------------------------------------------- |
-| 1    | Requirements | 1         | `00-session-state.json`                                                                  |
-| 2    | Architect    | 2         | `00-session-state.json` + `01-requirements.md`                                           |
-| 3    | Design       | 2         | `00-session-state.json` + `02-architecture-assessment.md`                                |
-| 4    | Planner      | 2         | `00-session-state.json` + `02-architecture-assessment.md`                                |
-| 5    | CodeGen      | 3         | `00-session-state.json` + `04-implementation-plan.md` + `04-governance-constraints.json` |
-| 6    | Deploy       | 2         | `00-session-state.json` + `05-implementation-reference.md`                               |
-| 7    | As-Built     | 3         | `00-session-state.json` + `06-deployment-summary.md` + `02-architecture-assessment.md`   |
-
-> Additional files (e.g. `04-governance-constraints.md` for CodeGen) may be
-> loaded on-demand during a specific sub-step — never at startup.
-
----
-
-## Resume Detection Protocol
+| Concept          | Key Detail                                                    |
+| ---------------- | ------------------------------------------------------------- |
+| State file       | `agent-output/{project}/00-session-state.json`                |
+| Human companion  | `agent-output/{project}/00-handoff.md`                        |
+| Resume detection | Read JSON → check `steps.{N}.status` → branch accordingly    |
+| Status values    | `pending` / `in_progress` / `complete` / `skipped`           |
+| Context budget   | Hard limit on files loaded at startup per step (1-3 files)    |
+| Sub-step tracking| Numbered checkpoint written to `sub_step` after each phase   |
+| Write rule       | Always overwrite full JSON atomically; always update `updated`|
 
-Every agent MUST execute this protocol as its **first action** (before reading
-skills, templates, or predecessor artifacts):
+## Resume Flow (compact)
 
 ```text
-1. Check if `agent-output/{project}/00-session-state.json` exists
-   ├─ NO  → Fresh start. Create state file from template. Proceed normally.
-   └─ YES → Read it. Check steps.{my_step}.status:
-            ├─ "pending"      → First run of this step. Set to "in_progress". Proceed normally.
-            ├─ "in_progress"  → RESUME. Read sub_step field:
-            │                    ├─ null → Step started but no sub-step recorded. Restart step.
-            │                    └─ "phase_X_..." → Skip to that checkpoint. Do NOT re-read
-            │                       files already listed in context_files_used.
-            ├─ "complete"     → Step already done. Inform user. Offer to re-run or return.
-            └─ "skipped"      → Step was skipped (e.g. Step 3). Proceed to next.
+00-session-state.json exists?
+  NO  → Fresh start (create from template)
+  YES → steps.{N}.status?
+        pending     → set "in_progress", proceed
+        in_progress → read sub_step, skip to checkpoint
+        complete    → inform user, offer re-run
+        skipped     → proceed to next step
 ```
 
-### Direct Invocation Detection
+## State Write Moments
 
-When an agent is invoked directly (not via Conductor), it must also check
-whether PRIOR steps are complete:
+1. **Step start** — `status: "in_progress"`, set `started`
+2. **Sub-step done** — update `sub_step`, append `artifacts`, update `updated`
+3. **Step done** — `status: "complete"`, set `completed`, clear `sub_step`
+4. **Decision made** — add to `decisions` object
+5. **Challenger finding** — append/remove in `open_findings`
 
-```text
-1. Read 00-session-state.json
-2. For each step < my_step:
-   ├─ "complete" or "skipped" → OK
-   └─ "pending" or "in_progress" → WARN user that prerequisites may be incomplete.
-      Offer to: (a) proceed anyway, (b) hand off to the Conductor.
-```
-
----
-
-## Sub-Step Checkpoints
-
-Each agent defines numbered internal phases. After completing each phase,
-the agent writes the checkpoint to `steps.{N}.sub_step` in the JSON state.
-
-### Step 1: Requirements (02-Requirements)
-
-| Checkpoint          | After completing...                     |
-| ------------------- | --------------------------------------- |
-| `phase_1_discovery` | Phase 1 business discovery questions    |
-| `phase_2_workload`  | Phase 2 workload pattern detection      |
-| `phase_3_nfr`       | Phase 3 NFR and compliance questions    |
-| `phase_4_technical` | Phase 4 technical questions             |
-| `phase_5_artifact`  | Artifact generation + challenger review |
-
-### Step 2: Architecture (03-Architect)
-
-| Checkpoint           | After completing...                  |
-| -------------------- | ------------------------------------ |
-| `phase_1_prereqs`    | Prerequisites validated              |
-| `phase_2_waf`        | WAF assessment drafted               |
-| `phase_3_cost`       | Cost estimate generated via subagent |
-| `phase_4_challenger` | Challenger reviews complete          |
-| `phase_5_artifact`   | Final artifacts saved                |
-
-### Step 3: Design (04-Design)
-
-| Checkpoint         | After completing...            |
-| ------------------ | ------------------------------ |
-| `phase_1_prereqs`  | Prerequisites validated        |
-| `phase_2_diagram`  | Architecture diagram generated |
-| `phase_3_adr`      | ADR(s) drafted                 |
-| `phase_4_artifact` | All design artifacts saved     |
-
-### Step 4: IaC Plan (05b/05t Planner)
-
-| Checkpoint           | After completing...                     |
-| -------------------- | --------------------------------------- |
-| `phase_1_governance` | Governance discovery complete           |
-| `phase_2_avm`        | AVM module verification done            |
-| `phase_3_plan`       | Implementation plan drafted             |
-| `phase_3.5_strategy` | Deployment strategy confirmed by user   |
-| `phase_4_diagrams`   | Dependency + runtime diagrams generated |
-| `phase_5_challenger` | Challenger reviews complete             |
-| `phase_6_artifact`   | All plan artifacts saved                |
-
-### Step 5: IaC Code (06b/06t CodeGen)
-
-| Checkpoint             | After completing...                      |
-| ---------------------- | ---------------------------------------- |
-| `phase_1_preflight`    | Preflight check complete                 |
-| `phase_1.5_governance` | Governance compliance mapping done       |
-| `phase_2_scaffold`     | Project scaffolded (main + modules dirs) |
-| `phase_3_modules`      | All modules generated                    |
-| `phase_4_lint`         | Lint + review subagents passed           |
-| `phase_5_challenger`   | Challenger reviews complete              |
-| `phase_6_artifact`     | Implementation reference saved           |
-
-### Step 6: Deploy (07b/07t Deploy)
-
-| Checkpoint         | After completing...                       |
-| ------------------ | ----------------------------------------- |
-| `phase_1_auth`     | Azure CLI auth validated                  |
-| `phase_2_preview`  | What-if / plan output reviewed            |
-| `phase_3_deploy`   | Deployment executed (per-phase if phased) |
-| `phase_4_verify`   | Post-deployment verification done         |
-| `phase_5_artifact` | Deployment summary saved                  |
-
-### Step 7: As-Built (08-As-Built)
-
-| Checkpoint          | After completing...                         |
-| ------------------- | ------------------------------------------- |
-| `phase_1_prereqs`   | All prior artifacts + deployed state read   |
-| `phase_2_inventory` | Resource inventory generated                |
-| `phase_3_docs`      | Design doc + runbook + compliance generated |
-| `phase_4_cost`      | As-built cost estimate via subagent         |
-| `phase_5_diagram`   | As-built diagram generated                  |
-| `phase_6_index`     | Documentation index + README updated        |
-
----
-
-## State Write Protocol
-
-Agents update `00-session-state.json` at these moments:
-
-1. **Step start**: Set `status: "in_progress"`, `started: {ISO timestamp}`
-2. **Sub-step completion**: Update `sub_step` to the checkpoint name,
-   append any new files to `artifacts`, update `updated` timestamp
-3. **Step completion**: Set `status: "complete"`, `completed: {ISO timestamp}`,
-   `sub_step: null`, finalize `artifacts` list
-4. **Decision made**: Add to top-level `decisions` object
-5. **Challenger finding**: Append unresolved `must_fix` titles to `open_findings`;
-   remove resolved ones
-
-> Always overwrite the file atomically (write complete JSON, not patches).
-> Always update the `updated` field.
-
-### Write Example (sub-step completion)
-
-After completing Phase 2 (WAF assessment) in the Architect agent:
+## Minimal State Snippet
 
 ```json
 {
+  "schema_version": "1.0",
+  "project": "my-project",
+  "current_step": 2,
+  "updated": "2026-03-02T10:15:00Z",
   "steps": {
     "2": {
       "status": "in_progress",
       "sub_step": "phase_2_waf",
-      "started": "2026-03-02T10:05:00Z",
-      "artifacts": ["agent-output/{project}/02-architecture-assessment.md"],
-      "context_files_used": ["00-session-state.json", "01-requirements.md"]
+      "artifacts": ["agent-output/my-project/02-architecture-assessment.md"]
     }
-  },
-  "updated": "2026-03-02T10:15:00Z",
-  "current_step": 2
+  }
 }
 ```
 
----
-
-## Conductor Integration
-
-The Conductor agent has additional responsibilities:
-
-1. **Project init**: Create `00-session-state.json` from template alongside
-   the project directory. Set `project`, `branch`, initial `current_step: 1`.
-2. **Gate transitions**: Update JSON state AND `00-handoff.md` at every gate.
-   The JSON is the machine source of truth; the Markdown is for human review.
-3. **Resume**: Read `00-session-state.json` FIRST (instant state recovery).
-   Fall back to `00-handoff.md` → artifact scan only if JSON is missing.
-4. **Routing**: Set `iac_tool` in JSON after Step 1 completes (determines
-   which agent names populate steps 4-6).
-
----
-
-## Portability
-
-This skill is designed for reuse across projects:
+## Reference Index
 
-- JSON schema is generic (no project-specific fields)
-- Resume protocol works with any numbered step workflow
-- Sub-step checkpoints are defined per agent, not per project
-- Template file can be copied to bootstrap new workflows
+| Reference | File | Content |
+| --------- | ---- | ------- |
+| Recovery Protocol | `references/recovery-protocol.md` | Resume detection, direct invocation, state write protocol, Conductor integration, portability |
+| State File Schema | `references/state-file-schema.md` | Full JSON template, all 7 step definitions, field definitions table |
+| Context Budgets   | `references/context-budgets.md`   | Per-step file budget table, all sub-step checkpoint tables (Steps 1-7) |
```

#### Modified: `.github/skills/terraform-patterns/SKILL.md` (+41/-343)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/.github/skills/terraform-patterns/SKILL.md	2026-03-04 06:46:56.697924129 +0000
+++ /workspaces/azure-agentic-infraops/.github/skills/terraform-patterns/SKILL.md	2026-03-04 08:01:16.579078343 +0000
@@ -1,249 +1,42 @@
 ---
 name: terraform-patterns
-description: Common Azure Terraform infrastructure patterns using AVM-TF modules, including hub-spoke networking, private endpoints, diagnostic settings, conditional deployments, module composition, managed identity, and plan interpretation. Includes AVM Known Pitfalls section. Use when designing or generating Terraform templates that combine multiple Azure resources into repeatable patterns.
+description: >-
+  Reusable Azure Terraform patterns: hub-spoke, private endpoints, diagnostics, AVM-TF modules.
+  USE FOR: Terraform template design, hub-spoke networking, AVM modules, plan interpretation.
+  DO NOT USE FOR: Bicep code, architecture decisions, troubleshooting, diagram generation.
 compatibility: Requires Terraform >= 1.9, azurerm ~> 4.0, Azure CLI
 ---
 
 # Azure Terraform Patterns Skill
 
-Reusable infrastructure patterns for Azure Terraform templates. These patterns complement
-the `terraform-code-best-practices.instructions.md` (style rules) and `azure-defaults`
-skill (naming, tags, regions) with composable architecture building blocks.
+Composable architecture building blocks for Azure Terraform. Complements
+`terraform-code-best-practices.instructions.md` (style) and `azure-defaults` skill (naming, tags, regions).
 
 ---
 
 ## Quick Reference
 
-| Pattern                  | When to Use                                      |
-| ------------------------ | ------------------------------------------------ |
-| Hub-Spoke Networking     | Multi-workload environments with shared services |
-| Private Endpoint Wiring  | Any PaaS service requiring private connectivity  |
-| Diagnostic Settings      | Every deployed resource (mandatory)              |
-| Conditional Deployment   | Optional resources controlled by variables       |
-| Module Composition       | Calling multiple AVM modules in the root module  |
-| Managed Identity Binding | Any service-to-service authentication            |
-| Plan Interpretation      | Pre-deployment validation and change analysis    |
+| Pattern                 | When to Use                                      | Reference                                |
+| ----------------------- | ------------------------------------------------ | ---------------------------------------- |
+| Hub-Spoke Networking    | Multi-workload environments with shared services | `references/hub-spoke-pattern.md`        |
+| Private Endpoint Wiring | Any PaaS service requiring private connectivity  | `references/private-endpoint-pattern.md` |
+| Diagnostic Settings     | Every deployed resource (mandatory)              | `references/common-patterns.md`          |
+| Conditional Deployment  | Optional resources controlled by variables       | `references/common-patterns.md`          |
+| Module Composition      | Calling multiple AVM modules in root module      | See inline example below                 |
+| Managed Identity        | Any service-to-service authentication            | `references/common-patterns.md`          |
+| Plan Interpretation     | Pre-deployment validation and change analysis    | `references/plan-interpretation.md`      |
+| AVM Pitfalls            | Set-type diffs, provider pins, 4.x changes       | `references/avm-pitfalls.md`             |
 
 ---
 
-## Pattern 1 — Hub-Spoke Networking
+## Canonical Example — Module Composition
 
-Standard pattern using AVM-TF VNet module with peering:
+Wire AVM child modules by passing outputs as inputs; never hardcode IDs:
 
 ```hcl
-# Hub VNet
-module "hub_vnet" {
-  source  = "Azure/avm-res-network-virtualnetwork/azurerm"
-  version = "~> 0.7"
-
-  name                = "vnet-hub-${local.suffix}"
-  resource_group_name = azurerm_resource_group.hub.name
-  location            = var.location
-  address_space       = ["10.0.0.0/16"]
-
-  subnets = {
-    AzureFirewallSubnet = { address_prefixes = ["10.0.1.0/24"] }
-    GatewaySubnet       = { address_prefixes = ["10.0.2.0/24"] }
-  }
-
-  tags = local.tags
-}
-
-# Spoke VNet
-module "spoke_vnet" {
-  source  = "Azure/avm-res-network-virtualnetwork/azurerm"
-  version = "~> 0.7"
-
-  name                = "vnet-spoke-${var.workload}-${local.suffix}"
-  resource_group_name = azurerm_resource_group.spoke.name
-  location            = var.location
-  address_space       = [var.spoke_address_prefix]
-
-  peerings = {
-    to-hub = {
-      remote_virtual_network_resource_id = module.hub_vnet.resource_id
-      allow_forwarded_traffic            = true
-      allow_gateway_transit              = false
-      use_remote_gateways                = false
-    }
-  }
-
-  tags = local.tags
-}
-```
-
-Key rules:
-
-- Hub contains shared infrastructure (firewall, gateway, DNS)
-- Spokes peer to hub — never to each other directly
-- Use `module.hub_vnet.resource_id` output to wire peering in spoke modules
-- Apply NSGs per subnet via the `subnets` map, not per VNet
-
----
-
-## Pattern 2 — Private Endpoints
-
-Standard three-resource pattern using AVM-TF private endpoint module:
-
-```hcl
-# Private endpoint for a PaaS service
-module "storage_private_endpoint" {
-  source  = "Azure/avm-res-network-privateendpoint/azurerm"
-  version = "~> 0.1"
-
-  name                = "pe-${local.st_name}-${local.suffix}"
-  resource_group_name = azurerm_resource_group.this.name
-  location            = var.location
-
-  private_connection_resource_id = module.storage.resource_id
-  subnet_resource_id             = module.spoke_vnet.subnets["PrivateEndpoints"].resource_id
-
-  private_dns_zone_group_name = "default"
-  private_dns_zone_resource_ids = [
-    azurerm_private_dns_zone.blob.id
-  ]
-
-  subresource_names = ["blob"]
-  tags              = local.tags
-}
-
-# Private DNS Zone (one per service type)
-resource "azurerm_private_dns_zone" "blob" {
-  name                = "privatelink.blob.core.windows.net"
-  resource_group_name = azurerm_resource_group.networking.name
-  tags                = local.tags
-}
-
-resource "azurerm_private_dns_zone_virtual_network_link" "blob" {
-  name                  = "pdnslink-blob-${local.suffix}"
-  resource_group_name   = azurerm_resource_group.networking.name
-  private_dns_zone_name = azurerm_private_dns_zone.blob.name
-  virtual_network_id    = module.spoke_vnet.resource_id
-  registration_enabled  = false
-  tags                  = local.tags
-}
-```
-
-Common `subresource_names` per service:
-
-| Service        | Subresource | Private DNS Zone                     |
-| -------------- | ----------- | ------------------------------------ |
-| Storage (Blob) | `blob`      | `privatelink.blob.core.windows.net`  |
-| Storage (File) | `file`      | `privatelink.file.core.windows.net`  |
-| Key Vault      | `vault`     | `privatelink.vaultcore.azure.net`    |
-| SQL Server     | `sqlServer` | `privatelink.database.windows.net`   |
-| Container Reg. | `registry`  | `privatelink.azurecr.io`             |
-| App Service    | `sites`     | `privatelink.azurewebsites.net`      |
-| Service Bus    | `namespace` | `privatelink.servicebus.windows.net` |
-| Cosmos DB      | `Sql`       | `privatelink.documents.azure.com`    |
-
----
-
-## Pattern 3 — Diagnostic Settings
-
-Use the AVM-TF diagnostics module for every deployed resource. Pass the
-Log Analytics workspace ID via module outputs:
-
-```hcl
-module "log_analytics" {
-  source  = "Azure/avm-res-operationalinsights-workspace/azurerm"
-  version = "~> 0.4"
-
-  name                = "log-${var.project}-${var.environment}-${local.suffix}"
-  resource_group_name = azurerm_resource_group.this.name
-  location            = var.location
-  tags                = local.tags
-}
-
-# Attach diagnostics to each resource — pass workspace ID as output
-module "storage_diagnostics" {
-  source  = "Azure/avm-res-insights-diagnosticsetting/azurerm"
-  version = "~> 0.1"
-
-  name                           = "diag-${local.st_name}"
-  target_resource_id             = module.storage.resource_id
-  log_analytics_workspace_id     = module.log_analytics.resource_id
-  log_analytics_destination_type = "Dedicated"
-
-  logs_destinations_ids = [module.log_analytics.resource_id]
-}
-```
-
-Rule: Every resource in the deployment MUST have a diagnostic setting pointing
-to the central Log Analytics workspace.
-
----
-
-## Pattern 4 — Conditional Deployment
-
-Use `count` for simple boolean toggles. Use `for_each` for named, keyed resources:
-
-```hcl
-# Boolean toggle pattern
-variable "deploy_bastion" {
-  description = "Deploy Azure Bastion host."
-  type        = bool
-  default     = false
-}
-
-resource "azurerm_bastion_host" "this" {
-  count = var.deploy_bastion ? 1 : 0
-
-  name                = "bas-${var.project}-${var.environment}"
-  resource_group_name = azurerm_resource_group.this.name
-  location            = var.location
-
-  ip_configuration {
-    name                 = "configuration"
-    subnet_id            = module.spoke_vnet.subnets["AzureBastionSubnet"].resource_id
-    public_ip_address_id = azurerm_public_ip.bastion[0].id
-  }
-
-  tags = local.tags
-}
-
-# Referencing a conditional resource output safely
-output "bastion_id" {
-  value = var.deploy_bastion ? azurerm_bastion_host.this[0].id : null
-}
-```
-
-Use `for_each` over `count` whenever resources have distinct names to avoid
-index-based drift when items are added or removed:
-
-```hcl
-variable "storage_accounts" {
-  type = map(object({ sku = string }))
-  default = {
-    data    = { sku = "Standard_LRS" }
-    backups = { sku = "Standard_GRS" }
-  }
-}
-
-resource "azurerm_storage_account" "this" {
-  for_each = var.storage_accounts
-
-  name                = "st${each.key}${local.suffix}"
-  resource_group_name = azurerm_resource_group.this.name
-  location            = var.location
-  account_tier        = "Standard"
-  account_replication_type = each.value.sku
-  tags                = local.tags
-}
-```
-
----
-
-## Pattern 5 — Module Composition
-
-Root module wires multiple AVM child modules, passing outputs as inputs:
-
-```hcl
-# main.tf — root module orchestration
 module "resource_group" {
   source  = "Azure/avm-res-resources-resourcegroup/azurerm"
   version = "~> 0.1"
-
   name     = "rg-${var.project}-${var.environment}"
   location = var.location
   tags     = local.tags
@@ -252,258 +45,40 @@
 module "key_vault" {
   source  = "Azure/avm-res-keyvault-vault/azurerm"
   version = "~> 0.9"
-
   name                = local.kv_name
-  resource_group_name = module.resource_group.name   # ← output from previous module
+  resource_group_name = module.resource_group.name  # ← output wiring
   location            = var.location
   tenant_id           = data.azurerm_client_config.current.tenant_id
   tags                = local.tags
 }
-
-module "app_service" {
-  source  = "Azure/avm-res-web-site/azurerm"
-  version = "~> 0.13"
-
-  name                = "app-${var.project}-${var.environment}-${local.suffix}"
-  resource_group_name = module.resource_group.name   # ← shared output
-  location            = var.location
-  service_plan_id     = module.app_service_plan.resource_id  # ← chained output
-  tags                = local.tags
-
-  app_settings = {
-    KEY_VAULT_URI = module.key_vault.uri  # ← chained output
-  }
-}
 ```
 
-Rules:
-
-- Always pass **resource IDs and names** from module outputs, never hardcode
-- Use `data.azurerm_client_config.current` for tenant and client IDs
-- Chain outputs through locals when the same value is used 3+ times
-
 ---
 
-## Pattern 6 — Managed Identity
-
-Use SystemAssigned managed identity + RBAC role assignments:
-
-```hcl
-# Assign system identity to the app
-resource "azurerm_linux_web_app" "this" {
-  name                = "app-${var.project}-${var.environment}-${local.suffix}"
-  resource_group_name = azurerm_resource_group.this.name
-  location            = var.location
-  service_plan_id     = module.app_service_plan.resource_id
-
-  identity {
-    type = "SystemAssigned"
-  }
-
-  tags = local.tags
-}
+## Key Rules
 
-# Grant app access to Key Vault secrets
-resource "azurerm_role_assignment" "app_kv_secrets" {
-  scope                = module.key_vault.resource_id
-  role_definition_name = "Key Vault Secrets User"
-  principal_id         = azurerm_linux_web_app.this.identity[0].principal_id
-}
-
-# Grant app access to Storage Blob
-resource "azurerm_role_assignment" "app_storage_blob" {
-  scope                = module.storage.resource_id
-  role_definition_name = "Storage Blob Data Contributor"
-  principal_id         = azurerm_linux_web_app.this.identity[0].principal_id
-}
-```
-
-Common role assignments:
-
-| Service      | Role                            |
-| ------------ | ------------------------------- |
-| Key Vault    | `Key Vault Secrets User`        |
-| Storage Blob | `Storage Blob Data Contributor` |
-| Service Bus  | `Azure Service Bus Data Sender` |
-| Event Hub    | `Azure Event Hubs Data Sender`  |
-| ACR          | `AcrPull`                       |
+- **AVM-first**: Use `Azure/avm-res-*` registry modules over raw `azurerm_*` resources
+- **Hub-spoke**: Spokes peer to hub only; never spoke-to-spoke
+- **Private endpoints**: Three resources per service — PE, DNS zone, VNet link
+- **Diagnostics**: Every resource MUST have a diagnostic setting → Log Analytics
+- **Conditional**: Use `for_each` (keyed) over `count` (indexed) for named resources
+- **Identity**: SystemAssigned managed identity + RBAC; avoid keys/connection strings
+- **Provider pin**: `~> 4.0` (allows 4.x patches, blocks 5.0)
+- **Telemetry**: Set `enable_telemetry = false` in restricted-network environments
+- **Moved blocks**: Use `moved {}` when renaming resources to prevent destroy/recreate
 
 ---
 
-## Pattern 7 — Plan Interpretation
-
-Reading `terraform plan` output to assess impact before applying:
-
-```bash
-# Generate a plan
-terraform plan -out=plan.tfplan
-
-# Human-readable summary
-terraform show plan.tfplan
-
-# Machine-readable JSON for analysis
-terraform show -json plan.tfplan > plan.json
-```
-
-### Change Type Symbols
-
-| Symbol | Meaning         | Action                                           |
-| ------ | --------------- | ------------------------------------------------ |
-| `+`    | Create          | New resource — safe                              |
-| `-`    | Destroy         | Resource deleted — REVIEW before applying        |
-| `~`    | Update in-place | Attribute change — usually safe                  |
-| `-/+`  | Destroy/Create  | Replace — causes downtime for stateful resources |
-| `<=`   | Read            | Data source refresh — non-destructive            |
-
-### Red Flags in Plan Output
-
-- `-/+` on databases, Key Vaults, storage accounts — stateful, causes data risk
-- Large number of `~` changes on Application Gateway / NSG — likely Set-type phantom diff (see pitfalls)
-- `destroy` on resources with `prevent_destroy = true` — Terraform will error
-
-### Plan Summary Assessment
-
-```bash
-# Quick count of changes
-terraform show -json plan.tfplan | \
-  python3 -c "
-import json, sys
-plan = json.load(sys.stdin)
-changes = plan.get('resource_changes', [])
-by_action = {}
-for c in changes:
-    a = '+'.join(c['change']['actions'])
-    by_action[a] = by_action.get(a, 0) + 1
-for k, v in sorted(by_action.items()): print(f'{k}: {v}')
-"
-```
-
----
-
-## Terraform AVM Known Pitfalls
-
-### Set-Type Attribute Phantom Diffs
-
-AzureRM resources using Terraform's `Set` type (Application Gateway, Load Balancer,
-NSG, Azure Firewall, Front Door) compare elements by hash rather than logical identity.
-Adding or removing ONE element causes ALL elements to appear as changed.
-
-**Affected resources**: `azurerm_application_gateway`, `azurerm_lb`,
-`azurerm_network_security_group`, `azurerm_firewall`, `azurerm_frontdoor`
-
-**Detection**: Plan shows many `~` changes after adding a single rule.
-
-**Mitigation**:
-
-```hcl
-# Use ignore_changes for set-type blocks when managed externally
-lifecycle {
-  ignore_changes = [
-    backend_address_pool,
-    backend_http_settings,
-    http_listener,
-    request_routing_rule,
-    probe,
-  ]
-}
-```
-
-For full analysis, use the set-diff analyzer skill in `docs/tf-support/SKILL.md`.
-
-### Provider Version Constraint Pitfalls
-
-```hcl
-# ❌ Too permissive — crosses breaking major versions
-version = ">= 3.0"
-
-# ❌ Too strict — blocks patch updates
-version = "= 4.1.0"
-
-# ✅ Correct — pins to azurerm 4.x, gets patch updates
-version = "~> 4.0"
-```
-
-`~> 4.0` allows `4.0.1`, `4.1.0`, `4.9.x` but NOT `5.0.0`.
-`~> 4.1` allows `4.1.0`, `4.1.1` but NOT `4.2.0`.
-
-### Ignore Changes for Externally-Managed Tags
-
-Some Azure services (e.g., Azure Policy Modify) auto-inject tags at deployment.
-Without `ignore_changes`, every `terraform plan` shows phantom tag diff:
-
-```hcl
-resource "azurerm_resource_group" "this" {
-  # ...
-  lifecycle {
-    ignore_changes = [tags["DateCreated"], tags["auto-managed-tag"]]
-  }
-}
-```
-
-### `for_each` Over `count` for Named Resources
-
-Using `count` for resources with distinct identities causes drift when items
-are inserted or removed from the middle of a list (Terraform reindexes):
-
-```hcl
-# ❌ count — deletes resource[1] and recreates resource[2] as resource[1]
-resource "azurerm_subnet" "this" {
-  count = length(var.subnet_names)
-  name  = var.subnet_names[count.index]
-}
-
-# ✅ for_each — stable key-based identity
-resource "azurerm_subnet" "this" {
-  for_each = toset(var.subnet_names)
-  name     = each.value
-}
-```
-
-### `moved` Block for Resource Renaming
-
-Renaming a resource identifier without a `moved` block causes destroy + recreate:
-
-```hcl
-# Old: resource "azurerm_key_vault" "main"
-# New: resource "azurerm_key_vault" "this"
-
-# Add moved block to prevent destroy/recreate
-moved {
-  from = azurerm_key_vault.main
-  to   = azurerm_key_vault.this
-}
-```
-
-`moved` blocks can also handle module renames:
-
-```hcl
-moved {
-  from = module.old_name
-  to   = module.new_name
-}
-```
-
-Remove `moved` blocks after the state migration is confirmed in all environments.
-
-### AVM Module `enable_telemetry` Default
-
-AVM-TF modules deploy a `null_resource` for telemetry by default.
-To disable in environments where outbound network is restricted:
-
-```hcl
-module "key_vault" {
-  source           = "Azure/avm-res-keyvault-vault/azurerm"
-  version          = "~> 0.9"
-  enable_telemetry = false
-  # ...
-}
-```
-
-### azurerm 4.x Breaking Changes from 3.x
-
-- `azurerm_storage_account`: `allow_blob_public_access` renamed to `allow_nested_items_to_be_public`
-- `azurerm_storage_account`: `enable_https_traffic_only` renamed to `https_traffic_only_enabled`
-- `azurerm_app_service` and `azurerm_function_app` removed — use `azurerm_linux_web_app` / `azurerm_windows_web_app`
-- `azurerm_sql_*` resources largely replaced by `azurerm_mssql_*`
-
-Always run `terraform validate` after upgrading the azurerm provider version.
+## Reference Index
+
+| File                                       | Contents                                                          |
+| ------------------------------------------ | ----------------------------------------------------------------- |
+| `references/hub-spoke-pattern.md`          | Full hub & spoke VNet + peering HCL                               |
+| `references/private-endpoint-pattern.md`   | PE + DNS zone + VNet link HCL, subresource table                  |
+| `references/common-patterns.md`            | Diagnostics, conditional deployment, module composition, identity |
+| `references/plan-interpretation.md`        | Plan commands, change symbols, red flags, summary script          |
+| `references/avm-pitfalls.md`               | Set-type diffs, provider pins, tag ignore, moved blocks, 4.x      |
+| `references/tf-best-practices-examples.md` | Best-practice code examples                                       |
+| `references/bootstrap-backend-template.md` | Backend bootstrap template                                        |
+| `references/deploy-script-template.md`     | Deployment script template                                        |
+| `references/project-scaffold.md`           | Project scaffolding structure                                     |
```

#### Added: `.github/skills/azure-artifacts/references/01-requirements-template.md` (+27 lines)

#### Added: `.github/skills/azure-artifacts/references/02-architecture-template.md` (+32 lines)

#### Added: `.github/skills/azure-artifacts/references/04-plan-template.md` (+45 lines)

#### Added: `.github/skills/azure-artifacts/references/05-code-template.md` (+14 lines)

#### Added: `.github/skills/azure-artifacts/references/06-deploy-template.md` (+15 lines)

#### Added: `.github/skills/azure-artifacts/references/07-docs-template.md` (+127 lines)

#### Added: `.github/skills/azure-artifacts/references/cost-estimate-sections.md` (+358 lines)

#### Added: `.github/skills/azure-artifacts/references/styling-standards.md` (+116 lines)

#### Added: `.github/skills/azure-bicep-patterns/references/avm-pitfalls.md` (+59 lines)

#### Added: `.github/skills/azure-bicep-patterns/references/common-patterns.md` (+147 lines)

#### Added: `.github/skills/azure-bicep-patterns/references/hub-spoke-pattern.md` (+40 lines)

#### Added: `.github/skills/azure-bicep-patterns/references/private-endpoint-pattern.md` (+58 lines)

#### Added: `.github/skills/azure-defaults/references/adversarial-checklists.md` (+104 lines)

#### Added: `.github/skills/azure-defaults/references/adversarial-review-protocol.md` (+72 lines)

#### Added: `.github/skills/azure-defaults/references/artifact-type-categories.md` (+43 lines)

#### Added: `.github/skills/azure-defaults/references/avm-modules.md` (+67 lines)

#### Added: `.github/skills/azure-defaults/references/azure-cli-auth-validation.md` (+36 lines)

#### Added: `.github/skills/azure-defaults/references/governance-discovery.md` (+97 lines)

#### Added: `.github/skills/azure-defaults/references/naming-full-examples.md` (+45 lines)

#### Added: `.github/skills/azure-defaults/references/policy-effect-decision-tree.md` (+32 lines)

#### Added: `.github/skills/azure-defaults/references/pricing-guidance.md` (+55 lines)

#### Added: `.github/skills/azure-defaults/references/research-workflow.md` (+48 lines)

#### Added: `.github/skills/azure-defaults/references/security-baseline-full.md` (+97 lines)

#### Added: `.github/skills/azure-defaults/references/service-matrices.md` (+54 lines)

#### Added: `.github/skills/azure-defaults/references/terraform-conventions.md` (+63 lines)

#### Added: `.github/skills/azure-defaults/references/waf-criteria.md` (+33 lines)

#### Added: `.github/skills/azure-troubleshooting/references/health-checks.md` (+80 lines)

#### Added: `.github/skills/azure-troubleshooting/references/kql-templates.md` (+85 lines)

#### Added: `.github/skills/azure-troubleshooting/references/remediation-playbooks.md` (+91 lines)

#### Added: `.github/skills/iac-common/SKILL.md` (+118 lines)

#### Added: `.github/skills/session-resume/references/context-budgets.md` (+100 lines)

#### Added: `.github/skills/session-resume/references/recovery-protocol.md` (+92 lines)

#### Added: `.github/skills/session-resume/references/state-file-schema.md` (+114 lines)

#### Added: `.github/skills/terraform-patterns/references/avm-pitfalls.md` (+129 lines)

#### Added: `.github/skills/terraform-patterns/references/bootstrap-backend-template.md` (+122 lines)

#### Added: `.github/skills/terraform-patterns/references/common-patterns.md` (+196 lines)

#### Added: `.github/skills/terraform-patterns/references/deploy-script-template.md` (+117 lines)

#### Added: `.github/skills/terraform-patterns/references/hub-spoke-pattern.md` (+58 lines)

#### Added: `.github/skills/terraform-patterns/references/plan-interpretation.md` (+51 lines)

#### Added: `.github/skills/terraform-patterns/references/private-endpoint-pattern.md` (+59 lines)

#### Added: `.github/skills/terraform-patterns/references/project-scaffold.md` (+79 lines)

#### Added: `.github/skills/terraform-patterns/references/tf-best-practices-examples.md` (+206 lines)

### AGENTS.md

#### Modified: `AGENTS.md` (+17/-1)

```diff
--- /workspaces/azure-agentic-infraops/agent-output/_baselines/m1-baseline-main/AGENTS.md	2026-03-04 06:46:56.710804639 +0000
+++ /workspaces/azure-agentic-infraops/AGENTS.md	2026-03-04 15:30:02.225291202 +0000
@@ -174,7 +174,6 @@
 docs/                  # User-facing documentation
 .vscode/
   mcp.json             # MCP server configuration (github, microsoft-learn, azure-pricing, terraform)
-  infraops.toolsets.jsonc  # Workspace tool groups for interactive chat (8 toolsets)
 ```
 
 ### Agent Workflow (7 Steps)
@@ -194,6 +193,15 @@
 The Conductor agent orchestrates the full workflow with human approval gates.
 Review column = adversarial passes by `challenger-review-subagent` (3x = rotating lenses; 1x = comprehensive).
 
+### Content Sharing Decision Framework
+
+| Content Type            | Mechanism                                | When to Use                                    |
+| ----------------------- | ---------------------------------------- | ---------------------------------------------- |
+| Enforcement rules       | Instructions (auto-loaded by glob)       | Rules that must apply to all files of a type   |
+| Shared domain knowledge | Skill `references/`                      | Deep content loaded on-demand by agents        |
+| Executable scripts      | Skill `scripts/` (NOT `references/`)     | Deterministic operations, build/deploy scripts |
+| Cross-agent boilerplate | Subagent or instruction with narrow glob | Repeated patterns across multiple agent bodies |
+
 ## Terraform Conventions
 
 - **Provider pin**: `~> 4.0` (AzureRM)
@@ -219,3 +227,16 @@
 - SQL databases: Azure AD-only authentication
 - Production environments: disable public network access on data services
 - Always check `04-governance-constraints.md` for subscription-level Azure Policy requirements
+
+## Quarterly Context Audit
+
+Run every 3 months to prevent context bloat regression:
+
+1. `npm run lint:skill-size` — check for skills >200 lines without references
+2. `npm run lint:agent-body-size` — check for agents >350 lines
+3. `npm run lint:glob-audit` — check for broad wildcards on large files
+4. `npm run lint:skill-references` — check for orphaned reference files
+5. `npm run lint:orphaned-content` — check for unreferenced skills
+6. `npm run lint:docs-freshness` — check docs counts and links
+7. Review `QUALITY_SCORE.md` and update if metrics changed
+8. Run `npm run snapshot:baseline` to capture current state for future diffs
```


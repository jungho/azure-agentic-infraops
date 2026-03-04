#!/usr/bin/env node
/**
 * Orphaned Content Validator
 *
 * Detects skills and instruction files that are not referenced by any
 * agent, other skill, or instruction file. Orphaned content wastes
 * repository space and creates maintenance confusion.
 *
 * @example
 * node scripts/validate-orphaned-content.mjs
 */

import fs from "node:fs";
import path from "node:path";

const SKILLS_DIR = ".github/skills";
const AGENTS_DIR = ".github/agents";
const INSTRUCTIONS_DIR = ".github/instructions";

let errors = 0;
let warnings = 0;
let checked = 0;

console.log("\n🔍 Orphaned Content Validator\n");

// Gather all content from agents and instructions that might reference skills
function gatherReferenceContent() {
  const content = [];

  for (const dir of [AGENTS_DIR, path.join(AGENTS_DIR, "_subagents")]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      content.push(fs.readFileSync(path.join(dir, f), "utf-8"));
    }
  }

  if (fs.existsSync(INSTRUCTIONS_DIR)) {
    for (const f of fs
      .readdirSync(INSTRUCTIONS_DIR)
      .filter((f) => f.endsWith(".md"))) {
      content.push(fs.readFileSync(path.join(INSTRUCTIONS_DIR, f), "utf-8"));
    }
  }

  // Also check cross-skill references
  for (const skill of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    const skillPath = path.join(SKILLS_DIR, skill.name, "SKILL.md");
    if (fs.existsSync(skillPath)) {
      content.push(fs.readFileSync(skillPath, "utf-8"));
    }
  }

  // Check copilot-instructions and AGENTS.md
  for (const f of [
    ".github/copilot-instructions.md",
    "AGENTS.md",
    ".github/prompts/plan-agenticWorkflowOverhaul.prompt.md",
  ]) {
    if (fs.existsSync(f)) content.push(fs.readFileSync(f, "utf-8"));
  }

  return content.join("\n");
}

const allContent = gatherReferenceContent();

// Check skills
console.log("📁 Skills:");
const skillDirs = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const skill of skillDirs) {
  checked++;
  const isReferenced =
    allContent.includes(`${skill}/SKILL.md`) ||
    allContent.includes(`skills/${skill}`) ||
    allContent.includes(`${skill}/references/`) ||
    allContent.includes(`${skill}/`) ||
    allContent.includes(`\`${skill}\``);

  if (!isReferenced) {
    console.log(`  ⚠️  ${skill}/ — not referenced by any agent or instruction`);
    warnings++;
  }
}

// Check instruction files
console.log("\n📁 Instructions:");
if (fs.existsSync(INSTRUCTIONS_DIR)) {
  const instrFiles = fs
    .readdirSync(INSTRUCTIONS_DIR)
    .filter((f) => f.endsWith(".instructions.md"));

  for (const file of instrFiles) {
    checked++;
    const name = file.replace(".instructions.md", "");

    // Instructions auto-load by glob — check the applyTo frontmatter
    const filePath = path.join(INSTRUCTIONS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const hasApplyTo = fmMatch && fmMatch[1].includes("applyTo");

    if (!hasApplyTo) {
      console.log(
        `  ⚠️  ${file} — no applyTo frontmatter (instruction never auto-loads)`,
      );
      warnings++;
    }
  }
}

console.log(`\n${"─".repeat(50)}`);
console.log(`Checked: ${checked} | Warnings: ${warnings} | Errors: ${errors}`);

if (errors > 0) {
  console.log(`\n❌ ${errors} orphaned content error(s)`);
  process.exit(1);
}
console.log(`\n✅ Orphaned content check passed`);

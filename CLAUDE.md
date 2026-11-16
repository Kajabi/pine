# Pine Design System — Claude Code Instructions

AGENTS.md holds the instructions every coding agent shares; edit it there, not here.

@AGENTS.md

## Claude Code only

- Reviewer agents live in `.claude/agents/` and review skills in `.claude/skills/`. Before opening a PR against `main`, `pine-run-gauntlet` runs the code, security, design and existence reviewers in parallel and consolidates their findings

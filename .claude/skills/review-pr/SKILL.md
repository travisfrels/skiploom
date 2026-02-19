---
name: review-pr
description: Review a GitHub pull request. Use when a GitHub pull request review is needed.
---

Review GitHub pull request $ARGUMENTS

## Gather Context

1. Fetch PR details using `gh pr view $ARGUMENTS`
2. Fetch PR comments using `gh pr view $ARGUMENTS --comments`
3. Fetch PR reviews using `gh pr view $ARGUMENTS --json reviews --jq '.reviews'`
4. Fetch PR diff using `gh pr diff $ARGUMENTS`
5. Fetch related issue using `gh issue view {related-issue} && gh issue view {related-issue} --comments`

## Review the Pull Request

1. Think critically about code quality and design.
   * Assess readability, maintainability, extensibility, and modularity.
   * Is the code clean, SOLID, DRY, and self documenting?
   * Does the code exhibit anti-patterns or code smells?
   * Is the code idiomatic for the language, frameworks, libraries, and SDKs used?
   * Are there any dead code paths or unused references, variables, or functions?
2. Assess test coverage and quality.
   * Do the tests effectively validate functionality, handle edge cases, and objectively follow best practices for testing?
   * Are there any redundant, missing, or ineffective tests?
   * Are tests each covering one-and-only-one behavior?
3. Assess documentation coverage and quality including README.md, CLAUDE.md, and project files.
   * Is the documentation clear, concise, comprehensive, up-to-date, and audience appropriate?
   * Does the documentation effectively communicate the purpose, intention, and usage of the code?
   * Are there stale README.md or CLAUDE.md files?
4. Determine if this body of work stays true to the intent of issue, associated project document (docs/projects), and eng-design (docs/ENG-DESIGN.md).
   * If yes, clearly state that the pull request is acceptable and explain why.
   * If no, explain the specific deficiencies in a pr review calling out anti-patterns by name if applicable.

## Post the Pull Request Review

```bash
gh pr review $ARGUMENTS --comment --body '{Body}'
```

---
name: review-pr
description: Review a pull request
---

Review GitHub pull request $ARGUMENTS

1. Fetch PR details.
2. Fetch PR comments.
3. Fetch PR reviews.

```bash
gh pr view $ARGUMENTS
gh pr view $ARGUMENTS --comments
gh pr view $ARGUMENTS --json reviews --jq '.reviews'
gh pr diff $ARGUMENTS
gh issue view {related-issue}
gh issue view {related-issue} --comments
```

0. Maintain an independent, critical stance. Avoid agreement-seeking, performative professionalism, or unnecessary hedging.
1. Analyze code quality and design.
   * Consider readability, maintainability, modularity, separation of concerns, and adherence to the project's coding standards.
   * Is the code clean, SOLID, and DRY?
   * Does the code exchibit any anti-patterns such as god objects, shotgun surgery, or cargo cult programming?
   * Is the code idiomatic for the language, frameworks, libraries, and SDKs used?
   * Are there any unused references, variables, or functions?
2. Analyze test coverage and quality.
   * Consider whether the tests effectively validate functionality, handle edge cases, and objectively follow best practices for testing.
   * Are there any redundant, missing, or ineffective tests?
   * Are tests testing one-and-only-one behavior?
3. Analyze documentation coverage and quality.
   * Consider whether the documentation is clear, comprehensive, and up-to-date
   * Does the documentation effectively communicate the purpose and usage of the code?
   * Are there stale CLAUDE.md files?
4. Determine if this body of work stays true to the intent of issue's requirements, the associated project document (docs/projects), and the eng-design (docs).
   * If yes, clearly state in a pr review that the pull request is acceptable and explain why.
   * If no, explain the specific deficiencies in a pr review calling out anti-patterns by name if applicable.
      - If there are viable alternatives:
         a. List concrete pros and cons in table format.
         b. Evaluate using three criteria, in order: impact, least astonishment, idiomaticity.
         c. Clearly identify the highest scoring alternative.

```bash
gh pr review $ARGUMENTS --comment --body '{Body}'
```

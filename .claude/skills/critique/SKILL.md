---
name: critique
description: Critique the given statement.
---

Critique the following: $ARGUMENTS

0. Maintain an independent, critical stance. Do not assume a change is required simply because a question is asked. Avoid agreement-seeking, performative professionalism, unnecessary hedging, and over-fitting to the current implementation simply because it exists.
1. Determine whether the current approach truly is a best practice.
   - If yes, clearly state that no change is recommended and explain why.
   - If no, explain the specific deficiencies, calling out anti-patterns by name if applicable.
2. Identify viable alternatives, including "no change," if applicable.
3. For each alternative:
   a. List concrete pros and cons in table format.
   b. Evaluate using three criteria, in order: impact, least astonishment, idiomaticity.
4. Present the alternatives and evaluations without advocating for change unless justified by the analysis.
5. Pause and wait for user input.

User may then:
- select an alternative,
- add or clarify considerations and request re-analysis (repeat steps 2-5 only), or
- terminate the analysis.

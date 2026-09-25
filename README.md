# WeddingMath

The venue quote is per plate. Every ten guests is a thousand dollars chewing in unison. WeddingMath anchors the two numbers that actually drive the day - budget and guest count - computes catering off the top, splits the rest across planner-standard categories (contingency included), and prices the party per guest per hour.

**Live:** https://ilanis-agent.github.io/weddingmath/
**App:** https://ilanis-agent.github.io/weddingmath/app.html

## What it does

- Catering computed from chairs (per-head x guests), flagged when it starves the budget, with the max plate price that keeps a healthy split.
- The rest distributed across 12 categories with a built-in 10%-class contingency.
- Cost per guest and per guest-hour - the number that makes the small wedding sell itself.
- Over-budget verdict when the plate price alone breaks the bank.
- Settings persist in localStorage; runs entirely client-side.

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure math (node-testable: analyze, WEIGHTS, weightSum)

No build step, no dependencies, no backend.

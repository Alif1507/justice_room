# Different endings per episode

Design: turn each of the three solution choices per episode into an authored three-beat ending with stable IDs, character dialogue, its own title and visual motif. A thoughtful solution with an unsupported reason gets a separate reconsideration scene. Unfair outcomes remain explicitly framed as possible consequences and offer a supportive retry; only the accepted solution plus reason leads to reflection and campaign completion. Preserve existing saves by deriving the ending from existing decision/reason fields; restart only the cinematic beat on reload.

1. Add behavior tests for outcome selection, reason mismatch, reload and retry guards.
2. Add typed StoryEnding data in content/endings.ts, reference it from each decision and validate references/characters.
3. Add pure outcome selector and guarded RETRY_DECISION event that clears the rejected selection without losing evidence or points.
4. Add EndingScene with restrained CSS animation, distinct motifs and subtitle dialogue in the same frame. Integrate a three-beat sequence in GameShell for decision feedback and reflection intro. Show the achieved ending title on results.
5. Exercise every choice and wrong-reason path in browser tests; check keyboard, reduced motion, reload, retry, and 360/768/1440 widths. Run all scripts and production build, update documentation.

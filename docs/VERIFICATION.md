# Verification record

Environment: Windows, Node 24.14.1, npm 11.5.2, Chrome through Playwright. Development at localhost:3000. No deployment performed.

Completed checks (2026-11-15):
- `npm test`: 16 unit tests passed. Phase guards, scoring deduplication, objection pairs, both E05/S02 orders, decision retries, reflection gating, save restoration/validation, corruption, storage failure, case-scoped reset, and content reference validation.
- `npm run typecheck`: passed after the final fixes.
- `npm run lint`: passed with no warnings before final review.
- `npm run build`: production compilation, TypeScript, and page generation passed after the final fixes.
- `npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund --cache .npm-cache`: passed; single npm lockfile matches pinned root dependencies.

- `npm run test:e2e`: **7/7 passed** after the final fixes (23.6 seconds). Successful playthrough with wrong objection/decision retries and reloads; viewport checks at 360/768/1440; confirmed reset isolation; corrupt-save preservation; unavailable storage fallback; keyboard focus trapping/return; settings persistence/reduced motion; dialogue skip and subsequent advance.
- Visual inspection: desktop and mobile home, investigation, testimony, objection dialog, decision, and reflection screenshots reviewed. Fixed CSS BOM parsing and mobile witness-label clipping; no horizontal overflow at tested widths.
- Independent read-only code review identified non-string phase coercion in restored saves. Reproduced with a failing test, fixed by strict primitive-string validation, and verified by the green full unit/browser suites. Additional tests cover impossible earlier-phase restoration after a successful decision and unreachable required objections.

No unresolved important findings remain from that review. Screenshots are generated to the ignored `test-results/` directory. Viewport checks are automated layout checks plus visual inspection of representative screenshots; they are not a claim of screen-reader or physical-device testing.

Limits: clean network installation could not be tested because registry downloads are blocked by this environment. Locally available compatible dependencies were used. Only Chrome has been exercised; no deployment, full offline mode, cross-device sync, teacher curriculum certification, or narrated audio is claimed.


## Story motion update ? 2026-11-15

- `npm test`: 21/21 passed (16 game/storage tests + 5 presentation tests).
- `npm run typecheck`: passed with transient cue types and reactive system-motion preferences.
- `npm run build`: production compilation, TypeScript and page generation passed with the animation changes.
- `npm run lint`: passed with no warnings after removing one unused icon import.
- Browser suite expanded to verify first-only discovery effects, skip with focus return, restore without replay, presentation excluded from save, E05 reconstruction and responsive widths, system/app reduced motion, and an operable objection skip control. **Final result: 11/11 browser tests passed (39.7 seconds)**, including the objection skip regression. Original complete playthrough and save/reset checks remain green.
- Independent read-only review found no important game/save/scoring regression. Its hidden objection-skip control finding was reproduced in a failing browser test and fixed by retaining the control and keeping focused cards visible.
- All animated artwork is original SVG/CSS or existing locally installed icons; no new dependencies. The water reconstruction leaves the responsible person unknown.

Visual review of the new E05 cue completed at 360, 768 and 1440 pixels after its entry animation settled. Text and skip controls remained readable; no horizontal overflow was detected at these widths. Final production build rerun after the skip-control fix also passed.


## Guided story frame update - 2026-11-15

The primary play experience now uses a viewport-sized stage with integrated subtitles. Investigation exposes one clue at a time; testimony, evidence/reason, decision/reason and reflection progress sequentially. The E05 reconstruction remains on stage while the player reads instead of disappearing as a separate floating card.

Final checks after the review fixes:
- `npm test`: 26/26 passed, including investigation focus/acknowledgement, rejected skips, compatibility with unordered legacy progress, complete subtitle pagination and statement prerequisites.
- `npm run test:e2e`: 15/15 passed (56.1 seconds). Full case with incorrect evidence/solution/reason/reflection and successful retries; reload, reset isolation, corruption, unavailable storage, inline keyboard choices, natural focus transitions, reduced motion, persistent E05 reconstruction, page-scroll checks at 360/768/1440 widths, and complete choice-label bounds at 360x640.
- `npm run typecheck`: passed.
- `npm run lint`: passed without warnings.
- `npm run build`: production compilation, TypeScript and page generation passed.
- Visual review: integrated investigation, testimony, decision, reflection and reconstruction frames on desktop/mobile. Compact phone choices no longer clip, and the active character label is not cropped behind the choice panel.

Independent review findings (short-screen clipping, focus on disabled transition buttons, literal encoding artifacts) were corrected. Browser tests first reproduced the clipping and keyboard-focus issues, then passed after fixes. Main play requires no page scrolling at the tested sizes; optional evidence/settings/history dialogs may scroll deliberately. No new backend, account, dependency, invented culprit, save format or deployment was introduced.

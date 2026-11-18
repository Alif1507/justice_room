# Three replayable episodes

User requests obvious replay and complete Episodes 2 and 3. Preserve guided single-frame presentation, local-only privacy and all first-case facts.

- [x] Generalize case-dependent engine, selectors, persistence and components with explicit CaseDefinition parameters and book-case defaults.
- [x] Complete original duty-roster and inclusive-play stories, each with four investigation clues, fifth discussion clue, a reasoned objection, solution/reason, consequences and three reflections.
- [x] Add mandatory schedule-matching / fair-play-rule activities with typed guards and safe persistence.
- [x] Give each case its own save key. Offer confirmed replay on result, menu and completed case cards, preserving other cases and settings.
- [x] Activate three real case cards/routes; integrate original scene/evidence visuals and teacher notes.
- [x] Verify every complete case, wrong choices/retries, reload, replay isolation, legacy episode-one saves, keyboard and 360/768/1440 layouts.

Scope: same local browser architecture, no accounts/backend, no fake episode buttons. Episode 2 emphasizes cooperation and changed duties; Episode 3 balances legitimate different play needs.


Integration record: both new story definitions and original SVGs completed and validated. Engine, selectors, storage, game shell, evidence drawer and scene use explicit case definitions; Episode 1 remains the default API. The new activities require valid answers before collecting E02/E03, with source cards read one at a time and separate retry feedback. Replay is exposed on results, menu and completed cards, with case-scoped confirmation.

Independent review found that the updated duty roster already supports the timing objection. Added the valid E02/reason pair alongside E04, reproduced the issue in a failing unit test, then passed the 31-test unit suite. Short-phone regressions in dense source/feedback/summary/decision layouts were reproduced by browser bounds checks and corrected through sequential source cards, distinct feedback, concise choices, and bounded summary icons. Final full-suite/build results are recorded in docs/VERIFICATION.md.

Final verification: 31 unit tests, 19 Chrome E2E tests, typecheck, lint and production build all passed. Main-frame bounds and complete choice/source/summary labels checked at 360x640, 768x800 and 1440x900; case-board screenshots checked at 360/768/1440 widths. All three episodes were completed with retries, reloaded and replayed. No remaining important review finding.

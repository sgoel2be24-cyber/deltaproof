# Verification evidence

September 8, 2026 IST.

- TypeScript and production Vite build passed.
- 22 Vitest tests passed. Coverage includes evidence abstention/conflict, exact quotes, input/schema boundaries, stale-hash property-order regression, DAG cycles, parallel schedules, estimates, reversible deferral and packet disclosures.
- Real Node CPU MiniLM inference ran on 12 synthetic developer-authored cases, 10 matched expected top source/abstention. See evaluation.json for every case and limitation.
- Real Chromium browser inference completed in 3.8s on first successful local run and about 0.4s with cached model assets. Single observations, not performance benchmarks.
- Verified three results and their exact citations. Reviewed spreadsheet export (12h/data), team invites (20h/identity), and colors (included).
- UI proposal showed 32h, $2,880, +1.0 working day. Deferring invites produced 12h, $1,080 and still +1.0 day because the export path remained critical.
- Removing SOW-05 from retrieved evidence changed team-invitation branch from RELATED_EXCLUSION to LOW_EVIDENCE.
- Reload restored request, analysis, decisions, numeric estimates and notes after canonical fingerprint fix.
- Export Markdown downloaded to the browser's download directory. Packet contents checked against the UI, including no-client-approval disclosure.
- At 390 × 844 mobile viewport, document width equaled viewport width (390), with no horizontal overflow. Screenshot inspected. Desktop screenshots captured.
- npm audit reported zero vulnerabilities after overriding a vulnerable transitive Sharp version with 0.35.0. This library is a Node-side image dependency; the app uses text embeddings.

## Actual failures fixed

1. Browser model initialization failed because Transformers.js disables local models by default in browsers. Explicitly enabled local model assets and disabled remote models, then verified real inference.
2. Saved reviews failed restoration because schema parsing reordered fields and changed the raw JSON hash. Added stable sorted-key serialization and a regression test.
3. Numeric estimates did not immediately propagate in browser automation. Moved updates to input events and refreshed metrics without destroying the focused input, then verified both totals and reload.

## Remaining limits

No independent customer study, legal interpretation benchmark, capacity-aware scheduling, signed approval, collaborative backend or encryption at rest. Model test set is small and synthetic. Browser/OS coverage is limited to the tested Chromium surface. Public deployment and final artifact checks are recorded below when complete.

- New baseline forms: browser rejected a circular dependency, accepted corrected input and saved a changed hourly rate, invalidating prior review.
- Ten-slide PowerPoint finalized and all slides visually inspected. Captioned screenshot walkthrough encoded as H.264, 1280×820, 3m10s. It is not a continuous screen recording.

- Final public demo https://deltaproof.vercel.app returned HTTP 200 without credentials. Real hosted browser inference produced three cited results in 16.1s on the first observed hosted run, with no captured console errors. This includes network model download, not just inference latency.
- Public source pushed to https://github.com/sgoel2be24-cyber/deltaproof. Git excludes model weights, local checkpoint, build/runtime directories and deployment credentials.

## Performance and privacy optimization pass (September 13, 2026)

- 25 Vitest tests passed (three added: zero-vector cosine, 12-segment request cap, deterministic evidence tie-break). TypeScript production build passed.
- Node CPU smoke evaluation re-run: 10/12 expected top source or abstention, 19 embeddings in 421 ms. See evaluation.json.
- Verified in a real Chromium surface: self-hosted DM Sans and Manrope load via `document.fonts.check` with no third-party font request. Google Fonts import removed; fonts ship in `public/fonts` (SIL OFL, credited in THIRD_PARTY_NOTICES.md).
- Verified in a real Chromium surface: the idle warm-up prepared the local model before any interaction ("Private AI ready · warm in this browser" appeared in the status line), and a full three-request trace then completed in 0.5 s of reported analysis time on the warm model. Earlier hosted observation without warm-up was 16.1 s including network download.
- Verified in a real Chromium surface: changing a review decision while scrolled deep into the findings list preserved the scroll position (1200 px before and after), restored keyboard focus to the new decision select, revealed the conditional effort inputs and persisted the session.
- Verified the preview server sends `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` on the document response, matching the new Vercel header configuration. The deployed production site enables multi-threaded WASM inference through this isolation; browsers without isolation fall back to a single thread automatically.
- Worker lifecycle change: editing a request no longer terminates the inference worker between reviews; the loaded model and its embedding cache stay warm, and only in-flight jobs are cancelled on input change.

# Devpost submission draft

## Project name
DeltaProof

## Tagline
Private AI scope review that connects a client request to evidence and delivery impact.

## Inspiration
A client’s “small change” can affect much more than one screen. Before agreeing, a small software agency needs to compare the request with the baseline, estimate affected work and explain the tradeoff. We wanted that decision to be visible and inspectable, while keeping customer text on the reviewer’s device.

## What it does
DeltaProof compares short requests with an explicitly labeled scope baseline. It retrieves exact related clauses, exposes weak or conflicting evidence, and asks a person to decide whether to include, propose or defer the work. Human effort estimates feed a dependency simulator. The reviewer can toggle changes, inspect what happens when evidence disappears, and export a source-backed internal proposal.

The seeded Northstar example is synthetic. Spreadsheet export produces conflicting evidence rather than an automatic decision. Team invitations retrieve an exclusion. A color change demonstrates that even a plausible inclusion can fall below the model's relevance threshold and require review.

## How we built it
TypeScript and Vite provide the client. A Web Worker runs quantized MiniLM through Transformers.js and ONNX Runtime. Mean-pooled, normalized sentence embeddings support cosine retrieval. Explicit policy branches handle insufficient, conflicting, included and excluded evidence. Zod validates inputs and graph integrity. A pure dependency scheduler computes earliest completion and applies reviewer effort and buffer assumptions. Browser storage preserves the workspace, with an input fingerprint preventing stale review restoration.

The deployed app is static. It needs no API key or server database. Project text never goes to an AI inference API. The small model and WebAssembly runtime load from the app's host. Fonts are self-hosted, so no third-party request occurs at any point of use. The page is served with cross-origin isolation headers, which unlocks multi-threaded WebAssembly inference, and an idle warm-up prepares the model before the first request is traced, so the first analysis no longer waits on a download. The worker stays warm between reviews and reuses its embedding cache.

## Challenges
Browser and Node inference have different model-loading defaults. We discovered that in real browser testing, fixed the configuration and reran the workflow. Reload testing also exposed input fingerprint instability caused by field order. Canonical serialization and a regression test fixed it.

Semantic relevance is imperfect. We kept abstention and conflicting evidence visible instead of pretending the model could determine contractual scope. The final decision and all effort estimates remain human inputs.

## Accomplishments
A complete review workflow runs with real local AI. It includes editable project forms, exact quotations, reversible scheduling scenarios, evidence sensitivity and an exportable packet. Deterministic tests and a small real-inference evaluation are reproducible from the repository.

## What we learned
A credible AI workflow needs to reveal where its evidence ends. Source removal makes that boundary understandable. Separating model retrieval from human judgment and deterministic arithmetic also makes failures easier to isolate and explain.

## What's next
Pilot five consented agency reviews and measure review time, missed changes and reviewer corrections. Add document ingestion and resource-constrained scheduling based on that evidence. Team collaboration would require authentication and an auditable approval workflow.

## Built with
TypeScript, Vite, Transformers.js, MiniLM, ONNX Runtime, Web Workers, Zod, Vitest, Vercel, Lucide.

## Links and outstanding participant fields
- Source: https://github.com/sgoel2be24-cyber/deltaproof
- Working demo: https://deltaproof.vercel.app (public HTTP 200 and real browser AI verified).
- Deck: https://github.com/sgoel2be24-cyber/deltaproof/raw/main/artifacts/DeltaProof.pptx
- Video: https://github.com/sgoel2be24-cyber/deltaproof/raw/main/artifacts/DeltaProof-demo.mp4 (3m10s captioned captured workflow; upload to a supported video host for the embed field).
- Team: Shikhar. Confirm exact public name, participant profile, any teammates and their matching Devpost emails.
- No real users, revenue, production deployment history or independently validated savings claimed.

## Final submission gates
- Confirm participant age/residence eligibility and registration.
- Join the required Discord and complete organizer-requested introduction. No introduction has been posted by this task.
- Review public source, deployed app, video and deck links in a signed-out browser.
- Upload the demo to a Devpost-supported video host and paste its URL. Local MP4 and GitHub download alone may not satisfy an embedded video field.
- Confirm team details and public project wording.
- Obtain explicit user confirmation before submitting to Devpost.

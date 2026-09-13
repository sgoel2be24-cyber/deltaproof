# Architecture

## Data flow

Client request + explicitly labeled baseline → validated text segments → dedicated Web Worker → local quantized MiniLM → normalized embeddings → cosine retrieval → deterministic evidence policy → human review → pure dependency simulation → versioned internal packet.

The application is a static TypeScript/Vite client. No backend is needed because neither inference nor storage needs a server. This deliberately avoids a database/authentication dependency for the hackathon while making the privacy claim technically inspectable. A hosted team product would require authenticated tenancy, encrypted storage, role permissions and a proper approval audit log before use with shared client data.

## Boundaries

- `schema.ts` enforces input limits, enum values, unique IDs, graph integrity and numeric ranges.
- `ai.worker.ts` performs local ONNX feature extraction, mean pooling and normalization. Model download happens at setup/build. Text inference happens in-browser. Remote models are disabled. A 200-text in-memory cache avoids repeated inference within one worker. When the page is cross-origin isolated (COOP/COEP), ONNX Runtime Web runs up to four WASM threads; otherwise it falls back to a single thread. The worker is kept warm between reviews and is primed by an idle-time warm-up so the model is ready before the first request is traced.
- `engine.ts` consumes only numeric vectors, rejects non-finite values and mismatched dimensions, and maps results to explicit review branches. Requests cannot invoke tools or execute instructions. It never generates source quotes.
- `main.ts` escapes inserted user text, binds explicit review controls and persists state locally. Changing inputs clears stale analysis; an in-flight worker job is terminated only while it is running, otherwise the warm worker and its embedding cache are reused. Saved analysis must match the input hash and baseline source strings before restoration. Review-decision re-renders preserve scroll position and keyboard focus.
- `schedule` computes earliest start/end over a DAG. Extra effort flows through downstream tasks; independent tasks may overlap. This is not resource-constrained scheduling.

## Decision policy

Cosine below 0.40: LOW_EVIDENCE. Both inclusion and exclusion relevant with score gap under 0.12: CONFLICTING_EVIDENCE. Otherwise the highest relevant clause yields RELATED_INCLUSION or RELATED_EXCLUSION. These are retrieval policies, not learned or calibrated probabilities. All lead to a pending human review, never authorization.

The evidence sensitivity view filters the original top-three retrieved set and re-evaluates the policy. It does not claim a full corpus retraining/retrieval counterfactual. For a full baseline intervention, edit the baseline and run fresh inference.

## Failure behavior

Model missing or unsupported WebAssembly: explicit error and retry, no fake AI fallback. Unknown request: clarification. Dependency cycle: reject input. Browser storage unavailable: offer file export. Input changed during inference: terminate stale worker. No network side effects from review/export. No secrets or prompt-based integrations.

## Test strategy

Unit tests exercise abstention/conflict/related branches, bad vectors, exact quotes, DAG scheduling, duplicate task selection, buffer handling, invalid cycles/IDs, draft decisions and exports. Model evaluation uses real inference and separates its small synthetic data from deterministic unit tests. Browser verification checks the entire workflow, persistence and mobile layout. See VERIFICATION.md for observed outcomes.

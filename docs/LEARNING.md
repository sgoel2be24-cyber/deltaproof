# DeltaProof engineering notes

The useful AI boundary is retrieval, not authorization. Sentence embeddings can map paraphrases to relevant evidence, but nearby text can have opposite scope implications. The application preserves explicit inclusion/exclusion labels and surfaces conflicts rather than treating similarity as probability.

A dependency graph explains why fewer effort hours need not reduce the finish date. Earliest-start scheduling takes the maximum predecessor finish, so parallel requests can share the critical path. The model assumes unlimited parallel staffing. Real capacity planning would need calendars, staffing and resource constraints.

Input fingerprints need canonical serialization. A semantically unchanged object can have different key order after schema parsing. Hashing sorted keys makes saved analysis reusable without confusing version identity with a cryptographic signature.

A Web Worker keeps inference away from UI input handling. Local inference removes per-request API costs and data transmission, but creates first-load model size and browser compatibility costs. Cache and visible errors matter as much as model selection.

Verification combined unit tests, actual model inference and complete browser interaction. Each catches different failures. The Node model test could not catch the browser's local-model default. A build could not catch stale persistence. Screenshots alone could not establish deterministic arithmetic.

For future hackathons, establish one source-backed decision, one meaningful reversible control, one explicit failure mode and one end-to-end export before expanding features. Public links and demo assets belong in acceptance criteria from the beginning.

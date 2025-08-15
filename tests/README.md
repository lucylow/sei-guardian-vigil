# SEI Sentinel Testing

This folder contains all automated tests for SEI Sentinel, including:

- **Unit tests:** For core scan engine, AI modules, and blockchain watcher.
- **Integration tests:** For CLI, API, and webhook paths.
- **Performance tests:** For concurrency and latency benchmarks.
- **Security tests:** For sandboxing, input sanitation, and guardrail enforcement.

## Suggested Structure

```
tests/
├── unit/           # Unit tests for individual modules
├── integration/    # End-to-end and API tests
├── performance/    # Load and latency tests
├── security/       # Guardrail and threat simulation tests
└── README.md       # This file
```

Use your preferred test runner (e.g., Jest, Vitest, Mocha) and place test files in the appropriate subfolders.

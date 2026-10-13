# ORACLE ZERO — Backend

FastAPI backend for ORACLE ZERO. Serves scenario data, runs a rule-based
cascading-failure simulation engine, and optionally calls NVIDIA Nemotron to
generate plain-language explanations of simulated events.

## What this is (and isn't)

- ✅ A real, running FastAPI app with an in-memory scenario store, a working
  (if intentionally simple) simulation engine, and a Nemotron client that
  degrades gracefully when no API key is set.
- 🚫 Not a calibrated crisis-modeling system. The simulation engine walks a
  small hand-authored dependency graph (`app/simulation/engine.py`) to
  produce *plausible-looking* cascades for demo purposes — see the safety
  notice in the frontend's Settings page.
- 🚫 No database yet. Scenario data lives in memory and resets when the
  server restarts (`app/store.py` explains how to swap in a real one later).

## Requirements

- Python 3.11+

## Install and run

```bash
cd oracle-zero-backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # optional — defaults work with zero config

uvicorn app.main:app --reload --port 8000
```

Then open:

- `http://localhost:8000/docs` — interactive Swagger UI for every endpoint
- `http://localhost:8000/health` — should return `{"reachable": true, ...}`

Run the test suite:

```bash
pytest
```

## Connecting NVIDIA Nemotron (optional)

1. Get an API key from the [NVIDIA API Catalog](https://build.nvidia.com).
2. In `.env`, set `NVIDIA_API_KEY=your-key-here`.
3. Restart the server. `GET /nemotron/status` should now report
   `"mode": "live"`, and `POST /nemotron/explain` will call the real model.

Without a key, both endpoints still work — they return clearly-labeled demo
text instead of failing, so the rest of the app keeps working.

**The key stays server-side.** The frontend never talks to NVIDIA directly;
it only calls this backend, which holds the key in its own environment.

## API overview

| Method | Path                          | Purpose                                              |
|--------|-------------------------------|-------------------------------------------------------|
| GET    | `/health`                     | Liveness check                                       |
| GET    | `/scenarios`                  | List all scenarios (3 seeded + any created)          |
| GET    | `/scenarios/{id}`             | Get one scenario                                     |
| POST   | `/scenarios`                  | Create a draft scenario (no events yet)               |
| POST   | `/scenarios/{id}/simulate`    | Run the simulation engine, populate events + outcomes |
| GET    | `/nemotron/status`            | Whether a live Nemotron connection is configured      |
| POST   | `/nemotron/explain`           | Get a plain-language explanation of a scenario/event  |

Full request/response shapes are in `app/models.py` and are explorable live
at `/docs`.

## Project structure

```
oracle-zero-backend/
├── requirements.txt
├── .env.example
├── app/
│   ├── main.py                 # FastAPI app, CORS, router registration
│   ├── config.py               # settings from environment variables
│   ├── models.py                # Pydantic schemas (mirrors the frontend's data shapes)
│   ├── store.py                 # in-memory scenario store
│   ├── data/
│   │   └── seed_scenarios.py   # the 3 sample scenarios, mirrors the frontend's demo data
│   ├── simulation/
│   │   └── engine.py            # rule-based cascading-failure engine
│   ├── services/
│   │   └── nemotron.py          # NVIDIA Nemotron client + demo-mode fallback
│   └── routers/
│       ├── health.py
│       ├── scenarios.py
│       └── ai.py                # /nemotron/* endpoints
└── tests/
    └── test_api.py
```

## Next step: connect the frontend

In `oracle-zero-frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_DEMO_MODE=false
```

`oracle-zero-frontend/src/services/api.js` already has the demo functions
this backend is designed to replace — swapping their bodies for real
`fetch()` calls to the endpoints above (and deleting the local
`src/data/scenarios.js` fixtures) is the remaining wiring step.

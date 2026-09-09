# Hybrid Agent POC

A proof-of-concept for building a **hybrid AI coding workflow** in OpenCode, combining cloud reasoning models with a locally hosted coding model.

The project explores whether a capable cloud model can act as an **architect/orchestrator** while delegating implementation work to a smaller, locally hosted model running through `llama.cpp`.

---

## Overview

The core idea is to separate **reasoning and orchestration** from **implementation**.

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Architect      │
                         │                     │
                         │ Claude Sonnet 4.6  │
                         │ Cloud               │
                         └──────────┬──────────┘
                                    │
                         Selects & delegates
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Worker       │
                         │                     │
                         │ Ornith 1.5 35B     │
                         │ A3B Q5_K_M         │
                         │ Local / llama.cpp  │
                         └──────────┬──────────┘
                                    │
                              Implementation
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Project Files     │
                         │ PLAN.md / STATE.md  │
                         │ Source Code         │
                         └─────────────────────┘
```

A third agent, **Debugger**, is intended to handle tasks that become blocked during implementation.

```text
Architect
    │
    ├── normal task ──────► Worker
    │                         │
    │                         └── COMPLETED
    │
    └── blocked task ─────► Debugger
                              │
                              └── recovery instructions
                                      │
                                      ▼
                                    Worker
```

---

## Goals

This POC is intended to test several ideas:

* Can a cloud model reliably act as a project architect rather than an implementation agent?
* Can implementation tasks be delegated to a local model?
* Can the local model execute tasks effectively with a fresh context?
* Can `PLAN.md` and `STATE.md` provide sufficient persistent project memory?
* Can agent permissions enforce clear separation of responsibilities?
* Can a local coding model handle implementation while a stronger cloud model handles planning and orchestration?
* Can blocked implementation tasks be routed through a dedicated debugging agent?

The ultimate goal is to determine whether this architecture can provide a useful balance between:

**cloud-model reasoning quality + local-model execution + persistent project state**

---

## Architecture

The POC currently consists of three agents.

### Architect

**Model:** Claude Sonnet 4.6
**Execution:** Cloud
**Role:** Primary orchestrator

The Architect is responsible for:

1. Understanding the project.
2. Maintaining the implementation plan.
3. Maintaining project state.
4. Selecting the next eligible task.
5. Delegating exactly one atomic task to the Worker.
6. Reviewing the Worker result.
7. Determining whether the workflow should continue or stop.

The Architect should **not implement production code itself**.

Its intended permissions restrict source-code modifications while allowing updates to:

* `PLAN.md`
* `STATE.md`

and allow invocation of the Worker subagent.

---

### Worker

**Model:** Ornith-1.5-35B-A3B-Q5_K_M
**Execution:** Local `llama.cpp` server
**Role:** Implementation

The Worker operates as a **subagent with a fresh context**.

Its responsibility is to:

1. Read `PLAN.md`.
2. Read `STATE.md`.
3. Identify its assigned task.
4. Inspect the relevant project files.
5. Implement exactly one task.
6. Run the specified validation.
7. Update persistent project state.
8. Return either `COMPLETED` or `BLOCKED`.

The Worker should not:

* Execute additional tasks.
* Redesign unrelated parts of the project.
* Expand the scope of the assigned task.
* Make unrelated improvements.

The intended principle is:

> **One Worker invocation = one atomic task.**

---

### Debugger

**Model:** Claude Sonnet 4.6
**Execution:** Cloud
**Role:** Diagnosis and recovery

The Debugger is intended to be invoked when the Worker becomes blocked.

It should:

1. Read the project state.
2. Identify the blocked task.
3. Inspect the relevant source and error information.
4. Determine the root cause.
5. Produce deterministic recovery instructions.
6. Update `STATE.md` with the recovery information.
7. Stop.

The Debugger is not intended to perform general implementation.

---

# Persistent Project State

The POC uses two Markdown files as persistent memory.

## PLAN.md

`PLAN.md` contains the project's implementation plan.

Each task is expected to define:

* Objective
* Files
* Requirements
* Dependencies
* Validation
* Definition of Done
* Status

Supported statuses are:

```text
PENDING
IN_PROGRESS
COMPLETED
BLOCKED
```

The plan is intended to be sufficiently deterministic for the local Worker to execute individual tasks without requiring the complete conversation history.

---

## STATE.md

`STATE.md` represents the current execution state of the project.

It allows a new agent context to determine:

* What has already been completed.
* What task is currently active.
* What should be executed next.
* Whether the project is ready, blocked, or requires recovery.
* Important implementation decisions and validation results.

This is particularly important because the Worker is intentionally given a **fresh context**.

Instead of relying on conversational memory:

```text
Previous conversation
        X
        │
        │ not required
        ▼
PLAN.md + STATE.md
        │
        ▼
Fresh Worker context
```

---

# Execution Model

The intended execution cycle is:

### 1. User starts the Architect

```text
@architect Execute the next available task.
```

### 2. Architect reads project state

```text
PLAN.md
STATE.md
```

### 3. Architect identifies the next task

The Architect checks:

* Current task
* Task status
* Dependencies
* Whether the task is ready

### 4. Architect marks the task as in progress

```text
PLAN.md  → IN_PROGRESS
STATE.md → IN_PROGRESS
```

### 5. Architect invokes Worker

The Worker receives the task and starts in a fresh subagent context.

### 6. Worker executes the task

The Worker:

```text
Read state
    ↓
Inspect relevant files
    ↓
Implement task
    ↓
Validate
    ↓
Update state
```

### 7. Worker returns a result

Successful execution:

```text
TASK: T001

STATUS: COMPLETED

FILES CHANGED:
...

VALIDATION:
...

NEXT TASK:
...
```

Blocked execution:

```text
TASK: T001

STATUS: BLOCKED

ROOT PROBLEM:
...
```

### 8. Architect processes the result

If successful, the Architect verifies the state and stops.

If blocked, the Architect preserves the blocked state and can route the task to the Debugger when instructed.

---

# Model Configuration

The current POC uses:

| Role      | Model                     | Execution |
| --------- | ------------------------- | --------- |
| Architect | Claude Sonnet 4.6         | Cloud     |
| Debugger  | Claude Sonnet 4.6         | Cloud     |
| Worker    | Ornith-1.5-35B-A3B Q5_K_M | Local     |

The Worker model is served through a local OpenAI-compatible `llama.cpp` endpoint.

The current configuration uses:

```text
http://127.0.0.1:8080/v1
```

The project configuration defines the local provider and the available local models.

---

# Why a Hybrid Architecture?

A single-model coding workflow forces the same model to perform every type of task:

```text
Planning
   +
Architecture
   +
Context management
   +
Implementation
   +
Debugging
```

This POC explores separating those responsibilities.

A stronger cloud model can handle:

* Planning
* Architecture
* Task decomposition
* Orchestration
* Debugging

while a locally hosted model handles:

* Code generation
* File modification
* Tests
* Implementation

The hypothesis is that this could reduce cloud-model usage while retaining high-quality project-level reasoning.

---

# Isolation and Context

An important part of the experiment is **context isolation**.

The Worker is not supposed to inherit the Architect's entire conversation.

Instead:

```text
Architect context
        │
        │ task delegation
        ▼
Fresh Worker context
        │
        ├── PLAN.md
        ├── STATE.md
        └── relevant project files
```

This tests whether persistent Markdown state can effectively replace large amounts of conversational context.

It also makes the Worker more representative of a lightweight, disposable execution process.

---

# Current POC Status

The project is being developed incrementally.

The initial experiments focus on validating the basic agent loop:

```text
Architect
    ↓
Task selection
    ↓
Worker delegation
    ↓
Worker implementation
    ↓
State update
```

Once this works reliably, subsequent experiments can test:

```text
Worker
  ↓
BLOCKED
  ↓
Debugger
  ↓
Recovery instructions
  ↓
Worker
  ↓
COMPLETED
```

The POC is not intended to be a production-ready autonomous coding system. The primary objective is to validate whether the architecture and separation of responsibilities work reliably in practice.

---

# Success Criteria

The core experiment is considered successful if:

1. Architect can identify the next available task.
2. Architect does not implement the task itself.
3. Architect invokes Worker through the OpenCode subagent mechanism.
4. Worker starts with a fresh context.
5. Worker reads persistent project state.
6. Worker implements exactly one task.
7. Worker validates its implementation.
8. Worker returns either `COMPLETED` or a meaningful `BLOCKED` result.
9. `PLAN.md` and `STATE.md` remain consistent.
10. A blocked task can subsequently be diagnosed by the Debugger.

The most important architectural invariant is:

> **Architect plans and orchestrates. Worker implements. Debugger diagnoses.**

---

# Project Structure

The relevant POC structure is:

```text
.
├── .opencode/
│   └── agents/
│       ├── architect.md
│       ├── worker.md
│       └── debugger.md
│
├── PLAN.md
├── STATE.md
├── opencode.json
└── README.md
```

The exact source-code structure depends on the project being used to test the agent workflow.

---

# Technology

* [OpenCode](https://opencode.ai/)
* Claude Sonnet 4.6
* Ornith-1.5-35B-A3B
* `llama.cpp`
* OpenAI-compatible local inference API
* Markdown-based persistent project state

---

# POC Philosophy

This project deliberately favors **simple, inspectable mechanisms** over complex orchestration infrastructure.

The key components are ordinary files and agent definitions:

```text
Agents
  +
Permissions
  +
PLAN.md
  +
STATE.md
  +
Subagent delegation
```

The purpose of the experiment is to determine how far this relatively simple architecture can go before additional orchestration infrastructure becomes necessary.

---

# Disclaimer

This repository is an experimental proof of concept.

The configuration, prompts, permissions, task structure, and model selection are expected to evolve as the experiments reveal limitations in the architecture.

It should not currently be considered a production autonomous coding framework.

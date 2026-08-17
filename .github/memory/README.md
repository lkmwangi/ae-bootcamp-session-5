# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development to build institutional knowledge and help AI assistants provide better context-aware suggestions.

## Memory Types

### Persistent Memory

**Location:** `.github/copilot-instructions.md`

- **What:** Foundational principles, workflows, and standards
- **Scope:** Project-wide, stable guidelines
- **Changes:** Infrequent, deliberate updates
- **Committed:** Yes, core project documentation

### Working Memory

**Location:** `.github/memory/` directory

- **What:** Development discoveries, patterns, and session notes
- **Scope:** Evolving learnings and tactical knowledge
- **Changes:** Frequent updates during development
- **Committed:** Partially (see structure below)

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical summaries (COMMITTED)
├── patterns-discovered.md       # Accumulated patterns (COMMITTED)
└── scratch/
    ├── .gitignore               # Ignores all scratch files
    └── working-notes.md         # Active session notes (NOT COMMITTED)
```

### File Purposes

#### `session-notes.md` (Committed)

**Purpose:** Historical record of completed development sessions

**When to use:**
- At the END of a development session
- After completing a feature or significant milestone
- When wrapping up a bug investigation
- Before switching contexts or taking a break

**Content:** Summarized accomplishments, key decisions, and outcomes

**Lifetime:** Permanent historical record

#### `patterns-discovered.md` (Committed)

**Purpose:** Document recurring code patterns and architectural decisions

**When to use:**
- When you discover a project-specific pattern during debugging
- After resolving a confusing API design decision
- When establishing a new coding convention
- After fixing a category of similar bugs

**Content:** Structured pattern documentation with examples

**Lifetime:** Permanent, grows over time

#### `scratch/working-notes.md` (NOT Committed)

**Purpose:** Active development scratchpad for current session

**When to use:**
- At the START of a development session
- During active TDD cycles to track test failures
- While debugging to document hypotheses
- During lint error resolution to track progress
- For temporary thoughts, experiments, and observations

**Content:** Raw notes, current task details, blockers, next steps

**Lifetime:** Ephemeral - cleared at session end or rolled into session-notes.md

## Workflow Integration

### TDD Workflow

```
1. Start Session
   → Open scratch/working-notes.md
   → Document current task and approach

2. Red Phase (Failing Test)
   → Note test expectations in working-notes.md
   → Document any confusion or questions

3. Green Phase (Implementation)
   → Track implementation decisions
   → Note any unexpected behavior

4. Refactor Phase
   → Document code quality improvements
   → Identify patterns worth preserving

5. End Session
   → Summarize key findings → session-notes.md
   → Extract patterns → patterns-discovered.md
   → Clear or archive scratch/working-notes.md
```

### Linting Workflow

```
1. Run Lint
   → Document error categories in working-notes.md

2. Categorize Issues
   → Note which errors are trivial vs systemic

3. Fix Systematically
   → Track fixes and any pattern discoveries

4. Verify
   → Document final resolution approach

5. End Session
   → If pattern emerged, add to patterns-discovered.md
```

### Debugging Workflow

```
1. Identify Issue
   → Document symptoms in working-notes.md
   → Note initial hypotheses

2. Investigate
   → Track what you tried and results
   → Document dead ends to avoid revisiting

3. Fix
   → Note root cause and solution
   → Document why this approach works

4. Verify
   → Confirm fix works across related scenarios

5. End Session
   → Summarize investigation → session-notes.md
   → Document pattern if applicable → patterns-discovered.md
```

## How AI Uses This Memory

### During Development

When you ask Copilot for help, it can reference:

1. **Current context:** `scratch/working-notes.md` - what you're actively working on
2. **Historical context:** `session-notes.md` - what happened in previous sessions
3. **Pattern library:** `patterns-discovered.md` - established project patterns

### Example AI Conversations

**Without Memory:**
```
You: "The POST endpoint test is failing."
AI: "Let me suggest a generic implementation..."
```

**With Memory:**
```
You: "The POST endpoint test is failing."
AI: [Reads patterns-discovered.md, sees service initialization pattern]
    "Based on the service initialization pattern in patterns-discovered.md,
    initialize todos as an empty array, not null. Here's the implementation..."
```

### Benefits

- ✅ **Continuity:** Pick up where you left off across sessions
- ✅ **Pattern Recognition:** AI suggests project-specific patterns
- ✅ **Context-Aware:** AI understands your project's unique conventions
- ✅ **Learning Loop:** Discoveries feed back into better future suggestions
- ✅ **Knowledge Base:** Build institutional knowledge over time

## Best Practices

### During Active Development

1. **Keep working-notes.md updated** - write as you work, not after
2. **Be honest about blockers** - documenting confusion helps AI help you
3. **Note decision rationale** - future you will thank current you
4. **Track experiments** - what worked, what didn't, and why

### At Session End

1. **Review working-notes.md** - what's worth preserving?
2. **Extract key findings** - summarize into session-notes.md
3. **Identify patterns** - anything worth adding to patterns-discovered.md?
4. **Clear scratch/** - start next session with a clean slate

### Pattern Documentation

1. **Be specific** - include code examples
2. **Explain context** - why does this pattern exist?
3. **Link to files** - where is this pattern used?
4. **Keep updated** - remove patterns that are no longer valid

## Getting Started

### First Session

1. Open `scratch/working-notes.md`
2. Fill in "Current Task" section
3. Work normally, adding notes as you discover things
4. At end, summarize into `session-notes.md`

### Ongoing Sessions

1. Review `session-notes.md` - refresh your memory
2. Check `patterns-discovered.md` - know the established patterns
3. Open `scratch/working-notes.md` - start fresh notes
4. Work and document discoveries
5. Summarize and extract patterns at end

## Questions?

This system is designed to be lightweight and helpful, not burdensome. If you find yourself not using it, ask:
- Are the files too verbose?
- Is the structure unclear?
- Would a different organization work better?

Adjust the system to fit your workflow, not the other way around.

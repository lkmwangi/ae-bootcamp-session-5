---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ["search", "read", "edit", "execute", "web", "todo"]
---

# Execute GitHub Issue Step

Execute the current step's instructions from the GitHub Issue systematically using TDD principles.

## Input

Issue number (optional): ${input:issue-number:Enter issue number (or leave blank to auto-detect exercise issue)}

## Instructions

### 1. Find the Exercise Issue

If issue number was not provided:
- Use `gh issue list --state open` to find the main exercise issue
- Look for an issue with "Exercise:" in the title
- Extract the issue number

If issue number was provided, use that number.

### 2. Get Issue Content with Comments

```bash
gh issue view <issue-number> --comments
```

Parse the issue to understand:
- The current step you're working on (look for the latest uncommented step)
- Step instructions and requirements
- :keyboard: Activity: sections to execute

### 3. Execute Activity Sections Systematically

For each `:keyboard: Activity:` section in the current step:

**Follow TDD Principles:**
1. **Write tests FIRST** (RED phase) - Create tests that describe expected behavior
2. Run tests to verify they fail for the right reason
3. Implement MINIMAL code to make tests pass (GREEN phase)
4. Run tests to verify they pass
5. Refactor while keeping tests green (REFACTOR phase)

**Testing Scope Constraints:**
- **Backend changes:** Write Jest + Supertest tests FIRST, then implement
- **Frontend changes:** Write React Testing Library tests FIRST, then implement
- **Critical UI journeys:** DO NOT create Playwright UI tests in this prompt
  - Handoff to `/create-ui-tests` for Playwright test creation
  - Handoff to `/run-ui-tests` for Playwright test execution

**IMPORTANT SCOPE BOUNDARY:**
- ✅ Create and run unit tests (Jest)
- ✅ Create and run integration tests (Supertest, React Testing Library)
- ❌ DO NOT create Playwright UI tests (use `/create-ui-tests` instead)
- ❌ DO NOT run Playwright UI tests (use `/run-ui-tests` instead)

### 4. Track Progress

Use the todo list to track:
- [ ] Issue retrieved and parsed
- [ ] Tests written for activity 1
- [ ] Implementation complete for activity 1
- [ ] Tests passing for activity 1
- [ ] (Repeat for each activity)
- [ ] All activities completed

### 5. DO NOT Commit or Push

**CRITICAL:** This prompt executes step instructions only. 

Do NOT:
- Stage changes (no `git add`)
- Commit changes (no `git commit`)
- Push changes (no `git push`)
- Create branches

Committing and pushing is handled by `/commit-and-push`.

### 6. Stop and Provide Next Commands

After completing all activities, stop and tell the user what to do next:

**If the current step requires UI workflow (Playwright tests):**
```
Step activities completed! Next steps:

1. Create UI tests for critical journeys:
   /create-ui-tests

2. Run UI tests to verify end-to-end flows:
   /run-ui-tests

3. Validate step completion:
   /validate-step {step-number}

4. Commit and push (after validation passes):
   /commit-and-push feature/<branch-name>
```

**If UI workflow is NOT required:**
```
Step activities completed! Next steps:

1. Validate step completion:
   /validate-step {step-number}

2. Commit and push (after validation passes):
   /commit-and-push feature/<branch-name>
```

**NEVER recommend `/validate-step` before required UI prompts.**

## Example Execution Flow

```
Step 5-1: Implement POST /api/todos endpoint

Activity 1: Write tests for POST endpoint
- Write Jest + Supertest test (RED)
- Run test → fails as expected
- Implement minimal POST handler (GREEN)
- Run test → passes
- Refactor if needed

Activity 2: Add validation for required title
- Write test for missing title (RED)
- Run test → fails
- Add validation logic (GREEN)
- Run test → passes

All activities complete.

Next: /validate-step 5-1
```

## Success Criteria

- ✅ All :keyboard: Activity: sections executed
- ✅ Tests written BEFORE implementation (TDD)
- ✅ All tests passing
- ✅ No lint errors (or documented with eslint-disable)
- ✅ No Playwright tests created (deferred to /create-ui-tests)
- ✅ No commits/pushes made (deferred to /commit-and-push)
- ✅ User guided to next commands in correct order

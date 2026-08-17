---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
tools: ["read", "execute", "todo"]
---

# Run UI Tests and Analyze Failures

Execute Playwright UI tests and provide clear pass/fail summary with failure classification.

## Instructions

### 1. REQUIRED First Step: Install Playwright Dependencies

**CRITICAL:** Before running UI tests for the first time (or after container rebuild):

```bash
npm run test:ui:install --workspace=frontend
```

**What this does:**
- In Ubuntu/Linux environments: Runs `playwright install --with-deps chromium`
- Installs Playwright browser binaries
- Installs system dependencies required for Chromium
- **Includes automatic bounded Yarn key remediation** for common Ubuntu repository issues
- Performs one automatic retry if the first install attempt fails

**When to run:**
- First time running UI tests
- After dev container rebuild
- After `node_modules` is deleted/reinstalled
- If you see "Executable doesn't exist" errors

**Environment-specific behavior:**
- Ubuntu/Linux: `test:ui:install` is MANDATORY before first test run
- The install script now includes bounded remediation for the Yarn GPG key issue
- If install fails after automatic remediation + retry, STOP immediately

### 2. Handle Installation Failures

**If `test:ui:install` fails AFTER automatic remediation:**

```
❌ ENVIRONMENT BLOCKER: Playwright dependency installation failed

Error output:
[show key error lines from failed command]

This is an environment issue that requires manual intervention.

DO NOT:
- Attempt ad-hoc package hunting
- Perform broad OS troubleshooting
- Continue to run Playwright tests

DO:
- Report this as an environment blocker
- Provide the failing command and error output
- Stop execution and wait for manual environment fix
```

**DO NOT** continue to step 3 if installation failed.

### 3. Ensure Backend and Frontend Are Running

**Check if services are running:**

```bash
# Check for running processes
ps aux | grep -E "node.*backend|node.*frontend"
```

**If NOT running, start both from repo root:**

```bash
# From /workspaces/ae-bootcamp-session-5
npm start
```

This starts:
- Backend on http://localhost:3001
- Frontend on http://localhost:3000

**Verify services are up:**

```bash
# Check backend
curl http://localhost:3001/api/todos

# Check frontend
curl http://localhost:3000
```

**If services don't start:**
```
❌ Services failed to start

Check:
- Port conflicts (kill process on port 3000/3001)
- Dependencies installed (npm install)
- Build errors (npm run build)

Fix and retry.
```

### 4. Run UI Tests

**From repository root:**

```bash
npm run test:ui --workspace=frontend
```

**Or directly with Playwright:**

```bash
cd packages/frontend
npx playwright test
```

**For debugging (UI mode):**

```bash
cd packages/frontend
npx playwright test --ui
```

**For headed mode (see browser):**

```bash
cd packages/frontend
npx playwright test --headed
```

### 5. Capture Test Results

Collect:
- Total tests run
- Tests passed
- Tests failed
- Tests skipped
- Execution time
- Error messages for failures
- Screenshots (if available in test-results/)

### 6. Summarize Results Clearly

**Format:**

```
UI Test Suite Results
=====================

✅ PASSED: 8 tests
❌ FAILED: 2 tests
⏭️  SKIPPED: 0 tests

Total: 10 tests in 15.3s

Overall: 80% pass rate
```

### 7. Detail Failed Tests

For each failed test:

```
Failed Test #1
--------------
Test: "user can delete a todo"
Location: tests/ui/e2e.spec.js:45
Duration: 5.2s

Error:
  TimeoutError: Timeout 5000ms exceeded.
  waiting for selector "text=Temporary task" to be detached

  at TodoPage.deleteTodo (tests/ui/pages/TodoPage.js:28:5)
  at tests/ui/e2e.spec.js:50:7

Screenshot: test-results/delete-todo-retry-1/test-failed-1.png
```

### 8. Classify Each Failure

**Classification Framework:**

#### Type 1: Application Code Defect

**Indicators:**
- Test logic is correct
- Selector finds element
- Application behavior doesn't match spec
- Manually reproducible

**Example:**
```
Classification: APPLICATION DEFECT (High confidence)

Root Cause:
- Delete button click doesn't remove todo from list
- API call likely not implemented or not wired to UI
- Expected: Todo removed after delete click
- Actual: Todo remains visible

Fix:
1. Switch to @tdd-developer
2. Write integration test for delete functionality
3. Implement delete handler and API call
4. Re-run UI tests
```

#### Type 2: Test Code Defect

**Indicators:**
- Application works manually
- Selector is wrong or outdated
- Test timing assumptions incorrect
- Assertions too strict/loose

**Example:**
```
Classification: TEST DEFECT (High confidence)

Root Cause:
- Selector expects text "title is required"
- Actual error message is "Todo title cannot be empty"
- Text mismatch in test code

Fix:
1. Update test selector to match actual error message
2. Change: getByText(/title is required/i)
   To: getByText(/todo title cannot be empty/i)
3. Re-run UI tests
```

#### Type 3: Environment Defect

**Indicators:**
- Intermittent failures
- Works locally, fails in CI (or vice versa)
- Timing-related
- Resource issues (ports, network)

**Example:**
```
Classification: ENVIRONMENT DEFECT (Medium confidence)

Root Cause:
- Timeout waiting for API response
- Backend might not be running
- Network/port issues
- Race condition in test environment

Fix:
1. Verify backend running: curl http://localhost:3001/api/todos
2. Check for port conflicts: lsof -i :3001
3. Restart services: npm start
4. Re-run UI tests
```

### 9. Provide Actionable Next Steps

**For Application Defects:**
```
Next Steps:
1. Switch to @tdd-developer to implement missing functionality
2. Write unit/integration tests for the feature
3. Implement the feature
4. Re-run UI tests: /run-ui-tests
```

**For Test Defects:**
```
Next Steps:
1. Fix test selectors/assertions
2. Re-run UI tests: /run-ui-tests
```

**For Environment Defects:**
```
Next Steps:
1. Verify environment setup (backend running, ports available)
2. Restart services if needed
3. Re-run UI tests: /run-ui-tests
```

### 10. Success Case

**If all tests pass:**

```
UI Test Suite Results
=====================

✅ ALL TESTS PASSED (10/10)

Test Scenarios:
1. ✅ Create new todo
2. ✅ Toggle completion
3. ✅ Delete todo
4. ✅ Edit todo
5. ✅ Empty validation
6. ✅ Long title handling
7. ✅ Filter by status
8. ✅ Clear completed
9. ✅ Persistence after reload
10. ✅ Error state handling

Total: 10 tests in 15.3s
Overall: 100% pass rate 🎉

Next Steps:
1. Validate step completion: /validate-step {step-number}
2. Commit and push: /commit-and-push feature/<branch-name>
```

## Example Execution

```bash
# 1. Install dependencies (first time or after rebuild)
$ npm run test:ui:install --workspace=frontend
✅ Playwright installed successfully

# 2. Ensure services running
$ npm start
Backend: http://localhost:3001
Frontend: http://localhost:3000

# 3. Run UI tests
$ npm run test:ui --workspace=frontend

Running 10 tests using 1 worker

  ✅ user can create a new todo (2.1s)
  ✅ user can toggle completion (1.8s)
  ❌ user can delete a todo (5.2s)
  ✅ user can edit todo (2.3s)
  ❌ prevents creating empty todo (1.5s)
  ✅ filters todos by status (3.1s)
  ✅ clears completed todos (2.7s)
  ✅ handles long titles (1.9s)
  ✅ persists after reload (4.2s)
  ✅ shows error states (2.1s)

8 passed, 2 failed (15.3s)

# 4. Analyze failures
Failed Test #1: "user can delete a todo"
Classification: APPLICATION DEFECT
- Delete handler not implemented

Failed Test #2: "prevents creating empty todo"
Classification: TEST DEFECT
- Error message text mismatch

# 5. Provide next steps
Fix application defect: @tdd-developer implement delete
Fix test defect: Update error message selector
```

## Success Criteria

- ✅ Playwright dependencies installed (test:ui:install completed)
- ✅ Backend and frontend services running
- ✅ UI tests executed successfully
- ✅ Clear pass/fail summary provided
- ✅ Failed tests detailed with error messages
- ✅ Each failure classified (application/test/environment)
- ✅ Root causes identified
- ✅ Actionable next steps provided
- ✅ If install fails after remediation, stopped immediately with blocker report

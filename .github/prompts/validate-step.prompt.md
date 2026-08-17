---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ["search", "read", "execute", "web", "todo"]
---

# Validate Step Completion

Validate that all success criteria for a specific GitHub Issue step are met.

## Input

Step number (REQUIRED): ${input:step-number:Enter step number (e.g., 5-0, 5-1, 5-2)}

## Instructions

### 1. Validate Step Number Provided

If no step number provided, STOP and ask:

```
Please provide a step number to validate.

Example: /validate-step 5-1
```

Do NOT proceed without a step number.

### 2. Find the Main Exercise Issue

Use gh CLI (from Workflow Utilities in project instructions):

```bash
gh issue list --state open
```

Look for the issue with "Exercise:" in the title.
Extract the issue number.

### 3. Get Issue Content with Comments

```bash
gh issue view <issue-number> --comments
```

### 4. Locate the Specific Step

Search through the issue content to find:

```
# Step {step-number}:
```

For example, if step-number is "5-1", search for "# Step 5-1:"

Extract the full step section, including:
- Step title
- Instructions
- Success Criteria section

### 5. Extract Success Criteria

Find the "Success Criteria" or similar section within the step.

Common section headings:
- `## Success Criteria`
- `### Success Criteria`
- `:trophy: Success Criteria:`
- `:white_check_mark: Validation Checklist:`

Extract all criterion items (usually a bulleted or numbered list).

### 6. Check Each Criterion

For each success criterion, validate against the current workspace state:

**Common checks:**

1. **File exists:**
   ```bash
   test -f <file-path> && echo "✅ File exists" || echo "❌ File missing"
   ```

2. **Tests pass:**
   ```bash
   npm test
   ```

3. **Lint clean:**
   ```bash
   npm run lint
   ```

4. **Function/endpoint implemented:**
   - Read the relevant file
   - Check for required code patterns
   - Verify implementation matches spec

5. **UI tests pass (if required):**
   ```bash
   npm run test:ui
   ```

6. **Code follows patterns:**
   - Check patterns-discovered.md for project conventions
   - Verify adherence

### 7. Report Completion Status

Provide a clear, actionable report:

```
Step 5-1 Validation Report
==========================

✅ PASSING (3/4 criteria):

1. ✅ POST /api/todos endpoint implemented
   - Found in packages/backend/src/app.js
   - Returns 201 status
   - Returns todo object with id, title, completed, createdAt

2. ✅ Tests written and passing
   - Test suite: packages/backend/__tests__/app.test.js
   - All POST tests passing (3/3)

3. ✅ Lint clean
   - No ESLint errors
   - No warnings

❌ FAILING (1/4 criteria):

4. ❌ Validation prevents empty title
   - Issue: Missing validation for empty string
   - Current: Accepts empty title ""
   - Required: Return 400 with error message
   - Fix: Add title validation in POST handler

Overall Status: 3/4 (75%) - 1 criterion incomplete

Next Steps:
1. Fix criterion 4: Add title validation
2. Re-run validation: /validate-step 5-1
3. Once all pass, commit and push: /commit-and-push feature/<branch-name>
```

### 8. Provide Guidance for Incomplete Items

For any failing criteria, provide specific guidance:

**Missing Implementation:**
```
❌ DELETE endpoint not implemented

Fix:
1. Write test for DELETE /api/todos/:id
2. Implement DELETE handler
3. Test passes
4. Re-validate
```

**Test Failures:**
```
❌ Tests failing (2 failed)

Failed tests:
- "should handle missing title" - Expected 400, got 201
- "should validate title length" - Not implemented

Fix:
1. Review test expectations
2. Update implementation to match
3. Re-run tests: npm test
4. Re-validate
```

**Lint Errors:**
```
❌ Lint errors present (5 errors)

Categories:
- 3 unused variables
- 2 console statements

Fix:
1. Switch to @code-reviewer: Address lint errors systematically
2. Re-run lint: npm run lint
3. Re-validate
```

### 9. Success Case

If ALL criteria pass:

```
Step 5-1 Validation Report
==========================

✅ ALL CRITERIA MET (4/4)

1. ✅ POST /api/todos endpoint implemented
2. ✅ Tests written and passing
3. ✅ Lint clean
4. ✅ Validation prevents empty title

Overall Status: 4/4 (100%) - Step complete! 🎉

Next Steps:
1. Commit and push changes: /commit-and-push feature/<branch-name>
2. Move to next step: /execute-step
```

## Example Execution

```bash
# User runs: /validate-step 5-1

# 1. Find exercise issue
$ gh issue list --state open
#42 Exercise: Build Full-Stack Todo App

# 2. Get issue content
$ gh issue view 42 --comments

# 3. Find Step 5-1 section
# Step 5-1: Implement POST Endpoint

Success Criteria:
- POST /api/todos endpoint returns 201
- Response includes id, title, completed, createdAt
- Tests written and passing
- Validation prevents empty title

# 4. Check each criterion
$ # Check endpoint implementation
$ grep -A 10 "app.post('/api/todos'" packages/backend/src/app.js
# ✅ Found

$ # Run tests
$ npm test
# ✅ All tests passing (8/8)

$ # Check lint
$ npm run lint
# ✅ No errors

$ # Check validation
$ grep "title" packages/backend/src/app.js
# ✅ Validation logic present

# 5. Report
✅ ALL CRITERIA MET (4/4) - Step complete!
```

## Success Criteria

- ✅ Step number provided
- ✅ Exercise issue found
- ✅ Step section located in issue
- ✅ Success criteria extracted
- ✅ Each criterion checked against workspace
- ✅ Clear pass/fail report provided
- ✅ Specific guidance for incomplete items
- ✅ Next steps clearly stated

---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ["read", "execute", "todo"]
---

# Commit and Push to Feature Branch

Analyze workspace changes, generate a conventional commit message, and push to a feature branch.

## Input

Branch name (REQUIRED): ${input:branch-name:Enter feature branch name (e.g., feature/add-post-endpoint)}

## Instructions

### 1. Validate Branch Name Provided

If no branch name was provided, STOP and ask the user:

```
Please provide a feature branch name to commit and push changes.

Example: /commit-and-push feature/add-post-endpoint
```

Do NOT proceed without a branch name.

### 2. Check for Required UI Testing

If the current step includes UI workflow requirements:
- Check if `/run-ui-tests` was already successfully executed in this chat session
- OR run `npm run test:ui` to verify UI tests pass

If UI tests are required but haven't been run or are failing:
```
⚠️  UI tests required for this step. Please run:
/run-ui-tests

Then retry: /commit-and-push {branch-name}
```

Stop and do not commit until UI tests pass.

### 3. Analyze Changes

```bash
git status
git diff
```

Review:
- Files modified, added, or deleted
- Nature of changes (feature, fix, refactor, docs, etc.)
- Scope of changes (backend, frontend, tests, docs)

### 4. Generate Conventional Commit Message

Use the conventional commit format (from Git Workflow in project instructions):

**Format:** `<type>: <description>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `style:` - Code style/formatting

**Examples:**
- `feat: implement POST /api/todos endpoint`
- `test: add validation tests for todo creation`
- `fix: handle empty title in todo creation`
- `refactor: extract todo validation logic`

Generate a clear, descriptive commit message based on the changes.

### 5. Create or Switch to Feature Branch

**If branch does not exist:**
```bash
git checkout -b <branch-name>
```

**If branch exists:**
```bash
git checkout <branch-name>
```

Verify you're on the correct branch:
```bash
git branch --show-current
```

**CRITICAL:** NEVER commit to `main` or any branch other than the user-provided branch name.

### 6. Stage All Changes

```bash
git add .
```

Verify staged changes:
```bash
git status
```

### 7. Commit with Generated Message

```bash
git commit -m "<generated-commit-message>"
```

Example:
```bash
git commit -m "feat: implement POST /api/todos endpoint with validation"
```

### 8. Push to Feature Branch

```bash
git push origin <branch-name>
```

If this is the first push for this branch:
```bash
git push -u origin <branch-name>
```

### 9. Confirm Success

Provide summary:
```
✅ Changes committed and pushed successfully!

Branch: feature/add-post-endpoint
Commit: feat: implement POST /api/todos endpoint with validation

Files changed:
- packages/backend/src/app.js
- packages/backend/__tests__/app.test.js

Next steps:
- Continue to next step: /execute-step
- Or create a pull request: gh pr create
```

## Example Execution

```bash
# User runs: /commit-and-push feature/implement-post-endpoint

# 1. Analyze changes
$ git diff
# Shows implementation of POST endpoint and tests

# 2. Generate commit message
Generated: "feat: implement POST /api/todos endpoint with validation"

# 3. Create feature branch
$ git checkout -b feature/implement-post-endpoint
Switched to a new branch 'feature/implement-post-endpoint'

# 4. Stage changes
$ git add .

# 5. Commit
$ git commit -m "feat: implement POST /api/todos endpoint with validation"
[feature/implement-post-endpoint abc1234] feat: implement POST /api/todos endpoint

# 6. Push
$ git push -u origin feature/implement-post-endpoint
Enumerating objects: 5, done.
...
To github.com:user/repo.git
 * [new branch] feature/implement-post-endpoint -> feature/implement-post-endpoint

✅ Success!
```

## Safety Checks

Before committing:
- ✅ Branch name provided
- ✅ UI tests pass (if required)
- ✅ Not on `main` branch
- ✅ Changes are intentional
- ✅ Commit message follows convention
- ✅ Pushing to correct feature branch

## Error Handling

**If UI tests fail:**
```
❌ UI tests failing. Fix failures before committing.
Run: /run-ui-tests
```

**If on wrong branch:**
```
⚠️  Currently on 'main'. Switching to 'feature/branch-name'...
```

**If no changes to commit:**
```
⚠️  No changes detected. Nothing to commit.
```

**If push fails:**
```
❌ Push failed. Check network connection and permissions.
Error: [show git error]
```

## Success Criteria

- ✅ Branch name provided by user
- ✅ UI tests pass (if required for step)
- ✅ Changes analyzed and understood
- ✅ Conventional commit message generated
- ✅ Feature branch created or switched to
- ✅ All changes staged
- ✅ Commit successful
- ✅ Push to feature branch successful
- ✅ NOT pushed to main or other branches

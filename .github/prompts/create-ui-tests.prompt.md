---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
tools: ["search", "read", "edit", "execute", "todo"]
---

# Create UI Tests for Critical Journeys

Create Playwright UI tests for critical user journeys using Page Object Model best practices.

## Input

Journeys (optional): ${input:journeys:Enter journeys to test (or leave blank for default: create, edit, toggle, delete, error)}

## Instructions

### 1. Determine Journeys to Test

**If journeys not provided, use default set:**
- Create (user creates new todo)
- Edit (user updates existing todo)
- Toggle (user marks todo complete/incomplete)
- Delete (user removes todo)
- Error handling (validation prevents invalid input)

**If journeys provided, use those specific journeys.**

### 2. HARD LIMIT: Maximum 5 Playwright Tests

**CRITICAL CONSTRAINT:**
- Create a MAXIMUM of 5 Playwright test cases (`test(...)` or `it(...)`) in this run
- Target: 3-5 total test cases (not more)
- Include at least 1 error-path test within the 3-5 total
- If more than 5 candidate scenarios exist, select the HIGHEST-RISK 5 only
- List any deferred scenarios instead of creating additional tests

**Prioritization for 5-test limit:**
1. Core CRUD operations (create, read, update, delete)
2. Critical error states (validation failures)
3. High-impact user interactions (toggle, filter)
4. Edge cases and secondary flows (deferred if over limit)

### 3. Review Existing Tests

Check if UI tests already exist:

```bash
find tests/ui -name "*.spec.js" -o -name "*.test.js"
```

If tests exist:
- Read existing tests
- Identify what's already covered
- Only add NEW tests for uncovered journeys
- Update existing tests if needed

### 4. Design Page Object Model Structure

**Required structure:**

```
tests/ui/
├── pages/
│   ├── TodoPage.js          # Main page object
│   └── BasePage.js          # Shared utilities (optional)
├── fixtures/
│   └── testData.js          # Test data generators (optional)
└── e2e.spec.js              # Test scenarios (3-5 tests max)
```

**Page Object Principles:**
- Reusable UI interactions in page object classes
- Test files focused on scenario intent and assertions
- No duplicated selectors across tests
- Encapsulate waits in page objects

### 5. Create or Update Page Object

**Example TodoPage.js:**

```javascript
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Locators - use stable, accessibility-first selectors
    this.todoInput = page.getByRole('textbox', { name: /add todo/i });
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoList = page.getByRole('list');
  }
  
  async goto() {
    await this.page.goto('http://localhost:3000');
  }
  
  async addTodo(title) {
    await this.todoInput.fill(title);
    await this.addButton.click();
    // State-based wait (NOT arbitrary timeout)
    await this.getTodoByTitle(title).waitFor({ state: 'visible' });
  }
  
  async toggleTodo(title) {
    const todo = this.getTodoByTitle(title);
    await todo.getByRole('checkbox').click();
  }
  
  async deleteTodo(title) {
    const todo = this.getTodoByTitle(title);
    await todo.getByRole('button', { name: /delete/i }).click();
    await this.getTodoByTitle(title).waitFor({ state: 'detached' });
  }
  
  // Query helpers
  getTodoByTitle(title) {
    return this.todoList.locator('li').filter({ hasText: title });
  }
  
  async getTodoCount() {
    return await this.todoList.locator('li').count();
  }
}

module.exports = { TodoPage };
```

### 6. Create Test Scenarios (3-5 Tests Max)

**Template:**

```javascript
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo Application', () => {
  let todoPage;
  
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });
  
  // Test 1: Create journey (happy path)
  test('user can create a new todo', async () => {
    const todoTitle = 'Buy groceries';
    await todoPage.addTodo(todoTitle);
    await expect(todoPage.getTodoByTitle(todoTitle)).toBeVisible();
  });
  
  // Test 2: Toggle journey (happy path)
  test('user can toggle todo completion', async () => {
    const todoTitle = 'Complete task';
    await todoPage.addTodo(todoTitle);
    await todoPage.toggleTodo(todoTitle);
    expect(await todoPage.isCompleted(todoTitle)).toBe(true);
  });
  
  // Test 3: Delete journey (happy path)
  test('user can delete a todo', async () => {
    const todoTitle = 'Temporary task';
    await todoPage.addTodo(todoTitle);
    await todoPage.deleteTodo(todoTitle);
    await expect(todoPage.getTodoByTitle(todoTitle)).not.toBeVisible();
  });
  
  // Test 4: Error handling (error path - REQUIRED)
  test('prevents creating empty todo', async () => {
    await todoPage.todoInput.fill('');
    await todoPage.addButton.click();
    const errorMessage = todoPage.page.getByText(/title is required/i);
    await expect(errorMessage).toBeVisible();
  });
  
  // STOP HERE if 5 tests reached (4 happy + 1 error = 5 total)
  // Do NOT add test 5, 6, 7, etc. beyond the limit
});
```

### 7. Use Stable Selectors (Priority Order)

**Best to Worst:**

1. **Role-based (BEST):**
   ```javascript
   page.getByRole('button', { name: /add/i })
   page.getByRole('textbox', { name: /todo/i })
   ```

2. **Label-based:**
   ```javascript
   page.getByLabel(/todo title/i)
   page.getByPlaceholder(/enter todo/i)
   ```

3. **Test ID (acceptable):**
   ```javascript
   page.getByTestId('todo-item')
   ```

4. **CSS selectors (AVOID):**
   ```javascript
   // ❌ Brittle, avoid
   page.locator('.todo-item .delete-btn')
   ```

### 8. Use State-Based Waits (NOT Timeouts)

```javascript
// ✅ GOOD - Wait for state
await expect(page.getByText('Success')).toBeVisible();
await page.getByRole('button').waitFor({ state: 'enabled' });

// ❌ BAD - Arbitrary timeout
await page.waitForTimeout(1000);
```

### 9. Verify Test Count Before Finishing

**Before completing:**

Count the number of `test(...)` or `it(...)` calls created/updated.

**If count > 5:**
- Reduce to highest-priority 5 tests
- Remove or comment out lower-priority tests
- List deferred scenarios in a comment

**Example:**
```javascript
// Created Tests (5 total - AT LIMIT):
// 1. Create todo ✅
// 2. Toggle completion ✅
// 3. Delete todo ✅
// 4. Empty validation ✅
// 5. Edit todo ✅

// Deferred Scenarios (for future iterations):
// - Filter todos by status
// - Clear completed todos
// - Handle long titles
// - Concurrent edits
```

**Do NOT claim "small scope" if final count > 5.**

### 10. Report Files Changed and Coverage

Provide summary:

```
UI Tests Created
================

Files Changed:
✅ tests/ui/pages/TodoPage.js (created/updated)
✅ tests/ui/e2e.spec.js (created/updated)

Test Scenarios Covered (5 total):
1. ✅ Create new todo (happy path)
2. ✅ Toggle completion (happy path)
3. ✅ Delete todo (happy path)
4. ✅ Empty title validation (error path)
5. ✅ Edit todo title (happy path)

Deferred Scenarios:
- Filter by status (deprioritized)
- Clear completed (deprioritized)

Test Count: 5 (at maximum limit)

Next Steps:
1. Run UI tests: /run-ui-tests
2. Fix any failures
3. Validate step: /validate-step {step-number}
```

## Best Practices Applied

- ✅ Page Object Model separates interactions from assertions
- ✅ Stable selectors (role-based preferred)
- ✅ State-based waits (no arbitrary timeouts)
- ✅ Deterministic tests (no random data)
- ✅ Isolated tests (no shared state)
- ✅ Readable tests (clear Arrange-Act-Assert)
- ✅ Maximum 5 tests enforced
- ✅ At least 1 error-path test included

## Success Criteria

- ✅ Journeys identified (default or user-provided)
- ✅ Maximum 5 Playwright test cases created
- ✅ At least 1 error-path test included
- ✅ Page Object Model applied (interactions in page objects)
- ✅ Stable selectors used (role-based preferred)
- ✅ State-based waits used (no timeouts)
- ✅ Tests are deterministic and isolated
- ✅ Test count verified <= 5 before finishing
- ✅ Files changed and coverage reported
- ✅ Deferred scenarios listed if > 5 candidates

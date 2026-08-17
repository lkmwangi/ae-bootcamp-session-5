# Patterns Discovered

## Purpose

Document recurring code patterns and architectural decisions specific to this project. These patterns guide AI suggestions and maintain consistency across the codebase.

## Pattern Template

```markdown
### Pattern Name

**Context:** When/where this pattern applies

**Problem:** What issue does this pattern solve?

**Solution:** How to implement this pattern

**Example:**
```code
// Show concrete example
```

**Related Files:**
- List files where this pattern is used

**Notes:**
- Additional considerations
- Edge cases
- When NOT to use this pattern
```

---

## Discovered Patterns

### Service Initialization: Empty Array vs Null

**Context:** Initializing in-memory data structures for API services (backend)

**Problem:** How should we initialize empty collections - as `null`, `undefined`, or empty array `[]`?

**Solution:** Always initialize collections as empty arrays `[]`, never `null` or `undefined`

**Rationale:**
- Tests expect array methods (`.map()`, `.filter()`, `.find()`) to work immediately
- Empty array is semantically correct for "no items yet"
- Avoids null checks throughout the codebase
- Consistent with JavaScript best practices

**Example:**

```javascript
// ✅ CORRECT
let todos = [];  // Can immediately use .map(), .filter(), etc.

app.get('/api/todos', (req, res) => {
  res.json(todos);  // Works even when empty
});

// ❌ INCORRECT
let todos = null;  // Requires null checks everywhere

app.get('/api/todos', (req, res) => {
  res.json(todos || []);  // Unnecessary fallback
});
```

**Related Files:**
- `packages/backend/src/app.js` - todos array initialization

**Notes:**
- This pattern emerged during initial backend setup when tests failed with null initialization
- Applies to all collection-based state in this project
- When adding new collections (e.g., users, tags), follow this pattern

---

### [Your Next Pattern]

**Context:**

**Problem:**

**Solution:**

**Example:**

**Related Files:**

**Notes:**

const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo Application - Critical User Journeys', () => {
  let todoPage;
  
  test.beforeEach(async ({ page, request }) => {
    // Clear all todos before each test for clean state
    const response = await request.get('http://localhost:3001/api/todos');
    if (response.ok()) {
      const todos = await response.json();
      for (const todo of todos) {
        await request.delete(`http://localhost:3001/api/todos/${todo.id}`);
      }
    }
    
    // Navigate to app
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });
  
  // Test 1: Create journey (happy path)
  test('user can create a new todo', async () => {
    // Arrange - use unique title to avoid conflicts
    const todoTitle = `Buy groceries ${Date.now()}`;
    
    // Act
    await todoPage.addTodo(todoTitle);
    
    // Assert
    await expect(todoPage.getTodoByTitle(todoTitle)).toBeVisible();
  });
  
  // Test 2: Toggle journey (happy path)
  test('user can toggle todo completion status', async () => {
    // Arrange
    const todoTitle = 'Complete homework';
    await todoPage.addTodo(todoTitle);
    
    // Act - Toggle to complete
    await todoPage.toggleTodo(todoTitle);
    
    // Assert
    expect(await todoPage.isCompleted(todoTitle)).toBe(true);
    
    // Act - Toggle back to incomplete
    await todoPage.toggleTodo(todoTitle);
    
    // Assert
    expect(await todoPage.isCompleted(todoTitle)).toBe(false);
  });
  
  // Test 3: Delete journey (happy path)
  test('user can delete a todo', async () => {
    // Arrange
    const todoTitle = 'Temporary task';
    await todoPage.addTodo(todoTitle);
    expect(await todoPage.getTodoCount()).toBe(1);
    
    // Act
    await todoPage.deleteTodo(todoTitle);
    
    // Assert
    await expect(todoPage.getTodoByTitle(todoTitle)).not.toBeVisible();
    expect(await todoPage.getTodoCount()).toBe(0);
  });
  
  // Test 4: Stats calculation (happy path)
  test('displays correct stats for incomplete and completed todos', async () => {
    // Arrange - Create 3 todos
    await todoPage.addTodo('Todo 1');
    await todoPage.addTodo('Todo 2');
    await todoPage.addTodo('Todo 3');
    
    // Act - Mark one as complete
    await todoPage.toggleTodo('Todo 2');
    
    // Assert
    expect(await todoPage.getIncompleteCount()).toBe(2);
    expect(await todoPage.getCompletedCount()).toBe(1);
  });
  
  // Test 5: Empty state (error/edge path - REQUIRED)
  test('displays empty state message when no todos exist', async () => {
    // Assert - On initial load with no todos
    expect(await todoPage.isEmptyStateVisible()).toBe(true);
    
    // Arrange - Add a todo
    await todoPage.addTodo('Test todo');
    
    // Assert - Empty state should be hidden
    expect(await todoPage.isEmptyStateVisible()).toBe(false);
    
    // Act - Delete the todo
    await todoPage.deleteTodo('Test todo');
    
    // Assert - Empty state should reappear
    expect(await todoPage.isEmptyStateVisible()).toBe(true);
  });
});

// Test Count: 5 (at maximum limit)
//
// Deferred Scenarios (future iterations):
// - Edit todo title
// - Filter todos by status (all/active/completed)
// - Clear completed todos
// - Handle long todo titles
// - Network error handling (API failure)

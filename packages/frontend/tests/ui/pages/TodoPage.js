class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Locators - use stable, accessibility-first selectors
    this.todoInput = page.getByPlaceholder(/what needs to be done/i);
    this.addButton = page.getByRole('button', { name: /add/i });
    this.todoList = page.getByTestId('todo-list');
    this.emptyStateMessage = page.getByTestId('empty-state');
    this.errorMessage = page.getByText(/error loading todos/i);
  }
  
  async goto() {
    await this.page.goto('http://localhost:3000');
    // Wait for app to load
    await this.page.waitForLoadState('networkidle');
    // Wait for React Query to finish initial fetch (either empty state or todos appear)
    await this.page.waitForTimeout(1000);
  }
  
  async addTodo(title) {
    await this.todoInput.fill(title);
    await this.addButton.click();
    
    // Wait for the new todo to appear in the list (using same locator as getTodoByTitle)
    await this.getTodoByTitle(title).waitFor({ state: 'visible', timeout: 15000 });
  }
  
  async toggleTodo(title) {
    const todo = this.getTodoByTitle(title);
    const checkbox = todo.getByRole('checkbox');
    await checkbox.click();
    // Wait a moment for the mutation to process
    await this.page.waitForTimeout(300);
  }
  
  async deleteTodo(title) {
    const todo = this.getTodoByTitle(title);
    const deleteButton = todo.getByRole('button', { name: /delete todo/i });
    await deleteButton.click();
    // Wait for removal
    await this.getTodoByTitle(title).waitFor({ state: 'detached' });
  }
  
  // Query helpers
  getTodoByTitle(title) {
    return this.todoList
      .locator('li')
      .filter({ hasText: title })
      .first();  // Handle duplicates by selecting first match
  }
  
  async getTodoCount() {
    const items = await this.todoList.locator('li').all();
    return items.length;
  }
  
  async isCompleted(title) {
    const todo = this.getTodoByTitle(title);
    const checkbox = todo.getByRole('checkbox');
    return await checkbox.isChecked();
  }
  
  async getIncompleteCount() {
    const chip = this.page.getByText(/items left/i);
    const text = await chip.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  async getCompletedCount() {
    const chip = this.page.getByText(/completed/i);
    const text = await chip.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  async isEmptyStateVisible() {
    return await this.emptyStateMessage.isVisible();
  }
  
  async isErrorStateVisible() {
    return await this.errorMessage.isVisible();
  }
}

module.exports = { TodoPage };

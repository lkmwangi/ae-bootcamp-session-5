# Copilot Instructions

## Project Context

- Full-stack TODO application with React frontend and Express backend.
- Focus on iterative, feedback-driven development.
- Current phase: Backend stabilization and frontend feature completion.

## Documentation References

- [Project overview](../docs/project-overview.md): Architecture, tech stack, and structure.
- [Testing guidelines](../docs/testing-guidelines.md): Test patterns and standards.
- [Workflow patterns](../docs/workflow-patterns.md): Development workflow guidance.

## Development Principles

- **Test-Driven Development:** Follow the Red-Green-Refactor cycle.
- **Incremental Changes:** Make small, testable modifications.
- **Systematic Debugging:** Use test failures as guides.
- **Validation Before Commit:** Ensure all tests pass and there are no lint errors.

## Testing Scope

This project uses unit tests, integration tests, and UI end-to-end tests:

- **Backend:** Jest and Supertest for API testing.
- **Frontend:** React Testing Library for component unit and integration tests.
- **UI testing:** Playwright for critical user journey automation.
- **Manual browser testing:** Exploratory validation and visual checks.

These layers combine fast feedback from unit and integration tests with end-to-end quality confidence from UI tests.

### Testing Approach by Context

- **Backend API changes:** Write Jest tests first, then implement using the Red-Green-Refactor cycle.
- **Frontend component features:** Write React Testing Library tests first for component behavior, then implement using the Red-Green-Refactor cycle. Follow with manual browser testing for full UI flows.
- This is true TDD: write the test first, then write code to make it pass.

## Workflow Patterns

1. **TDD Workflow:** Write or fix tests -> Run -> Fail -> Implement -> Pass -> Refactor.
2. **Code Quality Workflow:** Run lint -> Categorize issues -> Fix systematically -> Re-validate.
3. **Integration Workflow:** Identify issue -> Debug -> Test -> Fix -> Verify end-to-end.
4. **UI Testing Workflow:** Define critical journeys -> Create UI tests -> Run -> Debug failures -> Validate coverage.

## Agent Usage

- **tdd-developer:** Use for implementation and unit/integration TDD cycles. Do not create or run Playwright UI tests in this mode.
- **code-reviewer:** Use for addressing lint errors and code quality improvements.
- **test-engineer:** Owns all Playwright UI test authoring and execution, failure triage, and isolation checks.

## Memory System

- **Persistent Memory:** This file (.github/copilot-instructions.md) contains foundational principles and workflows.
- **Working Memory:** .github/memory/ directory contains discoveries and patterns.
- During active development, take notes in .github/memory/scratch/working-notes.md (not committed).
- At end of session, summarize key findings into .github/memory/session-notes.md (committed).
- Document recurring code patterns in .github/memory/patterns-discovered.md (committed).
- Reference these files when providing context-aware suggestions.

## Workflow Utilities

GitHub CLI commands are available to all modes for workflow automation:

```bash
# List open issues
gh issue list --state open

# Get issue details
gh issue view <issue-number>

# Get issue details with comments
gh issue view <issue-number> --comments
```

- The main exercise issue has `Exercise:` in the title.
- Steps are posted as comments on the main issue.
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked.

## Git Workflow

- Use conventional commit formats such as `feat:`, `fix:`, `chore:`, and `docs:`.
- Use feature branches named `feature/<descriptive-name>`.
- Always stage all changes before committing: `git add .`.
- Push to the correct branch: `git push origin <branch-name>`.
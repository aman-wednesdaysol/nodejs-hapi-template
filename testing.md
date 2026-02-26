# Testing - Node.js Hapi Template

This document outlines the testing strategy, framework, and commands for this project.

## Testing Framework

The project uses **Jest** as its primary testing framework. Jest provides a comprehensive suite for unit and integration testing, including assertions, mocking, and coverage reporting.

## Running Tests

You can run the tests using the following commands:

- **Run all tests**: `npm test`
- **Run tests and generate coverage badges**: `npm run test:badges`
- **Clear Jest cache**: `npm run clear:test-cache`

## Test Structure

Tests are typically located alongside the code they test, often in a `tests/` subdirectory. For example:

- Route tests: `lib/routes/<feature>/tests/routes.test.js`
- Service tests: `lib/services/tests/<service>.test.js`
- Utility tests: `utils/tests/index.test.js`

## Mocking Strategy

The project uses Jest's built-in mocking capabilities to isolate components during testing.

- **Manual Mocks**: Located in the `__mocks__/` directory (e.g., for external libraries like `@supabase/supabase-js`).
- **Function Mocking**: Using `jest.fn()` or `jest.spyOn()` to mock internal functions or service calls.
- **Request/Response Mocking**: The `lib/testServer.js` utility is used to initialize a Hapi server instance specifically for testing, allowing you to inject requests and inspect responses without running a full server.

## Coverage

Test coverage is tracked using Jest's built-in coverage reporter. Running `npm test` will generate a coverage report in the `coverage/` directory. Coverage badges are also maintained in the `badges/` folder when running `npm run test:badges`.

## Best Practices

- **Isolate Tests**: Ensure each test is independent and doesn't rely on the state of other tests.
- **Mock External Dependencies**: Use mocks for database calls, API requests, and other external systems to ensure tests are fast and reliable.
- **Aim for High Coverage**: Regularly review coverage reports to identify untested areas of the codebase.
- **Use Meaningful Assertions**: Write clear and descriptive test cases and assertions to make failures easier to debug.

# Testing Documentation

This document provides comprehensive information about the testing setup for the Corporate AI LangChain project.

## Overview

The project includes multiple layers of testing to ensure reliability and quality:

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and service integration testing
- **End-to-End Tests**: Complete user workflow testing
- **Continuous Integration**: Automated testing on every push/PR

## Test Structure

```
├── backend/
│   ├── test/
│   │   ├── integration/           # Backend integration tests
│   │   │   └── app.e2e-spec.ts
│   │   └── jest-e2e.json         # Jest E2E configuration
│   └── package.json              # Test scripts
├── frontend/
│   ├── tests/
│   │   └── e2e/                  # Frontend E2E tests
│   │       └── user-workflow.spec.ts
│   ├── src/
│   │   └── components/
│   │       └── __tests__/        # Frontend unit tests
│   ├── jest.config.js            # Jest configuration
│   ├── playwright.config.ts      # Playwright configuration
│   └── package.json              # Test scripts
├── .github/
│   └── workflows/
│       └── integration-tests.yml # CI/CD pipeline
└── run-integration-tests.ps1     # Local test runner
```

## Running Tests

### Backend Tests

```bash
cd backend

# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
```

### Complete Integration Tests

```bash
# Run all tests (backend + frontend)
./run-integration-tests.ps1
```

## Test Types

### Backend Unit Tests

- **Location**: `backend/src/**/*.spec.ts`
- **Framework**: Jest + NestJS Testing Module
- **Coverage**: Controllers, Services, Entities
- **Database**: In-memory SQLite for testing

### Backend Integration Tests

- **Location**: `backend/test/integration/`
- **Framework**: Jest + Supertest
- **Coverage**: Complete API workflows
- **Features**:
  - Document upload flow
  - Chat management
  - Query processing
  - Error handling

### Frontend Unit Tests

- **Location**: `frontend/src/components/__tests__/`
- **Framework**: Jest + React Testing Library
- **Coverage**: React components and hooks
- **Features**:
  - Component rendering
  - User interactions
  - Error boundaries
  - Loading states

### Frontend E2E Tests

- **Location**: `frontend/tests/e2e/`
- **Framework**: Playwright
- **Coverage**: Complete user workflows
- **Features**:
  - Document upload → chat workflow
  - Navigation between pages
  - Error handling
  - Responsive design
  - Loading states

## Test Configuration

### Jest Configuration

Both backend and frontend use Jest for unit and integration testing:

- **Backend**: `backend/test/jest-e2e.json`
- **Frontend**: `frontend/jest.config.js`

### Playwright Configuration

Frontend E2E tests use Playwright:

- **Config**: `frontend/playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit
- **Features**: Parallel execution, retry logic, HTML reports

## Continuous Integration

### GitHub Actions

The project includes a comprehensive CI/CD pipeline:

- **Trigger**: Push to main/develop, Pull Requests
- **Jobs**:
  - Backend tests (unit + integration)
  - Frontend tests (unit + build)
  - E2E tests (with backend server)
  - Test summary report

### Local Development

For local development, use the PowerShell script:

```powershell
./run-integration-tests.ps1
```

This script:
1. Runs backend unit tests
2. Runs backend integration tests
3. Runs frontend unit tests
4. Starts backend server
5. Runs frontend E2E tests
6. Provides summary report

## Test Data

### Backend Test Data

- **Documents**: In-memory test documents
- **Chats**: Test chat sessions
- **Queries**: Sample AI queries
- **Database**: In-memory SQLite

### Frontend Test Data

- **Files**: Buffer-based test files
- **API Responses**: Mocked responses
- **User Interactions**: Simulated user actions

## Best Practices

### Writing Tests

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear test descriptions
3. **Isolation**: Each test should be independent
4. **Coverage**: Aim for high test coverage
5. **Maintainability**: Keep tests simple and readable

### Test Organization

1. **Group Related Tests**: Use describe blocks
2. **Setup/Teardown**: Use beforeEach/afterEach
3. **Test Data**: Create reusable test utilities
4. **Mocking**: Mock external dependencies

### Running Tests

1. **Local Development**: Run relevant tests frequently
2. **Before Committing**: Run full test suite
3. **CI/CD**: Automated testing on every change
4. **Debugging**: Use watch mode for development

## Troubleshooting

### Common Issues

1. **Test Timeouts**: Increase timeout values
2. **Database Issues**: Ensure in-memory database setup
3. **API Errors**: Check environment variables
4. **Browser Issues**: Update Playwright browsers

### Debug Commands

```bash
# Debug Jest tests
npm run test:debug

# Debug Playwright tests
npx playwright test --debug

# Show test coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=filename
```

## Environment Variables

### Required for Testing

```bash
# Backend
NODE_ENV=test
OPENAI_API_KEY=test-key

# Frontend
NODE_ENV=test
```

### Optional

```bash
# Playwright
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

## Performance

### Test Execution Time

- **Unit Tests**: < 30 seconds
- **Integration Tests**: < 2 minutes
- **E2E Tests**: < 5 minutes
- **Full Suite**: < 10 minutes

### Optimization

1. **Parallel Execution**: Tests run in parallel when possible
2. **Caching**: Dependencies cached in CI
3. **Selective Testing**: Run only changed tests locally
4. **Resource Management**: Clean up after tests

## Contributing

When adding new features:

1. **Write Tests First**: Follow TDD when possible
2. **Update Test Suite**: Add tests for new functionality
3. **Maintain Coverage**: Keep test coverage high
4. **Document Changes**: Update this document if needed

## Support

For testing issues:

1. Check the troubleshooting section
2. Review test logs and error messages
3. Verify environment setup
4. Consult the framework documentation 
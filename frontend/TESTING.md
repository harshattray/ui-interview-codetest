# Dashboard Testing Documentation

This document outlines the testing approach for the Security Dashboard application.

## Test Structure

The test suite is organized by component type:

- **Component Tests**: Tests for React components (SummaryCard, ExportButton, LineChart, Dashboard)
- **Hook Tests**: Tests for custom React hooks (useDashboardData, useD3LineChart)
- **Utility Tests**: Tests for utility functions (dashboardUtils, colorUtils)
- **Integration Tests**: Tests that verify multiple components working together

## Running Tests

The following npm scripts are available for running tests:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run only component tests
npm run test:components

# Run only hook tests
npm run test:hooks

# Run only utility tests
npm run test:utils
```

## Test Coverage

The test suite covers:

1. **Unit Tests**:

   - Utility functions (formatDelta, getDeltaColor, exportDataAsCSV, getCriticalityColor)
   - React hooks (useDashboardData, useD3LineChart)
   - Individual components (SummaryCard, ExportButton, LineChart, Dashboard)

2. **Integration Tests**:
   - Dashboard component with all child components
   - Data flow between components
   - Visual styling and UI interactions

## Mocking Approach

The tests use the following mocking strategies:

- **GraphQL Queries**: Mocked using Apollo MockedProvider
- **D3 Visualization**: Mocked D3 functions to test chart rendering logic
- **DOM APIs**: Mocked document methods for testing export functionality
- **Theme**: Using Material UI's createTheme for consistent styling in tests

## Test Files

```
src/
├── components/
│   ├── Dashboard/
│   │   └── __tests__/
│   │       ├── Dashboard.test.tsx
│   │       ├── ExportButton.test.tsx
│   │       └── SummaryCard.test.tsx
│   ├── LineChart/
│   │   └── __tests__/
│   │       └── LineChart.test.tsx
│   └── __tests__/
│       └── DashboardIntegration.test.tsx
├── hooks/
│   └── __tests__/
│       ├── useDashboardData.test.ts
│       └── useD3LineChart.test.ts
└── utils/
    └── __tests__/
        ├── colorUtils.test.ts
        └── dashboardUtils.test.ts
```

## Best Practices

The tests follow these best practices:

1. **Isolation**: Each test is isolated and doesn't depend on other tests
2. **Mocking**: External dependencies are mocked to focus on the unit being tested
3. **Readability**: Tests are organized with descriptive names and clear assertions
4. **Coverage**: Tests cover both success and error paths
5. **Accessibility**: UI components are tested for proper accessibility attributes

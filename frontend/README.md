# Security Metrics Dashboard Frontend

## Overview

This is the frontend application for the Security Metrics Dashboard, built with React, TypeScript, and Vite. The application visualizes security metrics data over time, allowing users to filter by time range, criticality levels, and data types (CVEs and advisories).

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Material UI 7** - Component library
- **D3.js** - Data visualization
- **Apollo Client** - GraphQL client
- **Jest & Testing Library** - Testing framework

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at http://localhost:5173 by default.

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint and fix code
- `npm run lint:check` - Check for lint issues without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting issues
- `npm run fix-all` - Run both format and lint

### Testing

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:components` - Run component tests only
- `npm run test:hooks` - Run hook tests only
- `npm run test:utils` - Run utility tests only

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # React components
│   ├── Dashboard/   # Dashboard components
│   ├── ErrorBoundary/ # Error handling components
│   ├── Filters/     # Filter components
│   └── LineChart/   # D3 chart components
├── graphql/         # GraphQL queries and mutations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Features

- Interactive dashboard for security metrics visualization
- Time range filtering (7 days, 30 days, 90 days, etc.)
- Criticality level filtering (Critical, High, Medium, Low)
- Toggle between CVEs and advisories
- Responsive design for various screen sizes
- Error handling and loading states
- Accessible UI components

## Code Quality

This project uses:

- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- lint-staged for running linters on staged files

## Contributing

Please ensure all code passes tests and linting before submitting pull requests:

```bash
npm run lint
npm run test
```

## Environment Variables and Configuration

```
# .env file example
VITE_API_URL=http://localhost:4000/graphql  # GraphQL API endpoint
VITE_APP_TITLE=Security Metrics Dashboard    # Application title
```

## My Approach

For this Security Metrics Dashboard, I took a component-driven approach with a focus on:

1. **Performance Optimization** - Used D3.js with React hooks for efficient rendering of time-series data, implementing data sampling for large datasets and optimized SVG rendering.

2. **Type Safety** - Leveraged TypeScript throughout the application to ensure robust code and prevent runtime errors, particularly with complex data structures from the GraphQL API.

3. **Responsive Design** - Implemented a fully responsive dashboard that adapts to different screen sizes, with special attention to chart resizing and mobile interactions.

4. **Accessibility** - Added ARIA attributes, keyboard navigation support, and screen reader compatibility to ensure the dashboard is accessible to all users.

5. **Error Handling** - Implemented comprehensive error boundaries and graceful fallbacks to ensure the application remains usable even when data fetching fails.

## Challenges and Solutions

1. **TypeScript Integration with D3** - Integrating D3.js with TypeScript presented typing challenges, especially with complex selections and data binding. I solved this by creating custom type definitions and using generics effectively.

2. **Responsive Chart Resizing** - Getting charts to resize smoothly across devices was challenging. I implemented a custom ResizeObserver solution that efficiently recalculates dimensions and redraws only when necessary.

3. **Type Safety in Error Handling** - Encountered TypeScript errors when accessing properties on error objects. I resolved this with proper type assertions and optional chaining to ensure type safety while maintaining good error messages.

## Additional Features and Improvements

1. **Enhanced Tooltips** - Added rich tooltips with percentage changes and trend indicators to provide more context when exploring the data.

2. **Performance Optimizations** - Added memoization for expensive calculations and optimized rendering paths to ensure smooth interactions even on lower-powered devices.

3. **Comprehensive Testing** - Added extensive test coverage for components, hooks, and utilities using Jest and Testing Library with a focus on both unit and integration tests.

4. **Improved Error Visualization** - Enhanced error states with helpful messages and recovery options to guide users when issues occur.

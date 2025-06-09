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

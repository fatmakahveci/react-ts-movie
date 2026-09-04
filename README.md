# React Movie Library

[![React](https://img.shields.io/badge/React-TypeScript-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-React-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Last commit](https://img.shields.io/github/last-commit/fatmakahveci/react-ts-movie)](https://github.com/fatmakahveci/react-ts-movie/commits/main)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE.md)

A Next.js learning project for creating and retrieving movie records through a Firebase Realtime Database API.

## Demo

![Animated conceptual walkthrough of React Movie Library loading movies, adding Arrival, and refreshing the collection](demo.gif)

The walkthrough uses fictional data to illustrate the core fetch, add, and refresh flow without writing to the configured Firebase database.

## Highlights

- Fetch and render movie records from Firebase
- Submit new movies through a typed form
- Dedicated loading, empty, and error states
- Reusable movie list and form components

## Technology

- Next.js
- React
- TypeScript
- Firebase Realtime Database

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- Access to the configured Firebase database

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000. The current learning implementation references a Firebase endpoint in `src/app/page.tsx`; use your own backend before production deployment.

## Quality Checks

```bash
npm run lint
npm run build
```

## Repository Structure

- `src/app/components/AddMovie` — movie submission form
- `src/app/components/MoviesList` — movie collection rendering
- `src/shared` — shared movie types and constants

## Project Resources

- [Changelog](CHANGELOG.md)
- [Contributing guide](.github/CONTRIBUTING.md)
- [Security policy](.github/SECURITY.md)
- [License](LICENSE.md)

# OYRTMA Traffic Management Platform

A production-ready React + Vite project for Oyo State Road Traffic Management Authority (OYRTMA).

## Features

- Modular folder structure: `/components`, `/pages`, `/hooks`, `/context`, `/services`, `/utils`
- React Router v6+ for navigation
- React Query (TanStack Query) for server state management
- JWT authentication with refresh tokens (httpOnly cookies)
- Role-Based Access Control (RBAC): Admin, Officer, Chairman, Senior Officer
- Dark/Light mode toggle (TailwindCSS + shadcn/ui)
- Responsive, accessible UI
- Sample data for Tickets, Complaints, Vehicles, Users
- Placeholder components for all required pages

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `dev`: Start development server
- `build`: Build for production
- `test`: Run tests

## Project Structure

```
src/
  components/    # Reusable UI components
  pages/         # Page components (Dashboard, Tickets, etc.)
  hooks/         # Custom React hooks
  context/       # Context providers (Auth, Theme, etc.)
  services/      # API service layer
  utils/         # Utility functions
```

## Security

- JWT stored in httpOnly cookies
- CSRF/XSS protection best practices
- Role-based route guards

## License

MIT

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

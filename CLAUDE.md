# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build locally
- `npm install` - Install dependencies
- `npm run postinstall` - Prepare Nuxt (runs automatically after install)

### Code Quality
- **Linting**: ESLint runs automatically via lint-staged on commit
- **Formatting**: Prettier runs automatically via lint-staged on commit
- **Pre-commit hooks**: Husky is configured with lint-staged to format and lint on commit

## Project Architecture

### Framework & Technology Stack
- **Nuxt 3**: Vue.js framework with SSR/SSG capabilities
- **Vue 3**: Frontend framework with Composition API
- **TypeScript**: Type checking (nuxt.config.ts, formkit.config.ts)
- **Vuetify 3**: Material Design component library
- **FormKit**: Form handling with auto-import enabled
- **i18n**: Internationalization (English/Japanese) with prefix strategy
- **SASS/SCSS**: Styling with organized structure

### API Integration
- **Kuroco CMS**: Backend integration via `dev-nuxt-auth.a.kuroco.app` 
- **Authentication**: Custom auth composable with login/logout/profile management
- **API Domain**: Dynamic sitekey-based API endpoint switching

### Key Architecture Patterns

#### Authentication System
- **useAuth composable** (`composables/useAuth.js`): Central auth management
  - User state management via `useState('user')`
  - Profile restoration on app load
  - Dynamic API domain switching based on sitekey
  - Route protection for authenticated areas

#### Component Structure
- **Layouts**: `default.vue` and `preview.vue` for different page types
- **Components**: Organized by feature (topics/, reusable components)
- **Pages**: File-based routing with dynamic routes (`[slug].vue`)

#### Styling Architecture
- **Modular SCSS**: Organized in assets/ with foundation, layout, object, and partials
- **Design System**: Vuetify components with custom SCSS overrides
- **Variables**: Centralized in `assets/variables.scss` and `assets/partials/_var.scss`

#### Internationalization
- **Strategy**: `prefix_except_default` (English default, `/ja` prefix for Japanese)
- **Locales**: JSON files in `locales/` directory
- **HTML support**: `strictMessage: false` allows HTML in translation strings

### Important Files
- `nuxt.config.ts` - Main configuration with modules and runtime config
- `composables/useAuth.js` - Authentication logic and user state
- `public/kuroco_front.json` - Frontend routing configuration for Kuroco
- `eslint.config.mjs` - ESLint configuration with custom rules
- `formkit.config.ts` - Form handling configuration

### Development Notes
- **Auto-imports**: FormKit and Vuetify components are auto-imported
- **Development server**: Uses file watching with polling enabled
- **Error handling**: Custom 404 page configured in kuroco_front.json
- **State management**: Uses Nuxt's built-in `useState` for global state
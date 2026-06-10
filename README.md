# TO-DO-app
React Native TODO app with Firebase - featuring task management, tab-based navigation with dedicated My Day, Lists, Planned, and Profile screens, drag-and-drop reorder, notifications, and Google OAuth.

## Features

- **Task Management** - Create, edit, delete, and toggle tasks with due dates, due times, reminders, repeat rules (daily/weekly/monthly/yearly), and notes
- **Tab Navigation** - Bottom tab bar with separate screens for My Day, Lists, Planned, and Profile (replaces sidebar layout)
- **Dynamic Lists** - Lists tab shows all lists overview; tapping opens a dynamic route for each list's tasks
- **Drag & Drop Reorder** - Long-press drag handle to reorder tasks; order persists to Firestore
- **Sorting** - Sort tasks by default order, name, due date, or importance via ListHeaderMenu
- **Bulk Actions** - Mark all pending tasks complete or delete all completed tasks at once
- **Dismissible Banner** - Suggestions banner that auto-hides for the day on dismissal
- **Shared List Screens** - Reusable ListScreens component handles search, sorting, and layout for all list types
- **Custom List Color Picker** - Choose custom colors when creating lists
- **SectionList** - Lists tab uses SectionList to group default and custom lists
- **Internationalization** - Full i18n with English and French; auto-detects device language
- **Theme System** - Consistent color scheme across auth screens, layout, and protected screens
- **Local Notifications** - Schedule and cancel task reminders with expo-notifications; handles repeat scheduling natively
- **Time Picker** - Platform-specific time picker (iOS spinner, Android dialog)
- **Custom Lists** - Create, edit, and delete custom task lists with custom icons and colors
- **User Profiles** - Firebase Auth with email/password + Google OAuth via @react-native-google-signin, profile photos via Firebase Storage
- **Bottom Panel** - Slide-up task detail panel with calendar picker, reminder, and note modals
- **Animated Splash** - Branded animated splash with logo fade-in/scale on app launch
- **Onboarding** - First-launch walkthrough slides (shown once, persisted to AsyncStorage)
- **Pull-to-Refresh** - Sync tasks from Firestore with pull gesture
- **Theme Support** - Light/dark/system-wide theming via ThemeContext; persisted to AsyncStorage
- **EAS Build** - Configured for Expo Application Services (development, preview, production builds)
- **Internationalization (i18n)** - English and French support via i18next with device language auto-detection; persisted to AsyncStorage
- **Optimistic Updates** - UI updates instantly with Firestore sync and rollback on failure

## Architecture

The app follows a **clean architecture** pattern with clear separation of concerns:

```
┌──────────────────────────────┐
│   UI Layer (components/app) │  React components + Expo Router
├──────────────────────────────┤
│  Store Layer (Zustand)       │  State management (auth, task, list, ui)
├──────────────────────────────┤
│  Service Layer               │  Business logic (AuthService, TaskService)
├──────────────────────────────┤
│  Repository Layer            │  Data access abstraction
│  ├── interfaces/            │  Repository contracts
│  ├── firebase/              │  Firebase Firestore + Storage implementation
│  └── watermelon/            │  WatermelonDB local implementation
├──────────────────────────────┤
│  Domain Layer (src/domain/) │  Core models and business rules
└──────────────────────────────┘
```

- **Zustand** stores handle state with optimistic updates (UI updates immediately, syncs async)
- **Repositories** abstract data sources — currently Firebase (primary) and WatermelonDB (offline)
- **Services** encapsulate cross-repository business logic
- **Domain** models are plain objects for serialization

## Getting Started

1. Install dependencies:
   `npm install`

2. Copy `.env.example` to `.env` and fill in Firebase config values

3. Run the app:
   `npm start`

### Building with EAS

Development build: `eas build --profile development --platform all`
Preview build: `eas build --profile preview --platform all`
Production build: `eas build --profile production --platform all`

## Environment

Firebase settings are read from `EXPO_PUBLIC_*` environment variables (see `.env.example`). These are exposed to the app at build time via Expo.

## Expo prebuild
"Check for app config fields that may not be synced in a non-CNG project."

This project keeps native folders (`android/` and/or `ios/`) and uses `app.json` config fields. To keep native projects synced with app config, run prebuild whenever config changes and in CI/build pipelines:

`npx expo prebuild`

## File Structure

```
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/            # Auth screens (login, signup, forgotPassword, emailVerification, welcome)
│   ├── (protected)/       # Protected screens with bottom tab navigation
│   │   ├── myDay.tsx      # My Day task screen
│   │   ├── Planned.tsx    # Planned tasks grouped by date
│   │   ├── profile.tsx    # User profile and settings
│   │   ├── Lists/         # Lists overview + dynamic list detail
│   │   │   ├── index.tsx  # All lists overview
│   │   │   ├── [listId].tsx  # Individual list tasks (dynamic route)
│   │   │   └── _layout.tsx   # Lists stack layout
│   │   └── _layout.tsx    # Tab layout (My Day, Lists, Planned, Profile)
│   ├── index.tsx          # Root redirect (auth gate)
│   └── _layout.tsx        # Root layout with providers
├── assets/                # Images, icons, and SVG assets
├── components/            # Reusable React components
│   ├── Index/             # Components for main screens
│   ├── Modals/            # Modal components (calendar, reminder, note)
│   ├── (auth)/           # Auth components (buttons, GoogleIcon)
│   ├── AddTaskInput.tsx   # Task creation input
│   ├── TaskItem.tsx       # Individual task row with drag, edit, menu
│   ├── TaskList.tsx       # Task list with drag reorder
│   ├── ListHeader.tsx     # Sortable list header with menu
│   ├── EmptyState.tsx     # Empty list placeholder
│   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   ├── CompletedSection.tsx  # Completed tasks section
│   ├── PlannedTasksList.tsx  # Planned tasks grouped by date
│   └── SuggestionBanner.tsx  # Dismissible suggestion banner
├── constants/            # App constants (list definitions)
├── context/               # React contexts (AuthContext, TasksContext, CustomListsContext, ThemeContext)
├── hooks/                 # Custom hooks (useThemeStyles, useDismissibleBanner)
├── locales/               # i18n translation files (en.json, fr.json)
├── src/                   # Clean architecture layers
│   ├── domain/           # Domain models (Task, List, UserProfile, Reminder)
│   ├── services/         # Business logic (AuthService, TaskService, ListService, SyncManager)
│   ├── store/            # Zustand state stores (auth, task, list, ui)
│   ├── repositories/     # Data access layer
│   │   ├── interfaces/   # Repository contracts
│   │   ├── firebase/     # Firebase implementation
│   │   └── watermelon/  # WatermelonDB local implementation
│   ├── db/               # WatermelonDB schema and models
│   ├── hooks/            # App-level hooks (useTaskNotifications)
│   ├── i18n/             # i18next config
│   ├── firebase/         # Firebase config
│   ├── notifications/    # Notification service
│   ├── utils/            # Utility helpers (date, validation, filters)
│   └── tests/            # Jest test suites (120+ tests)
├── styles/               # Theme-aware style files
│   ├── theme.ts         # Light/dark color palette
│   ├── app/             # Screen styles
│   │   ├── (auth)/      # Auth screen styles
│   │   └── (protected)/ # Protected screen styles
│   └── components/      # Component styles
├── types/                # TypeScript type definitions
├── .maestro/             # Maestro E2E test flows (9 flows)
├── .eas/                 # EAS Build configuration
├── esling.config.js      # ESLint configuration
└── firestore.rules      # Firebase Security Rules
```

## Testing

### Lint & TypeScript
`npm run lint`
`npm run typecheck`

### Unit Tests (Jest)
Run all tests: `npm test`
Run specific suite: `npx jest src/tests/components/TaskItem.test.tsx`

Test suites: 16 suites, 120 tests covering components, hooks, services, and utilities.

### E2E Tests (Maestro)

[Maestro](https://maestro.mobile.dev) is used for end-to-end testing on real devices/emulators.

#### Install Maestro

**Windows (recommended):**
```powershell
scoop bucket add maestro
scoop install maestro
```

**macOS:**
```bash
brew tap mobile-dev-inc/maestro
brew install maestro
```

**Linux:**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

#### Run E2E Tests

1. Build and launch the app on a device/emulator:
   ```bash
   npm start
   # or for development build:
   npx eas build --profile development --platform android
   ```

2. Run all flows:
   ```bash
   maestro test .maestro/flows
   ```

3. Run specific flow:
   ```bash
   maestro test .maestro/flows/01-auth-flow.yaml
   ```

4. Helper script:
   ```powershell
   .\run-e2e.ps1              # Run all
   .\run-e2e.ps1 -List        # List flows
   .\run-e2e.ps1 -Flow auth   # Run auth flow
   ```

#### Test Flows

| # | Flow | What it covers |
|---|------|----------------|
| 01 | `auth-flow` | Onboarding → signup → email verification → login |
| 02 | `forgot-password` | Password reset form and submission |
| 03 | `task-crud` | Create, complete, delete tasks |
| 04 | `navigation` | Tab switching: My Day, Lists, Planned, Profile |
| 05 | `profile` | Theme, i18n, user info, logout |
| 06 | `task-details` | Due dates, reminders, notes, important toggles |
| 07 | `bulk-actions` | Mark all complete, clear completed |
| 08 | `custom-lists` | Create and manage custom lists |
| 09 | `search-sort` | Search bar, sort menu |

#### Auth-dependent flows

Flows 03-09 require a logged-in user with a **verified email**. For local testing:
1. Create a test account via the app signup flow
2. Verify the email in Firebase Console → Authentication → Users
3. Update `TEST_EMAIL`/`TEST_PASSWORD` in `.maestro/config.yaml`

#### CI

E2E tests run in CI when a PR is labeled `e2e`. Requires:
- `EXPO_TOKEN` secret for EAS Build
- Firebase config secrets
- Maestro CLI installed on the runner

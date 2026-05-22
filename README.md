# TO-DO-app
React Native TODO app with Firebase - featuring task management, tab-based navigation with dedicated My Day, Lists, Planned, and Profile screens, drag-and-drop reorder, notifications, and Google OAuth.

## Features

- **Task Management** - Create, edit, delete, and toggle tasks with due dates, due times, reminders, repeat rules (daily/weekly/monthly/yearly), and notes
- **Tab Navigation** - Bottom tab bar with separate screens for My Day, Lists, Planned, and Profile (replaces sidebar layout)
- **Dynamic Lists** - Lists tab shows all lists overview; tapping opens a dynamic route for each list's tasks
- **Drag & Drop Reorder** - Long-press drag handle to reorder tasks; order persists to Firestore
- **Sorting** - Sort tasks by default order, name, due date, or importance via ListHeaderMenu
- **Bulk Actions** - Mark all pending tasks complete or delete all completed tasks at once
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
├── locales/               # Translation files (en.json, fr.json)
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/            # Auth screens (login, signup, forgotPassword, emailVerification)
│   ├── (protected)/       # Protected screens with bottom tab navigation
│   │   ├── myDay.tsx      # My Day task screen
│   │   ├── Planned.tsx    # Planned tasks grouped by date
│   │   ├── profile.tsx    # User profile and settings
│   │   ├── Lists/         # Lists overview + dynamic list detail
│   │   │   ├── index.tsx  # All lists overview
│   │   │   ├── [listId].tsx  # Individual list tasks (dynamic route)
│   │   │   └── _layout.tsx   # Lists stack layout
│   │   └── _layout.tsx    # Tab layout (My Day, Lists, Planned, Profile)
│   └── _layout.tsx       # Root layout with providers
├── assets/                # Images and icons
├── components/            # Reusable React components
│   ├── Index/             # Components for main index screen
│   ├── Modals/            # Modal components (calendar, reminder, repeat, note)
│   ├── (auth)/           # Auth-related components (buttons, GoogleIcon)
├── constants/            # App constants (list definitions)
├── context/               # React contexts (TasksContext, CustomListsContext, ThemeContext)
├── hooks/                 # React hooks (useThemeStyles)
├── src/                   # Firebase, auth, localization, and notification utilities
│   ├── auth/             # Google Sign-In helper
│   ├── firebase/         # Firestore CRUD operations
│   ├── context/          # AuthContext
│   ├── hooks/            # App hooks (useTaskNotifications)
│   ├── i18n/             # i18next initialization and configuration
│   └── notifications/    # Notification service and useNotifications hook
├── styles/               # Theme-aware style files using Theme type
│   ├── theme.ts         # Light/dark color palette definitions
│   ├── app/             # App-level styles
│   │   ├── (auth)/      # Auth screen styles (based on ThemeContext)
│   │   └── (protected)/ # Protected screen styles (based on ThemeContext)
│   └── components/      # Component styles
├── types/                # TypeScript type definitions
├── firestore.rules      # Firebase Security Rules
└── android/              # Native Android project
```

## Testing

Run lint and typecheck:
`npm run lint`
`npm run typecheck`

No unit/e2e tests currently configured.

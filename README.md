# TO-DO-app
React Native TODO app with Firebase - featuring task management, custom lists, drag-and-drop, and user profiles with profile photos.

## Features

- **Task Management** - Create, edit, delete, and toggle tasks with due dates, reminders, repeat rules, and notes
- **Custom Lists** - Create, edit, and delete custom task lists with custom icons
- **Drag & Drop** - Reorder tasks within lists via drag-and-drop
- **User Profiles** - Firebase Auth with email/password, profile photos via Firebase Storage
- **Smart Task Panel** - BottomPanel with calendar picker, reminder, repeat, and note modals
- **Search** - Filter tasks by keyword across all lists
- **Pull-to-Refresh** - Sync tasks from Firestore with pull gesture

## Getting Started

1. Install dependencies:
   `npm install`

2. Copy `.env.example` to `.env` and fill in Firebase config values

3. Run the app:
   `npm start`

## Environment

Firebase settings are read from `EXPO_PUBLIC_*` environment variables (see `.env.example`). These are exposed to the app at build time via Expo.

## Expo prebuild
"Check for app config fields that may not be synced in a non-CNG project."

This project keeps native folders (`android/` and/or `ios/`) and uses `app.json` config fields. To keep native projects synced with app config, run prebuild whenever config changes and in CI/build pipelines:

`npx expo prebuild`

## File Structure

```
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/            # Auth screens (login, signup, forgotPassword, etc.)
│   ├── (protected)/       # Protected screens (main, settings)
│   └── _layout.tsx       # Root layout
├── assets/                # Images and icons
├── components/            # Reusable React components
│   ├── Index/             # Components for main index screen
│   ├── Modals/            # Modal components (calendar, reminder, repeat, note)
│   ├── (auth)/           # Auth-related components (buttons, GoogleIcon)
├── constants/            # App constants (list definitions)
├── context/               # React contexts (TasksContext, CustomListsContext)
├── src/                   # Firebase and auth utilities
│   ├── firebase/         # Firestore CRUD operations
│   └── context/          # AuthContext
├── styles/               # Style files grouped by feature
│   ├── app/              # App-level styles
│   ├── auth/             # Auth styles
│   └── components/       # Component styles
├── types/                # TypeScript type definitions
└── android/              # Native Android project
```

## Testing

Run lint and typecheck:
`npm run lint`
`npm run typecheck`

No unit/e2e tests currently configured.

# TO-DO-app
React Native TODO app with Firebase

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
│   ├── (protected)/      # Protected screens (main, settings)
│   └── _layout.tsx       # Root layout
├── assets/                # Images and icons
├── components/            # Reusable React components
│   ├── Index/             # Components specific to index screen
│   ├── Modals/            # Modal components
│   ├── (auth)/           # Auth-related components
├── constants/            # App constants
├── context/               # React contexts (TasksContext, CustomListsContext)
├── styles/               # Style files grouped by feature
│   ├── app/              # App-level styles
│   ├── auth/             # Auth styles
│   └── components/       # Component styles
├── types/                # TypeScript types
└── android/              # Native Android project
```

## Testing

Run lint and typecheck:
`npm run lint`
`npm run typecheck`

No unit/e2e tests currently configured.

# Expo TypeScript Boilerplate (Single Root)

This repository is a reusable React Native boilerplate built with Expo.

## Stack

- Expo SDK 54
- React Native 0.81
- TypeScript (strict mode)
- React Navigation (native stack)
- Jest (`tests/unit`)
- Detox (`tests/e2e`)

## Structure

```text
src/
  app/
  config/
  features/
  navigation/
  theme/
  utils/
tests/
  unit/
  e2e/
```

## Commands

- `npm run start`: Start Expo dev server
- `npm run android`: Build and run Android app
- `npm run ios`: Build and run iOS app
- `npm run web`: Run web target
- `npm run lint`: Lint all files
- `npm run typecheck`: Type-check project
- `npm run test`: Run unit tests with coverage
- `npm run detox:build`: Build Detox Android binary
- `npm run detox:test`: Run Detox tests
- `npm run android:prebuild`: Regenerate Android native code from Expo config

## Environment

Runtime config is resolved in `src/config/appConfig.ts`.

Defaults:

- `environment`: `development`
- `apiBaseUrl`: `https://api.example.com`

Optional variables:

- `EXPO_PUBLIC_APP_ENV`
- `EXPO_PUBLIC_API_BASE_URL`

## CI

The project keeps a workflow caller at `.github/workflows/mobile-pipeline-caller.yml` that delegates to the central orchestrator.

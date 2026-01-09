# The Shopping List - Copilot Instructions

## Project Overview

This is an **Expo + React Native** app using **Expo Router (v6)** for file-based navigation with TypeScript. The app uses the **new React Native architecture** (`newArchEnabled: true`) and **React Compiler** (`reactCompiler: true`).

## Architecture & Routing

### File-Based Routing with Expo Router
- Routes are defined by file structure in `app/` directory
- `app/_layout.tsx`: Root layout with Stack navigator and theme provider
- `app/(tabs)/_layout.tsx`: Tab navigation layout (groups routes under tabs)
- Group folders with parentheses `(tabs)` are layout routes that don't appear in URL
- `unstable_settings.anchor` in root layout anchors to `(tabs)` group

### Navigation Structure
```
Stack (root)
├── (tabs) - Tab Navigator
│   ├── index (Home)
│   └── explore
└── modal - Presented as modal
```

## Theme System

### Centralized Theme Management
All theme values are in `constants/theme.ts`:
- `Colors` object with `light` and `dark` variants
- `Fonts` object with platform-specific font families (iOS, web, default)
- Theme colors: `text`, `background`, `tint`, `icon`, `tabIconDefault`, `tabIconSelected`

### Theming Pattern
Components use custom `Themed*` wrappers that adapt to system color scheme:
- `ThemedText`: Text component with `type` prop (`default`, `title`, `subtitle`, `defaultSemiBold`, `link`)
- `ThemedView`: View component with automatic background color
- Both accept `lightColor` and `darkColor` props to override defaults
- Use `useThemeColor()` hook to get theme-aware colors from `constants/theme.ts`
- Color scheme detection via `useColorScheme()` from `hooks/use-color-scheme.ts`

**Example:**
```tsx
<ThemedText type="title" lightColor="#000" darkColor="#fff">
  Welcome!
</ThemedText>
```

## Component Conventions

### Icon System
- **iOS**: Uses SF Symbols via `expo-symbols` (`icon-symbol.ios.tsx`)
- **Android/Web**: Uses Material Icons via `@expo/vector-icons` (`icon-symbol.tsx`)
- Icons must be manually mapped in `MAPPING` object in `icon-symbol.tsx`
- Always use `IconSymbol` component for cross-platform icon consistency

### UI Components Location
- Basic components: `components/`
- Platform-specific or foundational UI: `components/ui/`
- Platform-specific files use extensions: `.ios.tsx`, `.web.ts`

### Import Aliases
Use `@/` prefix for absolute imports:
```tsx
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
```

## Key Dependencies

- **expo-router**: File-based routing (v6 with typed routes)
- **react-native-reanimated**: Animations (v4, with worklets)
- **expo-haptics**: Haptic feedback (see `HapticTab` component)
- **@react-navigation/bottom-tabs**: Tab navigation
- **expo-image**: Optimized image component

## Development Workflow

### Commands
- `npm start`: Start Expo development server
- `npm run android`: Launch Android emulator
- `npm run ios`: Launch iOS simulator  
- `npm run web`: Launch web browser
- `npm run lint`: Run ESLint
- `npm run reset-project`: Move starter code to `app-example/`, create blank `app/`

### Dev Tools Access
- **iOS**: `cmd + d`
- **Android**: `cmd + m`
- **Web**: `F12`

### Platform Detection
Use `process.env.EXPO_OS` for platform checks:
```tsx
if (process.env.EXPO_OS === 'ios') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
```

## Project-Specific Patterns

### Haptic Feedback on Tabs
Tabs use custom `HapticTab` button component that triggers light haptic feedback on iOS when pressed (see `components/haptic-tab.tsx`)

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` maps to project root
- Typed routes enabled via Expo experiments

### ESLint Setup
Uses Expo's flat config format with `eslint-config-expo/flat`

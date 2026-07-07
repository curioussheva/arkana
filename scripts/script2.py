project_root = "/data/data/com.termux/files/home/arkana/numerology-engine"

# Create package.json with pnpm configuration
package_json = """{
  "name": "numerology-engine",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:push": "drizzle-kit push",
    "clean": "rm -rf node_modules .expo dist"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-sqlite": "~14.0.0",
    "expo-file-system": "~17.0.0",
    "expo-sharing": "~12.0.0",
    "expo-print": "~14.0.0",
    "expo-constants": "~17.0.0",
    "expo-font": "~13.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-updates": "~0.26.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "drizzle-orm": "^0.36.0",
    "@shopify/react-native-skia": "^1.5.0",
    "victory-native": "^41.0.0",
    "onnxruntime-react-native": "^1.20.0",
    "zustand": "^5.0.0",
    "date-fns": "^4.0.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~18.3.0",
    "@types/react-native": "~0.72.0",
    "typescript": "^5.6.0",
    "drizzle-kit": "^0.28.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.8.0",
    "@testing-library/jest-native": "^5.4.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-native": "^4.1.0",
    "prettier": "^3.3.0",
    "@react-native-community/eslint-config": "^3.2.0"
  },
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
"""

with open(f"{project_root}/package.json", "w") as f:
    f.write(package_json)
 
print("✅ package.json created")
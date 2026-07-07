project_root = "/data/data/com.termux/files/home/arkana/numerology-engine"
# Create TypeScript configuration
tsconfig_json = """{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@core/*": ["src/core/*"],
      "@db/*": ["src/db/*"],
      "@ai/*": ["src/ai/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@hooks/*": ["src/hooks/*"],
      "@store/*": ["src/store/*"],
      "@types/*": ["src/types/*"],
      "@constants/*": ["src/constants/*"],
      "@assets/*": ["assets/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "react-native",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "types": ["jest", "@testing-library/jest-native"]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "__tests__"
  ]
}
"""

with open(f"{project_root}/tsconfig.json", "w") as f:
    f.write(tsconfig_json)

# Create Expo app.json
app_json = """{
  "expo": {
    "name": "Numerology Engine",
    "slug": "numerology-engine",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0F172A"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.numerology.engine",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#0F172A"
      },
      "package": "com.numerology.engine",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-sqlite",
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/Inter-Regular.ttf",
            "./assets/fonts/Inter-Medium.ttf",
            "./assets/fonts/Inter-SemiBold.ttf",
            "./assets/fonts/Inter-Bold.ttf"
          ]
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "tsconfigPaths": true
    },
    "newArchEnabled": true,
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
"""

with open(f"{project_root}/app.json", "w") as f:
    f.write(app_json)

# Create babel.config.js
babel_config = """module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@core': './src/core',
            '@db': './src/db',
            '@ai': './src/ai',
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@store': './src/store',
            '@types': './src/types',
            '@constants': './src/constants',
            '@assets': './assets',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
"""

with open(f"{project_root}/babel.config.js", "w") as f:
    f.write(babel_config)

# Create metro.config.js
metro_config = """const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for .onnx and .tflite model files
config.resolver.assetExts.push('onnx', 'tflite', 'pte', 'bin');

// Optimize bundle size
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
  output: {
    ascii_only: true,
    quote_keys: true,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  compress: {
    reduce_funcs: false,
  },
};

module.exports = config;
"""

with open(f"{project_root}/metro.config.js", "w") as f:
    f.write(metro_config)

# Create jest.config.js
jest_config = """module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|victory-native|@shopify/react-native-skia|drizzle-orm)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@ai/(.*)$': '<rootDir>/src/ai/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
"""

with open(f"{project_root}/jest.config.js", "w") as f:
    f.write(jest_config)

# Create .eslintrc.js
eslint_config = """module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  rules: {
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['error', 'warn'] }],
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
"""

with open(f"{project_root}/.eslintrc.js", "w") as f:
    f.write(eslint_config)

# Create .prettierrc
prettier_config = """{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
"""

with open(f"{project_root}/.prettierrc", "w") as f:
    f.write(prettier_config)

# Create .gitignore
gitignore = """# Dependencies
node_modules/
.pnpm-store/

# Expo
.expo/
.expo-shared/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# Local env files
.env*.local
.env

# TypeScript
*.tsbuildinfo

# Testing
coverage/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
Thumbs.db
"""

with open(f"{project_root}/.gitignore", "w") as f:
    f.write(gitignore)

print("✅ All config files created:")
print("   - tsconfig.json")
print("   - app.json")
print("   - babel.config.js")
print("   - metro.config.js")
print("   - jest.config.js")
print("   - .eslintrc.js")
print("   - .prettierrc")
print("   - .gitignore") 
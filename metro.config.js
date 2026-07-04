const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// pnpm uses symlinks into its content-addressable store, which breaks
// Metro's default relative-path resolution (e.g. expo/AppEntry.js's
// `import App from '../../App'`). This tells Metro to follow symlinks
// and resolve based on the real project structure.
//config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// Support for .onnx, .tflite, and other model files (safely appended)
config.resolver.assetExts.push('onnx', 'tflite', 'pte', 'bin');

// Fix ESM/CJS interop issues by SAFELY appending new extensions
// This preserves .native.ts, .mjs, etc.
config.resolver.sourceExts.push('wasm', 'svg');

// Removed config.resolver.blockList = null; to prevent Metro crawl/crash issues

module.exports = config;
 
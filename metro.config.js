const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Support for .onnx, .tflite, and other model files (safely appended)
config.resolver.assetExts.push('onnx', 'tflite', 'pte', 'bin');

// Fix ESM/CJS interop issues by SAFELY appending new extensions
// This preserves .native.ts, .mjs, etc.
config.resolver.sourceExts.push('wasm', 'svg');

// Removed config.resolver.blockList = null; to prevent Metro crawl/crash issues

module.exports = config;

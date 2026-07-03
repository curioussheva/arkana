module.exports = function(api) {
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
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.cjs'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};

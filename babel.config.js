module.exports = {
  presets: ['babel-preset-expo'], // This is the correct preset for Expo projects
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',      // The module you'll import from (e.g., import { VAR } from '@env')
        path: '.env',            // Path to your .env file relative to project root
        blacklist: null,
        whitelist: null,
        safe: false,             // Set to true if you want to ensure all keys are present
        allowUndefined: true,    // Allow variables to be undefined if not in .env
      },
    ],
  ],
};
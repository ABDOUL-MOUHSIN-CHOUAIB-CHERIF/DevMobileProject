import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.etracker',
  appName: 'EXPENSE_TRACKER',
  webDir: 'www',
  server: {
    androidScheme: 'https'   // ✅ Required for jeep-sqlite to work on Android
  }
};

export default config;
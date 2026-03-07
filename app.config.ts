import type { ExpoConfig } from 'expo/config';

const staticConfig = require('./app.json').expo as ExpoConfig;

const projectId = process.env.EXPO_PROJECT_ID ?? process.env.EAS_PROJECT_ID;
const owner = process.env.EXPO_OWNER;
const staticExtra = staticConfig.extra as Record<string, unknown> | undefined;
const staticEas = staticExtra?.eas as Record<string, unknown> | undefined;
const easConfig = {
  ...staticEas,
  ...(projectId ? { projectId } : {}),
};

export default function getExpoConfig(): ExpoConfig {
  return {
    ...staticConfig,
    ...(owner ? { owner } : {}),
    extra: {
      ...staticExtra,
      ...(Object.keys(easConfig).length > 0 ? { eas: easConfig } : {}),
    },
  };
}
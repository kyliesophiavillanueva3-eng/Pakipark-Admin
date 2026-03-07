import type { ExpoConfig } from 'expo/config';

const projectId = process.env.EXPO_PROJECT_ID ?? process.env.EAS_PROJECT_ID;
const owner = process.env.EXPO_OWNER;
const staticExtra: Record<string, unknown> = {};
const staticEas = staticExtra.eas as Record<string, unknown> | undefined;
const easConfig = {
  ...staticEas,
  ...(projectId ? { projectId } : {}),
};

export default function getExpoConfig(): ExpoConfig {
  return {
    name: 'Template Repo Mobile Single',
    slug: 'template-repo-mobile-single',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'templatemobilesingle',
    userInterfaceStyle: 'automatic',
    jsEngine: 'hermes',
    android: {
      package: 'com.anonymous.templaterepombsingle',
    },
    ios: {
      bundleIdentifier: 'com.anonymous.templaterepombsingle',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            kotlinVersion: '2.0.21',
          },
        },
      ],
    ],
    ...(owner ? { owner } : {}),
    extra: {
      ...staticExtra,
      ...(Object.keys(easConfig).length > 0 ? { eas: easConfig } : {}),
    },
  };
}
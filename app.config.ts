import type { ExpoConfig } from 'expo/config';

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
  };
}
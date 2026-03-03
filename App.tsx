import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { buildDefaultDummySystem } from './src/system/dummySystem';

const dummySystem = buildDefaultDummySystem();
const records = dummySystem.list();

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dummy System</Text>
        <Text style={styles.subtitle}>Generated scaffold for your current files</Text>

        {records.map((record) => (
          <View key={record.id} style={styles.card}>
            <Text style={styles.cardTitle}>{record.title}</Text>
            <Text style={styles.cardMeta}>
              ID: {record.id} | STATUS: {record.status}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#666666',
  },
});

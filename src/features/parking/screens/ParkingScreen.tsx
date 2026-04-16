import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export function ParkingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="parking" size={40} color={colors.orange} />
        </View>
        <Text style={styles.title}>Parking{'\n'}Customization</Text>
        <Text style={styles.subtitle}>
          To manage your parking layout, slots, and availability, please open the full website editor.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          accessibilityLabel="Open Website to Customize Parking"
          onPress={() => Linking.openURL('https://pakipark.com')}
        >
          <Text style={styles.btnText}>Open Website to Customize Parking</Text>
          <Ionicons name="open-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.hint}>Opens in a new tab</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20, padding: spacing.xl,
    alignItems: 'center', gap: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: '#FFF0E6',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.navy, textAlign: 'center', lineHeight: 32 },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.orange, borderRadius: 20,
    paddingVertical: spacing.xl, paddingHorizontal: spacing.lg,
    width: '100%', justifyContent: 'center',
    minHeight: 90,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 17, textAlign: 'center', flex: 1, lineHeight: 24 },
  hint: { fontSize: 12, color: colors.muted },
});

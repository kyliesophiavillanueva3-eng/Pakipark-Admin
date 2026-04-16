import { Ionicons } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

export function ParkingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>

        {/* Parking "P" sign icon — matches prototype */}
        <View style={styles.iconWrap}>
          <View style={styles.pSign}>
            <Text style={styles.pLetter}>P</Text>
          </View>
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
          <Text style={styles.btnText}>Open Website to{'\n'}Customize Parking</Text>
          <Ionicons name="open-outline" size={16} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.hint}>Opens in a new tab</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Peach rounded-square background
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#FDEBD0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  // Outlined "P" parking sign inside
  pSign: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pLetter: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.orange,
    lineHeight: 36,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.navy,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: spacing.sm,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.orange,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: spacing.xl,
    width: '100%',
    marginTop: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
  },
});

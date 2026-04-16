import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BookingDetail {
  id: string;
  reference: string;
  name: string;
  location: string;
  address: string;
  spot: string;
  date: string;
  time: string;
  vehicle: string;
  phone: string;
  status: 'active' | 'completed' | 'cancelled';
  type: string;
  amount: number;
  payment?: string;
}

interface BookingDetailsProps {
  booking: BookingDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (id: string) => void;
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CFG = {
  active:    { label: 'Active',    dot: '#10B981', text: '#065F46', bg: '#D1FAE5' },
  completed: { label: 'Completed', dot: '#3B82F6', text: '#1E40AF', bg: '#DBEAFE' },
  cancelled: { label: 'Cancelled', dot: '#EF4444', text: '#991B1B', bg: '#FEE2E2' },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function BookingDetails({ booking, isOpen, onClose, onCancel }: BookingDetailsProps) {
  const [exporting, setExporting] = useState<'idle' | 'loading' | 'done'>('idle');
  const spinAnim = useRef(new Animated.Value(0)).current;

  if (!booking) return null;
  const st = STATUS_CFG[booking.status];

  useEffect(() => {
    if (!isOpen) setExporting('idle');
  }, [isOpen]);

  useEffect(() => {
    if (exporting === 'loading') {
      Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [exporting]);

  const handleExport = () => {
    if (exporting !== 'idle') return;
    setExporting('loading');
    setTimeout(() => setExporting('done'), 2200);
  };

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />

        <View style={s.sheet}>
          {/* ── Navy header ── */}
          <View style={s.header}>
            {/* Receipt icon + ref */}
            <View style={s.headerTop}>
              <View style={s.receiptIconWrap}>
                <Ionicons name="receipt-outline" size={20} color="#fff" />
              </View>
              <View>
                <Text style={s.receiptLabel}>PAKIPARK RECEIPT</Text>
                <Text style={s.receiptRef}>{booking.reference}</Text>
              </View>
              <TouchableOpacity style={s.closeBtn} onPress={onClose} accessibilityLabel="Close">
                <Ionicons name="close" size={18} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>

            {/* Name + phone */}
            <Text style={s.name}>{booking.name}</Text>
            <Text style={s.phone}>{booking.phone}</Text>

            {/* Status pill */}
            <View style={[s.statusPill, { backgroundColor: st.bg }]}>
              <View style={[s.statusDot, { backgroundColor: st.dot }]} />
              <Text style={[s.statusText, { color: st.text }]}>{st.label}</Text>
            </View>
          </View>

          {/* ── Ticket tear edge ── */}
          <View style={s.tearRow}>
            {Array.from({ length: 16 }).map((_, i) => (
              <View key={i} style={s.tearCircle} />
            ))}
          </View>

          {/* ── White body ── */}
          <View style={s.body}>
            {[
              { icon: 'location-outline',  label: 'LOCATION',  value: booking.location  },
              { icon: 'calendar-outline',  label: 'DATE',      value: booking.date      },
              { icon: 'time-outline',      label: 'TIME SLOT', value: booking.time      },
              { icon: 'car-outline',       label: 'VEHICLE',   value: booking.vehicle   },
              { icon: 'card-outline',      label: 'PAYMENT',   value: booking.payment ?? 'GCash' },
            ].map((row) => (
              <View key={row.label} style={s.infoRow}>
                <View style={s.infoLeft}>
                  <Ionicons name={row.icon as any} size={15} color={colors.orange} />
                  <Text style={s.infoLabel}>{row.label}</Text>
                </View>
                <Text style={s.infoValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          {/* ── Total + actions ── */}
          <View style={s.footer}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>TOTAL AMOUNT</Text>
              <Text style={s.totalValue}>₱{booking.amount}</Text>
            </View>

            {/* Generating banner */}
            {exporting === 'loading' && (
              <View style={s.generatingBanner}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Ionicons name="reload-outline" size={16} color="#fff" />
                </Animated.View>
                <Text style={s.generatingText}>Generating receipt PDF...</Text>
              </View>
            )}

            {/* Success banner */}
            {exporting === 'done' && (
              <View style={s.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={s.successText}>Receipt downloaded successfully!</Text>
              </View>
            )}

            <View style={s.footerBtns}>
              <TouchableOpacity style={s.closeFooterBtn} onPress={onClose} accessibilityLabel="Close">
                <Text style={s.closeFooterText}>CLOSE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.exportBtn, exporting === 'loading' && s.exportBtnLoading]}
                onPress={handleExport}
                accessibilityLabel="Export Receipt"
              >
                {exporting === 'loading' ? (
                  <>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                      <Ionicons name="reload-outline" size={16} color="rgba(255,255,255,0.8)" />
                    </Animated.View>
                    <Text style={s.exportText}>EXPORTING...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="download-outline" size={16} color="#fff" />
                    <Text style={s.exportText}>EXPORT RECEIPT</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },

  // Navy header
  header: {
    backgroundColor: '#1E3D5A',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl + 4,
    gap: spacing.sm,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  receiptIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: colors.orange,
    alignItems: 'center', justifyContent: 'center',
  },
  receiptLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  receiptRef: { fontSize: 13, fontWeight: '800', color: '#fff' },
  closeBtn: {
    marginLeft: 'auto' as any,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: spacing.xs },
  phone: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6,
    marginTop: spacing.xs,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700' },

  // Tear edge — circles sit on the boundary between navy and white
  tearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: -10,
    marginTop: -14,
    zIndex: 10,
    overflow: 'visible',
  },
  tearCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#F3F4F6',
  },

  // White body
  body: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginTop: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: '700', color: colors.navy, textAlign: 'right', flex: 1, marginLeft: spacing.md },

  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  totalRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 15, fontWeight: '800', color: colors.navy },
  totalValue: { fontSize: 32, fontWeight: '900', color: colors.orange },
  footerBtns: { flexDirection: 'row', gap: spacing.md },
  closeFooterBtn: {
    flex: 1, height: 50, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff',
  },
  closeFooterText: { fontSize: 13, fontWeight: '800', color: colors.navy, letterSpacing: 0.5 },
  exportBtn: {
    flex: 2, height: 50, borderRadius: 14,
    backgroundColor: colors.orange,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  exportBtnLoading: { backgroundColor: '#F9A96A' },
  exportText: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  // Export state banners
  generatingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.navy,
    borderRadius: 14, paddingHorizontal: spacing.lg, paddingVertical: 14,
  },
  generatingText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 14, paddingHorizontal: spacing.lg, paddingVertical: 14,
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  successText: { fontSize: 14, fontWeight: '700', color: '#065F46' },
});

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'parking-rates' | 'payment-methods' | 'security';

interface ParkingRate { id: number; vehicleType: string; hourlyRate: number; dailyRate: number }
interface PaymentMethod { id: number; name: string; enabled: boolean; processingFee: string }

// ── Data ──────────────────────────────────────────────────────────────────────

const INIT_RATES: ParkingRate[] = [
  { id: 1, vehicleType: 'Sedan',      hourlyRate: 50, dailyRate: 300 },
  { id: 2, vehicleType: 'SUV',        hourlyRate: 75, dailyRate: 450 },
  { id: 3, vehicleType: 'Motorcycle', hourlyRate: 30, dailyRate: 180 },
];

const INIT_METHODS: PaymentMethod[] = [
  { id: 1, name: 'Cash on Site',      enabled: true, processingFee: 'None' },
  { id: 2, name: 'GCash',             enabled: true, processingFee: '2%'   },
  { id: 3, name: 'PayMaya',           enabled: true, processingFee: '2.5%' },
  { id: 4, name: 'Credit/Debit Card', enabled: true, processingFee: '3%'   },
];

const TABS: { id: Tab; label: string }[] = [
  { id: 'parking-rates',   label: 'Parking Rates'   },
  { id: 'payment-methods', label: 'Payment Methods' },
  { id: 'security',        label: 'Security'        },
];

// ── Toast ─────────────────────────────────────────────────────────────────────

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (text: string) => { setMsg(text); setTimeout(() => setMsg(null), 2500); };
  return { msg, show };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function SettingsScreen() {
  const [tab, setTab] = useState<Tab>('parking-rates');
  const { msg, show } = useToast();

  // Parking rates state
  const [rates, setRates] = useState<ParkingRate[]>(INIT_RATES);
  const [gateModal, setGateModal] = useState(false);
  const [rateModal, setRateModal] = useState(false);
  const [editingRate, setEditingRate] = useState<ParkingRate | null>(null);
  const [rateForm, setRateForm] = useState({ vehicleType: '', hourlyRate: '', dailyRate: '' });

  // Payment methods state
  const [methods, setMethods] = useState<PaymentMethod[]>(INIT_METHODS);

  // Security state
  const [security, setSecurity] = useState({
    twoFactorAuth: false, sessionTimeout: 30, passwordExpiry: 90, loginAttempts: 5,
  });

  const openRateGate = (rate?: ParkingRate) => {
    setEditingRate(rate ?? null);
    setRateForm(rate
      ? { vehicleType: rate.vehicleType, hourlyRate: String(rate.hourlyRate), dailyRate: String(rate.dailyRate) }
      : { vehicleType: '', hourlyRate: '', dailyRate: '' });
    setGateModal(true);
  };

  const proceedToForm = () => { setGateModal(false); setRateModal(true); };

  const saveRate = () => {
    const r = { vehicleType: rateForm.vehicleType, hourlyRate: Number(rateForm.hourlyRate), dailyRate: Number(rateForm.dailyRate) };
    if (!r.vehicleType || !r.hourlyRate || !r.dailyRate) { show('Fill in all fields'); return; }
    if (editingRate) setRates(rates.map((x) => x.id === editingRate.id ? { ...x, ...r } : x));
    else setRates([...rates, { ...r, id: Date.now() }]);
    show(editingRate ? '✓ Rate updated!' : '✓ Rate added!');
    setRateModal(false);
  };

  return (
    <View style={s.root}>
      {/* Toast */}
      {msg && (
        <View style={s.toast}>
          <Text style={s.toastText}>{msg}</Text>
        </View>
      )}

      {/* Sub-header */}
      <View style={s.subHeader}>
        <View style={s.backCircle}>
          <Ionicons name="chevron-back" size={18} color={colors.navy} />
        </View>
        <View>
          <Text style={s.subHeaderTitle}>System Settings</Text>
          <Text style={s.subHeaderSub}>Configure global platform parameters</Text>
        </View>
      </View>

      {/* 3-tab bar */}
      <View style={s.tabBar}>
        {TABS.map((tb) => (
          <TouchableOpacity
            key={tb.id}
            style={[s.tabBtn, tab === tb.id && s.tabBtnActive]}
            onPress={() => setTab(tb.id)}
            accessibilityLabel={tb.label}
          >
            <Text style={[s.tabBtnText, tab === tb.id && s.tabBtnTextActive]}>{tb.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Parking Rates ── */}
        {tab === 'parking-rates' && (
          <View style={s.card}>
            <View style={s.cardHeaderRow}>
              <View>
                <Text style={s.cardTitle}>Parking Rates</Text>
                <Text style={s.cardSubtitle}>Manage pricing and vehicle rules</Text>
              </View>
              <TouchableOpacity style={s.addBtn} onPress={() => openRateGate()} accessibilityLabel="Add Rate">
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={s.addBtnText}>Add Rate</Text>
              </TouchableOpacity>
            </View>

            {rates.map((rate) => (
              <View key={rate.id} style={s.rateItem}>
                <View style={s.rateTop}>
                  <View style={s.rateIconBg}>
                    <Ionicons name="car-outline" size={22} color="#fff" />
                  </View>
                  <View>
                    <Text style={s.rateName}>{rate.vehicleType}</Text>
                    <View style={s.ratePriceRow}>
                      <Text style={s.rateHourly}>₱{rate.hourlyRate}/hr</Text>
                      <Text style={s.rateDot}> · </Text>
                      <Text style={s.rateDaily}>₱{rate.dailyRate}/day</Text>
                    </View>
                  </View>
                </View>
                <View style={s.rateBtns}>
                  <TouchableOpacity style={s.editBtn} onPress={() => openRateGate(rate)} accessibilityLabel="Edit">
                    <Ionicons name="create-outline" size={14} color={colors.navy} />
                    <Text style={s.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.deleteBtn}
                    onPress={() => { setRates(rates.filter((r) => r.id !== rate.id)); show('✓ Rate deleted.'); }}
                    accessibilityLabel="Delete"
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <Text style={s.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Payment Methods ── */}
        {tab === 'payment-methods' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Payment Methods</Text>
            <Text style={s.cardSubtitle}>Enable or disable accepted payment gateways</Text>

            {[...methods].sort((a, b) => a.name === 'Cash on Site' ? -1 : b.name === 'Cash on Site' ? 1 : 0).map((m) => {
              const isCash = m.name === 'Cash on Site';
              return (
                <View key={m.id} style={s.methodRow}>
                  <View style={[s.methodIcon, { backgroundColor: m.enabled ? colors.navy : '#9CA3AF' }]}>
                    <Ionicons name={isCash ? 'cash-outline' : 'card-outline'} size={18} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={s.methodName} numberOfLines={1}>{m.name}</Text>
                      {isCash && (
                        <View style={s.defaultBadge}>
                          <Text style={s.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.methodFee}>Processing Fee: {m.processingFee}</Text>
                  </View>
                  {isCash
                    ? <Text style={s.alwaysOn}>ALWAYS ON</Text>
                    : <Switch
                        value={m.enabled}
                        onValueChange={() => setMethods(methods.map((x) => x.id === m.id ? { ...x, enabled: !x.enabled } : x))}
                        trackColor={{ false: '#D1D5DB', true: colors.orange }}
                        thumbColor="#fff"
                      />
                  }
                </View>
              );
            })}
          </View>
        )}

        {/* ── Security ── */}
        {tab === 'security' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Security Policies</Text>
            <Text style={s.cardSubtitle}>Manage access controls and session timeouts</Text>

            {/* Two-Factor Auth */}
            <View style={s.secRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.secTitle}>Two-Factor Authentication</Text>
                <Text style={s.secSub}>Require 2FA for all admin logins</Text>
              </View>
              <Switch
                value={security.twoFactorAuth}
                onValueChange={(v) => setSecurity({ ...security, twoFactorAuth: v })}
                trackColor={{ false: '#D1D5DB', true: colors.orange }}
                thumbColor="#fff"
              />
            </View>

            {/* Session Timeout */}
            <View style={s.secRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.secTitle}>Session Timeout</Text>
                <Text style={s.secSub}>Auto-logout after inactivity</Text>
              </View>
              <View style={s.numRow}>
                <TextInput
                  style={s.numInput}
                  keyboardType="numeric"
                  value={String(security.sessionTimeout)}
                  onChangeText={(v) => setSecurity({ ...security, sessionTimeout: Number(v) })}
                />
                <Text style={s.numUnit}>min</Text>
              </View>
            </View>

            {/* Password Expiry */}
            <View style={s.secRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.secTitle}>Password Expiry</Text>
                <Text style={s.secSub}>Force reset after N days</Text>
              </View>
              <View style={s.numRow}>
                <TextInput
                  style={s.numInput}
                  keyboardType="numeric"
                  value={String(security.passwordExpiry)}
                  onChangeText={(v) => setSecurity({ ...security, passwordExpiry: Number(v) })}
                />
                <Text style={s.numUnit}>days</Text>
              </View>
            </View>

            {/* Max Login Attempts */}
            <View style={[s.secRow, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={s.secTitle}>Max Login Attempts</Text>
                <Text style={s.secSub}>Lockout account after N failures</Text>
              </View>
              <View style={s.numRow}>
                <TextInput
                  style={s.numInput}
                  keyboardType="numeric"
                  value={String(security.loginAttempts)}
                  onChangeText={(v) => setSecurity({ ...security, loginAttempts: Number(v) })}
                />
                <Text style={s.numUnit}>tries</Text>
              </View>
            </View>

            {/* Save button */}
            <TouchableOpacity style={s.saveBtn} onPress={() => show('✓ Security settings saved!')} accessibilityLabel="Save Security Settings">
              <Ionicons name="save-outline" size={16} color="#fff" />
              <Text style={s.saveBtnText}>Save Security Settings</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Advanced Options Gate Modal */}
      <Modal visible={gateModal} transparent animationType="fade" onRequestClose={() => setGateModal(false)}>
        <View style={s.gateOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setGateModal(false)} activeOpacity={1} />
          <View style={s.gateCard}>
            {/* Header */}
            <View style={s.gateHeader}>
              <TouchableOpacity style={s.gateCloseBtn} onPress={() => setGateModal(false)}>
                <Ionicons name="close" size={16} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
              <View style={s.gateIconWrap}>
                <Ionicons name="options-outline" size={32} color="#fff" />
              </View>
              <Text style={s.gateTitle}>Advanced Options</Text>
              <Text style={s.gateSub}>{editingRate ? `Editing: ${editingRate.vehicleType}` : 'Add a new parking rate'}</Text>
            </View>
            {/* Body */}
            <View style={s.gateBody}>
              <View style={s.gateWarning}>
                <Ionicons name="warning-outline" size={16} color="#F59E0B" />
                <Text style={s.gateWarningText}>Changes to parking rates will immediately affect all future bookings. Please review carefully before saving.</Text>
              </View>
              <View style={s.gateBtns}>
                <TouchableOpacity style={s.gateCancelBtn} onPress={() => setGateModal(false)}>
                  <Text style={s.gateCancelText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.gateProceedBtn} onPress={proceedToForm}>
                  <Text style={s.gateProceedText}>PROCEED</Text>
                  <Ionicons name="chevron-forward" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rate Form Modal */}
      <Modal visible={rateModal} transparent animationType="slide" onRequestClose={() => setRateModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setRateModal(false)} activeOpacity={1} />
            <View style={s.modalSheet}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>{editingRate ? 'Edit Rate' : 'Add New Rate'}</Text>
                <TouchableOpacity onPress={() => setRateModal(false)} accessibilityLabel="Close">
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={s.modalBody}>
                <Text style={s.modalLabel}>VEHICLE TYPE</Text>
                <TextInput style={s.modalInput} placeholder="e.g. Sedan, SUV, Motorcycle" value={rateForm.vehicleType} onChangeText={(v) => setRateForm({ ...rateForm, vehicleType: v })} placeholderTextColor={colors.muted} />
                <View style={{ flexDirection: 'row', gap: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.modalLabel}>HOURLY (₱)</Text>
                    <TextInput style={s.modalInput} keyboardType="numeric" placeholder="50" value={rateForm.hourlyRate} onChangeText={(v) => setRateForm({ ...rateForm, hourlyRate: v })} placeholderTextColor={colors.muted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.modalLabel}>DAILY (₱)</Text>
                    <TextInput style={s.modalInput} keyboardType="numeric" placeholder="300" value={rateForm.dailyRate} onChangeText={(v) => setRateForm({ ...rateForm, dailyRate: v })} placeholderTextColor={colors.muted} />
                  </View>
                </View>
              </View>
              <View style={s.modalFooter}>
                <TouchableOpacity style={s.modalCancelBtn} onPress={() => setRateModal(false)}>
                  <Text style={s.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.modalSaveBtn} onPress={saveRate}>
                  <Ionicons name="save-outline" size={14} color="#fff" />
                  <Text style={s.modalSaveText}>{editingRate ? 'Update Rate' : 'Save Rate'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F6' },

  toast: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 999, backgroundColor: '#10B981', paddingVertical: 12, alignItems: 'center' },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Sub-header
  subHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  subHeaderTitle: { fontSize: 16, fontWeight: '800', color: colors.navy },
  subHeaderSub: { fontSize: 12, color: colors.muted, marginTop: 1 },

  // Tab bar — 3 tabs in a row, fits full width
  tabBar: { flexDirection: 'row', backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  tabBtnActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  tabBtnText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  tabBtnTextActive: { color: '#fff', fontWeight: '700' },

  scroll: { padding: spacing.lg, paddingBottom: 32 },

  // Card
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, gap: spacing.md, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.navy },
  cardSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },

  // Add Rate button
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.orange, borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Rate items
  rateItem: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: spacing.md, gap: spacing.sm },
  rateTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rateIconBg: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  rateName: { fontSize: 16, fontWeight: '700', color: colors.navy },
  ratePriceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  rateHourly: { fontSize: 13, fontWeight: '700', color: colors.orange },
  rateDot: { fontSize: 13, color: colors.muted },
  rateDaily: { fontSize: 13, fontWeight: '600', color: colors.muted },
  rateBtns: { flexDirection: 'row', gap: spacing.sm },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingVertical: 10 },
  editBtnText: { fontSize: 13, fontWeight: '700', color: colors.navy },
  deleteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1.5, borderColor: '#FECACA', borderRadius: 10, paddingVertical: 10 },
  deleteBtnText: { fontSize: 13, fontWeight: '700', color: '#EF4444' },

  // Payment methods
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  methodIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  methodName: { fontSize: 14, fontWeight: '700', color: colors.navy },
  methodFee: { fontSize: 12, color: colors.muted, marginTop: 2 },
  defaultBadge: { backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  defaultBadgeText: { fontSize: 10, fontWeight: '700', color: '#065F46' },
  alwaysOn: { fontSize: 10, fontWeight: '800', color: colors.muted, letterSpacing: 0.5 },

  // Security rows
  secRow: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  secTitle: { fontSize: 14, fontWeight: '700', color: colors.navy },
  secSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  numRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  numInput: { width: 64, height: 40, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, textAlign: 'center', fontSize: 14, fontWeight: '700', color: colors.navy, backgroundColor: '#F8FAFC' },
  numUnit: { fontSize: 12, color: colors.muted, width: 30 },

  // Save button
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.orange, borderRadius: 14, paddingVertical: spacing.md, marginTop: spacing.sm },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Gate modal
  gateOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  gateCard: { width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: 24, overflow: 'hidden' },
  gateHeader: { backgroundColor: '#1E3D5A', paddingTop: spacing.xl, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg, alignItems: 'center', gap: spacing.sm },
  gateCloseBtn: { position: 'absolute', top: spacing.md, right: spacing.md, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  gateIconWrap: { width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  gateTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  gateSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  gateBody: { padding: spacing.lg, gap: spacing.lg },
  gateWarning: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 14, padding: spacing.md },
  gateWarningText: { flex: 1, fontSize: 13, color: '#92400E', fontWeight: '500', lineHeight: 19 },
  gateBtns: { flexDirection: 'row', gap: spacing.md },
  gateCancelBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  gateCancelText: { fontSize: 13, fontWeight: '800', color: colors.muted, letterSpacing: 0.5 },
  gateProceedBtn: { flex: 2, height: 48, borderRadius: 14, backgroundColor: colors.orange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  gateProceedText: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  modalBody: { padding: spacing.lg, gap: spacing.sm },
  modalLabel: { fontSize: 10, fontWeight: '800', color: colors.muted, letterSpacing: 1, marginBottom: 4 },
  modalInput: { height: 44, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, paddingHorizontal: spacing.md, fontSize: 14, color: colors.navy, backgroundColor: '#F8FAFC' },
  modalFooter: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, paddingTop: 0 },
  modalCancelBtn: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { fontSize: 13, fontWeight: '700', color: colors.muted },
  modalSaveBtn: { flex: 2, height: 44, borderRadius: 12, backgroundColor: colors.orange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  modalSaveText: { fontSize: 13, fontWeight: '800', color: '#fff' },
});

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

type ProfileTab = 'info' | 'permissions' | 'activity';

interface AdminProfileProps {
  onBack: () => void;
}

const PERMISSIONS = [
  'Dashboard Access',
  'User Management',
  'Parking Management',
  'Analytics & Reports',
  'Settings Access',
  'Billing & Payments',
];

const ACTIVITY = [
  { action: 'Updated parking slot A-12 status',  time: '2 hours ago',  icon: 'settings-outline'         },
  { action: 'Approved new user registration',    time: '5 hours ago',  icon: 'person-outline'           },
  { action: 'Generated monthly report',          time: '1 day ago',    icon: 'document-text-outline'    },
  { action: 'Modified parking rates',            time: '2 days ago',   icon: 'settings-outline'         },
  { action: 'Logged in from new device',         time: '3 days ago',   icon: 'shield-outline'           },
  { action: 'Resolved booking dispute #0042',    time: '4 days ago',   icon: 'checkmark-circle-outline' },
];

export function AdminProfile({ onBack }: AdminProfileProps) {
  const [tab, setTab] = useState<ProfileTab>('info');
  const [editing, setEditing] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@pakipark.com',
    phone: '+63 917 123 4567',
    role: 'Super Administrator',
    department: 'Operations',
    employeeId: 'PKP-ADM-001',
  });

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const initials = profile.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const STATS = [
    { label: 'Managed\nLocations', value: '5'     },
    { label: 'Active\nBookings',   value: '234'   },
    { label: 'Users\nManaged',     value: '1,234' },
    { label: 'Account\nCreated',   value: 'Jan\n2025' },
  ];

  return (
    <View style={s.root}>
      {/* Nav — back left, logo+title spaced out */}
      <View style={s.nav}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={20} color={colors.navy} />
        </TouchableOpacity>
        <Image source={require('../../../../assets/pakipark-logo-profile.png')} style={s.navLogo} resizeMode="contain" />
        <Text style={s.navTitle}>Admin Profile</Text>
        {/* spacer to balance */}
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero card ── */}
        <View style={s.hero}>
          {/* Avatar */}
          <View style={s.avatarWrap}>
            {profilePic
              ? <Image source={{ uri: profilePic }} style={s.avatarImg} />
              : <View style={s.avatarBox}><Text style={s.avatarText}>{initials}</Text></View>
            }
            <TouchableOpacity style={s.cameraBtn} onPress={pickImage} accessibilityLabel="Change photo">
              <Ionicons name="camera-outline" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={s.heroName}>{profile.name}</Text>
          <Text style={s.heroEmail}>{profile.email}</Text>

          {/* Badges */}
          <View style={s.badgeRow}>
            <View style={s.roleBadge}>
              <Ionicons name="shield-outline" size={12} color={colors.orange} />
              <Text style={s.roleBadgeText}>{profile.role}</Text>
            </View>
            <View style={s.deptBadge}>
              <Text style={s.deptBadgeText}>{profile.department}</Text>
            </View>
          </View>
          <View style={s.idBadge}>
            <Text style={s.idBadgeText}>{profile.employeeId}</Text>
          </View>

          {/* Stats */}
          <View style={s.statsRow}>
            {STATS.map((st) => (
              <View key={st.label} style={s.statBox}>
                <Text style={s.statValue}>{st.value}</Text>
                <Text style={s.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Tab bar ── */}
        <View style={s.tabBar}>
          {([
            { id: 'info',        label: 'Personal Info' },
            { id: 'permissions', label: 'Permissions'   },
            { id: 'activity',    label: 'Activity'      },
          ] as const).map((tb) => (
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

        {/* ── Personal Info ── */}
        {tab === 'info' && (
          <View style={s.card}>
            <View style={s.cardHeaderRow}>
              <Text style={s.cardTitle}>Personal Information</Text>
              {!editing
                ? <TouchableOpacity style={s.editBtn} onPress={() => setEditing(true)} accessibilityLabel="Edit">
                    <Ionicons name="pencil-outline" size={13} color="#fff" />
                    <Text style={s.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                : <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={s.cancelBtn} onPress={() => setEditing(false)}><Text style={s.cancelBtnText}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity style={s.editBtn} onPress={() => setEditing(false)}><Ionicons name="checkmark" size={13} color="#fff" /><Text style={s.editBtnText}>Save</Text></TouchableOpacity>
                  </View>
              }
            </View>

            {([
              { label: 'FULL NAME',     key: 'name',       icon: 'person-outline',    editable: true  },
              { label: 'EMAIL ADDRESS', key: 'email',      icon: 'mail-outline',      editable: true  },
              { label: 'PHONE NUMBER',  key: 'phone',      icon: 'call-outline',      editable: true  },
              { label: 'EMPLOYEE ID',   key: 'employeeId', icon: 'shield-outline',    editable: false },
              { label: 'ROLE',          key: 'role',       icon: 'shield-outline',    editable: false },
              { label: 'DEPARTMENT',    key: 'department', icon: 'settings-outline',  editable: true  },
            ] as const).map(({ label, key, icon, editable }) => (
              <View key={key} style={s.fieldWrap}>
                <View style={s.fieldLabelRow}>
                  <Ionicons name={icon as any} size={12} color={colors.muted} />
                  <Text style={s.fieldLabel}>{label}</Text>
                </View>
                <TextInput
                  style={[s.fieldInput, (!editing || !editable) && s.fieldInputDisabled]}
                  value={profile[key]}
                  editable={editing && editable}
                  onChangeText={(v) => setProfile({ ...profile, [key]: v })}
                />
              </View>
            ))}

            {/* Security */}
            <Text style={s.secTitle}>Security</Text>
            <TouchableOpacity style={s.secBtn} onPress={() => setPwModal(true)} accessibilityLabel="Change Password">
              <Ionicons name="lock-closed-outline" size={16} color={colors.navy} />
              <Text style={s.secBtnText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.secBtn, { borderColor: colors.border }]} accessibilityLabel="Enable 2FA">
              <Ionicons name="shield-outline" size={16} color={colors.muted} />
              <Text style={[s.secBtnText, { color: colors.muted }]}>Enable 2FA</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Permissions ── */}
        {tab === 'permissions' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Permissions & Access</Text>
            {PERMISSIONS.map((p) => (
              <View key={p} style={s.permItem}>
                <View>
                  <Text style={s.permName}>{p}</Text>
                  <Text style={s.permAccess}>Full access</Text>
                </View>
                <Ionicons name="checkmark-circle-outline" size={22} color="#10B981" />
              </View>
            ))}

            {/* Security */}
            <Text style={s.secTitle}>Security</Text>
            <TouchableOpacity style={s.secBtn} onPress={() => setPwModal(true)} accessibilityLabel="Change Password">
              <Ionicons name="lock-closed-outline" size={16} color={colors.navy} />
              <Text style={s.secBtnText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.secBtn, { borderColor: colors.border }]} accessibilityLabel="Enable 2FA">
              <Ionicons name="shield-outline" size={16} color={colors.muted} />
              <Text style={[s.secBtnText, { color: colors.muted }]}>Enable 2FA</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Activity ── */}
        {tab === 'activity' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Recent Activity</Text>
            {ACTIVITY.map((a, i) => (
              <View key={i} style={s.activityRow}>
                <View style={s.activityIcon}>
                  <Ionicons name={a.icon as any} size={16} color={colors.muted} />
                </View>
                <Text style={s.activityText}>{a.action}</Text>
                <View style={s.activityTime}>
                  <Ionicons name="time-outline" size={11} color={colors.muted} />
                  <Text style={s.activityTimeText}>{a.time}</Text>
                </View>
              </View>
            ))}

            {/* Security */}
            <Text style={s.secTitle}>Security</Text>
            <TouchableOpacity style={s.secBtn} onPress={() => setPwModal(true)} accessibilityLabel="Change Password">
              <Ionicons name="lock-closed-outline" size={16} color={colors.navy} />
              <Text style={s.secBtnText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.secBtn, { borderColor: colors.border }]} accessibilityLabel="Enable 2FA">
              <Ionicons name="shield-outline" size={16} color={colors.muted} />
              <Text style={[s.secBtnText, { color: colors.muted }]}>Enable 2FA</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={pwModal} transparent animationType="slide" onRequestClose={() => setPwModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setPwModal(false)} activeOpacity={1} />
            <View style={s.modalSheet}>
              <View style={s.modalHeader}>
                <View style={s.modalHeaderIcon}>
                  <Ionicons name="lock-closed" size={20} color="#fff" />
                </View>
                <TouchableOpacity style={s.modalCloseBtn} onPress={() => setPwModal(false)}>
                  <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
                <Text style={s.modalTitle}>Change Password</Text>
                <Text style={s.modalSub}>Must be 8+ characters with letters and numbers.</Text>
              </View>
              <ScrollView contentContainerStyle={s.modalBody} keyboardShouldPersistTaps="handled">
                {([
                  { label: 'CURRENT PASSWORD', key: 'current' as const, show: showPw.current, toggle: () => setShowPw({ ...showPw, current: !showPw.current }) },
                  { label: 'NEW PASSWORD',     key: 'next'    as const, show: showPw.next,    toggle: () => setShowPw({ ...showPw, next: !showPw.next })       },
                  { label: 'CONFIRM NEW PASSWORD', key: 'confirm' as const, show: showPw.confirm, toggle: () => setShowPw({ ...showPw, confirm: !showPw.confirm }) },
                ]).map(({ label, key, show, toggle }) => (
                  <View key={key} style={s.pwField}>
                    <Text style={s.pwLabel}>{label}</Text>
                    <View style={s.pwRow}>
                      <TextInput
                        style={s.pwInput}
                        secureTextEntry={!show}
                        value={pw[key]}
                        onChangeText={(v) => setPw({ ...pw, [key]: v })}
                        placeholder="••••••••"
                        placeholderTextColor={colors.muted}
                      />
                      <TouchableOpacity style={s.eyeBtn} onPress={toggle}>
                        <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.muted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={s.modalFooter}>
                <TouchableOpacity style={s.modalCancelBtn} onPress={() => setPwModal(false)}>
                  <Text style={s.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.modalSaveBtn} onPress={() => setPwModal(false)}>
                  <Text style={s.modalSaveText}>Change Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F6' },

  // Nav
  nav: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: '#fff', paddingHorizontal: spacing.lg, paddingTop: spacing.xl + spacing.sm, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  navLogo: { height: 44, width: 90 },
  navTitle: { fontSize: 20, fontWeight: '800', color: colors.navy, marginLeft: spacing.sm },

  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: 32 },

  // Hero
  hero: { backgroundColor: colors.navy, borderRadius: 20, padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
  avatarWrap: { position: 'relative', marginBottom: spacing.xs },
  avatarBox: { width: 80, height: 80, borderRadius: 18, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: 80, height: 80, borderRadius: 18 },
  avatarText: { fontSize: 28, fontWeight: '900', color: '#fff' },
  cameraBtn: { position: 'absolute', bottom: -4, right: -4, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  heroName: { fontSize: 22, fontWeight: '900', color: '#fff' },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.orange, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  roleBadgeText: { fontSize: 12, fontWeight: '700', color: colors.orange },
  deptBadge: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  deptBadgeText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  idBadge: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 4 },
  idBadgeText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: spacing.sm, alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '800', color: '#fff', textAlign: 'center' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 2, lineHeight: 12 },

  // Tab bar
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 4, gap: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  tabBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.navy },
  tabBtnText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  tabBtnTextActive: { color: '#fff', fontWeight: '700' },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 16, padding: spacing.lg, gap: spacing.md, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.navy },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.orange, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  editBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  cancelBtn: { height: 32, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontSize: 12, fontWeight: '700', color: colors.muted },

  // Fields
  fieldWrap: { gap: 4 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: colors.muted, letterSpacing: 0.8 },
  fieldInput: { height: 46, borderRadius: 12, backgroundColor: '#F3F4F6', paddingHorizontal: spacing.md, fontSize: 14, fontWeight: '500', color: colors.navy, borderWidth: 0 },
  fieldInputDisabled: { color: colors.muted },

  // Security
  secTitle: { fontSize: 16, fontWeight: '800', color: colors.navy, marginTop: spacing.sm },
  secBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, height: 50, borderWidth: 1.5, borderColor: colors.navy, borderRadius: 14, paddingHorizontal: spacing.lg },
  secBtnText: { fontSize: 14, fontWeight: '600', color: colors.navy },

  // Permissions
  permItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F0FDF4', borderRadius: 12, padding: spacing.md },
  permName: { fontSize: 14, fontWeight: '700', color: colors.navy },
  permAccess: { fontSize: 12, color: '#10B981', fontWeight: '600', marginTop: 2 },

  // Activity
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: '#F8FAFC', borderRadius: 12, padding: spacing.md },
  activityIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  activityText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.navy },
  activityTime: { flexDirection: 'row', alignItems: 'center', gap: 3, flexShrink: 0 },
  activityTimeText: { fontSize: 10, color: colors.muted, fontWeight: '500' },

  // Password modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  modalHeader: { backgroundColor: colors.navy, padding: spacing.lg, gap: spacing.sm },
  modalHeaderIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  modalCloseBtn: { position: 'absolute', top: spacing.md, right: spacing.md, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  modalSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  modalBody: { padding: spacing.lg, gap: spacing.md },
  pwField: { gap: 6 },
  pwLabel: { fontSize: 10, fontWeight: '800', color: colors.muted, letterSpacing: 0.8 },
  pwRow: { position: 'relative' },
  pwInput: { height: 46, borderRadius: 12, backgroundColor: '#F3F4F6', paddingHorizontal: spacing.md, paddingRight: 44, fontSize: 14, color: colors.navy },
  eyeBtn: { position: 'absolute', right: spacing.md, top: 13 },
  modalFooter: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, paddingTop: 0 },
  modalCancelBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '700', color: colors.muted },
  modalSaveBtn: { flex: 2, height: 48, borderRadius: 14, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  modalSaveText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});

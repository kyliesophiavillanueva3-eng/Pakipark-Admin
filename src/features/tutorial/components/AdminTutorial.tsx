import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 70;
const DIM = 'rgba(0,0,0,0.60)';

interface Step {
  stepLabel: string;
  title: string;
  description: string;
  iconName: string;
  targetTab?: string;
  mascot: string;
  spotlightTab: number;   // tab index 0-3, -1 = none
  spotlightHelp?: boolean; // highlight the ? button in header
}

interface AdminTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onStepChange?: (step: number) => void;
}

const STEPS: Step[] = [
  {
    stepLabel: 'STEP 1 OF 5', title: 'WELCOME, ADMIN!',
    description: 'This guide will walk you through the PakiPark Admin System. Manage slots, bookings, and analytics all in one place.',
    iconName: 'grid-outline', mascot: 'https://i.imgur.com/eX4KbNU.png', spotlightTab: -1,
  },
  {
    stepLabel: 'STEP 2 OF 5', title: 'DASHBOARD OVERVIEW',
    description: 'Monitor real-time stats like total revenue, active users, and slot occupancy at a glance.',
    iconName: 'grid-outline', targetTab: 'dashboard', mascot: 'https://i.imgur.com/ztSn8jC.png', spotlightTab: 0,
  },
  {
    stepLabel: 'STEP 3 OF 5', title: 'PARKING MANAGEMENT',
    description: "Parking slot customization is only available on the full website. Use the 'Open Website to Customize Parking' button to manage your layout and slots.",
    iconName: 'car-outline', targetTab: 'parking', mascot: 'https://i.imgur.com/YDKZb5h.png', spotlightTab: 1,
  },
  {
    stepLabel: 'STEP 4 OF 5', title: 'BOOKING MANAGEMENT',
    description: 'Handle customer reservations, approve pending requests, or track history here.',
    iconName: 'list-outline', targetTab: 'bookings', mascot: 'https://i.imgur.com/GQMKhl9.png', spotlightTab: 2,
  },
  {
    stepLabel: 'STEP 5 OF 5', title: "YOU'RE ALL SET!",
    description: 'Access this guide anytime via the "Guide" button. Ready to manage PakiPark?',
    iconName: 'checkmark-circle-outline', targetTab: 'dashboard', mascot: 'https://i.imgur.com/eX4KbNU.png',
    spotlightTab: -1, spotlightHelp: true,
  },
];

// Tab icons matching HomeScreen
const TAB_ICONS = [
  { icon: 'grid' as const,                  label: 'Dashboard' },
  { icon: 'car-outline' as const,           label: 'Parking'   },
  { icon: 'document-text-outline' as const, label: 'Bookings'  },
  { icon: 'settings-outline' as const,      label: 'Settings'  },
];

export function AdminTutorial({ isOpen, onClose, onNavigate, onStepChange }: AdminTutorialProps) {
  const [step, setStep] = useState(0);
  const mascotAnim = useRef(new Animated.Value(0)).current;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isTop = step === 0 || current.spotlightHelp;

  useEffect(() => {
    if (isOpen) { setStep(0); onStepChange?.(0); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    onStepChange?.(step);
    // Navigate to the relevant tab immediately when step changes
    if (current.targetTab) onNavigate(current.targetTab);
    mascotAnim.setValue(0);
    Animated.spring(mascotAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 7 }).start();
  }, [step, isOpen]);

  const handleNext = () => {
    if (current.targetTab) onNavigate(current.targetTab);
    if (!isLast) setStep((s) => s + 1);
  };
  const handlePrev = () => { if (step > 0) setStep((s) => s - 1); };

  const tabW = SW / 4;
  const spotIdx = current.spotlightTab;
  const spotX = spotIdx >= 0 ? spotIdx * tabW : -1;

  const Card = (
    <View style={s.container}>
      <Animated.View style={[s.mascotWrap, {
        transform: [
          { scale: mascotAnim },
          { translateY: mascotAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
        ],
        opacity: mascotAnim,
      }]}>
        <Image source={{ uri: current.mascot }} style={s.mascot} resizeMode="contain" />
      </Animated.View>

      <View style={s.header}>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` as any }]} />
        </View>
        <View style={s.stepBadge}><Text style={s.stepBadgeText}>{current.stepLabel}</Text></View>
        <Text style={s.headerTitle}>{current.title}</Text>
      </View>

      <View style={s.body}>
        <View style={s.descRow}>
          <View style={s.iconWrap}>
            <Ionicons name={current.iconName as any} size={24} color="#EE6B20" />
          </View>
          <Text style={s.description}>{current.description}</Text>
        </View>
        <View style={s.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[s.dot, i === step ? s.dotActive : i < step ? s.dotPast : s.dotInactive]} />
          ))}
        </View>
        <View style={s.divider} />
        <View style={s.actions}>
          <TouchableOpacity style={[s.prevBtn, step === 0 && s.hidden]} onPress={handlePrev}>
            <Ionicons name="chevron-back" size={22} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}><Text style={s.skipText}>Skip</Text></TouchableOpacity>
          <TouchableOpacity style={[s.nextBtn, isLast && s.finishBtn]} onPress={isLast ? onClose : handleNext}>
            <Text style={s.nextBtnText}>{isLast ? 'FINISH' : 'NEXT'}</Text>
            {!isLast && <Ionicons name="chevron-forward" size={16} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">

        {spotIdx >= 0 ? (
          // ── Spotlight layout: dim everything EXCEPT the spotlit tab ──
          <>
            {/* Full dim layer */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: DIM }]} pointerEvents="none" />

            {/* Re-render the spotlit tab on top of the dim, fully bright */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                bottom: 0,
                left: spotX,
                width: tabW,
                height: TAB_BAR_HEIGHT,
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                borderWidth: 3,
                borderColor: '#EE6B20',
                borderRadius: 16,
              }}
            >
              <Ionicons name={TAB_ICONS[spotIdx].icon} size={24} color="#EE6B20" />
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#EE6B20' }}>
                {TAB_ICONS[spotIdx].label}
              </Text>
            </View>

            {/* Card at bottom */}
            <View style={s.overlayBottom} pointerEvents="box-none">
              {Card}
            </View>
          </>
        ) : current.spotlightHelp ? (
          // ── Step 5: spotlight the ? help button in header ──
          <>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: DIM }]} pointerEvents="none" />
            {/* Bright spotlight — rounded square over the ? button */}
            {/* Header right: avatar(36) + gap(10) + bell(36) + gap(10) + ?(36) + paddingRight(16) */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 42,
                right: 108, // 16 + 36(avatar) + 10 + 36(bell) + 10 = 108 from right
                width: 46, height: 46,
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                borderWidth: 3,
                borderColor: '#EE6B20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="help-circle-outline" size={24} color="#1E3D5A" />
            </View>
            {/* Card upper position */}
            <View style={[s.overlay, s.overlayTop]} pointerEvents="box-none">
              {Card}
            </View>
          </>
        ) : (
          // ── No spotlight: simple full dim with card ──
          <View style={[s.overlay, isTop ? s.overlayTop : s.overlayBottom]} pointerEvents="box-none">
            {Card}
          </View>
        )}

      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: DIM, paddingHorizontal: 16 },
  overlayTop: { paddingTop: 80, justifyContent: 'flex-start' },
  overlayBottom: {
    position: 'absolute', bottom: TAB_BAR_HEIGHT + 8, left: 16, right: 16,
  },

  container: {
    borderRadius: 24, overflow: 'visible',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 4 },
    elevation: 14,
  },

  mascotWrap: { alignItems: 'center', zIndex: 10, marginBottom: -10 },
  mascot: { width: 110, height: 110 },

  header: {
    backgroundColor: '#1E3D5A',
    paddingTop: 16, paddingBottom: 20, paddingHorizontal: 24,
    alignItems: 'center', gap: 10,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden',
  },
  progressTrack: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  progressFill: { height: 4, backgroundColor: '#EE6B20' },
  stepBadge: { backgroundColor: '#EE6B20', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 5 },
  stepBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'center', letterSpacing: 0.5 },

  body: {
    backgroundColor: '#fff',
    paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20, gap: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  descRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  iconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFF3E8', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  description: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 22, fontWeight: '500' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: '#EE6B20' },
  dotPast: { width: 8, backgroundColor: '#FDBA74' },
  dotInactive: { width: 8, backgroundColor: '#E5E7EB' },

  divider: { height: 1, backgroundColor: '#F3F4F6' },

  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prevBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hidden: { opacity: 0 },
  skipText: { fontSize: 14, fontWeight: '600', color: '#9CA3AF' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EE6B20', borderRadius: 999, paddingHorizontal: 28, paddingVertical: 12 },
  finishBtn: { backgroundColor: '#16A34A' },
  nextBtnText: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});

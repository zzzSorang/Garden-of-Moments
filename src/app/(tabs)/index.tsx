import { router, useNavigation } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, BellIcon, CameraIcon, CloseIcon, FloatingButton, GardenScene } from '@/components';
import { useGarden } from '@/lib/garden';
import { tabBarStyle } from '@/lib/tabBar';
import { useToast } from '@/lib/toast';
import { hasNewNotice } from '@/lib/notifications';
import { useNow } from '@/lib/useNow';
import { border, brand, elevation, gardenScene as g, neutral, radius, space } from '@/theme/theme';

/**
 * 정원 탭 (2026-11-28 보스 손그림 구도)
 * - 오른쪽 위: 카메라(사진 모드) · 알림
 * - 오른쪽 아래: + 씨앗 추가
 * - 사진 모드: 탭바와 버튼을 모두 숨기고 정원(+핑옹이)만 보이게. 핑옹이 보이기/숨기기 가능.
 *   TODO: 셔터를 누르면 정원 화면을 갤러리에 저장 (react-native-view-shot + expo-media-library 필요)
 */
export default function GardenScreen() {
  const { entries } = useGarden();
  const now = useNow();
  const hasNew = hasNewNotice(entries, now);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const toast = useToast();
  const [photo, setPhoto] = useState(false);
  const [showPingongi, setShowPingongi] = useState(true);

  // 사진 모드에서는 탭바 숨기기
  useEffect(() => {
    navigation.setOptions({ tabBarStyle: photo ? { display: 'none' } : tabBarStyle(insets.bottom) });
  }, [navigation, photo, insets.bottom]);

  const top = insets.top + space[2];

  return (
    <View style={styles.root}>
      <GardenScene
        entries={entries}
        now={now}
        showPingongi={showPingongi}
        interactive={!photo}
      />

      {photo ? (
        <>
          <Pressable accessibilityRole="button" accessibilityLabel="사진 모드 닫기" onPress={() => setPhoto(false)} style={[styles.close, { top }]}>
            <CloseIcon color={brand.onPrimary} size={20} />
          </Pressable>
          <View style={[styles.photoBar, { paddingBottom: insets.bottom + space[6] }]}>
            <View style={styles.side} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="정원 사진 찍기"
              onPress={() => toast('사진 저장은 곧 추가할게요 📷')}
              style={({ pressed }) => [styles.shutter, pressed && styles.pressed]}
            />
            <View style={[styles.side, styles.sideRight]}>
              <Pressable
                accessibilityRole="switch"
                accessibilityState={{ checked: showPingongi }}
                accessibilityLabel="핑옹이 보이기"
                onPress={() => setShowPingongi((v) => !v)}
                style={styles.toggle}>
                <AppText variant="caption">핑옹이</AppText>
                <View style={[styles.track, !showPingongi && styles.trackOff]}>
                  <View style={[styles.knob, showPingongi ? styles.knobOn : styles.knobOff]} />
                </View>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.icons, { top }]}>
            <IconButton label="정원 사진 찍기" onPress={() => setPhoto(true)}>
              <CameraIcon color={brand.primary} />
            </IconButton>
            <IconButton label={hasNew ? '알림, 새 알림 있음' : '알림'} onPress={() => router.push('/notifications')}>
              <BellIcon color={brand.primary} size={20} />
              {hasNew ? <View style={styles.badge} /> : null}
            </IconButton>
          </View>
          <FloatingButton accessibilityLabel="씨앗 추가" onPress={() => router.push('/bury')} />
        </>
      )}
    </View>
  );
}

function IconButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, elevation.soft, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

const TRACK_W = 30;
const TRACK_H = 18;
const KNOB = 14;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: neutral.bg },
  badge: { position: 'absolute', top: space[2], right: space[2], width: space[2], height: space[2], borderRadius: radius.full, backgroundColor: brand.primary, borderWidth: border.regular, borderColor: neutral.surface },
  icons: { position: 'absolute', right: space[4], flexDirection: 'row', gap: space[2] },
  iconButton: { width: g.iconButton, height: g.iconButton, borderRadius: radius.input, backgroundColor: neutral.tabBar, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
  close: { position: 'absolute', left: space[4], width: g.iconButton, height: g.iconButton, borderRadius: radius.full, backgroundColor: g.photoScrim, alignItems: 'center', justifyContent: 'center' },
  photoBar: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: space[10], paddingHorizontal: space[4], flexDirection: 'row', alignItems: 'center' },
  side: { flex: 1 },
  sideRight: { alignItems: 'flex-end' },
  shutter: { width: g.shutter, height: g.shutter, borderRadius: radius.full, backgroundColor: neutral.surface, borderWidth: space[1], borderColor: neutral.borderSoft },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: space[1.5], backgroundColor: neutral.tabBar, borderRadius: radius.lg, paddingVertical: space[1.5], paddingHorizontal: space[3] },
  track: { width: TRACK_W, height: TRACK_H, borderRadius: radius.full, backgroundColor: brand.primary, justifyContent: 'center' },
  trackOff: { backgroundColor: neutral.textDisabled },
  knob: { position: 'absolute', width: KNOB, height: KNOB, borderRadius: radius.full, backgroundColor: neutral.surface },
  knobOn: { right: (TRACK_H - KNOB) / 2 },
  knobOff: { left: (TRACK_H - KNOB) / 2 },
});

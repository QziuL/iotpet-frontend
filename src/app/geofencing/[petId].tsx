import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadows } from '@/theme';
import { CardInfo, PrimaryButton, ToggleSwitchCard } from '@/components';
import { useGeofences, useSaveGeofence } from '@/hooks/useGeofencing';
import { formatArea } from '@/utils/geofencing.utils';
import type { GeoPoint } from '@/types/geofencing.types';

const { height } = Dimensions.get('window');

// Default center when no geofence exists (São Paulo region)
const DEFAULT_CENTER = { lat: -25.514, lng: -48.522 };
const DEFAULT_POINTS: GeoPoint[] = [
  { latitude: -25.512, longitude: -48.520 },
  { latitude: -25.512, longitude: -48.525 },
  { latitude: -25.517, longitude: -48.525 },
  { latitude: -25.517, longitude: -48.520 },
  { latitude: -25.514, longitude: -48.518 },
];

/**
 * Builds a self-contained Leaflet HTML with an interactive polygon editor.
 * The user can:
 *  - Tap on the map to add polygon points
 *  - Tap a point marker to remove it
 *  - Drag point markers to move them
 * Changes are sent back to RN via window.ReactNativeWebView.postMessage()
 */
function buildGeofenceEditorHTML(
  center: { lat: number; lng: number },
  initialPoints: { lat: number; lng: number }[],
): string {
  const centerJson = JSON.stringify(center);
  const pointsJson = JSON.stringify(initialPoints);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #0D0D14; }
    .leaflet-tile-pane { filter: brightness(0.65) saturate(0.5) hue-rotate(200deg); }
    .vertex-marker {
      width: 20px; height: 20px;
      background: #7A3FFF;
      border: 3px solid #fff;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px #7A3FFFaa;
    }
    .home-marker {
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .add-hint {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(13,13,20,0.85);
      color: #A89DC0;
      font-family: sans-serif;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid rgba(122,63,255,0.3);
      pointer-events: none;
      z-index: 1000;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="add-hint">Toque no mapa para adicionar pontos</div>
  <script>
    const map = L.map('map', {
      center: [${centerJson}.lat, ${centerJson}.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    let points = ${pointsJson};
    let polygon = null;
    let markers = [];

    const vertexIcon = L.divIcon({
      html: '<div class="vertex-marker"></div>',
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const homeIcon = L.divIcon({
      html: '<div class="home-marker">🏠</div>',
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    function sendUpdate() {
      const msg = JSON.stringify({ type: 'points_update', points: points });
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg);
      else if (window.parent) window.parent.postMessage(msg, '*');
    }

    function redraw() {
      // Remove old layers
      markers.forEach(m => map.removeLayer(m));
      markers = [];
      if (polygon) { map.removeLayer(polygon); polygon = null; }

      if (points.length < 2) return;

      // Draw polygon
      polygon = L.polygon(points.map(p => [p.lat, p.lng]), {
        color: '#7A3FFF',
        weight: 2.5,
        opacity: 0.9,
        fillColor: '#7A3FFF',
        fillOpacity: 0.12,
        dashArray: points.length < 3 ? '8 6' : null,
      }).addTo(map);

      // Draw centroid home icon
      if (points.length >= 3) {
        const avgLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
        const avgLng = points.reduce((s, p) => s + p.lng, 0) / points.length;
        const homeM = L.marker([avgLat, avgLng], { icon: homeIcon, zIndexOffset: -100 }).addTo(map);
        markers.push(homeM);
      }

      // Draw draggable vertex markers
      points.forEach((pt, idx) => {
        const m = L.marker([pt.lat, pt.lng], {
          icon: vertexIcon,
          draggable: true,
          zIndexOffset: 100,
        }).addTo(map);

        m.on('drag', (e) => {
          const { lat, lng } = e.target.getLatLng();
          points[idx] = { lat, lng };
          if (polygon) {
            polygon.setLatLngs(points.map(p => [p.lat, p.lng]));
          }
        });

        m.on('dragend', () => sendUpdate());

        // Long press / double-click to remove
        m.on('dblclick', (e) => {
          L.DomEvent.stopPropagation(e);
          if (points.length > 3) {
            points.splice(idx, 1);
            redraw();
            sendUpdate();
          }
        });

        markers.push(m);
      });

      sendUpdate();
    }

    // Add point on map tap
    map.on('click', (e) => {
      points.push({ lat: e.latlng.lat, lng: e.latlng.lng });
      redraw();
      sendUpdate();
    });

    // Listen for commands from RN (clear, reset)
    document.addEventListener('message', handleMsg);
    window.addEventListener('message', handleMsg);
    function handleMsg(e) {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'clear') { points = []; redraw(); sendUpdate(); }
        if (msg.type === 'reset') { points = ${pointsJson}; redraw(); sendUpdate(); }
      } catch(_) {}
    }

    // Initial draw
    redraw();
    sendUpdate();
  </script>
</body>
</html>
`;
}

export default function GeofencingEditorScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);

  const { data: geofences, isLoading } = useGeofences(petId ?? '');
  const saveGeofence = useSaveGeofence();

  const existingFence = geofences?.[0];

  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [name, setName] = useState(existingFence?.name ?? 'Casa');
  const [active, setActive] = useState(existingFence?.active ?? true);
  const [initialized, setInitialized] = useState(false);

  // Area in m²
  const area = points.length >= 3
    ? (() => {
        // Simple shoelace in geographic coords
        let a = 0;
        for (let i = 0; i < points.length; i++) {
          const j = (i + 1) % points.length;
          a += points[i].longitude * points[j].latitude;
          a -= points[j].longitude * points[i].latitude;
        }
        return Math.abs(a * 111320 * 111320) / 2;
      })()
    : 0;

  /** Receive polygon updates from the Leaflet WebView */
  const onWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'points_update') {
        setPoints(
          (msg.points as { lat: number; lng: number }[]).map(p => ({
            latitude: p.lat,
            longitude: p.lng,
          })),
        );
        // Initialize name from existing fence on first load
        if (!initialized && existingFence) {
          setName(existingFence.name);
          setActive(existingFence.active);
          setInitialized(true);
        }
      }
    } catch (_) {}
  }, [initialized, existingFence]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (event: MessageEvent) => {
        if (typeof event.data === 'string') {
          onWebViewMessage({ nativeEvent: { data: event.data } } as any);
        }
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onWebViewMessage]);

  function handleClear() {
    const doClear = () => {
      if (Platform.OS === 'web') {
        const iframe = document.getElementById('geofence-iframe') as HTMLIFrameElement;
        iframe?.contentWindow?.postMessage(JSON.stringify({ type: 'clear' }), '*');
      } else {
        webViewRef.current?.injectJavaScript(
          `document.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'clear' }) })); true;`,
        );
      }
    };

    if (Platform.OS === 'web') {
      const confirmClear = window.confirm('Limpar pontos\n\nDeseja remover todos os pontos da cerca?');
      if (confirmClear) {
        doClear();
      }
    } else {
      Alert.alert('Limpar pontos', 'Deseja remover todos os pontos da cerca?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: doClear,
        },
      ]);
    }
  }

  async function handleSave() {
    if (points.length < 3) {
      if (Platform.OS === 'web') {
        window.alert('Atenção: Adicione ao menos 3 pontos para criar uma cerca válida.');
      } else {
        Alert.alert('Atenção', 'Adicione ao menos 3 pontos para criar uma cerca válida.');
      }
      return;
    }
    if (!name.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Atenção: Dê um nome para a cerca.');
      } else {
        Alert.alert('Atenção', 'Dê um nome para a cerca.');
      }
      return;
    }

    try {
      await saveGeofence.mutateAsync({
        petId: petId ?? '',
        name: name.trim(),
        points,
        active,
        area: Math.round(area),
      });
      if (Platform.OS === 'web') {
        window.alert('Cerca virtual salva com sucesso.');
        router.back();
      } else {
        Alert.alert('Salvo!', 'Cerca virtual salva com sucesso.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch {
      if (Platform.OS === 'web') {
        window.alert('Erro: Não foi possível salvar a cerca.');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar a cerca.');
      }
    }
  }


  const center = existingFence
    ? {
        lat: existingFence.points[0]?.latitude ?? DEFAULT_CENTER.lat,
        lng: existingFence.points[0]?.longitude ?? DEFAULT_CENTER.lng,
      }
    : DEFAULT_CENTER;

  const initialPoints = (existingFence?.points ?? DEFAULT_POINTS).map((p: GeoPoint) => ({
    lat: p.latitude,
    lng: p.longitude,
  }));


  const html = buildGeofenceEditorHTML(center, initialPoints);

  return (
    <View style={styles.container}>
      {/* Map */}
      {Platform.OS === 'web' ? (
        <iframe
          id="geofence-iframe"
          srcDoc={html}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Leaflet Map Geofencing"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html }}
          style={styles.map}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          onMessage={onWebViewMessage}
        />
      )}

      {/* Top header overlay */}
      <View style={[styles.topBar, { top: insets.top + Spacing[3] }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text style={styles.topTitle}>Cerca virtual</Text>
          <Text style={styles.topSub}>Defina a área segura do seu pet</Text>
        </View>

        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={20} color={Colors.state.error} />
        </TouchableOpacity>
      </View>

      {/* Zoom controls */}
      <View style={[styles.zoomControls, { top: insets.top + 80 }]}>
        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={() => webViewRef.current?.injectJavaScript('map.zoomIn(); true;')}
        >
          <Ionicons name="add" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={() => webViewRef.current?.injectJavaScript('map.zoomOut(); true;')}
        >
          <Ionicons name="remove" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { paddingBottom: insets.bottom + Spacing[4] }]}>
        {/* Name + area info */}
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <Text style={styles.fieldLabel}>Nome da cerca</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.nameInput}
              placeholderTextColor={Colors.text.tertiary}
              placeholder="Ex: Casa"
              maxLength={40}
            />
          </View>

          <View style={styles.areaBlock}>
            <Text style={styles.fieldLabel}>Raio/Área</Text>
            <Text style={styles.areaValue}>
              {points.length >= 3 ? formatArea(area) : '—'}
            </Text>
          </View>
        </View>

        {/* Points count pill */}
        <View style={styles.pillRow}>
          <View style={[
            styles.pill,
            points.length >= 3 ? styles.pillOk : styles.pillWarn,
          ]}>
            <Ionicons
              name={points.length >= 3 ? 'checkmark-circle' : 'warning'}
              size={14}
              color={points.length >= 3 ? Colors.state.success : Colors.state.warning}
            />
            <Text style={[styles.pillText, points.length >= 3 ? styles.pillTextOk : styles.pillTextWarn]}>
              {points.length} ponto{points.length !== 1 ? 's' : ''}{' '}
              {points.length < 3 ? '(mínimo 3)' : ''}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              if (Platform.OS === 'web') {
                const iframe = document.getElementById('geofence-iframe') as HTMLIFrameElement;
                iframe?.contentWindow?.postMessage(JSON.stringify({ type: 'reset' }), '*');
              } else {
                webViewRef.current?.injectJavaScript(
                  `document.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'reset' }) })); true;`,
                );
              }
            }}
          >
            <Ionicons name="pencil-outline" size={14} color={Colors.primary.light} />
            <Text style={styles.editBtnText}>Editar pontos</Text>
          </TouchableOpacity>
        </View>

        {/* Active toggle */}
        <ToggleSwitchCard
          label="Ativa"
          description={active ? 'Alertas de fuga habilitados' : 'Cerca pausada'}
          value={active}
          onValueChange={setActive}
          icon={<Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary.light} />}
          style={styles.toggle}
        />

        {/* Save button */}
        <PrimaryButton
          label={saveGeofence.isPending ? 'Salvando...' : 'Salvar cerca'}
          loading={saveGeofence.isPending}
          onPress={handleSave}
          disabled={points.length < 3}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  map: { flex: 1 },

  topBar: {
    position: 'absolute',
    left: Spacing[4],
    right: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface.glass,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  topCenter: { flex: 1 },
  topTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.text.primary,
  },
  topSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.state.errorSubtle,
    borderWidth: 1,
    borderColor: Colors.state.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },

  zoomControls: {
    position: 'absolute',
    right: Spacing[4],
    gap: Spacing[2],
  },
  zoomBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface.glass,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },

  sheet: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border.default,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    gap: Spacing[4],
    ...Shadows.lg,
  },

  nameRow: {
    flexDirection: 'row',
    gap: Spacing[4],
    alignItems: 'flex-end',
  },
  nameField: { flex: 1 },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing[1] + 2,
  },
  nameInput: {
    backgroundColor: Colors.surface.elevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.text.primary,
  },
  areaBlock: { alignItems: 'flex-end' },
  areaValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primary.light,
  },

  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1] + 2,
    paddingVertical: Spacing[1] + 2,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  pillOk: {
    backgroundColor: Colors.state.successSubtle,
    borderColor: Colors.state.success,
  },
  pillWarn: {
    backgroundColor: Colors.state.warningSubtle,
    borderColor: Colors.state.warning,
  },
  pillText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  pillTextOk: { color: Colors.state.success },
  pillTextWarn: { color: Colors.state.warning },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1] + 2,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary.subtle,
    borderWidth: 1,
    borderColor: Colors.primary.default,
  },
  editBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary.light,
  },

  toggle: { padding: Spacing[4] },
});

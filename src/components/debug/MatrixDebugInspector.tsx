// src/components/debug/MatrixDebugInspector.tsx

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Svg, { Circle, Text as SvgText, Line } from 'react-native-svg';
import { calculate37PointsMatrix } from '../../core/destiny-matrix/calculator/main';
import { POINT_LAYOUT } from '../../core/destiny-matrix/layout';
import {
  POINT_REGISTRY,
  getMetaFor,
  type PointDomain,
} from '../../core/destiny-matrix/point-registry';
import type { DestinyMatrixPoints, DestinyPointKey } from '../../core/destiny-matrix/types';

// -----------------------------------------------------------------------
// GROUPING — dibangun otomatis dari point-registry.ts, bukan hardcode.
// Kalau ada titik baru didaftarkan di registry (mis. hasil riset 33-37),
// otomatis muncul di sini tanpa perlu sentuh komponen ini.
// -----------------------------------------------------------------------

const DOMAIN_ORDER: PointDomain[] = [
  'main',
  'ancestral',
  'inner-bridge',
  'channel',
  'companion',
  'timeline',
  'destiny-level',
];

const DOMAIN_LABELS: Partial<Record<PointDomain, string>> = {
  main: 'Pusat & Aksis Utama',
  ancestral: 'Silsilah Leluhur',
  'inner-bridge': 'Inner Cross (Chakra)',
  channel: 'Rezeki & Asmara',
  companion: 'Pendamping & Ekstensi',
  timeline: 'Siklus Usia (Timeline)',
  'destiny-level': 'Level Takdir & Pusat Kekuatan',
};

// Hanya ambil entri kanonik (alias === canonical) supaya satu titik cuma
// terdaftar sekali per grup — alias murni (LM_Center, SubA, A1, dst) tidak
// dobel-hitung sebagai node terpisah.
const POINT_GROUPS: Record<string, DestinyPointKey[]> = DOMAIN_ORDER.reduce(
  (acc, domain) => {
    const groupLabel = DOMAIN_LABELS[domain];
    if (!groupLabel) return acc;

    const keys = POINT_REGISTRY.filter(
      meta => meta.domain === domain && meta.alias === meta.canonical
    ).map(meta => meta.canonical);

    if (keys.length > 0) acc[groupLabel] = keys;
    return acc;
  },
  {} as Record<string, DestinyPointKey[]>
);

const GROUP_NAMES = Object.keys(POINT_GROUPS);

const KEY_TO_GROUP: Record<string, string> = Object.entries(POINT_GROUPS).reduce(
  (acc, [groupName, keys]) => {
    keys.forEach(k => {
      acc[k] = groupName;
    });
    return acc;
  },
  {} as Record<string, string>
);

// -----------------------------------------------------------------------
// LABEL & DESKRIPSI — diambil dari registry (label 'ui' diprioritaskan
// kalau ada, karena itu yang bawa simbol seperti $ / ❤️).
// -----------------------------------------------------------------------
function getDisplayInfo(key: DestinyPointKey): {
  label: string;
  description: string;
  symbol?: string;
} {
  const metas = getMetaFor(key);
  if (metas.length === 0) return { label: key, description: 'Titik kalkulasi intermediate' };

  const uiMeta = metas.find(m => m.domain === 'ui');
  const primaryMeta = metas.find(m => m.domain !== 'ui') ?? metas[0];

  return {
    label: uiMeta?.label ?? primaryMeta.label,
    description: primaryMeta.description ?? '',
    symbol: uiMeta?.symbol,
  };
}

export const MatrixDebugInspector: React.FC = () => {
  const [day, setDay] = useState<string>('12');
  const [month, setMonth] = useState<string>('8');
  const [year, setYear] = useState<string>('1983');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // --- Kontrol Node: grup mana yang aktif ditampilkan (canvas + tabel) ---
  const [activeGroups, setActiveGroups] = useState<Set<string>>(new Set(GROUP_NAMES));

  const toggleGroup = useCallback((groupName: string) => {
    setActiveGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  }, []);

  const showAllGroups = useCallback(() => setActiveGroups(new Set(GROUP_NAMES)), []);
  const hideAllGroups = useCallback(() => setActiveGroups(new Set()), []);

  const isKeyVisible = useCallback(
    (key: string) => activeGroups.has(KEY_TO_GROUP[key] ?? ''),
    [activeGroups]
  );

  const parsedDay = parseInt(day, 10) || 12;
  const parsedMonth = parseInt(month, 10) || 8;
  const parsedYear = parseInt(year, 10) || 1983;

  const matrixPoints = useMemo(() => {
    try {
      // Signature calculate37PointsMatrix(day, month, year) sudah pasti
      // (dikonfirmasi via engine.ts) — tidak perlu fallback bentuk lain.
      return (
        calculate37PointsMatrix(parsedDay, parsedMonth, parsedYear) ?? ({} as DestinyMatrixPoints)
      );
    } catch (err) {
      console.error('Matrix Calculation Exception:', err);
      return {} as DestinyMatrixPoints;
    }
  }, [parsedDay, parsedMonth, parsedYear]);

  const getValue = (key: string): number | 'N/A' => {
    const point = matrixPoints[key as DestinyPointKey];
    if (point === undefined || point === null) return 'N/A';
    if (typeof point === 'object' && 'value' in point && typeof point.value === 'number') {
      return point.value;
    }
    return 'N/A';
  };

  const handleCopyAllValues = async () => {
    const visibleKeys = Object.keys(POINT_LAYOUT).filter(
      key => KEY_TO_GROUP[key] !== undefined && isKeyVisible(key)
    );
    const lines = visibleKeys.map(key => `${key}: ${getValue(key)}`);
    const header = `Destiny Matrix Debug Export\nTanggal: ${parsedDay}/${parsedMonth}/${parsedYear}\nGrup aktif: ${activeGroups.size}/${GROUP_NAMES.length}\nTotal titik: ${lines.length}\n---`;
    const text = `${header}\n${lines.join('\n')}`;

    await Clipboard.setStringAsync(text);
    Alert.alert('✅ Tersalin', `${lines.length} titik (grup aktif) disalin ke clipboard.`);
  };

  const mapToCanvas = (x: number, y: number) => {
    const scale = 110;
    const centerX = 140;
    const centerY = 140;
    return { cx: centerX + x * scale, cy: centerY + y * scale };
  };

  const karmicD = getValue('D');
  const karmicMid = getValue('M') !== 'N/A' ? getValue('M') : getValue('D1');
  const karmicEnd = getValue('T') !== 'N/A' ? getValue('T') : getValue('SubD');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚡ Destiny Matrix Inspector</Text>
        <Text style={styles.headerSubtitle}>
          Audit visual koordinat, integritas formula, dan evaluasi hasil kalkulasi.
        </Text>
      </View>

      {/* Input Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tanggal Lahir Uji:</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hari</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={day}
              onChangeText={setDay}
              maxLength={2}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bulan</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={month}
              onChangeText={setMonth}
              maxLength={2}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tahun</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={year}
              onChangeText={setYear}
              maxLength={4}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.exportButton} onPress={handleCopyAllValues}>
          <Text style={styles.exportButtonText}>
            📋 Salin Hasil Debug ke Clipboard (grup aktif)
          </Text>
        </TouchableOpacity>

        <View style={styles.karmicBadge}>
          <Text style={styles.karmicBadgeLabel}>KARMIC TAIL (D → M → SubD):</Text>
          <Text style={styles.karmicBadgeValue}>
            {karmicD} - {karmicMid} - {karmicEnd}
          </Text>
        </View>
      </View>

      {/* Kontrol Node: toggle per grup */}
      <View style={styles.card}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.cardTitle}>Kontrol Node</Text>
          <Text style={styles.countBadge}>
            {activeGroups.size}/{GROUP_NAMES.length} grup aktif
          </Text>
        </View>

        <View style={styles.controlActionsRow}>
          <TouchableOpacity style={styles.controlActionBtn} onPress={showAllGroups}>
            <Text style={styles.controlActionText}>Tampilkan Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlActionBtn} onPress={hideAllGroups}>
            <Text style={styles.controlActionText}>Sembunyikan Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chipsWrap}>
          {GROUP_NAMES.map(groupName => {
            const active = activeGroups.has(groupName);
            const count = POINT_GROUPS[groupName].length;
            return (
              <TouchableOpacity
                key={groupName}
                onPress={() => toggleGroup(groupName)}
                style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active ? styles.chipTextActive : styles.chipTextInactive,
                  ]}
                >
                  {groupName} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Visual Canvas — hanya render node dari grup aktif */}
      <View style={[styles.card, { alignItems: 'center' }]}>
        <Text style={styles.cardTitle}>Visual Coordinates Canvas</Text>
        <View style={styles.svgContainer}>
          <Svg width="280" height="280">
            <Line x1="140" y1="20" x2="140" y2="260" stroke="#334155" strokeDasharray="3 3" />
            <Line x1="20" y1="140" x2="260" y2="140" stroke="#334155" strokeDasharray="3 3" />

            <Line x1="40" y1="40" x2="240" y2="240" stroke="#f59e0b40" strokeWidth="1.5" />
            <Line x1="240" y1="40" x2="40" y2="240" stroke="#ec489940" strokeWidth="1.5" />

            {Object.entries(POINT_LAYOUT)
              .filter(([key]) => KEY_TO_GROUP[key] !== undefined && isKeyVisible(key))
              .map(([key, coord]) => {
                const { cx, cy } = mapToCanvas(coord.x, coord.y);
                const val = String(getValue(key));
                const isSelected = selectedKey === key;

                return (
                  <React.Fragment key={key}>
                    <Circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 12 : 8.5}
                      fill={isSelected ? '#34d399' : '#1e293b'}
                      stroke={isSelected ? '#059669' : '#38bdf8'}
                      strokeWidth={isSelected ? 2 : 1}
                      onPress={() => setSelectedKey(key)}
                    />
                    <SvgText
                      x={cx}
                      y={cy + 3}
                      fill={isSelected ? '#0f172a' : '#f8fafc'}
                      fontSize="7.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      onPress={() => setSelectedKey(key)}
                    >
                      {val}
                    </SvgText>
                    <SvgText
                      x={cx}
                      y={cy - 10}
                      fill={isSelected ? '#34d399' : '#94a3b8'}
                      fontSize="6.5"
                      textAnchor="middle"
                    >
                      {key}
                    </SvgText>
                  </React.Fragment>
                );
              })}
          </Svg>
        </View>
        <Text style={styles.hintText}>
          Garis oranye = Male Line (F-H) · Garis pink = Female Line (G-I)
        </Text>
        {activeGroups.size === 0 && (
          <Text style={styles.emptyHint}>
            Semua grup disembunyikan — aktifkan minimal satu grup di Kontrol Node.
          </Text>
        )}
      </View>

      {/* Table Detail — hanya render grup yang aktif, label dari registry */}
      {Object.entries(POINT_GROUPS)
        .filter(([groupName]) => activeGroups.has(groupName))
        .map(([groupName, keys]) => (
          <View key={groupName} style={styles.card}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.cardTitle}>{groupName}</Text>
              <Text style={styles.countBadge}>{keys.length} titik</Text>
            </View>

            {keys.map(key => {
              const val = getValue(key);
              const info = getDisplayInfo(key);
              const isSelected = selectedKey === key;

              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelectedKey(key)}
                  style={[styles.tableRow, isSelected && styles.tableRowSelected]}
                >
                  <View style={styles.keyCol}>
                    <Text style={styles.keyText}>{key}</Text>
                    <View style={styles.valBadge}>
                      <Text style={styles.valText}>{val}</Text>
                    </View>
                  </View>

                  <View style={styles.infoCol}>
                    <Text style={styles.labelText}>
                      {info.symbol ? `${info.symbol} ` : ''}
                      {info.label}
                    </Text>
                    <Text style={styles.descText}>{info.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#34d399' },
  headerSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc', marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputGroup: { flex: 1 },
  inputLabel: { fontSize: 10, color: '#94a3b8', marginBottom: 4 },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    color: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#34d399',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  exportButtonText: { color: '#34d399', fontWeight: 'bold', fontSize: 12 },
  karmicBadge: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  karmicBadgeLabel: { fontSize: 10, fontWeight: 'bold', color: '#fbbf24' },
  karmicBadgeValue: { fontSize: 14, fontWeight: 'bold', color: '#fef08a' },
  svgContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  hintText: { fontSize: 10, color: '#64748b', marginTop: 8, textAlign: 'center' },
  emptyHint: {
    fontSize: 11,
    color: '#f59e0b',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },

  // --- Kontrol Node ---
  controlActionsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  controlActionBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  controlActionText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  chipActive: { backgroundColor: '#064e3b', borderColor: '#34d399' },
  chipInactive: { backgroundColor: '#0f172a', borderColor: '#334155' },
  chipText: { fontSize: 11, fontWeight: '600' },
  chipTextActive: { color: '#34d399' },
  chipTextInactive: { color: '#64748b' },

  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countBadge: {
    fontSize: 10,
    color: '#38bdf8',
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#33415550',
    gap: 12,
  },
  tableRowSelected: { backgroundColor: '#064e3b50', borderRadius: 6, paddingHorizontal: 6 },
  keyCol: { alignItems: 'center', justifyContent: 'center', width: 45 },
  keyText: { fontSize: 12, fontWeight: 'bold', color: '#38bdf8', marginBottom: 2 },
  valBadge: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  valText: { fontSize: 10, fontWeight: 'bold', color: '#fbbf24' },
  infoCol: { flex: 1 },
  labelText: { fontSize: 12, fontWeight: '600', color: '#f8fafc' },
  descText: { fontSize: 10, color: '#94a3b8', lineHeight: 14 },
});

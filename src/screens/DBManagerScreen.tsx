// src/screens/DBManagerScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getDatabase } from '@db/index';
import { useThemeStore } from '@store/theme-store';
import { destinyCacheManager } from '@db/destiny-cache-manager';
import type { SQLiteDatabase } from 'expo-sqlite';

// ─── Konstanta ──────────────────────────────────────────
const COL_W = 140;
const ACT_W = 50;
const PAGE_SIZE = 50;
const DB_NAME = 'destiny_matrix.db'; // Nama file database

// ─── Helper untuk mendapatkan path file database ─────────
const getDbPath = () => `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

// ─── Tipe data untuk baris tabel ─────────────────────────
interface RowData {
  [key: string]: any;
}

// ─── Komponen Utama ───────────────────────────────────────
export default function DBManagerScreen({ onClose }: { onClose?: () => void }) {
  const colors = useThemeStore(state => state.getColors());

  // State database
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelected] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Pagination
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Edit cell
  const [editCell, setEditCell] = useState<{
    rowIndex: number;
    col: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  // SQL Runner
  const [showSQL, setShowSQL] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM destiny_matrix_results LIMIT 5');
  const [sqlResult, setSqlResult] = useState<string>('');

  // ── Inisialisasi database ────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const instance = await getDatabase();
        setDb(instance);
      } catch (e: any) {
        Alert.alert('DB Error', e.message);
      }
    })();
  }, []);

  // ── Load daftar tabel ─────────────────────────────────────
  const loadTables = useCallback(async () => {
    if (!db) return;
    try {
      const rows = await db.getAllAsync<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      );
      setTables(rows.map(r => r.name));
    } catch (e: any) {
      Alert.alert('Schema Error', e.message);
    }
  }, [db]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  // ── Load data tabel dengan pagination ────────────────────
  const loadData = useCallback(
    async (isInitial = true) => {
      if (!db || !selectedTable) return;

      if (isInitial) {
        setLoading(true);
        setOffset(0);
        setHasMore(true);
      } else {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
      }

      try {
        const currentOffset = isInitial ? 0 : offset;
        const rows = await db.getAllAsync<RowData>(
          `SELECT * FROM ${selectedTable} LIMIT ${PAGE_SIZE} OFFSET ${currentOffset}`
        );

        if (isInitial) {
          if (rows.length > 0) {
            setColumns(Object.keys(rows[0]));
            setData(rows);
          } else {
            // Ambil info kolom dari PRAGMA jika tabel kosong
            const info = await db.getAllAsync<{ name: string }>(
              `PRAGMA table_info(${selectedTable})`
            );
            setColumns(info.map(i => i.name));
            setData([]);
          }
        } else {
          setData(prev => [...prev, ...rows]);
        }

        setHasMore(rows.length === PAGE_SIZE);
        setOffset(currentOffset + PAGE_SIZE);
      } catch (e: any) {
        Alert.alert('Query Error', e.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [db, selectedTable, offset, hasMore, loadingMore]
  );

  useEffect(() => {
    if (selectedTable) {
      loadData(true);
    }
  }, [selectedTable]);

  // ── Update cell in-place ──────────────────────────────────
  const handleUpdate = async () => {
    if (!db || !editCell || !selectedTable) return;
    try {
      const row = data[editCell.rowIndex];
      // Asumsi primary key adalah 'id'
      const rowId = row.id;
      await db.runAsync(`UPDATE ${selectedTable} SET ${editCell.col} = ? WHERE id = ?`, [
        editValue,
        rowId,
      ]);
      // Update lokal
      const newData = [...data];
      newData[editCell.rowIndex][editCell.col] = editValue;
      setData(newData);
      setEditCell(null);
    } catch (e: any) {
      Alert.alert('Update Error', e.message);
    }
  };

  // ── Hapus baris ───────────────────────────────────────────
  const handleDelete = (row: RowData) => {
    Alert.alert('Hapus Baris?', `id: ${row.id}`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            if (!db || !selectedTable) return;
            await db.runAsync(`DELETE FROM ${selectedTable} WHERE id = ?`, [row.id]);
            setData(prev => prev.filter(r => r.id !== row.id));
          } catch (e: any) {
            Alert.alert('Delete Error', e.message);
          }
        },
      },
    ]);
  };

  // ── Export CSV ────────────────────────────────────────────
  const handleExportCSV = async () => {
    if (!db || !selectedTable || data.length === 0) {
      return Alert.alert('Peringatan', 'Pilih tabel dan pastikan ada data untuk di-export.');
    }

    try {
      setProcessing(true);
      // Ambil semua data (tanpa pagination)
      const allRows = await db.getAllAsync<RowData>(`SELECT * FROM ${selectedTable}`);
      if (allRows.length === 0) throw new Error('Tabel kosong');

      const header = columns.join(',');
      const csvRows = allRows.map(row =>
        columns
          .map(col => {
            const val = String(row[col] ?? '');
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      );
      const csvContent = `${header}\n${csvRows.join('\n')}`;
      const fileName = `${selectedTable}_Export_${Date.now()}.csv`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: `Export ${selectedTable} ke CSV`,
        UTI: 'public.comma-separated-values-text',
      });
    } catch (e: any) {
      Alert.alert('Export Error', e.message);
    } finally {
      setProcessing(false);
    }
  };

  // ── Backup database ───────────────────────────────────────
  const handleBackup = async () => {
    try {
      setProcessing(true);
      const dbPath = getDbPath();
      const info = await FileSystem.getInfoAsync(dbPath);
      if (!info.exists) throw new Error('File database tidak ditemukan.');
      await Sharing.shareAsync(dbPath, {
        mimeType: 'application/x-sqlite3',
        dialogTitle: 'Backup Destiny Matrix DB',
      });
    } catch (e: any) {
      Alert.alert('Backup Error', e.message);
    } finally {
      setProcessing(false);
    }
  };

  // ── Wipe cache ────────────────────────────────────────────
  const handleWipeCache = () => {
    Alert.alert(
      '⚠️ Hapus Semua Cache?',
      'Semua hasil kalkulasi dan riwayat akan dihapus. Data akan dihitung ulang saat dibutuhkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessing(true);
              await destinyCacheManager.clearAllCache();
              Alert.alert('🧹 Selesai', 'Cache telah dibersihkan.');
              loadTables();
              setSelected(null);
              setData([]);
            } catch (e: any) {
              Alert.alert('Error', e.message);
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  // ── SQL Runner ─────────────────────────────────────────────
  const handleRunSQL = async () => {
    if (!db) return;
    try {
      const trimmed = sqlQuery.trim().toUpperCase();
      if (!trimmed.startsWith('SELECT') && !trimmed.startsWith('PRAGMA')) {
        Alert.alert(
          'Query tidak diizinkan',
          'Hanya SELECT & PRAGMA yang didukung melalui kueri ini.'
        );
        return;
      }
      const rows = await db.getAllAsync<RowData>(sqlQuery.trim());
      setSqlResult(JSON.stringify(rows, null, 2));
    } catch (e: any) {
      setSqlResult(`ERROR: ${e.message}`);
    }
  };

  // ── Render ────────────────────────────────────────────────
  const themeStyles = {
    bg: colors.background,
    bgLight: colors.backgroundLight,
    text: colors.text,
    textSecondary: colors.textSecondary || '#94A3B8',
    textMuted: colors.textMuted || '#64748B',
    primary: colors.primary,
    border: colors.border,
    danger: colors.error,
  };

  const s = getStyles(themeStyles);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* HEADER */}
      <View style={s.header}>
        <Text style={s.title}>🛠 Database Manager</Text>
        <View style={s.headerActions}>
          <TouchableOpacity onPress={handleExportCSV} disabled={processing} style={s.iconBtn}>
            <Text style={s.iconBtnText}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBackup} disabled={processing} style={s.iconBtn}>
            <Text style={s.iconBtnText}>💾</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSQL(true)} style={s.iconBtn}>
            <Text style={s.iconBtnText}>⚡</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWipeCache} style={s.iconBtn}>
            <Text style={[s.iconBtnText, { color: themeStyles.danger }]}>🗑️</Text>
          </TouchableOpacity>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={s.iconBtn}>
              <Text style={s.iconBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* PILIH TABEL */}
      <View style={s.tableChipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tableChipsContent}
        >
          {tables.map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelected(t)}
              style={[s.chip, selectedTable === t && s.chipActive]}
            >
              <Text style={[s.chipText, selectedTable === t && s.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* JUMLAH BARIS */}
      {selectedTable && !loading && <Text style={s.rowCount}>Menampilkan {data.length} baris</Text>}

      {/* DATA GRID */}
      <View style={s.flex1}>
        {loading && data.length === 0 ? (
          <View style={s.center}>
            <ActivityIndicator color={themeStyles.primary} size="large" />
          </View>
        ) : !selectedTable ? (
          <View style={s.center}>
            <Text style={s.centerText}>📋</Text>
            <Text style={s.centerText}>Pilih tabel di atas</Text>
          </View>
        ) : (
          <ScrollView horizontal>
            <View>
              {/* Header kolom */}
              <View style={[s.row, s.headerRow]}>
                <View style={[s.cell, { width: ACT_W }]} />
                {columns.map(col => (
                  <View key={col} style={[s.cell, { width: COL_W }]}>
                    <Text style={s.columnHeaderText} numberOfLines={1}>
                      {col.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Data rows */}
              <FlatList
                data={data}
                keyExtractor={(_, i) => i.toString()}
                onEndReached={() => loadData(false)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  loadingMore ? (
                    <ActivityIndicator style={{ padding: 20 }} color={themeStyles.primary} />
                  ) : null
                }
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      s.row,
                      {
                        backgroundColor: index % 2 === 0 ? themeStyles.bgLight : themeStyles.bg,
                      },
                    ]}
                  >
                    {/* Delete button */}
                    <TouchableOpacity
                      style={[s.cell, { width: ACT_W, alignItems: 'center' }]}
                      onPress={() => handleDelete(item)}
                    >
                      <Text style={{ color: themeStyles.danger, fontSize: 14 }}>🗑</Text>
                    </TouchableOpacity>

                    {/* Cells */}
                    {columns.map(col => {
                      const isEditing = editCell?.rowIndex === index && editCell?.col === col;
                      return (
                        <TouchableOpacity
                          key={col}
                          style={[
                            s.cell,
                            { width: COL_W },
                            isEditing && { backgroundColor: '#1E293B' },
                          ]}
                          onLongPress={() => {
                            setEditCell({ rowIndex: index, col });
                            setEditValue(String(item[col] ?? ''));
                          }}
                        >
                          {isEditing ? (
                            <TextInput
                              value={editValue}
                              onChangeText={setEditValue}
                              onBlur={handleUpdate}
                              autoFocus
                              style={s.editInput}
                            />
                          ) : (
                            <Text numberOfLines={1} style={s.dataText}>
                              {item[col] === null ? 'NULL' : String(item[col])}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                ListEmptyComponent={
                  <View style={s.center}>
                    <Text style={{ color: themeStyles.textMuted }}>Tabel kosong</Text>
                  </View>
                }
              />
            </View>
          </ScrollView>
        )}
      </View>

      {/* SQL MODAL */}
      <Modal visible={showSQL} animationType="slide" onRequestClose={() => setShowSQL(false)}>
        <SafeAreaView style={s.root} edges={['top', 'bottom']}>
          <View style={s.header}>
            <Text style={s.title}>⚡ SQL Runner</Text>
            <TouchableOpacity onPress={() => setShowSQL(false)} style={s.iconBtn}>
              <Text style={s.iconBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 16, gap: 12 }}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              multiline
              value={sqlQuery}
              onChangeText={setSqlQuery}
              style={s.sqlInput}
              placeholder="SELECT * FROM ..."
              placeholderTextColor={themeStyles.textMuted}
            />

            <TouchableOpacity onPress={handleRunSQL} style={s.runBtn}>
              <Text style={s.runBtnText}>▶ Jalankan</Text>
            </TouchableOpacity>

            {sqlResult !== '' && (
              <ScrollView horizontal>
                <Text style={s.sqlResultText}>{sqlResult}</Text>
              </ScrollView>
            )}

            <Text style={s.shortcutTitle}>SHORTCUTS</Text>
            {[
              'SELECT * FROM destiny_matrix_results LIMIT 5',
              'SELECT COUNT(*) FROM destiny_profiles',
              'SELECT * FROM destiny_user_history LIMIT 10',
              'DELETE FROM destiny_matrix_results',
              'PRAGMA table_info(destiny_profiles)',
            ].map(q => (
              <TouchableOpacity key={q} onPress={() => setSqlQuery(q)} style={s.shortcut}>
                <Text style={s.shortcutText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* OVERLAY PROCESSING */}
      {processing && (
        <View style={s.overlay}>
          <ActivityIndicator size="large" color={themeStyles.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Dynamic Styles ─────────────────────────────────────────
const getStyles = (c: any) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: c.bgLight,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    title: { fontSize: 16, fontWeight: '700', color: c.text },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { padding: 8 },
    iconBtnText: { fontSize: 20, color: c.text },
    tableChipsContainer: { height: 48, backgroundColor: c.bgLight },
    tableChipsContent: {
      paddingHorizontal: 16,
      alignItems: 'center',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: c.border,
    },
    chipActive: { backgroundColor: c.primary },
    chipText: { fontSize: 12, fontWeight: '600', color: c.textSecondary },
    chipTextActive: { color: '#fff' },
    rowCount: {
      fontSize: 11,
      paddingHorizontal: 16,
      paddingVertical: 4,
      color: c.textMuted,
    },
    flex1: { flex: 1 },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    centerText: { color: c.textMuted, marginTop: 12 },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: c.border,
    },
    headerRow: { backgroundColor: c.bgLight },
    cell: {
      padding: 8,
      justifyContent: 'center',
      borderRightWidth: 0.5,
      borderRightColor: c.border,
    },
    columnHeaderText: {
      color: c.primary,
      fontSize: 10,
      fontWeight: '700',
    },
    dataText: {
      color: c.textSecondary,
      fontSize: 11,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    editInput: {
      color: c.text,
      fontSize: 11,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      padding: 0,
    },
    sqlInput: {
      minHeight: 100,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.bgLight,
      color: c.text,
      fontSize: 13,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      textAlignVertical: 'top',
    },
    runBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: c.primary,
    },
    runBtnText: { color: '#fff', fontWeight: '700' },
    sqlResultText: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: c.bgLight,
      color: c.textSecondary,
      fontSize: 11,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      minWidth: '100%',
    },
    shortcutTitle: {
      color: c.textMuted,
      fontSize: 12,
      marginTop: 12,
      fontWeight: '600',
    },
    shortcut: {
      padding: 10,
      borderRadius: 6,
      backgroundColor: c.border,
      marginBottom: 6,
    },
    shortcutText: {
      color: c.primary,
      fontSize: 11,
      fontFamily: 'monospace',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
    },
  });

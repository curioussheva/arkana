# Ihtisar Proyek: Arkana — Destiny Matrix

> Ringkasan lengkap sesi pengembangan, dari MVP numerologi klasik sampai migrasi penuh ke Destiny Matrix.

## 1. Latar Belakang & Keputusan Strategis

Proyek dimulai sebagai **numerologi klasik Pythagorean** (life path, destiny, soul urge, dst dari nama + tanggal lahir). Setelah eksplorasi ide dari chat referensi "Destiny Matrix" yang viral, ditemukan bahwa:

- Sistem yang lebih relevan dengan identitas app ("Arkana", 22 kartu tarot, minat pasar) adalah **Destiny Matrix (metode Natalia Ladini, 2006)** — berbasis tanggal lahir murni, nilai tetap di rentang 1-22 (tidak direduksi ke 1 digit), setiap titik langsung memetakan ke kartu Arcana.
- Diputuskan: **Destiny Matrix menggantikan numerologi klasik** sebagai fitur utama.
- Numerologi klasik diawetkan penuh di branch **`pythagorean-klasik`**; pengembangan aktif lanjut di branch **`destiny-matrix`**.

## 2. Core Engine — Status: Terverifikasi

| Komponen | File | Status |
|---|---|---|
| 13 titik utama (A-M) | `src/core/destiny-matrix/engine.ts` | ✅ Diverifikasi terhadap worked example resmi (7 Jan 1987) — semua 13 nilai cocok persis, termasuk edge case H=I=22 |
| Geometri diagram | `src/core/destiny-matrix/layout.ts` | ✅ Posisi normalized tiap titik + garis outline/diagonal |
| Personal Year Arcana | `src/core/destiny-matrix/personal-year.ts` | ⚠️ Ekstensi konsisten kami sendiri — formula publik utk fitur ini tidak konsisten antar sumber, jadi kami pakai konvensi 1-22 yang sama dengan sistem inti |
| Narrative generator | `src/core/destiny-matrix/insight.ts` | ✅ Rule-based, deterministik, menyusun makna kartu E/A/D + elemen dominan + Personal Year |
| Helper bersama | `src/core/destiny-matrix/utils.ts` | ✅ `reduceToArcana`, `parseBirthDate`, `sumDigits` |

**Catatan penting:** "Love Line", "Money Line", "Karmic Tail" — **sengaja tidak diimplementasi**. Riset menunjukkan sumber-sumber publik saling bertentangan (bahkan soal jumlah total titik: 13 vs 22), dan tidak ada formula terverifikasi yang bisa dipertanggungjawabkan.

## 3. Fitur yang Sudah Dibangun

| # | Fitur | File Utama | Status |
|---|---|---|---|
| 1 | Kalkulasi 13 titik + visualisasi diamond (Skia) | `DestinyDiamond.tsx` | ✅ |
| 2 | Tap-to-detail modal per titik | `PointDetailModal.tsx` | ✅ |
| 3 | Personal Year Arcana (card tappable) | `HomeScreen.tsx` | ✅ |
| 4 | Multiple Profiles (simpan beberapa orang) | `profile-schema.ts`, `profile-manager.ts` | ✅ |
| 5 | History + Profile Switcher | `HistoryScreen.tsx` | ✅ |
| 6 | Insight naratif (rule-based) | `insight.ts`, `InsightScreen.tsx` | ✅ |
| 7 | Export & share diagram (PNG) | `DestinyDiamond.tsx` (forwardRef), `HomeScreen.tsx` | ✅ (butuh `react-native-view-shot` + rebuild dev-client) |
| 8 | Input tanggal format Indonesia (DD/MM/YYYY) | `HomeScreen.tsx` | ✅ |
| 9 | Clear cache / reset data | `SettingsScreen.tsx` | ✅ |
| 10 | Error boundary (cegah blank screen) | `ErrorBoundary.tsx` | ✅ |
| 11 | Migration scaffold (schema versioning) | `db/index.ts` | ✅ |

## 4. Struktur Database (`destiny_matrix.db`)

```
destiny_matrix_results   — hasil kalkulasi per profil (cache ~1 tahun)
destiny_user_history     — log aksi per profil
destiny_profiles         — profil tersimpan (nama + tanggal lahir)
destiny_schema_meta      — tracking versi skema
```

## 5. Testing

```
Test Suites: 5 passed
Tests:       ~30+ passed (arkana, destiny-matrix-engine, personal-year, insight, + lainnya)
```

Setiap kalkulasi kritis (13 titik, personal year) diverifikasi manual terhadap sumber independen sebelum ditulis sebagai test — bukan sekadar "test yang lolos", tapi test yang membuktikan formulanya benar.

## 6. Yang Sengaja Ditunda / Belum Dibangun

- **Love Line / Money Line / Karmic Tail** — nunggu sumber formula yang bisa diverifikasi
- **Timeline usia (titik N-T)** — kandidat verifiable berikutnya, dari sumber yang sama dengan A-M
- **Compatibility Matrix** (2 profil dibandingkan) — belum diriset metodologinya
- **Localization** — toggle `id`/`en` ada di Settings tapi string terjemahan belum lengkap
- **Push notification, widget** — belum digarap

## 7. Isu Teknis yang Pernah Ditemukan & Diperbaiki

- pnpm + Metro symlink resolution (`../../App` gagal resolve) → custom `index.js` entry point
- `mapToArkana()` bug: kartu index 10-21 tidak pernah muncul akibat reduksi ganda sebelum modulo
- ESLint 9 flat config migration, ketidakcocokan versi `jest-expo` yang sempat merusak dependency tree
- Font asset hilang, database migration untuk data lama

## 8. Rekomendasi Langkah Berikutnya

1. Rebuild dev-client buat aktifin `react-native-view-shot`
2. Test menyeluruh di device fisik (semua 4 fitur baru: profiles, history, insight, export)
3. Commit & push ke branch `destiny-matrix`
4. Riset lanjutan: timeline usia (N-T) sebagai fitur besar berikutnya yang punya jalur verifikasi jelas

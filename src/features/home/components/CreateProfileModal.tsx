import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT_SIZE, BORDER_RADIUS, SPACING, SHADOWS } from '@constants/theme';

interface CreateProfileModalProps {
  visible: boolean;
  name: string;
  date: string;
  onNameChange: (text: string) => void;
  onDateChange: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
  formatDateText: (text: string) => string;
  colors: any;
}

export function CreateProfileModal({
  visible,
  name,
  date,
  onNameChange,
  onDateChange,
  onSave,
  onClose,
  formatDateText,
  colors,
}: CreateProfileModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Buat Profil Baru</Text>
          
          <Text style={[styles.label, { color: colors.textSecondary }]}>Nama Lengkap / Alias</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundLight, color: colors.text, borderColor: colors.border }]}
            value={name}
            onChangeText={onNameChange}
            placeholder="Masukkan nama pemilik energi"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Tanggal Lahir</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundLight, color: colors.text, borderColor: colors.border }]}
            value={date}
            onChangeText={(text) => onDateChange(formatDateText(text))}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={10}
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary, marginTop: SPACING.sm }]} onPress={onSave} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Simpan Profil Esensi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: colors.backgroundLight, marginTop: SPACING.sm }]} onPress={onClose}>
            <Text style={{ color: colors.textSecondary }}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.md, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { width: '100%', borderRadius: BORDER_RADIUS['2xl'], padding: SPACING.lg, borderWidth: 1, ...SHADOWS.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '800', marginBottom: SPACING.lg, textAlign: 'center' },
  label: { fontSize: FONT_SIZE.xs, fontWeight: '700', marginBottom: SPACING.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, fontSize: FONT_SIZE.md, marginBottom: SPACING.md, borderWidth: 1.5 },
  button: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: FONT_SIZE.md, fontWeight: '700' },
  modalCloseButton: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, alignItems: 'center' },
});

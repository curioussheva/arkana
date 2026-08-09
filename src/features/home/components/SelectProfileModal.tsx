import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FONT_SIZE, BORDER_RADIUS, SPACING, SHADOWS } from '@constants/theme';
import type { DestinyProfile } from '@db/profile-schema';

interface SelectProfileModalProps {
  visible: boolean;
  profiles: DestinyProfile[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (profile: DestinyProfile) => void;
  onClose: () => void;
  colors: any;
}

export function SelectProfileModal({
  visible,
  profiles,
  selectedId,
  onSelect,
  onDelete,
  onClose,
  colors,
}: SelectProfileModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>Pilih Profil Jiwa</Text>

          <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.profileItem,
                !selectedId && {
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary + '30',
                },
                { borderColor: colors.border },
              ]}
              onPress={() => onSelect(null)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.profileItemName, { color: colors.text, fontWeight: '700' }]}>
                  🌟 Profil Utama (Default)
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: FONT_SIZE.xs }}>
                  Gunakan tanpa basis data eksternal
                </Text>
              </View>
            </TouchableOpacity>

            {profiles.map(profile => (
              <TouchableOpacity
                key={profile.id}
                style={[
                  styles.profileItem,
                  selectedId === profile.id && {
                    backgroundColor: colors.primary + '15',
                    borderColor: colors.primary + '30',
                  },
                  { borderColor: colors.border },
                ]}
                onPress={() => onSelect(profile.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.profileItemName, { color: colors.text }]}>
                    {profile.name}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: FONT_SIZE.xs }}>
                    {profile.birthDate}
                  </Text>
                </View>
                <TouchableOpacity style={styles.deleteAction} onPress={() => onDelete(profile)}>
                  <Text style={{ color: colors.error, fontSize: FONT_SIZE.md }}>🗑️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.modalCloseButton, { backgroundColor: colors.backgroundLight }]}
            onPress={onClose}
          >
            <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '100%',
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalList: { maxHeight: 300, marginBottom: SPACING.md },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  profileItemName: { fontSize: FONT_SIZE.md, fontWeight: '600' },
  deleteAction: { padding: SPACING.sm, marginLeft: SPACING.sm },
  modalCloseButton: { borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, alignItems: 'center' },
});

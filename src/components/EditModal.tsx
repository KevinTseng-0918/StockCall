import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {UNIT_OPTIONS} from '../constants';

interface Props {
  visible: boolean;
  mode: 'category' | 'item';
  onClose: () => void;
  onSubmit: (name: string, unit?: string) => void;
}

// ─── Design Tokens ───────────────────────────────────────────────────────────
const BG = '#FFF8F0';
const SURFACE = '#FFFFFF';
const SURFACE2 = '#FFF3E8';
const SURFACE3 = '#FFE8D0';
const TEXT1 = '#1A0A02';
const TEXT2 = '#9B6B44';
const ACCENT = '#D94F1E';
const BORDER = '#F0D0B8';

const EditModal: React.FC<Props> = ({visible, mode, onClose, onSubmit}) => {
  const [name, setName] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('份');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, mode === 'item' ? selectedUnit : undefined);
    setName('');
    setSelectedUnit('份');
  };

  const handleClose = () => {
    setName('');
    setSelectedUnit('份');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header row */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {mode === 'category' ? '新增類別' : '新增品項'}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!name.trim()}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.confirmText,
                  !name.trim() && styles.confirmTextDisabled,
                ]}>
                新增
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Body */}
          <View style={styles.body}>
            {/* Label */}
            <Text style={styles.inputLabel}>
              {mode === 'category' ? '類別名稱' : '品項名稱'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={mode === 'category' ? '輸入類別名稱' : '輸入品項名稱'}
              placeholderTextColor={TEXT2}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              selectionColor={ACCENT}
            />

            {mode === 'item' && (
              <View style={styles.unitSection}>
                <Text style={styles.unitLabel}>單位</Text>
                <View style={styles.unitGrid}>
                  {UNIT_OPTIONS.map(unit => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitChip,
                        selectedUnit === unit && styles.unitChipActive,
                      ]}
                      onPress={() => setSelectedUnit(unit)}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.unitChipText,
                          selectedUnit === unit && styles.unitChipTextActive,
                        ]}>
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Confirm button */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                !name.trim() && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!name.trim()}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.submitBtnText,
                  !name.trim() && styles.submitBtnTextDisabled,
                ]}>
                確認新增
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  sheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: BORDER,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  handle: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },

  // Header row
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT1,
    letterSpacing: 0.5,
  },
  cancelText: {
    fontSize: 14,
    color: TEXT2,
    fontWeight: '400',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT,
  },
  confirmTextDisabled: {
    color: TEXT2,
    opacity: 0.5,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginHorizontal: 0,
  },

  // Body
  body: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT2,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: TEXT1,
    backgroundColor: SURFACE2,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Unit section
  unitSection: {
    marginTop: 22,
  },
  unitLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT2,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: SURFACE2,
    borderWidth: 1,
    borderColor: BORDER,
  },
  unitChipActive: {
    backgroundColor: 'rgba(217,79,30,0.12)',
    borderColor: ACCENT,
  },
  unitChipText: {
    fontSize: 13,
    color: TEXT2,
    fontWeight: '500',
  },
  unitChipTextActive: {
    color: ACCENT,
    fontWeight: '600',
  },

  // Submit button
  submitBtn: {
    marginTop: 24,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: SURFACE3,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  submitBtnTextDisabled: {
    color: TEXT2,
  },
});

export default EditModal;

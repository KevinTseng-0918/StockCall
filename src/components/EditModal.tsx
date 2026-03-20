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

const EditModal: React.FC<Props> = ({visible, mode, onClose, onSubmit}) => {
  const [name, setName] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('份');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (mode === 'category') {
      onSubmit(trimmed);
    } else {
      onSubmit(trimmed, selectedUnit);
    }
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
      animationType="fade"
      onRequestClose={handleClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.container}>
              <Text style={styles.title}>
                {mode === 'category' ? '新增類別' : '新增品項'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder={
                  mode === 'category' ? '輸入類別名稱' : '輸入品項名稱'
                }
                placeholderTextColor="#BFBFBF"
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />

              {mode === 'item' && (
                <View style={styles.unitSection}>
                  <Text style={styles.unitLabel}>選擇單位</Text>
                  <View style={styles.unitGrid}>
                    {UNIT_OPTIONS.map(unit => (
                      <TouchableOpacity
                        key={unit}
                        style={[
                          styles.unitChip,
                          selectedUnit === unit && styles.unitChipActive,
                        ]}
                        onPress={() => setSelectedUnit(unit)}
                        activeOpacity={0.6}>
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

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleClose}
                  activeOpacity={0.6}>
                  <Text style={styles.cancelBtnText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    !name.trim() && styles.confirmBtnDisabled,
                  ]}
                  onPress={handleSubmit}
                  activeOpacity={0.7}
                  disabled={!name.trim()}>
                  <Text
                    style={[
                      styles.confirmBtnText,
                      !name.trim() && styles.confirmBtnTextDisabled,
                    ]}>
                    新增
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E4E0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D2D2D',
    backgroundColor: '#FAF8F5',
  },

  // Unit Selection
  unitSection: {
    marginTop: 16,
  },
  unitLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8C8C8C',
    marginBottom: 10,
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F5F3F0',
  },
  unitChipActive: {
    backgroundColor: '#C53D2D',
  },
  unitChipText: {
    fontSize: 13,
    color: '#2D2D2D',
    fontWeight: '500',
  },
  unitChipTextActive: {
    color: '#FFFFFF',
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4CFC9',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 15,
    color: '#8C8C8C',
    fontWeight: '500',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#C53D2D',
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#E8E4E0',
  },
  confirmBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  confirmBtnTextDisabled: {
    color: '#BFBFBF',
  },
});

export default EditModal;

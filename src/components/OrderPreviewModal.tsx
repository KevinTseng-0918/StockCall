import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Clipboard = require('react-native/Libraries/Components/Clipboard/Clipboard').default;

// ─── Design Tokens ───────────────────────────────────────────────────────────
const SURFACE = '#FFFFFF';
const SURFACE2 = '#FFF3E8';
const SURFACE3 = '#FFE8D0';
const TEXT1 = '#1A0A02';
const TEXT2 = '#9B6B44';
const ACCENT = '#D94F1E';
const GREEN = '#16A34A';
const BORDER = '#F0D0B8';

interface Props {
  visible: boolean;
  initialText: string;
  onClose: () => void;
}

const OrderPreviewModal: React.FC<Props> = ({visible, initialText, onClose}) => {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visible) {
      setText(initialText);
      setCopied(false);
    }
  }, [visible, initialText]);

  const handleCopy = () => {
    if (!text.trim()) return;
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerSide}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerDeco}>✦</Text>
              <Text style={styles.headerTitle}>叫菜單</Text>
              <Text style={styles.headerDeco}>✦</Text>
            </View>

            <TouchableOpacity
              onPress={handleCopy}
              style={styles.headerSide}
              activeOpacity={0.7}>
              <Text
                style={[styles.copyIconText, copied && styles.copyIconTextDone]}>
                {copied ? '✓' : '⧉'}
              </Text>
              <Text style={[styles.copyLabel, copied && styles.copyLabelDone]}>
                {copied ? '已複製' : '複製'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Editable Text Area */}
          <ScrollView
            style={styles.scrollArea}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.textArea}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
              selectionColor={ACCENT}
              autoCorrect={false}
              spellCheck={false}
            />
          </ScrollView>

          {/* Bottom Copy Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.copyBtn, copied && styles.copyBtnDone]}
              onPress={handleCopy}
              activeOpacity={0.8}>
              <Text style={styles.copyBtnSymbol}>{copied ? '✓' : '⧉'}</Text>
              <Text style={styles.copyBtnText}>
                {copied ? '已複製到剪貼簿' : '複製叫菜單'}
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
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  sheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: BORDER,
    maxHeight: '80%',
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerSide: {
    width: 64,
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDeco: {
    fontSize: 10,
    color: ACCENT,
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ACCENT,
    letterSpacing: 2,
  },
  closeText: {
    fontSize: 16,
    color: TEXT2,
    fontWeight: '400',
  },
  copyIconText: {
    fontSize: 20,
    color: ACCENT,
    textAlign: 'center',
    lineHeight: 24,
  },
  copyIconTextDone: {
    color: GREEN,
  },
  copyLabel: {
    fontSize: 10,
    color: ACCENT,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  copyLabelDone: {
    color: GREEN,
  },

  // Divider
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
  },

  // Text Area
  scrollArea: {
    minHeight: 200,
    maxHeight: 380,
  },
  textArea: {
    fontSize: 15,
    color: TEXT1,
    lineHeight: 26,
    padding: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    backgroundColor: SURFACE,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  copyBtnDone: {
    backgroundColor: GREEN,
    shadowColor: GREEN,
  },
  copyBtnSymbol: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  copyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

});

export default OrderPreviewModal;

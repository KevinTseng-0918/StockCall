import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from 'react-native';
import {MenuItem} from '../types';
import {UNIT_OPTIONS, MAX_QUANTITY} from '../constants';

interface Props {
  items: MenuItem[];
  isEditMode: boolean;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onUpdateUnit: (itemId: string, unit: string) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItem: () => void;
}

// ─── Design Tokens ───────────────────────────────────────────────────────────
const BG = '#FFF8F0';
const SURFACE = '#FFFFFF';
const SURFACE2 = '#FFF3E8';
const SURFACE3 = '#FFE8D0';
const TEXT1 = '#1A0A02';
const TEXT2 = '#9B6B44';
const ACCENT = '#D94F1E';
const ACCENT_DIM = 'rgba(217,79,30,0.07)';
const DANGER = '#DC2626';
const BORDER = '#F0D0B8';

const ItemList: React.FC<Props> = ({
  items,
  isEditMode,
  onUpdateQuantity,
  onUpdateUnit,
  onDeleteItem,
  onAddItem,
}) => {
  const [unitPickerVisible, setUnitPickerVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const openUnitPicker = (itemId: string) => {
    setSelectedItemId(itemId);
    setUnitPickerVisible(true);
  };

  const selectUnit = (unit: string) => {
    if (selectedItemId) {
      onUpdateUnit(selectedItemId, unit);
    }
    setUnitPickerVisible(false);
    setSelectedItemId(null);
  };

  const renderItem = ({item, index}: {item: MenuItem; index: number}) => {
    const isActive = item.quantity > 0;
    const isLast = index === items.length - 1;

    return (
      <View style={[styles.itemRow, isActive && styles.itemRowActive]}>
        {/* Left accent bar */}
        {isActive && !isEditMode && <View style={styles.activeBar} />}

        {/* Delete button (edit mode) */}
        {isEditMode && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDeleteItem(item.id)}
            activeOpacity={0.7}>
            <View style={styles.deleteCircle}>
              <Text style={styles.deleteBtnText}>−</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Item name */}
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, isActive && styles.itemNameActive]}>
            {item.name}
          </Text>
        </View>

        {/* Unit selector */}
        <TouchableOpacity
          style={styles.unitSelector}
          onPress={() => openUnitPicker(item.id)}
          activeOpacity={0.7}>
          <Text style={styles.unitText}>{item.unit}</Text>
          <Text style={styles.unitArrow}>▾</Text>
        </TouchableOpacity>

        {/* Quantity controls */}
        {!isEditMode && (
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={[styles.qtyBtn, item.quantity === 0 && styles.qtyBtnDisabled]}
              onPress={() => onUpdateQuantity(item.id, -1)}
              activeOpacity={0.6}
              disabled={item.quantity === 0}>
              <Text
                style={[
                  styles.qtyBtnText,
                  item.quantity === 0 && styles.qtyBtnTextDisabled,
                ]}>
                −
              </Text>
            </TouchableOpacity>

            <Text style={[styles.qtyValue, isActive && styles.qtyValueActive]}>
              {String(item.quantity).padStart(2, '0')}
            </Text>

            <TouchableOpacity
              style={[
                styles.qtyBtn,
                item.quantity >= MAX_QUANTITY && styles.qtyBtnDisabled,
              ]}
              onPress={() => onUpdateQuantity(item.id, 1)}
              activeOpacity={0.6}
              disabled={item.quantity >= MAX_QUANTITY}>
              <Text
                style={[
                  styles.qtyBtnText,
                  item.quantity >= MAX_QUANTITY && styles.qtyBtnTextDisabled,
                ]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLast && <View style={styles.divider} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addItemBtn}
            onPress={onAddItem}
            activeOpacity={0.7}>
            <Text style={styles.addItemIcon}>＋</Text>
            <Text style={styles.addItemText}>新增品項</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>— 尚無品項 —</Text>
            <Text style={styles.emptySubText}>點擊下方按鈕新增</Text>
          </View>
        }
      />

      {/* Unit Picker - Bottom Sheet */}
      <Modal
        visible={unitPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUnitPickerVisible(false)}>
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setUnitPickerVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>選擇單位</Text>
            <View style={styles.unitGrid}>
              {UNIT_OPTIONS.map(unit => (
                <TouchableOpacity
                  key={unit}
                  style={styles.unitOption}
                  onPress={() => selectUnit(unit)}
                  activeOpacity={0.7}>
                  <Text style={styles.unitOptionText}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: BG,
  },
  list: {
    flex: 1,
  },
  listContent: {
    backgroundColor: SURFACE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },

  // Item Row
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 20,
    paddingRight: 16,
    backgroundColor: SURFACE,
    minHeight: 56,
  },
  itemRowActive: {
    backgroundColor: ACCENT_DIM,
    paddingLeft: 0,
  },
  activeBar: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: ACCENT,
    marginRight: 17,
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
  },

  // Item Info
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '400',
    color: TEXT2,
    letterSpacing: 0.2,
  },
  itemNameActive: {
    fontWeight: '600',
    color: TEXT1,
  },

  // Unit Selector
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE2,
  },
  unitText: {
    fontSize: 12,
    color: TEXT2,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  unitArrow: {
    fontSize: 9,
    color: TEXT2,
    marginLeft: 4,
  },

  // Quantity Controls
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(217,79,30,0.07)',
  },
  qtyBtnDisabled: {
    borderColor: BORDER,
    backgroundColor: SURFACE2,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '400',
    color: ACCENT,
    lineHeight: 18,
  },
  qtyBtnTextDisabled: {
    color: TEXT2,
  },
  qtyValue: {
    width: 30,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: TEXT2,
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  qtyValueActive: {
    color: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },

  // Delete (edit mode)
  deleteBtn: {
    marginLeft: 4,
    marginRight: 12,
  },
  deleteCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DANGER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },

  // Add Item Button
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
    gap: 6,
  },
  addItemIcon: {
    fontSize: 14,
    color: ACCENT,
  },
  addItemText: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 15,
    color: TEXT2,
    fontWeight: '400',
    letterSpacing: 2,
  },
  emptySubText: {
    fontSize: 12,
    color: TEXT2,
    marginTop: 6,
    opacity: 0.6,
  },

  // Unit Picker - Bottom Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT2,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  unitOption: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: SURFACE2,
    borderWidth: 1,
    borderColor: BORDER,
  },
  unitOptionText: {
    fontSize: 14,
    color: TEXT1,
    fontWeight: '500',
  },
});

export default ItemList;

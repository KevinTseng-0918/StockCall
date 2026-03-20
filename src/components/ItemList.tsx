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
        {isEditMode && (
          <TouchableOpacity
            style={styles.deleteItemBtn}
            onPress={() => onDeleteItem(item.id)}
            activeOpacity={0.6}>
            <Text style={styles.deleteItemText}>✕</Text>
          </TouchableOpacity>
        )}

        {isActive && !isEditMode && <View style={styles.activeBar} />}

        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, isActive && styles.itemNameActive]}>
            {item.name}
          </Text>
          <TouchableOpacity
            style={styles.unitSelector}
            onPress={() => openUnitPicker(item.id)}
            activeOpacity={0.6}>
            <Text style={styles.unitText}>{item.unit}</Text>
            <Text style={styles.unitArrow}>▾</Text>
          </TouchableOpacity>
        </View>

        {!isEditMode && (
          <View style={styles.quantityControl}>
            <TouchableOpacity
              style={[
                styles.qtyButton,
                item.quantity === 0 && styles.qtyButtonDisabled,
              ]}
              onPress={() => onUpdateQuantity(item.id, -1)}
              activeOpacity={0.6}
              disabled={item.quantity === 0}>
              <Text
                style={[
                  styles.qtyButtonText,
                  item.quantity === 0 && styles.qtyButtonTextDisabled,
                ]}>
                −
              </Text>
            </TouchableOpacity>
            <Text style={[styles.qtyValue, isActive && styles.qtyValueActive]}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              style={[
                styles.qtyButton,
                item.quantity >= MAX_QUANTITY && styles.qtyButtonDisabled,
              ]}
              onPress={() => onUpdateQuantity(item.id, 1)}
              activeOpacity={0.6}
              disabled={item.quantity >= MAX_QUANTITY}>
              <Text
                style={[
                  styles.qtyButtonText,
                  item.quantity >= MAX_QUANTITY && styles.qtyButtonTextDisabled,
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
            activeOpacity={0.6}>
            <Text style={styles.addItemIcon}>＋</Text>
            <Text style={styles.addItemText}>新增品項</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>尚無品項</Text>
            <Text style={styles.emptySubText}>點擊下方按鈕新增</Text>
          </View>
        }
      />

      {/* Unit Picker Modal */}
      <Modal
        visible={unitPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUnitPickerVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setUnitPickerVisible(false)}>
          <View style={styles.unitPickerContainer}>
            <Text style={styles.unitPickerTitle}>選擇單位</Text>
            <View style={styles.unitGrid}>
              {UNIT_OPTIONS.map(unit => (
                <TouchableOpacity
                  key={unit}
                  style={styles.unitOption}
                  onPress={() => selectUnit(unit)}
                  activeOpacity={0.6}>
                  <Text style={styles.unitOptionText}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Item Row
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  itemRowActive: {
    backgroundColor: '#FDF8F6',
    paddingLeft: 16,
  },
  activeBar: {
    width: 3,
    height: 28,
    backgroundColor: '#C53D2D',
    borderRadius: 2,
    marginRight: 12,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E8E4E0',
  },

  // Item Info
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2D2D2D',
    lineHeight: 22,
  },
  itemNameActive: {
    fontWeight: '500',
  },

  // Unit Selector
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F3F0',
  },
  unitText: {
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '500',
  },
  unitArrow: {
    fontSize: 10,
    color: '#8B7355',
    marginLeft: 3,
  },

  // Quantity Control
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4CFC9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyButtonDisabled: {
    borderColor: '#EDEBE8',
    backgroundColor: '#FAF8F5',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '300',
    color: '#2D2D2D',
    lineHeight: 20,
  },
  qtyButtonTextDisabled: {
    color: '#D4CFC9',
  },
  qtyValue: {
    width: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#BFBFBF',
  },
  qtyValueActive: {
    fontWeight: '600',
    color: '#C53D2D',
  },

  // Delete Button (edit mode)
  deleteItemBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FADBD8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deleteItemText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C53D2D',
    lineHeight: 13,
  },

  // Add Item Button
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E4E0',
  },
  addItemIcon: {
    fontSize: 14,
    color: '#8B7355',
    marginRight: 6,
  },
  addItemText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#BFBFBF',
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 13,
    color: '#D4CFC9',
    marginTop: 4,
  },

  // Unit Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitPickerContainer: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  unitPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 16,
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
    borderRadius: 20,
    backgroundColor: '#F5F3F0',
  },
  unitOptionText: {
    fontSize: 15,
    color: '#2D2D2D',
    fontWeight: '500',
  },
});

export default ItemList;

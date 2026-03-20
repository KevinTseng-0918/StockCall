import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Clipboard = require('react-native/Libraries/Components/Clipboard/Clipboard').default;
import {Category} from './src/types';
import {DEFAULT_CATEGORIES, MAX_QUANTITY} from './src/constants';
import {saveCategories, loadCategories} from './src/storage';
import CategoryTabs from './src/components/CategoryTabs';
import ItemList from './src/components/ItemList';
import EditModal from './src/components/EditModal';

const App = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    DEFAULT_CATEGORIES[0].id,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'category' | 'item'>('category');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    (async () => {
      const saved = await loadCategories();
      if (saved && saved.length > 0) {
        setCategories(saved);
        setActiveCategoryId(saved[0].id);
      }
      setIsLoaded(true);
    })();
  }, []);

  // Auto-save when categories change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveCategories(categories);
    }
  }, [categories, isLoaded]);

  const activeCategory = useMemo(
    () => categories.find(c => c.id === activeCategoryId),
    [categories, activeCategoryId],
  );

  // Count all selected items across all categories
  const totalSelectedCount = useMemo(() => {
    let count = 0;
    for (const cat of categories) {
      for (const item of cat.items) {
        if (item.quantity > 0) {
          count++;
        }
      }
    }
    return count;
  }, [categories]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  // ─── Category Actions ───

  const handleSelectCategory = useCallback((id: string) => {
    setActiveCategoryId(id);
  }, []);

  const handleAddCategory = useCallback(() => {
    setModalMode('category');
    setModalVisible(true);
  }, []);

  const handleDeleteCategory = useCallback(
    (id: string) => {
      const cat = categories.find(c => c.id === id);
      Alert.alert('刪除類別', `確定要刪除「${cat?.name}」嗎？`, [
        {text: '取消', style: 'cancel'},
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => {
            setCategories(prev => {
              const next = prev.filter(c => c.id !== id);
              if (activeCategoryId === id && next.length > 0) {
                setActiveCategoryId(next[0].id);
              }
              return next;
            });
          },
        },
      ]);
    },
    [categories, activeCategoryId],
  );

  // ─── Item Actions ───

  const handleAddItem = useCallback(() => {
    setModalMode('item');
    setModalVisible(true);
  }, []);

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      setCategories(prev =>
        prev.map(cat => {
          if (cat.id !== activeCategoryId) return cat;
          return {...cat, items: cat.items.filter(i => i.id !== itemId)};
        }),
      );
    },
    [activeCategoryId],
  );

  const handleUpdateQuantity = useCallback(
    (itemId: string, delta: number) => {
      setCategories(prev =>
        prev.map(cat => {
          if (cat.id !== activeCategoryId) return cat;
          return {
            ...cat,
            items: cat.items.map(item => {
              if (item.id !== itemId) return item;
              const next = item.quantity + delta;
              if (next < 0 || next > MAX_QUANTITY) return item;
              return {...item, quantity: next};
            }),
          };
        }),
      );
    },
    [activeCategoryId],
  );

  const handleUpdateUnit = useCallback(
    (itemId: string, unit: string) => {
      setCategories(prev =>
        prev.map(cat => {
          if (cat.id !== activeCategoryId) return cat;
          return {
            ...cat,
            items: cat.items.map(item => {
              if (item.id !== itemId) return item;
              return {...item, unit};
            }),
          };
        }),
      );
    },
    [activeCategoryId],
  );

  // ─── Modal Submit ───

  const handleModalSubmit = useCallback(
    (name: string, unit?: string) => {
      if (modalMode === 'category') {
        const newCat: Category = {
          id: generateId(),
          name,
          items: [],
        };
        setCategories(prev => [...prev, newCat]);
        setActiveCategoryId(newCat.id);
      } else {
        setCategories(prev =>
          prev.map(cat => {
            if (cat.id !== activeCategoryId) return cat;
            return {
              ...cat,
              items: [
                ...cat.items,
                {
                  id: generateId(),
                  name,
                  unit: unit || '份',
                  quantity: 0,
                },
              ],
            };
          }),
        );
      }
      setModalVisible(false);
    },
    [modalMode, activeCategoryId],
  );

  // ─── Order Actions ───

  const generateOrderText = () => {
    const selected: {name: string; quantity: number; unit: string}[] = [];
    for (const cat of categories) {
      for (const item of cat.items) {
        if (item.quantity > 0) {
          selected.push({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
          });
        }
      }
    }

    if (selected.length === 0) {
      Alert.alert('提醒', '請先選擇品項');
      return;
    }

    const lines = selected
      .map(s => `${s.name} x${s.quantity} ${s.unit}`)
      .join('\n');

    const text = `叫菜單\n${'─'.repeat(16)}\n${lines}\n${'─'.repeat(16)}\n共 ${selected.length} 項`;

    Clipboard.setString(text);
    Alert.alert('已複製', '叫菜內容已複製到剪貼簿，可直接貼到 LINE 傳送');
  };

  const resetOrder = () => {
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        items: cat.items.map(item => ({...item, quantity: 0})),
      })),
    );
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>載入中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>お弁当</Text>
        <Text style={styles.headerTitle}>叫菜便利貼</Text>
        <View style={styles.headerLine} />
      </View>

      {/* Edit Mode Toggle */}
      <View style={styles.editToggleRow}>
        <TouchableOpacity
          style={[styles.editToggle, isEditMode && styles.editToggleActive]}
          onPress={() => setIsEditMode(!isEditMode)}
          activeOpacity={0.6}>
          <Text
            style={[
              styles.editToggleText,
              isEditMode && styles.editToggleTextActive,
            ]}>
            {isEditMode ? '完成編輯' : '編輯'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        isEditMode={isEditMode}
        onSelect={handleSelectCategory}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Item List */}
      {activeCategory && (
        <ItemList
          items={activeCategory.items}
          isEditMode={isEditMode}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdateUnit={handleUpdateUnit}
          onDeleteItem={handleDeleteItem}
          onAddItem={handleAddItem}
        />
      )}

      {categories.length === 0 && (
        <View style={styles.emptyCategoryContainer}>
          <Text style={styles.emptyCategoryText}>尚無類別</Text>
          <Text style={styles.emptyCategorySubText}>
            請點擊上方「＋」新增類別
          </Text>
        </View>
      )}

      {/* Footer */}
      {!isEditMode && (
        <View style={styles.footer}>
          {totalSelectedCount > 0 && (
            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                已選 {totalSelectedCount} 項
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                totalSelectedCount === 0 && styles.primaryButtonDisabled,
              ]}
              onPress={generateOrderText}
              activeOpacity={0.7}
              disabled={totalSelectedCount === 0}>
              <Text
                style={[
                  styles.primaryButtonText,
                  totalSelectedCount === 0 && styles.primaryButtonTextDisabled,
                ]}>
                複製叫菜單
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetOrder}
              activeOpacity={0.6}>
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Add Modal */}
      <EditModal
        visible={modalVisible}
        mode={modalMode}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8C8C8C',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8B7355',
    letterSpacing: 4,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2D2D2D',
    letterSpacing: 2,
  },
  headerLine: {
    width: 40,
    height: 2,
    backgroundColor: '#C53D2D',
    marginTop: 12,
    borderRadius: 1,
  },

  // Edit Toggle
  editToggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  editToggle: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4CFC9',
  },
  editToggleActive: {
    backgroundColor: '#C53D2D',
    borderColor: '#C53D2D',
  },
  editToggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8C8C8C',
  },
  editToggleTextActive: {
    color: '#FFFFFF',
  },

  // Empty Category
  emptyCategoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCategoryText: {
    fontSize: 18,
    color: '#BFBFBF',
    fontWeight: '500',
  },
  emptyCategorySubText: {
    fontSize: 14,
    color: '#D4CFC9',
    marginTop: 6,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#FAF8F5',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B7355',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#C53D2D',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#E8E4E0',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryButtonTextDisabled: {
    color: '#BFBFBF',
  },
  resetButton: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4CFC9',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  resetButtonText: {
    color: '#8C8C8C',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default App;

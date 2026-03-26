import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Clipboard = require('react-native/Libraries/Components/Clipboard/Clipboard').default;
import {Category} from './src/types';
import {DEFAULT_CATEGORIES, MAX_QUANTITY} from './src/constants';
import {saveCategories, loadCategories} from './src/storage';
import CategoryTabs from './src/components/CategoryTabs';
import ItemList from './src/components/ItemList';
import EditModal from './src/components/EditModal';
import OrderPreviewModal from './src/components/OrderPreviewModal';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const BG = '#FFF8F0';
const SURFACE = '#FFFFFF';
const TEXT1 = '#1A0A02';
const TEXT2 = '#9B6B44';
const ACCENT = '#D94F1E';
const RED = '#DC2626';
const BORDER = '#F0D0B8';

const App = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    DEFAULT_CATEGORIES[0].id,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'category' | 'item'>('category');
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewText, setPreviewText] = useState('');

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

  useEffect(() => {
    if (isLoaded) {
      saveCategories(categories);
    }
  }, [categories, isLoaded]);

  const activeCategory = useMemo(
    () => categories.find(c => c.id === activeCategoryId),
    [categories, activeCategoryId],
  );

  const totalSelectedCount = useMemo(() => {
    let count = 0;
    for (const cat of categories) {
      for (const item of cat.items) {
        if (item.quantity > 0) count++;
      }
    }
    return count;
  }, [categories]);

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const buildOrderText = (): string | null => {
    const selected: {name: string; quantity: number; unit: string}[] = [];
    for (const cat of categories) {
      for (const item of cat.items) {
        if (item.quantity > 0) {
          selected.push({name: item.name, quantity: item.quantity, unit: item.unit});
        }
      }
    }
    if (selected.length === 0) return null;
    const lines = selected.map(s => `${s.name}  ×${s.quantity} ${s.unit}`).join('\n');
    return `叫菜單\n${'─'.repeat(16)}\n${lines}\n${'─'.repeat(16)}\n共 ${selected.length} 項`;
  };

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

  const handleModalSubmit = useCallback(
    (name: string, unit?: string) => {
      if (modalMode === 'category') {
        const newCat: Category = {id: generateId(), name, items: []};
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
                {id: generateId(), name, unit: unit || '份', quantity: 0},
              ],
            };
          }),
        );
      }
      setModalVisible(false);
    },
    [modalMode, activeCategoryId],
  );

  // Opens the preview modal with generated order text
  const handleGenerate = () => {
    const text = buildOrderText();
    if (!text) {
      Alert.alert('提醒', '請先選擇品項');
      return;
    }
    setPreviewText(text);
    setPreviewVisible(true);
  };

  // Quick copy without opening modal
  const handleQuickCopy = () => {
    const text = buildOrderText();
    if (!text) {
      Alert.alert('提醒', '請先選擇品項');
      return;
    }
    Clipboard.setString(text);
    Alert.alert('已複製', '叫菜內容已複製到剪貼簿');
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
          <Text style={styles.loadingText}>✦  載入中  ✦</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={BG} barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopLine} />
        <View style={styles.headerContent}>
          <View style={styles.brand}>
            <Text style={styles.headerDeco}>✦</Text>
            <Text style={styles.headerTitle}>叫菜便利貼</Text>
            <Text style={styles.headerDeco}>✦</Text>
          </View>
          <TouchableOpacity
            style={[styles.editBtn, isEditMode && styles.editBtnActive]}
            onPress={() => setIsEditMode(!isEditMode)}
            activeOpacity={0.7}>
            <Text style={[styles.editBtnText, isEditMode && styles.editBtnTextActive]}>
              {isEditMode ? '完成' : '編輯'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerBottomLine} />
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
          <Text style={styles.emptyCategoryText}>— 尚無類別 —</Text>
          <Text style={styles.emptyCategorySubText}>點擊上方「＋」新增類別</Text>
        </View>
      )}

      {/* Footer */}
      {!isEditMode && (
        <View style={styles.footer}>
          {totalSelectedCount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>已選取</Text>
              <Text style={styles.summaryCount}>{totalSelectedCount} 項</Text>
            </View>
          )}
          <View style={styles.buttonRow}>
            {/* Generate icon button */}
            <TouchableOpacity
              style={[
                styles.iconActionBtn,
                totalSelectedCount === 0 && styles.iconActionBtnDisabled,
              ]}
              onPress={handleGenerate}
              activeOpacity={0.75}
              disabled={totalSelectedCount === 0}>
              <Text
                style={[
                  styles.iconActionSymbol,
                  totalSelectedCount === 0 && styles.iconActionSymbolDisabled,
                ]}>
                ✎
              </Text>
              <Text
                style={[
                  styles.iconActionLabel,
                  totalSelectedCount === 0 && styles.iconActionLabelDisabled,
                ]}>
                產生
              </Text>
            </TouchableOpacity>

            {/* Copy icon button */}
            <TouchableOpacity
              style={[
                styles.iconActionBtn,
                totalSelectedCount === 0 && styles.iconActionBtnDisabled,
              ]}
              onPress={handleQuickCopy}
              activeOpacity={0.75}
              disabled={totalSelectedCount === 0}>
              <Text
                style={[
                  styles.iconActionSymbol,
                  totalSelectedCount === 0 && styles.iconActionSymbolDisabled,
                ]}>
                ⧉
              </Text>
              <Text
                style={[
                  styles.iconActionLabel,
                  totalSelectedCount === 0 && styles.iconActionLabelDisabled,
                ]}>
                複製
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.btnDivider} />

            {/* Reset button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetOrder}
              activeOpacity={0.7}>
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modals */}
      <EditModal
        visible={modalVisible}
        mode={modalMode}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
      />

      <OrderPreviewModal
        visible={previewVisible}
        initialText={previewText}
        onClose={() => setPreviewVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: ACCENT,
    letterSpacing: 4,
    fontWeight: '300',
  },

  // Header
  header: {
    backgroundColor: BG,
  },
  headerTopLine: {
    height: 3,
    backgroundColor: ACCENT,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerBottomLine: {
    height: 1,
    backgroundColor: BORDER,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerDeco: {
    fontSize: 11,
    color: ACCENT,
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT1,
    letterSpacing: 2,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: ACCENT,
  },
  editBtnActive: {
    backgroundColor: ACCENT,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT,
    letterSpacing: 0.5,
  },
  editBtnTextActive: {
    color: BG,
  },

  // Empty Category
  emptyCategoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCategoryText: {
    fontSize: 16,
    color: TEXT2,
    fontWeight: '400',
    letterSpacing: 2,
  },
  emptyCategorySubText: {
    fontSize: 13,
    color: TEXT2,
    marginTop: 8,
    opacity: 0.6,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: SURFACE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: TEXT2,
    letterSpacing: 1.5,
  },
  summaryCount: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Icon action buttons (generate / copy)
  iconActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: 'rgba(217,79,30,0.07)',
    gap: 3,
  },
  iconActionBtnDisabled: {
    borderColor: BORDER,
    backgroundColor: 'transparent',
  },
  iconActionSymbol: {
    fontSize: 20,
    color: ACCENT,
    lineHeight: 24,
  },
  iconActionSymbolDisabled: {
    color: TEXT2,
  },
  iconActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ACCENT,
    letterSpacing: 0.5,
  },
  iconActionLabelDisabled: {
    color: TEXT2,
  },

  // Divider between icon buttons and reset
  btnDivider: {
    flex: 1,
  },

  // Reset button
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  resetButtonText: {
    color: TEXT2,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default App;

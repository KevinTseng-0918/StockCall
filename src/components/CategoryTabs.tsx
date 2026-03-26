import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Category} from '../types';

interface Props {
  categories: Category[];
  activeCategoryId: string;
  isEditMode: boolean;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

// ─── Design Tokens ───────────────────────────────────────────────────────────
const BG = '#FFF8F0';
const SURFACE2 = '#FFF3E8';
const TEXT1 = '#1A0A02';
const TEXT2 = '#9B6B44';
const ACCENT = '#D94F1E';
const DANGER = '#DC2626';
const BORDER = '#F0D0B8';

const CategoryTabs: React.FC<Props> = ({
  categories,
  activeCategoryId,
  isEditMode,
  onSelect,
  onAdd,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          return (
            <View key={cat.id} style={styles.tabWrapper}>
              <TouchableOpacity
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => onSelect(cat.id)}
                activeOpacity={0.7}>
                {isActive && <View style={styles.activeGlow} />}
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
              {isEditMode && (
                <TouchableOpacity
                  style={styles.deleteBadge}
                  onPress={() => onDelete(cat.id)}
                  activeOpacity={0.7}>
                  <Text style={styles.deleteBadgeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.addTab}
          onPress={onAdd}
          activeOpacity={0.6}>
          <Text style={styles.addTabText}>＋</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: BG,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 16,
  },
  tabWrapper: {
    position: 'relative',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: SURFACE2,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  tabActive: {
    backgroundColor: 'rgba(217,79,30,0.10)',
    borderColor: ACCENT,
  },
  activeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(217,79,30,0.05)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT2,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: ACCENT,
    fontWeight: '600',
  },
  deleteBadge: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DANGER,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BG,
  },
  deleteBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
  addTab: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SURFACE2,
  },
  addTabText: {
    fontSize: 16,
    color: TEXT2,
    lineHeight: 18,
  },
});

export default CategoryTabs;

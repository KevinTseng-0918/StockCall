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
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
              {isEditMode && (
                <TouchableOpacity
                  style={styles.deleteBadge}
                  onPress={() => onDelete(cat.id)}
                  activeOpacity={0.6}>
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
    marginBottom: 12,
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
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4E0',
  },
  tabActive: {
    backgroundColor: '#C53D2D',
    borderColor: '#C53D2D',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8C8C8C',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  addTab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D4CFC9',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addTabText: {
    fontSize: 16,
    color: '#8C8C8C',
    lineHeight: 18,
  },
});

export default CategoryTabs;

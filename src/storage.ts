import AsyncStorage from '@react-native-async-storage/async-storage';
import {Category} from './types';

const STORAGE_KEY = '@BentoTap_categories';

export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

export const loadCategories = async (): Promise<Category[] | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as Category[];
    }
    return null;
  } catch (e) {
    console.error('Failed to load categories', e);
    return null;
  }
};

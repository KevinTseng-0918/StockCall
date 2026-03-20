import {Category} from './types';

export const UNIT_OPTIONS = [
  '份',
  '個',
  '斤',
  '包',
  '箱',
  '把',
  '條',
  '塊',
  '瓶',
  '罐',
  '袋',
  '盒',
  '顆',
  '片',
  '碗',
];

export const MAX_QUANTITY = 20;

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: '蔬菜',
    items: [
      {id: '1-1', name: '高麗菜', unit: '斤', quantity: 0},
      {id: '1-2', name: '空心菜', unit: '把', quantity: 0},
      {id: '1-3', name: '青江菜', unit: '把', quantity: 0},
    ],
  },
  {
    id: '2',
    name: '肉類',
    items: [
      {id: '2-1', name: '豬五花', unit: '斤', quantity: 0},
      {id: '2-2', name: '雞腿', unit: '份', quantity: 0},
      {id: '2-3', name: '排骨', unit: '斤', quantity: 0},
    ],
  },
  {
    id: '3',
    name: '其他',
    items: [
      {id: '3-1', name: '雞蛋', unit: '盒', quantity: 0},
      {id: '3-2', name: '豆腐', unit: '盒', quantity: 0},
    ],
  },
];

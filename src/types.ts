export interface MenuItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

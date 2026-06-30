// TypeScript interfaces and types
export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  createdAt: number;
}

export interface Product {
  id: number;
  userId: number;
  name: string;
  createdAt: number;
}

export interface productPhoto {
  id: number;
  productId: number;
  path: string;
  createdAt: number;
}

export interface SwapOrder {
  id: number;
  createdAt: number;
  products?: Product[];
  users?: User[];
}

export interface SwapOrderFilters {
  startDate?: string;
  endDate?: string;
  productId?: number;
  userId?: number;
}

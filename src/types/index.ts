// TypeScript interfaces and types
export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  createdAt: number;
}

export type UserInput = Omit<User, "id" | "createdAt">;

export interface Product {
  id: number;
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

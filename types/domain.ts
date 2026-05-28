// types/domain/shared.ts

export type ID = number;

export interface Style {
  color?: string | null;
}

export interface CategoryStyle extends Style {
  icon?: string | null;
  image?: string | null;
  bgColor?: string | null;
  accentColor?: string | null;
  secondaryButtonColor?: string | null;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Category {
  id: ID;
  name: string;
  style: CategoryStyle | null;
  description?: string;
}

export type TransactionType = "income" | "exponse";

export interface Vendor {
  id: ID;
  name: string;
  style: CategoryStyle | null;
  description?: string;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  totalValue: number;

  preferredCurrency?: Currency;

  assets?: AssetSummary[];
}

export interface AssetSummary {
  id: ID;
  name: string;
  value: number;
  currency: string;

  categoryName?: string;
  vendorName?: string;
}

export interface Asset {
  id: ID;
  name: string;
  value: number;

  currency: Currency | string;

  description?: string;

  user: Pick<User, "id" | "name">;
  category: Category;
  vendor: Vendor;
}

export interface TransactionSummary {
  id: ID;
  name: string;
  amount: number;

  type: TransactionType;

  date: string;

  categoryName?: string;
  categoryId?: ID;
}

export interface Transaction extends TransactionSummary {
  assetId?: ID;
  assetName?: string;
}

export interface TransactionCategory extends Category {
  transactions?: TransactionSummary[];
}

export interface AssetVendor extends Vendor {
  assets?: AssetSummary[];
}

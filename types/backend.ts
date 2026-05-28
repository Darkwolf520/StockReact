import { TransactionType } from "./domain";
export interface StyleDTO {
  color?: string | null;
}

export interface CategoryStyleDTO extends StyleDTO {
  icon?: string | null;
  image?: string | null;
  bgColor?: string | null;
  accentColor?: string | null;
  secondaryButtonColor?: string | null;
}

export interface CurrencyDTO {
  code: string;
  name: string;
  symbol: string;
}

export interface UserShortDTO {
  id: number;
  name: string;
}

export interface AssetIndexDTO {
  id: number;
  name: string;
  value: number;
  currency: string;
  description: string;

  user: UserShortDTO;

  category: {
    id: number;
    name: string;
    style: CategoryStyleDTO | null;
    description: string;
  };

  vendor: {
    id: number;
    name: string;
    style: CategoryStyleDTO | null;
    description: string;
  };
}

export type AssetsIndexResponse = AssetIndexDTO[];

export interface AssetShowDTO {
  id: number;
  name: string;
  value: number;
  currency: CurrencyDTO;
  description: string;

  user: UserShortDTO;

  assetCategory: {
    id: number;
    name: string;
    style: CategoryStyleDTO | null;
    description: string;
  };

  assetVendor: {
    id: number;
    name: string;
    style: CategoryStyleDTO | null;
    description: string;
  };
}

export interface AssetCategoryDTO {
  id: number;
  name: string;
  style: CategoryStyleDTO | null;
  description: string;
}

export type AssetCategoryIndexResponse = AssetCategoryDTO[];

export type AssetCategoryShowDTO = AssetCategoryDTO;

export interface AssetVendorDTO {
  id: number;
  name: string;
  style: CategoryStyleDTO | null;
  description: string;
}

export type AssetVendorIndexResponse = AssetVendorDTO[];

export interface VendorAssetDTO {
  id: number;
  name: string;
  value: number;
  currency: string;
  categoryName: string;
  vendorName: string;
}

export interface AssetVendorShowDTO extends AssetVendorDTO {
  assets: VendorAssetDTO[];
}

export interface TransactionCategoryDTO {
  id: number;
  name: string;
  style: CategoryStyleDTO | null;
  description: string;
}

export type TransactionCategoryIndexResponse = TransactionCategoryDTO[];

export interface TransactionInCategoryDTO {
  id: number;
  name: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface TransactionCategoryShowDTO extends TransactionCategoryDTO {
  transactions: TransactionInCategoryDTO[];
}

export interface TransactionIndexDTO {
  id: number;
  name: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryName: string;
}

export type TransactionIndexResponse = TransactionIndexDTO[];

export interface TransactionShowDTO {
  id: number;
  name: string;
  amount: number;
  type: TransactionType;
  date: string;

  assetId: number;
  assetName: string;

  categoryName: string;
}

export interface UserIndexDTO {
  id: number;
  name: string;
  email: string;
  totalValue: number;
  preferredCurrency: string;
}

export type UserIndexResponse = UserIndexDTO[];

export interface UserAssetDTO {
  id: number;
  name: string;
  value: number;
  currency: string;
  categoryName: string;
  vendorName: string;
}

export interface UserShowDTO {
  id: number;
  name: string;
  email: string;
  totalValue: number;

  preferredCurrency: CurrencyDTO;

  assets: UserAssetDTO[];
}

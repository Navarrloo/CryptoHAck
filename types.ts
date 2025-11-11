import type React from 'react';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  // FIX: Cannot find namespace 'JSX'. Changed type to React.ReactNode.
  icon: React.ReactNode;
  balance: number;
  usdValue: number;
  price?: number;
}

export interface NavItem {
    name: string;
    // FIX: Cannot find namespace 'JSX'. Changed type to React.ReactNode.
    icon: React.ReactNode;
}

export type TransactionType = 'send' | 'receive' | 'swap' | 'buy' | 'admin_add' | 'admin_subtract' | 'withdraw';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  assetSymbol: string;
  amount: number;
  usdValue: number;
  date: string;
  from: string;
  to: string;
}

export interface DBUser {
    id: string; // This is the UUID from Supabase
    telegram_id: number;
    username?: string;
    first_name?: string;
}

export interface DiscoverAsset {
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number; // percentage
  marketCap: number;
}
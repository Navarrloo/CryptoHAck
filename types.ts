import type React from 'react';

export type Page = 'Wallet' | 'Discover' | 'Activity' | 'Settings' | 'Send' | 'Admin' | 'Withdraw' | 'GeneralSettings' | 'SecuritySettings' | 'NetworkSettings' | 'ContactsSettings';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  balance: number;
  usdValue: number;
  price?: number;
}

export interface NavItem {
    name: string;
    icon: React.ReactNode;
}

export type TransactionType = 'send' | 'receive' | 'swap' | 'buy' | 'admin_add' | 'admin_subtract' | 'withdraw';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  asset_symbol: string;
  amount: number;
  usd_value: number;
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
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import type { Asset, Transaction, DBUser, DiscoverAsset, Page } from './types';
import { BtcIcon, EthereumIcon, TetherIcon, WalletIcon, CompassIcon, ClockIcon, SettingsIcon } from './components/Icons';
import WalletView from './components/WalletView';
import ActionView from './components/ActionView';
import SettingsView from './components/SettingsView';
import AdminPanelView from './components/AdminPanelView';
import ActivityView from './components/ActivityView';
import DiscoverView from './components/DiscoverView';
import Toast from './components/Toast';
import GeneralSettingsView from './components/GeneralSettingsView';
import SecuritySettingsView from './components/SecuritySettingsView';
import NetworkSettingsView from './components/NetworkSettingsView';
import ContactsSettingsView from './components/ContactsSettingsView';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from './lib/supabase';

// Add type definition for window.Telegram to fix TypeScript errors.
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

const baseAssets: Omit<Asset, 'balance' | 'usdValue'>[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: <BtcIcon /> },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: <EthereumIcon /> },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: <TetherIcon />, price: 1.0 },
];


async function fetchAssetPrices(symbols: string[]): Promise<Record<string, number>> {
    if (!process.env.API_KEY) {
        console.warn("API_KEY is not set. Returning mock prices.");
        return {
            'BTC': 68123.45, 'ETH': 3789.12, 'USDT': 1.0,
        };
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const properties: Record<string, { type: Type, description: string }> = {};
    symbols.filter(s => !['USDT'].includes(s)).forEach(symbol => { // Don't ask for stablecoin price
        properties[symbol] = { type: Type.NUMBER, description: `The current price of ${symbol} in USD.` };
    });

    if (Object.keys(properties).length === 0) {
        return { USDT: 1.0 };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `What are the current prices in USD for the following cryptocurrencies: ${Object.keys(properties).join(', ')}?`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: properties,
                },
            },
        });
        const result = JSON.parse(response.text);
        if (symbols.includes('USDT')) result['USDT'] = 1.0; // Add stablecoin price back
        return result;
    } catch (error) {
        console.error("Error fetching asset prices from Gemini API:", error);
        // Fallback for stablecoins if API fails
        const fallbackPrices: Record<string, number> = {};
        if (symbols.includes('USDT')) fallbackPrices['USDT'] = 1.0;
        return fallbackPrices;
    }
}

async function fetchTopCryptos(symbols: string[]): Promise<DiscoverAsset[]> {
    if (!process.env.API_KEY) {
        console.warn("API_KEY is not set. Returning mock discovery data.");
        return [
            { name: 'Bitcoin', symbol: 'BTC', price: 68123.45, priceChange24h: 1.5, marketCap: 1340000000000 },
            { name: 'Ethereum', symbol: 'ETH', price: 3789.12, priceChange24h: -0.5, marketCap: 455000000000 },
            { name: 'Tether', symbol: 'USDT', price: 1.0, priceChange24h: 0.0, marketCap: 112000000000 },
        ];
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `List the market data for these cryptocurrencies: ${symbols.join(', ')}. For each, provide its name, symbol, current price in USD, 24-hour percentage price change, and total market capitalization in USD.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            symbol: { type: Type.STRING },
                            price: { type: Type.NUMBER },
                            priceChange24h: { type: Type.NUMBER },
                            marketCap: { type: Type.NUMBER },
                        },
                        required: ['name', 'symbol', 'price', 'priceChange24h', 'marketCap'],
                    },
                },
            },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error fetching top cryptos from Gemini API:", error);
        return [];
    }
}

async function updatePrices(currentAssets: (Omit<Asset, 'usdValue'>)[]): Promise<Asset[]> {
    const symbolsToFetch = currentAssets.map(a => a.symbol);
    if (symbolsToFetch.length === 0) return currentAssets.map(a => ({...a, usdValue: 0}));
    
    const prices = await fetchAssetPrices(symbolsToFetch);

    return currentAssets.map(asset => {
        const price = prices[asset.symbol] || asset.price || 0;
        return {
            ...asset,
            price,
            usdValue: asset.balance * price,
        };
    });
};


const App: React.FC = () => {
  const [page, setPage] = useState<Page>('Wallet');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tg, setTg] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsersForAdmin, setAllUsersForAdmin] = useState<DBUser[]>([]);
  const [sendableUsers, setSendableUsers] = useState<DBUser[]>([]);
  const [discoverAssets, setDiscoverAssets] = useState<DiscoverAsset[]>([]);
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [balanceChange, setBalanceChange] = useState({ value: 3120.55, percentage: 5.2 });


  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const telegramUserId = useMemo(() => tg?.initDataUnsafe?.user?.id, [tg]);

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. Market data will be mocked.");
    }
    const telegramApp = window.Telegram?.WebApp;
    if (telegramApp) {
      telegramApp.ready();
      telegramApp.expand();
      setTg(telegramApp);
    } else {
        console.log("Not in Telegram context. Using mock data.");
        const setupMockData = async () => {
            setIsLoading(true);
            const mockAssetsWithBalance = baseAssets.map(asset => {
                let balance = 0;
                return { ...asset, balance: parseFloat(balance.toFixed(4)), usdValue: 0 };
            });
            
            const updatedAssets = await updatePrices(mockAssetsWithBalance);
            setAssets(updatedAssets);
            
            const mockTransactions: Transaction[] = [
                {
                  id: 'tx1', user_id: 'mockuser', type: 'receive', asset_symbol: 'ETH',
                  amount: 0.5, usd_value: 0.5 * (updatedAssets.find(a=>a.symbol === 'ETH')?.price || 3000),
                  date: new Date(Date.now() - 86400000 * 2).toISOString(),
                  from: '0x123...abc', to: 'My Wallet',
                },
                {
                  id: 'tx2', user_id: 'mockuser', type: 'send', asset_symbol: 'USDT',
                  amount: 500, usd_value: 500,
                  date: new Date(Date.now() - 86400000 * 5).toISOString(),
                  from: 'My Wallet', to: '0x456...def',
                },
            ];
            setTransactions(mockTransactions);
            setIsLoading(false);
        };
        setupMockData();
    }
  }, []);
  
  // Load user data from Supabase or initialize new user
  useEffect(() => {
    if (!telegramUserId) {
        if (tg !== null) setIsLoading(false);
        return;
    };

    const setupUser = async () => {
        setIsLoading(true);

        // 1. Find user by telegram_id
        let { data: user, error: userError } = await supabase.from('users').select('*').eq('telegram_id', telegramUserId).single();

        if (userError && userError.code !== 'PGRST116') { // PGRST116: "exact one row not found"
             console.error('Error fetching user:', userError);
             setIsLoading(false);
             return;
        }

        // 2. If user doesn't exist, create them and their wallets
        if (!user) {
            console.log("Creating new user...");
            const { data: newUserArr, error: insertError } = await supabase.from('users').insert({
                telegram_id: telegramUserId,
                username: tg.initDataUnsafe.user.username,
                first_name: tg.initDataUnsafe.user.first_name,
            }).select();

            if (insertError || !newUserArr) {
                console.error('Error creating user:', insertError);
                setIsLoading(false);
                return;
            }
            user = newUserArr[0];
            
            const initialWallets = baseAssets.map(asset => ({
                user_id: user.id,
                asset_symbol: asset.symbol,
                balance: 0,
            }));
            const { error: walletInsertError } = await supabase.from('wallets').insert(initialWallets);
            if (walletInsertError) console.error('Error creating wallets:', walletInsertError);
        }
        
        setCurrentUser(user);

        // Fetch ALL users for send functionality and admin panel
        const { data: allUsersData, error: allUsersError } = await supabase.from('users').select('id, telegram_id, username, first_name');
        if (allUsersError) {
            console.error("Failed to fetch all users:", allUsersError);
        } else {
            setAllUsersForAdmin(allUsersData);
            setSendableUsers(allUsersData.filter(u => u.id !== user.id));
        }

        // 3. Fetch user's wallets and transactions
        const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('asset_symbol, balance')
            .eq('user_id', user.id);

        if (walletError) console.error('Error fetching wallets:', walletError);

        const { data: transactionData, error: transactionError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (transactionError) console.error('Error fetching transactions:', transactionError);
        
        const userAssets = baseAssets.map(baseAsset => {
            const walletInfo = walletData?.find(w => w.asset_symbol === baseAsset.symbol);
            const balance = walletInfo?.balance || 0;

            return {
                ...baseAsset,
                balance,
                usdValue: 0, // will be calculated next
            };
        });

        const updatedAssetsWithPrices = await updatePrices(userAssets);
        setAssets(updatedAssetsWithPrices);
        setTransactions((transactionData as Transaction[]) || []);
        setIsLoading(false);
    };

    setupUser();
  }, [telegramUserId, tg]);


  const isAdmin = useMemo(() => {
    // In mock mode, grant admin rights for testing.
    if (!tg) return true;
    const adminUsernames = ['navarrlo', 'jhondavehariss'];
    const currentUsername = tg?.initDataUnsafe?.user?.username?.toLowerCase();
    return !!currentUsername && adminUsernames.includes(currentUsername);
  }, [tg]);
  
  const totalBalance = useMemo(() => assets.reduce((acc, asset) => acc + (asset.usdValue || 0), 0), [assets]);
  
  useEffect(() => {
    if (totalBalance > 0 && !isLoading) {
        // Simulate a 24h change between -10% and +10%
        const percentage = (Math.random() * 20) - 10;
        const value = totalBalance * (percentage / 100);
        setBalanceChange({ value, percentage });
    }
  }, [totalBalance, isLoading]);


  const handleNavigation = useCallback(async (targetPage: Page) => {
    if (targetPage === 'Discover' && discoverAssets.length === 0) {
        setIsDiscoverLoading(true);
        try {
            const symbols = baseAssets.map(a => a.symbol);
            const topCryptos = await fetchTopCryptos(symbols);
            setDiscoverAssets(topCryptos);
        } catch (error) {
            console.error("Failed to fetch discover assets:", error);
        } finally {
            setIsDiscoverLoading(false);
        }
    }
    setPage(targetPage);
  }, [discoverAssets]);
  
  const handleBalanceChange = useCallback(async (targetUserId: string, symbol: string, amount: number, operation: 'add' | 'subtract') => {
    
    // 1. Get current balance
    const { data: wallet, error: fetchError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', targetUserId)
        .eq('asset_symbol', symbol)
        .single();
    
    if (fetchError || !wallet) {
        console.error("Error fetching wallet for update", fetchError);
        showToast(`Wallet for symbol ${symbol} not found.`, 'error');
        return false;
    }

    // 2. Calculate new balance and update
    const newBalance = operation === 'add' ? wallet.balance + amount : wallet.balance - amount;
    if (newBalance < 0) {
        showToast("Operation results in a negative balance.", 'error');
        return false;
    }
    const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', targetUserId)
        .eq('asset_symbol', symbol);

    if (updateError) {
        console.error("Error updating balance", updateError);
        showToast("Failed to update balance.", 'error');
        return false;
    }

    // 3. Log the transaction
    const targetUser = allUsersForAdmin.find(u => u.id === targetUserId);
    const assetPrice = assets.find(a => a.symbol === symbol)?.price || 0;
    
    const newTransaction: Omit<Transaction, 'id' | 'date'> = {
        user_id: targetUserId,
        type: operation === 'add' ? 'admin_add' : 'admin_subtract',
        asset_symbol: symbol,
        amount: amount,
        usd_value: amount * assetPrice,
        from: 'Admin',
        to: targetUser?.username || 'user',
    };
    
    const { error: txError } = await supabase.from('transactions').insert(newTransaction);
    if (txError) console.error("Error logging transaction", txError);
    
    // If the admin modified their own balance, update local state
    if (currentUser && targetUserId === currentUser.id) {
         setAssets(currentAssets => {
            return currentAssets.map(asset => {
                if (asset.symbol === symbol) {
                    return { ...asset, balance: newBalance, usdValue: newBalance * assetPrice };
                }
                return asset;
            });
        });
        // Add to local transactions to show immediately
        setTransactions(prev => [{ ...newTransaction, id: new Date().toISOString(), date: new Date().toISOString() }, ...prev]);
    }
    return true;
  }, [assets, currentUser, allUsersForAdmin]);

  const handleSend = useCallback(async (recipientId: string, symbol: string, amount: number) => {
    if (!currentUser) {
        showToast("Error: Not logged in.", 'error');
        return;
    }

    // 1. Get sender and receiver wallets
    const { data: wallets, error: fetchError } = await supabase
        .from('wallets')
        .select('user_id, balance')
        .in('user_id', [currentUser.id, recipientId])
        .eq('asset_symbol', symbol);
    
    if (fetchError || wallets?.length !== 2) {
        console.error("Error fetching wallets for transfer", fetchError);
        showToast("Error processing transaction. Please try again.", 'error');
        return;
    }

    const senderWallet = wallets.find(w => w.user_id === currentUser.id);
    const recipientWallet = wallets.find(w => w.user_id === recipientId);

    if (!senderWallet || !recipientWallet) {
        showToast("Could not find wallets for transaction.", 'error');
        return;
    }
    
    // 2. Check if sender has enough balance
    if (senderWallet.balance < amount) {
        showToast("Insufficient funds.", 'error');
        return;
    }

    // 3. Perform the transfer
    const newSenderBalance = senderWallet.balance - amount;
    const newRecipientBalance = recipientWallet.balance + amount;

    const { error: senderUpdateError } = await supabase
        .from('wallets').update({ balance: newSenderBalance }).match({ user_id: currentUser.id, asset_symbol: symbol });
    
    const { error: recipientUpdateError } = await supabase
        .from('wallets').update({ balance: newRecipientBalance }).match({ user_id: recipientId, asset_symbol: symbol });

    if (senderUpdateError || recipientUpdateError) {
        console.error("Error updating balances:", { senderUpdateError, recipientUpdateError });
        // NOTE: In a real app, you'd need a proper transaction to rollback the first update if the second fails.
        showToast("Transaction failed.", 'error');
        return;
    }

    // 4. Log transactions for both sender and receiver
    const recipientUser = sendableUsers.find(u => u.id === recipientId);
    const assetPrice = assets.find(a => a.symbol === symbol)?.price || 0;
    const fromUser = currentUser.username || currentUser.first_name || 'user';
    const toUser = recipientUser?.username || recipientUser?.first_name || 'user';
    
    const sendTransaction: Omit<Transaction, 'id' | 'date'> = {
        user_id: currentUser.id, // The sender is the one initiating
        type: 'send',
        asset_symbol: symbol,
        amount: amount,
        usd_value: amount * assetPrice,
        from: fromUser,
        to: toUser,
    };
    
    const receiveTransaction: Omit<Transaction, 'id' | 'date'> = {
        user_id: recipientId,
        type: 'receive',
        asset_symbol: symbol,
        amount: amount,
        usd_value: amount * assetPrice,
        from: fromUser,
        to: toUser,
    };
    
    const { error: sendTxError } = await supabase.from('transactions').insert(sendTransaction);
    if (sendTxError) console.error("Error logging send transaction", sendTxError);
    const { error: receiveTxError } = await supabase.from('transactions').insert(receiveTransaction);
    if (receiveTxError) console.error("Error logging receive transaction", receiveTxError);


    // 5. Update local state for sender
    setAssets(currentAssets => {
        return currentAssets.map(asset => {
            if (asset.symbol === symbol) {
                return { ...asset, balance: newSenderBalance, usdValue: newSenderBalance * assetPrice };
            }
            return asset;
        });
    });
    const loggedTx = { ...sendTransaction, id: new Date().toISOString(), date: new Date().toISOString() };
    setTransactions(prev => [loggedTx, ...prev]);
    
    showToast(`Successfully sent ${amount} ${symbol} to ${toUser}.`, 'success');
    handleNavigation('Wallet');
  }, [currentUser, assets, sendableUsers, handleNavigation]);

  const handleWithdraw = useCallback(async (symbol: string, amount: number): Promise<boolean> => {
    if (!currentUser) {
        showToast("Error: Not logged in.", 'error');
        return false;
    }

    const assetToWithdraw = assets.find(a => a.symbol.toUpperCase() === symbol.toUpperCase());
    if (!assetToWithdraw) {
        showToast(`You do not have a wallet for ${symbol}.`, 'error');
        return false;
    }
    if (assetToWithdraw.balance < amount) {
        showToast("Insufficient funds.", 'error');
        return false;
    }

    const newBalance = assetToWithdraw.balance - amount;
    
    const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .match({ user_id: currentUser.id, asset_symbol: assetToWithdraw.symbol });

    if (updateError) {
        console.error("Error updating balance for withdrawal:", updateError);
        showToast("Withdrawal failed. Please try again.", 'error');
        return false;
    }
    
    const assetPrice = assetToWithdraw.price || 0;
    const newTransaction: Omit<Transaction, 'id' | 'date'> = {
        user_id: currentUser.id,
        type: 'withdraw',
        asset_symbol: assetToWithdraw.symbol,
        amount: amount,
        usd_value: amount * assetPrice,
        from: currentUser.username || currentUser.first_name || 'user',
        to: 'Withdrawal',
    };

    const { error: txError } = await supabase.from('transactions').insert(newTransaction);
    if (txError) console.error("Error logging withdrawal transaction", txError);

    setAssets(currentAssets => 
        currentAssets.map(asset => 
            asset.symbol === assetToWithdraw.symbol
            ? { ...asset, balance: newBalance, usdValue: newBalance * assetPrice }
            : asset
        )
    );

    const loggedTx = { ...newTransaction, id: new Date().toISOString(), date: new Date().toISOString() };
    setTransactions(prev => [loggedTx, ...prev]);
    showToast('Withdrawal request submitted successfully.', 'success');
    return true;
  }, [currentUser, assets]);

  const handleClearData = useCallback(async () => {
    if (window.confirm("Are you sure you want to clear all wallet data? This action cannot be undone.")) {
        if (currentUser) {
            await supabase.from('wallets').delete().eq('user_id', currentUser.id);
            await supabase.from('transactions').delete().eq('user_id', currentUser.id);
            await supabase.from('users').delete().eq('id', currentUser.id);
            window.location.reload();
        }
    }
  }, [currentUser]);

  const navItems = [
    { name: 'Wallet', icon: <WalletIcon /> },
    { name: 'Discover', icon: <CompassIcon /> },
    { name: 'Activity', icon: <ClockIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> },
  ];
  
  const mainPages: Page[] = ['Wallet', 'Discover', 'Activity', 'Settings'];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
      );
    }

    switch (page) {
      case 'Wallet':
        return <WalletView assets={assets} totalBalance={totalBalance} user={tg?.initDataUnsafe?.user} onAction={handleNavigation} balanceChange={balanceChange} />;
      case 'Discover':
        return <DiscoverView assets={discoverAssets} isLoading={isDiscoverLoading} />;
      case 'Activity':
        return <ActivityView transactions={transactions} assets={assets} />;
      case 'Settings':
        return <SettingsView isAdmin={isAdmin} onNavigate={handleNavigation} onClearData={handleClearData} />;
      case 'Admin':
        return <AdminPanelView baseAssets={baseAssets} assetsWithPrices={assets} onBalanceChange={handleBalanceChange} onBack={() => handleNavigation('Settings')} allUsers={allUsersForAdmin} />;
      case 'Send':
        return <ActionView title="Send" onBack={() => handleNavigation('Wallet')} assets={assets} allUsers={sendableUsers} onSend={handleSend} />;
      case 'Withdraw':
        return <ActionView title="Withdraw" onBack={() => handleNavigation('Wallet')} assets={assets} onWithdraw={handleWithdraw} />;
      case 'GeneralSettings':
        return <GeneralSettingsView onBack={() => handleNavigation('Settings')} />;
      case 'SecuritySettings':
        return <SecuritySettingsView onBack={() => handleNavigation('Settings')} />;
      case 'NetworkSettings':
        return <NetworkSettingsView onBack={() => handleNavigation('Settings')} />;
      case 'ContactsSettings':
        return <ContactsSettingsView onBack={() => handleNavigation('Settings')} />;
      default:
        return <WalletView assets={assets} totalBalance={totalBalance} user={tg?.initDataUnsafe?.user} onAction={handleNavigation} balanceChange={balanceChange} />;
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen font-sans text-white flex justify-center items-start">
      <div className="w-full max-w-md h-screen flex flex-col">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <main className="flex-1 w-full relative overflow-hidden">
            {renderContent()}
        </main>
        
        {mainPages.includes(page as any) && (
            <div className="flex-shrink-0 z-20">
                <BottomNav items={navItems} activeTab={page} setActiveTab={(tab) => handleNavigation(tab as Page)} />
            </div>
        )}
      </div>
    </div>
  );
};

export default App;

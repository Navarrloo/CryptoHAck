import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import type { Asset, Transaction, DBUser, DiscoverAsset } from './types';
import { BtcIcon, EthereumIcon, BnbIcon, TetherIcon, SolanaIcon, WalletIcon, CompassIcon, ClockIcon, SettingsIcon, XrpIcon, AdaIcon, DogeIcon, UsdcIcon, TonIcon } from './components/Icons';
import WalletView from './components/WalletView';
import ActionView from './components/ActionView';
import SettingsView from './components/SettingsView';
import AdminPanelView from './components/AdminPanelView';
import ActivityView from './components/ActivityView';
import DiscoverView from './components/DiscoverView';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from './lib/supabase';

// FIX: Add type definition for window.Telegram to fix TypeScript errors.
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
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: <SolanaIcon /> },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: <TetherIcon />, price: 1.0 },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: <UsdcIcon />, price: 1.0 },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', icon: <BnbIcon /> },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', icon: <XrpIcon /> },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', icon: <AdaIcon /> },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', icon: <DogeIcon /> },
  { id: 'ton', name: 'Toncoin', symbol: 'TON', icon: <TonIcon /> },
];


async function fetchAssetPrices(symbols: string[]): Promise<Record<string, number>> {
    if (!process.env.API_KEY) {
        console.error("API_KEY is not set.");
        // Return a default structure to avoid crashes
        const fallbackPrices: Record<string, number> = {};
        symbols.forEach(s => fallbackPrices[s] = 0);
        if (symbols.includes('USDT')) fallbackPrices['USDT'] = 1.0;
        if (symbols.includes('USDC')) fallbackPrices['USDC'] = 1.0;
        return fallbackPrices;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const properties: Record<string, { type: Type, description: string }> = {};
    symbols.filter(s => !['USDT', 'USDC'].includes(s)).forEach(symbol => { // Don't ask for stablecoin price
        properties[symbol] = { type: Type.NUMBER, description: `The current price of ${symbol} in USD.` };
    });

    if (Object.keys(properties).length === 0) {
        return { USDT: 1.0, USDC: 1.0 };
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
        if (symbols.includes('USDC')) result['USDC'] = 1.0;
        return result;
    } catch (error) {
        console.error("Error fetching asset prices from Gemini API:", error);
        // Fallback for stablecoins if API fails
        const fallbackPrices: Record<string, number> = {};
        if (symbols.includes('USDT')) fallbackPrices['USDT'] = 1.0;
        if (symbols.includes('USDC')) fallbackPrices['USDC'] = 1.0;
        return fallbackPrices;
    }
}

async function fetchTopCryptos(symbols: string[]): Promise<DiscoverAsset[]> {
    if (!process.env.API_KEY) {
        console.error("API_KEY is not set.");
        return [];
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


type Page = 'Wallet' | 'Discover' | 'Activity' | 'Settings' | 'Send' | 'Swap' | 'Buy' | 'Admin' | 'Withdraw';

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
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const telegramUserId = useMemo(() => tg?.initDataUnsafe?.user?.id, [tg]);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      console.warn("Gemini API Key is missing. Market data will not be available.");
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
                if (asset.symbol === 'ETH') balance = 1.256;
                else if (asset.symbol === 'BTC') balance = 0.051;
                else if (asset.symbol === 'SOL') balance = 15.3;
                else if (asset.symbol === 'USDT') balance = 2540.50;
                else if (asset.symbol === 'USDC') balance = 1050.11;
                else if (asset.symbol === 'BNB') balance = 2.5;
                else if (asset.symbol === 'XRP') balance = 1234;
                else if (asset.symbol === 'ADA') balance = 2560;
                else if (asset.symbol === 'DOGE') balance = 10000;
                else if (asset.symbol === 'TON') balance = 50.7;
                return { ...asset, balance: parseFloat(balance.toFixed(4)), usdValue: 0 };
            });
            
            const updatedAssets = await updatePrices(mockAssetsWithBalance);
            setAssets(updatedAssets);
            
            const mockTransactions: Transaction[] = [
                {
                  id: 'tx1', user_id: 'mockuser', type: 'receive', assetSymbol: 'ETH',
                  amount: 0.5, usdValue: 0.5 * (updatedAssets.find(a=>a.symbol === 'ETH')?.price || 3000),
                  date: new Date(Date.now() - 86400000 * 2).toISOString(),
                  from: '0x123...abc', to: 'My Wallet',
                },
                {
                  id: 'tx2', user_id: 'mockuser', type: 'send', assetSymbol: 'USDT',
                  amount: 500, usdValue: 500,
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

        // Map wallet data to asset structure
        const userAssets = baseAssets.map(baseAsset => {
            const walletInfo = walletData?.find(w => w.asset_symbol === baseAsset.symbol);
            return {
                ...baseAsset,
                balance: walletInfo?.balance || 0,
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
    return tg?.initDataUnsafe?.user?.username?.toLowerCase() === 'navarrlo';
  }, [tg]);
  
  const totalBalance = useMemo(() => assets.reduce((acc, asset) => acc + (asset.usdValue || 0), 0), [assets]);

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
        return;
    }

    // 2. Calculate new balance and update
    const newBalance = operation === 'add' ? wallet.balance + amount : wallet.balance - amount;
    const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', targetUserId)
        .eq('asset_symbol', symbol);

    if (updateError) {
        console.error("Error updating balance", updateError);
        return;
    }

    // 3. Log the transaction
    const targetUser = allUsersForAdmin.find(u => u.id === targetUserId);
    const assetPrice = assets.find(a => a.symbol === symbol)?.price || 0;
    
    const newTransaction: Omit<Transaction, 'id' | 'date'> = {
        user_id: targetUserId,
        type: operation === 'add' ? 'admin_add' : 'admin_subtract',
        assetSymbol: symbol,
        amount: amount,
        usdValue: amount * assetPrice,
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
  }, [assets, currentUser, allUsersForAdmin]);

  const handleSend = useCallback(async (recipientId: string, symbol: string, amount: number) => {
    if (!currentUser) {
        console.error("No current user to send from.");
        alert("Error: Not logged in.");
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
        alert("Error processing transaction. Please try again.");
        return;
    }

    const senderWallet = wallets.find(w => w.user_id === currentUser.id);
    const recipientWallet = wallets.find(w => w.user_id === recipientId);

    if (!senderWallet || !recipientWallet) {
        alert("Could not find wallets for transaction.");
        return;
    }
    
    // 2. Check if sender has enough balance
    if (senderWallet.balance < amount) {
        alert("Insufficient funds.");
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
        alert("Transaction failed.");
        return;
    }

    // 4. Log the transaction
    const recipientUser = sendableUsers.find(u => u.id === recipientId);
    const assetPrice = assets.find(a => a.symbol === symbol)?.price || 0;
    
    const newTransaction: Omit<Transaction, 'id' | 'date'> = {
        user_id: currentUser.id, // The sender is the one initiating
        type: 'send',
        assetSymbol: symbol,
        amount: amount,
        usdValue: amount * assetPrice,
        from: currentUser.username || currentUser.first_name || 'user',
        to: recipientUser?.username || recipientUser?.first_name || 'user',
    };
    
    const { error: txError } = await supabase.from('transactions').insert(newTransaction);
    if (txError) console.error("Error logging transaction", txError);

    // 5. Update local state for sender
    setAssets(currentAssets => {
        return currentAssets.map(asset => {
            if (asset.symbol === symbol) {
                return { ...asset, balance: newSenderBalance, usdValue: newSenderBalance * assetPrice };
            }
            return asset;
        });
    });
    const loggedTx = { ...newTransaction, id: new Date().toISOString(), date: new Date().toISOString() };
    setTransactions(prev => [loggedTx, ...prev]);
    
    alert(`Successfully sent ${amount} ${symbol} to ${recipientUser?.username || 'user'}.`);
    handleNavigation('Wallet');
  }, [currentUser, assets, sendableUsers, handleNavigation]);

  const handleWithdraw = useCallback(async (symbol: string, amount: number): Promise<boolean> => {
    if (!currentUser) {
        console.error("No current user for withdrawal.");
        alert("Error: Not logged in.");
        return false;
    }

    const assetToWithdraw = assets.find(a => a.symbol === symbol);
    if (!assetToWithdraw || assetToWithdraw.balance < amount) {
        alert("Insufficient funds.");
        return false;
    }

    const newBalance = assetToWithdraw.balance - amount;
    
    const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .match({ user_id: currentUser.id, asset_symbol: symbol });

    if (updateError) {
        console.error("Error updating balance for withdrawal:", updateError);
        alert("Withdrawal failed. Please try again.");
        return false;
    }
    
    const assetPrice = assetToWithdraw.price || 0;
    const newTransaction: Omit<Transaction, 'id' | 'date'> = {
        user_id: currentUser.id,
        type: 'withdraw',
        assetSymbol: symbol,
        amount: amount,
        usdValue: amount * assetPrice,
        from: currentUser.username || currentUser.first_name || 'user',
        to: 'Withdrawal',
    };

    const { error: txError } = await supabase.from('transactions').insert(newTransaction);
    if (txError) console.error("Error logging withdrawal transaction", txError);

    setAssets(currentAssets => 
        currentAssets.map(asset => 
            asset.symbol === symbol 
            ? { ...asset, balance: newBalance, usdValue: newBalance * assetPrice }
            : asset
        )
    );

    const loggedTx = { ...newTransaction, id: new Date().toISOString(), date: new Date().toISOString() };
    setTransactions(prev => [loggedTx, ...prev]);
    
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
        return <WalletView assets={assets} totalBalance={totalBalance} user={tg?.initDataUnsafe?.user} onAction={handleNavigation} />;
      case 'Discover':
        return <DiscoverView assets={discoverAssets} isLoading={isDiscoverLoading} />;
      case 'Activity':
        return <ActivityView transactions={transactions} assets={assets} />;
      case 'Settings':
        return <SettingsView isAdmin={isAdmin} onNavigate={handleNavigation} onClearData={handleClearData} />;
      case 'Admin':
        return <AdminPanelView assets={assets} onBalanceChange={handleBalanceChange} onBack={() => handleNavigation('Settings')} currentUser={currentUser} allUsers={allUsersForAdmin} />;
      case 'Send':
        return <ActionView title="Send" onBack={() => handleNavigation('Wallet')} assets={assets} allUsers={sendableUsers} onSend={handleSend} />;
      case 'Withdraw':
        return <ActionView title="Вывод" onBack={() => handleNavigation('Wallet')} assets={assets} onWithdraw={handleWithdraw} />;
      case 'Swap':
      case 'Buy':
        return <ActionView title={page} onBack={() => handleNavigation('Wallet')} assets={assets}/>;
      default:
        return <WalletView assets={assets} totalBalance={totalBalance} user={tg?.initDataUnsafe?.user} onAction={handleNavigation} />;
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen font-sans text-white flex justify-center items-start">
      <div className="w-full max-w-md h-screen flex flex-col relative">
        {apiKeyMissing && (
          <div className="bg-yellow-500/20 text-yellow-300 text-xs text-center p-2 z-30 flex-shrink-0">
            Gemini API Key is not configured. Market data is unavailable.
          </div>
        )}
        <main className="flex-grow overflow-y-auto w-full flex flex-col">
            {renderContent()}
        </main>
        
        {mainPages.includes(page) && (
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20 mt-auto">
                <BottomNav items={navItems} activeTab={page} setActiveTab={(tab) => handleNavigation(tab as Page)} />
            </div>
        )}
      </div>
    </div>
  );
};

export default App;
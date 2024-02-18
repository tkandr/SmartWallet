import { Spinner } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wallet, ethers } from 'ethers';
import { createContext, useState, useEffect, useContext } from 'react';
import { Presets } from 'userop';

import { useConnection } from './ConnectionContext';
import { getActiveNetwork } from '../../config/networks';

type WalletContextType = {
  simpleAccount?: Presets.Builder.SimpleAccount;
  wallet?: ethers.Wallet;
};

const config = getActiveNetwork();
const defaultValue = {};

const WalletContext = createContext<WalletContextType>(defaultValue);

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [value, setValue] = useState<WalletContextType>(defaultValue);

  const { paymasterMiddleware } = useConnection();

  useEffect(() => {
    (async () => {
      const walletPrivetKey = await AsyncStorage.getItem('privateKey');
      console.log(`walletPrivetKey ${walletPrivetKey}`);
      let wallet: Wallet | null = null;
      if (walletPrivetKey) {
        wallet = new ethers.Wallet(walletPrivetKey);
        // Assuming the password is an empty string for decryption which should be replaced by the actual password
      } else {
        wallet = ethers.Wallet.createRandom();
        await AsyncStorage.setItem('privateKey', wallet.privateKey);
      }

      const simpleAccount = await Presets.Builder.SimpleAccount.init(wallet, config.rpcUrl, {
        paymasterMiddleware,
      });

      setValue({
        wallet,
        simpleAccount,
      });
      setIsInitialized(true);
    })();
  }, [paymasterMiddleware]);

  return (
    <WalletContext.Provider value={value}>
      {isInitialized ? children : <Spinner />}
    </WalletContext.Provider>
  );
};

type IUseWalletResult = {
  simpleAccountAddress: string;
  walletAddress: string;
} & Required<WalletContextType>;
export const useWallet = (): IUseWalletResult => {
  const context = useContext(WalletContext);
  if (!context || !context.simpleAccount || !context.wallet) {
    throw new Error('useWallet must be used within a WalletContextProvider');
  }

  return {
    ...context,
    simpleAccountAddress: context.simpleAccount.getSender(),
    walletAddress: context.wallet.address,
  } as IUseWalletResult;
};

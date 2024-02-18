import { Spinner } from '@gluestack-ui/themed';
import { ethers } from 'ethers';
import { createContext, useState, useEffect, useContext } from 'react';
import { Client, Presets, UserOperationMiddlewareFn } from 'userop';

import { getActiveNetwork } from '../../config/networks';

type ConnectionContextType = {
  provider: ethers.providers.JsonRpcProvider;
  paymasterMiddleware: UserOperationMiddlewareFn;
  client?: Client;
};

const config = getActiveNetwork();

const defaultValue = {
  provider: new ethers.providers.JsonRpcProvider(config.rpcUrl),
  paymasterMiddleware: Presets.Middleware.verifyingPaymaster(
    config.paymaster.rpcUrl,
    config.paymaster.context
  ),
};
const ConnectionContext = createContext<ConnectionContextType>(defaultValue);

export const ConnectionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState<ConnectionContextType>(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    (async () => {
      const client = await Client.init(config.rpcUrl);
      setValue((prevValue) => ({ ...prevValue, ...{ client } }));
      setIsInitialized(true);
    })();
  }, []);

  return (
    <ConnectionContext.Provider value={value}>
      {isInitialized ? children : <Spinner />}
    </ConnectionContext.Provider>
  );
};

export type IUseConnectionResult = Required<ConnectionContextType>;
export const useConnection = (): IUseConnectionResult => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionContextProvider');
  }
  if (!context.client) {
    throw new Error('useConnection must be used within a ConnectionContextProvider');
  }

  return context as IUseConnectionResult;
};

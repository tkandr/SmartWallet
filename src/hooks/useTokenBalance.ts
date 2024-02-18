import { BigNumber, ethers } from 'ethers';
import { useQuery } from 'react-query';

import { getActiveNetwork } from '../../config/networks';
import { ERC20_ABI } from '../abi';
import { useConnection } from '../contexts/ConnectionContext';
import { useWallet } from '../contexts/WalletContext';
import { ITokenData, SimpleAccountAssetData } from '../types';

const { tokens } = getActiveNetwork();

export function useTokens() {
  const { provider } = useConnection();
  const { simpleAccountAddress } = useWallet(); // Ensure useWallet returns the correct type

  return useQuery<SimpleAccountAssetData[], Error>(
    'tokenBalances',
    async (): Promise<SimpleAccountAssetData[]> => {
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          let balance;
          if (token.isToken) {
            const tokenContract = new ethers.Contract(token.contractAddress, ERC20_ABI, provider);
            balance = await tokenContract.balanceOf(simpleAccountAddress);
          } else {
            balance = await provider.getBalance(simpleAccountAddress);
          }

          return {
            ...token,
            balance: balance,
          };
        })
      );
      return updatedTokens;
    },
    {
      enabled: !!provider, // Only run query if provider is available
      refetchInterval: 2000, // Refetch data every 200 seconds (I have credits for api calls)
    }
  );
}

export function useToken(token: ITokenData) {
  const { provider } = useConnection();
  const { simpleAccountAddress } = useWallet(); // Ensure useWallet returns the correct type

  return useQuery<BigNumber, Error>(
    'usdcBalance',
    async (): Promise<BigNumber> => {
      const tokenContract = new ethers.Contract(token.contractAddress, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(simpleAccountAddress);
      return balance;
    },
    {
      enabled: !!provider, // Only run query if provider is available
      refetchInterval: 2000, // Refetch data every 200 seconds (I have credits for api calls)
    }
  );
}

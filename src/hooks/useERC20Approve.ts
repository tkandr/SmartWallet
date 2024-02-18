import { ethers } from 'ethers';
import { useMutation } from 'react-query';

import { getActiveNetwork } from '../../config/networks';
import { ERC20_ABI } from '../abi';
import { useConnection, useWallet } from '../contexts';

const config = getActiveNetwork();

export function useERC20Approve(onSuccess: () => void = () => {}) {
  const { simpleAccount } = useWallet();
  const { client, provider } = useConnection();

  return useMutation({
    onSuccess,
    mutationFn: async (contractAddress: string) => {
      const token = ethers.utils.getAddress(contractAddress);
      const spender = ethers.utils.getAddress(config.paymaster.address);
      const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
      const [symbol, decimals] = await Promise.all([erc20.symbol(), erc20.decimals()]);
      // lets approve just 100 usdc for the testing purposes
      const amount = ethers.utils.parseUnits('100', decimals);
      console.log(`Approving ${amount} ${symbol}...`);

      const res = await client.sendUserOperation(
        simpleAccount.execute(
          erc20.address,
          0,
          erc20.interface.encodeFunctionData('approve', [spender, amount])
        ),
        {
          onBuild: (op) => console.log('Signed UserOperation:', op),
        }
      );

      console.log(`UserOpHash: ${res.userOpHash}`);

      console.log('Waiting for transaction...');
      const ev = await res.wait();
      console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
      return ev;
    },
  });
}

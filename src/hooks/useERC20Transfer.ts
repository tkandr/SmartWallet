import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { UserOperationEventEvent } from 'userop/dist/typechain/EntryPoint';

import { useExchangeRate } from './useExchangeRate';
import { ERC20_ABI } from '../abi';
import { useWallet, useConnection } from '../contexts';
import { ITokenData } from '../types';
import { estimateOpConstInERC20Token } from '../utils';

type IMakeERC20Transfer = (
  destinationAddress: string,
  amountRaw: string
) => Promise<UserOperationEventEvent | null>;
type IMakeTransferReturnType = {
  makeERC20Transfer: IMakeERC20Transfer;
  opCostEstimate: number;
};

export function useERC20Transfer(tokenData: ITokenData): IMakeTransferReturnType {
  const [opCostEstimate, setOpCostEstimate] = useState<number>(0);
  const { simpleAccount } = useWallet();
  const { client, provider } = useConnection();

  const { isSuccess: exchangeRateLoaded, data: exchangeRate } = useExchangeRate();

  const estimateERC20Transfer = async (): Promise<number> => {
    if (!exchangeRateLoaded || !exchangeRate) {
      return 0;
    }
    const token = ethers.utils.getAddress(tokenData.contractAddress);
    const to = ethers.constants.AddressZero;
    const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
    const amount = ethers.utils.parseUnits('1', tokenData.decimals);

    try {
      const op = await client.buildUserOperation(
        simpleAccount.execute(
          erc20.address,
          0,
          erc20.interface.encodeFunctionData('transfer', [to, amount])
        )
      );
      return estimateOpConstInERC20Token(op, exchangeRate);
    } catch (err) {
      console.warn(`Could not estimate transfer`, err);
      return 0;
    }
  };

  useEffect(() => {
    (async () => {
      const estimatedCost = await estimateERC20Transfer();
      setOpCostEstimate(estimatedCost);
    })();
  }, [exchangeRate]);

  const makeERC20Transfer = async (destinationAddress: string, amountRaw: string) => {
    console.log(`Transferring ${amountRaw} ${tokenData.symbol}...`);

    const token = ethers.utils.getAddress(tokenData.contractAddress);
    const to = ethers.utils.getAddress(destinationAddress);
    const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
    const amount = ethers.utils.parseUnits(amountRaw, tokenData.decimals);

    // It appears that `sendUserOperation` cannot take a userOperation as an argument :(
    // to speed things up will do some copy-paste
    const res = await client.sendUserOperation(
      simpleAccount.execute(
        erc20.address,
        0,
        erc20.interface.encodeFunctionData('transfer', [to, amount])
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
  };

  return {
    makeERC20Transfer,
    opCostEstimate,
  };
}

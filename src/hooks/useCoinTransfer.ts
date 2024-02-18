import { ethers } from 'ethers';
import { UserOperationEventEvent } from 'userop/dist/typechain/EntryPoint';

import { useConnection } from '../contexts/ConnectionContext';
import { useWallet } from '../contexts/WalletContext';

type IMakeTransfer = (
  destinationAddress: string,
  amountRaw: string
) => Promise<UserOperationEventEvent | null>;
type IMakeTransferReturnType = {
  makeCoinTransfer: IMakeTransfer;
};

export function useCoinTransfer(): IMakeTransferReturnType {
  const { simpleAccount } = useWallet();
  const { client } = useConnection();

  const makeCoinTransfer = async (destinationAddress: string, amountRaw: string) => {
    const to = ethers.utils.getAddress(destinationAddress);
    const amount = ethers.utils.parseEther(amountRaw);

    const res = await client.sendUserOperation(simpleAccount.execute(to, amount, '0x'), {
      onBuild: (op) => console.log('Signed UserOperation:', op),
    });

    console.log(`UserOpHash: ${res.userOpHash}`);

    console.log('Waiting for transaction...');
    const ev = await res.wait();
    console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
    // give me a type of this
    return ev;
  };

  return {
    makeCoinTransfer,
  };
}

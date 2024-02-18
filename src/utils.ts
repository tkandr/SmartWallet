import { BigNumber, ethers } from 'ethers';
import { IUserOperation } from 'userop';
import { PAYMASTER_COMMISSION } from './constants';

export const estimateOpConstInERC20Token = (op: IUserOperation, exchangeRate: string): number => {
  const totalGasLimit = BigNumber.from(op.callGasLimit)
    .add(op.verificationGasLimit)
    .add(op.preVerificationGas);

  const upperBoundaryCostWei = totalGasLimit.mul(op.maxFeePerGas);

  const upperBoundaryInETH = ethers.utils.formatEther(upperBoundaryCostWei);

  // Binance response in string does not want to convert to BigNumber.
  // So we will convert both to simple JS number for simplicity
  return (
    Number.parseFloat(upperBoundaryInETH) *
    Number.parseFloat(exchangeRate) *
    (1 + PAYMASTER_COMMISSION)
  );
};

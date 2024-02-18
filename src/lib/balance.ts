import { BigNumber, ethers } from 'ethers';

export const formatBigNUmber = (value: BigNumber, decimals = 18) => {
  const formattedValue = ethers.utils.formatUnits(value, decimals);
  return formattedValue;
};

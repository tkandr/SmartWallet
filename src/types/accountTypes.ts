import { BigNumber } from 'ethers';

interface IAssetData {
  symbol: string;
  label: string;
  decimals: number;
  balance: BigNumber;
  imageSrc: string;
}

export interface ITokenData extends IAssetData {
  contractAddress: string;
  isToken: true;
}

export interface ICoinData extends IAssetData {
  isToken: false;
}

export type SimpleAccountAssetData = ITokenData | ICoinData;

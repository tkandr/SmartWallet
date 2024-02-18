import { utils, ethers } from 'ethers';
import { Presets } from 'userop';

import { getActiveNetwork } from '../../config/networks';

const config = getActiveNetwork();

export function shortenString(str: string, extraShort?: true) {
  return `${str.substring(0, extraShort ? 6 : 10)}...${str.substring(
    str.length - (extraShort ? 4 : 6)
  )}`;
}

export function shortenAddress(address: string, extraShort?: true): string {
  try {
    const formattedAddress = utils.getAddress(address);
    return shortenString(formattedAddress, extraShort);
  } catch {
    return address;
  }
}

export function shortenIfAddress(address?: string | null | false, extraShort?: true): string {
  if (typeof address === 'string' && address.length > 0) {
    return shortenAddress(address, extraShort);
  }
  return address || '';
}

export async function getSimpleAccountAddress(wallet: ethers.Wallet): Promise<string> {
  const simpleAccount = await Presets.Builder.SimpleAccount.init(wallet, config.rpcUrl);

  return simpleAccount.getSender();
}

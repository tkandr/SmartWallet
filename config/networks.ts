import { ethers } from 'ethers';

import { SimpleAccountAssetData } from '../src/types';

// write typing for config here
interface Paymaster {
  address: string;
  rpcUrl: string;
  context: {
    type: string;
    token?: string;
  };
}

interface NetworkConfig {
  rpcUrl: string;
  paymaster: Paymaster;
  tokens: SimpleAccountAssetData[];
}

export type NetworkConfigs = {
  [key: string]: NetworkConfig;
};

const networkConfigs: NetworkConfigs = {
  goerli: {
    rpcUrl:
      'https://api.stackup.sh/v1/node/a0c66a9eb2c612c80b93e187bda44854c2c630dc1ef502ae18e2c4e18d96a88b',
    paymaster: {
      address: '0xE93ECa6595fe94091DC1af46aaC2A8b5D7990770',
      rpcUrl:
        'https://api.stackup.sh/v1/paymaster/a0c66a9eb2c612c80b93e187bda44854c2c630dc1ef502ae18e2c4e18d96a88b',
      context: { type: 'erc20token', token: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
    },
    tokens: [
      {
        symbol: 'ETH Goerli',
        label: 'Ethereum',
        decimals: 18,
        balance: ethers.utils.parseUnits('0'),
        imageSrc: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        isToken: false,
      },
      {
        contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        symbol: 'UNITest',
        label: 'Uniswap',
        decimals: 18,
        balance: ethers.utils.parseUnits('0'),
        imageSrc:
          'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png?1600306604',
        isToken: true,
      },
    ],
  },
  mainnet: {
    rpcUrl:
      'https://api.stackup.sh/v1/node/c854b0b317f0da94f5d396909f68f5b1aa533844b1be17d1f0b81b868cfdf890',
    paymaster: {
      address: '0xE93ECa6595fe94091DC1af46aaC2A8b5D7990770',
      rpcUrl:
        'https://api.stackup.sh/v1/paymaster/c854b0b317f0da94f5d396909f68f5b1aa533844b1be17d1f0b81b868cfdf890',
      context: {
        type: 'erc20token',
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      },
    },
    tokens: [
      {
        symbol: 'ETH',
        label: 'Ethereum',
        decimals: 18,
        balance: ethers.utils.parseUnits('0'),
        imageSrc: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        isToken: false,
      },
      {
        contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
        label: 'USDC',
        decimals: 6,
        balance: ethers.utils.parseUnits('0'),
        imageSrc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        isToken: true,
      },
    ],
  },
  bsc: {
    rpcUrl:
      'https://api.stackup.sh/v1/node/c9243c0e6f952529182193a34179297b80e6c3293df1c682a6d94fa57d3ef045',
    paymaster: {
      address: '0xE93ECa6595fe94091DC1af46aaC2A8b5D7990770',
      rpcUrl:
        'https://api.stackup.sh/v1/paymaster/c9243c0e6f952529182193a34179297b80e6c3293df1c682a6d94fa57d3ef045',
      context: { type: 'erc20token', token: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d' },
    },
    tokens: [
      // {
      //   symbol: 'BNB',
      //   label: 'Ethereum',
      //   decimals: 18,
      //   balance: ethers.utils.parseUnits('0'),
      //   imageSrc:
      //     'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970',
      //   isToken: false,
      // },
      {
        contractAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        symbol: 'USDC',
        label: 'USDC',
        decimals: 18,
        balance: ethers.utils.parseUnits('0'),
        imageSrc: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
        isToken: true,
      },
    ],
  },
};

const activeNetwork = 'bsc';

export function getActiveNetwork(): NetworkConfig {
  return networkConfigs[activeNetwork];
}

import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
  VStack,
  Spinner,
  Text,
  Box,
  HStack,
  Image,
  Divider,
} from '@gluestack-ui/themed';
import { ethers } from 'ethers';
import { SubmitHandler } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';

import AllowTokenSpending from './AllowTokenSpending';
import { AssetSendForm } from './AssetSendForm';
import { getActiveNetwork } from '../../config/networks';
import { ERC20_ABI } from '../abi';
import { useConnection, useWallet } from '../contexts';
import { useERC20Transfer, useToken } from '../hooks';
import { formatBigNUmber } from '../lib';

const config = getActiveNetwork();

interface FromData {
  amount: string;
  recipient: string;
}
const usdcTokenData = config.tokens.find((t) => t.symbol.toLowerCase() === 'usdc');
if (!usdcTokenData || !usdcTokenData.isToken) {
  throw new Error('USDC misconfigured for the current network');
}

const UsdcScreen = () => {
  const { provider } = useConnection();
  const { simpleAccountAddress } = useWallet();
  const { makeERC20Transfer, opCostEstimate } = useERC20Transfer(usdcTokenData);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { isLoading: isUsdcLoading, data: balance } = useToken(usdcTokenData);

  const { isLoading: isAllowanceLoading, data: isAllowed } = useQuery<boolean, Error>(
    'usdcAllowance',
    async (): Promise<boolean> => {
      const token = ethers.utils.getAddress(usdcTokenData.contractAddress);
      const spender = ethers.utils.getAddress(config.paymaster.address);
      const erc20Contract = new ethers.Contract(token, ERC20_ABI, provider);
      const allowance = await erc20Contract.allowance(simpleAccountAddress, spender);
      console.log(`allowance is ${allowance}`);

      return allowance > ethers.utils.parseUnits('10', usdcTokenData.decimals);
    }
  );

  const { symbol, imageSrc, decimals } = usdcTokenData;

  if (isUsdcLoading || isAllowanceLoading) {
    return <Spinner />;
  }

  const onSubmit: SubmitHandler<FromData> = async (data) => {
    try {
      const result = await makeERC20Transfer(data.recipient, data.amount);

      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast nativeID={'toast-' + id} action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>Transaction send successfully</ToastTitle>
                <ToastDescription>TX Hash: {result?.transactionHash}</ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    } catch (error) {
      console.error('Could not send the transaction');
      console.error(error);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast nativeID={'toast-' + id} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>Something Went Wrong</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
      queryClient.invalidateQueries('tokenBalances');
    }
  };

  return (
    <Box mt="$4" borderRadius="$lg" p="$4" backgroundColor="#2E2E2E">
      <HStack alignItems="center" mb="$2">
        <Image
          source={{
            uri: imageSrc,
          }}
          alt={symbol}
          size="xs"
          mr="$6"
          role="img"
          // @ts-expect-error $full is definitely working and that is how it is written in the doc, but TS validation does not pass
          borderRadius="$lg"
        />
        <Text size="md">{Number.parseFloat(formatBigNUmber(balance!, decimals)).toFixed(8)}</Text>
        <Text ml="$2" size="md">
          {symbol}
        </Text>
      </HStack>
      <Divider my="$2" />
      <Text>Estimated Transaction cost {opCostEstimate.toFixed(5)} </Text>
      <Divider my="$2" />
      {!isAllowed ? (
        <AssetSendForm assetData={{ ...usdcTokenData, balance: balance! }} onSubmit={onSubmit} />
      ) : (
        <AllowTokenSpending
          token={usdcTokenData}
          onSuccess={() => queryClient.invalidateQueries('usdcAllowance')}
        />
      )}
    </Box>
  );
};

export default UsdcScreen;

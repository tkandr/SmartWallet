import {
  View,
  Button,
  ButtonText,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertText,
  Text,
  InfoIcon,
  Box,
} from '@gluestack-ui/themed';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import { AssetSendForm } from './AssetSendForm';
import { getActiveNetwork } from '../../config/networks';
import { ERC20_ABI } from '../abi';
import { useConnection } from '../contexts';
import { useWallet } from '../contexts/WalletContext';
import { useERC20Approve, useERC20Transfer } from '../hooks';
import { ITokenData } from '../types';

const config = getActiveNetwork();

interface FromData {
  amount: string;
  recipient: string;
}

interface TokenSendFormProps {
  assetData: ITokenData;
}

const TokenSendForm = ({ assetData }: TokenSendFormProps) => {
  const queryClient = useQueryClient();
  const { makeERC20Transfer, opCostEstimate } = useERC20Transfer(assetData);
  const [isAllowed, setIsAllowed] = useState(false);
  const { provider } = useConnection();
  const { simpleAccountAddress } = useWallet();
  const mutation = useERC20Approve();

  const toast = useToast();

  const { wallet } = useWallet();
  if (!wallet) {
    throw new Error('Wallet is not initialized');
  }

  useEffect(() => {
    if (isAllowed) {
      return;
    }
    (async () => {
      const token = ethers.utils.getAddress(assetData.contractAddress);
      const spender = ethers.utils.getAddress(config.paymaster.address);
      const erc20Contract = new ethers.Contract(token, ERC20_ABI, provider);
      console.log('erc20Contract', erc20Contract);
      const allowance = await erc20Contract.allowance(simpleAccountAddress, spender);
      console.log(`allowance is ${allowance}`);

      if (allowance > ethers.utils.parseUnits('10', assetData.decimals)) {
        setIsAllowed(true);
      }
    })();
  }, [isAllowed, mutation.isLoading, assetData.contractAddress]);

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

  if (!isAllowed) {
    return (
      <View>
        {mutation.isLoading && <Spinner />}
        <Alert mx="$2.5" action="info" variant="solid">
          <AlertIcon as={InfoIcon} mr="$3" />
          <AlertText>
            In order to be able to pay for the transaction in token, you need to approve it first
          </AlertText>
        </Alert>
        <Button
          disabled={mutation.isLoading}
          mt="$2"
          onPress={() => mutation.mutate(assetData.contractAddress)}
        >
          <ButtonText>Approve</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <Box>
      <Text>Estimated Transaction cost {opCostEstimate} </Text>
      <AssetSendForm assetData={assetData} onSubmit={onSubmit} />
    </Box>
  );
};

export default TokenSendForm;

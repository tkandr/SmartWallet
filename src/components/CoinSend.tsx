import { useToast, Toast, ToastTitle, ToastDescription, VStack } from '@gluestack-ui/themed';
import { SubmitHandler } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import { AssetSendForm } from './AssetSendForm';
import { useCoinTransfer } from '../hooks';
import { ICoinData } from '../types';

interface FromData {
  amount: string;
  recipient: string;
}

interface TokenSendFormProps {
  assetData: ICoinData;
}

const CoinSendForm = ({ assetData }: TokenSendFormProps) => {
  const queryClient = useQueryClient();
  const { makeCoinTransfer } = useCoinTransfer();

  const toast = useToast();

  const onSubmit: SubmitHandler<FromData> = async (data) => {
    try {
      const result = await makeCoinTransfer(data.recipient, data.amount);

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

  return <AssetSendForm assetData={assetData} onSubmit={onSubmit} />;
};

export default CoinSendForm;

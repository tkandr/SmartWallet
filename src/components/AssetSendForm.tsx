import {
  View,
  Input,
  InputField,
  Button,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  AlertCircleIcon,
  FormControlErrorText,
  Textarea,
  ButtonText,
  Spinner,
  TextareaInput,
} from '@gluestack-ui/themed';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { formatBigNUmber } from '../lib';
import { SimpleAccountAssetData } from '../types';

interface IFromData {
  amount: string;
  recipient: string;
}
interface IAssetSendFormProps {
  assetData: SimpleAccountAssetData;
  onSubmit: SubmitHandler<IFromData>;
}

export const AssetSendForm = ({ assetData, onSubmit }: IAssetSendFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFromData>({
    defaultValues: {
      amount: '',
      recipient: '',
    },
  });

  return (
    <View>
      {isSubmitting && <Spinner />}
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 42,
        }}
        render={({ field: { onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormControl size="md" isInvalid={invalid} isRequired={true} isDisabled={isSubmitting}>
            <Textarea isInvalid={invalid} h="$16" backgroundColor="$backgroundDark950">
              <TextareaInput
                type="text"
                placeholder="Recipient Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Textarea>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>Must be a valid ethereum address </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
        name="recipient"
      />
      <Controller
        control={control}
        rules={{
          required: true,
          max: formatBigNUmber(assetData.balance, assetData.decimals),
          min: 0,
        }}
        render={({ field: { onChange, onBlur, value }, fieldState: { invalid } }) => (
          <FormControl
            size="md"
            isInvalid={invalid}
            isRequired={true}
            isDisabled={isSubmitting}
            mt="$4"
          >
            <Input isInvalid={invalid} backgroundColor="$backgroundDark950">
              <InputField
                type="text"
                placeholder="Amount"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                Amount must be grater than 0 and less than{' '}
                {formatBigNUmber(assetData.balance, assetData.decimals)}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        )}
        name="amount"
      />
      <FormControl isDisabled={isSubmitting}>
        <Button
          backgroundColor="$green400"
          disabled={isSubmitting}
          mt="$4"
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonText>Send</ButtonText>
        </Button>
      </FormControl>
    </View>
  );
};

import {
  Box,
  Button,
  ButtonText,
  Spinner,
  Image,
  VStack,
  Text,
  Heading,
} from '@gluestack-ui/themed';

import pageIcon from '../../assets/coin-1.png';
import { useERC20Approve } from '../hooks';
import { ITokenData } from '../types';

interface IComponentProps {
  token: ITokenData;
  onSuccess: () => void;
}
const AllowTokenSpending = ({ token, onSuccess = () => {} }: IComponentProps) => {
  const mutation = useERC20Approve(onSuccess);

  return (
    <Box backgroundColor="#2E2E2E">
      {mutation.isLoading && <Spinner />}
      <VStack alignItems="center" p="$4">
        <Image source={pageIcon} alt="approve token spending image" />
        <Heading size="md" mt="$2">
          Approve Token
        </Heading>
        <Text textAlign="center" mt="$2" color="rgba(255, 255, 255, 0.60));">
          In order to be able to pay for the transaction in token, you need to approve it first
        </Text>
      </VStack>
      <Button
        backgroundColor="$green400"
        disabled={mutation.isLoading}
        mt="$4"
        onPress={() => mutation.mutate(token.contractAddress)}
      >
        <ButtonText>Approve</ButtonText>
      </Button>
    </Box>
  );
};

export default AllowTokenSpending;

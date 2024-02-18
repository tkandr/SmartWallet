import { Text, Box, VStack, Spinner, Heading } from '@gluestack-ui/themed';
import React from 'react';

import CopyBox from '../components/CopyBox';
import UsdcScreen from '../components/UsdcForm';
import { useWallet } from '../contexts/WalletContext';
import { shortenIfAddress } from '../lib/addresses';

const WalletScreen: React.FC = () => {
  const { simpleAccountAddress } = useWallet();

  return (
    <VStack height="100%" px="$4" pt="$4">
      <Heading size="2xl"> Send Crypto </Heading>
      <Box width="100%" mt="$3">
        <VStack>
          <Text mb="$2">Your account address is </Text>
          <CopyBox label={shortenIfAddress(simpleAccountAddress)} value={simpleAccountAddress} />
        </VStack>
        <Box mt="$2">
          <UsdcScreen />
        </Box>
      </Box>
    </VStack>
  );
};

export default WalletScreen;

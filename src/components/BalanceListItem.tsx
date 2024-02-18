import { HStack, Image, Text, VStack, Pressable, Box } from '@gluestack-ui/themed';
import { useState } from 'react';

import CoinSendForm from './CoinSend';
import TokenSendForm from './TokenSend';
import { formatBigNUmber } from '../lib/balance';
import { SimpleAccountAssetData } from '../types';

interface IAssetListItemProps {
  item: SimpleAccountAssetData;
}

const BalanceListItem = ({ item }: IAssetListItemProps) => {
  const { symbol, imageSrc, balance, decimals } = item;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box mt="$4" borderColor="$primary500" borderWidth={1} borderRadius="$md" p="$4">
      <Pressable
        justifyContent="flex-start"
        alignItems="flex-start"
        mb="$2"
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <HStack>
          <Image
            source={{
              uri: imageSrc,
            }}
            alt={symbol}
            size="xs"
            mr="$6"
            role="img"
            // @ts-expect-error $full is definitely working and that is how it is written in the doc, but TS validation does not pass
            borderRadius="$full"
          />
          <VStack>
            <Text size="md">{formatBigNUmber(balance, decimals)}</Text>
            <Text size="md" color="$primary500">
              {symbol}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
      {isOpen &&
        (item.isToken ? <TokenSendForm assetData={item} /> : <CoinSendForm assetData={item} />)}
    </Box>
  );
};

export default BalanceListItem;

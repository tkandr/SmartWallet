import { HStack, Text, Button, ButtonIcon, CopyIcon, ButtonText } from '@gluestack-ui/themed';
import * as Clipboard from 'expo-clipboard';
import React, { useState, useEffect } from 'react';

interface ICopyBoxProps {
  value: string;
  label: string;
}
const CopyBox = ({ value, label, ...rest }: ICopyBoxProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(value);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    <HStack
      borderColor="$white"
      borderRadius="$lg"
      p="$4"
      justifyContent="space-between"
      backgroundColor="#2E2E2E"
      alignItems="center"
      minHeight="$12"
      {...rest}
    >
      <Text>{label}</Text>
      {copied ? (
        <Text color="$green500">Copied</Text>
      ) : (
        <Button backgroundColor="$green400" onPress={copyToClipboard} size="sm">
          <ButtonIcon as={CopyIcon} />
          <ButtonText ml="$1"> Copy </ButtonText>
        </Button>
      )}
    </HStack>
  );
};

export default CopyBox;

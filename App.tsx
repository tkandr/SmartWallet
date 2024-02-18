import '@ethersproject/shims';
import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme
import { GluestackUIProvider } from '@gluestack-ui/themed';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ConnectionContextProvider } from './src/contexts/ConnectionContext';
import { WalletContextProvider } from './src/contexts/WalletContext';
import WalletScreen from './src/screens/WalletScreen';

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      {/* top SafeAreaView */}
      <SafeAreaView
        style={{
          backgroundColor: '#1A1A1A',
        }}
      />
      {/* bottom SafeAreaView */}
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: '#050000',
        }}
      >
        <GluestackUIProvider config={config} colorMode="dark">
          <QueryClientProvider client={queryClient}>
            <ConnectionContextProvider>
              <WalletContextProvider>
                <WalletScreen />
              </WalletContextProvider>
            </ConnectionContextProvider>
          </QueryClientProvider>
        </GluestackUIProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

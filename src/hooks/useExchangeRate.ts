import axios from 'axios';
import { BigNumber } from 'ethers';
import { useQuery } from 'react-query';

interface IBinanceSymbolResponse {
  symbol: string;
  price: string;
}

export function useExchangeRate(symbol = `BNBUSDC`) {
  return useQuery<string>({
    queryKey: ['exchangeRate', symbol],
    queryFn: async (): Promise<string> => {
      const resp = await axios.get<IBinanceSymbolResponse>(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      );

      return resp.data.price;
    },
    staleTime: 60 * 1000,
  });
}

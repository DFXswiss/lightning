import { Blockchain } from '@dfx.swiss/react';

export interface BlockchainInterface {
  toHeader: (blockchain: Blockchain) => string;
  toString: (blockchain: Blockchain) => string;
}

export function useBlockchain(): BlockchainInterface {

  const definitions = {
    headings: {
      [Blockchain.ETHEREUM]: 'Ethereum mainnet · ERC-20 token',
      [Blockchain.BINANCE_SMART_CHAIN]: 'Binance Smart Chain · BEP-20 token',
      [Blockchain.ARBITRUM]: 'Arbitrum One · ERC-20 token',
      [Blockchain.OPTIMISM]: 'Optimism · ERC-20 token',
      [Blockchain.POLYGON]: 'Polygon · ERC-20 token',
      [Blockchain.BITCOIN]: '',
      [Blockchain.CARDANO]: '',
      [Blockchain.DEFICHAIN]: '',
    },
    stringValue: {
      [Blockchain.ETHEREUM]: 'Ethereum',
      [Blockchain.BINANCE_SMART_CHAIN]: 'Binance Smart Chain',
      [Blockchain.ARBITRUM]: 'Arbitrum',
      [Blockchain.OPTIMISM]: 'Optimism',
      [Blockchain.POLYGON]: 'Polygon (not yet supported)',
      [Blockchain.BITCOIN]: '',
      [Blockchain.CARDANO]: '',
      [Blockchain.DEFICHAIN]: '',
    },
  };

  return {
    toHeader: (blockchain: Blockchain) => definitions.headings[blockchain],
    toString: (blockchain: Blockchain) => definitions.stringValue[blockchain],
  };
}

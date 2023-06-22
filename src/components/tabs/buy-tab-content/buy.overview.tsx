import { StyledCoinList, StyledCoinListItem, StyledVerticalStack } from '@dfx.swiss/react-components';
import { useBlockchain } from '../../../hooks/blockchain.hook';
import { Asset, Blockchain, useAssetContext } from '@dfx.swiss/react';
import { AssetType } from '@dfx.swiss/react/dist/definitions/asset';

interface BuyTabContentOverviewProps {
  onAssetClicked: (asset: Asset) => void;
}

export function BuyTabContentOverview({ onAssetClicked }: BuyTabContentOverviewProps): JSX.Element {
  const { assets } = useAssetContext();
  const { toHeader } = useBlockchain();
  const availableChains: Blockchain[] = [
    Blockchain.ETHEREUM,
    Blockchain.BINANCE_SMART_CHAIN,
    Blockchain.ARBITRUM,
    Blockchain.OPTIMISM,
    Blockchain.POLYGON,
  ];

  const blockchainToOrder: Record<Blockchain, number> = {
    [Blockchain.ETHEREUM]: 0,
    [Blockchain.ARBITRUM]: 1,
    [Blockchain.BINANCE_SMART_CHAIN]: 2,
    [Blockchain.OPTIMISM]: 3,
    [Blockchain.POLYGON]: 4,
    [Blockchain.DEFICHAIN]: Infinity,
    [Blockchain.BITCOIN]: Infinity,
    [Blockchain.CARDANO]: Infinity,
  };

  function orderByBlockchain(a: [Blockchain, Asset[]], b: [Blockchain, Asset[]]): number {
    return blockchainToOrder[a[0]] - blockchainToOrder[b[0]];
  }

  return (
    <StyledVerticalStack gap={0}>
      {Array.from(assets.entries())
        .filter(([blockchain]) => availableChains.includes(blockchain))
        .sort(orderByBlockchain)
        .map(([blockchain, assets]) => (
          <StyledCoinList key={blockchain} heading={toHeader(blockchain)}>
            {assets
              .filter((a) => a.buyable || a.comingSoon)
              .map((asset) => (
                <StyledCoinListItem
                  key={asset.id}
                  asset={asset}
                  isToken={asset.type === AssetType.TOKEN}
                  protocol=''
                  onClick={() => onAssetClicked(asset)}
                />
              ))}
          </StyledCoinList>
        ))}
    </StyledVerticalStack>
  );
}

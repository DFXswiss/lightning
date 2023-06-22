import { StyledCoinList, StyledCoinListItem, StyledVerticalStack } from '@dfx.swiss/react-components';
import { Asset, Blockchain, useAssetContext } from '@dfx.swiss/react';
import { AssetType } from '@dfx.swiss/react/dist/definitions/asset';

interface BuyTabContentOverviewProps {
  onAssetClicked: (asset: Asset) => void;
}

interface AssetDisplay {
  id: number;
  heading: string;
  assets: Asset[];
}

const fiatAssets: Asset[] = [
  {
    id: 0,
    name: 'EUR',
    uniqueName: 'Lightning/EUR',
    description: 'Euro pegged Coins',
    buyable: false,
    sellable: false,
    blockchain: Blockchain.LIGHTNING,
    comingSoon: true,
    type: AssetType.TOKEN,
  },
  {
    id: 1,
    name: 'USD',
    uniqueName: 'Lightning/USD',
    description: 'USD pegged Coins',
    buyable: false,
    sellable: false,
    blockchain: Blockchain.LIGHTNING,
    comingSoon: true,
    type: AssetType.TOKEN,
  },
  {
    id: 2,
    name: 'CHF',
    uniqueName: 'Lightning/CHF',
    description: 'CHF pegged Coins',
    buyable: false,
    sellable: false,
    blockchain: Blockchain.LIGHTNING,
    comingSoon: true,
    type: AssetType.TOKEN,
  },
  {
    id: 3,
    name: 'GBP',
    uniqueName: 'Lightning/GBP',
    description: 'GBP pegged Coins',
    buyable: false,
    sellable: false,
    blockchain: Blockchain.LIGHTNING,
    comingSoon: true,
    type: AssetType.TOKEN,
  },
];

export function BuyTabContentOverview({ onAssetClicked }: BuyTabContentOverviewProps): JSX.Element {
  const { assets } = useAssetContext();

  function getAssetsToDisplay(): AssetDisplay[] {
    return Array.from(assets.entries())
      .filter(([blockchain]) => blockchain === Blockchain.LIGHTNING)
      .map(([_blockchain, assets]) => ({
        id: 0,
        heading: 'Sound money',
        assets,
      }))
      .concat({
        id: 1,
        heading: 'Fiat Flat Coins over Taproot Assets Protocol',
        assets: fiatAssets,
      });
  }

  return (
    <StyledVerticalStack gap={0}>
      {getAssetsToDisplay().map((display) => (
        <StyledCoinList key={display.id} heading={display.heading}>
          {display.assets
            .filter((a) => a.buyable || a.comingSoon)
            .map((asset) => (
              <StyledCoinListItem
                key={asset.id}
                asset={asset}
                isToken={asset.type === AssetType.TOKEN}
                protocol=""
                onClick={() => onAssetClicked(asset)}
              />
            ))}
        </StyledCoinList>
      ))}
    </StyledVerticalStack>
  );
}

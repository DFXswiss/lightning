import { SellTabContentProcess } from './sell-tab-content/sell.process';
import { useMemo } from 'react';
import { useWalletContext } from '../../contexts/wallet.context';
import { UserDataForm } from '../user-data-form';
import {
  IconVariant,
  StyledButton,
  StyledHorizontalStack,
  StyledModal,
  StyledModalColor,
  StyledModalType,
  StyledTabContentWrapper,
  StyledTabProps,
  StyledVerticalStack,
} from '@dfx.swiss/react-components';
import { useAssetContext, useSessionContext, useUserContext } from '@dfx.swiss/react';

export function useSellTab(): StyledTabProps {
  const { user } = useUserContext();
  return {
    title: 'Sell',
    icon: IconVariant.SELL,
    deactivated: false,
    content: <SellTabContent needsUserDataForm={user != null && !user.kycDataComplete} />,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onActivate: () => {},
  };
}

function SellTabContent({ needsUserDataForm }: { needsUserDataForm: boolean }): JSX.Element {
  const { isLoggedIn, login } = useSessionContext();
  const { blockchain, address } = useWalletContext();
  const { assets } = useAssetContext();

  const sellableAssets = useMemo(
    () => blockchain && assets.get(blockchain)?.filter((asset) => asset.sellable),
    [blockchain, assets],
  );

  return (
    <>
      <StyledModal isVisible={needsUserDataForm} type={StyledModalType.ALERT} color={StyledModalColor.WHITE}>
        <UserDataForm />
      </StyledModal>
      <StyledHorizontalStack gap={5}>
        {!address || !isLoggedIn ? (
          <StyledTabContentWrapper leftBorder>
            <StyledVerticalStack gap={4} marginY={12} center>
              {!address ? (
                <>
                  <p>Please connect your Alby in order to proceed</p>
                  <StyledButton label="Connect to Alby" onClick={login} />
                </>
              ) : (
                <>
                  <p>Please reconnect to DFX in order to proceed</p>
                  <StyledButton label="Reconnect to DFX" onClick={login} />
                </>
              )}
            </StyledVerticalStack>
          </StyledTabContentWrapper>
        ) : (
          <SellTabContentProcess
            asset={sellableAssets?.[0]}
            // #LN-ALBY# add balance here
          />
        )}
      </StyledHorizontalStack>
    </>
  );
}

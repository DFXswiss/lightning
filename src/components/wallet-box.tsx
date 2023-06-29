import { useWalletContext } from '../contexts/wallet.context';
import { useClipboard } from '../hooks/clipboard.hook';
import {
  CopyButton,
  DfxIcon,
  IconVariant,
  StyledButton,
  StyledButtonColor,
  StyledButtonWidth,
  StyledCheckboxRow,
  StyledDataBox,
  StyledDataTextRow,
  StyledModal,
  StyledModalType,
  StyledModalWidth,
  StyledVerticalStack,
} from '@dfx.swiss/react-components';
import { useEffect, useState } from 'react';
import { useStore } from '../hooks/store.hook';
import { useSessionContext } from '@dfx.swiss/react';
import { useQuery } from '../hooks/query.hook';

export function WalletBox(): JSX.Element {
  const { isConnected, setAddress } = useWalletContext();
  const { address, isLoggedIn, login, logout } = useSessionContext();
  const { copy } = useClipboard();
  const { showsSignatureInfo } = useStore();
  const { address: paramAddress, reloadWithoutBlockedParams } = useQuery();
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  function blankedAddress(): string {
    return `${address?.slice(0, 6)}...${address?.slice(address?.length - 5)}`;
  }

  useEffect(() => {
    if (paramAddress) {
      handleLogin();
    }
  }, [paramAddress]);

  async function handleLogin() {
    if (showsSignatureInfo.get()) {
      setShowModal(true);
    } else {
      login();
    }
  }

  function handleLogout() {
    setAddress(undefined);
    logout();
  }

  return (
    <>
      <StyledModal
        type={StyledModalType.ALERT}
        width={StyledModalWidth.SMALL}
        onClose={setShowModal}
        isVisible={showModal}
      >
        <StyledVerticalStack gap={5} center>
          <DfxIcon icon={IconVariant.SIGNATURE_POPUP} />
          <h2>
            Log in to your DFX account by verifying with your signature that you are the sole owner of the provided
            blockchain address.
          </h2>
          <StyledCheckboxRow isChecked={isChecked} onChange={setIsChecked} centered>
            Don't show this again.
          </StyledCheckboxRow>

          <StyledButton
            width={StyledButtonWidth.MD}
            color={StyledButtonColor.RED}
            label="OK"
            onClick={() => {
              setShowModal(false);
              showsSignatureInfo.set(!isChecked);
              if (paramAddress) {
                setAddress(paramAddress);
                reloadWithoutBlockedParams();
              }
            }}
          />
        </StyledVerticalStack>
      </StyledModal>
      {isConnected && (
        <StyledDataBox
          heading="Your Wallet"
          boxButtonLabel={isLoggedIn ? 'Disconnect from DFX' : 'Reconnect to DFX'}
          boxButtonOnClick={() => (isLoggedIn ? handleLogout() : handleLogin())}
        >
          <StyledDataTextRow label="Lightning address">
            {blankedAddress()}
            <CopyButton onCopy={() => copy(address)} inline />
          </StyledDataTextRow>
        </StyledDataBox>
      )}
    </>
  );
}

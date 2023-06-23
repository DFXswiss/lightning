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
import { useState } from 'react';
import { useStore } from '../hooks/store.hook';
import { useSessionContext } from '@dfx.swiss/react';

export function WalletBox(): JSX.Element {
  const { isConnected } = useWalletContext();
  const { address, isLoggedIn, login, logout } = useSessionContext();
  const { copy } = useClipboard();
  const { showsSignatureInfo } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  function blankedAddress(): string {
    return `${address?.slice(0, 6)}...${address?.slice(address?.length - 5)}`;
  }

  async function handleLogin() {
    if (showsSignatureInfo.get()) {
      setShowModal(true);
    } else {
      login();
    }
  }

  return isConnected ? (
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
              login();
            }}
          />
        </StyledVerticalStack>
      </StyledModal>
      <StyledDataBox
        heading="Your Wallet"
        boxButtonLabel={isConnected ? (isLoggedIn ? 'Disconnect from DFX' : 'Reconnect to DFX') : undefined}
        boxButtonOnClick={() => (isConnected ? (isLoggedIn ? logout() : handleLogin()) : undefined)}
      >
        <StyledDataTextRow label="Lightning address">
          {blankedAddress()}
          <CopyButton onCopy={() => copy(address)} inline />
        </StyledDataTextRow>
      </StyledDataBox>
    </>
  ) : (
    <></>
  );
}

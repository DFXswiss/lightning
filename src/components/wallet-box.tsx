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
import { Buffer } from 'buffer';
import { bech32 } from 'bech32';

export function WalletBox(): JSX.Element {
  const { isConnected, setAddress } = useWalletContext();
  const { address, isLoggedIn, login, logout } = useSessionContext();
  const { copy } = useClipboard();
  const { showsSignatureInfo } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isConnected && !isLoggedIn) {
      handleLogin();
    }
  }, [isConnected, isLoggedIn]);

  async function handleLogin() {
    if (showsSignatureInfo.get()) {
      setShowModal(true);
    } else {
      doLogin();
    }
  }

  function doLogin() {
    login().catch(() => setAddress(undefined));
  }

  function handleLogout() {
    setAddress(undefined);
    logout();
  }

  function blankedAddress(): string {
    return `${address?.slice(0, 6)}...${address?.slice(address?.length - 5)}`;
  }

  function wellKnownAddress(): string | undefined {
    if (address?.startsWith('LNURL')) {
      const decoded = bech32.decode(address, 1023);
      const decodedAddress = Buffer.from(bech32.fromWords(decoded.words)).toString('utf8');

      if (decodedAddress.includes('/.well-known/lnurlp/')) {
        const url = new URL(decodedAddress);
        return url.pathname.split('/').pop() + '@' + url.hostname;
      }
    }
  }

  const displayAddress = wellKnownAddress() ?? blankedAddress();
  const copyAddress = wellKnownAddress() ?? address;

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

              doLogin();
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
            {displayAddress}
            <CopyButton onCopy={() => copy(copyAddress)} inline />
          </StyledDataTextRow>
        </StyledDataBox>
      )}
    </>
  );
}

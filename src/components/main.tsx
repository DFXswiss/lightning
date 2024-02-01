import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useWalletContext } from '../contexts/wallet.context';
import DfxTitleSection from './title-section';
import { useBuyTab } from './tabs/buy.tab';
import { UserBox } from './user-box';
import { WalletBox } from './wallet-box';
import {
  DfxLogo,
  DfxVideoHelpModalContent,
  IconSize,
  IconVariant,
  StyledButton,
  StyledButtonColor,
  StyledButtonWidth,
  StyledIconButton,
  StyledLink,
  StyledModal,
  StyledModalType,
  StyledModalWidth,
  StyledTabContainer,
  StyledTabProps,
  StyledVerticalStack,
} from '@dfx.swiss/react-components';
import { useApiSession, useSessionContext, useUserContext } from '@dfx.swiss/react';
import { ConnectButton } from './connect-button';
import { useSellTab } from './tabs/sell.tab';
import { useQuery } from '../hooks/query.hook';
import jwt_decode from 'jwt-decode';

export function Main(): JSX.Element {
  const { isInstalled, isConnected, connect: connectWallet, setAddress } = useWalletContext();
  const { isProcessing, needsSignUp, signUp } = useSessionContext();
  const { register } = useUserContext();
  const [showsHelp, setShowsHelp] = useState(false);
  const [showsUserLink, setShowsUserLink] = useState(false);
  const [showsInstallHint, setShowsInstallHint] = useState(false);
  const { session, reloadWithoutBlockedParams } = useQuery();
  const { updateSession } = useApiSession();

  useEffect(() => {
    register(() => setShowsUserLink(true));
  });

  useEffect(() => {
    if (session) {
      const { address } = jwt_decode<{ address: string }>(session);

      updateSession(session);
      setAddress(address);

      reloadWithoutBlockedParams();
    }
  }, [session]);

  function connect() {
    isInstalled() ? connectWallet() : setShowsInstallHint(true);
  }

  function buildComingSoonTab(title: string): StyledTabProps {
    return {
      title,
      deactivated: true,
      flagWord1: 'Coming',
      flagWord2: 'soon',
      content: undefined,
    };
  }

  return (
    <>
      {/* MODALS */}
      <StyledModal type={StyledModalType.ALERT} isVisible={showsInstallHint}>
        <StyledVerticalStack gap={4}>
          <h1>Please install Alby!</h1>
          <p>
            You need to install the Alby browser extension to be able to use this service. Visit{' '}
            <StyledLink label="getalby.com" url="https://getalby.com" dark /> for more details.
          </p>

          <div className="mx-auto">
            <StyledButton width={StyledButtonWidth.SM} onClick={() => setShowsInstallHint(false)} label="Got it." />
          </div>
        </StyledVerticalStack>
      </StyledModal>

      <StyledModal type={StyledModalType.ALERT} isVisible={needsSignUp}>
        <StyledVerticalStack>
          <h1>Terms and Conditions.</h1>
          <p>
            Please read our terms and conditions and click on ”Next” to confirm and to continue to the DFX Multichain
            Service.
          </p>
          <a
            className="underline underline-offset-2 pt-6 pb-4"
            target="_blank"
            href={process.env.REACT_APP_TNC_URL}
            rel="noopener noreferrer"
          >
            Terms and conditions DFX Swiss.
          </a>
          <div className="mx-auto">
            <StyledButton
              width={StyledButtonWidth.SM}
              color={StyledButtonColor.RED}
              label="Next"
              caps={false}
              onClick={() => signUp()}
              isLoading={isProcessing}
            />
          </div>
        </StyledVerticalStack>
      </StyledModal>

      <StyledModal onClose={setShowsHelp} isVisible={showsHelp} width={StyledModalWidth.FULL_WIDTH} heading="Help">
        <DfxVideoHelpModalContent
          title="Buy and sell Bitcoin Lightning"
          description="We are the crypto exchange you don't need to trust your funds. Your keys, your coins, here is how it works:"
          videoSources={[
            {
              vidSrc: 'https://content.dfx.swiss/video/2023-07-06_Lightning-Intro.mp4',
              thumbSrc: 'https://content.dfx.swiss/video/2023-07-06_Lightning-Intro-Thumb.png',
            },
          ]}
          numCols={1}
        />
      </StyledModal>

      <StyledModal isVisible={showsUserLink} onClose={setShowsUserLink} type={StyledModalType.ALERT}>
        <StyledVerticalStack gap={4}>
          <h1>Welcome back!</h1>
          <p>
            It looks like you already have an account with DFX. We have just sent you an E-Mail. Click on the sent link
            to confirm your mail address.
          </p>
          <div className="mx-auto">
            <StyledButton width={StyledButtonWidth.SM} onClick={() => setShowsUserLink(false)} label="Got it." />
          </div>
        </StyledVerticalStack>
      </StyledModal>

      {/* CONTENT */}
      <div className="text-center p-2 mt-4">
        <div className="max-w-6xl text-left mx-auto ">
          <div className="flex justify-between">
            <a target="_blank" href={process.env.REACT_APP_DFX_URL} rel="noopener noreferrer">
              <DfxLogo />
            </a>
            {!isMobile && (
              <div className={`flex ${isConnected ? 'gap-2' : 'gap-4'} items-center`}>
                {isConnected ? <p className="text-dfxRed-100">How to</p> : <ConnectButton onClick={connect} />}
                <StyledIconButton size={IconSize.LG} icon={IconVariant.HELP} onClick={() => setShowsHelp(true)} />
              </div>
            )}
          </div>
          <div className="md:flex justify-between mt-6">
            <div className="basis-3/5 max-w-[50%] px-6 mx-auto md:mx-0">
              <DfxTitleSection heading="Bitcoin Lightning" subheading="Buy • Sell • Convert" />
            </div>
            {!isMobile && (
              <aside className="basis-2/5 shrink-0 md:min-w-[470px] lg:min-w-[512px] mx-auto md:mx-0">
                <WalletBox />
                <UserBox />
              </aside>
            )}
          </div>
          {!isMobile ? (
            <StyledTabContainer tabs={[useBuyTab(), useSellTab(), buildComingSoonTab('Convert')]} />
          ) : (
            <>
              <p className="text-center py-12">
                Our DFX Lightning Exchange is not yet available on mobile. Visit the DFX Lightning Exchange via your
                computer's web browser.
              </p>
              <p className="text-center pb-24">Please check back later for the mobile version.</p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-40 justify-center pb-4">
          <StyledLink label="Terms and conditions" url={process.env.REACT_APP_TNC_URL} />
          <StyledLink label="Privacy policy" url={process.env.REACT_APP_PPO_URL} />
          <StyledLink label="Imprint" url={process.env.REACT_APP_IMP_URL} />
        </div>
      </div>
    </>
  );
}

import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Blockchain } from '@dfx.swiss/react';
import { useAlby } from '../hooks/alby.hook';
import { useStore } from '../hooks/store.hook';

interface WalletInterface {
  address?: string;
  blockchain?: Blockchain;
  balance?: string;
  isInstalled: () => boolean;
  isConnected: boolean;
  connect: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendPayment: (request: string) => Promise<string>;
  setAddress: (address?: string) => void;
}

const WalletContext = createContext<WalletInterface>(undefined as any);

export function useWalletContext(): WalletInterface {
  return useContext(WalletContext);
}

export function WalletContextProvider(props: PropsWithChildren): JSX.Element {
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const { isInstalled, signMessage: albySignMessage, sendPayment: albySendPayment, enable, isEnabled } = useAlby();
  const { address: storedAddress } = useStore();

  const isConnected = address !== undefined;

  useEffect(() => {
    if (!address) setAddress(storedAddress.get());
  }, []);

  useEffect(() => {
    if (address) {
      // #LN-ALBY# request balance here
    } else {
      setBalance(undefined);
    }
  }, [address]);

  async function connect(): Promise<string> {
    const account = await enable().catch();
    if (!account) throw new Error('Permission denied or account not verified');

    if (account?.node?.pubkey) {
      // log in with pub key
      const address = `LNNID${account.node.pubkey.toUpperCase()}`;
      setAndStoreAddress(address);
      return address;
    } else if (account?.node?.alias?.includes('getalby.com')) {
      // log in with Alby
      const win: Window = window;
      const url = new URL(`${process.env.REACT_APP_API_URL}/auth/alby`);
      url.searchParams.set('redirectUri', win.location.origin);
      win.location = url.toString();
      return '';
    }

    throw new Error('No login method found');
  }

  async function signMessage(message: string): Promise<string> {
    if (!isEnabled) await enable().catch();
    try {
      return await albySignMessage(message).catch();
    } catch (e: any) {
      console.error(e.message, e.code);
      throw e;
    }
  }

  async function sendPayment(request: string): Promise<string> {
    if (!isEnabled) await enable().catch();
    return albySendPayment(request).then((r) => r.preimage);
  }

  function setAndStoreAddress(address?: string) {
    address ? storedAddress.set(address) : storedAddress.remove();
    setAddress(address);
  }

  const context: WalletInterface = {
    address,
    balance,
    blockchain: Blockchain.LIGHTNING,
    isInstalled,
    isConnected,
    connect,
    signMessage,
    sendPayment,
    setAddress: setAndStoreAddress,
  };

  return <WalletContext.Provider value={context}>{props.children}</WalletContext.Provider>;
}

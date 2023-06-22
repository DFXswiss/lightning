import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Blockchain } from '@dfx.swiss/react';

interface WalletInterface {
  address?: string;
  blockchain?: Blockchain;
  balance?: string;
  isInstalled: boolean;
  isConnected: boolean;
  connect: () => Promise<string>;
  signMessage: (message: string, address: string) => Promise<string>;
}

const WalletContext = createContext<WalletInterface>(undefined as any);

export function useWalletContext(): WalletInterface {
  return useContext(WalletContext);
}

export function WalletContextProvider(props: PropsWithChildren): JSX.Element {
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<string>();

  const isConnected = address !== undefined;
  const isInstalled = false; // TODO: #LN-ALBY# check if alby is installed

  useEffect(() => {
    if (address) {
      // TODO: #LN-ALBY#  request balance
    } else {
      setBalance(undefined);
    }
  }, [address]);

  async function connect(): Promise<string> {
    const account = undefined // TODO: #LN-ALBY# request address
    if (!account) throw new Error('Permission denied or account not verified');
    setAddress(account);
    return account;
  }

  async function signMessage(_message: string, _address: string): Promise<string> {
    try {
      return '' // TODO: #LN-ALBY# sign message
    } catch (e: any) {
      console.error(e.message, e.code);
      throw e;
    }
  }

  const context: WalletInterface = {
    address,
    balance,
    blockchain: Blockchain.BITCOIN,  // TODO: #LN-ALBY# blockchain.lightning
    isInstalled,
    isConnected,
    connect,
    signMessage,
  };

  return <WalletContext.Provider value={context}>{props.children}</WalletContext.Provider>;
}

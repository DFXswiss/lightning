import { useState } from 'react';

export interface GetInfoResponse {
  node: {
    alias: string;
    pubkey: string;
    color?: string;
  };
  methods: string[];
}

export interface PaymentResponse {
  paymentHash: string;
  preimage: string;
}

export interface AlbyInterface {
  isInstalled: boolean;
  isEnabled: boolean;
  enable: () => Promise<GetInfoResponse | undefined>;
  signMessage: (msg: string) => Promise<string>;
  sendPayment: (request: string) => Promise<PaymentResponse>;
}

export function useAlby(): AlbyInterface {
  const { webln } = window as any;

  const [isEnabled, setIsEnabled] = useState(false);

  const isInstalled = Boolean(webln);

  function enable(): Promise<GetInfoResponse | undefined> {
    if (!webln) return Promise.reject();
    return webln
      .enable()
      .then(() => webln.getInfo())
      .catch(() => undefined)
      .then((r: GetInfoResponse) => {
        setIsEnabled(r != null);
        return r;
      });
  }

  function signMessage(msg: string): Promise<string> {
    if (!webln) Promise.reject();
    return webln.signMessage(msg).then((r: { signature: string }) => r.signature);
  }

  function sendPayment(request: string): Promise<PaymentResponse> {
    if (!webln) return Promise.reject();
    return webln.sendPayment(request);
  }

  return {
    isInstalled,
    isEnabled,
    enable,
    signMessage,
    sendPayment,
  };
}

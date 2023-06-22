import { useWalletContext } from '../contexts/wallet.context';
import { useQuery } from './query.hook';

interface UrlParamHelperInterface {
  readParamsAndReload: () => void;
}

export function useUrlParamHelper(): UrlParamHelperInterface {
  const { setAddress } = useWalletContext();
  const { address, reloadWithoutBlockedParams } = useQuery();

  function readParamsAndReload() {
    if (address) {
      setAddress(address);
    }
    reloadWithoutBlockedParams();
  }

  return { readParamsAndReload };
}

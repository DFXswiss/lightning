import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface QueryInterface {
  address?: string;
  reloadWithoutBlockedParams: () => void;
}

export function useQuery(): QueryInterface {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const blockedParams = ['address'];

  const query = useMemo(() => new URLSearchParams(search), [search]);

  function getParameter(key: string): string | undefined {
    const value = query.get(key);
    return value !== null ? value : undefined;
  }

  function reloadWithoutBlockedParams() {
    if (blockedParams.map((param) => query.has(param)).every((b) => !b)) return;
    blockedParams.forEach((param) => query.delete(param));
    navigate(`${pathname}?${query.toString()}`);
  }

  return {
    address: getParameter('address'),
    reloadWithoutBlockedParams,
  };
}

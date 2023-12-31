import { DfxContextProvider } from '@dfx.swiss/react';
import { Main } from './components/main';
import { WalletContextProvider, useWalletContext } from './contexts/wallet.context';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

function App() {
  return (
    <WalletContextProvider>
      <AppWrapper />
    </WalletContextProvider>
  );
}

function AppWrapper(): JSX.Element {
  const { signMessage, address, blockchain } = useWalletContext();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Main />,
    },
  ]);

  return (
    <DfxContextProvider api={{ signMessage }} data={{ address, blockchain, walletId: 20 }}>
      <RouterProvider router={router} />
    </DfxContextProvider>
  );
}

export default App;

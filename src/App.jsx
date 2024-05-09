import { useEffect } from 'react';
import './assets/css/grid.css';
import './assets/css/tailwind.css';
import './assets/scss/style.scss';
import Switcher from './components/switcher';
import Router from './routes/index.jsx';
import { SnackbarProvider } from 'notistack';
import { Web3ModalProvider } from './components/Web3ModalProvider';
import ConnectButton from './components/ConnectButton';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';

function App() {
  useEffect(() => {
    if (!document.documentElement.className.includes('dark')) {
      document.documentElement.className = 'dark';
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <Web3ModalProvider>
        <Router />
        <SnackbarProvider />
        {/* <Switcher /> */}
      </Web3ModalProvider>
    </ApolloProvider>
  );
}

export default App;
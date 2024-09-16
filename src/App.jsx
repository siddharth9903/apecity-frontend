import { useEffect } from 'react';
import './assets/css/grid.css';
import './assets/css/tailwind.css';
import './assets/scss/style.scss';
import Router from './routes/index.jsx';
import { SnackbarProvider } from 'notistack';
import { Web3ModalProvider } from './components/web3Components/Web3ModalProvider.jsx';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { Provider } from 'react-redux';
import store from './redux/store.js';

function App() {
  useEffect(() => {
    if (!document.documentElement.className.includes('dark')) {
      document.documentElement.className = 'dark';
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
      <Web3ModalProvider>
        <SnackbarProvider>        
          <Router />
        </SnackbarProvider>
      </Web3ModalProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default App;
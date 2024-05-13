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
        <SnackbarProvider>        
          <Router />
        </SnackbarProvider>
        {/* <Switcher /> */}
      </Web3ModalProvider>
    </ApolloProvider>
  );
}

export default App;


// import { useEffect } from 'react';
// import './assets/css/grid.css';
// import './assets/css/tailwind.css';
// import './assets/scss/style.scss';
// import Router from './routes/index.jsx';
// import { SnackbarProvider } from 'notistack';
// import { Web3ModalProvider } from './components/Web3ModalProvider';
// import { ApolloProvider } from '@apollo/client';
// import client from './graphql/client';
// import Datafeed from './datafeed';

// function App() {
//   useEffect(() => {
//     if (!document.documentElement.className.includes('dark')) {
//       document.documentElement.className = 'dark';
//     }

//     const widgetOptions = {
//       symbol: 'DEX:BTC/USD', // Default symbol
//       interval: '60', // Default interval
//       fullscreen: false,
//       container: 'tv_chart_container',
//       library_path: '/charting_library/',
//       datafeed: Datafeed,
//     };

//     const widget = new window.TradingView().widget(widgetOptions);

//     return () => {
//       if (widget !== null) {
//         widget.remove();
//       }
//     };
//   }, []);

//   return (
//     <ApolloProvider client={client}>
//       <Web3ModalProvider>
//         <SnackbarProvider>
//           <Router />
//           <div id="tv_chart_container" style={{ height: '500px' }}></div>
//         </SnackbarProvider>
//       </Web3ModalProvider>
//     </ApolloProvider>
//   );
// }

// export default App;
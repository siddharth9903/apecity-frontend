import { useEffect } from 'react';
import './assets/css/grid.css';
import './assets/css/tailwind.css';
import './assets/scss/style.scss';
import Switcher from './components/switcher';
import Router from './routes/index.jsx';
function App() {
  useEffect(() => {
    if (!document.documentElement.className.includes("dark")) {
      document.documentElement.className = "dark";
    }
  }, [])
  return (
    <>
      <Router />
      {/* <Switcher /> */}
    </>
  )
}

export default App

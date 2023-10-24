import React from 'react';
import ReactDOM from 'react-dom/client'

import QuotesList from './components/Quotes/QuotesList'
import { SessionContextProvider } from './context/SessionContext';

ReactDOM.createRoot(
  document.getElementById('react-app') as HTMLElement).render(
    <React.StrictMode>
      <SessionContextProvider>
        <QuotesList />
      </SessionContextProvider>
    </React.StrictMode>,
);

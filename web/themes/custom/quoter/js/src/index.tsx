import React from 'react';
import ReactDOM from 'react-dom/client'

import QuotesList from './components/QuotesList'

ReactDOM.createRoot(
  document.getElementById('react-app') as HTMLElement).render(
    <React.StrictMode>
      <QuotesList />
    </React.StrictMode>,
);

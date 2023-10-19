import React from 'react';
import ReactDOM from 'react-dom/client'

import QuotesList from './components/QuotesList'
import QuoteForm from './components/QuoteForm';

ReactDOM.createRoot(
  document.getElementById('react-app') as HTMLElement).render(
    <React.StrictMode>
      <>
        <QuoteForm />
        <QuotesList />
      </>
    </React.StrictMode>,
);

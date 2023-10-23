import React from 'react';
import ReactDOM from 'react-dom/client'

import QuotesList from './components/Quotes/QuotesList'
// import QuoteSuggester from './components/Quotes/QuoteSuggester';

ReactDOM.createRoot(
  document.getElementById('react-app') as HTMLElement).render(
    <React.StrictMode>
      <>
        {/* <QuoteSuggester /> */}
        <QuotesList />
      </>
    </React.StrictMode>,
);

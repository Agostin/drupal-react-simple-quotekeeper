import React from 'react';
import ReactDOM from 'react-dom/client'

import QuotesList from './components/QuotesList'

const Main = () => (
  <QuotesList />
);

ReactDOM.createRoot(
  document.getElementById('react-app')).render(
  <React.StrictMode>
    <Main />,
  </React.StrictMode>
);

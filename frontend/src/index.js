import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Frontend environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

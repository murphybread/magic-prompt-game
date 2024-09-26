import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('Frontend environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

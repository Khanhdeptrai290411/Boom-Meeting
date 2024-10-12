import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';  // Ensure styles are linked, if any

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

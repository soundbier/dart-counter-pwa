
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './global.css'; // <-- Ohne das hier gibt es keinen Darkmode und kein Fullscreen!

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

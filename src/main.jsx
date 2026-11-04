import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import GlobalMapleBackground from './components/GlobalMapleBackground.jsx';
import './styles.css';
import './blade-museum.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalMapleBackground />
    <App />
  </React.StrictMode>
);

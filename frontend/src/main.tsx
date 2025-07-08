import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Create a root for the React application
const root = ReactDOM.createRoot(rootElement!);

// Render the application
root.render(
  // StrictMode is a tool for highlighting potential problems in an application.
  <React.StrictMode>
    {/* The main App component is rendered here */}
    <App />
  </React.StrictMode>
);
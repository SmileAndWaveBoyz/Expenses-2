import React from 'react';
import ReactDOM from 'react-dom/client';
import './normalize.css';
import './styles.css';
import { RouterProvider } from 'react-router-dom';
import { ContextProvider } from './contexts/ContextProvider'; // Import your ContextProvider
import router from './router.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);

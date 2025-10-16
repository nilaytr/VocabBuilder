import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App/App";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
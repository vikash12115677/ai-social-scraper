import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './redux/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e2130',
            color: '#fff',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '12px',
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './ReduxTK/store';
import { Provider } from 'react-redux';
import { ChatProvider } from './ClientCustomHook/ChatProvider';
import { BrowserRouter } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </LocalizationProvider>
  </Provider>
);


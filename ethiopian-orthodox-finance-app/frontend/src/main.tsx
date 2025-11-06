import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './providers/I18nProvider';
import { store } from './state/store';
import { Provider } from 'react-redux';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
        <I18nProvider>
            <App />
        </I18nProvider>
    </Provider>
);
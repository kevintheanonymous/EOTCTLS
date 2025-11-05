import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes';
import { I18nProvider } from './providers/I18nProvider';

function App({ routerOverride }) {
  const router = routerOverride || createBrowserRouter(routes);
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}

export default App;

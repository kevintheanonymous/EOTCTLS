import Dashboard from '../pages/Dashboard';
import Reports from '../pages/Reports';
import Transactions from '../pages/Transactions';

const routes = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/reports',
    element: <Reports />,
  },
  {
    path: '/transactions',
    element: <Transactions />,
  },
];

export default routes;

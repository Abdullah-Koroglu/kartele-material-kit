import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import ClientsPage from './pages/ClientsPage';
import SessionsPage from './pages/SessionsPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import CreateSessionPage from './pages/CreateSessionPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SessionDetail from './pages/SessionDetail';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/app',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/app/calendar" />, index: true },
        { path: 'calendar', element: <DashboardAppPage /> },
        { path: 'create_session', element: <CreateSessionPage /> },
        { path: 'my_session', element: <SessionsPage /> },
        { path: 'my_clients', element: <ClientsPage /> },
        { path: 'session/:id', element: <SessionDetail /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

import { createBrowserRouter } from 'react-router';
import { Root, ProtectedDashboard, ProtectedContacts, ProtectedContactDetail, SignUpOrDashboard, NotFound } from './routes';

export const router = createBrowserRouter([
  {
    path: '/signup',
    Component: SignUpOrDashboard,
  },
  {
    path: '/',
    Component: Root,
    children: [
      { path: 'home', Component: ProtectedDashboard },
      { path: 'contacts', Component: ProtectedContacts },
      { path: 'contacts/:id', Component: ProtectedContactDetail },
      { path: '*', Component: NotFound },
    ],
  },
]);

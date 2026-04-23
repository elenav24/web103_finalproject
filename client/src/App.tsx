import { RouterProvider } from 'react-router';
import { router } from './router';
import { AppProvider } from './store';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

import { HashRouter } from 'react-router';
import { AuthProvider } from './core/context/authContext';
import AppRoutes from './core/routes/routes';

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;

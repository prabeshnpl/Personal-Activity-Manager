import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from './shared/layout/AppLayout';
import { useOrganizationstore } from './features/organization/hooks/useOrganizationstore';
import { Spinner } from './shared/components/Spinner';

function App() {
  const { loadOrganizations, loading } = useOrganizationstore();
  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
    
  );
}

export default App;

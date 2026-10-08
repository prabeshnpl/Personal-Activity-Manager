import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from './shared/layout/AppLayout';
import { useOrganizationstore } from './features/organization/hooks/useOrganizationstore';
import { Spinner } from './shared/components/Spinner';

function App() {
  const { activeOrganization, loadOrganizations, loading } = useOrganizationstore();
  const [organizationsLoaded, setOrganizationsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadWorkspace = async () => {
      try {
        await loadOrganizations();
        if (!cancelled) {
          setOrganizationsLoaded(true);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error);
        }
      }
    };

    loadWorkspace();
    return () => {
      cancelled = true;
    };
  }, [loadOrganizations, retryCount]);

  const retryLoadingWorkspace = () => {
    setLoadError(null);
    setOrganizationsLoaded(false);
    setRetryCount((count) => count + 1);
  };

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-700">
            Could not load your workspace: {loadError.message || 'Please try again.'}
          </p>
          <button
            type="button"
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={retryLoadingWorkspace}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !organizationsLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!activeOrganization?.id) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No organization is available for your account.</p>
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

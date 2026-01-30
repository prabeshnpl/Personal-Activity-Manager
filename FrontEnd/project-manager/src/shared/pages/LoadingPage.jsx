import React from 'react';
import { Spinner } from '../components/Spinner';

export const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading your workspace...</p>
      </div>
    </div>
  );
};
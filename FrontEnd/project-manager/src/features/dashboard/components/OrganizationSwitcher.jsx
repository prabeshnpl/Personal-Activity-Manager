import React, { useState } from 'react';
import { useOrganizationstore } from '../../organization/hooks/useOrganizationstore';
import { ChevronDown, Building2, Plus } from 'lucide-react';
import { useErrorStore } from '../../../stores/errorStore';

export const OrganizationSwitcher = () => {
  const { setError } = useErrorStore();
  const { 
    organizations, 
    activeOrganization, 
    loading, 
    switchOrganization 
  } = useOrganizationstore();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (orgId) => {
    if (orgId === activeOrganization?.id) {
      setIsOpen(false);
      return;
    }

    try {
      setSwitching(true);
      switchOrganization(orgId);
      setIsOpen(false);
      // Optionally reload the page to refresh all data
      window.location.reload();
    } catch (error) {
      alert('Failed to switch organization');
    } finally {
      setSwitching(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      personal: 'Personal',
      family: 'Family',
      business: 'Business'
    };
    return labels[type] || type;
  };

  if (loading || !activeOrganization) {
    return <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={switching}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        <Building2 className="h-5 w-5 text-gray-600" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">
            {activeOrganization.name}
          </span>
          <span className="text-xs text-gray-500">
            {getTypeLabel(activeOrganization.type)}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 py-2">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Your Organizations
              </p>
            </div>
            
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSwitch(org.id)}
                disabled={switching}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between disabled:opacity-50 ${
                  org.id === activeOrganization.id ? 'bg-blue-50' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{org.name}</p>
                  <p className="text-xs text-gray-500">{getTypeLabel(org.type)}</p>
                </div>
                {org.id === activeOrganization.id && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}

            <div className="border-t border-gray-200 mt-2 pt-2">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to create organization page
                }}
                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Organization</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
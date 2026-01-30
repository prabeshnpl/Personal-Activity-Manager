import { useState } from 'react';
import { useOrganizationStore } from '../../../stores/organizationStore';
import {organizationService} from '../services/organizationService';
import { useErrorStore } from '../../../stores/errorStore';

export const useOrganizationstore = () => {
  const {setError} = useErrorStore.getState();
  const [loading, setLoading] = useState(false);
  const {
    organizations,
    activeOrganization,
    setOrganizations,
    switchOrganization,
    addOrganization
  } = useOrganizationStore();

  const loadOrganizations = async () => {
    try {
      console.log('Loading organizations...');
      setLoading(true);
      const data = await organizationService.getUserOrganizations();
      setOrganizations(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load organizations:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchOrganization = async (orgId) => {
    try {
      switchOrganization(orgId);
    } catch (err) {
      console.log("error in handleSwitchOrganization:", err);
      setError(err.message);
      throw err;
    }
  };

  const handleCreateOrganization = async (data) => {
    try {
      const newOrg = await organizationService.createOrganization(data);
      addOrganization(newOrg);
      return newOrg;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    organizations,
    activeOrganization,
    loading,
    loadOrganizations,
    switchOrganization: handleSwitchOrganization,
    createOrganization: handleCreateOrganization,
  };
};
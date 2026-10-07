import { useState } from 'react';
import { useOrganizationStore } from '../../../stores/organizationStore';
import { useOrganizations } from '../hooks/useOrganization';
import { OrganizationDetails } from '../components/OrganizationDetails';
import { MembersList } from '../components/MembersList';
import { Tabs, TabPanel } from '../../../shared/components/tabs/Tabs';
import { Building2, Users, Settings as SettingsIcon } from 'lucide-react';

export const OrganizationPage = () => {
  const { activeOrganization } = useOrganizationStore();
  const {
    members,
    currentMember,
    inviteMember,
    updateMember,
    removeMember,
    updateOrganization,
    canManageMembers,
    canEditOrganization,
  } = useOrganizations();

  const [activeTab, setActiveTab] = useState('details');

  // Define tabs configuration
  const tabs = [
    {
      id: 'details',
      label: 'Organization Details',
      icon: Building2,
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
      // badge: members?.length || 0, Determine count of tabs if needed from backend api
    },
    // Future tabs can be added here
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   icon: SettingsIcon,
    // },
  ];

  if (!activeOrganization) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-900">No active organization selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div>
        <TabPanel isActive={activeTab === 'details'}>
          <OrganizationDetails
            organization={activeOrganization}
            canEdit={canEditOrganization}
            onUpdate={updateOrganization}
          />
        </TabPanel>

        <TabPanel isActive={activeTab === 'members'}>
          <MembersList
            members={members}
            currentMember={currentMember}
            canManageMembers={canManageMembers}
            onInvite={inviteMember}
            onUpdate={updateMember}
            onRemove={removeMember}
          />
        </TabPanel>

        {/* Future tab panels can be added here */}
        {/* <TabPanel isActive={activeTab === 'settings'}>
          <OrganizationSettings />
        </TabPanel> */}
      </div>

      {/* Current User Role Info */}
      {currentMember && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            <strong>Your role:</strong>{' '}
            {currentMember.role.charAt(0).toUpperCase() +
              currentMember.role.slice(1)}
          </p>
          {canManageMembers && (
            <p className="text-xs text-blue-700 mt-1">
              You can manage members and organization settings
            </p>
          )}
        </div>
      )}
      
    </div>
  );
};
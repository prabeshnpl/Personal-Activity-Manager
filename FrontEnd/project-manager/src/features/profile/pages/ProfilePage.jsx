import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from '../components/ProfileHeader';
import { PersonalInformation } from '../components/PersonalInformation';
import { SecuritySettings } from '../components/SecuritySettings';
import { Tabs, TabPanel } from '../../../shared/components/tabs/Tabs';
import { User, Shield } from 'lucide-react';

export const ProfilePage = () => {
  const {
    // sessions,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    changePassword,
    deleteAccount,
    revokeSession
  } = useProfile();

  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: User,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and security settings
        </p>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        onUpdate={updateProfile}
      />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div>
        <TabPanel isActive={activeTab === 'personal'}>
          <PersonalInformation
            onUpdate={uploadProfilePicture}
          />
        </TabPanel>

        {/* <TabPanel isActive={activeTab === 'security'}>
          <SecuritySettings
            sessions={sessions}
            onChangePassword={changePassword}
            onDeleteAccount={deleteAccount}
            onRevokeSession={revokeSession}
          />
        </TabPanel> */}
      </div>
    </div>
  );
};
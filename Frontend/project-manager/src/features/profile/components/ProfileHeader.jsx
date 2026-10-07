import React, { useState } from 'react';
import { Card } from '../../../shared/components/Card';
import { Camera, Mail, Calendar, Shield } from 'lucide-react';
import { ProfilePictureModal } from './ProfilePictureModal';
import { useAuthStore } from '../../../stores/authStore';
import { formatDate } from "@/shared/utils/formatDate";

export const ProfileHeader = ({ onUploadPicture }) => {

  const {user:profile} = useAuthStore();
  const [showPictureModal, setShowPictureModal] = useState(false);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return profile?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200">
                {getInitials()}
              </div>
            )}
            <button
              onClick={() => setShowPictureModal(true)}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 border-2 border-gray-200"
            >
              <Camera className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : 'User Profile'}
            </h1>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profile?.created_at || profile?.date_joined)}</span>
              </div>
              {profile?.is_active && (
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Active Account</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {showPictureModal && (
        <ProfilePictureModal
          currentPicture={profile?.profile_picture}
          onClose={() => setShowPictureModal(false)}
          onUpdate={onUploadPicture}
        />
      )}
    </>
  );
};
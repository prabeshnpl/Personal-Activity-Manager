import React, { useState } from 'react';
import { User, Crown, Shield, MoreVertical, Trash2 } from 'lucide-react';
import Dropdown from '../../../shared/components/Dropdown';

export const MemberCard = ({
  member,
  currentMember,
  canManageMembers,
  onUpdate,
  onRemove,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  const isCurrentUser = member.id === currentMember?.id;
  const canModify = canManageMembers && !isCurrentUser && member.role !== 'owner';

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      owner: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-blue-100 text-blue-800',
      member: 'bg-gray-100 text-gray-800',
    };
    return badges[role] || badges.member;
  };

  const handleRoleChange = async (data) => {
    try {
      setUpdatingRole(true);
      onUpdate.mutate(member.id, data);
      setShowMenu(false);
    } catch {
      alert('Failed to update role');
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove ${member.user.email} from this organization?`)) {
      try {
        onRemove.mutate(member.id);
      } catch {
        alert('Failed to remove member');
      }
    }
    setShowMenu(false);
  };

  const getInitials = () => {
    if (member.user.first_name && member.user.last_name) {
      return `${member.user.first_name[0]}${member.user.last_name[0]}`.toUpperCase();
    }
    return member.user.email.substring(0, 2).toUpperCase();
  };

  const getFullName = () => {
    if (member.user.first_name && member.user.last_name) {
      return `${member.user.first_name} ${member.user.last_name}`;
    }
    return member.user.email;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {getInitials()}
        </div>

        {/* User Info */}
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{getFullName()}</p>
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                You
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{member.user.email}</p>
        </div>
      </div>

      {/* Role and Actions */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {getRoleIcon(member.role)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(
              member.role
            )}`}
          >
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </span>
        </div>

        {canModify && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-200 rounded-lg"
              disabled={updatingRole}
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
              >
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                ></div>
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Update User
                </p>
                {["admin", "member"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    disabled={member.role === role}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                      member.role === role
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
                <hr className="my-2" />
                <button
                  onClick={handleRemove}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove Member</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

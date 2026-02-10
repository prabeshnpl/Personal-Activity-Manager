import React, { useState } from 'react';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Lock, Trash2, AlertTriangle, Monitor } from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';
import { formatDate } from "@/shared/utils/formatDate";

export const SecuritySettings = ({ 
  sessions, 
  onChangePassword, 
  onDeleteAccount,
  onRevokeSession 
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      try {
        await onDeleteAccount.mutateAsync();
      } catch (error) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <>
      <Card title="Security Settings">
        <div className="space-y-6">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-600">Change your password</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              Change
            </Button>
          </div>

          {/* Active Sessions */}
          {sessions && sessions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Active Sessions</span>
              </h3>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.device || 'Unknown Device'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Last active: {formatDate(session.last_activity)}
                      </p>
                    </div>
                    {!session.current && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRevokeSession.mutateAsync(session.id)}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete Account */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Delete Account</h3>
                <p className="text-sm text-red-700 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleDeleteAccount}
                  className="mt-3"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={onChangePassword}
        />
      )}
    </>
  );
};
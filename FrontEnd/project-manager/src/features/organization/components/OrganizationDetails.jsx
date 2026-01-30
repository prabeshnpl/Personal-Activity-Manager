import React, { useState } from 'react';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Building2, Edit2, Calendar, User } from 'lucide-react';
import { EditOrganizationModal } from './EditOrganizationModal';

export const OrganizationDetails = ({ organization, canEdit, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const getTypeLabel = (type) => {
    const labels = {
      personal: 'Personal',
      family: 'Family',
      business: 'Business',
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      family: 'bg-green-100 text-green-800',
      business: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card
        title="Organization Details"
        action={
          canEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowEditModal(true)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )
        }
      >
        <div className="space-y-6">
          {/* Organization Icon and Name */}
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {organization.name}
              </h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getTypeBadgeColor(
                  organization.type
                )}`}
              >
                {getTypeLabel(organization.type)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-base text-gray-900">
                  {formatDate(organization.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Owner</p>
                <p className="text-base text-gray-900">
                  {organization.created_by?.email || 'You'}
                </p>
              </div>
            </div>
          </div>

          {/* Organization ID (for reference) */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">Organization ID</p>
            <p className="text-sm text-gray-700 font-mono">{organization.id}</p>
          </div>
        </div>
      </Card>

      {showEditModal && (
        <EditOrganizationModal
          organization={organization}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};
import { useState } from 'react';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { EmptyState } from '../../../shared/components/EmptyState';
import { MemberCard } from './MemberCard';
import { InviteMemberModal } from './InviteMemberModal';
import { UserPlus, Users } from 'lucide-react';
import { Spinner } from '../../../shared/components/Spinner';
import ErrorState from '../../../shared/components/Error/ErrorState';

export const MembersList = ({
  members,
  currentMember,
  canManageMembers,
  onInvite,
  onUpdate,
  onRemove,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const {data, isLoading, error, refetch} = members;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
        </div>
    );
  }

  if (error){
    return <ErrorState message="Failed to load accounts." onRetry={refetch} />;
  }

  return (
    <>
      <Card
        title={`Members (${data.length})`}
        action={
          canManageMembers && (
            <Button
              size="sm"
              onClick={() => setShowInviteModal(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )
        }
      >
        {data.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No members yet"
            description="Invite team members to collaborate in this organization"
            action={
              canManageMembers && (
                <Button onClick={() => setShowInviteModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {data.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                currentMember={currentMember}
                canManageMembers={canManageMembers}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </Card>

      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onInvite={onInvite}
        />
      )}
    </>
  );
};

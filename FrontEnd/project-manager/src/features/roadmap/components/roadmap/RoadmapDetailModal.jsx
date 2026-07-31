import { useEffect, useMemo, useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Tabs, TabPanel } from '../../../../shared/components/tabs/Tabs';
import { ProgressTracker } from '../progress/ProgressTracker';
import { MilestonesList } from '../milestone/MilestoneList';
import { NotesSection } from '../note/NotesSection';
import { Target, CheckCircle2, BookOpen } from 'lucide-react';
import { Button } from '../../../../shared/components/Button';
import { ConfirmationDialog } from '../../../../shared/components/ConfirmationDialog';
import { MarkdownContent } from '../../../../shared/components/MarkdownContent';
import { useMilestone } from '../../hooks/useMilestone';
import { useRoadmapNotes } from '../../hooks/useRoadmapNotes';
import { useRoadmapProgress } from '../../hooks/useRoadmapProgress';
import { AddMilestoneModal } from '../milestone/AddMilestoneModal';
import { AddNoteModal } from '../note/AddNoteModal';
import { useRoadmap } from '../../hooks/useRoadmap';

export const RoadmapDetailModal = ({
  roadmap,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showCompleteConfirmation, setShowCompleteConfirmation] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const { 
    createMilestone, 
    deleteMilestone, 
    toggleMilestone, 
    useInfiniteMilestones 
  } = useMilestone(roadmap?.id);
  
  const { createNote, updateNote, deleteNote, useInfiniteNotes } = useRoadmapNotes(roadmap?.id);
  const { progress } = useRoadmapProgress(roadmap?.id);
  const [currentStatus, setCurrentStatus] = useState(roadmap?.status);

  useEffect(() => {
    setCurrentStatus(roadmap?.status);
  }, [roadmap?.id, roadmap?.status]);

  const {updateRoadmap} = useRoadmap();
  
  const onUpdate = useMemo(() => ({
    ...updateRoadmap,
    mutate: (variables) => {
      updateRoadmap.mutate(variables, {
        onSuccess: () => {
          setCurrentStatus('completed');
        },
      });
    },
  }), [updateRoadmap]);

  const infiniteMilestones = useInfiniteMilestones();
  const infiniteNotes = useInfiniteNotes();

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BookOpen,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: Target,
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: CheckCircle2,
      badge: infiniteMilestones?.data?.pages[0]?.meta?.total_count || '0',
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: BookOpen,
      badge: infiniteNotes?.data?.pages[0]?.meta?.total_count || '0',
    },
  ];

  const handleAddClick = () => {
    if (activeTab === 'milestones') {
      setShowAddMilestone(true);
    }

    if (activeTab === 'notes') {
      setEditingNote(null);
      setShowAddNote(true);
    }
  };

  const showGlobalAdd = activeTab === 'milestones' || activeTab === 'notes';

  const addButtonLabel = activeTab === 'milestones' ? 'Add Milestone' : 'Add Note';

  const handleCompleteConfirmation = () => {
    onUpdate.mutate({ id: roadmap.id, data: { status: 'completed' } });
    setShowCompleteConfirmation(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4" 
      onClick={onClose}
    >
      <div 
        className="
          bg-white rounded-lg shadow-xl 
          w-full max-w-7xl h-[90vh] 
          overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{roadmap.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            {showGlobalAdd && (
              <Button size="sm" onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" />
                {addButtonLabel}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TabPanel isActive={activeTab === 'progress'}>
            <ProgressTracker progress={progress} roadmap={roadmap} />
          </TabPanel>

          <TabPanel isActive={activeTab === 'overview'}>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
              <div className="text-gray-700">
                {roadmap.description && (
                  <MarkdownContent content={roadmap.description} className="mt-1" />
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Roadmap Status</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Mark this roadmap complete when all planned work is finished.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        currentStatus === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {(currentStatus || roadmap.status || 'active').toUpperCase()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setShowCompleteConfirmation(true)}
                      disabled={currentStatus !== 'active' || onUpdate.isPending}
                    >
                      {onUpdate.isPending ? 'Marking...' : 'Mark as Completed'}
                    </Button>
                  </div>
                </div>
                {onUpdate.isError && (
                  <p className="text-xs text-red-600 mt-2">
                    Failed to update status. Please try again.
                  </p>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel isActive={activeTab === 'milestones'}>
            <MilestonesList
              infiniteMilestones={infiniteMilestones}
              onDelete={deleteMilestone.mutate}
              onToggle={toggleMilestone.mutate}
              showTitle={false}
            />
          </TabPanel>

          <TabPanel isActive={activeTab === 'notes'}>
            <NotesSection
              infiniteNotes={infiniteNotes}
              onDelete={deleteNote}
              onEditNote={(note) => {
                setEditingNote(note);
                setShowAddNote(true);
              }}
              showTitle={false}
            />
          </TabPanel>
        </div>

        {showAddMilestone && (
          <AddMilestoneModal
            roadmapId={roadmap.id}
            onClose={() => setShowAddMilestone(false)}
            onCreate={createMilestone}
          />
        )}

        {showAddNote && (
          <AddNoteModal
            roadmapId={roadmap.id}
            note={editingNote}
            onClose={() => {
              setShowAddNote(false);
              setEditingNote(null);
            }}
            onCreate={createNote}
            onUpdate={updateNote}
          />
        )}

        {showCompleteConfirmation && (
          <ConfirmationDialog
            title="Complete roadmap?"
            message="Are you sure you want to mark this roadmap as completed?"
            confirmLabel="Mark as Completed"
            onConfirm={handleCompleteConfirmation}
            onCancel={() => setShowCompleteConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
};

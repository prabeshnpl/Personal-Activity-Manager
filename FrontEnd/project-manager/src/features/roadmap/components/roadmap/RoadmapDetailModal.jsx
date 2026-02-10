import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabPanel } from '../../../../shared/components/tabs/Tabs';
import { ProgressTracker } from '../progress/ProgressTracker';
import { MilestonesList } from '../milestone/MilestoneList';
import { NotesSection } from '../note/NotesSection';
import { Target, CheckCircle2, BookOpen } from 'lucide-react';
import { MarkdownContent } from '../../../../shared/components/MarkdownContent';
import { useMilestone } from '../../hooks/useMilestone';
import { useRoadmapNotes } from '../../hooks/useRoadmapNotes';
import { useRoadmapProgress } from '../../hooks/useRoadmapProgress';

export const RoadmapDetailModal = ({
  roadmap,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    createMilestone, 
    updateMilestone, 
    deleteMilestone, 
    toggleMilestone, 
    getInfiniteMilestones 
  } = useMilestone(roadmap?.id);
  
  const { createNote, updateNote, deleteNote, getInfiniteNotes } = useRoadmapNotes(roadmap?.id);
  const { progress } = useRoadmapProgress(roadmap?.id);

  const infiniteMilestones = getInfiniteMilestones();
  const infiniteNotes = getInfiniteNotes();

  const milestones = useMemo(() => {
    const pages = infiniteMilestones?.data?.pages || [];
    return pages.flat();
  }, [infiniteMilestones?.data?.pages]);

  const notes = useMemo(() => {
    const pages = infiniteNotes?.data?.pages || [];
    return pages.flat();
  }, [infiniteNotes?.data?.pages]);

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
      badge: milestones.length || '0',
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: BookOpen,
      badge: notes.length || '0',
    },
  ];

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
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TabPanel isActive={activeTab === 'progress'}>
            <ProgressTracker progress={progress} roadmap={roadmap} />
          </TabPanel>

          <TabPanel isActive={activeTab === 'overview'}>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
              <div className="text-gray-700">
                {roadmap.description && (
                  <MarkdownContent content={roadmap.description} className="mt-1" />
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel isActive={activeTab === 'milestones'}>
            <MilestonesList
              infiniteMilestones={infiniteMilestones}
              roadmapId={roadmap.id}
              onCreate={createMilestone}
              onUpdate={updateMilestone}
              onDelete={deleteMilestone.mutate}
              onToggle={toggleMilestone.mutate}
            />
          </TabPanel>

          <TabPanel isActive={activeTab === 'notes'}>
            <NotesSection
              infiniteNotes={infiniteNotes}
              roadmapId={roadmap.id}
              onCreate={createNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          </TabPanel>
        </div>
      </div>
    </div>
  );
};


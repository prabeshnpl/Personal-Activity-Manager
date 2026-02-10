import { useEffect, useRef, useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { AddNoteModal } from '../note/AddNoteModal';
import { Plus, BookOpen} from 'lucide-react';
import { Spinner } from '../../../../shared/components/Spinner';
import ErrorState from '../../../../shared/components/Error/ErrorState';
import NotesList from './NotesList';

export const NotesSection = ({
  infiniteNotes,
  roadmapId,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const {
    data: pages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = infiniteNotes;

  const notes = pages?.pages ? pages.pages.flat() : [];

  const sentinelRef = useRef(null);
  useEffect(() => {
    if (!fetchNextPage) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 1 });

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowAddModal(true);
  };

  const totalCount = Number(pages?.pages?.at(-1)?.meta?.total_count ?? notes.length ?? 0);
  const titleText = totalCount > 0 ? `Learning Notes (${totalCount})` : 'Learning Notes';
  
  return (
    <>
      <Card
        title={titleText}
        action={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorState message="Failed to load notes." onRetry={refetch} />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No notes yet"
            description="Document your learnings and progress"
          />
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <NotesList key={note.id} note={note} onEdit={handleEdit} onDelete={onDelete} />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="flex items-center justify-center mt-6">
            <div ref={sentinelRef} className="h-6"></div>
            {isFetchingNextPage && <Spinner />}
            {!hasNextPage && (
              <div className="text-sm text-gray-500 mt-2">No more notes</div>
            )}
          </div>
        )}
      </Card>

      {showAddModal && (
        <AddNoteModal
          roadmapId={roadmapId}
          note={editingNote}
          onClose={() => {
            setShowAddModal(false);
            setEditingNote(null);
          }}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

import { useEffect, useRef, useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { BookOpen} from 'lucide-react';
import { Spinner } from '../../../../shared/components/Spinner';
import ErrorState from '../../../../shared/components/Error/ErrorState';
import NotesList from './NotesList';
import { NoteDetailModal } from './NoteDetailModal';

export const NotesSection = ({
  infiniteNotes,
  onDelete,
  onEditNote,
  showTitle = true,
}) => {
  const [selectedNote, setSelectedNote] = useState(null);
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

  const handleOpenDetail = (note) => {
    setSelectedNote(note);
  };

  const totalCount = Number(pages?.pages?.at(-1)?.meta?.total_count ?? notes.length ?? 0);
  const titleText = totalCount > 0 ? `Learning Notes (${totalCount})` : 'Learning Notes';
  const cardTitle = showTitle ? titleText : undefined;
  
  return (
    <>
      <Card
        title={cardTitle}
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
              <NotesList
                key={note.id}
                note={note}
                onEdit={onEditNote}
                onDelete={onDelete}
                onOpen={handleOpenDetail}
              />
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

      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onEdit={(note) => {
            setSelectedNote(null);
            onEditNote?.(note);
          }}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

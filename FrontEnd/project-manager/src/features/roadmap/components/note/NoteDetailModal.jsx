import { Calendar, Clock, Edit2, Tag, Trash2, X } from 'lucide-react';
import { Button } from '../../../../shared/components/Button';
import { MarkdownContent } from '../../../../shared/components/MarkdownContent';
import { formatDate } from "@/shared/utils/formatDate";

export const NoteDetailModal = ({ note, onClose, onEdit, onDelete }) => {
  if (!note) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{note.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(note.created_at)}</span>
              </div>
              {note.hours_spent && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{note.hours_spent} hrs</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {note.content ? (
            <MarkdownContent content={note.content} className="text-sm" />
          ) : (
            <p className="text-sm text-gray-500">No content provided.</p>
          )}

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-600 border border-blue-200"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 pt-0 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onEdit?.(note)}
            className="flex-1"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Note
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              if (window.confirm('Delete this note?')) {
                if (onDelete?.mutateAsync) {
                  onDelete.mutateAsync(note.id);
                } else {
                  onDelete?.(note.id);
                }
                onClose();
              }
            }}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Note
          </Button>
        </div>
      </div>
    </div>
  );
};

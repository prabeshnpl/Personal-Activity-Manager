import { Calendar, Clock, Edit2, Trash2, Tag } from 'lucide-react';
import { formatDate } from "@/shared/utils/formatDate";

export default function NotesList({ note, onEdit, onDelete, onOpen }) {
  const previewText = note.content
    ? note.content.replace(/\r?\n/g, ' ').trim()
    : '';
  const trimmedPreview =
    previewText.length > 140 ? `${previewText.slice(0, 137)}...` : previewText;

  return (
    <div
      className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpen?.(note)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900">{note.title}</h4>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(note.date)}</span>
            </div>
            {note.hours_spent && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{note.hours_spent} hrs</span>
              </div>
            )}
          </div>
          {trimmedPreview && (
            <p className="mt-2 text-xs text-gray-600 max-h-10 overflow-hidden">
              {trimmedPreview}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onEdit?.(note);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              if (window.confirm('Delete this note?')) {
                if (onDelete?.mutateAsync) {
                  onDelete.mutateAsync(note.id);
                } else {
                  onDelete?.(note.id);
                }
              }
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {note.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-white rounded text-xs text-blue-600 border border-blue-200"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 bg-white rounded text-xs text-blue-600 border border-blue-200">
              +{note.tags.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

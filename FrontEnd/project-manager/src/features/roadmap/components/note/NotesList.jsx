import { Calendar, Clock, Edit2, Trash2, Tag } from 'lucide-react';
import { MarkdownContent } from '@/shared/components/MarkdownContent';
import { formatDate } from "@/shared/utils/formatDate";

export default function NotesList({id, note, onEdit, onDelete }) {
  return (
    <div
        key={id}
        className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
        >
        <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{note.title}</h4>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(note.date)}</span>
                </div>
                {note.hours_spent && (
                <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{note.hours_spent} hrs</span>
                </div>
                )}
            </div>
            </div>

            <div className="flex items-center space-x-2">
            <button
                onClick={() => handleEdit(note)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded"
            >
                <Edit2 className="h-4 w-4" />
            </button>
            <button
                onClick={() => {
                if (window.confirm('Delete this note?')) {
                    onDelete.mutateAsync(note.id);
                }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            </div>
        </div>

        <MarkdownContent content={note.content} className="mb-3" />

        {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
                <span
                key={index}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-white rounded text-xs text-blue-600 border border-blue-200"
                >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
                </span>
            ))}
            </div>
        )}
        </div>
  );
}
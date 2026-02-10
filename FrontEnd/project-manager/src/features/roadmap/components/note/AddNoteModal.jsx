import { useState, useEffect } from 'react';
import { Button } from '../../../../shared/components/Button';
import { X } from 'lucide-react';
import { DescriptionField } from '../../../../shared/components/DescriptionField';

export const AddNoteModal = ({ roadmapId, note, onClose, onCreate, onUpdate }) => {
  const isEditing = !!note;
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    hours_spent: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        date: note.date,
        hours_spent: note.hours_spent || '',
        tags: note.tags?.join(', ') || '',
      });
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        roadmap: roadmapId,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      };

      if (isEditing) {
        await onUpdate.mutateAsync({ id: note.id, data: payload });
      } else {
        await onCreate.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} note`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Note' : 'Add Learning Note'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Today's Learning: React Hooks"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <DescriptionField
              id="note-content"
              label="Content *"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="What did you learn today? Write your notes here..."
              rows={8}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours Spent
              </label>
              <input
                type="number"
                value={formData.hours_spent}
                onChange={(e) => setFormData({ ...formData, hours_spent: e.target.value })}
                placeholder="e.g., 2"
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., react, hooks, javascript"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : isEditing ? 'Update Note' : 'Add Note'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

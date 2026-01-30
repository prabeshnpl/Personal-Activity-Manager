import { useState, useRef } from 'react';
import { Button } from '../../../shared/components/Button';
import { X, Upload, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';

export const ProfilePictureModal = ({ currentPicture, onClose, onUpload, onDelete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const {user} = useAuthStore();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);
      await onUpload.mutateAsync({ file: selectedFile, userId: user.id });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to upload picture');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile picture?')) {
      try {
        setLoading(true);
        await onDelete.mutateAsync();
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to delete picture');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Profile Picture</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Preview */}
          <div className="flex justify-center">
            {preview || currentPicture ? (
              <img
                src={preview || currentPicture}
                alt="Preview"
                className="h-48 w-48 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="h-48 w-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No image selected
              </div>
            )}
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={() => fileInputRef.current?.click()}disabled={loading}
                className="w-full"
                >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? 'Choose Different Picture' : 'Choose Picture'}
            </Button>
            {selectedFile && (
            <Button
                onClick={handleUpload}
                disabled={loading}
                className="w-full"
            >
                {loading ? 'Uploading...' : 'Upload Picture'}
            </Button>
            )}

            {currentPicture && !selectedFile && (
            <Button
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
                className="w-full"
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Picture
            </Button>
            )}
           </div>

      <p className="text-xs text-gray-500 text-center">
        Recommended: Square image, at least 400x400px, max 5MB
      </p>
    </div>
  </div>
</div>
);
};
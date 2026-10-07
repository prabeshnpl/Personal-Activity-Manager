import { Button } from './Button';

export const ConfirmationDialog = ({
  title = 'Confirm action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => (
  <div
    className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 p-4"
    onClick={onCancel}
  >
    <div
      className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
      onClick={(event) => event.stopPropagation()}
    >
      <h3 id="confirmation-dialog-title" className="text-lg font-semibold text-gray-900">
        {title}
      </h3>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </div>
  </div>
);

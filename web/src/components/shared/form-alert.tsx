import { AlertCircle, X } from 'lucide-react';

export function FormAlert({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div role="alert" className="form-error">
      <AlertCircle size={18} className="mt-0.5" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 rounded hover:bg-danger/10"
          aria-label="Dismiss error"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

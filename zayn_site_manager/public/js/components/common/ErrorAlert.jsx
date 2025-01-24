import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto pl-3"
          >
            <X className="h-5 w-5 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
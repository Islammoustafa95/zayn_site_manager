import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
  </div>
);

export const LoadingOverlay = ({ message = 'Processing...' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;
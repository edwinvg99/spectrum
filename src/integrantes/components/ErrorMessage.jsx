import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-8 mx-auto max-w-2xl">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 text-red-400">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
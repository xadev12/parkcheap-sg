interface EmptyStateProps {
  type: 'idle' | 'empty' | 'error';
  message?: string;
  onRetry?: () => void;
}

export default function EmptyState({ type, message, onRetry }: EmptyStateProps) {
  const configs = {
    idle: {
      icon: (
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M3.375 14.25V6.75m0 0h17.25m-17.25 0V3.375c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v3.375" />
        </svg>
      ),
      title: 'Find cheap parking near you',
      subtitle: 'Enter your destination to discover the most affordable carparks in Singapore.',
    },
    empty: {
      icon: (
        <svg className="w-16 h-16 text-amber-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
      title: 'No carparks found',
      subtitle: message || 'No carparks found nearby. Try expanding your search radius or a different location.',
    },
    error: {
      icon: (
        <svg className="w-16 h-16 text-red-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      ),
      title: 'Something went wrong',
      subtitle: message || 'We couldn\'t fetch parking data. Please try again.',
    },
  };

  const config = configs[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4">{config.icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{config.title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{config.subtitle}</p>
      {type === 'error' && onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium
                     hover:bg-emerald-700 active:bg-emerald-800 transition-colors touch-manipulation"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

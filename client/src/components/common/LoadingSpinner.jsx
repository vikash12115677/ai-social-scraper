export default function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className={`${sizes[size]} border-2 border-white/10 border-t-blue-500 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center z-50 gap-4">
        <div className="w-12 h-12 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return spinner;
}

// src/components/ui/loading-spinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'gray' | 'primary';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'gray', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  const colorClasses = {
    white: 'border-white',
    gray: 'border-gray-600',
    primary: 'border-gray-900'
  };

  return (
    <div 
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

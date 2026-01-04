// src/components/Breadcrumbs.tsx
import { Home, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Breadcrumbs() {
  const location = useLocation();
  
  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
    .filter(segment => segment !== 'app');

  const breadcrumbs = [
    { label: 'Home', path: '/app', icon: Home },
    ...pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: `/app/${pathSegments.slice(0, index + 1).join('/')}`,
      icon: null,
    })),
  ];

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 px-6 py-3 border-b bg-card/30 backdrop-blur-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Link
            to={crumb.path}
            className={`flex items-center gap-2 text-sm font-bold transition-colors hover:text-primary ${
              index === breadcrumbs.length - 1
                ? 'text-foreground pointer-events-none'
                : 'text-muted-foreground'
            }`}
          >
            {crumb.icon && <crumb.icon className="w-4 h-4" />}
            {crumb.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
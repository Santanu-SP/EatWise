import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User, Search } from 'lucide-react';

const ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/recipes', icon: BookOpen, label: 'Recipes' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const isActive = (to) => location.pathname === to;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom bg-dark-800/95 backdrop-blur-lg border-t border-white/5">
      <div className="flex items-stretch justify-around px-2 py-1">
        {ITEMS.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              className={`bottom-nav-item flex-1 rounded-xl transition-all duration-200 ${
                active ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`relative ${active ? 'scale-110' : ''} transition-transform duration-200`}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full" />
                )}
              </div>
              <span className={`text-xs font-medium mt-0.5 ${active ? 'text-orange-400' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Monitor,
  Cpu,
  Users,
  Calendar
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Ambientes', href: '/ambientes', icon: Monitor },
  { name: 'Dispositivos', href: '/dispositivos', icon: Cpu },
  { name: 'Instructores', href: '/instructores', icon: Users },
  { name: 'Jornadas', href: '/jornadas', icon: Calendar },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-md h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5
                    ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  SwatchIcon,
  CalculatorIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export function Layout() {
  const location = useLocation();

  const handleSignOut = async () => {
    console.log('Sign out clicked - currently disabled for testing');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md flex flex-col">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Elite Advisor Tools</h1>
          </div>
          <nav className="mt-4 flex-1">
            {[
              { name: 'Dashboard', href: '/', icon: HomeIcon },
              { name: 'Branding', href: '/branding', icon: SwatchIcon },
              { name: 'Retirement Tax Calculator', href: '/calculator/retirement-tax', icon: CalculatorIcon },
            ].map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-gray-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
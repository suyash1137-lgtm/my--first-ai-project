import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, Settings, LayoutDashboard, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { settings, updateSetting } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobile = () => setMobileOpen((o) => !o);

  const fontSizes = ['normal', 'large', 'xlarge'];
  const currentFontIdx = fontSizes.indexOf(settings.fontSize);

  const increaseFontSize = () => {
    if (currentFontIdx < fontSizes.length - 1) {
      updateSetting('fontSize', fontSizes[currentFontIdx + 1]);
    }
  };
  const decreaseFontSize = () => {
    if (currentFontIdx > 0) {
      updateSetting('fontSize', fontSizes[currentFontIdx - 1]);
    }
  };

  const navLinks = user?.role === 'teacher'
    ? [
        { to: '/teacher', label: 'Admin Panel', icon: <Users size={16} /> },
        { to: '/settings', label: 'Settings', icon: <Settings size={16} /> }
      ]
    : [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { to: '/settings', label: 'Settings', icon: <Settings size={16} /> }
      ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 transition-theme" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={user?.role === 'teacher' ? '/teacher' : '/dashboard'}
            className="flex items-center gap-2 font-bold text-indigo-700 text-lg focus-visible:outline-indigo-600"
            aria-label="Saral Shiksha — Home"
          >
            <BookOpen size={24} aria-hidden="true" />
            <span>Saral Shiksha</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-current={location.pathname.startsWith(link.to) ? 'page' : undefined}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Font size controls */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1" role="group" aria-label="Adjust font size">
              <button
                onClick={decreaseFontSize}
                disabled={currentFontIdx === 0}
                className="text-sm font-bold text-gray-600 hover:text-indigo-600 disabled:opacity-40 px-1"
                aria-label="Decrease font size"
                title="Decrease font size (A-)"
              >
                A−
              </button>
              <span className="text-xs text-gray-400 select-none" aria-hidden="true">|</span>
              <button
                onClick={increaseFontSize}
                disabled={currentFontIdx === fontSizes.length - 1}
                className="text-base font-bold text-gray-600 hover:text-indigo-600 disabled:opacity-40 px-1"
                aria-label="Increase font size"
                title="Increase font size (A+)"
              >
                A+
              </button>
            </div>

            {/* High contrast toggle */}
            <button
              onClick={() => updateSetting('contrast', settings.contrast === 'high-contrast' ? 'standard' : 'high-contrast')}
              className="px-2 py-1 text-xs font-semibold border border-gray-300 rounded-lg hover:border-indigo-400 transition-colors"
              aria-label={`${settings.contrast === 'high-contrast' ? 'Disable' : 'Enable'} high contrast mode`}
              aria-pressed={settings.contrast === 'high-contrast'}
            >
              🎨 Contrast
            </button>

            {/* User info + logout */}
            {user && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <span className="text-sm text-gray-600 hidden lg:block" aria-label={`Logged in as ${user.name}`}>
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                  aria-label="Log out of Saral Shiksha"
                >
                  <LogOut size={15} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav id="mobile-menu" className="md:hidden border-t border-gray-200 py-3 space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2 flex gap-2 flex-wrap">
              <button onClick={decreaseFontSize} disabled={currentFontIdx === 0} className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-40">A−</button>
              <button onClick={increaseFontSize} disabled={currentFontIdx === fontSizes.length - 1} className="text-base border border-gray-300 rounded px-2 py-1 disabled:opacity-40">A+</button>
              <button
                onClick={() => updateSetting('contrast', settings.contrast === 'high-contrast' ? 'standard' : 'high-contrast')}
                className="text-xs border border-gray-300 rounded px-2 py-1"
                aria-pressed={settings.contrast === 'high-contrast'}
              >
                🎨 Contrast
              </button>
              <button onClick={handleLogout} className="text-sm text-red-600 border border-red-200 rounded px-2 py-1">Logout</button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

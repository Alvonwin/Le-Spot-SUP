'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/theme-context';
import { useTranslation } from '@/context/language-context';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { value: 'light' as const, label: t('theme.light'), icon: Sun },
    { value: 'dark' as const, label: t('theme.dark'), icon: Moon },
    { value: 'system' as const, label: t('theme.system'), icon: Monitor },
  ];

  const currentThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const Icon = currentThemeIcon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        aria-label="Toggle theme"
      >
        <Icon className="h-5 w-5 text-slate-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-50">
          {themes.map(({ value, label, icon: ThemeIcon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                theme === value
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-750 hover:text-white'
              }`}
            >
              <ThemeIcon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

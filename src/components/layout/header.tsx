'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { UserNav } from './user-nav';
import { ThemeToggle } from './theme-toggle';
import { useTranslation } from '@/context/language-context';
import { Map, Calendar, Cloud, Users2, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import styles from './header.module.css';

const navigation = [
  { name: 'Carte', href: '/map', icon: Map },
  { name: 'Sessions', href: '/sessions', icon: BookOpen },
  { name: 'Événements', href: '/events', icon: Calendar },
  { name: 'Météo', href: '/weather', icon: Cloud },
  { name: 'Communauté', href: '/community', icon: Users2 },
  { name: 'Guide', href: '/guide', icon: BookOpen },
];

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const { user } = useAuth();
  const pathname = usePathname();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  // Don't show header on map page (it has its own UI)
  if (pathname === '/map') {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Link href="/" className={styles.logoLink}>
            <Logo />
          </Link>

          <nav className={styles.nav}>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                  <Icon className={styles.navIcon} />
                  {item.name}
                </Link>
              );
            })}
            {user && user.email && ['admin@lespot.com', 'contact@lespot.com'].includes(user.email) && (
              <Link
                href="/admin"
                className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}
              >
                <Shield className={styles.navIcon} />
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className={styles.rightSection}>
          <button
            onClick={toggleLanguage}
            className={styles.languageButton}
          >
            {language === 'fr' ? 'EN' : 'FR'}
          </button>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
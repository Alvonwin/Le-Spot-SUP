'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on map page
  if (pathname === '/map') {
    return null;
  }

  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Le Spot SUP</h3>
            <p className="text-sm text-slate-400">
              Plateforme communautaire pour les passionnés de stand-up paddle au Québec.
            </p>
            <p className="text-sm text-slate-400 mt-2">
              250+ spots avec météo en temps réel
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/map" className="text-slate-400 hover:text-white transition-colors">
                  Carte des spots
                </Link>
              </li>
              <li>
                <Link href="/weather" className="text-slate-400 hover:text-white transition-colors">
                  Météo
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-slate-400 hover:text-white transition-colors">
                  Guide de sécurité
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-slate-400 hover:text-white transition-colors">
                  Communauté
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:lespotsup@gmail.com"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                lespotsup@gmail.com
              </a>
              <p className="text-slate-500 mt-4">
                Créé par Alain Gagné
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-400">
          <p className="flex items-center justify-center gap-2">
            © 2025 Le Spot SUP - Alain Gagné. Tous droits réservés.
          </p>
          <p className="flex items-center justify-center gap-1 mt-2 text-slate-500">
            Fait avec <Heart className="h-4 w-4 text-red-500" fill="currentColor" /> pour la communauté SUP du Québec
          </p>
        </div>
      </div>
    </footer>
  );
}

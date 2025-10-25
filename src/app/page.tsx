'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/layout/logo';
import styles from './page.module.css';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <main className={styles.hero}>
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Paddle sur l'océan au coucher de soleil"
            fill
            className={styles.heroImage}
            priority
          />
        )}
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Trouvez le Spot de Paddle Idéal.
          </h1>
          <p className={styles.heroSubtitle}>
            Le Spot SUP vous aide à trouver les meilleurs endroits pour faire du stand-up paddle, grâce à l'IA et à une communauté d'explorateurs.
          </p>
          <Link href="/map" className={styles.heroButton}>
            Explorer la Carte
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <div className={styles.featuresBadge}>
              Caractéristiques Clés
            </div>
            <h2 className={styles.featuresTitle}>
              Tout ce Dont Vous Avez Besoin pour Votre Prochaine Aventure
            </h2>
            <p className={styles.featuresSubtitle}>
              De la carte interactive aux recommandations par IA, nous avons tout prévu.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                📍
              </div>
              <h3 className={styles.featureTitle}>Carte Interactive</h3>
              <p className={styles.featureDescription}>
                Explorez les spots de paddle du monde entier. Consultez les détails, les photos et les commodités en un coup d'œil.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                🤖
              </div>
              <h3 className={styles.featureTitle}>Recommandations par IA</h3>
              <p className={styles.featureDescription}>
                Notre IA vous suggère les meilleurs spots en fonction de la météo, de votre niveau et de vos préférences.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                🌊
              </div>
              <h3 className={styles.featureTitle}>Piloté par la Communauté</h3>
              <p className={styles.featureDescription}>
                Ajoutez de nouveaux spots, partagez vos expériences et faites partie de la communauté mondiale du paddle.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                📊
              </div>
              <h3 className={styles.featureTitle}>Registre de Sessions</h3>
              <p className={styles.featureDescription}>
                Enregistrez vos sorties, suivez vos performances et recevez des conseils de notre coach IA pour vous améliorer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerText}>
          <Logo />
          <p>© 2025 Le Spot SUP. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

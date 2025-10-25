import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Image
        src="/logo.ico"
        alt="Le Spot SUP Logo"
        width={32}
        height={32}
        style={{ width: '2rem', height: '2rem' }}
      />
      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Le Spot SUP</span>
    </div>
  );
}
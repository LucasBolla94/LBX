'use client';

import React from 'react';

const HistoryBadge = () => {
  return (
    <div
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}
    >
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🌌 Your LBX Journey</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Every level shows your progress. The more <code>$LBXO</code> you hold, the more you grow and earn in the LBX universe.
      </p>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        <li><strong>🌟 Stardust:</strong> Just joined. Your journey begins!</li>
        <li><strong>🧭 Explorer:</strong> Learning and exploring LBX.</li>
        <li><strong>✨ Starborn:</strong> Active and getting noticed.</li>
        <li><strong>🌐 Nova Core:</strong> Trusted member with real impact.</li>
        <li><strong>👑 Cosmos Overlord:</strong> Elite level. Big rewards and influence.</li>
        <li><strong>💫 Celestial Apex:</strong> Rare. Reached with true dedication.</li>
        <li><strong>🛸 Quantum Ascendant:</strong> Legendary. The top of the galaxy!</li>
        <li><strong>🛡 Infinity Warden:</strong> LBX staff & mods. Protect the mission.</li>
        <li><strong>⚡ Aether:</strong> The founders. Visionaries behind it all.</li>
      </ul>

      <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        🚀 Ready to level up?
      </p>
    </div>
  );
};

export default HistoryBadge;

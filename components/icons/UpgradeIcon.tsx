import React from 'react';

const UpgradeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-6.35-6.35a8.5 8.5 0 1112.7 0L12 21.35z" clipRule="evenodd" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.65l-2.05-2.05a2.83 2.83 0 014.1 0L12 17.65z" />
  </svg>
);

export default UpgradeIcon;
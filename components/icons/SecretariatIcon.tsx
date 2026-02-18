import React from 'react';

const SecretariatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V10a2 2 0 00-2-2H7a2 2 0 00-2 2v11m14 0h2m-2 0h-4m-4 0H3m16 0V7a2 2 0 00-2-2H7a2 2 0 00-2 2v3m14 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v5m14 0h-4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11h.01M12 14h.01M12 17h.01" />
  </svg>
);

export default SecretariatIcon;
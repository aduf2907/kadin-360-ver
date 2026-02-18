import React from 'react';

const BusinessAdvisorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h2m4 0h-2m-1-4.5a9 9 0 00-11.83-6.06M12 21a9 9 0 01-6.06-11.83" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 19l-2-2m-1-1l-2-2m-1-1l-2-2" />
  </svg>
);

export default BusinessAdvisorIcon;

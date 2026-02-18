import React from 'react';

const MembershipCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-4m-2 4h.01M12 12h.01M12 16h.01M16 6a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default MembershipCardIcon;

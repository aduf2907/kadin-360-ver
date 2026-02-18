import React from 'react';

const MyStoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-2 3h4l-2 3" />
  </svg>
);

export default MyStoryIcon;
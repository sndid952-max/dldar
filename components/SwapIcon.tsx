
import React from 'react';

const SwapIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M17 2.1l4 4-4 4" />
      <path d="M21 6.1H7.5a4.5 4.5 0 0 0 0 9H12" />
      <path d="M7 21.9l-4-4 4-4" />
      <path d="M3 17.9h13.5a4.5 4.5 0 0 0 0-9H12" />
    </svg>
  );
};

export default SwapIcon;

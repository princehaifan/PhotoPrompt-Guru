
import React from 'react';

export const CopyIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export const CheckIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const WandSparklesIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m22 17-5-5"/>
    <path d="m17 22-5-5"/>
    <path d="m2 17 5-5"/>
    <path d="m7 2 5 5"/>
    <path d="M12 22v-2"/>
    <path d="M22 12h-2"/>
    <path d="M12 2v2"/>
    <path d="M2 12h2"/>
    <path d="m19.1 4.9-1.4 1.4"/>
    <path d="m4.9 19.1-1.4 1.4"/>
    <path d="m19.1 19.1-1.4-1.4"/>
    <path d="m4.9 4.9-1.4-1.4"/>
    <circle cx="12" cy="12" r="1"/>
  </svg>
);

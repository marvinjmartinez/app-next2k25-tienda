// src/components/logo-tienda.tsx
import React from 'react';

// Simplified SVG content of the logo
export const LogoTienda = ({ width = 40, height = 40, className = '' }: { width?: number, height?: number, className?: string }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 110 110"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M55 5C27.4 5 5 27.4 5 55s22.4 50 50 50 50-22.4 50-50S82.6 5 55 5zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"
      fill="#F57F20"
    />
    <path
      d="M55 25c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"
      fill="#1A3357"
    />
    <path
      d="M55 35c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z"
      fill="#FFFFFF"
    />
  </svg>
);

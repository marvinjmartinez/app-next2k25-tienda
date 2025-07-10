// src/components/logo-tienda.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface LogoTiendaProps {
  className?: string;
}

export function LogoTienda({ className }: LogoTiendaProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 150"
      className={cn(className)}
      // Set a default size, can be overridden by className
      width="57" 
      height="40"
    >
      {/* Orange Base */}
      <path fill="#f28c28" d="M0 130 H200 V150 H0 z" />
      
      {/* Dark Blue Strap */}
      <path fill="#1e3a5f" d="M10 105 H190 C195.523 105 200 109.477 200 115 V125 C200 130.523 195.523 135 190 135 H10 C4.47715 135 0 130.523 0 125 V115 C0 109.477 4.47715 105 10 105 z" />

      {/* Orange Helmet */}
      <path fill="#f28c28" d="M30 105 C30 47.0863 77.0863 0 135 0 L65 0 C29.1015 0 0 29.1015 0 65 V105 H30 z" transform="translate(0, 5)" />
      <path fill="#f28c28" d="M170 105 C170 47.0863 122.914 0 65 0 L135 0 C170.899 0 200 29.1015 200 65 V105 H170 z" transform="translate(0, 5)" />
      <path fill="#f28c28" d="M65 5 H135 V30 H65 z" />
      
      {/* White line on top */}
      <path fill="#ffffff" d="M95 10 H105 V25 H95 z" />

      {/* Headlamp */}
      <circle fill="#1e3a5f" cx="100" cy="77" r="40" />
      <circle fill="#ffffff" cx="100" cy="77" r="32" />
      <path fill="#1e3a5f" d="M100 55 A 22 22 0 0 1 122 77 A 22 22 0 0 1 100 99" />
    </svg>
  );
}

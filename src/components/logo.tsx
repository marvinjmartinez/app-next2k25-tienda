// src/components/logo.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // no custom props
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 160 55"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      {...props}
    >
      <g>
        {/* Casco */}
        <path
          d="M45.6,2.1c-14.8,0-27.4,8.4-33.5,20.4C5.9,25.8,2,30.7,2,36.5c0,1.2,0.1,2.3,0.4,3.4h78.3c0.3-1.1,0.4-2.2,0.4-3.4c0-5.8-3.9-10.7-10.1-14.1C65,10.5,53.4,2.1,45.6,2.1z"
          fill="#F97316"
        />
        <path
          d="M42,0h7.2c1.3,0,2.4,1.1,2.4,2.4v11.3c0,1.3-1.1,2.4-2.4,2.4H42c-1.3,0-2.4-1.1-2.4-2.4V2.4C39.6,1.1,40.7,0,42,0z"
          fill="#F97316"
        />
        <path
          d="M45.6,2.1c-1.9,0-3.7,0.2-5.5,0.6c-0.1,0-0.2,0-0.2,0.1c-1.7,2-3,4.4-3.8,7.1c-0.1,0.2-0.1,0.5,0,0.7c0.8,2.7,2.1,5.1,3.8,7.1c0.1,0.1,0.2,0.2,0.4,0.2c1.9,0.3,3.8,0.5,5.7,0.5c9.2,0,17.4-4.8,22.1-12.1C63.1,7,54.8,2.1,45.6,2.1z"
          fill="#FB923C"
        />
        <rect x="44.2" y="3.8" width="2.4" height="6.4" rx="1.2" fill="white" />
        
        {/* Cinta y Lámpara */}
        <path
          d="M17.8,31.2c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.4,0.1-0.8,0.2-1.2h56.4c0.2,0.4,0.3,0.8,0.3,1.2c0,0.2,0,0.4-0.1,0.6H17.8z"
          fill="#F97316"
        />
        <rect y="31.2" x="14" height="6" width="63.2" rx="3" fill="#1E3A8A" />
        <rect x="18" y="34.2" width="10" height="1.8" rx="0.9" fill="white" fillOpacity="0.5" />
        
        <circle cx="45.6" cy="27.2" r="10.5" fill="#1E3A8A"/>
        <circle cx="45.6" cy="27.2" r="9" fill="#1C4ED8"/>
        <circle cx="45.6" cy="27.2" r="7" fill="white"/>
        <path
          d="M42.2,25.4c-1.2-1.2-1.2-3.1,0-4.2c0.6-0.6,1.3-0.9,2.1-0.9c0,0,0,0,0,0c-1.5-0.5-3.1-0.8-4.8-0.8c-4.9,0-8.8,4-8.8,8.8c0,1.7,0.5,3.3,1.3,4.6c-0.1-0.2-0.2-0.4-0.2-0.7c0-1.8,1.5-3.3,3.3-3.3C40.1,29.1,41.2,27.7,42.2,25.4z"
          fill="#4338CA"
        />

        {/* Texto */}
        <text
          x="45.6"
          y="52"
          fontFamily="Montserrat, sans-serif"
          fontSize="16"
          fontWeight="bold"
          fill="hsl(var(--primary))"
          textAnchor="middle"
        >
          DISTRIMIN
        </text>
      </g>
    </svg>
  );
}

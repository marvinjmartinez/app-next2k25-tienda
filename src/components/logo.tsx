// src/components/logo.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // no custom props
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 55"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      {...props}
    >
      <g transform="scale(0.6) translate(10 0)">
        {/* Casco */}
        <path
          d="M45.6,2.1c-14.8,0-27.4,8.4-33.5,20.4C5.9,25.8,2,30.7,2,36.5c0,1.2,0.1,2.3,0.4,3.4h78.3c0.3-1.1,0.4-2.2,0.4-3.4c0-5.8-3.9-10.7-10.1-14.1C65,10.5,53.4,2.1,45.6,2.1z"
          fill="hsl(var(--primary))"
        />
        <path
          d="M42,0h7.2c1.3,0,2.4,1.1,2.4,2.4v11.3c0,1.3-1.1,2.4-2.4,2.4H42c-1.3,0-2.4-1.1-2.4-2.4V2.4C39.6,1.1,40.7,0,42,0z"
          fill="hsl(var(--primary))"
        />
        
        {/* Cinta y Lámpara */}
        <path
          d="M17.8,31.2c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.4,0.1-0.8,0.2-1.2h56.4c0.2,0.4,0.3,0.8,0.3,1.2c0,0.2,0,0.4-0.1,0.6H17.8z"
          fill="hsl(var(--primary))"
        />
        <rect y="31.2" x="14" height="6" width="63.2" rx="3" fill="hsl(var(--accent))" />
        <rect x="18" y="34.2" width="10" height="1.8" rx="0.9" fill="white" fillOpacity="0.5" />
        
        <circle cx="45.6" cy="27.2" r="10.5" fill="hsl(var(--accent))"/>
        <circle cx="45.6" cy="27.2" r="9" fill="#1C4ED8"/>
        <circle cx="45.6" cy="27.2" r="7" fill="white"/>
        <path
          d="M42.2,25.4c-1.2-1.2-1.2-3.1,0-4.2c0.6-0.6,1.3-0.9,2.1-0.9c0,0,0,0,0,0c-1.5-0.5-3.1-0.8-4.8-0.8c-4.9,0-8.8,4-8.8,8.8c0,1.7,0.5,3.3,1.3,4.6c-0.1-0.2-0.2-0.4-0.2-0.7c0-1.8,1.5-3.3,3.3-3.3C40.1,29.1,41.2,27.7,42.2,25.4z"
          fill="#4338CA"
        />
      </g>
    </svg>
  );
}

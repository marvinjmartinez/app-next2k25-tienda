// src/components/logo-tienda.tsx
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface LogoTiendaProps {
  className?: string;
}

export function LogoTienda({ className }: LogoTiendaProps) {
  return (
    <Image
      src="/logo-tienda.png"
      alt="Distrimin SAS Logo"
      width={57}
      height={40}
      className={cn(className)}
      priority // Cargar el logo rápidamente
    />
  );
}

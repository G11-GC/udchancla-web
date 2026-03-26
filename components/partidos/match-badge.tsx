'use client';
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EscudoProps {
  nombre: string;
  escudo?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  tipo?: "circular" | "cuadrado" | "rectangular";
  showIniciales?: boolean;
  className?: string;
  imgClassName?: string;
  imageProps?: Partial<ImageProps>;
}

export default function Escudo({
  nombre,
  escudo = null,
  size = "md",
  tipo = "cuadrado",
  showIniciales = true,
  className = "",
  imgClassName = "",
  imageProps = {},
}: EscudoProps) {
  const [imgError, setImgError] = useState(false);

  const getIniciales = () => {
    const palabras = nombre.trim().split(/\s+/);
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const iniciales = getIniciales();

  const sizeMap = {
    xs:  { contenedor: "w-8 h-8",   px: 32,  texto: "text-xs"  },
    sm:  { contenedor: "w-12 h-12", px: 48,  texto: "text-sm"  },
    md:  { contenedor: "w-16 h-16", px: 64,  texto: "text-lg"  },
    lg:  { contenedor: "w-20 h-20", px: 80,  texto: "text-xl"  },
    xl:  { contenedor: "w-24 h-24", px: 96,  texto: "text-2xl" },
  };

  const tipoMap = {
    circular:    "rounded-full",
    cuadrado:    "rounded-lg",
    rectangular: "rounded-md",
  };

  const isCustomSize = typeof size === "number";
  const containerSize = isCustomSize ? { width: `${size}px`, height: `${size}px` } : {};

  const containerClasses = cn(
    "flex items-center justify-center overflow-hidden",
    !isCustomSize && sizeMap[size as keyof typeof sizeMap]?.contenedor,
    tipoMap[tipo],
    "bg-gray-600/20",
    className
  );

  const textClasses = cn(
    "font-bold",
    !isCustomSize && sizeMap[size as keyof typeof sizeMap]?.texto
  );

  const getImageSrc = () => {
    if (!escudo) return null;
    if (escudo.startsWith('http://') || escudo.startsWith('https://')) return escudo;
    if (escudo.startsWith('/')) return escudo;
    return `/images/${escudo}`;
  };

  const imageSrc = getImageSrc();
  const imgPx = isCustomSize
    ? size as number
    : sizeMap[size as keyof typeof sizeMap]?.px ?? 64

  const showImage = imageSrc && !imgError;

  return (
    <div
      className={containerClasses}
      style={isCustomSize ? containerSize : {}}
      title={nombre}
    >
      {showImage ? (
        <Image
          src={imageSrc}
          alt={`Escudo de ${nombre}`}
          width={imgPx}
          height={imgPx}
          className={cn("object-cover w-full h-full", imgClassName)}
          onError={() => setImgError(true)}
          {...imageProps}
        />
      ) : (
        showIniciales && <span className={textClasses}>{iniciales}</span>
      )}
    </div>
  );
}
import Image from "next/image";

export default function Fondo() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transform transition-all duration-500 blur-xs md:blur-none">
            
            <div className="absolute top-15 -right-45 md:top-0 md:-right-20 opacity-10 rotate-15">
                <Image
                    src="/images/chancla_badge.svg" // Asegúrate de que empiece por /
                    alt="Escudo de fondo"
                    width={700} 
                    height={700}
                    className="object-contain"
                />
            </div>
            <div className="absolute inset-0 bg-lineal-to-tl from-primary/40 via-transparent to-transparent" />
        </div>
    );
}
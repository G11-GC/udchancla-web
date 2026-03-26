import Image from "next/image";
import { getPosicionEquipo } from "@/lib/equipos/equipos-actions";
export default async function ChanclaCurrentPosition() {
    const id_chancla = process.env.ID_EQUIPO_CHANCLA as string;
    const posicionChancla = await getPosicionEquipo(Number(id_chancla), 1);

    return (
        <div className="flex flex-col card card-border border-primary/40 bg-base-200/40 --font-montserrat-bold m-4 p-4">
            <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg shadow-lg shadow-red-500/20">
                    <Image src="/icons/trophy.svg" alt="Pelota" width={20} height={20} className="invert grayscale constrast-50" />
                </div>
                <div>
                    <p className="uppercase text-primary text-center text-xl">Posición actual</p>
                    <h3 className="font-medium text-sm">UD CHANCLA</h3>
                </div>
            </div>
            <div className="card-body flex flex-row justify-center items-center gap-4">
                <Image src="/images/chancla_badge.svg" alt="Escudo UD La Chancla" width={80} height={80} />
                <div className="text-center text-8xl font-bold">
                    <span className="text-amber-500">{posicionChancla}º</span>
                </div>
            </div>
        </div>
    );
}
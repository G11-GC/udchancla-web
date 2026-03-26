import { User, NotebookPen, LogOut } from "lucide-react"
import Image from "next/image"

export default function Profile() {
    return (
        <div className="flex gap-2">
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <Image
                            alt="Tailwind CSS Navbar component"
                            className="rounded-box"
                            src="https://www.svgrepo.com/show/512697/profile-1341.svg"
                            width={10}
                            height={10}
                        />
                    </div>
                </div>
                <ul
                    tabIndex={-1}
                    className="menu menu-sm dropdown-content bg-base-200 text-neutral rounded-box z-100 mt-3 min-w-55 p-2 shadow "
                >
                    <li>
                        <a>
                        <User className="w-4 h-4" /> Mi perfil
                        </a>
                    </li>
                    <li className="inline-flex w-full items-start justify-between">
                        <a><NotebookPen className="w-4 h-4" />Fichas de partido <span className="badge badge-xs badge-secondary">Pendiente</span></a>
                        
                    </li>
                    <li>
                        <a><LogOut className="w-4 h-4" />Cerrar sesión</a>
                    </li>
                </ul>
            </div>
        </div>)
}
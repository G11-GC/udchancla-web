"use client"

import type React from "react"

import { TableProperties, MenuIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Profile from "@/components/menu_elements/profile";

const navItems = [
  {
    href: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className="size-4 shrink-0"
      >
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
    ),
    label: "Homepage",
    tooltip: "Homepage",
  },
  {
    href: "/clasificacion",
    icon: (
      <TableProperties
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        className="size-4 shrink-0"
      />
    ),
    label: "Clasificación",
    tooltip: "Clasificación",
  },
  {
   href: "/partidos",
icon: (
  <Image
    src="/icons/pitch_edit2.svg" 
    alt="Partidos" 
    width={24}
    height={24}
    className="size-4 shrink"
  />
  
),
label: "Partidos",
tooltip: "Partidos",
  },
]

export function Menu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar at the top - fixed */}
      <div className="navbar bg-primary text-primary-content shadow-sm shrink-0 z-50">
        <div className="flex-1 flex items-center gap-3">
          <label htmlFor="my-drawer-4" className="btn btn-ghost btn-circle drawer-button md:hidden swap swap-rotate">
            <input type="checkbox" className="hidden peer" />
            <MenuIcon className="h-5 w-5 stroke-current" />
          </label>
          <Image
            src="/images/chancla_badge.svg"
            alt="UDC"
            width={42}
            height={42}
            className="shrink-0 transition-all duration-300"
            loading="eager"
          />
          <span className="text-2xl font-bold --font-montserrat-bold">UD CHANCLA</span>
        </div>
        <Profile />
      </div>

      <div className="drawer md:drawer-open flex-1 overflow-hidden">
        <input 
        id="my-drawer-4" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={drawerOpen} 
        onChange={(e) => setDrawerOpen(e.target.checked)} />

        <div className="drawer-content overflow-y-auto h-full">{children}</div>

        <div className="drawer-side z-30 pt-16 md:pt-0 h-full md:is-drawer-close:overflow-visible">
          <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay md:hidden"></label>
          <div className="w-full md:is-drawer-close:w-14 md:is-drawer-open:w-64 bg-primary md:bg-base-200 flex flex-col items-start h-full transition-all duration-300 ease-in-out">
           <ul className="menu w-full grow text-primary-content md:text-base-content pt-4 md:gap-2 gap-4">
  {navItems.map((item) => (
    <li key={item.href}>
      <Link
        href={item.href}
        className={`
          /* Estilos base comunes */
          flex items-center gap-3 p-2 rounded-lg transition-all duration-200 w-full
          
          /* Móvil: se muestra solo en móvil, colores primary */
          md:hidden
          ${pathname === item.href ? "bg-white text-black md:bg-primary-focus" : "active:bg-base-200 md:hover:bg-primary-focus"}
        `}
        onClick={() => setDrawerOpen(false)}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>

      <Link
        href={item.href}
        className={`
          /* Escritorio: se muestra solo en escritorio, tooltips, colores base */
          hidden md:flex is-drawer-close:tooltip is-drawer-close:tooltip-right items-center gap-3
          ${pathname === item.href
            ? "bg-base-300 text-base-content hover:bg-primary hover:text-primary-content"
            : "hover:bg-base-300"
          }
        `}
        data-tip={item.tooltip}
      >
        {item.icon}
        <span className="is-drawer-close:hidden whitespace-nowrap">{item.label}</span>
      </Link>
    </li>
  ))}
</ul>

            <div className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right hidden md:block" data-tip="Open">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180 transition-all duration-300 ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="inline-block size-4 my-1.5"
                >
                  <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                  <path d="M9 4v16"></path>
                  <path d="M14 10l2 2l-2 2"></path>
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

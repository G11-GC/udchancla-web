'use client';

import {TableProperties} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-4 shrink-0">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
    ),
    label: 'Homepage',
    tooltip: 'Homepage',
  },
  {
    href: '/clasificacion',
    icon: (
      <TableProperties viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-4 shrink-0"/>
    ),
    label: 'Clasificación',
    tooltip: 'Clasificación',
  },
];

export function Sidebar( {children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  return (
<div className="drawer drawer-open">
  <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content place-content-center">
    {children}
  </div>

  <div className="drawer-side is-drawer-close:overflow-visible">
    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
    <div className="is-drawer-close:w-14 is-drawer-open:w-64 bg-drawer flex flex-col items-start min-h-full transition-all duration-300 ease-in-out">
      {/* Sidebar content here */}
     <ul className="menu w-full grow">
  {/* HEADER del Sidebar */}
  <li className="mb-4">
    <Link href="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right bg-primary hover:bg-primary-focus transition-all duration-200 rounded-box flex items-center justify-center is-drawer-open:justify-start is-drawer-open:px-3 is-drawer-open:py-3 is-drawer-close:p-2" data-tip="Homepage">
      <div className="flex items-center gap-3">
        <Image 
          src="/images/chancla_badge.svg" 
          alt="UDC" 
          width={42} 
          height={42}
          className="shrink-0 is-drawer-close:size-10 is-drawer-open:size-10 transition-all duration-300"
          loading = "eager"
        />
        <span className="is-drawer-close:hidden is-drawer-open:opacity-100 is-drawer-open:translate-x-0 is-drawer-close:-translate-x-2 transition-all duration-300 ease-out text-lg font-bold text-primary-content whitespace-nowrap --font-montserrat-bold">
          UD CHANCLA
        </span>
      </div>
    </Link>
  </li>

  {/* NAVEGACIÓN PRINCIPAL */}
  {navItems.map((item, index) => (
    <li key={item.href} className={index === 0 ? 'mb-2' : ''}>
      <Link 
        href={item.href}
        className={`is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-3 p-2 rounded-lg transition-all duration-200 justify-center is-drawer-open:justify-start ${
          pathname === item.href 
            ? 'bg-drawer-selected text-primary hover:bg-primary hover:text-primary-content' 
            : 'hover:bg-base-100'
        }`}
        data-tip={item.tooltip}
      >
        {item.icon}
        <span className="is-drawer-close:hidden is-drawer-open:opacity-100 is-drawer-open:translate-x-0 is-drawer-close:-translate-x-2 transition-all duration-300 ease-out whitespace-nowrap">
          {item.label}
        </span>
      </Link>
    </li>
  ))}
</ul>

      {/* button to open/close drawer */}
      <div className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
        <label htmlFor="my-drawer-4" className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-180 transition-all duration-300 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="inline-block size-4 my-1.5"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
        </label>
      </div>

    </div>
  </div>
</div>
  );
}
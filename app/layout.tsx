import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans, Jost, Montserrat, Nova_Square} from "next/font/google";
import "./globals.css";

import { Menu } from "@/components/menu_elements/menu";
import Fondo from "@/components/welcome-page/fondo";

import localFont from 'next/font/local'

export const SevenSegment = localFont({
  src: '../public/fonts/7-segment-trackmania-united.otf',
  variable: '--font-7-segment',
  display: 'swap',
})

export const bitcount = localFont({
  src: '../public/fonts/Bitcount/Bitcount-VariableFont_CRSV,ELSH,ELXP,slnt,wght.ttf',
  variable: '--font-bitcount',
  display: 'swap',
})




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
});

const jost = Jost({
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const novaSquare = Nova_Square({
  variable: "--font-nova-square",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "UD Chancla",
  description: "Humilitas et Pugna. Humildad y Pelea. Esta es la página web oficial de la UD Chancla, el equipo del barro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="chancla" className={`${jost.className} antialiased`}>
      <head> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        //className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${montserrat.variable} ${novaSquare.variable} ${jost.className} ${bitcount.variable} ${SevenSegment.variable} antialiased`}
      >

        <Menu>
        
        {children}
        
        </Menu>
        <Fondo />
      </body>
    </html>
  );
}

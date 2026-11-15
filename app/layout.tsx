import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Justice Room — Detektif Keadilan Cilik',description:'Petualangan belajar PPKn. Cari bukti, dengarkan cerita, dan temukan penyelesaian yang adil bersama.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body>{children}</body></html>;}

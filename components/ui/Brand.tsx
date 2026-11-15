import Link from 'next/link';
import { Scale,ArrowUpRight } from 'lucide-react';
import s from './ui.module.css';
export function Logo(){return <Link href="/" className={s.logo} aria-label="Justice Room, beranda"><span className={s.logoMark}><Scale size={25} strokeWidth={1.8}/></span><span>Justice<span className={s.logoRoom}>Room</span><small>DETEKTIF KEADILAN CILIK</small></span></Link>;}
export function Footer(){return <footer className={s.footer}><Logo/><p>Belajar mendengar. Berani berpikir adil.</p><Link href="/panduan">Catatan untuk guru <ArrowUpRight size={15}/></Link><span>© 2026 Justice Room</span></footer>;}

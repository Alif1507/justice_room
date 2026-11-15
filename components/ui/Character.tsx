'use client';
import { useId } from 'react';
import motion from './character.module.css';
export default function Character({id='nara',expression='tenang',className='',speaking=false}:{id?:string;expression?:string;className?:string;speaking?:boolean}){
 const clip=useId(); const sari=id==='sari',lila=id==='bu-lila',raka=id==='raka';
 const shirt=sari?'#CA6F54':lila?'#8E759D':raka?'#D8AF54':id==='bima'?'#6A92B0':'#277E79';
 return <svg className={`${motion.character} ${className}`} data-speaking={speaking} viewBox="0 0 220 290" role="img" aria-label={`${({nara:'Nara',sari:'Sari',bima:'Bima',raka:'Raka','bu-lila':'Bu Lila'} as Record<string,string>)[id]||'Nara'}, ekspresi ${expression}`}>
 <defs><clipPath id={clip}><path d="M0 0h220v290H0z"/></clipPath></defs><g className={motion.figure} clipPath={`url(#${clip})`} stroke="#17324D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
 <ellipse cx="111" cy="280" rx="88" ry="9" fill="#17324D" opacity=".12" stroke="none"/>
 {sari&&<><path d="M49 91Q28 180 46 220l37-43V88M168 91q25 75 10 129l-34-43V88" fill="#3D3740"/><path d="m38 161 26-4-7 17zM160 157l25 5-22 12z" fill="#F4C95D"/></>}
 <path d="M77 178q-49 11-52 88l31 12 17-45-4 57h86l-5-57 17 45 29-12q-5-76-52-88z" fill={shirt}/>
 <path d="m86 172-8 19 32 28 32-28-8-19" fill="#F3C89C"/>
 <path d="m78 185 32 34-19 14-24-33m76-15-33 34 19 14 24-33" fill="#FFF4D9"/>
 <path d="M110 221v69" strokeWidth="2"/>
 <g className={motion.head}><path d="M61 96q-15-16-18 5-1 23 18 23m99-28q15-16 18 5 1 23-18 23" fill="#EFC498"/>
 <path d="M59 66q-1-43 50-43 53 0 54 43v49q-1 54-53 62-49-9-51-62z" fill="#F3C89C"/>
 <path d={sari||lila?'M54 95Q39 20 105 18q67-6 63 78l-22-23-15-28q-30 36-77 50z':'M53 93Q33 48 64 25l9 11q44-39 77-5 39 5 18 64l-19-34-33 3-22-18-13 26-16-9z'} fill="#3D3740"/>
 {!sari&&!lila&&id==='nara'&&<><path d="M45 52Q55 0 111 7q54 6 63 45z" fill="#E8BA56"/><path d="M38 53q78-24 143 1l-4 14Q112 48 41 68z" fill="#F4C95D"/><path d="M99 11v32" stroke="#C99440"/></>}
 <path className={motion.mouth} d={expression==='khawatir'?'m76 103 16-6m36 0 15 6':'m76 100 16-2m36 0 15 2'} strokeWidth="3"/><ellipse className={motion.eye} cx="86" cy="111" rx="3" ry="5" fill="#17324D"/><ellipse className={motion.eye} cx="135" cy="111" rx="3" ry="5" fill="#17324D"/>
 <path d="m111 115-3 13h7" stroke="#C68A67" strokeWidth="2"/><path className={motion.mouth} d={expression==='khawatir'?'M98 146q13-8 25 0':'M97 141q14 14 28-1'} fill={expression==='khawatir'?'none':'#FFF8E8'}/>
 <ellipse cx="73" cy="131" rx="9" ry="5" fill="#DC947F" stroke="none" opacity=".5"/><ellipse cx="148" cy="131" rx="9" ry="5" fill="#DC947F" stroke="none" opacity=".5"/>
 {lila&&<><rect x="66" y="99" width="36" height="26" rx="10" fill="none" strokeWidth="2"/><rect x="120" y="99" width="36" height="26" rx="10" fill="none" strokeWidth="2"/><path d="M102 107h18" strokeWidth="2"/></>}
 </g>
 {id==='nara'&&<><path d="m132 235 18-6 18 6v20q-14 20-18 20-14-7-18-20z" fill="#F4C95D"/><path d="m141 250 6 6 12-14" strokeWidth="3"/></>}
 <path d="m37 259-8 13q-4 16 10 17 10 1 15-15m127-15 8 13q4 16-10 17-10 1-15-15" fill="#F3C89C"/>
 </g></svg>;
}

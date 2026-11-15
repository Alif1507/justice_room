'use client';
import { useEffect,useRef,type ReactNode,type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import s from './ui.module.css';
export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;const previous=document.activeElement;dialog?.showModal();return()=>{dialog?.close();if(previous instanceof HTMLElement)previous.focus();};},[]);
 function trapFocus(event:KeyboardEvent<HTMLDialogElement>){
  if(event.key!=='Tab')return;
  const dialog=event.currentTarget;
  const all=Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled),[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
  const focusable=all.filter(el=>{
   if(!(el instanceof HTMLInputElement)||el.type!=='radio'||!el.name)return true;
   const group=all.filter((other):other is HTMLInputElement=>other instanceof HTMLInputElement&&other.type==='radio'&&other.name===el.name);
   return (group.find(r=>r.checked)??group[0])===el;
  });
  const first=focusable[0],last=focusable[focusable.length-1];
  if(!first){event.preventDefault();dialog.focus();return;}
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
 return <dialog onKeyDown={trapFocus} ref={ref} aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}>
 <div className={s.modalTop}><h2 id="dialog-title">{title}</h2><button autoFocus className={s.iconButton} aria-label="Tutup dialog" onClick={onClose}><X size={23}/></button></div>
 <div className={s.modalBody}>{children}</div></dialog>;
}

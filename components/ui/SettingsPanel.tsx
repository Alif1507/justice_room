'use client';
import type {Settings} from '@/lib/game/types';
import s from './ui.module.css';
export default function SettingsPanel({settings,change,onReset}:{settings:Settings;change:(key:keyof Settings,value:boolean)=>void;onReset?:()=>void}){
 return <><p>Atur petualangan agar nyaman untukmu.</p>
 <label className={s.setting}><span><strong>Suara senyap</strong><small>Matikan bunyi petunjuk. Tidak ada musik otomatis.</small></span><input type="checkbox" checked={settings.mute} onChange={e=>change('mute',e.target.checked)}/></label>
 <label className={s.setting}><span><strong>Teks langsung tampil</strong><small>Baca dialog utuh tanpa menunggu efek ketik.</small></span><input type="checkbox" checked={settings.instantText} onChange={e=>change('instantText',e.target.checked)}/></label>
 <label className={s.setting}><span><strong>Kurangi gerakan</strong><small>Matikan animasi dan transisi tambahan.</small></span><input type="checkbox" checked={settings.reducedMotion} onChange={e=>change('reducedMotion',e.target.checked)}/></label>
 <p className={s.note}>Progres dan pengaturan hanya tersimpan di browser dan perangkat ini. Catatanmu tidak diunggah.</p>
 {onReset&&<button className={s.dangerButton} onClick={onReset}>Mulai Ulang Kasus</button>}</>;
}

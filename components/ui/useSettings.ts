'use client';
import {useEffect,useState} from 'react';
import {defaultSettings,readSettings,writeSettings} from '@/lib/game/storage';
export function useSettings(){
 const [settings,setSettings]=useState(defaultSettings);const [ready,setReady]=useState(false);const [error,setError]=useState(false);
 useEffect(()=>{queueMicrotask(()=>{try{setSettings(readSettings(window.localStorage));}catch{setError(true);}setReady(true);});},[]);
 function change(key:keyof typeof settings,value:boolean){const next={...settings,[key]:value};setSettings(next);try{if(!writeSettings(window.localStorage,next))setError(true);}catch{setError(true);}}
 return {settings,change,ready,error};
}

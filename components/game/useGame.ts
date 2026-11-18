'use client';
import {useEffect,useReducer,useState,useCallback} from 'react';
import type {CaseDefinition} from '@/lib/game/types';
import {bookCase} from '@/content/cases/buku-rusak';
import {initialPresentation,presentationReducer,type PresentationState,type PresentationEvent} from '@/lib/game/presentation';
import {readSave,writeSave,resetSave} from '@/lib/game/storage';
export function useGame(c:CaseDefinition=bookCase){
 const [presentation,dispatch]=useReducer((p:PresentationState,e:PresentationEvent)=>presentationReducer(p,e,c),c,initialPresentation);const state=presentation.game;const [ready,setReady]=useState(false);
 const [invalid,setInvalid]=useState(false);const [storageError,setStorageError]=useState(false);
 useEffect(()=>{queueMicrotask(()=>{try{const r=readSave(window.localStorage,c);if(r.status==='valid')dispatch({type:'RESTORE_SAVE',save:r.save});if(r.status==='invalid')setInvalid(true);if(r.status==='unavailable')setStorageError(true);}catch{setStorageError(true);}setReady(true);});},[c]);
 useEffect(()=>{if(!ready||invalid)return;try{if(!writeSave(window.localStorage,state))queueMicrotask(()=>setStorageError(true));}catch{queueMicrotask(()=>setStorageError(true));}},[state,ready,invalid]);
 const reset=useCallback(()=>{try{if(!resetSave(window.localStorage,c)){setStorageError(true);return;}}catch{setStorageError(true);return;}dispatch({type:'RESET_CASE'});setInvalid(false);},[c]);
 const dismissMoment=useCallback((sequence:number)=>dispatch({type:'DISMISS_MOMENT',sequence}),[]);
 return {state,dispatch,ready,invalid,storageError,reset,moment:presentation.moment,dismissMoment};
}

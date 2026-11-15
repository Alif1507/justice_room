'use client';
import {useReducer} from 'react';
import type {Choice} from '@/lib/game/types';
import s from './guided.module.css';
export type ChoiceFlowState={step:'choice'|'reason';choiceId:string;reasonId:string};
type ChoiceFlowEvent={type:'CHOOSE';id:string}|{type:'REASON';id:string}|{type:'NEXT'|'BACK'|'RESET'};
export const initialChoiceFlow:ChoiceFlowState={step:'choice',choiceId:'',reasonId:''};
export function choiceFlowReducer(state:ChoiceFlowState,event:ChoiceFlowEvent):ChoiceFlowState{
 if(event.type==='RESET')return initialChoiceFlow;
 if(event.type==='CHOOSE')return {...state,choiceId:event.id};
 if(event.type==='REASON')return {...state,reasonId:event.id};
 if(event.type==='NEXT')return state.choiceId?{...state,step:'reason'}:state;
 return {...state,step:'choice'};
}
export function useChoiceFlow(){return useReducer(choiceFlowReducer,initialChoiceFlow);}
export default function ChoiceStage({title,choices,value,onChange}:{title:string;choices:Choice[];value:string;onChange:(id:string)=>void}){
 return <fieldset className={s.choiceStage}><legend>{title}</legend><div className={s.choiceGrid}>{choices.map((choice,i)=><label key={choice.id} className={s.choice}>
 <input aria-label={choice.text} type="radio" name="scene-choice" checked={value===choice.id} onChange={()=>onChange(choice.id)}/><span className={s.choiceNumber}>{String(i+1).padStart(2,'0')}</span><span>{choice.text}</span>
 </label>)}</div></fieldset>;
}

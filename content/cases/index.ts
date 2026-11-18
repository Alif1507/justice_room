import {bookCase} from './buku-rusak.ts';
import {choreCase} from './piket-terlupakan.ts';
import {playCase} from './semua-boleh-bermain.ts';
import type {CaseDefinition} from '../../lib/game/types.ts';
export const allCases:CaseDefinition[]=[bookCase,choreCase,playCase];
export const getCase=(id:string):CaseDefinition|undefined=>allCases.find(c=>c.id===id);

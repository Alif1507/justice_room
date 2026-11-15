import {notFound} from 'next/navigation';
import GameShell from '@/components/game/GameShell';
export default async function Page({params}:{params:Promise<{caseId:string}>}){const {caseId}=await params;if(caseId!=='buku-rusak')notFound();return <GameShell/>;}

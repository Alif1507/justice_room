import {notFound} from 'next/navigation';
import EpisodeAccess from '@/components/game/EpisodeAccess';
import GameShell from '@/components/game/GameShell';
import {getCase} from '@/content/cases';
export default async function Page({params}:{params:Promise<{caseId:string}>}){
 const {caseId}=await params;const definition=getCase(caseId);if(!definition)notFound();
 return <EpisodeAccess key={definition.id} caseId={definition.id}><GameShell caseDefinition={definition}/></EpisodeAccess>;
}

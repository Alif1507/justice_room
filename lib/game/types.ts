export type Phase = 'intro'|'investigation'|'testimony'|'decision'|'reflection'|'result';
export type EvidenceId = 'E01'|'E02'|'E03'|'E04'|'E05';
export type Evidence = {id:EvidenceId;title:string;description:string;source:string;observedAt:string;limitation:string;kind:string};
export type Character = {id:string;name:string;role:string;color:string};
export type DialogueNode = {id:string;speakerId:string;text:string;expression:'tenang'|'khawatir'|'penasaran'};
export type Choice = {id:string;text:string};
export type Statement = {id:string;speakerId:string;text:string;pressText:string;unlockEvidenceId?:EvidenceId;acceptedPairs:{evidenceId:EvidenceId;reasonId:string;feedback:string}[];incorrectFeedback:string};
export type CaseDefinition = {
 id:string;version:number;title:string;characters:Character[];nodes:DialogueNode[];
 evidence:Evidence[];locations:{id:string;name:string;description:string;hotspots:{id:string;label:string;evidenceId:EvidenceId;dialogue:DialogueNode}[]}[];
 statements:Statement[];objectionReasons:Choice[];decisionReasons:Choice[];
 decisions:(Choice & {consequence:string;acceptedReasonId?:string})[];
 reflections:{id:string;question:string;choices:Choice[];acceptedIds:string[];explanation:string}[];
 requiredEvidence:EvidenceId[];decisionRequirements:{statementIds:string[];evidenceIds:EvidenceId[]};ending:{decisionId:string;reasonId:string};
};
export type GameState = {
 schemaVersion:1;caseContentVersion:number;caseId:string;phase:Phase;dialogueNodeId:string;
 locationId:string;statementId:string;evidenceIds:EvidenceId[];resolvedStatementIds:string[];
 pressedStatementIds:string[];milestoneIds:string[];decisionId?:string;decisionReasonId?:string;
 reflectionAnswerIds:string[];reflectionNote:string;historyIds:string[];feedback:string;
 hintLevel:number;updatedAt:string;
};
export type GameEvent =
 | {type:'START_CASE'|'ADVANCE_DIALOGUE'|'ENTER_TESTIMONY'|'PRESS_STATEMENT'|'ENTER_DECISION'|'BACK_INVESTIGATION'|'NEXT_INVESTIGATION'|'FINISH_CASE'|'RESET_CASE'|'HINT'}
 | {type:'VISIT_LOCATION';locationId:string}
 | {type:'COLLECT_EVIDENCE';evidenceId:string}
 | {type:'SELECT_STATEMENT';statementId:string}
 | {type:'SUBMIT_OBJECTION';evidenceId:string;reasonId:string}
 | {type:'SELECT_DECISION';decisionId:string;reasonId:string}
 | {type:'SUBMIT_REFLECTION';questionId:string;answerId:string}
 | {type:'SET_NOTE';note:string}
 | {type:'RESTORE_SAVE';save:unknown};
export type Settings = {mute:boolean;instantText:boolean;reducedMotion:boolean};

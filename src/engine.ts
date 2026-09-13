import type { Project, Evidence, Finding, Review, Task } from './schema';
export const MODEL='Xenova/all-MiniLM-L6-v2';
export const THRESHOLD=0.40;
export function splitRequest(text:string):string[]{
 return text.split(/\n+|(?<=[.!?])\s+(?=[A-Z])/).map(s=>s.replace(/^\s*[-*•]\s*/, '').trim()).filter(Boolean).slice(0,12);
}
export function cosine(a:number[],b:number[]):number{
 if(!a.length||a.length!==b.length)throw new Error('Invalid embedding');
 let dot=0,na=0,nb=0;
 for(let i=0;i<a.length;i++){const x=a[i],y=b[i];if(!Number.isFinite(x)||!Number.isFinite(y))throw new Error('Invalid embedding');dot+=x*y;na+=x*x;nb+=y*y;}
 const denom=Math.sqrt(na*nb);return denom?dot/denom:0;
}
export function decide(id:string,text:string,evidence:Evidence[]):Finding{
 const ranked=[...evidence].sort((a,b)=>b.score-a.score||a.clauseId.localeCompare(b.clauseId));
 if(ranked.some(e=>!Number.isFinite(e.score)||e.score < -1.001||e.score>1.001))throw new Error('Invalid similarity score');
 const relevant=ranked.filter(e=>e.score>=THRESHOLD);
 let recommendation:Finding['recommendation']='clarify',reason='No sufficiently related baseline clause. Ask for clarification; absence of a match is not proof of extra scope.',branch='LOW_EVIDENCE';
 if(relevant.length){
 const included=relevant.find(e=>e.kind==='included'),excluded=relevant.find(e=>e.kind==='excluded');
 if(included&&excluded&&Math.abs(included.score-excluded.score)<0.12){reason='Related inclusion and exclusion both found. A person must resolve the scope boundary.';branch='CONFLICTING_EVIDENCE';}
 else if(relevant[0].kind==='excluded'){recommendation='review_change';reason='The closest related clause is an explicit exclusion. Review a change proposal against this source.';branch='RELATED_EXCLUSION';}
 else {recommendation='review_included';reason='The closest related clause is included. Verify quantities and acceptance details before treating this request as included.';branch='RELATED_INCLUSION';}
 }
 return {id,text,evidence:ranked.slice(0,3),recommendation,reason,branch};
}
export function analyzeVectors(project:Project, requests:string[],vectors:number[][]):Finding[]{
 if(vectors.length!==requests.length+project.baseline.length)throw new Error('Embedding count mismatch');
 return requests.map((text,i)=>decide(`request-${i+1}`,text,project.baseline.map((c,j)=>({clauseId:c.id,text:c.text,kind:c.kind,source:c.source,score:cosine(vectors[i],vectors[requests.length+j])}))));
}
export function schedule(tasks:Task[],additions:Record<string,number>={}){
 const ends:Record<string,number>={},starts:Record<string,number>={},visiting=new Set<string>();
 const calc=(id:string):number=>{if(id in ends)return ends[id];if(visiting.has(id))throw new Error('Dependency cycle');const t=tasks.find(t=>t.id===id);if(!t)throw new Error('Missing task');visiting.add(id);starts[id]=Math.max(0,...t.dependsOn.map(calc));ends[id]=starts[id]+t.hours+(additions[id]??0);visiting.delete(id);return ends[id];};
 tasks.forEach(t=>calc(t.id));return {starts,ends,duration:Math.max(0,...Object.values(ends))};
}
export function impact(project:Project,reviews:Record<string,Review>){
 const additions:Record<string,number>={};let totalHours=0,unassigned=0;
 for(const r of Object.values(reviews))if(r.decision==='change'){
 if(!Number.isFinite(r.hours)||r.hours<0)throw new Error('Invalid effort');
 totalHours+=r.hours; const ids=[...new Set(r.taskIds)];if(ids.some(id=>!project.tasks.some(t=>t.id===id)))throw new Error('Unknown affected task');
 if(!ids.length)unassigned+=r.hours;else ids.forEach(id=>additions[id]=(additions[id]??0)+r.hours/ids.length);
 }
 const before=schedule(project.tasks),after=schedule(project.tasks,additions);
 const criticalDelta=after.duration-before.duration+unassigned;
 return {totalHours,cost:Math.round(totalHours*project.rate*100)/100,criticalDelta,delayDays:Math.max(0,criticalDelta-project.bufferHours)/project.hoursPerDay,before,after,additions,unassigned,affected:project.tasks.filter(t=>after.ends[t.id]>before.ends[t.id]).map(t=>t.id)};
}
export async function hashInput(value:unknown){const data=new TextEncoder().encode(stableStringify(value));return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data)),x=>x.toString(16).padStart(2,'0')).join('');}
export function exportPacket(project:Project,request:string,findings:Finding[],reviews:Record<string,Review>,hash:string){
 const sim=impact(project,reviews);return `# DeltaProof — ${project.name}\n\nClient: ${project.client}\nStatus: Internal review draft — not client authorization\nBaseline/input SHA-256: ${hash}\nGenerated: ${new Date().toISOString()}\n\n## Request\n${request}\n\n## Review\n${findings.map(f=>{const r=reviews[f.id];return `### ${f.text}\nHuman decision: ${r?.decision??'pending'}\nReviewer note: ${r?.note||'Not supplied'}\nAdditional effort: ${r?.decision==='change'?r.hours:0} hours\nAffected tasks: ${r?.taskIds.join(', ')||'Unassigned'}\nAI retrieval branch: ${f.branch}\n${f.evidence.map(e=>`- [${e.clauseId}] ${e.source} (${e.kind}, similarity ${e.score.toFixed(3)}): “${e.text}”`).join('\n')}\n`;}).join('\n')}\n## Proposed impact\nAdditional effort: ${sim.totalHours} hours\nProposed amount: USD ${sim.cost.toFixed(2)} at USD ${project.rate}/hour\nEstimated delay after ${project.bufferHours}h buffer: ${sim.delayDays.toFixed(1)} working days\nScheduling assumption: dependency-only unlimited parallelism; effort split equally across selected tasks. Unassigned effort added sequentially. Estimates are entered by the reviewer, not generated by AI.\n\n## Method and limitations\nLocal MiniLM sentence embeddings retrieve related clauses. Similarity is not a probability or contractual determination. Human review is required. No request was sent to a model API, and no client communication or approval occurred.\n`;
}

export function stableStringify(value:unknown):string{if(Array.isArray(value))return '['+value.map(stableStringify).join(',')+']';if(value!==null&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+stableStringify((value as Record<string,unknown>)[k])).join(',')+'}';return JSON.stringify(value);}

const KEY='hospitalplus-learn-pilot-v1';
const TYPES=['started','lesson-read','resource-search','resource-opened','exercise-checked','portfolio-opened','interruption','returned','finished'];
const SCENARIOS=['vitals','notes','handover'];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function cleanEvent(value){
 if(!value||!TYPES.includes(value.type)||typeof value.date!=='string'||!Number.isFinite(Date.parse(value.date)))return null;
 const event={type:value.type,date:value.date};
 if(SCENARIOS.includes(value.scenario))event.scenario=value.scenario;
 if(value.type==='exercise-checked'){
  const total=event.scenario==='notes'?8:7;
  if(!event.scenario||value.total!==total||!Number.isInteger(value.score)||value.score<0||value.score>total)return null;
  event.score=value.score;event.total=total;
 }
 return event;
}
export function parsePilot(raw){
 try{const data=JSON.parse(raw);if(data?.version!==1||!Array.isArray(data.sessions))return {version:1,sessions:[]};
 const sessions=data.sessions.filter(s=>s&&typeof s.id==='string'&&/^[a-f0-9-]{36}$/.test(s.id)&&typeof s.started==='string'&&Number.isFinite(Date.parse(s.started))&&Array.isArray(s.events)).slice(-20).map(s=>({id:s.id,started:s.started,ended:typeof s.ended==='string'&&Number.isFinite(Date.parse(s.ended))?s.ended:null,notes:typeof s.notes==='string'?s.notes.slice(0,1000):'',events:s.events.map(cleanEvent).filter(Boolean).slice(0,200)}));
 // Only the most recent session may be active after recovery.
 sessions.forEach((s,i)=>{if(i<sessions.length-1&&!s.ended)s.ended=s.events.at(-1)?.date||s.started;});
 return {version:1,sessions};
 }catch{return {version:1,sessions:[]};}
}
export function pilotSummary(session){
 const count=type=>session.events.filter(e=>e.type===type).length;
 const attempts=session.events.filter(e=>e.type==='exercise-checked');
 const elapsed=Math.max(0,Date.parse(session.ended||session.events.at(-1)?.date||session.started)-Date.parse(session.started));
 return {lessonsRead:count('lesson-read'),resourceSearches:count('resource-search'),resourcesOpened:count('resource-opened'),attempts:attempts.length,retries:attempts.length-new Set(attempts.map(e=>e.scenario)).size,missedChecks:attempts.reduce((sum,e)=>sum+e.total-e.score,0),portfolioVisits:count('portfolio-opened'),interruptions:count('interruption'),returns:count('returned'),elapsedMinutes:Math.round(elapsed/60000),eventLimitReached:session.events.length>=200};
}
export function createPilotRecorder(storage,notice=()=>{},now=()=>new Date().toISOString(),id=()=>crypto.randomUUID()){
 let data={version:1,sessions:[]},warning='';
 try{const raw=storage.getItem(KEY);data=parsePilot(raw);if(raw&&(!data.sessions.length))warning='No valid pilot sessions were recovered. You can start a new session.';}catch{warning='Pilot storage is unavailable. New records remain in memory until you export them.';}
 const active=()=>data.sessions.findLast(s=>!s.ended);
 const save=()=>{try{storage.setItem(KEY,JSON.stringify(data));warning='';}catch{warning='Could not save pilot records. Keep this page open, retry saving or export before leaving.';notice(warning);}};
 const record=(type,details={})=>{const session=active();if(!session)return;const event=cleanEvent({...details,type,date:now()});if(!event)return;
  // Re-rendering and repeated filter keystrokes must not inflate discovery counts.
  if(['resource-search','portfolio-opened'].includes(type)&&session.events.at(-1)?.type===type)return;
  if(session.events.length>=200){notice('Pilot event limit reached. Finish this session and export it.');return;}
  session.events.push(event);save();
 };
 return {get data(){return data;},get warning(){return warning;},active,record,save,
 start(){if(active())return;data.sessions.push({id:id(),started:now(),ended:null,notes:'',events:[]});data.sessions=data.sessions.slice(-20);record('started');},
 finish(){if(!active())return;record('finished');active().ended=now();save();},
 notes(value){if(!active())return;active().notes=String(value).slice(0,1000);save();},
 clear(){try{storage.removeItem(KEY);data={version:1,sessions:[]};warning='';return true;}catch{warning='Could not clear saved pilot records. Retry or use browser storage settings.';notice(warning);return false;}}
 };
}
let recorder;
export function initializePilot(notice){
 const storage={getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value),removeItem:key=>localStorage.removeItem(key)};
 recorder=createPilotRecorder(storage,notice);recorder.record('returned');updateIndicator();
}
function updateIndicator(){const target=document.querySelector('#pilot-link');if(target)target.textContent=recorder?.warning?'Pilot · Check storage':recorder?.active()?'Pilot session · Recording':'Pilot / Demo';}
export function recordPilotEvent(type,details){recorder?.record(type,details);updateIndicator();}
export function pilotPage(){
 const current=recorder.active();
 return `<div class="eyebrow">PILOT AND DEMONSTRATION</div><h1>Learn from the learning journey.</h1><p class="lead">An optional local record for a learner walkthrough with an educator.</p><section class="panel prose"><h2>${current?'Pilot recording is active':'Start a voluntary pilot session'}</h2><p>This browser records activity types, timestamps, scenario identifiers and checklist counts only after you start. It does not record usernames, passwords, search terms or exercise answers. Optional notes are also stored here: use fictional details only.</p><p>No records are sent to an instructor or analytics service. This browser retains up to 20 sessions with 200 events each. Export and share only if you choose. Different people using this browser can see these records.</p>${current?'<div class="actions"><button class="button" id="pilot-finish">Finish session</button><button class="button secondary" id="pilot-interrupt">Mark an interruption</button></div><label class="note-label">Optional walkthrough notes<textarea id="pilot-notes" rows="4" maxlength="1000" placeholder="What was easy? What needs improvement? No personal or patient details.">'+esc(current.notes)+'</textarea></label>':'<form id="pilot-start"><label class="offline-toggle"><input type="checkbox" required> I choose to record this walkthrough on this browser.</label><button class="button" type="submit">Start pilot session</button></form>'}<p class="muted" id="pilot-save-status" role="status">${esc(recorder.warning||'Pilot records are separate from guest and account progress.')}</p><div class="actions"><button id="pilot-retry" class="button secondary">Retry pilot save</button><button id="pilot-export" class="button secondary">Export pilot JSON ↓</button><button id="pilot-export-text" class="button secondary">Export readable report ↓</button><button id="pilot-clear" class="text-button">Clear pilot records</button></div></section><section class="panel pilot-guide"><h2>Walk through the prototype</h2><ol><li><a href="#lesson/vitals">Read a lesson</a> and mark it as read.</li><li><a href="#resources">Find a resource</a>, change a search/filter and open a lesson or publisher link. External sources need connectivity.</li><li><a href="#practice/vitals">Complete a fictional exercise</a>, check the supplied facts, then retry a missed item. Automated checks do not judge clinical reasoning or note quality.</li><li><a href="#portfolio">Review the portfolio</a> and try a voluntary export.</li><li>Mark an interruption here, reload and return to the saved draft. Return events count page reloads while recording; they do not prove recovery succeeded.</li><li>Return here, note any barriers, finish the session and choose whether to export.</li></ol><p class="muted">Marking an interruption adds a marker; recording continues until Finish session. Elapsed time includes time away. Metrics describe prototype activity, not competence, attendance or pilot success.</p></section><section class="panel pilot-history"><h2>Local pilot sessions</h2>${recorder.data.sessions.length?recorder.data.sessions.slice().reverse().map(s=>{const m=pilotSummary(s);return `<article class="callout"><h3>${esc(new Date(s.started).toLocaleString())} · ${s.ended?'Finished':'Recording'}</h3><p>${m.lessonsRead} lesson-read actions · ${m.resourceSearches} search/filter actions · ${m.resourcesOpened} resource opens · ${m.attempts} exercise checks · ${m.retries} retries · ${m.missedChecks} missed checklist items across attempts</p><p>${m.portfolioVisits} portfolio visits · ${m.interruptions} interruption markers · ${m.returns} page returns · ${m.elapsedMinutes} minutes from start to ${s.ended?'finish':'latest recorded event'} (including time away)</p>${m.eventLimitReached?'<p>Event limit reached; this record may be incomplete.</p>':''}${s.notes?`<p class="pilot-note">${esc(s.notes)}</p>`:''}</article>`;}).join(''):'<p>No pilot sessions recorded. A learner pilot and educator review are still pending.</p>'}</section>`;
}
function report(){return ['HospitalPlus Learn — voluntary local pilot report','Prototype activity only; not clinical competence, certification or educator approval.','Elapsed time includes interruptions. Search/filter actions are grouped while consecutive. No identity or exercise answers collected.','',...recorder.data.sessions.map(s=>`${s.started} | ${s.ended?'Finished '+s.ended:'Recording'}\n${Object.entries(pilotSummary(s)).map(([k,v])=>`${k}: ${v}`).join('\n')}\nNotes: ${s.notes||'None'}`)].join('\n\n');}
export function bindPilot(render,download){
 const refresh=()=>{updateIndicator();render();document.querySelector('main').focus();};
 document.querySelector('#pilot-start')?.addEventListener('submit',event=>{event.preventDefault();recorder.start();refresh();});
 document.querySelector('#pilot-finish')?.addEventListener('click',()=>{recorder.finish();refresh();});
 document.querySelector('#pilot-interrupt')?.addEventListener('click',()=>{recorder.record('interruption');refresh();});
 document.querySelector('#pilot-notes')?.addEventListener('input',event=>{recorder.notes(event.target.value);document.querySelector('#pilot-save-status').textContent=recorder.warning||'Pilot notes saved on this browser.';});
 document.querySelector('#pilot-retry').addEventListener('click',()=>{recorder.save();refresh();});
 document.querySelector('#pilot-export').addEventListener('click',()=>download('hospitalplus-learn-pilot.json',JSON.stringify({project:'HospitalPlus Learn',notice:'Voluntary local pilot activity, not competency evidence.',...recorder.data},null,2),'application/json'));
 document.querySelector('#pilot-export-text').addEventListener('click',()=>download('hospitalplus-learn-pilot.txt',report()));
 document.querySelector('#pilot-clear').addEventListener('click',()=>{if(confirm('Clear all pilot sessions and notes on this browser? Export first if you want to keep them. Learning progress will remain separate.')){recorder.clear();refresh();}});
}

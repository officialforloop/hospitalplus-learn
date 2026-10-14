import test from 'node:test';
import assert from 'node:assert/strict';
import {createPilotRecorder,cleanEvent,parsePilot,pilotSummary} from '../public/pilot.js';
const date='2026-10-14T10:00:00.000Z';
const id='11111111-1111-4111-8111-111111111111';
function memory(){let raw=null;return {getItem:()=>raw,setItem:(_key,value)=>{raw=value;},removeItem:()=>{raw=null;}};}
test('pilot records nothing until start and stops after finishing',()=>{
 const recorder=createPilotRecorder(memory(),()=>{},()=>date,()=>id);
 recorder.record('lesson-read',{scenario:'vitals'});assert.equal(recorder.data.sessions.length,0);
 recorder.start();recorder.record('lesson-read',{scenario:'vitals'});recorder.finish();recorder.record('portfolio-opened');
 assert.deepEqual(recorder.data.sessions[0].events.map(e=>e.type),['started','lesson-read','finished']);assert.equal(recorder.active(),undefined);
});
test('event allowlist excludes learner content and invalid checklist scores',()=>{
 assert.deepEqual(cleanEvent({type:'exercise-checked',date,scenario:'vitals',score:6,total:7,username:'private',answers:{note:'private'}}),{type:'exercise-checked',date,scenario:'vitals',score:6,total:7});
 for(const value of [{type:'password',date},{type:'started',date:'bad'},{type:'exercise-checked',date,scenario:'notes',score:8,total:7},{type:'exercise-checked',date,scenario:'vitals',score:-1,total:7}])assert.equal(cleanEvent(value),null);
});
test('metrics distinguish attempts, retries, missed checks and grouped discovery actions',()=>{
 const recorder=createPilotRecorder(memory(),()=>{},()=>date,()=>id);recorder.start();
 recorder.record('resource-search');recorder.record('resource-search');recorder.record('resource-opened');
 recorder.record('exercise-checked',{scenario:'vitals',score:5,total:7});recorder.record('exercise-checked',{scenario:'vitals',score:7,total:7});recorder.record('exercise-checked',{scenario:'notes',score:8,total:8});
 recorder.record('interruption');recorder.record('returned');recorder.finish();
 const summary=pilotSummary(recorder.data.sessions[0]);assert.equal(summary.resourceSearches,1);assert.equal(summary.attempts,3);assert.equal(summary.retries,1);assert.equal(summary.missedChecks,2);assert.equal(summary.returns,1);assert.equal(summary.interruptions,1);
});
test('reload restores active session, notes and activity separately from progress',()=>{
 const storage=memory(),first=createPilotRecorder(storage,()=>{},()=>date,()=>id);first.start();first.notes('<script>fictional note</script>');
 const restored=createPilotRecorder(storage,()=>{},()=>date,()=>id);assert.equal(restored.active().notes,'<script>fictional note</script>');restored.record('returned');assert.equal(pilotSummary(restored.active()).returns,1);
 assert.equal('drafts' in restored.data,false);
});
test('blocked writes retain data for export and retry; blocked deletion preserves records',()=>{
 let blocked=true;const storage=memory(),messages=[];const recorder=createPilotRecorder({getItem:storage.getItem,setItem:(...args)=>{if(blocked)throw Error();storage.setItem(...args);},removeItem:()=>{throw Error();}},m=>messages.push(m),()=>date,()=>id);
 recorder.start();assert.equal(recorder.active().events.length,1);assert.match(recorder.warning,/Could not save/);assert.ok(messages.length);
 blocked=false;recorder.save();assert.equal(recorder.warning,'');assert.equal(parsePilot(storage.getItem()).sessions.length,1);
 assert.equal(recorder.clear(),false);assert.equal(recorder.data.sessions.length,1);
});
test('corrupt data recovers and session/event retention is bounded',()=>{
 assert.deepEqual(parsePilot('{'),{version:1,sessions:[]});assert.deepEqual(parsePilot('{"version":1,"sessions":[null,{}]}'),{version:1,sessions:[]});
 const recorder=createPilotRecorder(memory(),()=>{},()=>date,()=>id);for(let i=0;i<25;i++){recorder.start();recorder.finish();}assert.equal(recorder.data.sessions.length,20);
 recorder.start();for(let i=0;i<250;i++)recorder.record('interruption');assert.equal(recorder.active().events.length,200);assert.equal(pilotSummary(recorder.active()).eventLimitReached,true);recorder.finish();assert.equal(recorder.active(),undefined);
});
test('elapsed time explicitly includes interruption time and ignores unrelated fields on recovery',()=>{
 const session={id,started:date,ended:'2026-10-14T10:12:00.000Z',events:[{type:'started',date,answers:'private'}],username:'private',notes:''};
 const restored=parsePilot(JSON.stringify({version:1,sessions:[session]}));assert.equal(pilotSummary(restored.sessions[0]).elapsedMinutes,12);assert.equal('username' in restored.sessions[0],false);assert.equal('answers' in restored.sessions[0].events[0],false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {randomUUID} from 'node:crypto';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createStore,createApi} from '../backend.mjs';
import {blankProgress} from '../public/scenarios.js';
const password='FictionalTest123!';
async function fixture(run){const store=createStore(':memory:'),api=createApi(store);const server=http.createServer((req,res)=>api(req,res,new URL(req.url,'http://localhost')));await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 const call=async(route,method='GET',body,cookie='',origin=base)=>{const res=await fetch(base+route,{method,headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return {status:res.status,data:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0],cache:res.headers.get('cache-control')};};
 const login=async name=>call('/api/login','POST',{name,password});
 try{await run({store,call,login});}finally{await new Promise(resolve=>server.close(resolve));store.db.close();}
}
test('account exports are authenticated, no-store, owner-scoped and omit credentials',()=>fixture(async({store,call,login})=>{
 const a=store.createUser('exportA',password),b=store.createUser('exportB',password);const teacher=store.createUser('educator',password,'instructor');const aSession=await login(a.name);
 const progress=blankProgress();progress.drafts.vitals.note='Only learner A';await call('/api/progress','PUT',{progress,revision:0},aSession.cookie);
 const submission=await call('/api/submissions','POST',{id:randomUUID(),scenario:'vitals',answers:{note:'Fictional A submission'}},aSession.cookie);
 const bSession=await login(b.name);await call('/api/submissions','POST',{id:randomUUID(),scenario:'notes',answers:{reported:'Private B exercise'}},bSession.cookie);
 const instructor=await login(teacher.name);await call('/api/instructor/assign','POST',{learner:a.id,scenario:'vitals'},instructor.cookie);await call('/api/instructor/review','POST',{submission:submission.data.id,comment:'Fictional feedback A'},instructor.cookie);
 assert.equal((await call('/api/account/export')).status,401);const result=await call('/api/account/export','GET',undefined,aSession.cookie);assert.equal(result.cache,'no-store');assert.equal(result.data.user.id,a.id);assert.equal(result.data.submissions.length,1);assert.equal(result.data.reviews.length,1);assert.equal(result.data.assignments.length,1);assert.equal(result.data.progress.drafts.vitals.note,'Only learner A');
 const serialized=JSON.stringify(result.data);for(const secret of ['Private B exercise',password,'"hash"','"salt"','hpl_session'])assert.equal(serialized.includes(secret),false);
}));
test('password changes require same origin and current password; revoke every session',()=>fixture(async({store,call,login})=>{
 const user=store.createUser('passworduser',password);const first=await login(user.name),second=await login(user.name);const body={currentPassword:password,newPassword:'ChangedTest123!'};
 assert.equal((await call('/api/account/password','POST',body)).status,401);
 assert.equal((await call('/api/account/password','POST',body,first.cookie,'http://evil.example')).status,403);
 assert.equal((await call('/api/account/password','POST',{...body,currentPassword:'wrong'},first.cookie)).status,401);
 assert.equal((await call('/api/account/password','POST',{...body,newPassword:'short'},first.cookie)).status,400);
 assert.equal((await call('/api/account/password','POST',{...body,newPassword:password},first.cookie)).status,400);
 const oldHash=store.db.prepare('SELECT hash FROM users WHERE id=?').get(user.id).hash;
 const changed=await call('/api/account/password','POST',body,first.cookie);assert.equal(changed.status,200);assert.equal(changed.cookie,'hpl_session=');assert.notEqual(store.db.prepare('SELECT hash FROM users WHERE id=?').get(user.id).hash,oldHash);
 assert.equal((await call('/api/progress','GET',undefined,first.cookie)).status,401);assert.equal((await call('/api/progress','GET',undefined,second.cookie)).status,401);assert.equal(store.authenticate(user.name,password),null);assert.equal(store.authenticate(user.name,body.newPassword).id,user.id);
 const fresh=await call('/api/login','POST',{name:user.name,password:body.newPassword});store.setPassword(user.id,'OperatorReset123!');assert.equal((await call('/api/session','GET',undefined,fresh.cookie)).data.user,null);assert.equal((await call('/api/account/export','GET',undefined,fresh.cookie)).status,401);
}));
test('learner deletion removes only the authenticated account and dependent records',()=>fixture(async({store,call,login})=>{
 const a=store.createUser('deleteA',password),b=store.createUser('keepB',password),teacher=store.createUser('keepteacher',password,'instructor');const aSession=await login(a.name),aOther=await login(a.name),bSession=await login(b.name),teacherSession=await login(teacher.name);
 await call('/api/progress','PUT',{progress:blankProgress(),revision:0},aSession.cookie);const aSub=await call('/api/submissions','POST',{id:randomUUID(),scenario:'vitals',answers:{note:'Delete fictional note'}},aSession.cookie);const bSub=await call('/api/submissions','POST',{id:randomUUID(),scenario:'vitals',answers:{note:'Keep fictional note'}},bSession.cookie);
 for(const learner of [a,b])await call('/api/instructor/assign','POST',{learner:learner.id,scenario:'vitals'},teacherSession.cookie);
 for(const submission of [aSub,bSub])await call('/api/instructor/review','POST',{submission:submission.data.id,comment:'Fictional test feedback'},teacherSession.cookie);
 assert.equal((await call('/api/account','DELETE',{currentPassword:password,confirmation:'DELETE deleteA'},aSession.cookie,'http://evil.example')).status,403);
 assert.equal((await call('/api/account','DELETE',{currentPassword:'wrong',confirmation:'DELETE deleteA'},aSession.cookie)).status,401);
 assert.equal((await call('/api/account','DELETE',{currentPassword:password,confirmation:'DELETE keepB'},aSession.cookie)).status,400);
 assert.equal((await call('/api/account','DELETE',{currentPassword:password,confirmation:'DELETE keepteacher'},teacherSession.cookie)).status,403);
 assert.equal((await call('/api/account','DELETE',{currentPassword:password,confirmation:'DELETE deleteA',id:b.id},aSession.cookie)).status,200);
 assert.equal(store.db.prepare('SELECT id FROM users WHERE id=?').get(a.id),undefined);assert.ok(store.authenticate(b.name,password));assert.ok(store.authenticate(teacher.name,password));
 assert.equal(store.db.prepare('SELECT count(*) n FROM progress WHERE user_id=?').get(a.id).n,0);assert.equal(store.db.prepare('SELECT count(*) n FROM submissions').get().n,1);assert.equal(store.db.prepare('SELECT count(*) n FROM reviews').get().n,1);assert.equal(store.db.prepare('SELECT count(*) n FROM assignments').get().n,1);
 assert.equal((await call('/api/progress','GET',undefined,aOther.cookie)).status,401);assert.equal((await call('/api/account/export','GET',undefined,bSession.cookie)).data.submissions[0].id,bSub.data.id);
}));
test('current-password confirmation is rate limited',()=>fixture(async({store,call,login})=>{
 const user=store.createUser('limituser',password),session=await login(user.name);
 for(let i=0;i<5;i++)assert.equal((await call('/api/account/password','POST',{currentPassword:'wrong',newPassword:'ChangedTest123!'},session.cookie)).status,401);
 assert.equal((await call('/api/account/password','POST',{currentPassword:password,newPassword:'ChangedTest123!'},session.cookie)).status,429);assert.ok(store.authenticate(user.name,password));
}));
test('learner deletion rolls back on failure and operator password reset persists',()=>{
 const directory=mkdtempSync(path.join(tmpdir(),'hpl-lifecycle-')),filename=path.join(directory,'test.sqlite');let store;
 try{store=createStore(filename);const user=store.createUser('persistreset',password);store.db.prepare('INSERT INTO progress VALUES(?,?,?)').run(user.id,JSON.stringify(blankProgress()),1);
 store.db.exec("CREATE TRIGGER prevent_delete BEFORE DELETE ON users BEGIN SELECT RAISE(ABORT,'test failure'); END;");assert.throws(()=>store.deleteLearner(user.id));assert.equal(store.progress(user.id).revision,1);assert.ok(store.authenticate(user.name,password));
 store.setPassword(user.id,'PersistReset123!');store.db.close();store=createStore(filename);assert.equal(store.authenticate(user.name,password),null);assert.equal(store.authenticate(user.name,'PersistReset123!').id,user.id);assert.equal(store.progress(user.id).revision,1);
 }finally{store?.db.close();rmSync(directory,{recursive:true,force:true});}
});

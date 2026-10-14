import {DatabaseSync} from 'node:sqlite';
import {randomBytes,scryptSync,timingSafeEqual,randomUUID} from 'node:crypto';
import {blankProgress,scenarios,assessStructured} from './public/scenarios.js';
import {parseSaved,assess} from './public/learning.js';
import {validateResource} from './public/resources.js';
export function createStore(filename){
 const db=new DatabaseSync(filename);db.exec(`PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE,role TEXT NOT NULL,salt TEXT NOT NULL,hash TEXT NOT NULL); CREATE TABLE IF NOT EXISTS progress(user_id TEXT PRIMARY KEY REFERENCES users(id),data TEXT NOT NULL,revision INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS submissions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),scenario TEXT NOT NULL,answers TEXT NOT NULL,result TEXT NOT NULL,date TEXT NOT NULL); CREATE TABLE IF NOT EXISTS assignments(id TEXT PRIMARY KEY,instructor_id TEXT REFERENCES users(id),learner_id TEXT REFERENCES users(id),scenario TEXT NOT NULL,date TEXT NOT NULL,UNIQUE(instructor_id,learner_id,scenario)); CREATE TABLE IF NOT EXISTS reviews(submission_id TEXT PRIMARY KEY REFERENCES submissions(id),instructor_id TEXT REFERENCES users(id),comment TEXT NOT NULL,date TEXT NOT NULL);`);
 db.exec('CREATE TABLE IF NOT EXISTS resources(id TEXT PRIMARY KEY,owner TEXT NOT NULL REFERENCES users(id),data TEXT NOT NULL,reviewed TEXT,updated TEXT NOT NULL)');
 const createUser=(name,password,role='learner')=>{const id=randomUUID(),salt=randomBytes(16).toString('hex');db.prepare('INSERT INTO users VALUES(?,?,?,?,?)').run(id,name,role,salt,scryptSync(password,salt,64).toString('hex'));return {id,name,role};};
 const authenticate=(name,password)=>{const user=db.prepare('SELECT * FROM users WHERE name=?').get(name);const salt=user?.salt||'invalid-account';const hash=scryptSync(password,salt,64);return user&&timingSafeEqual(hash,Buffer.from(user.hash,'hex'))?{id:user.id,name:user.name,role:user.role}:null;};
 const progress=id=>{const row=db.prepare('SELECT * FROM progress WHERE user_id=?').get(id);return row?{progress:JSON.parse(row.data),revision:row.revision}:{progress:blankProgress(),revision:0};};
 const setPassword=(id,password)=>{if(typeof password!=='string'||password.length<10||password.length>128)throw new Error('Use a 10–128 character password.');const salt=randomBytes(16).toString('hex');const changed=db.prepare('UPDATE users SET salt=?,hash=? WHERE id=?').run(salt,scryptSync(password,salt,64).toString('hex'),id);if(changed.changes!==1)throw new Error('Account not found.');};
 const deleteLearner=id=>{db.exec('BEGIN IMMEDIATE');try{const person=db.prepare('SELECT role FROM users WHERE id=?').get(id);if(person?.role!=='learner')throw new Error('Only learner accounts can be deleted here.');db.prepare('DELETE FROM reviews WHERE submission_id IN (SELECT id FROM submissions WHERE user_id=?)').run(id);db.prepare('DELETE FROM assignments WHERE learner_id=?').run(id);db.prepare('DELETE FROM submissions WHERE user_id=?').run(id);db.prepare('DELETE FROM progress WHERE user_id=?').run(id);db.prepare('DELETE FROM users WHERE id=?').run(id);db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}};
 const exportAccount=user=>({version:1,exported:new Date().toISOString(),notice:'Fictional training account data. Not certification. Does not include credentials, browser-local guest progress, preferences or pilot records.',user:{id:user.id,name:user.name,role:user.role},...progress(user.id),submissions:db.prepare('SELECT id,scenario,answers,result,date FROM submissions WHERE user_id=? ORDER BY date').all(user.id).map(s=>({...s,answers:JSON.parse(s.answers),result:JSON.parse(s.result)})),assignments:db.prepare('SELECT * FROM assignments WHERE learner_id=? OR instructor_id=?').all(user.id,user.id),reviews:db.prepare('SELECT r.* FROM reviews r JOIN submissions s ON s.id=r.submission_id WHERE s.user_id=? OR r.instructor_id=?').all(user.id,user.id),resources:db.prepare('SELECT id,data,reviewed,updated FROM resources WHERE owner=?').all(user.id).map(r=>({...r,data:JSON.parse(r.data)}))});
 return {db,createUser,authenticate,progress,setPassword,deleteLearner,exportAccount};
}
export function createApi(store){
 const {db}=store;const sessions=new Map(),failures=new Map();
 const reply=(res,status,data,headers={})=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store',...headers});res.end(JSON.stringify(data));};
 const fail=(status,message)=>Object.assign(new Error(message),{status});
 return async function api(req,res,url){
  try{
   if(req.method!=='GET'&&req.headers.origin!==`http://${req.headers.host}`)throw fail(403,'This action must originate from the learning application.');
   let body={};if(req.method!=='GET'){let text='';for await(const chunk of req){text+=chunk;if(text.length>300000)throw fail(413,'Request too large.');}try{body=JSON.parse(text||'{}');}catch{throw fail(400,'Invalid JSON.');}}
   if(!body||typeof body!=='object'||Array.isArray(body))throw fail(400,'Expected a JSON object.');
   const path=url.pathname;const token=(req.headers.cookie||'').match(/(?:^|;\s*)hpl_session=([a-f0-9]+)/)?.[1];let session=sessions.get(token);if(session&&session.expires<Date.now()){sessions.delete(token);session=null;}
   if(session){const current=db.prepare('SELECT id,name,role,hash FROM users WHERE id=?').get(session.user.id);if(!current||current.hash!==session.credentialHash){sessions.delete(token);session=null;}else session.user={id:current.id,name:current.name,role:current.role};}
   if(path==='/api/session'&&req.method==='GET')return reply(res,200,{user:session?.user||null});
   if(path==='/api/resources'&&req.method==='GET')return reply(res,200,{resources:session?db.prepare('SELECT r.*,u.name reviewer FROM resources r JOIN users u ON u.id=r.owner ORDER BY r.updated DESC').all().map(r=>({...JSON.parse(r.data),id:r.id,owner:r.owner,reviewer:r.reviewed?r.reviewer:null,reviewed:r.reviewed,checked:r.updated.slice(0,10),format:'Institution link',offline:false})):[]});
   if(['/api/register','/api/login'].includes(path)&&req.method==='POST'){
    if(typeof body.name!=='string'||!/^[a-zA-Z0-9_-]{3,40}$/.test(body.name)||typeof body.password!=='string'||body.password.length<10||body.password.length>128)throw fail(400,'Use a 3–40 character username and a 10–128 character password.');
    const bucket=req.socket.remoteAddress||'local',rate=failures.get(bucket)||{count:0,until:0};if(rate.until>Date.now()&&rate.count>=10)throw fail(429,'Too many attempts. Try again in 15 minutes.');
    let user;
    if(path==='/api/register'){try{user=store.createUser(body.name,body.password);}catch{throw fail(409,'Username is unavailable.');}}
    else{user=store.authenticate(body.name,body.password);if(!user){failures.set(bucket,{count:rate.until>Date.now()?rate.count+1:1,until:Date.now()+900000});throw fail(401,'Incorrect username or password.');}}
    failures.delete(bucket);const id=randomBytes(32).toString('hex');sessions.set(id,{user,credentialHash:db.prepare('SELECT hash FROM users WHERE id=?').get(user.id).hash,expires:Date.now()+8*3600000});return reply(res,200,{user},{'Set-Cookie':`hpl_session=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`});
   }
   if(!session)throw fail(401,'Sign in to continue.');const user=session.user;
   if(path==='/api/account/export'&&req.method==='GET')return reply(res,200,store.exportAccount(user),{'Content-Disposition':'attachment; filename="hospitalplus-learn-account.json"'});
   if((path==='/api/account/password'&&req.method==='POST')||(path==='/api/account'&&req.method==='DELETE')){
    if(path==='/api/account'&&user.role!=='learner')throw fail(403,'Instructor deletion requires a local operator to review resource and feedback ownership.');
    const key=`reauth:${user.id}`,rate=failures.get(key)||{count:0,until:0};if(rate.until>Date.now()&&rate.count>=5)throw fail(429,'Too many confirmation attempts. Try again in 15 minutes.');
    if(typeof body.currentPassword!=='string'||body.currentPassword.length>128||!store.authenticate(user.name,body.currentPassword)){failures.set(key,{count:rate.until>Date.now()?rate.count+1:1,until:Date.now()+900000});throw fail(401,'Current password is incorrect.');}
    if(path==='/api/account/password'){
     if(typeof body.newPassword!=='string'||body.newPassword.length<10||body.newPassword.length>128||body.newPassword===body.currentPassword)throw fail(400,'Choose a different password of 10–128 characters.');
     store.setPassword(user.id,body.newPassword);
    }else{if(body.confirmation!==`DELETE ${user.name}`)throw fail(400,'Type the exact account deletion confirmation.');store.deleteLearner(user.id);}
    failures.delete(key);for(const [id,value] of sessions)if(value.user.id===user.id)sessions.delete(id);
    return reply(res,200,{ok:true},{'Set-Cookie':'hpl_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});
   }
   if(path==='/api/logout'&&req.method==='POST'){sessions.delete(token);return reply(res,200,{ok:true},{'Set-Cookie':'hpl_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});}
   if(path==='/api/progress'&&req.method==='GET')return reply(res,200,store.progress(user.id));
   if(path==='/api/progress'&&req.method==='PUT'){
    const progress=parseSaved(JSON.stringify(body.progress));if(!progress)throw fail(400,'Invalid progress.');const current=store.progress(user.id);if(body.revision!==current.revision)return reply(res,409,{error:'Progress changed in another tab. Reload account progress before saving.',...current});
    const revision=current.revision+1;db.prepare('INSERT INTO progress VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data,revision=excluded.revision').run(user.id,JSON.stringify(progress),revision);return reply(res,200,{revision});
   }
   if(path==='/api/submissions'&&req.method==='POST'){
    if(user.role!=='learner')throw fail(403,'Only learner accounts submit exercises.');const scenario=scenarios.find(s=>s.id===body.scenario);if(!scenario||typeof body.id!=='string'||!/^[a-f0-9-]{36}$/.test(body.id)||!body.answers||typeof body.answers!=='object')throw fail(400,'Invalid exercise submission.');
    const draft=parseSaved(JSON.stringify({...blankProgress(),drafts:{[scenario.id]:body.answers}})).drafts[scenario.id];const previous=db.prepare('SELECT * FROM submissions WHERE id=?').get(body.id);
    if(previous){if(previous.user_id!==user.id||previous.scenario!==scenario.id||previous.answers!==JSON.stringify(draft))throw fail(409,'Submission identifier already used.');return reply(res,200,{result:JSON.parse(previous.result),id:previous.id});}
    const result=scenario.id==='vitals'?assess(draft):assessStructured(scenario.id,draft);db.prepare('INSERT INTO submissions VALUES(?,?,?,?,?,?)').run(body.id,user.id,scenario.id,JSON.stringify(draft),JSON.stringify(result),new Date().toISOString());return reply(res,201,{id:body.id,result});
   }
   if(path==='/api/assignments'&&req.method==='GET'){
    const rows=db.prepare(user.role==='instructor'?'SELECT a.*,u.name learner FROM assignments a JOIN users u ON u.id=a.learner_id WHERE instructor_id=?':'SELECT a.*,u.name instructor FROM assignments a JOIN users u ON u.id=a.instructor_id WHERE learner_id=?').all(user.id);return reply(res,200,{assignments:rows});
   }
   if(path==='/api/feedback'&&req.method==='GET')return reply(res,200,{reviews:db.prepare('SELECT r.comment,r.date,s.scenario,u.name instructor FROM reviews r JOIN submissions s ON s.id=r.submission_id JOIN users u ON u.id=r.instructor_id WHERE s.user_id=? ORDER BY r.date DESC').all(user.id)});
   if(!path.startsWith('/api/instructor/'))throw fail(404,'API route not found.');if(user.role!=='instructor')throw fail(403,'Instructor access required.');
   if(path==='/api/instructor/resources'&&req.method==='POST'){
    let resource;try{resource=validateResource(body);}catch(error){throw fail(400,error.message);}
    if(body.id){const previous=db.prepare('SELECT owner FROM resources WHERE id=?').get(body.id);if(!previous||previous.owner!==user.id)throw fail(403,'Only the author can edit this resource.');}
    const id=body.id||randomUUID(),date=new Date().toISOString(),reviewed=resource.review==='instructor-reviewed'?date:null;
    db.prepare('INSERT INTO resources VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,reviewed=excluded.reviewed,updated=excluded.updated').run(id,user.id,JSON.stringify(resource),reviewed,date);return reply(res,200,{resource:{...resource,id,reviewed}});
   }
   if(path==='/api/instructor/learners'&&req.method==='GET')return reply(res,200,{learners:db.prepare("SELECT id,name FROM users WHERE role='learner'").all()});
   if(path==='/api/instructor/assign'&&req.method==='POST'){
    if(!scenarios.some(s=>s.id===body.scenario)||!db.prepare("SELECT id FROM users WHERE id=? AND role='learner'").get(body.learner))throw fail(400,'Choose a learner and a valid exercise.');db.prepare('INSERT OR IGNORE INTO assignments VALUES(?,?,?,?,?)').run(randomUUID(),user.id,body.learner,body.scenario,new Date().toISOString());return reply(res,200,{ok:true});
   }
   if(path==='/api/instructor/submissions'&&req.method==='GET')return reply(res,200,{submissions:db.prepare('SELECT s.*,u.name learner,r.comment FROM submissions s JOIN users u ON u.id=s.user_id JOIN assignments a ON a.learner_id=s.user_id AND a.scenario=s.scenario LEFT JOIN reviews r ON r.submission_id=s.id AND r.instructor_id=? WHERE a.instructor_id=? ORDER BY s.date DESC').all(user.id,user.id).map(s=>({...s,answers:JSON.parse(s.answers),result:JSON.parse(s.result)}))});
   if(path==='/api/instructor/review'&&req.method==='POST'){
    if(typeof body.comment!=='string'||!body.comment.trim()||body.comment.length>2000)throw fail(400,'Enter feedback of up to 2,000 characters.');const assigned=db.prepare('SELECT s.id FROM submissions s JOIN assignments a ON a.learner_id=s.user_id AND a.scenario=s.scenario WHERE s.id=? AND a.instructor_id=?').get(body.submission,user.id);if(!assigned)throw fail(403,'This submission is not assigned to you.');db.prepare('INSERT INTO reviews VALUES(?,?,?,?) ON CONFLICT(submission_id) DO UPDATE SET instructor_id=excluded.instructor_id,comment=excluded.comment,date=excluded.date').run(body.submission,user.id,body.comment.trim(),new Date().toISOString());return reply(res,200,{ok:true});
   }
   throw fail(404,'API route not found.');
  }catch(error){reply(res,error.status||500,{error:error.status?error.message:'Unable to complete request.'});}
 };
}

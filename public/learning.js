import {scenarios,blankProgress} from './scenarios.js';
export const fields = [
  {key:'systolic',label:'Systolic blood pressure',unit:'mmHg',value:'118'},
  {key:'diastolic',label:'Diastolic blood pressure',unit:'mmHg',value:'76'},
  {key:'pulse',label:'Pulse',unit:'bpm',value:'82'},
  {key:'temperature',label:'Temperature',unit:'°C',value:'36.8'},
  {key:'respiratory',label:'Respiratory rate',unit:'breaths/min',value:'18'},
  {key:'oxygen',label:'Oxygen saturation',unit:'%',value:'98'}
];
export function assess(values) {
  const results = fields.map(f => ({label:f.label,pass:String(values[f.key] ?? '').trim() !== '' && Number(values[f.key]) === Number(f.value),hint:`Compare your entry with the supplied observation: ${f.value} ${f.unit}.`}));
  const note = String(values.note ?? '').trim();
  results.push({label:'Observation note completed',pass:note.length > 0,hint:'Write an observation note using the supplied facts. An instructor must review its clinical quality.'});
  return {results,score:results.filter(r=>r.pass).length,total:results.length};
}
export function parseSaved(raw) {
  try {
    const saved = JSON.parse(raw);
    if (!saved || ![1,2].includes(saved.version) || !Array.isArray(saved.attempts)) return null;
    if(saved.version===1 && (!saved.draft || typeof saved.draft!=='object')) return null;
    if(saved.version===2 && (!saved.drafts || typeof saved.drafts!=='object' || !saved.lessons || typeof saved.lessons!=='object')) return null;
    const result=blankProgress();
    for(const scenario of scenarios){
      const keys=scenario.fields?.map(f=>f.key)||[...fields.map(f=>f.key),'note'];
      const draft=saved.version===1?(scenario.id==='vitals'?saved.draft:{}):saved.drafts[scenario.id];
      result.drafts[scenario.id]=Object.fromEntries(keys.map(k=>[k,typeof draft?.[k]==='string'?draft[k].slice(0,4000):'']));
      result.lessons[scenario.id]=saved.version===1?scenario.id==='vitals'&&saved.lessonRead===true:saved.lessons[scenario.id]===true;
    }
    result.attempts=saved.attempts.flatMap(a=>{
      if(!a)return [];
      const scenarioId=saved.version===1?'vitals':a.scenario;
      const scenario=scenarios.find(s=>s.id===scenarioId);
      const total=scenario?.fields?.length||7;
      if(!scenario||typeof a.date!=='string'||!Number.isFinite(Date.parse(a.date))||!Number.isInteger(a.score)||a.score<0||a.score>total)return [];
      if(saved.version===2 && a.total!==total)return [];
      return [{scenario:scenarioId,date:a.date,score:a.score,total}];
    }).slice(-50);
    return result;
  } catch { return null; }
}

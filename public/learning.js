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
    if (!saved || saved.version !== 1 || typeof saved.draft !== 'object' || !Array.isArray(saved.attempts)) return null;
    const draft = Object.fromEntries([...fields.map(f=>f.key),'note'].map(k=>[k,typeof saved.draft?.[k]==='string'?saved.draft[k].slice(0,4000):'']));
    const attempts = saved.attempts.filter(a=>a && typeof a.date==='string' && Number.isInteger(a.score) && a.score>=0 && a.score<=7).slice(-50).map(a=>({date:a.date,score:a.score,total:7}));
    return {version:1,draft,attempts,lessonRead:saved.lessonRead===true};
  } catch { return null; }
}

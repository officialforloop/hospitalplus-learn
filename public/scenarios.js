export const scenarios = [
  {
    id:'vitals', number:'01', title:'Your first observation record', skill:'Record observations',
    summary:'Copy supplied measurements accurately and document a factual note.',
    lessonTitle:'Document with care', patient:'HPL-DEMO-001', context:'Adult outpatient · Scheduled follow-up',
    facts:['The fictional patient attended a scheduled follow-up.','Use only the six supplied observations shown in the practice lab.'],
    steps:['Check the fictional patient identifier before you begin.','Read all six measurements, including their units.','Copy the supplied values accurately; keep supplied decimal places.','Write a short factual note without inventing symptoms or treatment.','Compare your entries with the source sheet and use feedback to retry.'],
    limit:'Checks six measurements and whether a note is present. It does not assess clinical reasoning or note quality.'
  },
  {
    id:'notes', number:'02', title:'Write a traceable observation note', skill:'Document a patient encounter',
    summary:'Separate supplied facts, patient-reported information, and actions taken.',
    lessonTitle:'A clear record tells a clear story', patient:'HPL-DEMO-002', context:'Adult outpatient · Appointment check-in',
    facts:['Record identifier: HPL-DEMO-002.','Observation time: 09:15 (local time).','The patient reports: “I have been waiting for my appointment.”','Observed fact: the patient is seated in the outpatient waiting area.','Action taken: appointment arrival recorded.','Next step supplied by the scenario: pass the record to the assigned nurse.'],
    steps:['Use the supplied record identifier and observation time.','Distinguish what the patient reported from what was observed.','Record only the action supplied in the scenario.','Keep the supplied next step visible for the next person.','Add your fictional learner initials, then reflect on whether each statement can be traced to a supplied fact.'],
    limit:'Checks identifier/time transcription, selected source facts, and whether initials and a reflection are present. Free-text accuracy and clinical quality need an instructor.',
    fields:[
      {key:'record',label:'Fictional record identifier',expected:'HPL-DEMO-002'},
      {key:'time',label:'Observation time (HH:MM)',expected:'09:15'},
      {key:'reported',label:'Patient-reported information',expected:'waiting',options:[['waiting','Waiting for the appointment'],['pain','Reports pain'],['none','No patient-reported information']]},
      {key:'observed',label:'Observed fact',expected:'seated',options:[['seated','Seated in the outpatient waiting area'],['walking','Walking in the examination room'],['unknown','Not supplied']]},
      {key:'action',label:'Action documented',expected:'arrival',options:[['arrival','Appointment arrival recorded'],['medication','Medication administered'],['discharge','Discharge completed']]},
      {key:'next',label:'Supplied next step',expected:'nurse',options:[['nurse','Pass the record to the assigned nurse'],['home','Send the patient home'],['test','Order a new test']]},
      {key:'initials',label:'Your fictional learner initials',presence:true},
      {key:'reflection',label:'Reflection: how did you distinguish reported and observed facts?',presence:true,multiline:true}
    ]
  },
  {
    id:'handover', number:'03', title:'Prepare a structured handover', skill:'Communicate the next step',
    summary:'Organize a fictional handover into situation, background, observations, and next step.',
    lessonTitle:'Make the next step easy to follow', patient:'HPL-DEMO-003', context:'Adult outpatient · Shift change',
    facts:['Record identifier: HPL-DEMO-003.','Situation: the patient is waiting for an assigned nurse.','Background: appointment arrival was recorded at 10:20.','Observation supplied: the patient is seated in the waiting area.','Pending task: the assigned nurse needs to receive the appointment record.','Receiver: Nurse B (fictional).'],
    steps:['Identify the correct fictional record and receiver.','State the current situation without adding a diagnosis.','Provide the relevant background from the source sheet.','Describe only the observation supplied; do not infer a clinical assessment.','Pass on the pending task and write a short handover message for instructor discussion.'],
    limit:'Checks selected facts, correct record/receiver, and message presence. This is a structural exercise; it does not assess urgency, clinical assessment, or treatment decisions.',
    fields:[
      {key:'record',label:'Fictional record identifier',expected:'HPL-DEMO-003'},
      {key:'receiver',label:'Receiving colleague',expected:'nurse-b',options:[['nurse-b','Nurse B (fictional)'],['nurse-c','Nurse C (fictional)']]},
      {key:'situation',label:'Situation',expected:'waiting',options:[['waiting','Waiting for the assigned nurse'],['discharged','Already discharged'],['procedure','Undergoing a procedure']]},
      {key:'background',label:'Background',expected:'arrival',options:[['arrival','Appointment arrival recorded at 10:20'],['admitted','Admitted to an inpatient ward'],['unsupplied','No appointment information available']]},
      {key:'observation',label:'Supplied observation',expected:'seated',options:[['seated','Seated in the waiting area'],['unwell','A new clinical problem has been identified'],['absent','Patient has left the hospital']]},
      {key:'next',label:'Pending task to communicate',expected:'record',options:[['record','Pass the appointment record to the assigned nurse'],['prescribe','Prescribe medication'],['close','Close the encounter']]},
      {key:'message',label:'Your handover message using only supplied facts',presence:true,multiline:true}
    ]
  }
];
export const scenarioFor=id=>scenarios.find(s=>s.id===id)||scenarios[0];
export function assessStructured(id, values) {
  const scenario=scenarioFor(id);
  if (!scenario.fields) throw new Error('Use the vitals assessment for this scenario.');
  const results=scenario.fields.map(field=>{
    const value=String(values[field.key]??'').trim();
    const expectedLabel=field.options?.find(([key])=>key===field.expected)?.[1]||field.expected;
    return {label:field.label,pass:field.presence?value.length>0:value===field.expected,hint:field.presence?'Complete this field using supplied facts. Presence is checked automatically; meaning requires instructor review.':`Revisit the source sheet: ${expectedLabel}.`};
  });
  return {results,score:results.filter(r=>r.pass).length,total:results.length};
}
export function blankProgress(){return {version:2,drafts:{vitals:{},notes:{},handover:{}},lessons:{vitals:false,notes:false,handover:false},attempts:[]};}
export function nextScenario(progress){return scenarios.find(s=>!progress.attempts.some(a=>a.scenario===s.id&&a.score===a.total))||null;}

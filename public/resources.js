import {scenarios} from './scenarios.js';
export const languages=['English','French','Portuguese','Arabic','Yoruba','Hausa','Igbo','Swahili'];
export const catalogue=[
 ...scenarios.map(s=>({id:'lesson-'+s.id,title:s.lessonTitle,description:s.summary,skill:s.id,language:'English',institution:'General practice',publisher:'HospitalPlus Learn prototype team',url:'#lesson/'+s.id,format:'Lesson',offline:true,review:'pending',reviewer:null,reviewed:null,checked:'2026-10-12',context:'Original fictional exercise; local instructor review is pending.'})),
 {id:'nmc-code',title:'The Code: professional standards',description:'Independent reading on professional practice and record keeping.',skill:'notes',language:'English',institution:'General practice',publisher:'Nursing and Midwifery Council',url:'https://www.nmc.org.uk/standards/code/',format:'Web reference',offline:false,review:'reference',reviewer:null,reviewed:null,checked:'2026-10-12',context:'UK regulatory context. Confirm suitability with your institution; this is not local curriculum approval.'},
 {id:'who-handover',title:'Communication during patient handovers',description:'Patient safety reference on handover communication, published in May 2007.',skill:'handover',language:'English',institution:'General practice',publisher:'WHO Collaborating Centre for Patient Safety Solutions',url:'https://www.who.int/teams/integrated-health-services/patient-safety/research/patient-safety-solutions',format:'Publisher collection',offline:false,review:'reference',reviewer:null,reviewed:null,checked:'2026-10-12',context:'Open the publisher collection and choose Communication during patient handovers. Historical reference; check current institutional guidance.'},
 {id:'openlearn-nursing',title:'So, you want to be a nurse?',description:'An introductory nursing course from The Open University.',skill:'vitals',language:'English',institution:'General practice',publisher:'The Open University — OpenLearn',url:'https://www.open.edu/openlearn/health-sports-psychology/so-you-want-be-nurse-a-brief-introduction-nursing/content-section-0',format:'External course',offline:false,review:'reference',reviewer:null,reviewed:null,checked:'2026-10-12',context:'Primarily UK nursing context. Background learning rather than an approved local placement pathway.'}
];
export function filterResources(items,{query='',skill='',language='',institution='',review='',offline=false}={}){
 const tokens=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return items.filter(r=>tokens.every(t=>[r.title,r.description,r.publisher,r.institution,r.context].join(' ').toLocaleLowerCase().includes(t))&&(!skill||r.skill===skill)&&(!language||r.language===language)&&(!institution||r.institution===institution||r.institution==='General practice')&&(!review||r.review===review)&&(!offline||r.offline===true));
}
export function validateResource(input){
 const limits={title:140,description:600,publisher:160,institution:120,context:600};const clean={};
 for(const [key,max] of Object.entries(limits)){if(typeof input[key]!=='string'||!input[key].trim()||input[key].length>max)throw new Error(`Enter ${key} (up to ${max} characters).`);clean[key]=input[key].trim();}
 if(!scenarios.some(s=>s.id===input.skill)||!languages.includes(input.language)||!['pending','instructor-reviewed'].includes(input.review))throw new Error('Choose a supported skill, language, and review status.');
 let url;try{url=new URL(input.url);}catch{throw new Error('Enter a valid HTTPS publisher URL.');}
 if(url.protocol!=='https:'||url.username||url.password||url.href.length>2000||['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw new Error('Use an HTTPS publisher URL without embedded credentials.');
 return {...clean,url:url.href,skill:input.skill,language:input.language,review:input.review};
}

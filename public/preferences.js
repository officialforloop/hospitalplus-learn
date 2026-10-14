export const preferenceKey='hospitalplus-learn-preferences-v1';
export const languageOptions=[['en','English'],['yo','Yoruba'],['ha','Hausa'],['ig','Igbo'],['fr','French'],['pt','Portuguese'],['ar','Arabic'],['sw','Swahili']];
export function detectLanguage(languages=[]){
 for(const language of languages){const code=String(language).toLowerCase().split(/[-_]/)[0];if(languageOptions.some(([id])=>id===code))return code;}
 return 'en';
}
export function parsePreferences(raw){
 try{const value=JSON.parse(raw);if(!value||value.version!==1)return null;
 return {version:1,language:languageOptions.some(([id])=>id===value.language)?value.language:'en',size:['standard','large'].includes(value.size)?value.size:'standard',spacing:value.spacing===true};
 }catch{return null;}
}
export function initializePreferences(notify){
 let preferences,stored=false;
 try{preferences=parsePreferences(localStorage.getItem(preferenceKey));stored=!!preferences;}catch{}
 preferences||={version:1,language:detectLanguage(navigator.languages||[navigator.language]),size:'standard',spacing:false};
 const apply=()=>{document.documentElement.dataset.readingSize=preferences.size;document.documentElement.dataset.readingSpacing=String(preferences.spacing);};
 const persist=()=>{apply();try{localStorage.setItem(preferenceKey,JSON.stringify(preferences));notify('Preferences saved on this device.');}catch{notify('Preferences applied for this visit. Device storage is unavailable; choose again next visit.');}};
 apply();
 const dialog=document.createElement('dialog');dialog.className='preferences-dialog panel';dialog.setAttribute('aria-labelledby','preferences-title');
 dialog.innerHTML=`<form method="dialog" id="preferences-form"><h2 id="preferences-title">Choose your language and reading preferences</h2><p id="language-help">Your browser language is suggested on your first visit. Lessons and interface currently use English. Other selections record your preference; they do not translate lessons.</p><label class="structured-label">Preferred language<select name="language" aria-describedby="language-help">${languageOptions.map(([id,label])=>`<option value="${id}">${label}${id==='en'?' · available':' · translation pending'}</option>`).join('')}</select></label><label class="structured-label">Reading text size<select name="size"><option value="standard">Standard</option><option value="large">Larger</option></select></label><label class="offline-toggle"><input type="checkbox" name="spacing"> More space between reading lines</label><p class="muted">These preferences stay on this browser and are separate from your learning record. No language is sent to an instructor.</p><div class="actions"><button class="button" type="submit">Save preferences</button><button class="button secondary" type="button" id="preferences-cancel">Continue without saving</button></div></form>`;
 const help=document.createElement('p');help.className='muted';help.textContent='Keyboard: Tab moves between controls; Shift + Tab moves back. Escape closes this dialog. Use Skip to content to reach the current screen. Browser zoom is also available.';
 dialog.querySelector('.actions').before(help);
 document.body.append(dialog);
 const form=dialog.querySelector('form');
 const open=()=>{form.elements.language.value=preferences.language;form.elements.size.value=preferences.size;form.elements.spacing.checked=preferences.spacing;dialog.showModal();};
 document.querySelector('#preferences-open').addEventListener('click',open);
 dialog.querySelector('#preferences-cancel').addEventListener('click',()=>dialog.close());
 form.addEventListener('submit',()=>{preferences={version:1,language:form.elements.language.value,size:form.elements.size.value,spacing:form.elements.spacing.checked};persist();});
 if(!stored)open();
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {detectLanguage,parsePreferences} from '../public/preferences.js';

test('language detection uses the first supported browser preference and regional tags',()=>{
 assert.equal(detectLanguage(['de-DE','yo-NG','en-US']),'yo');
 assert.equal(detectLanguage(['HA_ng']),'ha');
 assert.equal(detectLanguage(['ar-EG']),'ar');
 assert.equal(detectLanguage(['de-DE']),'en');
 assert.equal(detectLanguage([]),'en');
});
test('preferences recover from missing, malformed and unsupported storage',()=>{
 for(const raw of [null,'{','null','[]','{"version":2}'])assert.equal(parsePreferences(raw),null);
 assert.deepEqual(parsePreferences('{"version":1,"language":"<script>","size":"giant","spacing":"true"}'),{version:1,language:'en',size:'standard',spacing:false});
});
test('reading and language preferences survive serialization without exercise content',()=>{
 const value={version:1,language:'ig',size:'large',spacing:true};
 assert.deepEqual(parsePreferences(JSON.stringify(value)),value);
});

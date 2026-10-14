import {createStore} from '../backend.mjs';
import {mkdirSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
mkdirSync(new URL('../data/',import.meta.url),{recursive:true});
const store=createStore(fileURLToPath(new URL('../data/learn.sqlite',import.meta.url)));
const name=process.argv[2]||'educator';const password=randomBytes(16).toString('base64url');
if(!/^[a-zA-Z0-9_-]{3,40}$/.test(name)){store.db.close();throw new Error('Use a 3–40 character username with letters, numbers, underscores, or hyphens.');}
try{store.createUser(name,password,'instructor');console.log(`Instructor created: ${name}\nTemporary local password: ${password}\nKeep this password private. Ask the owner to change it in Account. Forgotten passwords require the local operator reset command.`);}catch{console.error('Username already exists. Choose another username.');process.exitCode=1;}finally{store.db.close();}

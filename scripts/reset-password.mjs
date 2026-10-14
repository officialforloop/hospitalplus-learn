import {createStore} from '../backend.mjs';
import {existsSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const [name,confirmation]=process.argv.slice(2);
const filename=fileURLToPath(new URL('../data/learn.sqlite',import.meta.url));
if(!name||!/^[a-zA-Z0-9_-]{3,40}$/.test(name)||confirmation!=='--confirm-local-reset'){
 console.error('Usage: node scripts/reset-password.mjs USERNAME --confirm-local-reset\nLocal operators only. Verify the account owner before resetting. Existing sessions will stop working.');process.exitCode=1;
}else if(!existsSync(filename)){console.error('Learning database not found. Start the learning server first.');process.exitCode=1;}
else{const store=createStore(filename);try{const user=store.db.prepare('SELECT id FROM users WHERE name=?').get(name);if(!user)throw new Error('Account not found.');const password=randomBytes(18).toString('base64url');store.setPassword(user.id,password);console.log(`Password reset for ${name}.\nTemporary password: ${password}\nKeep this private. Give it only to the verified account owner and ask them to change it in Account. Existing sessions are invalidated on their next request.`);}catch(error){console.error(error.message);process.exitCode=1;}finally{store.db.close();}}

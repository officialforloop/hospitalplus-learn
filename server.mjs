import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.webmanifest':'application/manifest+json' };
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
    const content = await readFile(target);
    res.writeHead(200, {'Content-Type': (mime[path.extname(target)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff'});
    res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(3100, '127.0.0.1', () => console.log('HospitalPlus Learn: http://127.0.0.1:3100'));

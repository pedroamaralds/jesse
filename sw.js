// Aumente VERSION a cada publicação para forçar atualização do cache.
const VERSION='1.5.3',C='jesse-'+VERSION;
const F=['./','index.html','utils.js','manifest.webmanifest','icons/logo.jpg','icons/icon-192.png','icons/apple-touch-icon.png','icons/favicon-32.png','icons/icon-512.png','icons/maskable-192.png','icons/maskable-512.png','fonts/Inter-Regular.woff','fonts/Inter-SemiBold.woff','fonts/Inter-Bold.woff'];
// cada arquivo é guardado separadamente: um arquivo ausente não impede a instalação
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('jesse-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// rede primeiro (sempre pega a versão nova); sem internet, usa o cache
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(fetch(r).then(n=>{if(n.ok){const x=n.clone();caches.open(C).then(c=>c.put(r,x))}return n}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))))});

const CACHE_NAME = 'teadrunk-cache-v2.5';
const ASSETS = ['./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-apple-touch.png','./icon-maskable.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isIndex = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if(isIndex){ e.respondWith(fetch(new Request(e.request,{cache:'no-store'})).then(r=>{if(r.ok)caches.open(CACHE_NAME).then(c=>c.put('./index.html',r.clone()));return r;}).catch(()=>caches.match('./index.html'))); return; }
  e.respondWith(fetch(new Request(e.request,{cache:'no-store'})).then(r=>{if(r.ok&&e.request.method==='GET')caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>caches.match(e.request)));
});

/* Vigo service worker — v16
   NETWORK-FIRST para la app (index.html) y para el CSS propio (vigo.css): se actualizan solos.
   CACHE-FIRST para fuentes, íconos y GIF (pesados / inmutables). */
const CACHE='vigo-v17';
const CORE=['./','./index.html','./vigo.css',
  './fonts/archivo-latin-standard-normal.woff2',
  './fonts/archivo-latin-ext-standard-normal.woff2',
  './vigo-icon-192.png','./vigo-icon-512.png','./vigo-icon-maskable.svg'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  let url; try{ url=new URL(req.url); }catch(_){ return; }
  const sameOrigin = url.origin===self.location.origin;
  const isNav = req.mode==='navigate' || req.destination==='document' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  // CSS propio (vigo.css y cualquier .css del mismo origen): network-first como la app.
  const isAppCSS = sameOrigin && (req.destination==='style' || url.pathname.endsWith('.css'));
  if(isNav){
    // NETWORK-FIRST: siempre la última app si hay conexión; cae a caché si estás offline
    e.respondWith(
      fetch(req).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put('./index.html',cp)); return res; })
        .catch(()=> caches.match('./index.html').then(h=> h || caches.match(req)))
    );
    return;
  }
  if(isAppCSS){
    // NETWORK-FIRST para el CSS: el re-skin llega tan rápido como el HTML; offline cae al caché.
    e.respondWith(
      fetch(req).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); return res; })
        .catch(()=> caches.match(req).then(h=> h || caches.match('./vigo.css')))
    );
    return;
  }
  // Resto (fuentes, íconos, GIF, assets): CACHE-FIRST y cacheo en runtime lo propio + demos
  e.respondWith(
    caches.match(req).then(hit=> hit || fetch(req).then(res=>{
      try{ if(url.pathname.includes('/gifs/')||url.pathname.includes('/assets/')||url.pathname.includes('/fonts/')||/jsdelivr|githubusercontent/.test(url.host)){
        const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } }catch(_){}
      return res;
    }).catch(()=>hit))
  );
});

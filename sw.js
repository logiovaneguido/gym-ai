/* Gym AI service worker — v10 (network-first para la app; cache-first para GIF/assets) */
const CACHE='gymai-v10';
const CORE=['./','./index.html'];
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
  const isNav = req.mode==='navigate' || req.destination==='document' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if(isNav){
    // NETWORK-FIRST: siempre la última app si hay conexión; cae a caché si estás offline
    e.respondWith(
      fetch(req).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put('./index.html',cp)); return res; })
        .catch(()=> caches.match('./index.html').then(h=> h || caches.match(req)))
    );
    return;
  }
  // Resto (GIF, assets): CACHE-FIRST y cacheo en runtime lo propio + demos
  e.respondWith(
    caches.match(req).then(hit=> hit || fetch(req).then(res=>{
      try{ if(url.pathname.includes('/gifs/')||url.pathname.includes('/assets/')||/jsdelivr|githubusercontent/.test(url.host)){
        const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } }catch(_){}
      return res;
    }).catch(()=>hit))
  );
});

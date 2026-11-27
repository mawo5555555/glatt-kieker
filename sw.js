// Service Worker: App-Hülle aus dem Cache, Daten immer frisch aus dem Netz
const V="gk-1.61",LIB="gk-lib-1",SHELL=["./","index.html","engine.js","manifest.webmanifest","icon-192.png","models/auto.glb"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==LIB).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(u.hostname==="unpkg.com"){e.respondWith(caches.open(LIB).then(c=>c.match(e.request).then(h=>h||fetch(e.request).then(r=>{if(r.ok||r.type==="opaque")c.put(e.request,r.clone());return r}))));return} // 1.61: Karten-Bibliotheken fest (Version im Pfad)
  if(u.hostname==="tiles.openfreemap.org"&&!/\.pbf$/.test(u.pathname)){e.respondWith(caches.open(LIB).then(c=>c.match(e.request).then(h=>{const f=fetch(e.request).then(r=>{if(r.ok||r.type==="opaque")c.put(e.request,r.clone());return r});return h||f})));return} // Stil, Schrift, Symbole: sofort aus Cache, im Hintergrund auffrischen
  if(u.origin!==location.origin)return;               // Wetter-, Routing- und Kartendaten nie cachen
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});

// Push: ohne Nutzdaten; Text wird beim Eintreffen vom Server geholt
const API="https://glaettekieker-api.mawo555.workers.dev";
self.addEventListener("push",e=>{e.waitUntil((async()=>{
  let title="Glätte-Kieker",body="Neue Meldung";
  try{const s=await self.registration.pushManager.getSubscription();
    const r=await fetch(API+"/push/pull",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({endpoint:s.endpoint})});
    const j=await r.json();if(j.title){title=j.title;body=j.body}}catch(x){}
  await self.registration.showNotification(title,{body,icon:"icon-192.png",tag:"gk-"+Date.now()});
})())});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window"}).then(l=>l.length?l[0].focus():self.clients.openWindow("./")))});

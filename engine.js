/* Glätte-Kieker Rechenkern: von App (index.html) und Server (tools/build_worker.py) gemeinsam genutzt. */
/* Gemeinsamer Zustand (App setzt ihn, Server-Build ersetzt ihn durch eigene Stubs). ls/gkLog stellt die App bereit. */
var CAL=null,cache={};
var VARS=["temperature_2m","dew_point_2m","soil_temperature_0cm","relative_humidity_2m","precipitation","rain","snowfall","weather_code","cloud_cover","wind_speed_10m","visibility","is_day"];
function hav(a,b){var R=6371000,p1=a[1]*Math.PI/180,p2=b[1]*Math.PI/180,dp=p2-p1,dl=(b[0]-a[0])*Math.PI/180;
  var x=Math.sin(dp/2)*Math.sin(dp/2)+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)*Math.sin(dl/2);return 2*R*Math.asin(Math.sqrt(x))}
function berlinParts(){var p=new Date().toLocaleString("sv-SE",{timeZone:"Europe/Berlin"});return {key:p.slice(0,13).replace(" ","T")+":00",h:+p.slice(11,13)}}
function fetchJson(url,ms){
  var c=new AbortController(),to=setTimeout(function(){c.abort()},ms||25000),t0=Date.now(),h=String(url).split("/")[2]||url;
  return fetch(url,{signal:c.signal}).then(function(r){clearTimeout(to);if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).catch(function(e){clearTimeout(to);gkLog("Netz",h+": "+(e&&e.name==="AbortError"?"Zeitüberschreitung nach "+Math.round((Date.now()-t0)/1000)+" s":(e&&e.message||e)));throw e});
}
function route(a,b){
  var u="https://router.project-osrm.org/route/v1/driving/"+a.lon+","+a.lat+";"+b.lon+","+b.lat+"?overview=full&geometries=geojson&steps=false";
  var ck="gk_rt2_"+[a.lat,a.lon,b.lat,b.lon].map(function(x){return (+x).toFixed(3)}).join("_"),c=null;
  try{c=JSON.parse(ls(ck)||"null")}catch(e){}
  if(c&&c.r&&c.r.geometry&&Date.now()-c.t<7*86400e3)return Promise.resolve(c.r);
  var u2=u.replace("https://router.project-osrm.org/","https://routing.openstreetmap.de/routed-car/");
  function ask(t,uu){return fetchJson(uu||u,t).then(function(d){
    if(d.code!=="Ok"||!d.routes.length)throw new Error("Keine Route gefunden.");
    try{ls(ck,JSON.stringify({t:Date.now(),r:d.routes[0]}))}catch(e){}
    return d.routes[0];
  })}
  return ask(15000).catch(function(){return ask(20000,u2)}).catch(function(){return ask(25000)}).catch(function(err){
    if(c&&c.r&&c.r.geometry)return c.r;
    throw err;
  });
}
function split(coords,segM){
  var segs=[],cur=[coords[0]],acc=0;
  for(var i=1;i<coords.length;i++){var d=hav(coords[i-1],coords[i]);acc+=d;cur.push(coords[i]);if(acc>=segM){segs.push({pts:cur,m:acc});cur=[coords[i]];acc=0}}
  if(cur.length>1){if(segs.length&&acc<segM/2){var l=segs[segs.length-1];l.pts=l.pts.concat(cur.slice(1));l.m+=acc}else segs.push({pts:cur,m:acc})}
  return segs;
}
function fetchWeather(cells){
  var chunks=[];
  for(var i=0;i<cells.length;i+=40)chunks.push(cells.slice(i,i+40));
  return Promise.all(chunks.map(function(ch){
    var u="https://api.open-meteo.com/v1/forecast?latitude="+ch.map(function(c){return c.lat.toFixed(3)}).join(",")+
      "&longitude="+ch.map(function(c){return c.lon.toFixed(3)}).join(",")+"&hourly="+VARS.join(",")+
      "&models=icon_d2,icon_eu&past_hours=6&forecast_hours=66&timezone=Europe%2FBerlin&wind_speed_unit=ms";
    var u2="https://api.open-meteo.com/v1/forecast?latitude="+ch.map(function(c){return c.lat.toFixed(3)}).join(",")+
      "&longitude="+ch.map(function(c){return c.lon.toFixed(3)}).join(",")+"&hourly=temperature_2m,dew_point_2m,precipitation"+
      "&models=ecmwf_ifs025,gfs_seamless&past_hours=6&forecast_hours=66&timezone=Europe%2FBerlin";
    var p2=fetchJson(u2,40000).catch(function(){gkLog("Info","Zusatzmodelle nicht verfügbar");return null});
    return Promise.all([fetchJson(u,40000),p2]).then(function(r){var d=Array.isArray(r[0])?r[0]:[r[0]],e=r[1]?(Array.isArray(r[1])?r[1]:[r[1]]):[];
      d.forEach(function(x,i){var y=e[i];if(y&&y.hourly&&x.hourly)for(var k in y.hourly)if(k!=="time")x.hourly[k]=y.hourly[k]});return d});
  })).then(function(parts){return [].concat.apply([],parts)});
}
function fetchWeatherC(cells,ck){
  var pk="gk_w_"+ck,pc=null;try{pc=JSON.parse(ls(pk)||"null")}catch(e){}
  if(pc&&pc.n===cells.length&&Date.now()-pc.t<600000)return Promise.resolve(pc.w);
  return fetchWeather(cells).then(function(w){try{ls(pk,JSON.stringify({t:Date.now(),n:cells.length,w:w}))}catch(e){}return w}).catch(function(e){
    if(pc&&pc.n===cells.length&&Date.now()-pc.t<6*3600e3){gkLog("Info","Wetter aus Zwischenspeicher");return pc.w}
    throw e;
  });
}
var ENSW={"temperature_2m":1,"dew_point_2m":1,"precipitation":1};
/* Rechenmodell 1.60 (Plan E). ALLE Faustwerte UNBESTAETIGT (keine zwei belastbaren Quellen mit Zahlen),
   werden ueber die Kontrollschleife (Tesla/DWD) nachgestellt. on=false rechnet exakt wie 1.59.
   brDay/brNight/brClear: Bruecke Tag/Nacht/zusaetzlich bei klarer windstiller Nacht (°C, anteilig nach Brueckenanteil)
   foNight: Wald daempft naechtliche Abstrahlung (+°C bei klarer Nacht), foMorn: Wald morgens bis 11 Uhr laenger kalt
   radMax: zusaetzliche Abstrahlung klare windstille Nacht, resMax: Restwaerme am Abend nach sonnigem Tag
   saltH/saltKm: Streusalz-Meldung wirkt so viele Stunden / in diesem Umkreis */
var EM={on:true,brDay:-0.5,brNight:-1.0,brClear:-0.7,foNight:0.6,foMorn:-0.5,radMax:-0.5,resMax:0.8,saltH:4,saltKm:1.5,osmDays:30};
var _MEM=null,MEMS=["_icon_d2","_icon_eu","_ecmwf_ifs025","_gfs_seamless"];
function gI(h,k,i,def){
  var a=h[k+"_icon_d2"],v=a?a[i]:null;
  if(v==null){a=h[k+"_icon_eu"];v=a?a[i]:null}
  if(v==null&&h[k])v=h[k][i];
  return v==null?def:v;
}
function spread(h,i){
  var m=[],a,v,n=["_icon_d2","_icon_eu","_ecmwf_ifs025","_gfs_seamless"];
  for(var j=0;j<n.length;j++){a=h["temperature_2m"+n[j]];v=a?a[i]:null;if(v!=null)m.push(v)}
  if(m.length<2)return 0;return Math.max.apply(null,m)-Math.min.apply(null,m);
}
function g(h,k,i,def){
  if(_MEM&&ENSW[k]){var am=h[k+_MEM];if(am&&am[i]!=null)return am[i]}
  if(ENSW[k]){
    var cw=CAL&&CAL.apply&&CAL.w?CAL:null,bs=cw&&(k==="temperature_2m"||k==="dew_point_2m")?cw.b:null,
        wi=cw?cw.w.i:2,we=cw?cw.w.e:1.2,wg=cw?cw.w.g:0.6,sum=0,w=0,vi=gI(h,k,i,null),a,v;
    if(vi!=null){sum+=(vi-(bs?bs.i:0))*wi;w+=wi}
    a=h[k+"_ecmwf_ifs025"];v=a?a[i]:null;if(v!=null){sum+=(v-(bs?bs.e:0))*we;w+=we}
    a=h[k+"_gfs_seamless"];v=a?a[i]:null;if(v!=null){sum+=(v-(bs?bs.g:0))*wg;w+=wg}
    if(w>0)return sum/w;
  }
  var a=h[k+"_icon_d2"],v=a?a[i]:null;
  if(v==null){a=h[k+"_icon_eu"];v=a?a[i]:null}
  if(v==null&&h[k])v=h[k][i];
  return v==null?def:v;
}
function clearF(h,i){var c=g(h,"cloud_cover",i,100),w=g(h,"wind_speed_10m",i,5);return Math.max(0,1-c/80)*Math.max(0,1-w/5)}
/* Zuschlag auf die Fahrbahntemperatur (°C): Abstrahlung, Restwaerme, Bruecke, Wald. f={br:0..1,fo:0..1} je Abschnitt. */
function surfAdj(h,i,f){
  if(!EM.on)return 0;
  var day=g(h,"is_day",i,1),cf=clearF(h,i),a=0,tm=h.time&&h.time[i],hr=tm?+String(tm).slice(11,13):12,j;
  if(!day){
    a+=EM.radMax*cf;
    var t=g(h,"temperature_2m",i,5),mx=-99,sun=0,since=99;
    for(j=i-1;j>=Math.max(0,i-12);j--){var tj=g(h,"temperature_2m",j,null);if(tj!=null&&tj>mx)mx=tj;
      if(g(h,"is_day",j,0)){if(since===99)since=i-j;if(g(h,"cloud_cover",j,100)<=40)sun++}}
    if(sun>=3&&mx-t>=4&&since<=6)a+=EM.resMax*(1-(since-1)/6);
  }
  if(f){
    if(f.br)a+=f.br*(day?EM.brDay:EM.brNight+EM.brClear*cf);
    if(f.fo){if(!day)a+=f.fo*EM.foNight*cf;else if(hr<11)a+=f.fo*EM.foMorn}
  }
  return a;
}
/* Glaettewahrscheinlichkeit (%) aus Modellstreuung: Anteil der Einzelmodelle mit Stufe>=1, Mischmodell zaehlt mit. */
function probOf(h,i,f,main){
  var hit=main>=1?1:0,n=1,q,a;
  for(q=0;q<MEMS.length;q++){a=h["temperature_2m"+MEMS[q]];if(!a||a[i]==null)continue;
    _MEM=MEMS[q];try{if(rateCore(h,i,f)[0]>=1)hit++}finally{_MEM=null}n++}
  return Math.max(5,Math.min(95,Math.round(100*hit/n)));
}
function rate(h,i,f){
  var b=rateCore(h,i,f);if(!EM.on)return b;
  var p=probOf(h,i,f,b[0]);b[2]=p;
  if(/^Wettermodelle uneinig/.test(b[1]))b[1]="Glätte "+(p>=60?"wahrscheinlich":"möglich")+" ("+p+" %): "+b[1].replace(/^Wettermodelle uneinig \(bis ([0-9.]+) °C Unterschied\), mindestens zwei Modelle sagen Frost/,"bis $1 °C Unterschied zwischen den Modellen, mindestens zwei sagen Frost");
  return b;
}
function rateCore(h,i,f){
  var t=g(h,"temperature_2m",i,5),td=g(h,"dew_point_2m",i,t-3),surf=g(h,"soil_temperature_0cm",i,t)+(t-gI(h,"temperature_2m",i,t))*0.7+surfAdj(h,i,f),
      rh=g(h,"relative_humidity_2m",i,70),code=g(h,"weather_code",i,0),rain=g(h,"rain",i,0),snow=g(h,"snowfall",i,0),
      cloud=g(h,"cloud_cover",i,100),wind=g(h,"wind_speed_10m",i,5),vis=g(h,"visibility",i,20000),day=g(h,"is_day",i,1);
  var pr=0,s12=0,j;
  for(j=Math.max(0,i-3);j<=i;j++)pr+=g(h,"precipitation",j,0);
  for(j=Math.max(0,i-11);j<=i;j++)s12+=g(h,"snowfall",j,0);
  var best=[0,"Unauffällig. Fahrbahn ca. "+surf.toFixed(1)+" °C, Luft "+t.toFixed(1)+" °C."];
  function up(s,txt){if(s>best[0])best=[s,txt]}
  if([56,57,66,67].indexOf(code)>=0||(rain>0&&surf<=0))up(2,"Gefrierender Regen möglich (Fahrbahn "+surf.toFixed(1)+" °C bei Regen): Glatteisgefahr.");
  if(surf<=0&&(pr>=0.1||rh>=95))up((surf<=-1&&pr>=0.1)?2:1,"Fahrbahn "+surf.toFixed(1)+" °C und nass: überfrierende Nässe möglich.");
  if(surf<=0&&surf<=td)up(1,"Fahrbahn "+surf.toFixed(1)+" °C unter Taupunkt "+td.toFixed(1)+" °C: Reifglätte möglich.");
  if(snow>0&&surf<=1)up(1,"Schneefall bei Fahrbahn "+surf.toFixed(1)+" °C: Schneeglätte möglich.");
  if(s12>=5)up(2,"Starker Schneefall ("+s12.toFixed(0)+" cm in 12 h): Schneeglätte.");
  if(t>=0&&t<=4&&cloud<=25&&wind<=3&&!day&&rh>=85)up(1,"Klare, windschwache Nacht bei "+t.toFixed(1)+" °C: Boden kann überfrieren.");
  var sp=spread(h,i),nc=0,nn=["_icon_d2","_icon_eu","_ecmwf_ifs025","_gfs_seamless"],q,aa;
  for(q=0;q<nn.length;q++){aa=h["temperature_2m"+nn[q]];if(aa&&aa[i]!=null&&aa[i]<=0.5)nc++}
  if(!_MEM&&sp>=3&&nc>=2&&surf<=1.5&&surf>=-1.5)up(1,"Wettermodelle uneinig (bis "+sp.toFixed(1)+" °C Unterschied), mindestens zwei Modelle sagen Frost, Fahrbahn um "+surf.toFixed(1)+" °C: Glätte nicht auszuschließen.");
  if(vis<150)up(2,"Sicht unter 150 m: Nebel.");else if(vis<1000)up(1,"Sicht unter 1 km: Nebel.");
  return best;
}
/* ---- OpenStreetMap: Bruecken- und Waldanteil je Abschnitt (Overpass, 30 Tage gespeichert) ---- */
function xyM(p,o){return [(p[0]-o[0])*111320*Math.cos(o[1]*Math.PI/180),(p[1]-o[1])*110540]}
function dSeg(p,a,b){var dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy,t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;t=Math.max(0,Math.min(1,t));var x=a[0]+t*dx-p[0],y=a[1]+t*dy-p[1];return Math.sqrt(x*x+y*y)}
function inPoly(p,r){var c=false,i,j;for(i=0,j=r.length-1;i<r.length;j=i++){if(((r[i][1]>p[1])!==(r[j][1]>p[1]))&&(p[0]<(r[j][0]-r[i][0])*(p[1]-r[i][1])/(r[j][1]-r[i][1])+r[i][0]))c=!c}return c}
function osmFracCalc(segs,els){
  var o=segs[0].pts[0],ways=[];
  (els||[]).forEach(function(e){if(!e.geometry||e.geometry.length<2)return;var tg=e.tags||{},pts=e.geometry.map(function(q){return xyM([q.lon,q.lat],o)}),
    bb=[1e9,1e9,-1e9,-1e9];pts.forEach(function(q){bb[0]=Math.min(bb[0],q[0]);bb[1]=Math.min(bb[1],q[1]);bb[2]=Math.max(bb[2],q[0]);bb[3]=Math.max(bb[3],q[1])});
    ways.push({br:!!(tg.bridge&&tg.bridge!=="no"&&tg.highway),pts:pts,bb:bb,closed:e.geometry.length>3&&e.geometry[0].lat===e.geometry[e.geometry.length-1].lat&&e.geometry[0].lon===e.geometry[e.geometry.length-1].lon})});
  return segs.map(function(s){
    var smp=[],k,j;for(k=1;k<s.pts.length;k++){var a=xyM(s.pts[k-1],o),b=xyM(s.pts[k],o),n=Math.max(1,Math.round(Math.sqrt((b[0]-a[0])*(b[0]-a[0])+(b[1]-a[1])*(b[1]-a[1]))/50));
      for(j=0;j<n;j++)smp.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n])}
    if(!smp.length)return [0,0];
    var nb=0,nf=0;
    smp.forEach(function(p){var isB=false,isF=false;
      ways.forEach(function(w){var m=w.br?20:40;if(p[0]<w.bb[0]-m||p[0]>w.bb[2]+m||p[1]<w.bb[1]-m||p[1]>w.bb[3]+m)return;
        if(w.br){if(!isB)for(var q=1;q<w.pts.length;q++)if(dSeg(p,w.pts[q-1],w.pts[q])<=15){isB=true;break}}
        else if(!isF){if(w.closed&&inPoly(p,w.pts))isF=true;else for(var q2=1;q2<w.pts.length;q2++)if(dSeg(p,w.pts[q2-1],w.pts[q2])<=40){isF=true;break}}
      });if(isB)nb++;if(isF)nf++});
    return [Math.round(100*nb/smp.length)/100,Math.round(100*nf/smp.length)/100];
  });
}
function osmFrac(segs,ck){
  var key="gk_osm_"+String(ck).replace(/[^0-9.,>-]/g,""),c=null;try{c=JSON.parse(ls(key)||"null")}catch(e){}
  if(c&&c.n===segs.length&&Date.now()-c.t<EM.osmDays*864e5)return Promise.resolve(c.f);
  var pts=[];segs.forEach(function(s){s.pts.forEach(function(p){if(!pts.length||hav(pts[pts.length-1],p)>400)pts.push(p)})});
  var last=segs[segs.length-1].pts;pts.push(last[last.length-1]);
  while(pts.length>250)pts=pts.filter(function(_,i){return i%2===0||i===pts.length-1});
  var pl=pts.map(function(p){return p[1].toFixed(4)+","+p[0].toFixed(4)}).join(",");
  var q="[out:json][timeout:25];(way[highway][bridge][bridge!=no](around:25,"+pl+");way[landuse=forest](around:60,"+pl+");way[natural=wood](around:60,"+pl+"););out geom;";
  var qs="?data="+encodeURIComponent(q);
  return fetchJson("https://overpass-api.de/api/interpreter"+qs,30000).catch(function(){return fetchJson("https://maps.mail.ru/osm/tools/overpass/api/interpreter"+qs,30000)}).then(function(r){
    var f=osmFracCalc(segs,r.elements);try{ls(key,JSON.stringify({t:Date.now(),n:segs.length,f:f}))}catch(e){}return f});
}
/* ---- 15-Minuten-Werte ICON-D2 (naechste 6 h) ---- */
function fetchM15(cells){
  var chunks=[];for(var i=0;i<cells.length;i+=40)chunks.push(cells.slice(i,i+40));
  return Promise.all(chunks.map(function(ch){
    return fetchJson("https://api.open-meteo.com/v1/forecast?latitude="+ch.map(function(c){return c.lat.toFixed(3)}).join(",")+"&longitude="+ch.map(function(c){return c.lon.toFixed(3)}).join(",")+
      "&minutely_15=precipitation,snowfall,temperature_2m&models=icon_d2&forecast_minutely_15=24&timezone=Europe%2FBerlin",25000).then(function(r){return Array.isArray(r)?r:[r]});
  })).then(function(p){return [].concat.apply([],p).map(function(x){return x&&x.minutely_15||null})});
}
/* erster Niederschlag (>=0.1 mm/15 min) an der Strecke in den naechsten 6 h: {time,kind,t,seg} oder null */
function preStart(d){
  if(!d.m15)return null;var best=null,ns=new Date().toLocaleString("sv-SE",{timeZone:"Europe/Berlin"}).replace(" ","T").slice(0,16),mm=Math.floor(+ns.slice(14,16)/15)*15,now=ns.slice(0,14)+(mm<10?"0":"")+mm;
  d.segs.forEach(function(s,si){var m=d.m15[s.cell];if(!m||!m.time)return;
    for(var j=0;j<m.time.length;j++){if(m.time[j]<now)continue;
      if((m.precipitation[j]||0)>=0.1){if(!best||m.time[j]<best.time)best={time:m.time[j],kind:(m.snowfall[j]||0)>0?"Schnee":((m.temperature_2m[j]!=null&&m.temperature_2m[j]<=0.5)?"Regen bei Frost":"Regen"),t:m.temperature_2m[j],seg:si};break}}});
  return best;
}
/* 15-min-Werte in die ersten 6 Stunden: Niederschlag innerhalb der Stunde bei kalter Fahrbahn -> mindestens Stufe 1 */
function m15Bump(d,s,h,off){
  var m=d.m15&&d.m15[s.cell];if(!m||!m.time)return;
  for(var k=0;k<Math.min(6,d.n);k++){if(s.lv[k]>=1)continue;
    var ix=Math.max(0,Math.min(d.times.length-1,d.start+k+off)),hk=d.times[ix].slice(0,13),pr=0,tmin=99,first=null,sn=0;
    for(var j=0;j<m.time.length;j++)if(m.time[j].slice(0,13)===hk){var v=m.precipitation[j]||0;pr+=v;sn+=m.snowfall[j]||0;if(v>=0.1&&!first)first=m.time[j].slice(11,16);if(m.temperature_2m[j]!=null&&m.temperature_2m[j]<tmin)tmin=m.temperature_2m[j]}
    var surf=g(h,"soil_temperature_0cm",ix,5)+surfAdj(h,ix,s);
    if(first&&pr>=0.1&&surf<=0.5&&tmin<=1.5){s.lv[k]=1;s.why[k]=(sn>0?"Schnee":"Niederschlag")+" ab "+first+" (15-Minuten-Werte) bei Fahrbahn "+surf.toFixed(1)+" °C: Glätte möglich."}
  }
}
/* Streusalz: Meldung "gestreut" stuft Abschnitte im Umkreis fuer EM.saltH Stunden um eine Stufe herab (nicht bei Eisregen/starkem Schnee) */
function applySalt(d,reps,nowMs){
  if(!EM.on||!reps||!reps.length||d._salted)return 0;d._salted=1;nowMs=nowMs||Date.now();var n=0;
  d.segs.forEach(function(s){
    reps.forEach(function(r){
      if(r.kind!=="gestreut")return;var age=(nowMs-r.ts)/3600e3;if(age<0||age>=EM.saltH)return;
      var near=false;for(var j=0;j<s.pts.length&&!near;j+=3)if(hav([+r.lon,+r.lat],s.pts[j])<=EM.saltKm*1000)near=true;
      if(!near)return;
      for(var k=0;k<Math.min(d.n,Math.ceil(EM.saltH-age));k++){
        if(s.lv[k]>0&&!/^(Gefrierender Regen|Starker Schneefall|Sicht)/.test(s.why[k]||"")&&!/^Gestreut/.test(s.why[k]||"")){s.lv[k]--;s.why[k]="Gestreut gemeldet vor "+Math.round(age*60)+" Min., daher herabgestuft. Sonst: "+s.why[k];n++}
      }
    });
  });
  return n;
}
function probAt(d,k){var p=null;d.segs.forEach(function(s){if(s.pp&&s.pp[k]!=null&&s.lv[k]>=1&&(p==null||s.pp[k]>p))p=s.pp[k]});return p}
function compute(rt,stage){
  var A=rt.from,B=rt.to,ck=A.lat+","+A.lon+">"+B.lat+","+B.lon,c=cache[ck];
  if(c&&Date.now()-c.t<1800000)return Promise.resolve(c.d);
  return route(A,B).then(function(R){
    if(stage)stage("Wetterdaten werden geladen …");
    var km=R.distance/1000,segs=split(R.geometry.coordinates,Math.max(2000,R.distance/90));
    var scale=Math.max(1,km/120),cl=0.018*scale,co=0.0295*scale,cells=[],idx={};
    segs.forEach(function(s){
      var m=s.pts[Math.floor(s.pts.length/2)],k=Math.round(m[1]/cl)+"_"+Math.round(m[0]/co);
      if(!(k in idx)){idx[k]=cells.length;cells.push({lat:Math.round(m[1]/cl)*cl,lon:Math.round(m[0]/co)*co})}
      s.cell=idx[k];
    });
    var osmP=EM.on?osmFrac(segs,ck).catch(function(){gkLog("Info","OSM (Brücken/Wald) nicht verfügbar");return null}):Promise.resolve(null);
    var osmT=Promise.race([osmP,new Promise(function(r){setTimeout(function(){r(null)},12000)})]);
    var m15P=EM.on?fetchM15(cells).catch(function(){return null}):Promise.resolve(null);
    return Promise.all([fetchWeatherC(cells,ck),osmT,m15P]).then(function(rr){
      var w=rr[0],of=rr[1];
      if(of&&of.length===segs.length)segs.forEach(function(s,i){s.br=of[i][0];s.fo=of[i][1]});
      var d={A:A,B:B,R:R,segs:segs,cells:cells,w:w,km:km,m15:rr[2],osm:!!of};
      var times=w[0].hourly.time,now=berlinParts().key,start=0;
      for(var i=0;i<times.length;i++){if(times[i]>=now){start=i;break}}
      var n=Math.min(48,times.length-start-8);if(n<12)n=Math.min(12,times.length-start);
      var cum=0,tot=R.distance;
      segs.forEach(function(s){s.midFrac=(cum+s.m/2)/tot;cum+=s.m});
      d.start=start;d.n=n;d.times=times;d.durMin=R.duration/60;
      segs.forEach(function(s){
        s.lv=[];s.why=[];s.pp=[];var h=w[s.cell].hourly,off=Math.round(s.midFrac*d.durMin/60),raw=[];
        for(var k=-2;k<n;k++){var ix0=Math.max(0,Math.min(times.length-1,start+k+off));raw.push(rate(h,ix0,s))}
        for(var k2=0;k2<n;k2++){
          var r=raw[k2+2],lvl=r[0],txt=r[1],ixN=Math.max(0,Math.min(times.length-1,start+k2+off));
          if(lvl<1){
            var prev=Math.max(raw[k2][0],raw[k2+1][0]),surf=g(h,"soil_temperature_0cm",ixN,5);
            if(prev>=1&&surf<=1){lvl=1;txt="Nachhall: vor 1–2 Std. glatt, Fahrbahn noch "+surf.toFixed(1)+" °C.";if(EM.on)r=[r[0],r[1],Math.max(raw[k2][2]||0,raw[k2+1][2]||0)||null]}
          }
          s.lv.push(lvl);s.why.push(txt);s.pp.push(r[2]==null?null:r[2]);
        }
        if(EM.on)m15Bump(d,s,h,off);
      });
      d.pre=EM.on?preStart(d):null;
      d._t=Date.now();cache[ck]={t:d._t,d:d};return d;
    });
  });
}
function levelAt(d,k){var m=0;d.segs.forEach(function(s){if(s.lv[k]>m)m=s.lv[k]});return m}

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
function rate(h,i){
  var t=g(h,"temperature_2m",i,5),td=g(h,"dew_point_2m",i,t-3),surf=g(h,"soil_temperature_0cm",i,t)+(t-gI(h,"temperature_2m",i,t))*0.7,
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
  if(sp>=3&&nc>=2&&surf<=1.5&&surf>=-1.5)up(1,"Wettermodelle uneinig (bis "+sp.toFixed(1)+" °C Unterschied), mindestens zwei Modelle sagen Frost, Fahrbahn um "+surf.toFixed(1)+" °C: Glätte nicht auszuschließen.");
  if(vis<150)up(2,"Sicht unter 150 m: Nebel.");else if(vis<1000)up(1,"Sicht unter 1 km: Nebel.");
  return best;
}
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
    return fetchWeatherC(cells,ck).then(function(w){
      var d={A:A,B:B,R:R,segs:segs,cells:cells,w:w,km:km};
      var times=w[0].hourly.time,now=berlinParts().key,start=0;
      for(var i=0;i<times.length;i++){if(times[i]>=now){start=i;break}}
      var n=Math.min(48,times.length-start-8);if(n<12)n=Math.min(12,times.length-start);
      var cum=0,tot=R.distance;
      segs.forEach(function(s){s.midFrac=(cum+s.m/2)/tot;cum+=s.m});
      d.start=start;d.n=n;d.times=times;d.durMin=R.duration/60;
      segs.forEach(function(s){
        s.lv=[];s.why=[];var h=w[s.cell].hourly,off=Math.round(s.midFrac*d.durMin/60),raw=[];
        for(var k=-2;k<n;k++){var ix0=Math.max(0,Math.min(times.length-1,start+k+off));raw.push(rate(h,ix0))}
        for(var k2=0;k2<n;k2++){
          var r=raw[k2+2],lvl=r[0],txt=r[1],ixN=Math.max(0,Math.min(times.length-1,start+k2+off));
          if(lvl<1){
            var prev=Math.max(raw[k2][0],raw[k2+1][0]),surf=g(h,"soil_temperature_0cm",ixN,5);
            if(prev>=1&&surf<=1){lvl=1;txt="Nachhall: vor 1–2 Std. glatt, Fahrbahn noch "+surf.toFixed(1)+" °C."}
          }
          s.lv.push(lvl);s.why.push(txt);
        }
      });
      d._t=Date.now();cache[ck]={t:d._t,d:d};return d;
    });
  });
}
function levelAt(d,k){var m=0;d.segs.forEach(function(s){if(s.lv[k]>m)m=s.lv[k]});return m}

const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const PUB=path.join(__dirname,'public');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.png':'image/png'};
const srv=http.createServer((q,r)=>{
  let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';
  const f=path.join(PUB,path.normalize(u));
  if(!f.startsWith(PUB)){r.writeHead(403);return r.end()}
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('404')}
    r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});r.end(d)});
});
const wss=new WebSocketServer({server:srv,path:'/ws'});
const rooms=new Map();
const send=(c,o)=>{if(c.readyState===1)c.send(JSON.stringify(o))};
function presence(code){
  const R=rooms.get(code);if(!R)return;
  const on=R.slots.map(x=>!!x&&x.readyState===1);
  wss.clients.forEach(c=>{if(c.room===code)send(c,{t:'pr',on})});
}
wss.on('connection',ws=>{
  ws.alive=true;ws.on('pong',()=>{ws.alive=true});
  ws.on('message',raw=>{
    let m;try{m=JSON.parse(raw)}catch(e){return}
    if(m.t==='j'&&typeof m.r==='string'&&!ws.room){
      const code=m.r.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,12);if(!code)return;
      if(!rooms.has(code)){if(rooms.size>=500)rooms.delete(rooms.keys().next().value);rooms.set(code,{docs:{},slots:[null,null]})}
      const R=rooms.get(code),open=x=>x&&x.readyState===1;
      let s=(m.s===0||m.s===1)?m.s:R.slots.findIndex(x=>!open(x));
      if(s<0){send(ws,{t:'full'});return ws.close()}
      const old=R.slots[s];
      if(open(old)&&old!==ws){send(old,{t:'kick'});old.room=null;old.close()}
      R.slots[s]=ws;ws.room=code;ws.slot=s;
      send(ws,{t:'hi',slot:s});send(ws,{t:'all',d:R.docs});presence(code);
    }else if(m.t==='s'&&ws.room&&['meta','p0','p1'].includes(m.k)&&typeof m.v==='string'&&m.v.length<30000){
      rooms.get(ws.room).docs[m.k]=m.v;
      wss.clients.forEach(c=>{if(c!==ws&&c.room===ws.room)send(c,{t:'s',k:m.k,v:m.v})});
    }
  });
  ws.on('close',()=>{
    const R=ws.room&&rooms.get(ws.room);
    if(R&&R.slots[ws.slot]===ws){R.slots[ws.slot]=null;presence(ws.room)}
  });
});
setInterval(()=>wss.clients.forEach(c=>{if(!c.alive)return c.terminate();c.alive=false;c.ping()}),30000);
srv.listen(process.env.PORT||3000,()=>console.log('Servidor na porta',process.env.PORT||3000));

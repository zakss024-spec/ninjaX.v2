"use client";
import {useEffect,useState} from "react"; import {supabase,supabaseConfigured} from "@/lib/supabase";
type Msg={id:string;username:string;content:string;created_at:string};
export default function NinjaX(){
 const [tab,setTab]=useState("HOME"),[boot,setBoot]=useState(true),[name,setName]=useState("Ninja"),[pass,setPass]=useState(""),[authed,setAuthed]=useState(false),[msgs,setMsgs]=useState<Msg[]>([]),[text,setText]=useState(""),[live,setLive]=useState(false);
 useEffect(()=>{const t=setTimeout(()=>setBoot(false),1200);return()=>clearTimeout(t)},[]);
 useEffect(()=>{if(!authed||!supabaseConfigured())return;let mounted=true;
  supabase.from("messages").select("id,username,content,created_at").order("created_at",{ascending:true}).limit(100).then(({data})=>{if(mounted&&data)setMsgs(data as Msg[])});
  const ch=supabase.channel("ninjax-chat").on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},p=>{const m=p.new as Msg;setMsgs(x=>x.some(a=>a.id===m.id)?x:[...x,m])}).subscribe(s=>setLive(s==="SUBSCRIBED"));
  return()=>{mounted=false;supabase.removeChannel(ch)}},[authed]);
 async function send(){const c=text.trim();if(!c)return;if(!supabaseConfigured()){alert("Configure Supabase first");return}const {error}=await supabase.from("messages").insert({username:name,content:c});if(!error)setText("")}
 if(boot)return <div className="screen"><div className="hole"/> <h1>NINJAX</h1><p>INITIALIZING...</p><button onClick={()=>setBoot(false)}>SKIP INTRO</button></div>;
 if(!authed)return <div className="screen"><div className="card"><small>NINJAX // SECURE ACCESS</small><h1>LOGIN</h1><input value={name} onChange={e=>setName(e.target.value)} placeholder="USERNAME"/><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="PASSWORD"/><button onClick={()=>setAuthed(name==="Ninja"&&pass==="Ninja123")}>ACCESS NINJAX</button><p>Username: Ninja · Password: Ninja123</p></div></div>;
 return <main><header><b>NINJAX //</b><span>{live?"● REALTIME":"○ OFFLINE"}</span></header><section>
 {tab==="HOME"&&<div className="card"><small>COMMAND CENTER</small><h1>WELCOME, {name.toUpperCase()}</h1><p>Global Chat + Sender system powered by Supabase.</p><div className="grid">{["BUG","BUG GROUP","BAN GROUP","HACK LAB","OSINT LAB","NETWORK LAB","REPORT LAB","EXPLOIT LAB"].map(x=><div className="tile" key={x}>{x}<small>LOCAL SIMULATION</small></div>)}</div></div>}
 {tab==="CHAT"&&<div className="card chat"><h2>GLOBAL CHAT</h2><small>{live?"REALTIME CONNECTED":"Supabase not connected"}</small><div className="msgs">{msgs.map(m=><div className="msg" key={m.id}><b>{m.username}</b><span>{m.content}</span><small>{new Date(m.created_at).toLocaleTimeString()}</small></div>)}</div><div className="compose"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..."/><button onClick={send}>SEND</button></div></div>}
 {tab==="SENDERS"&&<div className="card"><h2>MANAGE SENDER</h2><div className="tabs"><button>SENDER PRIVATE</button><button>SENDER GLOBAL</button></div><p>Private sender data can be added locally. Global Sender is ready for a Supabase table.</p></div>}
 {tab==="LABS"&&<div className="card"><h2>CYBER LABS</h2><p>All security modules are local/educational simulations.</p></div>}
 {tab==="ACTIVITY"&&<div className="card"><h2>ACTIVITY CENTER</h2><p>System initialized · Chat module loaded · Realtime listener ready.</p></div>}
 {tab==="SETTINGS"&&<div className="card"><h2>SETTINGS</h2><p>Developers: Zakss · DAKA · NATHAN</p><p>Supabase: {supabaseConfigured()?"CONFIGURED":"NOT CONFIGURED"}</p></div>}
 </section><nav>{["HOME","CHAT","SENDERS","LABS","ACTIVITY","SETTINGS"].map(x=><button className={tab===x?"active":""} key={x} onClick={()=>setTab(x)}>{x}</button>)}</nav></main>
}
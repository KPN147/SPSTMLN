import { BookOpen, Check, Clock3, FileText, Fingerprint, LockKeyhole, Monitor, Network, Vote } from 'lucide-react';
import type { CSSProperties } from 'react';
import { roomPuzzles, puzzleUnlocked } from '../game/engine';
import type { GameSaveV1, Puzzle, Room } from '../game/types';

export function RoomArt({room,open=false}:{room:Room;open?:boolean}){
 const c=room.color;
 return <svg className="room-art" viewBox="0 0 1200 650" fill="none" aria-hidden="true">
 <defs><radialGradient id={`light-${room.id}`}><stop stopColor={c} stopOpacity=".2"/><stop offset="1" stopColor={c} stopOpacity="0"/></radialGradient><linearGradient id={`wall-${room.id}`} x2="0" y2="1"><stop stopColor="#17293d"/><stop offset="1" stopColor="#0d1524"/></linearGradient><linearGradient id={`door-${room.id}`}><stop stopColor={c} stopOpacity=".07"/><stop offset=".5" stopColor={c} stopOpacity=".8"/><stop offset="1" stopColor={c} stopOpacity=".07"/></linearGradient></defs>
 <path fill={`url(#wall-${room.id})`} d="M0 0h1200v650H0z"/>
 <path d="M0 525h1200v125H0z" fill="#101a29"/>
 {[0,1,2,3,4,5,6].map(i=><path key={i} d={`M600 510L${i*250-150} 650`} stroke="#354352" strokeOpacity=".35"/>)}
 {[555,610].map(y=><path key={y} d={`M0 ${y}h1200`} stroke="#354352" strokeOpacity=".3"/>)}
 <ellipse cx="600" cy="245" rx="580" ry="400" fill={`url(#light-${room.id})`}/>
 {[35,320,805,1140].map(x=><g key={x}><path d={`M${x} 10h24v515h-24z`} fill="#223144"/><path d={`M${x+6} 10v515`} stroke={c} strokeOpacity=".2"/><path d={`M${x-9} 502h42v25h-42z`} fill="#28384b"/></g>)}
 <path d="M50 90h1090M50 102h1090" stroke={c} strokeOpacity=".15"/>
 <path d="M370 395V190a205 150 0 0 1 410 0v205" stroke={c} strokeWidth="2" strokeOpacity=".25"/>
 <path d="M393 395V195a180 125 0 0 1 360 0v200" stroke={c} strokeOpacity=".12"/>
 <circle cx="578" cy="255" r="98" stroke={c} strokeOpacity=".15"/>
 <circle cx="578" cy="255" r="82" stroke={c} strokeDasharray="2 16" strokeOpacity=".5"/>
 {room.id===1&&<>
 <path d="M70 143h206v330H70z" fill="#111c2a" stroke="#695c47" strokeWidth="7"/>
 {[190,270,350,430].map((y,j)=><g key={y}><path d={`M73 ${y+36}h200`} stroke="#8c734f" strokeWidth="7"/>{Array.from({length:9},(_,i)=><rect key={i} x={83+i*20} y={y-20+(i%3)*5} width={12+(i%2)*3} height={55-(i%3)*5} rx="1" fill={['#667665','#9a7453','#4f6d7a','#a99062'][(i+j)%4]} stroke="#c5a670" strokeOpacity=".2"/>)}</g>)}
 <path d="M414 384h310l25 35H389z" fill="#8a6c49"/><path d="M410 419v105m315-105v105" stroke="#604e39" strokeWidth="13"/>
 <path d="M510 365q35-15 68 4 33-19 68-4l-10 37q-35-6-58 5-25-11-59-5z" fill="#d6c69f"/><path d="M578 369v38" stroke="#8b7955"/>
 <g transform="translate(647 215)"><circle r="44" fill="#192333" stroke="#b19360" strokeWidth="6"/><circle r="35" stroke="#b19360" strokeDasharray="1 16"/><path d="M0-26V0l20 10" stroke="#d9b56e" strokeWidth="3"/></g>
 <path d="M450 323v-57m-15 8h30l-15-35z" stroke="#d9b56e" strokeWidth="3" fill="#d9b56e" fillOpacity=".3"/>
 </>}
 {room.id===2&&<>
 {[95,175,255].map((x,i)=><g key={x}><rect x={x} y={190+i*23} width="65" height={280-i*23} fill="#243647" stroke="#71899a"/><path d={`M${x+10} 300h45m-45 22h45m-45 22h45`} stroke="#708a99"/>{[0,1,2].map(j=><circle key={j} cx={x+20+j*13} cy="382" r="3" fill={c}/>)}</g>)}
 <path d="M385 430h400v62H385z" fill="#243647" stroke="#71899a"/>{[0,1,2,3,4,5,6,7].map(i=><circle key={i} cx={410+i*49} cy="462" r="16" stroke="#71899a"/>)}
 <path d="M530 430v-93l70-57 56 45v104" stroke="#607e91" strokeWidth="18"/><circle cx="600" cy="280" r="17" fill={c}/>
 <rect x="438" y="190" width="108" height="78" fill="#122332" stroke={c}/><path d="M453 240l20-19 21 10 35-30" stroke={c} strokeWidth="3"/>
 </>}
 {room.id===3&&<>
 <ellipse cx="548" cy="436" rx="220" ry="49" fill="#20383f" stroke={c} strokeOpacity=".5"/>
 <path d="M328 436v55q220 70 440 0v-55" fill="#182f3b" stroke={c} strokeOpacity=".3"/>
 {[0,1,2,3,4,5].map((i)=><g key={i}><path d={`M${400+i*48} 425v-${60+(i%3)*40}h32v${60+(i%3)*40}z`} fill="#315e63" stroke={c} strokeOpacity=".7"/>{[0,1,2].map(j=><path key={j} d={`M${408+i*48} ${390-j*12}h16`} stroke={c}/>)}</g>)}
 <rect x="89" y="184" width="178" height="144" rx="5" fill="#172a36" stroke={c} strokeOpacity=".5"/><path d="M106 276l32-47 35 25 30-40 43 25" stroke={c} strokeWidth="2"/>
 <path d="M660 175v132m-36-66h73" stroke={c} strokeOpacity=".7"/><circle cx="660" cy="240" r="44" stroke={c}/>
 </>}
 {room.id===4&&<>
 <path d="M360 450h420v45H360z" fill="#4a405c"/><path d="M390 495h360v20H390z" fill="#655371"/>
 <path d="M514 449l-12-122h133l-12 122z" fill="#554663" stroke={c} strokeOpacity=".6"/><path d="M490 323h157v16H490z" fill="#7a6488"/><path d="M582 323v-47l17-16" stroke={c} strokeWidth="4"/>
 <rect x="91" y="171" width="180" height="147" fill="#192333" stroke="#786487" strokeWidth="7"/>{[0,1,2].map(i=><path key={i} d={`M116 ${205+i*32}h130`} stroke={c} strokeOpacity=".5"/>)}
 {[105,180,255,680,750].map(x=><path key={x} d={`M${x} 448v-48q25-18 50 0v48m-52 0h56v18h-56z`} fill="#433849" stroke="#89749b"/>)}
 <path d="M653 173h90v106h-90z" fill="#243044" stroke={c}/><path d="M668 199h61m-61 20h61m-61 20h40" stroke={c}/>
 </>}
 <g><path d="M876 514V219a109 109 0 0 1 218 0v295z" fill="#070e18" stroke={c} strokeOpacity=".4" strokeWidth="9"/>
 <path d="M888 514V219a97 97 0 0 1 194 0v295" fill={open?`url(#door-${room.id})`:'#111d2b'}/>
 <g className={open?'door-leaf open':'door-leaf'}><path d="M900 514V221a85 85 0 0 1 170 0v293z" fill="#1c2a3b" stroke={c} strokeOpacity=".6"/><path d="M919 487V225a66 66 0 0 1 132 0v262z" stroke={c} strokeOpacity=".25"/><circle cx="1033" cy="361" r="6" fill={c}/><circle cx="984" cy="248" r="28" stroke={c} strokeOpacity=".3"/><path d="M984 230v36m-18-18h36" stroke={c} strokeOpacity=".3"/></g></g>
 <path d="M30 525h1140" stroke={c} strokeOpacity=".3"/>
 </svg>;
}
export function RoomScene({room,save,onSelect}:{room:Room;save:GameSaveV1;onSelect:(p:Puzzle)=>void}){
 const ps=roomPuzzles(room.id),complete=ps.every(p=>save.completedPuzzleIds.includes(p.id));
 const icons=[BookOpen,FileText,room.id===1?Clock3:Network,Fingerprint];
 if(room.id===2)icons[0]=Monitor;if(room.id===4)icons[1]=Vote;
 return <div className={`room-scene theme-${room.id}`} style={{'--room-accent':room.color} as CSSProperties}>
 <RoomArt room={room} open={complete}/><div className="scene-vignette"/>
 <div className="scene-caption"><span className="tiny-label">HỒ SƠ {String(room.id).padStart(2,'0')}</span><span>{complete?'Dữ liệu đã được khôi phục':'Chạm vào đồ vật đang phát sáng'}</span></div>
 {ps.map((p,i)=>{const solved=save.completedPuzzleIds.includes(p.id),unlocked=puzzleUnlocked(save,p),Icon=solved?Check:unlocked?icons[i]:LockKeyhole;return <button key={p.id} className={`hotspot spot-${i+1} ${solved?'solved':unlocked?'active':'locked'}`} aria-disabled={!unlocked} aria-label={`${p.hotspotName} — ${solved?'đã giải':unlocked?'có thể khám phá':'đang khóa'}`} onClick={()=>onSelect(p)}><span className="hotspot-symbol"><Icon size={22}/></span><span className="hotspot-label"><small>0{p.order} · {solved?'ĐÃ GIẢI':unlocked?'KHÁM PHÁ':'ĐANG KHÓA'}</small>{p.hotspotName}</span></button>})}
 <span className="scene-coordinate">THƯ VIỆN TRI THỨC / 2126</span>
 </div>;
}

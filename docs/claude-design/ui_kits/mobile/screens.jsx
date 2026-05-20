/* ArgFit Mobile Screens */
const {useState, useEffect, useRef, useCallback} = React;

/* ═══ HOME SCREEN ════════════════════════════════════ */
function HomeScreen({onNavigate}) {
  const jumpData = [32, 35, 33, 38, 36, 40, 42, 39, 44, 45, 43, 45];
  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0 16px'}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#2599D5,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16,color:'#0A1628'}}>MG</div>
          <div>
            <div style={{fontSize:12,color:'#829AB1'}}>Buenos días</div>
            <div style={{fontSize:16,fontWeight:700}}>María García</div>
          </div>
        </div>
        <div style={{position:'relative',cursor:'pointer',color:'#BCCCDC'}}>
          {Icons.bell}
          <div style={{position:'absolute',top:-2,right:-2,width:8,height:8,borderRadius:'50%',background:'#FF3D71',border:'2px solid #0A1628'}}></div>
        </div>
      </div>

      {/* Device Status */}
      <SectionHeader title="DISPOSITIVO" action="Ver todos" />
      <DeviceRow name="ArgFit Jump 2" status="connected" battery={87} />

      {/* Quick Stats */}
      <div style={{marginTop:20}}>
        <SectionHeader title="HOY" />
        <div style={{display:'flex',gap:10}}>
          <StatCard value="12" unit="saltos" label="Sesiones" icon={Icons.zap} />
          <StatCard value="45.2" unit="cm" label="Mejor salto" color="#00D4FF" icon={Icons.chart} />
        </div>
      </div>

      {/* Performance Chart */}
      <div style={{marginTop:20}}>
        <SectionHeader title="PROGRESO SEMANAL" action="Detalle" />
        <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:12,padding:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
            <span style={{fontSize:13,color:'#829AB1'}}>Altura promedio (cm)</span>
            <span style={{fontSize:14,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#00D4FF'}}>+8.2%</span>
          </div>
          <Sparkline data={jumpData} color="#2599D5" width={310} height={70} />
          <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
            {['L','M','X','J','V','S','D'].map((d,i)=><span key={i} style={{fontSize:10,color:'#627D98',flex:1,textAlign:'center'}}>{d}</span>)}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div style={{marginTop:20}}>
        <SectionHeader title="SESIONES RECIENTES" action="Ver todas" />
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <SessionRow type="CMJ Bilateral" date="Hoy 10:30" jumps={8} avgHeight={42.1} onClick={()=>onNavigate('stats')} />
          <SessionRow type="Drop Jump" date="Ayer 16:45" jumps={12} avgHeight={38.7} onClick={()=>onNavigate('stats')} />
          <SessionRow type="SJ Unilateral" date="15 May" jumps={6} avgHeight={22.3} onClick={()=>onNavigate('stats')} />
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{marginTop:20,marginBottom:8}}>
        <SectionHeader title="INICIO RÁPIDO" />
        <div style={{display:'flex',gap:10}}>
          {[
            {label:'CMJ',color:'#2599D5',desc:'Countermovement'},
            {label:'SJ',color:'#00D4FF',desc:'Squat Jump'},
            {label:'DJ',color:'#00AACE',desc:'Drop Jump'},
          ].map((a,i)=>(
            <div key={i} onClick={()=>onNavigate('train')} style={{flex:1,background:`linear-gradient(135deg, ${a.color}15, ${a.color}08)`,border:`1px solid ${a.color}25`,borderRadius:12,padding:'16px 12px',cursor:'pointer',textAlign:'center',transition:'transform 150ms'}}>
              <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:22,fontWeight:800,color:a.color,letterSpacing:'-0.02em'}}>{a.label}</div>
              <div style={{fontSize:10,color:'#829AB1',marginTop:4}}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ TRAINING SCREEN ════════════════════════════════ */
function TrainScreen() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const [jumps, setJumps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(()=>{
    if(running){
      intervalRef.current = setInterval(()=>setElapsed(e=>e+1),1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return ()=>clearInterval(intervalRef.current);
  },[running]);

  const formatTime = (s) => {
    const m = Math.floor(s/60);
    const sec = s%60;
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const simulateJump = () => {
    const h = (35 + Math.random()*15).toFixed(1);
    const f = (2000 + Math.random()*1200).toFixed(0);
    const ct = (0.2 + Math.random()*0.2).toFixed(3);
    setJumps(j=>[{h,f,ct,id:Date.now()},...j]);
    setJumpCount(c=>c+1);
  };

  const handleStart = () => {
    if(!running){
      setRunning(true);
      setElapsed(0);
      setJumps([]);
      setJumpCount(0);
    }
  };

  useEffect(()=>{
    if(running && elapsed > 0 && elapsed % 4 === 0){
      simulateJump();
    }
  },[elapsed, running]);

  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      {/* Header */}
      <div style={{padding:'8px 0 12px',textAlign:'center'}}>
        <div style={{fontSize:12,color:'#829AB1',fontWeight:500,letterSpacing:'0.06em',textTransform:'uppercase'}}>Sesión de entrenamiento</div>
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:18,fontWeight:700,marginTop:4,textTransform:'uppercase'}}>CMJ Bilateral</div>
      </div>

      {/* Device Banner */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(0,200,83,0.08)',borderRadius:10,border:'1px solid rgba(0,200,83,0.15)',marginBottom:16}}>
        <div style={{width:8,height:8,borderRadius:'50%',background:'#00C853',boxShadow:'0 0 8px rgba(0,200,83,0.4)'}}></div>
        <span style={{fontSize:13,color:'#B9F6CA',fontWeight:500}}>ArgFit Jump 2 conectado</span>
        <span style={{marginLeft:'auto',fontSize:11,color:'#627D98'}}>{Icons.battery} 87%</span>
      </div>

      {/* Timer */}
      <div style={{textAlign:'center',padding:'20px 0'}}>
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:64,fontWeight:800,color:running?'#2599D5':'#486581',letterSpacing:'-0.02em',lineHeight:1}}>{formatTime(elapsed)}</div>
        <div style={{fontSize:13,color:'#627D98',marginTop:8}}>{running ? `${jumpCount} saltos registrados` : 'Listo para comenzar'}</div>
      </div>

      {/* Control Buttons */}
      <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:20}}>
        {!running ? (
          <button onClick={handleStart} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#2599D5',color:'#fff',border:'none',borderRadius:999,padding:'14px 48px',fontSize:16,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',boxShadow:'0 0 24px rgba(37,153,213,0.25)',transition:'transform 150ms',letterSpacing:'0.02em'}}>
            {Icons.play} INICIAR
          </button>
        ) : (
          <>
            <button onClick={()=>setRunning(false)} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'#152A42',color:'#BCCCDC',border:'1px solid rgba(37,153,213,0.15)',borderRadius:999,padding:'14px 28px',fontSize:14,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:'pointer'}}>
              {Icons.pause} PAUSAR
            </button>
            <button onClick={()=>{setRunning(false);setElapsed(0)}} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(255,61,113,0.1)',color:'#FF3D71',border:'1px solid rgba(255,61,113,0.2)',borderRadius:999,padding:'14px 28px',fontSize:14,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:'pointer'}}>
              {Icons.stop} DETENER
            </button>
          </>
        )}
      </div>

      {/* Live Stats */}
      {jumps.length > 0 && (
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <StatCard value={jumps[0]?.h||'--'} unit="cm" label="Último salto" color="#00D4FF" />
          <StatCard value={(jumps.reduce((a,j)=>a+parseFloat(j.h),0)/jumps.length).toFixed(1)} unit="cm" label="Promedio" color="#2599D5" />
        </div>
      )}

      {/* Jump Log */}
      {jumps.length > 0 && (
        <div>
          <SectionHeader title="REGISTRO EN VIVO" />
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {jumps.slice(0,6).map((j,i)=>(
              <div key={j.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'#0F1D32',borderRadius:10,border:'1px solid rgba(37,153,213,0.06)',fontSize:13,animation:i===0?'slideIn 300ms ease-out':'none'}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'#627D98',width:24}}>#{jumps.length-i}</span>
                <span style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontWeight:700,color:'#2599D5',minWidth:60}}>{j.h}cm</span>
                <span style={{color:'#829AB1',fontSize:12}}>{j.f}N</span>
                <span style={{marginLeft:'auto',fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#627D98'}}>{j.ct}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Segment for test type */}
      {!running && jumps.length === 0 && (
        <div>
          <SectionHeader title="TIPO DE TEST" />
          <SegmentControl options={['CMJ','SJ','DJ','Abalakov']} />
          <div style={{marginTop:16}}>
            <SectionHeader title="CONFIGURACIÓN" />
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <SettingRow label="Umbral de detección" value="50N" />
              <SettingRow label="Tiempo de espera" value="3s" />
              <SettingRow label="Audio feedback" toggle={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Segment Control ─────────────────────────────── */
function SegmentControl({options, defaultIdx=0}) {
  const [active, setActive] = useState(defaultIdx);
  return (
    <div style={{display:'flex',background:'#0F1D32',borderRadius:10,padding:3,border:'1px solid rgba(37,153,213,0.06)'}}>
      {options.map((o,i)=>(
        <div key={i} onClick={()=>setActive(i)} style={{
          flex:1,padding:'10px 8px',borderRadius:8,textAlign:'center',fontSize:13,fontWeight:active===i?600:400,
          color:active===i?'#fff':'#627D98',background:active===i?'#2599D5':'transparent',
          cursor:'pointer',transition:'all 200ms'
        }}>{o}</div>
      ))}
    </div>
  );
}

/* ── Setting Row ─────────────────────────────────── */
function SettingRow({label, value, toggle}) {
  const [on, setOn] = useState(true);
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',background:'#0F1D32',borderRadius:10,border:'1px solid rgba(37,153,213,0.06)'}}>
      <span style={{fontSize:14,color:'#BCCCDC'}}>{label}</span>
      {toggle ? (
        <div onClick={()=>setOn(!on)} style={{width:44,height:24,borderRadius:12,background:on?'#2599D5':'#334E68',position:'relative',cursor:'pointer',transition:'background 200ms'}}>
          <div style={{position:'absolute',width:18,height:18,borderRadius:'50%',background:'#fff',top:3,left:on?23:3,transition:'left 200ms'}}></div>
        </div>
      ) : (
        <span style={{fontSize:14,fontWeight:600,fontFamily:"'JetBrains Mono',monospace",color:'#2599D5'}}>{value}</span>
      )}
    </div>
  );
}

/* ═══ STATS / RESULTS SCREEN ═════════════════════════ */
function StatsScreen() {
  const [segment, setSegment] = useState(0);
  const jumpData = [38.2,40.1,39.5,42.3,41.8,43.1,44.2,42.9,45.2,43.8,44.5,45.0];
  const forceData = [2200,2340,2280,2500,2450,2580,2650,2520,2750,2680,2720,2847];

  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      {/* Header */}
      <div style={{padding:'8px 0 16px'}}>
        <div style={{fontSize:12,color:'#829AB1',fontWeight:500}}>Sesión completada</div>
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:20,fontWeight:700,marginTop:2,textTransform:'uppercase'}}>CMJ Bilateral</div>
        <div style={{fontSize:12,color:'#627D98',marginTop:4}}>18 May 2026 • 10:30 – 10:52 • 12 saltos</div>
      </div>

      {/* Summary Cards */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
        <StatCard value="45.2" unit="cm" label="Mejor salto" color="#00D4FF" />
        <StatCard value="42.1" unit="cm" label="Promedio" color="#2599D5" />
        <StatCard value="2847" unit="N" label="Fuerza pico" color="#FFB300" />
        <StatCard value="0.342" unit="s" label="T. contacto" color="#00C853" />
      </div>

      {/* Chart Segment */}
      <SegmentControl options={['Altura','Fuerza','Tiempo']} defaultIdx={segment} />
      <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:12,padding:16,marginTop:12}}>
        <Sparkline data={segment===0?jumpData:forceData} color={segment===0?'#2599D5':'#FFB300'} width={310} height={80} />
        <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
          {jumpData.map((_,i)=><span key={i} style={{fontSize:9,color:'#627D98',flex:1,textAlign:'center'}}>#{i+1}</span>)}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div style={{marginTop:20}}>
        <SectionHeader title="MÉTRICAS DETALLADAS" />
        <div style={{background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',overflow:'hidden'}}>
          {[
            ['Altura máxima','45.2 cm','↑ 8%'],
            ['Altura promedio','42.1 cm','↑ 5%'],
            ['Fuerza pico','2847 N','↑ 12%'],
            ['Potencia media','1842 W','↑ 7%'],
            ['Tiempo contacto','0.342 s','↓ 3%'],
            ['RSI','1.32','↑ 9%'],
            ['Asimetría','4.2%','↓ 2%'],
          ].map(([label,val,change],i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',padding:'12px 16px',borderBottom:i<6?'1px solid rgba(37,153,213,0.06)':'none'}}>
              <span style={{flex:1,fontSize:13,color:'#BCCCDC'}}>{label}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:'#F0F4F8',marginRight:12}}>{val}</span>
              <span style={{fontSize:11,fontWeight:600,color:change.includes('↑')?'#00C853':'#FF3D71',minWidth:40,textAlign:'right'}}>{change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div style={{marginTop:20,marginBottom:8}}>
        <div style={{display:'flex',gap:10}}>
          <button style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#2599D5',color:'#fff',border:'none',borderRadius:8,padding:'12px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>
            {Icons.download} Exportar CSV
          </button>
          <button style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'#152A42',color:'#BCCCDC',border:'1px solid rgba(37,153,213,0.15)',borderRadius:8,padding:'12px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>
            {Icons.share} Compartir
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {HomeScreen, TrainScreen, StatsScreen, SegmentControl, SettingRow});

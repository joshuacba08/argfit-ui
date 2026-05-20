/* ArgFit Desktop Screens */
const {useState, useEffect} = React;

/* ── Sample Data ──────────────────────────────────── */
const ATHLETES = [
  {id:1,name:'María García',sport:'Voleibol',team:'Club San Lorenzo',sessions:42,bestJump:45.2,status:'active',lastSession:'Hoy 10:30'},
  {id:2,name:'Lucas Rodríguez',sport:'Fútbol',team:'Racing Club',sessions:38,bestJump:52.1,status:'active',lastSession:'Hoy 09:15'},
  {id:3,name:'Valentina López',sport:'Handball',team:'Selección ARG',sessions:56,bestJump:38.7,status:'active',lastSession:'Ayer 17:00'},
  {id:4,name:'Matías Fernández',sport:'Rugby',team:'CASI',sessions:29,bestJump:48.9,status:'inactive',lastSession:'12 May'},
  {id:5,name:'Camila Torres',sport:'Básquet',team:'Obras Sanitarias',sessions:34,bestJump:41.3,status:'active',lastSession:'Ayer 11:30'},
  {id:6,name:'Santiago Pérez',sport:'Atletismo',team:'GEBA',sessions:67,bestJump:55.4,status:'active',lastSession:'Hoy 08:00'},
  {id:7,name:'Florencia Díaz',sport:'Hockey',team:'Club Ciudad',sessions:23,bestJump:36.8,status:'inactive',lastSession:'8 May'},
  {id:8,name:'Nicolás Morales',sport:'Fútbol',team:'Independiente',sessions:45,bestJump:49.7,status:'active',lastSession:'Ayer 16:00'},
  {id:9,name:'Ana Gutiérrez',sport:'Voleibol',team:'River Plate',sessions:31,bestJump:40.2,status:'active',lastSession:'15 May'},
  {id:10,name:'Diego Romero',sport:'Rugby',team:'Alumni',sessions:19,bestJump:46.5,status:'inactive',lastSession:'5 May'},
  {id:11,name:'Paula Martínez',sport:'Atletismo',team:'CeNARD',sessions:72,bestJump:44.8,status:'active',lastSession:'Hoy 07:30'},
  {id:12,name:'Tomás Herrera',sport:'Básquet',team:'San Lorenzo',sessions:28,bestJump:50.3,status:'active',lastSession:'14 May'},
];

const DEVICES = [
  {id:'AF-J2-001',name:'ArgFit Jump 2',fw:'3.2.1',battery:87,status:'connected',lastSync:'Hace 2 min',athlete:'María García'},
  {id:'AF-J2-002',name:'ArgFit Jump 2',fw:'3.2.1',battery:92,status:'connected',lastSync:'Hace 5 min',athlete:'Lucas Rodríguez'},
  {id:'AF-S1-001',name:'ArgFit Speed',fw:'1.1.0',battery:64,status:'connected',lastSync:'Hace 12 min',athlete:'Santiago Pérez'},
  {id:'AF-J2-003',name:'ArgFit Jump 2',fw:'3.1.8',battery:15,status:'low',lastSync:'Hace 1 hr',athlete:'Camila Torres'},
  {id:'AF-L2-001',name:'ArgFit Light',fw:'2.4.2',battery:45,status:'disconnected',lastSync:'Hace 3 hrs',athlete:'—'},
  {id:'AF-J1-001',name:'ArgFit Jump',fw:'2.0.5',battery:0,status:'disconnected',lastSync:'5 May',athlete:'—'},
];

/* ═══ DASHBOARD SCREEN ═══════════════════════════════ */
function DashboardScreen() {
  const weeklyData = [120,135,142,128,156,148,165,172,158,180,175,190];
  const jumpAvg = [38,39,40,38,41,42,41,43,42,44,43,45];
  return (
    <div style={{padding:24,overflow:'auto',flex:1,background:'radial-gradient(ellipse 80% 50% at 65% 5%, rgba(37,153,213,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 15% 85%, rgba(0,212,255,0.04) 0%, transparent 50%)'}}>
      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <KpiCard label="Atletas activos" value="38" change="12%" changeDir="up" icon={DI.users} />
        <KpiCard label="Sesiones (mes)" value="247" change="8%" changeDir="up" color="#00D4FF" icon={DI.report} />
        <KpiCard label="Dispositivos online" value="4" unit="/6" color="#00C853" icon={DI.device} />
        <KpiCard label="Salto prom. (mes)" value="42.1" unit="cm" change="5.3%" changeDir="up" color="#FFB300" icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        } />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:24}}>
        {/* Chart */}
        <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div>
              <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif"}}>SESIONES SEMANALES</div>
              <div style={{fontSize:12,color:'#627D98',marginTop:2}}>Últimos 3 meses</div>
            </div>
            <div style={{display:'flex',gap:6}}>
              {['1M','3M','6M','1A'].map((p,i)=>(
                <button key={p} style={{padding:'5px 12px',borderRadius:6,border:'none',fontSize:11,fontWeight:i===1?600:400,
                  background:i===1?'#2599D5':'transparent',color:i===1?'#fff':'#627D98',cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>{p}</button>
              ))}
            </div>
          </div>
          <DSparkline data={weeklyData} color="#2599D5" h={120} />
        </div>

        {/* Devices Status */}
        <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20}}>
          <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",marginBottom:16}}>DISPOSITIVOS</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {DEVICES.slice(0,4).map(d=>(
              <div key={d.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(37,153,213,0.04)',borderRadius:8}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:d.status==='connected'?'#00C853':d.status==='low'?'#FFB300':'#FF3D71',
                  boxShadow:`0 0 6px ${d.status==='connected'?'rgba(0,200,83,0.3)':d.status==='low'?'rgba(255,179,0,0.3)':'rgba(255,61,113,0.3)'}`}}></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{d.name}</div>
                  <div style={{fontSize:11,color:'#627D98'}}>{d.athlete}</div>
                </div>
                <span style={{fontSize:11,color:'#627D98'}}>{d.battery}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Athletes */}
      <div style={{marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif"}}>ATLETAS RECIENTES</div>
        <DBtn variant="secondary" size="sm" icon={DI.plus}>Nuevo atleta</DBtn>
      </div>
      <DataTable
        columns={[
          {key:'name',label:'Nombre',render:(v)=><span style={{fontWeight:600}}>{v}</span>},
          {key:'sport',label:'Deporte'},
          {key:'team',label:'Equipo'},
          {key:'sessions',label:'Sesiones'},
          {key:'bestJump',label:'Mejor salto',render:v=><span style={{fontFamily:"'JetBrains Mono',monospace",color:'#2599D5',fontWeight:600}}>{v}cm</span>},
          {key:'status',label:'Estado',render:v=><StatusBadge status={v}/>},
        ]}
        data={ATHLETES}
      />
    </div>
  );
}

/* ═══ ATHLETES SCREEN ════════════════════════════════ */
function AthletesScreen() {
  return (
    <div style={{padding:24,overflow:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div style={{display:'flex',gap:8}}>
          <DBtn variant="secondary" size="sm" icon={DI.filter}>Filtrar</DBtn>
          <DBtn variant="secondary" size="sm" icon={DI.download}>Exportar</DBtn>
        </div>
        <DBtn icon={DI.plus}>Nuevo atleta</DBtn>
      </div>
      <DataTable
        columns={[
          {key:'name',label:'Nombre',render:(v)=><div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#2599D5,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#0A1628',flexShrink:0}}>{v.split(' ').map(n=>n[0]).join('')}</div>
            <span style={{fontWeight:600}}>{v}</span>
          </div>},
          {key:'sport',label:'Deporte'},
          {key:'team',label:'Equipo'},
          {key:'sessions',label:'Sesiones',render:v=><span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>},
          {key:'bestJump',label:'Mejor salto (cm)',render:v=><span style={{fontFamily:"'JetBrains Mono',monospace",color:'#2599D5',fontWeight:600}}>{v}</span>},
          {key:'lastSession',label:'Última sesión'},
          {key:'status',label:'Estado',render:v=><StatusBadge status={v}/>},
        ]}
        data={ATHLETES}
      />
    </div>
  );
}

/* ═══ DEVICES SCREEN ═════════════════════════════════ */
function DevicesScreen() {
  return (
    <div style={{padding:24,overflow:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div style={{display:'flex',gap:8}}>
          <DBtn variant="secondary" size="sm" icon={DI.refresh}>Escanear BLE</DBtn>
          <DBtn variant="secondary" size="sm" icon={DI.filter}>Filtrar</DBtn>
        </div>
        <DBtn icon={DI.plus}>Registrar dispositivo</DBtn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {DEVICES.map(d=>(
          <div key={d.id} style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:15,fontWeight:700}}>{d.name}</div>
                <div style={{fontSize:12,color:'#627D98',fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{d.id}</div>
              </div>
              <StatusBadge status={d.status}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div><div style={{fontSize:11,color:'#627D98'}}>Firmware</div><div style={{fontSize:13,fontWeight:500}}>{d.fw}</div></div>
              <div><div style={{fontSize:11,color:'#627D98'}}>Batería</div><div style={{fontSize:13,fontWeight:500,color:d.battery<20?'#FFB300':'#F0F4F8'}}>{d.battery}%</div></div>
              <div><div style={{fontSize:11,color:'#627D98'}}>Atleta</div><div style={{fontSize:13,fontWeight:500}}>{d.athlete}</div></div>
              <div><div style={{fontSize:11,color:'#627D98'}}>Última sync</div><div style={{fontSize:13,fontWeight:500}}>{d.lastSync}</div></div>
            </div>
            {/* Battery bar */}
            <div style={{height:4,borderRadius:2,background:'#152A42',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${d.battery}%`,borderRadius:2,background:d.battery>50?'#00C853':d.battery>20?'#FFB300':'#FF3D71',transition:'width 300ms'}}></div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <DBtn variant="secondary" size="sm" style={{flex:1}}>Configurar</DBtn>
              {d.fw!=='3.2.1' && <DBtn variant="outline" size="sm">Actualizar FW</DBtn>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ REPORTS SCREEN ═════════════════════════════════ */
function ReportsScreen() {
  const sessionData = [
    {date:'18 May 2026',athlete:'María García',type:'CMJ Bilateral',jumps:12,avgH:42.1,maxH:45.2,maxF:2847},
    {date:'18 May 2026',athlete:'Santiago Pérez',type:'Sprint 30m',jumps:6,avgH:null,maxH:null,maxF:null,speed:'3.82s'},
    {date:'17 May 2026',athlete:'Lucas Rodríguez',type:'CMJ Bilateral',jumps:10,avgH:48.3,maxH:52.1,maxF:3120},
    {date:'17 May 2026',athlete:'Valentina López',type:'Drop Jump',jumps:8,avgH:35.4,maxH:38.7,maxF:2340},
    {date:'16 May 2026',athlete:'Camila Torres',type:'SJ Bilateral',jumps:8,avgH:38.9,maxH:41.3,maxF:2580},
    {date:'16 May 2026',athlete:'Nicolás Morales',type:'CMJ Bilateral',jumps:15,avgH:46.1,maxH:49.7,maxF:2960},
    {date:'15 May 2026',athlete:'Paula Martínez',type:'Abalakov',jumps:10,avgH:41.5,maxH:44.8,maxF:2720},
    {date:'15 May 2026',athlete:'Ana Gutiérrez',type:'CMJ Bilateral',jumps:8,avgH:37.8,maxH:40.2,maxF:2450},
  ];
  return (
    <div style={{padding:24,overflow:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div style={{display:'flex',gap:8}}>
          <DBtn variant="secondary" size="sm" icon={DI.filter}>Filtrar</DBtn>
          <div style={{display:'flex',background:'#0F1D32',borderRadius:8,padding:2,border:'1px solid rgba(37,153,213,0.06)'}}>
            {['Todas','CMJ','SJ','DJ','Sprint'].map((t,i)=>(
              <button key={t} style={{padding:'6px 14px',borderRadius:6,border:'none',fontSize:12,fontWeight:i===0?600:400,
                background:i===0?'#2599D5':'transparent',color:i===0?'#fff':'#627D98',cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>{t}</button>
            ))}
          </div>
        </div>
        <DBtn variant="secondary" icon={DI.download}>Exportar todo</DBtn>
      </div>
      <DataTable
        columns={[
          {key:'date',label:'Fecha'},
          {key:'athlete',label:'Atleta',render:v=><span style={{fontWeight:600}}>{v}</span>},
          {key:'type',label:'Tipo de test'},
          {key:'jumps',label:'Reps',render:v=><span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>},
          {key:'avgH',label:'Prom (cm)',render:v=>v?<span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>:<span style={{color:'#627D98'}}>—</span>},
          {key:'maxH',label:'Máx (cm)',render:v=>v?<span style={{fontFamily:"'JetBrains Mono',monospace",color:'#2599D5',fontWeight:600}}>{v}</span>:<span style={{color:'#627D98'}}>—</span>},
          {key:'maxF',label:'Fuerza (N)',render:v=>v?<span style={{fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>:<span style={{color:'#627D98'}}>—</span>},
        ]}
        data={sessionData}
      />
    </div>
  );
}

/* ═══ SETTINGS SCREEN ════════════════════════════════ */
function SettingsScreen() {
  const [bleAuto, setBleAuto] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [units, setUnits] = useState('metric');
  const [threshold, setThreshold] = useState(50);

  const Toggle = ({on, onToggle}) => (
    <div onClick={onToggle} style={{width:44,height:24,borderRadius:12,background:on?'#2599D5':'#334E68',position:'relative',cursor:'pointer',transition:'background 200ms',flexShrink:0}}>
      <div style={{position:'absolute',width:18,height:18,borderRadius:'50%',background:'#fff',top:3,left:on?23:3,transition:'left 200ms'}}></div>
    </div>
  );

  const FormRow = ({label, desc, children}) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid rgba(37,153,213,0.06)'}}>
      <div><div style={{fontSize:14,fontWeight:500}}>{label}</div>{desc && <div style={{fontSize:12,color:'#627D98',marginTop:2}}>{desc}</div>}</div>
      {children}
    </div>
  );

  return (
    <div style={{padding:24,overflow:'auto',flex:1,maxWidth:720}}>
      {/* General */}
      <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:'4px 20px 8px',marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',padding:'14px 0 4px',textTransform:'uppercase'}}>General</div>
        <FormRow label="Modo oscuro" desc="Interfaz con fondo oscuro"><Toggle on={darkMode} onToggle={()=>setDarkMode(!darkMode)} /></FormRow>
        <FormRow label="Unidades" desc="Sistema de medición">
          <div style={{display:'flex',background:'#152A42',borderRadius:8,padding:2}}>
            {['metric','imperial'].map(u=>(
              <button key={u} onClick={()=>setUnits(u)} style={{padding:'6px 16px',borderRadius:6,border:'none',fontSize:12,fontWeight:units===u?600:400,
                background:units===u?'#2599D5':'transparent',color:units===u?'#fff':'#627D98',cursor:'pointer',fontFamily:"'Outfit',sans-serif",textTransform:'capitalize'}}>{u==='metric'?'Métrico':'Imperial'}</button>
            ))}
          </div>
        </FormRow>
        <FormRow label="Idioma" desc="Idioma de la interfaz">
          <select style={{background:'#152A42',border:'1px solid rgba(37,153,213,0.12)',borderRadius:8,padding:'7px 12px',color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:13,outline:'none'}}>
            <option>Español</option><option>English</option><option>Português</option>
          </select>
        </FormRow>
      </div>

      {/* Devices */}
      <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:'4px 20px 8px',marginBottom:20}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',padding:'14px 0 4px',textTransform:'uppercase'}}>Dispositivos</div>
        <FormRow label="Auto-conectar BLE" desc="Conectar automáticamente al abrir"><Toggle on={bleAuto} onToggle={()=>setBleAuto(!bleAuto)} /></FormRow>
        <FormRow label="Umbral de detección" desc="Fuerza mínima para registrar salto">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <input type="range" min="10" max="100" value={threshold} onChange={e=>setThreshold(e.target.value)} style={{width:120,accentColor:'#2599D5'}} />
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'#2599D5',minWidth:40,textAlign:'right'}}>{threshold}N</span>
          </div>
        </FormRow>
        <FormRow label="Audio feedback" desc="Sonido al detectar cada salto"><Toggle on={true} /></FormRow>
      </div>

      {/* Account */}
      <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:'4px 20px 8px'}}>
        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',padding:'14px 0 4px',textTransform:'uppercase'}}>Cuenta</div>
        <FormRow label="Nombre" desc="María García">
          <DBtn variant="ghost" size="sm">{DI.edit} Editar</DBtn>
        </FormRow>
        <FormRow label="Email" desc="maria.garcia@clubsl.com.ar">
          <DBtn variant="ghost" size="sm">{DI.edit} Editar</DBtn>
        </FormRow>
        <FormRow label="Plan" desc="ArgFit Pro — 40 atletas">
          <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:999,fontSize:11,fontWeight:600,background:'rgba(37,153,213,0.12)',color:'#57B0E7'}}>PRO</span>
        </FormRow>
      </div>
    </div>
  );
}

Object.assign(window, {DashboardScreen, AthletesScreen, DevicesScreen, ReportsScreen, SettingsScreen});

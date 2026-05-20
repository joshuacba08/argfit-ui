/* ArgFit Desktop — Advanced Data Table (PrimeNG v21 style) */
const {useState, useRef, useCallback, useMemo, useEffect} = React;

/* ── Sample Data ── */
const TABLE_DATA = [
  {id:1,name:'María García',sport:'Voleibol',team:'Club San Lorenzo',sessions:42,bestJump:45.2,avgJump:41.3,force:2847,rsi:1.32,asymmetry:4.2,status:'active',lastSession:'Hoy 10:30',trend:[38,39,41,42,43,45],photo:'MG'},
  {id:2,name:'Lucas Rodríguez',sport:'Fútbol',team:'Racing Club',sessions:38,bestJump:52.1,avgJump:48.3,force:3120,rsi:1.45,asymmetry:6.1,status:'active',lastSession:'Hoy 09:15',trend:[44,46,48,47,50,52],photo:'LR'},
  {id:3,name:'Valentina López',sport:'Handball',team:'Selección ARG',sessions:56,bestJump:38.7,avgJump:35.4,force:2340,rsi:1.18,asymmetry:3.8,status:'active',lastSession:'Ayer 17:00',trend:[32,33,35,36,37,39],photo:'VL'},
  {id:4,name:'Matías Fernández',sport:'Rugby',team:'CASI',sessions:29,bestJump:48.9,avgJump:44.2,force:2890,rsi:1.38,asymmetry:8.4,status:'inactive',lastSession:'12 May',trend:[42,43,45,44,47,49],photo:'MF'},
  {id:5,name:'Camila Torres',sport:'Básquet',team:'Obras Sanitarias',sessions:34,bestJump:41.3,avgJump:38.9,force:2580,rsi:1.25,asymmetry:5.0,status:'active',lastSession:'Ayer 11:30',trend:[35,36,38,39,40,41],photo:'CT'},
  {id:6,name:'Santiago Pérez',sport:'Atletismo',team:'GEBA',sessions:67,bestJump:55.4,avgJump:51.2,force:3340,rsi:1.52,asymmetry:2.9,status:'active',lastSession:'Hoy 08:00',trend:[48,50,51,52,54,55],photo:'SP'},
  {id:7,name:'Florencia Díaz',sport:'Hockey',team:'Club Ciudad',sessions:23,bestJump:36.8,avgJump:33.5,force:2180,rsi:1.10,asymmetry:7.2,status:'inactive',lastSession:'8 May',trend:[30,31,33,34,35,37],photo:'FD'},
  {id:8,name:'Nicolás Morales',sport:'Fútbol',team:'Independiente',sessions:45,bestJump:49.7,avgJump:46.1,force:2960,rsi:1.40,asymmetry:5.5,status:'active',lastSession:'Ayer 16:00',trend:[42,44,45,46,48,50],photo:'NM'},
  {id:9,name:'Ana Gutiérrez',sport:'Voleibol',team:'River Plate',sessions:31,bestJump:40.2,avgJump:37.8,force:2450,rsi:1.22,asymmetry:4.8,status:'active',lastSession:'15 May',trend:[34,35,37,38,39,40],photo:'AG'},
  {id:10,name:'Diego Romero',sport:'Rugby',team:'Alumni',sessions:19,bestJump:46.5,avgJump:42.8,force:2780,rsi:1.35,asymmetry:9.1,status:'inactive',lastSession:'5 May',trend:[40,41,43,44,45,47],photo:'DR'},
  {id:11,name:'Paula Martínez',sport:'Atletismo',team:'CeNARD',sessions:72,bestJump:44.8,avgJump:41.5,force:2720,rsi:1.30,asymmetry:3.2,status:'active',lastSession:'Hoy 07:30',trend:[38,39,41,42,43,45],photo:'PM'},
  {id:12,name:'Tomás Herrera',sport:'Básquet',team:'San Lorenzo',sessions:28,bestJump:50.3,avgJump:46.8,force:3050,rsi:1.42,asymmetry:6.8,status:'active',lastSession:'14 May',trend:[43,44,46,47,49,50],photo:'TH'},
];

/* ── Mini Trend Sparkline ── */
function TrendLine({data, color='#2599D5', w=72, h=24}) {
  if (!data || !data.length) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max-min||1;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*h*0.8-h*0.1}`).join(' ');
  return <svg width={w} height={h} style={{display:'block'}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

/* ── Progress Bar ── */
function MiniBar({value, max=100, color='#2599D5'}) {
  const pct = Math.min((value/max)*100,100);
  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <div style={{width:60,height:4,borderRadius:2,background:'#152A42',overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',borderRadius:2,background:color,transition:'width 300ms'}}></div>
      </div>
      <span style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:'#829AB1',minWidth:28}}>{value}</span>
    </div>
  );
}

/* ═══ ADVANCED TABLE SCREEN ══════════════════════════ */
function AdvancedTableScreen() {
  const [data] = useState(TABLE_DATA);
  const [selected, setSelected] = useState([]);
  const [sortCol, setSortCol] = useState('bestJump');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');
  const [filterSport, setFilterSport] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [densityMode, setDensityMode] = useState('normal'); // compact, normal, comfortable
  const perPage = 8;
  const toastCtx = useContext(ToastContext);

  const sports = [...new Set(data.map(d=>d.sport))].sort();

  const filtered = useMemo(() => {
    let d = [...data];
    if (search) d = d.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.team.toLowerCase().includes(search.toLowerCase()));
    if (filterSport !== 'all') d = d.filter(r => r.sport === filterSport);
    if (filterStatus !== 'all') d = d.filter(r => r.status === filterStatus);
    d.sort((a,b) => {
      const av = a[sortCol], bv = b[sortCol];
      const cmp = typeof av === 'number' ? av-bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return d;
  }, [data, search, filterSport, filterStatus, sortCol, sortDir]);

  const paged = filtered.slice(page*perPage, (page+1)*perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === paged.length ? [] : paged.map(r=>r.id));
  const toggleExpand = (id) => setExpandedRows(e => ({...e, [id]: !e[id]}));

  const padY = densityMode === 'compact' ? '8px' : densityMode === 'comfortable' ? '14px' : '11px';

  const SortIcon = ({col}) => {
    if (sortCol !== col) return <span style={{opacity:0.3,marginLeft:4}}><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5-5 5 5zM7 14l5 5 5-5z"/></svg></span>;
    return <span style={{marginLeft:4,color:'#2599D5'}}>{sortDir==='asc'?DI.sortAsc:DI.sortDesc}</span>;
  };

  return (
    <div style={{padding:24,overflow:'auto',flex:1}}>
      {/* Toolbar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,gap:12,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
          {/* Search */}
          <div style={{display:'flex',alignItems:'center',gap:8,background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:8,padding:'7px 12px',minWidth:200,maxWidth:280}}>
            <span style={{color:'#627D98'}}>{DI.search}</span>
            <input placeholder="Buscar atleta o equipo..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{background:'none',border:'none',outline:'none',color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:13,width:'100%'}} />
            {search && <span onClick={()=>setSearch('')} style={{cursor:'pointer',color:'#627D98'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>}
          </div>
          {/* Sport filter */}
          <select value={filterSport} onChange={e=>setFilterSport(e.target.value)}
            style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:8,padding:'8px 28px 8px 12px',color:'#BCCCDC',fontFamily:"'Outfit',sans-serif",fontSize:12,appearance:'none',outline:'none',cursor:'pointer',backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23627D98' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center'}}>
            <option value="all">Todos los deportes</option>
            {sports.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          {/* Status filter */}
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:8,padding:'8px 28px 8px 12px',color:'#BCCCDC',fontFamily:"'Outfit',sans-serif",fontSize:12,appearance:'none',outline:'none',cursor:'pointer',backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23627D98' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center'}}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {/* Density */}
          <div style={{display:'flex',background:'#0F1D32',borderRadius:6,padding:2,border:'1px solid rgba(37,153,213,0.06)'}}>
            {[{id:'compact',icon:'≡'},{id:'normal',icon:'☰'},{id:'comfortable',icon:'▤'}].map(d=>(
              <button key={d.id} onClick={()=>setDensityMode(d.id)} title={d.id} style={{
                width:28,height:28,borderRadius:4,border:'none',fontSize:12,
                background:densityMode===d.id?'#2599D5':'transparent',color:densityMode===d.id?'#fff':'#627D98',
                cursor:'pointer',fontFamily:"'Outfit',sans-serif",display:'flex',alignItems:'center',justifyContent:'center',
              }}>{d.icon}</button>
            ))}
          </div>
          {selected.length > 0 && <DBtn variant="secondary" size="sm" onClick={()=>{toastCtx?.addToast({severity:'success',summary:'Exportado',detail:`${selected.length} atletas exportados a CSV.`});setSelected([])}}>Exportar ({selected.length})</DBtn>}
          <DBtn variant="secondary" size="sm" icon={DI.download}>CSV</DBtn>
          <DBtn icon={DI.plus}>Nuevo atleta</DBtn>
        </div>
      </div>

      {/* Selected bar */}
      {selected.length > 0 && (
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',background:'rgba(37,153,213,0.08)',borderRadius:8,marginBottom:12,fontSize:13}}>
          <span style={{fontWeight:600,color:'#2599D5'}}>{selected.length} seleccionado{selected.length>1?'s':''}</span>
          <span style={{color:'#486581'}}>|</span>
          <span onClick={toggleAll} style={{color:'#829AB1',cursor:'pointer',fontWeight:500}}>Seleccionar todo</span>
          <span onClick={()=>setSelected([])} style={{color:'#829AB1',cursor:'pointer',fontWeight:500}}>Limpiar</span>
          <span style={{flex:1}}></span>
          <DBtn variant="danger" size="sm" onClick={()=>toastCtx?.addToast({severity:'error',summary:'Eliminados',detail:`${selected.length} atletas fueron eliminados.`})}>Eliminar</DBtn>
        </div>
      )}

      {/* Table */}
      <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,overflow:'hidden'}}>
        <div style={{overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(37,153,213,0.10)'}}>
                <th style={{width:40,padding:`12px 8px 12px 16px`}}>
                  <div onClick={toggleAll} style={{width:16,height:16,borderRadius:3,border:`2px solid ${selected.length===paged.length&&paged.length>0?'#2599D5':'#486581'}`,background:selected.length===paged.length&&paged.length>0?'#2599D5':'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 150ms'}}>
                    {selected.length===paged.length&&paged.length>0 && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                </th>
                <th style={{width:28,padding:`12px 4px`}}></th>
                {[{k:'name',l:'Atleta',w:180},{k:'sport',l:'Deporte',w:100},{k:'sessions',l:'Sesiones',w:80},{k:'bestJump',l:'Mejor (cm)',w:90},{k:'avgJump',l:'Prom (cm)',w:90},{k:'force',l:'Fuerza (N)',w:90},{k:'rsi',l:'RSI',w:60},{k:'asymmetry',l:'Asimetría',w:90},{k:'trend',l:'Tendencia',w:90,nosort:true},{k:'status',l:'Estado',w:100}].map(c=>(
                  <th key={c.k} onClick={()=>!c.nosort && handleSort(c.k)} style={{
                    padding:`12px 8px`,textAlign:'left',color:'#829AB1',fontWeight:600,fontSize:11,
                    letterSpacing:'0.04em',textTransform:'uppercase',cursor:c.nosort?'default':'pointer',
                    whiteSpace:'nowrap',userSelect:'none',width:c.w,
                  }}>
                    <span style={{display:'inline-flex',alignItems:'center'}}>{c.l}{!c.nosort && <SortIcon col={c.k}/>}</span>
                  </th>
                ))}
                <th style={{width:60,padding:'12px 16px 12px 8px'}}></th>
              </tr>
            </thead>
            <tbody>
              {paged.map(row=>(
                <React.Fragment key={row.id}>
                  <tr style={{borderBottom:'1px solid rgba(37,153,213,0.04)',transition:'background 120ms'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(37,153,213,0.04)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{padding:`${padY} 8px ${padY} 16px`}}>
                      <div onClick={()=>toggleSelect(row.id)} style={{width:16,height:16,borderRadius:3,border:`2px solid ${selected.includes(row.id)?'#2599D5':'#486581'}`,background:selected.includes(row.id)?'#2599D5':'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 150ms'}}>
                        {selected.includes(row.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    </td>
                    <td style={{padding:`${padY} 4px`}}>
                      <div onClick={()=>toggleExpand(row.id)} style={{cursor:'pointer',color:'#627D98',transition:'transform 200ms',transform:expandedRows[row.id]?'rotate(90deg)':'rotate(0)'}}>
                        {DI.chevRight}
                      </div>
                    </td>
                    <td style={{padding:`${padY} 8px`}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#2599D5,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#0A1628',flexShrink:0}}>{row.photo}</div>
                        <div><div style={{fontWeight:600,color:'#F0F4F8'}}>{row.name}</div><div style={{fontSize:11,color:'#627D98'}}>{row.team}</div></div>
                      </div>
                    </td>
                    <td style={{padding:`${padY} 8px`,color:'#BCCCDC'}}>{row.sport}</td>
                    <td style={{padding:`${padY} 8px`}}><MiniBar value={row.sessions} max={80} color="#2599D5"/></td>
                    <td style={{padding:`${padY} 8px`,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:'#00D4FF'}}>{row.bestJump}</td>
                    <td style={{padding:`${padY} 8px`,fontFamily:"'JetBrains Mono',monospace",color:'#BCCCDC'}}>{row.avgJump}</td>
                    <td style={{padding:`${padY} 8px`,fontFamily:"'JetBrains Mono',monospace",color:'#BCCCDC'}}>{row.force}</td>
                    <td style={{padding:`${padY} 8px`,fontFamily:"'JetBrains Mono',monospace",color:'#BCCCDC'}}>{row.rsi}</td>
                    <td style={{padding:`${padY} 8px`}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:row.asymmetry>7?'#FF3D71':row.asymmetry>5?'#FFB300':'#00C853',fontWeight:600}}>{row.asymmetry}%</span>
                        {row.asymmetry>7 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF3D71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                      </div>
                    </td>
                    <td style={{padding:`${padY} 8px`}}><TrendLine data={row.trend} color={row.trend[row.trend.length-1]>row.trend[0]?'#00C853':'#FF3D71'}/></td>
                    <td style={{padding:`${padY} 8px`}}><StatusBadge status={row.status}/></td>
                    <td style={{padding:`${padY} 16px ${padY} 8px`}}>
                      <div style={{display:'flex',gap:4}}>
                        <span style={{cursor:'pointer',color:'#627D98',padding:3}}>{DI.edit}</span>
                        <span style={{cursor:'pointer',color:'#627D98',padding:3}}>{DI.trash}</span>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded row detail */}
                  {expandedRows[row.id] && (
                    <tr><td colSpan={13} style={{padding:0}}>
                      <div style={{padding:'16px 16px 16px 70px',background:'rgba(37,153,213,0.02)',borderBottom:'1px solid rgba(37,153,213,0.06)',display:'flex',gap:24}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:11,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:8}}>Últimas sesiones</div>
                          <div style={{display:'flex',flexDirection:'column',gap:4}}>
                            {['CMJ Bilateral — Hoy 10:30 — 12 saltos','Drop Jump — Ayer 16:45 — 8 saltos','SJ Unilateral — 15 May — 6 saltos'].map((s,i)=>(
                              <div key={i} style={{fontSize:12,color:'#BCCCDC',padding:'6px 10px',background:'rgba(37,153,213,0.04)',borderRadius:6}}>{s}</div>
                            ))}
                          </div>
                        </div>
                        <div style={{width:200}}>
                          <div style={{fontSize:11,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:8}}>Progreso 6 sesiones</div>
                          <DSparkline data={row.trend} color="#2599D5" h={60} w={180}/>
                        </div>
                        <div style={{width:160}}>
                          <div style={{fontSize:11,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:8}}>Acciones</div>
                          <div style={{display:'flex',flexDirection:'column',gap:6}}>
                            <DBtn variant="secondary" size="sm">Ver perfil completo</DBtn>
                            <DBtn variant="secondary" size="sm" icon={DI.download}>Exportar datos</DBtn>
                          </div>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderTop:'1px solid rgba(37,153,213,0.06)',fontSize:12,color:'#627D98'}}>
          <span>Mostrando {filtered.length === 0 ? 0 : page*perPage+1}–{Math.min((page+1)*perPage,filtered.length)} de {filtered.length} atletas</span>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0} style={{width:28,height:28,borderRadius:6,border:'none',cursor:page===0?'default':'pointer',background:'transparent',color:page===0?'#334E68':'#829AB1',fontFamily:"'Outfit',sans-serif",fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
            {Array.from({length:totalPages}).map((_,i)=>(
              <button key={i} onClick={()=>setPage(i)} style={{
                width:28,height:28,borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:page===i?600:400,
                background:page===i?'#2599D5':'transparent',color:page===i?'#fff':'#829AB1',
                fontFamily:"'Outfit',sans-serif"
              }}>{i+1}</button>
            ))}
            <button onClick={()=>setPage(Math.min(totalPages-1,page+1))} disabled={page>=totalPages-1} style={{width:28,height:28,borderRadius:6,border:'none',cursor:page>=totalPages-1?'default':'pointer',background:'transparent',color:page>=totalPages-1?'#334E68':'#829AB1',fontFamily:"'Outfit',sans-serif",fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {AdvancedTableScreen, TrendLine, MiniBar});

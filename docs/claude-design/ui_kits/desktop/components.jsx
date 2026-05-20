/* ArgFit Desktop Components (PrimeNG-style) */
const {useState, useRef, useEffect} = React;

/* ── Icons ────────────────────────────────────────── */
const DI = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  device: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  report: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chevDown: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  chevRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  sortAsc: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>,
  sortDesc: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

/* ── Sidebar ──────────────────────────────────────── */
function Sidebar({active, onNavigate, collapsed, onToggle, items:itemsProp}) {
  const items = itemsProp || [
    {id:'dashboard',icon:DI.dashboard,label:'Dashboard'},
    {id:'athletes',icon:DI.users,label:'Atletas'},
    {id:'devices',icon:DI.device,label:'Dispositivos'},
    {id:'reports',icon:DI.report,label:'Reportes'},
    {id:'forms',icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,label:'Formularios'},
    {id:'settings',icon:DI.settings,label:'Configuración'},
  ];
  return (
    <div style={{width:collapsed?64:220,background:'linear-gradient(180deg, #0C1829 0%, #091525 50%, #0B1A2F 100%)',borderRight:'1px solid rgba(37,153,213,0.08)',display:'flex',flexDirection:'column',transition:'width 250ms cubic-bezier(0.22,1,0.36,1)',overflow:'hidden',flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:collapsed?'16px 12px':'16px 20px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid rgba(37,153,213,0.06)',minHeight:60}}>
        <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#2599D5,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontWeight:900,fontSize:13,color:'#0A1628',flexShrink:0}}>AF</div>
        {!collapsed && <span style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontWeight:800,fontSize:16,letterSpacing:'-0.01em',whiteSpace:'nowrap',textTransform:'uppercase'}}>ARGFIT</span>}
      </div>
      {/* Nav Items */}
      <div style={{flex:1,padding:'8px',display:'flex',flexDirection:'column',gap:2}}>
        {items.map(it=>(
          <div key={it.id} onClick={()=>onNavigate(it.id)} style={{
            display:'flex',alignItems:'center',gap:12,padding:collapsed?'10px 12px':'10px 14px',
            borderRadius:8,cursor:'pointer',transition:'all 150ms',
            color:active===it.id?'#2599D5':'#829AB1',
            background:active===it.id?'rgba(37,153,213,0.10)':'transparent',
            fontWeight:active===it.id?600:400,fontSize:14,whiteSpace:'nowrap'
          }}>
            <span style={{flexShrink:0}}>{it.icon}</span>
            {!collapsed && <span>{it.label}</span>}
          </div>
        ))}
      </div>
      {/* Collapse toggle */}
      <div onClick={onToggle} style={{padding:'12px',borderTop:'1px solid rgba(37,153,213,0.06)',cursor:'pointer',color:'#627D98',display:'flex',justifyContent:'center'}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:collapsed?'rotate(0deg)':'rotate(180deg)',transition:'transform 200ms'}}><polyline points="15 18 9 12 15 6"/></svg>
      </div>
    </div>
  );
}

/* ── Top Bar ──────────────────────────────────────── */
function TopBar({title, breadcrumb}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 24px',borderBottom:'1px solid rgba(37,153,213,0.06)',background:'linear-gradient(90deg, #0A1628 0%, #0C1830 50%, #0A1628 100%)'}}>
      <div>
        {breadcrumb && <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'#627D98',marginBottom:2}}>
          {breadcrumb.map((b,i)=><React.Fragment key={i}>{i>0 && <span style={{opacity:0.5}}>/</span>}<span style={{cursor:i<breadcrumb.length-1?'pointer':'default',color:i===breadcrumb.length-1?'#BCCCDC':'#627D98'}}>{b}</span></React.Fragment>)}
        </div>}
        <h2 style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:20,fontWeight:700,letterSpacing:'-0.01em',textTransform:'uppercase'}}>{title}</h2>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        {/* Search */}
        <div style={{display:'flex',alignItems:'center',gap:8,background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:8,padding:'7px 12px',minWidth:220}}>
          <span style={{color:'#627D98'}}>{DI.search}</span>
          <input placeholder="Buscar..." style={{background:'none',border:'none',outline:'none',color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:13,width:'100%'}}/>
        </div>
        {/* Notifications */}
        <div style={{position:'relative',cursor:'pointer',color:'#829AB1'}}>
          {DI.bell}
          <div style={{position:'absolute',top:-3,right:-3,width:7,height:7,borderRadius:'50%',background:'#FF3D71',border:'2px solid #0A1628'}}></div>
        </div>
        {/* Avatar */}
        <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#2599D5,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:12,color:'#0A1628'}}>MG</div>
          <span style={{color:'#627D98'}}>{DI.chevDown}</span>
        </div>
      </div>
    </div>
  );
}

/* ── KPI Card ─────────────────────────────────────── */
function KpiCard({label, value, unit, change, changeDir, color='#2599D5', icon}) {
  return (
    <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:'20px',flex:1,minWidth:0}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
        <span style={{fontSize:13,color:'#829AB1',fontWeight:500}}>{label}</span>
        <div style={{width:36,height:36,borderRadius:10,background:`${color}12`,display:'flex',alignItems:'center',justifyContent:'center',color}}>{icon}</div>
      </div>
      <div style={{display:'flex',alignItems:'baseline',gap:4}}>
        <span style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:32,fontWeight:800,color:'#F0F4F8',letterSpacing:'-0.02em'}}>{value}</span>
        {unit && <span style={{fontSize:14,color:'#627D98',fontWeight:500}}>{unit}</span>}
      </div>
      {change && <div style={{marginTop:8,fontSize:12,fontWeight:600,color:changeDir==='up'?'#00C853':'#FF3D71'}}>
        {changeDir==='up'?'↑':'↓'} {change} vs mes anterior
      </div>}
    </div>
  );
}

/* ── Data Table ───────────────────────────────────── */
function DataTable({columns, data, onRowClick}) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const perPage = 6;

  const handleSort = (col) => {
    if(sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const sorted = [...data].sort((a,b)=>{
    if(!sortCol) return 0;
    const av=a[sortCol], bv=b[sortCol];
    const cmp = typeof av==='number'? av-bv : String(av).localeCompare(String(bv));
    return sortDir==='asc'?cmp:-cmp;
  });

  const paged = sorted.slice(page*perPage, (page+1)*perPage);
  const totalPages = Math.ceil(data.length/perPage);

  return (
    <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,overflow:'hidden'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead>
          <tr style={{borderBottom:'1px solid rgba(37,153,213,0.10)'}}>
            {columns.map(c=>(
              <th key={c.key} onClick={()=>c.sortable!==false && handleSort(c.key)} style={{
                padding:'12px 16px',textAlign:'left',color:'#829AB1',fontWeight:600,fontSize:12,
                letterSpacing:'0.04em',textTransform:'uppercase',cursor:c.sortable!==false?'pointer':'default',
                whiteSpace:'nowrap',userSelect:'none'
              }}>
                <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
                  {c.label}
                  {sortCol===c.key && (sortDir==='asc'?DI.sortAsc:DI.sortDesc)}
                </span>
              </th>
            ))}
            <th style={{width:80,padding:'12px 16px'}}></th>
          </tr>
        </thead>
        <tbody>
          {paged.map((row,i)=>(
            <tr key={i} onClick={()=>onRowClick&&onRowClick(row)} style={{
              borderBottom:'1px solid rgba(37,153,213,0.04)',cursor:onRowClick?'pointer':'default',
              transition:'background 120ms'
            }} onMouseEnter={e=>e.currentTarget.style.background='rgba(37,153,213,0.04)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              {columns.map(c=>(
                <td key={c.key} style={{padding:'11px 16px',color:'#BCCCDC'}}>
                  {c.render ? c.render(row[c.key],row) : row[c.key]}
                </td>
              ))}
              <td style={{padding:'11px 16px'}}>
                <div style={{display:'flex',gap:6}}>
                  <span style={{cursor:'pointer',color:'#627D98',padding:4}}>{DI.edit}</span>
                  <span style={{cursor:'pointer',color:'#627D98',padding:4}}>{DI.trash}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderTop:'1px solid rgba(37,153,213,0.06)',fontSize:12,color:'#627D98'}}>
        <span>Mostrando {page*perPage+1}–{Math.min((page+1)*perPage,data.length)} de {data.length}</span>
        <div style={{display:'flex',gap:4}}>
          {Array.from({length:totalPages}).map((_,i)=>(
            <button key={i} onClick={()=>setPage(i)} style={{
              width:28,height:28,borderRadius:6,border:'none',cursor:'pointer',fontSize:12,fontWeight:page===i?600:400,
              background:page===i?'#2599D5':'transparent',color:page===i?'#fff':'#829AB1',
              fontFamily:"'Outfit',sans-serif"
            }}>{i+1}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Sparkline (Desktop) ──────────────────────────── */
function DSparkline({data, color='#2599D5', w=400, h=100}) {
  if(!data||!data.length) return null;
  const max=Math.max(...data), min=Math.min(...data), range=max-min||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*h*0.8-h*0.1}`).join(' ');
  const area=pts+` ${w},${h} 0,${h}`;
  return (
    <svg width={w} height={h} style={{display:'block',width:'100%',height:h}}>
      <defs><linearGradient id={`dsg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={area} fill={`url(#dsg-${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Badge ────────────────────────────────────────── */
function StatusBadge({status}) {
  const map = {
    connected:{bg:'rgba(0,200,83,0.12)',color:'#00C853',label:'Conectado'},
    disconnected:{bg:'rgba(255,61,113,0.12)',color:'#FF3D71',label:'Desconectado'},
    active:{bg:'rgba(37,153,213,0.12)',color:'#57B0E7',label:'Activo'},
    inactive:{bg:'rgba(130,154,177,0.12)',color:'#9FB3C8',label:'Inactivo'},
    low:{bg:'rgba(255,179,0,0.12)',color:'#FFB300',label:'Batería baja'},
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:999,fontSize:11,fontWeight:600,background:s.bg,color:s.color}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:'currentColor'}}></span>
      {s.label}
    </span>
  );
}

/* ── Button (Desktop) ─────────────────────────────── */
function DBtn({children, variant='primary', icon, onClick, size='md'}) {
  const styles = {
    primary:{bg:'#2599D5',color:'#fff',border:'none'},
    secondary:{bg:'#152A42',color:'#BCCCDC',border:'1px solid rgba(37,153,213,0.15)'},
    outline:{bg:'transparent',color:'#2599D5',border:'1.5px solid rgba(37,153,213,0.3)'},
    danger:{bg:'rgba(255,61,113,0.1)',color:'#FF3D71',border:'1px solid rgba(255,61,113,0.2)'},
    ghost:{bg:'transparent',color:'#829AB1',border:'none'},
  };
  const s = styles[variant] || styles.primary;
  const pad = size==='sm'?'6px 12px':'9px 18px';
  const fs = size==='sm'?12:13;
  return (
    <button onClick={onClick} style={{
      display:'inline-flex',alignItems:'center',gap:6,padding:pad,borderRadius:8,
      background:s.bg,color:s.color,border:s.border,fontSize:fs,fontWeight:600,
      cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all 150ms',letterSpacing:'0.01em'
    }}>{icon}{children}</button>
  );
}

Object.assign(window, {DI, Sidebar, TopBar, KpiCard, DataTable, DSparkline, StatusBadge, DBtn});

/* ArgFit Mobile Components (Ionic-style) */
const {useState, useEffect, useRef} = React;

/* ── Lucide-style SVG icons ─────────────────────── */
const Icons = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  device: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  play: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  settings: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bluetooth: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/></svg>,
  battery: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="13" x2="23" y2="11"/><rect x="3" y="8" width="12" height="8" rx="1" fill="currentColor" opacity="0.3"/></svg>,
  timer: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  zap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  share: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  stop: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>,
  pause: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
};

/* ── Bottom Tab Bar ─────────────────────────────── */
function MobileTabBar({activeTab, onTabChange}) {
  const tabs = [
    {id:'home', icon:Icons.home, label:'Home'},
    {id:'train', icon:Icons.play, label:'Train'},
    {id:'overlays', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label:'Overlays'},
    {id:'charts', icon:Icons.chart, label:'Charts'},
    {id:'profile', icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>, label:'Forms'},
  ];
  return (
    <div style={{display:'flex',background:'linear-gradient(180deg, #0F1D32 0%, #0C1829 100%)',borderTop:'1px solid rgba(37,153,213,0.08)',padding:'6px 8px 24px'}}>
      {tabs.map(t=>(
        <div key={t.id} onClick={()=>onTabChange(t.id)} style={{
          flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,
          padding:'8px 4px',borderRadius:10,cursor:'pointer',
          color: activeTab===t.id ? '#2599D5' : '#627D98',
          background: activeTab===t.id ? 'rgba(37,153,213,0.08)' : 'transparent',
          transition:'all 200ms'
        }}>
          {t.icon}
          <span style={{fontSize:10,fontWeight:activeTab===t.id?600:400}}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Status Bar ──────────────────────────────────── */
function MobileStatusBar({light}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 20px 8px',color:light?'#0A1628':'#F0F4F8',fontSize:13,fontWeight:600}}>
      <span>9:41</span>
      <div style={{display:'flex',gap:6,alignItems:'center'}}>
        <svg width="16" height="12" viewBox="0 0 16 12"><rect x="0" y="6" width="3" height="6" rx="1" fill="currentColor"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="currentColor"/><rect x="9" y="1" width="3" height="11" rx="1" fill="currentColor"/><rect x="13" y="0" width="3" height="12" rx="1" fill="currentColor" opacity="0.3"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.5C5.8 2.5 3.8 3.3 2.3 4.8L0.5 3C2.4 1.1 5 0 8 0s5.6 1.1 7.5 3L13.7 4.8C12.2 3.3 10.2 2.5 8 2.5z" fill="currentColor" opacity="0.3"/><path d="M8 5.5C6.6 5.5 5.3 6 4.3 6.9L2.3 4.8C3.8 3.3 5.8 2.5 8 2.5s4.2.8 5.7 2.3L11.7 6.9C10.7 6 9.4 5.5 8 5.5z" fill="currentColor" opacity="0.6"/><path d="M8 8.5c-1 0-1.9.4-2.6 1L4.3 6.9C5.3 6 6.6 5.5 8 5.5s2.7.5 3.7 1.4L10.6 9.5c-.7-.6-1.6-1-2.6-1z" fill="currentColor" opacity="0.8"/><circle cx="8" cy="11" r="1.5" fill="currentColor"/></svg>
        <svg width="24" height="12" viewBox="0 0 24 12"><rect x="0" y="0" width="20" height="12" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="21" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.4"/><rect x="1.5" y="1.5" width="14" height="9" rx="1.5" fill="currentColor"/></svg>
      </div>
    </div>
  );
}

/* ── Stat Card ───────────────────────────────────── */
function StatCard({value, unit, label, color='#2599D5', icon}) {
  return (
    <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:12,padding:'16px',flex:1,minWidth:0}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
        <span style={{fontSize:12,color:'#829AB1',fontWeight:500}}>{label}</span>
        {icon && <span style={{color,opacity:0.6}}>{icon}</span>}
      </div>
      <div style={{display:'flex',alignItems:'baseline',gap:4}}>
        <span style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:28,fontWeight:800,color,letterSpacing:'-0.02em'}}>{value}</span>
        <span style={{fontSize:13,color:'#627D98',fontWeight:500}}>{unit}</span>
      </div>
    </div>
  );
}

/* ── Device Status Row ──────────────────────────── */
function DeviceRow({name, status, battery}) {
  const connected = status === 'connected';
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)'}}>
      <div style={{width:10,height:10,borderRadius:'50%',background:connected?'#00C853':'#FF3D71',boxShadow:`0 0 8px ${connected?'rgba(0,200,83,0.4)':'rgba(255,61,113,0.4)'}`}}></div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:600}}>{name}</div>
        <div style={{fontSize:12,color:'#829AB1'}}>{connected?'Connected':'Disconnected'}{battery?` • ${battery}%`:''}</div>
      </div>
      <span style={{display:'inline-flex',padding:'3px 8px',borderRadius:999,fontSize:10,fontWeight:600,background:'rgba(37,153,213,0.12)',color:'#57B0E7'}}>BLE</span>
    </div>
  );
}

/* ── Session Row ─────────────────────────────────── */
function SessionRow({type, date, jumps, avgHeight, onClick}) {
  return (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',cursor:'pointer',transition:'all 150ms'}}>
      <div style={{width:40,height:40,borderRadius:10,background:'rgba(37,153,213,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#2599D5'}}>{Icons.zap}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:600}}>{type}</div>
        <div style={{fontSize:12,color:'#829AB1'}}>{date} • {jumps} saltos</div>
      </div>
      <div style={{textAlign:'right'}}>
        <div style={{fontSize:14,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#2599D5'}}>{avgHeight}cm</div>
        <div style={{fontSize:10,color:'#627D98'}}>avg</div>
      </div>
      <span style={{color:'#486581'}}>{Icons.arrow}</span>
    </div>
  );
}

/* ── Mini Chart (SVG sparkline) ──────────────────── */
function Sparkline({data, color='#2599D5', width=280, height=60}) {
  if(!data||!data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max-min||1;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*width},${height-((v-min)/range)*height*0.85-height*0.075}`).join(' ');
  const areaPts = pts+` ${width},${height} 0,${height}`;
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      <defs><linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={areaPts} fill={`url(#sg-${color.replace('#','')})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Section Header ──────────────────────────────── */
function SectionHeader({title, action, onAction}) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
      <span style={{fontSize:16,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",letterSpacing:'-0.01em'}}>{title}</span>
      {action && <span onClick={onAction} style={{fontSize:13,color:'#2599D5',fontWeight:500,cursor:'pointer'}}>{action}</span>}
    </div>
  );
}

Object.assign(window, {Icons, MobileTabBar, MobileStatusBar, StatCard, DeviceRow, SessionRow, Sparkline, SectionHeader});

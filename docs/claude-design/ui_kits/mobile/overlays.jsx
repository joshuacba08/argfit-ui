/* ArgFit Mobile — Overlays: Modals, Toasts, Inline Push Messages (Ionic-style) */
const {useState, useEffect, useRef, useCallback, createContext, useContext} = React;

/* ═══ MOBILE TOAST SYSTEM ════════════════════════════ */
const MToastContext = React.createContext(null);

function MToastProvider({children}) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback(({severity='info', text='', life=3000}) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, {id, severity, text, entering: true}]);
    setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? {...t, entering: false} : t)), 50);
    setTimeout(() => removeToast(id), life);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? {...t, exiting: true} : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  return React.createElement(MToastContext.Provider, {value: {addToast, removeToast, toasts}},
    children,
    React.createElement(MToastContainer, {toasts, onClose: removeToast})
  );
}

function MToastContainer({toasts, onClose}) {
  const cfg = {
    success: {bg:'#0B2E18', border:'rgba(0,200,83,0.30)', color:'#00C853', icon:'✓'},
    info: {bg:'#0B1E30', border:'rgba(37,153,213,0.30)', color:'#2599D5', icon:'i'},
    warn: {bg:'#2A2010', border:'rgba(255,179,0,0.30)', color:'#FFB300', icon:'!'},
    error: {bg:'#2A0F18', border:'rgba(255,61,113,0.30)', color:'#FF3D71', icon:'✕'},
  };
  return (
    <div style={{position:'absolute',top:52,left:12,right:12,zIndex:9999,display:'flex',flexDirection:'column',gap:6,pointerEvents:'none'}}>
      {toasts.map(t => {
        const c = cfg[t.severity] || cfg.info;
        return (
          <div key={t.id} onClick={()=>onClose(t.id)} style={{
            background:c.bg,border:`1px solid ${c.border}`,borderRadius:12,padding:'12px 14px',
            display:'flex',alignItems:'center',gap:10,pointerEvents:'auto',cursor:'pointer',
            boxShadow:'0 4px 20px rgba(0,0,0,0.4)',
            transform: t.entering ? 'translateY(-30px)' : t.exiting ? 'translateY(-30px)' : 'translateY(0)',
            opacity: t.exiting ? 0 : 1,
            transition: 'all 300ms cubic-bezier(0.22,1,0.36,1)',
          }}>
            <div style={{width:26,height:26,borderRadius:8,background:`${c.color}20`,display:'flex',alignItems:'center',justifyContent:'center',color:c.color,fontWeight:700,fontSize:12,flexShrink:0}}>{c.icon}</div>
            <span style={{fontSize:13,fontWeight:500,color:'#F0F4F8',flex:1}}>{t.text}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ MOBILE MODAL (Ionic Action Sheet / Bottom Sheet) ════ */
function MModal({open, onClose, children, title, fullHeight}) {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;
  return (
    <div style={{
      position:'absolute',inset:0,zIndex:8000,display:'flex',flexDirection:'column',justifyContent:'flex-end',
      background: animIn ? 'rgba(10,22,40,0.6)' : 'rgba(10,22,40,0)',
      backdropFilter: animIn ? 'blur(6px)' : 'blur(0px)',
      transition:'all 300ms',
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'#0F1D32',
        borderRadius:'20px 20px 0 0',
        maxHeight: fullHeight ? '90%' : '70%',
        display:'flex',flexDirection:'column',
        transform: animIn ? 'translateY(0)' : 'translateY(100%)',
        transition:'transform 300ms cubic-bezier(0.22,1,0.36,1)',
        overflow:'hidden',
      }}>
        {/* Handle bar */}
        <div style={{display:'flex',justifyContent:'center',padding:'10px 0 6px'}}>
          <div style={{width:36,height:4,borderRadius:2,background:'#334E68'}}></div>
        </div>
        {title && <div style={{padding:'4px 20px 12px',fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:16,fontWeight:700,textTransform:'uppercase',borderBottom:'1px solid rgba(37,153,213,0.08)'}}>{title}</div>}
        <div style={{overflow:'auto',flex:1,padding:'16px 20px 24px'}}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══ MOBILE CENTER MODAL (Dialog) ════════════════════ */
function MCenterModal({open, onClose, children, icon, iconColor='#2599D5'}) {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;
  return (
    <div style={{
      position:'absolute',inset:0,zIndex:8000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,
      background: animIn ? 'rgba(10,22,40,0.7)' : 'rgba(10,22,40,0)',
      backdropFilter: animIn ? 'blur(8px)' : 'blur(0px)',
      transition:'all 250ms',
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'#152A42',border:'1px solid rgba(37,153,213,0.15)',
        borderRadius:20,padding:'28px 24px',width:'100%',maxWidth:310,
        textAlign:'center',
        transform: animIn ? 'scale(1)' : 'scale(0.9)',
        opacity: animIn ? 1 : 0,
        transition:'all 250ms cubic-bezier(0.22,1,0.36,1)',
        boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {icon && <div style={{width:56,height:56,borderRadius:16,background:`${iconColor}15`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',color:iconColor}}>{icon}</div>}
        {children}
      </div>
    </div>
  );
}

/* ═══ MOBILE INLINE PUSH MESSAGE ═════════════════════ */
function MInlineMessage({severity='info', text, detail, closable=true, onClose}) {
  const [visible, setVisible] = useState(true);
  const cfg = {
    success: {bg:'rgba(0,200,83,0.08)', border:'rgba(0,200,83,0.18)', color:'#00C853',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>},
    info: {bg:'rgba(37,153,213,0.08)', border:'rgba(37,153,213,0.18)', color:'#2599D5',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>},
    warn: {bg:'rgba(255,179,0,0.08)', border:'rgba(255,179,0,0.18)', color:'#FFB300',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
    error: {bg:'rgba(255,61,113,0.08)', border:'rgba(255,61,113,0.18)', color:'#FF3D71',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>},
  };
  const c = cfg[severity] || cfg.info;
  if (!visible) return null;
  return (
    <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px',borderRadius:12,background:c.bg,border:`1px solid ${c.border}`}}>
      <span style={{color:c.color,flexShrink:0,marginTop:1}}>{c.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:c.color}}>{text}</div>
        {detail && <div style={{fontSize:11,color:'#829AB1',marginTop:2,lineHeight:1.4}}>{detail}</div>}
      </div>
      {closable && <div onClick={()=>{setVisible(false);onClose&&onClose()}} style={{cursor:'pointer',color:'#627D98',padding:2,flexShrink:0}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </div>}
    </div>
  );
}

/* ═══ OVERLAYS DEMO SCREEN ═══════════════════════════ */
function MobileOverlaysScreen() {
  const toastCtx = useContext(MToastContext);
  const [sheet1, setSheet1] = useState(false);
  const [sheet2, setSheet2] = useState(false);
  const [dialog1, setDialog1] = useState(false);
  const [dialog2, setDialog2] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px',position:'relative'}}>
      {/* Header */}
      <div style={{padding:'8px 0 16px'}}>
        <div style={{fontSize:12,color:'#829AB1',fontWeight:500}}>Componentes</div>
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:20,fontWeight:700,marginTop:2,textTransform:'uppercase'}}>Overlays</div>
      </div>

      {/* Inline Messages */}
      <SectionHeader title="MENSAJES INLINE" />
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
        <MInlineMessage severity="info" text="Sincronizando dispositivo" detail="ArgFit Jump 2 se está conectando vía BLE..." closable={false} />
        <MInlineMessage severity="success" text="Sesión guardada" detail="12 saltos registrados correctamente." />
        <MInlineMessage severity="warn" text="Batería baja" detail="Tu dispositivo tiene 15% de batería." />
        <MInlineMessage severity="error" text="Sin conexión" detail="Verificá tu conexión Bluetooth." />
      </div>

      {/* Toasts */}
      <SectionHeader title="TOASTS" />
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
        {[
          {sev:'success',label:'Success',text:'Sesión guardada exitosamente'},
          {sev:'info',label:'Info',text:'Dispositivo sincronizado'},
          {sev:'warn',label:'Warning',text:'Batería baja: 15%'},
          {sev:'error',label:'Error',text:'Error de conexión BLE'},
        ].map(t=>(
          <button key={t.sev} onClick={()=>toastCtx?.addToast({severity:t.sev,text:t.text})}
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'12px',
              background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,
              color:'#BCCCDC',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif",
              transition:'all 150ms',
            }}>
            <span style={{width:8,height:8,borderRadius:'50%',background:
              t.sev==='success'?'#00C853':t.sev==='info'?'#2599D5':t.sev==='warn'?'#FFB300':'#FF3D71'
            }}></span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Modals */}
      <SectionHeader title="MODALES" />
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
        {[
          {label:'Bottom Sheet — Detalle',desc:'Info del dispositivo',action:()=>setSheet1(true)},
          {label:'Bottom Sheet — Acciones',desc:'Lista de acciones rápidas',action:()=>setSheet2(true)},
          {label:'Dialog — Éxito',desc:'Confirmación visual',action:()=>setDialog1(true)},
          {label:'Dialog — Alerta',desc:'Mensaje de advertencia',action:()=>setDialog2(true)},
          {label:'Confirm — Eliminar',desc:'Confirmación destructiva',action:()=>setConfirmDel(true)},
        ].map((m,i)=>(
          <div key={i} onClick={m.action} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',cursor:'pointer'}}>
            <div style={{width:40,height:40,borderRadius:10,background:'rgba(37,153,213,0.08)',display:'flex',alignItems:'center',justifyContent:'center',color:'#2599D5'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600}}>{m.label}</div>
              <div style={{fontSize:12,color:'#829AB1',marginTop:1}}>{m.desc}</div>
            </div>
            <span style={{color:'#486581'}}>{Icons.arrow}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom Sheet 1: Device Detail ── */}
      <MModal open={sheet1} onClose={()=>setSheet1(false)} title="ArgFit Jump 2">
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <MInlineMessage severity="success" text="Dispositivo conectado" detail="BLE 5.0 — Señal fuerte" closable={false} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[['Firmware','v3.2.1'],['Batería','87%'],['Último sync','Hace 2 min'],['MAC','AA:BB:CC:DD']].map(([l,v])=>(
              <div key={l} style={{background:'rgba(37,153,213,0.04)',borderRadius:10,padding:'12px'}}>
                <div style={{fontSize:10,color:'#627D98',fontWeight:500,letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:4}}>{l}</div>
                <div style={{fontSize:14,fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:4}}>
            <MBtn block>Actualizar firmware</MBtn>
            <MBtn variant="secondary" block onClick={()=>setSheet1(false)}>Cerrar</MBtn>
          </div>
        </div>
      </MModal>

      {/* ── Bottom Sheet 2: Actions ── */}
      <MModal open={sheet2} onClose={()=>setSheet2(false)} title="Acciones rápidas">
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {[
            {icon:Icons.play,label:'Iniciar sesión CMJ',color:'#2599D5'},
            {icon:Icons.chart,label:'Ver estadísticas',color:'#00D4FF'},
            {icon:Icons.download,label:'Exportar datos CSV',color:'#00C853'},
            {icon:Icons.share,label:'Compartir reporte',color:'#FFB300'},
            {icon:Icons.user,label:'Editar perfil atleta',color:'#829AB1'},
          ].map((a,i)=>(
            <div key={i} onClick={()=>{setSheet2(false);toastCtx?.addToast({severity:'info',text:`${a.label} seleccionado`})}}
              style={{display:'flex',alignItems:'center',gap:14,padding:'14px 4px',borderBottom:i<4?'1px solid rgba(37,153,213,0.06)':'none',cursor:'pointer'}}>
              <span style={{color:a.color}}>{a.icon}</span>
              <span style={{fontSize:15,fontWeight:500,color:'#F0F4F8'}}>{a.label}</span>
            </div>
          ))}
          <div style={{marginTop:10}}>
            <MBtn variant="ghost" block onClick={()=>setSheet2(false)}>Cancelar</MBtn>
          </div>
        </div>
      </MModal>

      {/* ── Center Dialog: Success ── */}
      <MCenterModal open={dialog1} onClose={()=>setDialog1(false)}
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        iconColor="#00C853">
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:18,fontWeight:700,marginBottom:8,textTransform:'uppercase'}}>Sesión completa</div>
        <div style={{fontSize:13,color:'#829AB1',lineHeight:1.5,marginBottom:8}}>Se registraron 12 saltos en la sesión CMJ Bilateral.</div>
        <div style={{display:'flex',justifyContent:'center',gap:20,margin:'16px 0'}}>
          {[['45.2','Mejor'],['42.1','Prom.'],['2847 N','Fuerza']].map(([v,l])=>(
            <div key={l}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:'#2599D5'}}>{v}</div><div style={{fontSize:10,color:'#627D98',marginTop:2}}>{l}</div></div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
          <MBtn block icon={Icons.download}>Exportar CSV</MBtn>
          <MBtn variant="ghost" block onClick={()=>setDialog1(false)}>Cerrar</MBtn>
        </div>
      </MCenterModal>

      {/* ── Center Dialog: Warning ── */}
      <MCenterModal open={dialog2} onClose={()=>setDialog2(false)}
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFB300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        iconColor="#FFB300">
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:18,fontWeight:700,marginBottom:8,textTransform:'uppercase'}}>Batería baja</div>
        <div style={{fontSize:13,color:'#829AB1',lineHeight:1.5,marginBottom:16}}>El dispositivo AF-J2-003 tiene solo 15% de batería. Conectalo al cargador pronto.</div>
        <div style={{display:'flex',gap:8}}>
          <MBtn variant="secondary" onClick={()=>setDialog2(false)} block>Ignorar</MBtn>
          <MBtn block onClick={()=>{setDialog2(false);toastCtx?.addToast({severity:'info',text:'Recordatorio configurado'})}}>Recordar</MBtn>
        </div>
      </MCenterModal>

      {/* ── Confirm Delete ── */}
      <MCenterModal open={confirmDel} onClose={()=>setConfirmDel(false)}
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF3D71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>}
        iconColor="#FF3D71">
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:16,fontWeight:700,marginBottom:8,textTransform:'uppercase'}}>Eliminar sesión</div>
        <div style={{fontSize:13,color:'#829AB1',lineHeight:1.5,marginBottom:16}}>¿Estás seguro? Se borrarán todos los datos de la sesión CMJ del 17 May. Esta acción no se puede deshacer.</div>
        <div style={{display:'flex',gap:8}}>
          <MBtn variant="secondary" onClick={()=>setConfirmDel(false)} block>Cancelar</MBtn>
          <MBtn variant="danger" block onClick={()=>{setConfirmDel(false);toastCtx?.addToast({severity:'error',text:'Sesión eliminada'})}}>Eliminar</MBtn>
        </div>
      </MCenterModal>
    </div>
  );
}

Object.assign(window, {MToastProvider, MToastContext, MToastContainer, MModal, MCenterModal, MInlineMessage, MobileOverlaysScreen});

/* ArgFit Desktop — Overlays: Modals, Toasts, Inline Messages (PrimeNG-style) */
const {useState, useEffect, useRef, useCallback, createContext, useContext} = React;

/* ═══ TOAST SYSTEM ═══════════════════════════════════ */
const ToastContext = React.createContext(null);

function ToastProvider({children}) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback(({severity='info', summary='', detail='', life=4000, sticky=false}) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, {id, severity, summary, detail, life, sticky, entering: true}]);
    if (!sticky) {
      setTimeout(() => removeToast(id), life);
    }
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? {...t, entering: false} : t));
    }, 50);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? {...t, exiting: true} : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  return React.createElement(ToastContext.Provider, {value: {addToast, removeToast, toasts}},
    children,
    React.createElement(ToastContainer, {toasts, onClose: removeToast})
  );
}

function ToastContainer({toasts, onClose}) {
  const severityConfig = {
    success: {bg: 'rgba(0,200,83,0.12)', border: 'rgba(0,200,83,0.25)', color: '#00C853', icon: '✓', iconBg: 'rgba(0,200,83,0.2)'},
    info: {bg: 'rgba(37,153,213,0.12)', border: 'rgba(37,153,213,0.25)', color: '#2599D5', icon: 'i', iconBg: 'rgba(37,153,213,0.2)'},
    warn: {bg: 'rgba(255,179,0,0.12)', border: 'rgba(255,179,0,0.25)', color: '#FFB300', icon: '!', iconBg: 'rgba(255,179,0,0.2)'},
    error: {bg: 'rgba(255,61,113,0.12)', border: 'rgba(255,61,113,0.25)', color: '#FF3D71', icon: '✕', iconBg: 'rgba(255,61,113,0.2)'},
  };

  return (
    <div style={{position:'fixed',top:16,right:16,zIndex:10000,display:'flex',flexDirection:'column',gap:8,width:380,pointerEvents:'none'}}>
      {toasts.map(t => {
        const cfg = severityConfig[t.severity] || severityConfig.info;
        return (
          <div key={t.id} style={{
            background: '#0F1D32',
            border: `1px solid ${cfg.border}`,
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            pointerEvents: 'auto',
            transform: t.entering ? 'translateX(100%)' : t.exiting ? 'translateX(120%)' : 'translateX(0)',
            opacity: t.exiting ? 0 : 1,
            transition: 'all 300ms cubic-bezier(0.22,1,0.36,1)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{width:32,height:32,borderRadius:8,background:cfg.iconBg,display:'flex',alignItems:'center',justifyContent:'center',color:cfg.color,fontWeight:700,fontSize:14,flexShrink:0}}>{cfg.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:'#F0F4F8',marginBottom:2}}>{t.summary}</div>
              {t.detail && <div style={{fontSize:12,color:'#829AB1',lineHeight:1.4}}>{t.detail}</div>}
            </div>
            <div onClick={()=>onClose(t.id)} style={{cursor:'pointer',color:'#627D98',padding:2,flexShrink:0,marginTop:2}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══ MODAL SYSTEM ═══════════════════════════════════ */
function DModal({open, onClose, title, subtitle, children, footer, width=520, severity}) {
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

  const severityColors = {
    success: '#00C853', warning: '#FFB300', error: '#FF3D71', info: '#2599D5',
  };
  const accentColor = severity ? severityColors[severity] : null;

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',
      background: animIn ? 'rgba(10,22,40,0.75)' : 'rgba(10,22,40,0)',
      backdropFilter: animIn ? 'blur(8px)' : 'blur(0px)',
      transition:'all 250ms',
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width,maxWidth:'90vw',maxHeight:'85vh',
        background:'#0F1D32',
        border:'1px solid rgba(37,153,213,0.12)',
        borderRadius:16,
        boxShadow:'0 24px 80px rgba(0,0,0,0.5)',
        display:'flex',flexDirection:'column',
        transform: animIn ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
        opacity: animIn ? 1 : 0,
        transition: 'all 250ms cubic-bezier(0.22,1,0.36,1)',
        overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{padding:'20px 24px 16px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',borderBottom:'1px solid rgba(37,153,213,0.08)'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            {accentColor && <div style={{width:36,height:36,borderRadius:10,background:`${accentColor}18`,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {severity==='success' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              {severity==='warning' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
              {severity==='error' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
              {severity==='info' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>}
            </div>}
            <div>
              <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:16,fontWeight:700,color:'#F0F4F8',textTransform:'uppercase'}}>{title}</div>
              {subtitle && <div style={{fontSize:12,color:'#829AB1',marginTop:2}}>{subtitle}</div>}
            </div>
          </div>
          <div onClick={onClose} style={{cursor:'pointer',color:'#627D98',padding:4,borderRadius:6,transition:'all 150ms'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(37,153,213,0.08)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
        </div>
        {/* Body */}
        <div style={{padding:'20px 24px',overflow:'auto',flex:1,fontSize:14,color:'#BCCCDC',lineHeight:1.6}}>
          {children}
        </div>
        {/* Footer */}
        {footer && <div style={{padding:'16px 24px',borderTop:'1px solid rgba(37,153,213,0.08)',display:'flex',justifyContent:'flex-end',gap:10}}>
          {footer}
        </div>}
      </div>
    </div>
  );
}

/* ═══ CONFIRMATION DIALOG ════════════════════════════ */
function DConfirmDialog({open, onClose, onConfirm, title='Confirmar', message, severity='warning', confirmLabel='Confirmar', cancelLabel='Cancelar'}) {
  return (
    <DModal open={open} onClose={onClose} title={title} severity={severity} width={440}
      footer={<>
        <DBtn variant="secondary" onClick={onClose}>{cancelLabel}</DBtn>
        <DBtn variant={severity==='error'?'danger':'primary'} onClick={()=>{onConfirm&&onConfirm();onClose()}}>{confirmLabel}</DBtn>
      </>}>
      <div style={{textAlign:'center',padding:'8px 0'}}>
        <div style={{fontSize:14,color:'#BCCCDC',lineHeight:1.6}}>{message}</div>
      </div>
    </DModal>
  );
}

/* ═══ INLINE MESSAGES ════════════════════════════════ */
function DInlineMessage({severity='info', text, detail, closable=true, onClose, icon, style:extraStyle}) {
  const [visible, setVisible] = useState(true);
  const cfg = {
    success: {bg:'rgba(0,200,83,0.08)', border:'rgba(0,200,83,0.20)', color:'#00C853',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>},
    info: {bg:'rgba(37,153,213,0.08)', border:'rgba(37,153,213,0.20)', color:'#2599D5',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>},
    warn: {bg:'rgba(255,179,0,0.08)', border:'rgba(255,179,0,0.20)', color:'#FFB300',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
    error: {bg:'rgba(255,61,113,0.08)', border:'rgba(255,61,113,0.20)', color:'#FF3D71',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>},
  };
  const c = cfg[severity] || cfg.info;
  if (!visible) return null;
  return (
    <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'12px 16px',borderRadius:10,background:c.bg,border:`1px solid ${c.border}`,transition:'all 200ms',...(extraStyle||{})}}>
      <span style={{color:c.color,flexShrink:0,marginTop:1}}>{icon||c.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:c.color}}>{text}</div>
        {detail && <div style={{fontSize:12,color:'#829AB1',marginTop:2,lineHeight:1.4}}>{detail}</div>}
      </div>
      {closable && <div onClick={()=>{setVisible(false);onClose&&onClose()}} style={{cursor:'pointer',color:'#627D98',padding:2,flexShrink:0}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </div>}
    </div>
  );
}

/* ═══ DEMO SCREEN ════════════════════════════════════ */
function OverlaysScreen() {
  const toastCtx = useContext(ToastContext);
  const [basicModal, setBasicModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const showToast = (sev) => {
    const msgs = {
      success: {summary:'Sesión guardada',detail:'Los datos de la sesión CMJ se exportaron correctamente.'},
      info: {summary:'Dispositivo sincronizado',detail:'ArgFit Jump 2 (AF-J2-001) se conectó vía BLE.'},
      warn: {summary:'Batería baja',detail:'El dispositivo AF-J2-003 tiene 15% de batería restante.'},
      error: {summary:'Error de conexión',detail:'No se pudo conectar con el servidor. Reintentando...'},
    };
    toastCtx?.addToast({severity:sev,...msgs[sev]});
  };

  return (
    <div style={{padding:24,overflow:'auto',flex:1}}>
      {/* ── Inline Messages ── */}
      <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",marginBottom:16,textTransform:'uppercase'}}>Mensajes Inline</div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:32,maxWidth:720}}>
        <DInlineMessage severity="info" text="Sincronización en progreso" detail="El dispositivo ArgFit Jump 2 se está sincronizando. Esto puede tomar unos segundos." closable={false} />
        <DInlineMessage severity="success" text="Firmware actualizado" detail="El dispositivo AF-J2-001 se actualizó correctamente a la versión 3.2.1." />
        <DInlineMessage severity="warn" text="Sesión sin finalizar" detail="Existe una sesión de entrenamiento sin guardar del 17 May. Los datos pueden perderse." />
        <DInlineMessage severity="error" text="Error de calibración" detail="No se pudo calibrar el sensor de fuerza. Verificá la conexión y reintentá." />
      </div>

      {/* ── Toasts ── */}
      <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",marginBottom:16,textTransform:'uppercase'}}>Toasts (Notificaciones)</div>
      <div style={{display:'flex',gap:8,marginBottom:32,flexWrap:'wrap'}}>
        <DBtn onClick={()=>showToast('success')} variant="secondary" size="sm" icon={<span style={{color:'#00C853'}}>●</span>}>Success</DBtn>
        <DBtn onClick={()=>showToast('info')} variant="secondary" size="sm" icon={<span style={{color:'#2599D5'}}>●</span>}>Info</DBtn>
        <DBtn onClick={()=>showToast('warn')} variant="secondary" size="sm" icon={<span style={{color:'#FFB300'}}>●</span>}>Warning</DBtn>
        <DBtn onClick={()=>showToast('error')} variant="secondary" size="sm" icon={<span style={{color:'#FF3D71'}}>●</span>}>Error</DBtn>
        <DBtn onClick={()=>toastCtx?.addToast({severity:'info',summary:'Persistente',detail:'Este toast no desaparece automáticamente.',sticky:true})} variant="secondary" size="sm">Sticky</DBtn>
      </div>

      {/* ── Modals ── */}
      <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",marginBottom:16,textTransform:'uppercase'}}>Modales (Diálogos)</div>
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        <DBtn onClick={()=>setBasicModal(true)} variant="secondary" size="sm">Modal básico</DBtn>
        <DBtn onClick={()=>setFormModal(true)} variant="secondary" size="sm">Modal con formulario</DBtn>
        <DBtn onClick={()=>setSuccessModal(true)} variant="secondary" size="sm" icon={<span style={{color:'#00C853'}}>●</span>}>Éxito</DBtn>
        <DBtn onClick={()=>setConfirmDel(true)} variant="danger" size="sm">Eliminar atleta</DBtn>
      </div>

      {/* Basic modal */}
      <DModal open={basicModal} onClose={()=>setBasicModal(false)} title="Detalles del dispositivo" subtitle="ArgFit Jump 2 — AF-J2-001"
        footer={<><DBtn variant="secondary" onClick={()=>setBasicModal(false)}>Cerrar</DBtn><DBtn>Configurar</DBtn></>}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {[['Firmware','v3.2.1'],['Batería','87%'],['Último sync','Hace 2 min'],['Atleta asignado','María García'],['Protocolo','BLE 5.0'],['MAC','AA:BB:CC:DD:EE:FF']].map(([l,v])=>(
            <div key={l}><div style={{fontSize:11,color:'#627D98',fontWeight:500,letterSpacing:'0.04em',textTransform:'uppercase',marginBottom:4}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:'#F0F4F8'}}>{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:20}}>
          <DInlineMessage severity="info" text="Actualización disponible" detail="La versión 3.2.2 del firmware está disponible. Se recomienda actualizar." closable={false} />
        </div>
      </DModal>

      {/* Form modal */}
      <DModal open={formModal} onClose={()=>setFormModal(false)} title="Nuevo test rápido" subtitle="Configurá los parámetros para iniciar una sesión" severity="info" width={560}
        footer={<><DBtn variant="secondary" onClick={()=>setFormModal(false)}>Cancelar</DBtn><DBtn onClick={()=>{setFormModal(false);toastCtx?.addToast({severity:'success',summary:'Test creado',detail:'La sesión CMJ Bilateral está lista para iniciar.'})}}>Crear test</DBtn></>}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <DSelect label="Tipo de test" value="CMJ" options={['CMJ','SJ','DJ','Abalakov']} />
            <DSelect label="Lateralidad" value="bilateral" options={[{value:'bilateral',label:'Bilateral'},{value:'left',label:'Unilateral izq.'},{value:'right',label:'Unilateral der.'}]} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <DInput label="Cantidad de saltos" value="8" type="number" />
            <DInput label="Descanso entre saltos" value="3s" />
          </div>
          <DSelect label="Atleta" value="maria" options={[{value:'maria',label:'María García'},{value:'lucas',label:'Lucas Rodríguez'},{value:'santiago',label:'Santiago Pérez'}]} />
          <DInlineMessage severity="info" text="El dispositivo AF-J2-001 está conectado y listo." closable={false} />
        </div>
      </DModal>

      {/* Success modal */}
      <DModal open={successModal} onClose={()=>setSuccessModal(false)} title="Sesión completada" severity="success" width={440}
        footer={<><DBtn variant="secondary" onClick={()=>setSuccessModal(false)}>Cerrar</DBtn><DBtn onClick={()=>{setSuccessModal(false);toastCtx?.addToast({severity:'success',summary:'Reporte descargado',detail:'El archivo CSV fue generado exitosamente.'})}}>Descargar CSV</DBtn></>}>
        <div style={{textAlign:'center',padding:'12px 0'}}>
          <div style={{width:64,height:64,borderRadius:16,background:'rgba(0,200,83,0.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{fontSize:14,color:'#BCCCDC',lineHeight:1.6}}>Se registraron <strong style={{color:'#F0F4F8'}}>12 saltos</strong> en la sesión CMJ Bilateral.</div>
          <div style={{display:'flex',justifyContent:'center',gap:24,marginTop:16}}>
            {[['45.2 cm','Mejor'],['42.1 cm','Promedio'],['2847 N','Fuerza pico']].map(([v,l])=>(
              <div key={l}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:'#2599D5'}}>{v}</div><div style={{fontSize:11,color:'#627D98',marginTop:2}}>{l}</div></div>
            ))}
          </div>
        </div>
      </DModal>

      {/* Delete confirm */}
      <DConfirmDialog open={confirmDel} onClose={()=>setConfirmDel(false)} title="Eliminar atleta" severity="error"
        message="¿Estás seguro de que querés eliminar a Matías Fernández? Se borrarán todas sus sesiones y datos históricos. Esta acción no se puede deshacer."
        confirmLabel="Eliminar" cancelLabel="Cancelar"
        onConfirm={()=>toastCtx?.addToast({severity:'error',summary:'Atleta eliminado',detail:'Matías Fernández fue eliminado del sistema.'})} />
    </div>
  );
}

Object.assign(window, {ToastProvider, ToastContext, ToastContainer, DModal, DConfirmDialog, DInlineMessage, OverlaysScreen});

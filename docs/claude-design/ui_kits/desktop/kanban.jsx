/* ArgFit Desktop — Kanban Board for Training Routines */
const {useState, useRef, useCallback} = React;

/* ── Kanban Data ── */
const KANBAN_INITIAL = {
  columns: [
    {id:'backlog', title:'PENDIENTES', color:'#829AB1', items:[
      {id:'k1',title:'CMJ Bilateral — María García',category:'CMJ',priority:'high',athlete:'MG',date:'19 May',jumps:12,desc:'Test bilateral estándar pre-competencia'},
      {id:'k2',title:'Sprint 30m — Santiago Pérez',category:'Sprint',priority:'medium',athlete:'SP',date:'20 May',jumps:6,desc:'Evaluación velocidad máxima'},
      {id:'k3',title:'Abalakov — Paula Martínez',category:'Abalakov',priority:'low',athlete:'PM',date:'21 May',jumps:10,desc:'Control mensual de salto'},
    ]},
    {id:'ready', title:'LISTAS', color:'#2599D5', items:[
      {id:'k4',title:'Drop Jump — Valentina López',category:'DJ',priority:'high',athlete:'VL',date:'18 May',jumps:8,desc:'Recuperación post-lesión'},
      {id:'k5',title:'SJ Unilateral — Lucas Rodríguez',category:'SJ',priority:'medium',athlete:'LR',date:'18 May',jumps:10,desc:'Evaluación asimetría bilateral'},
    ]},
    {id:'progress', title:'EN CURSO', color:'#00D4FF', items:[
      {id:'k6',title:'CMJ Bilateral — Camila Torres',category:'CMJ',priority:'medium',athlete:'CT',date:'Hoy',jumps:8,desc:'Sesión de seguimiento semanal'},
    ]},
    {id:'done', title:'COMPLETADAS', color:'#00C853', items:[
      {id:'k7',title:'CMJ Bilateral — Nicolás Morales',category:'CMJ',priority:'low',athlete:'NM',date:'17 May',jumps:15,desc:'Test de control'},
      {id:'k8',title:'Drop Jump — Ana Gutiérrez',category:'DJ',priority:'medium',athlete:'AG',date:'16 May',jumps:8,desc:'Evaluación aterrizaje'},
    ]},
  ]
};

const priorityConfig = {
  high: {color:'#FF3D71',bg:'rgba(255,61,113,0.12)',label:'Alta'},
  medium: {color:'#FFB300',bg:'rgba(255,179,0,0.12)',label:'Media'},
  low: {color:'#00C853',bg:'rgba(0,200,83,0.12)',label:'Baja'},
};

const categoryColors = {
  CMJ:'#2599D5', SJ:'#00D4FF', DJ:'#FFB300', Sprint:'#FF3D71', Abalakov:'#00C853',
};

/* ── Kanban Card ── */
function KanbanCard({item, onDragStart, onDragEnd, onClick}) {
  const [hovered, setHovered] = useState(false);
  const p = priorityConfig[item.priority];
  const catColor = categoryColors[item.category] || '#2599D5';

  return (
    <div
      draggable
      onDragStart={e=>{e.dataTransfer.setData('text/plain',item.id);onDragStart&&onDragStart(item.id)}}
      onDragEnd={onDragEnd}
      onClick={()=>onClick&&onClick(item)}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{
        background: hovered ? '#152A42' : '#0F1D32',
        border:'1px solid rgba(37,153,213,0.08)',
        borderRadius:10,
        padding:'14px',
        cursor:'grab',
        transition:'all 150ms',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* Top row: category + priority */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.06em',color:catColor,background:`${catColor}15`,padding:'2px 8px',borderRadius:4}}>{item.category}</span>
        <span style={{fontSize:9,fontWeight:600,color:p.color,background:p.bg,padding:'2px 7px',borderRadius:4}}>{p.label}</span>
      </div>
      {/* Title */}
      <div style={{fontSize:13,fontWeight:600,color:'#F0F4F8',marginBottom:6,lineHeight:1.4}}>{item.title}</div>
      {item.desc && <div style={{fontSize:11,color:'#627D98',marginBottom:10,lineHeight:1.4}}>{item.desc}</div>}
      {/* Footer */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#2599D5,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#0A1628'}}>{item.athlete}</div>
          <span style={{fontSize:11,color:'#627D98'}}>{item.date}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:'#829AB1'}}>{item.jumps}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Kanban Column ── */
function KanbanColumn({column, onDrop, onDragStart, onDragEnd, onCardClick}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      onDragOver={e=>{e.preventDefault();setDragOver(true)}}
      onDragLeave={()=>setDragOver(false)}
      onDrop={e=>{e.preventDefault();setDragOver(false);const id=e.dataTransfer.getData('text/plain');onDrop(id,column.id)}}
      style={{
        flex:1,minWidth:260,maxWidth:340,
        background: dragOver ? 'rgba(37,153,213,0.04)' : 'transparent',
        borderRadius:12,
        border: dragOver ? '2px dashed rgba(37,153,213,0.25)' : '2px dashed transparent',
        padding:dragOver?'14px':'16px',
        transition:'all 200ms',
        display:'flex',flexDirection:'column',
      }}
    >
      {/* Column Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:column.color}}></div>
          <span style={{fontSize:12,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em'}}>{column.title}</span>
          <span style={{fontSize:11,fontWeight:600,color:'#486581',background:'rgba(37,153,213,0.08)',padding:'1px 7px',borderRadius:10}}>{column.items.length}</span>
        </div>
        <div style={{cursor:'pointer',color:'#627D98',padding:2}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </div>
      </div>
      {/* Cards */}
      <div style={{display:'flex',flexDirection:'column',gap:8,flex:1,minHeight:80}}>
        {column.items.map(item=>(
          <KanbanCard key={item.id} item={item} onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onCardClick} />
        ))}
      </div>
      {/* Add card */}
      <div style={{marginTop:8,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:8,border:'1px dashed rgba(37,153,213,0.12)',cursor:'pointer',color:'#627D98',fontSize:12,fontWeight:500,transition:'all 150ms'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(37,153,213,0.3)';e.currentTarget.style.color='#2599D5'}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(37,153,213,0.12)';e.currentTarget.style.color='#627D98'}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Agregar rutina
      </div>
    </div>
  );
}

/* ═══ KANBAN SCREEN ══════════════════════════════════ */
function KanbanScreen() {
  const [columns, setColumns] = useState(KANBAN_INITIAL.columns);
  const [draggingId, setDraggingId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [filterCat, setFilterCat] = useState('all');
  const toastCtx = useContext(ToastContext);

  const handleDrop = (itemId, targetColId) => {
    setColumns(prev => {
      let item = null;
      const without = prev.map(col => ({...col, items: col.items.filter(i => {
        if (i.id === itemId) { item = i; return false; }
        return true;
      })}));
      return without.map(col => col.id === targetColId ? {...col, items: [...col.items, item]} : col);
    });
    toastCtx?.addToast({severity:'info',summary:'Rutina movida',detail:`La rutina fue movida a la columna correspondiente.`,life:2500});
  };

  const filtered = filterCat === 'all' ? columns : columns.map(c => ({...c, items: c.items.filter(i => i.category === filterCat)}));

  const totalItems = columns.reduce((a,c)=>a+c.items.length,0);

  return (
    <div style={{padding:24,overflow:'auto',flex:1,display:'flex',flexDirection:'column'}}>
      {/* Toolbar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex',background:'#0F1D32',borderRadius:8,padding:2,border:'1px solid rgba(37,153,213,0.06)'}}>
            {['all','CMJ','SJ','DJ','Sprint','Abalakov'].map(cat=>(
              <button key={cat} onClick={()=>setFilterCat(cat)} style={{
                padding:'6px 14px',borderRadius:6,border:'none',fontSize:12,fontWeight:filterCat===cat?600:400,
                background:filterCat===cat?'#2599D5':'transparent',color:filterCat===cat?'#fff':'#627D98',
                cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all 200ms',
              }}>{cat==='all'?'Todas':cat}</button>
            ))}
          </div>
          <span style={{fontSize:12,color:'#627D98'}}>{totalItems} rutinas</span>
        </div>
        <DBtn icon={DI.plus}>Nueva rutina</DBtn>
      </div>

      {/* Kanban Board */}
      <div style={{display:'flex',gap:12,flex:1,minHeight:0,overflow:'auto',paddingBottom:8}}>
        {filtered.map(col=>(
          <KanbanColumn key={col.id} column={col} onDrop={handleDrop}
            onDragStart={setDraggingId} onDragEnd={()=>setDraggingId(null)}
            onCardClick={setDetailItem} />
        ))}
      </div>

      {/* Detail Modal */}
      <DModal open={!!detailItem} onClose={()=>setDetailItem(null)} title={detailItem?.title||''} subtitle={detailItem?.desc} width={500}
        footer={<><DBtn variant="secondary" onClick={()=>setDetailItem(null)}>Cerrar</DBtn><DBtn onClick={()=>{setDetailItem(null);toastCtx?.addToast({severity:'success',summary:'Rutina iniciada',detail:'La sesión de entrenamiento está en curso.'})}}>Iniciar sesión</DBtn></>}>
        {detailItem && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              {[['Categoría',detailItem.category,categoryColors[detailItem.category]],['Prioridad',priorityConfig[detailItem.priority].label,priorityConfig[detailItem.priority].color],['Saltos',detailItem.jumps,'#2599D5']].map(([l,v,c])=>(
                <div key={l} style={{background:'rgba(37,153,213,0.04)',borderRadius:8,padding:12,textAlign:'center'}}>
                  <div style={{fontSize:11,color:'#627D98',marginBottom:4}}>{l}</div>
                  <div style={{fontSize:15,fontWeight:700,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><div style={{fontSize:11,color:'#627D98',marginBottom:4}}>Fecha programada</div><div style={{fontSize:14,fontWeight:500}}>{detailItem.date}</div></div>
              <div><div style={{fontSize:11,color:'#627D98',marginBottom:4}}>Atleta</div><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#2599D5,#00D4FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#0A1628'}}>{detailItem.athlete}</div><span style={{fontSize:14,fontWeight:500}}>{detailItem.title.split('—')[1]?.trim()}</span></div></div>
            </div>
            <DInlineMessage severity="info" text="Dispositivo listo" detail="El ArgFit Jump 2 está conectado y calibrado para esta sesión." closable={false} />
          </div>
        )}
      </DModal>
    </div>
  );
}

Object.assign(window, {KanbanCard, KanbanColumn, KanbanScreen});

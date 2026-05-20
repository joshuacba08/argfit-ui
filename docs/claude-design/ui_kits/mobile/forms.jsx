/* ArgFit Mobile — Form Components & Screens (Ionic-style) */
const {useState, useRef} = React;

/* ═══ IONIC-STYLE FORM PRIMITIVES ════════════════════ */

/* ── Floating Label Input ─────────────────────────── */
function MInput({label, value, onChange, placeholder, type='text', error, icon, disabled}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const raised = focused || hasValue;
  const borderColor = error ? '#FF3D71' : focused ? '#2599D5' : 'rgba(37,153,213,0.10)';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <div style={{position:'relative',background:'#0F1D32',border:`1.5px solid ${borderColor}`,borderRadius:12,transition:'border-color 200ms'}}>
        {icon && <span style={{position:'absolute',left:14,top:16,color:focused?'#2599D5':'#627D98',transition:'color 200ms',display:'flex'}}>{icon}</span>}
        <label style={{
          position:'absolute',left:icon?42:14,
          top:raised?8:16,
          fontSize:raised?10:14,
          color:raised?(error?'#FF3D71':'#2599D5'):'#627D98',
          fontWeight:raised?600:400,
          transition:'all 200ms',pointerEvents:'none',
          letterSpacing:raised?'0.04em':'0',
        }}>{label}</label>
        <input
          type={type}
          value={value}
          onChange={e=>onChange&&onChange(e.target.value)}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          disabled={disabled}
          style={{
            width:'100%',background:'none',border:'none',outline:'none',
            padding:icon?'24px 14px 8px 42px':'24px 14px 8px 14px',
            color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:14,
          }}
        />
      </div>
      {error && <span style={{fontSize:11,color:'#FF3D71',paddingLeft:4}}>{error}</span>}
    </div>
  );
}

/* ── Ionic Select (List-style) ────────────────────── */
function MSelect({label, value, onChange, options=[]}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{position:'relative',background:'#0F1D32',border:`1.5px solid ${focused?'#2599D5':'rgba(37,153,213,0.10)'}`,borderRadius:12,transition:'border-color 200ms'}}>
      <label style={{
        position:'absolute',left:14,top:8,fontSize:10,
        color:focused?'#2599D5':'#829AB1',fontWeight:600,
        letterSpacing:'0.04em',transition:'color 200ms',pointerEvents:'none',
      }}>{label}</label>
      <select
        value={value}
        onChange={e=>onChange&&onChange(e.target.value)}
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
        style={{
          width:'100%',appearance:'none',background:'none',border:'none',outline:'none',
          padding:'24px 36px 8px 14px',
          color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:14,cursor:'pointer',
        }}
      >
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o} style={{background:'#0F1D32'}}>{o}</option>
          : <option key={o.value} value={o.value} style={{background:'#0F1D32'}}>{o.label}</option>
        )}
      </select>
      <span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#627D98'}}>{Icons.arrow}</span>
    </div>
  );
}

/* ── Ionic Toggle Row ─────────────────────────────── */
function MToggleRow({label, desc, on, onToggle, icon}) {
  return (
    <div onClick={onToggle} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',cursor:'pointer'}}>
      {icon && <span style={{color:on?'#2599D5':'#627D98',display:'flex'}}>{icon}</span>}
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:500,color:'#F0F4F8'}}>{label}</div>
        {desc && <div style={{fontSize:12,color:'#627D98',marginTop:2}}>{desc}</div>}
      </div>
      <div style={{width:44,height:24,borderRadius:12,background:on?'#2599D5':'#334E68',position:'relative',transition:'background 200ms',flexShrink:0}}>
        <div style={{position:'absolute',width:18,height:18,borderRadius:'50%',background:'#fff',top:3,left:on?23:3,transition:'left 200ms'}}></div>
      </div>
    </div>
  );
}

/* ── Ionic Textarea ───────────────────────────────── */
function MTextarea({label, value, onChange, placeholder, rows=3, maxLength}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const raised = focused || hasValue;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <div style={{position:'relative',background:'#0F1D32',border:`1.5px solid ${focused?'#2599D5':'rgba(37,153,213,0.10)'}`,borderRadius:12,transition:'border-color 200ms'}}>
        <label style={{
          position:'absolute',left:14,top:raised?8:14,fontSize:raised?10:14,
          color:raised?'#2599D5':'#627D98',fontWeight:raised?600:400,
          transition:'all 200ms',pointerEvents:'none',letterSpacing:raised?'0.04em':'0',
        }}>{label}</label>
        <textarea
          value={value}
          onChange={e=>onChange&&onChange(e.target.value)}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          rows={rows}
          maxLength={maxLength}
          style={{
            width:'100%',background:'none',border:'none',outline:'none',resize:'none',
            padding:'26px 14px 10px 14px',
            color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:14,lineHeight:1.5,
          }}
        />
      </div>
      {maxLength && <span style={{fontSize:10,color:'#627D98',textAlign:'right',paddingRight:4}}>{(value||'').length}/{maxLength}</span>}
    </div>
  );
}

/* ── Ionic Radio Group ────────────────────────────── */
function MRadioGroup({label, options=[], value, onChange}) {
  return (
    <div>
      {label && <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>{label}</div>}
      <div style={{background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',overflow:'hidden'}}>
        {options.map((o,i) => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          const selected = value === val;
          return (
            <div key={val} onClick={()=>onChange&&onChange(val)} style={{
              display:'flex',alignItems:'center',gap:12,padding:'14px 16px',
              borderBottom:i<options.length-1?'1px solid rgba(37,153,213,0.06)':'none',
              cursor:'pointer',
            }}>
              <div style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${selected?'#2599D5':'#486581'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 150ms'}}>
                {selected && <div style={{width:10,height:10,borderRadius:'50%',background:'#2599D5'}}></div>}
              </div>
              <span style={{fontSize:14,color:selected?'#F0F4F8':'#BCCCDC',fontWeight:selected?500:400}}>{lbl}</span>
              {selected && <span style={{marginLeft:'auto',color:'#2599D5'}}>{Icons.check}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Ionic Checkbox List ──────────────────────────── */
function MCheckboxList({label, options=[], values=[], onChange}) {
  const toggle = (val) => {
    if (values.includes(val)) onChange(values.filter(v => v !== val));
    else onChange([...values, val]);
  };
  return (
    <div>
      {label && <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>{label}</div>}
      <div style={{background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',overflow:'hidden'}}>
        {options.map((o,i) => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          const checked = values.includes(val);
          return (
            <div key={val} onClick={()=>toggle(val)} style={{
              display:'flex',alignItems:'center',gap:12,padding:'14px 16px',
              borderBottom:i<options.length-1?'1px solid rgba(37,153,213,0.06)':'none',
              cursor:'pointer',
            }}>
              <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${checked?'#2599D5':'#486581'}`,background:checked?'#2599D5':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 150ms'}}>
                {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span style={{fontSize:14,color:checked?'#F0F4F8':'#BCCCDC',fontWeight:checked?500:400}}>{lbl}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Ionic Slider Row ─────────────────────────────── */
function MSliderRow({label, value, onChange, min=0, max=100, step=1, unit, icon}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',padding:'14px 16px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {icon && <span style={{color:'#2599D5',display:'flex'}}>{icon}</span>}
          <span style={{fontSize:14,fontWeight:500,color:'#F0F4F8'}}>{label}</span>
        </div>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'#2599D5',fontWeight:600}}>{value}{unit}</span>
      </div>
      <div style={{position:'relative',height:28,display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',height:4,borderRadius:2,background:'#152A42',width:'100%'}}></div>
        <div style={{position:'absolute',height:4,borderRadius:2,background:'#2599D5',width:`${pct}%`}}></div>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e=>onChange&&onChange(Number(e.target.value))}
          style={{position:'absolute',width:'100%',height:28,opacity:0,cursor:'pointer',margin:0}}
        />
        <div style={{position:'absolute',left:`calc(${pct}% - 10px)`,width:20,height:20,borderRadius:'50%',background:'#2599D5',border:'3px solid #0F1D32',boxShadow:'0 0 8px rgba(37,153,213,0.3)',pointerEvents:'none'}}></div>
      </div>
    </div>
  );
}

/* ── Mobile Button ────────────────────────────────── */
function MBtn({children, variant='primary', icon, onClick, block}) {
  const mBtnStyles = {
    primary: {bg:'#2599D5',color:'#fff',border:'none'},
    secondary: {bg:'#152A42',color:'#BCCCDC',border:'1px solid rgba(37,153,213,0.15)'},
    danger: {bg:'rgba(255,61,113,0.1)',color:'#FF3D71',border:'1px solid rgba(255,61,113,0.2)'},
    ghost: {bg:'transparent',color:'#829AB1',border:'none'},
  };
  const s = mBtnStyles[variant] || mBtnStyles.primary;
  return (
    <button onClick={onClick} style={{
      display:'flex',alignItems:'center',justifyContent:'center',gap:8,
      padding:'14px 24px',borderRadius:12,
      background:s.bg,color:s.color,border:s.border,
      fontSize:15,fontWeight:600,fontFamily:"'Outfit',sans-serif",
      cursor:'pointer',transition:'all 150ms',
      width:block?'100%':undefined,
    }}>{icon}{children}</button>
  );
}


/* ═══ MOBILE FORMS SCREENS ═══════════════════════════ */

function MobileFormsScreen({subScreen, onNavigate}) {
  const [sub, setSub] = useState(subScreen || 'menu');

  if (sub === 'athlete') return <MobileAthleteForm onBack={()=>setSub('menu')} />;
  if (sub === 'test') return <MobileTestConfig onBack={()=>setSub('menu')} />;
  if (sub === 'export') return <MobileExportForm onBack={()=>setSub('menu')} />;

  /* ── Menu ── */
  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      <div style={{padding:'8px 0 16px'}}>
        <div style={{fontSize:12,color:'#829AB1',fontWeight:500}}>Formularios</div>
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:20,fontWeight:700,marginTop:2,textTransform:'uppercase'}}>Ejemplos</div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[
          {id:'athlete',label:'Nuevo atleta',desc:'Registro completo con datos personales',icon:Icons.user,color:'#2599D5'},
          {id:'test',label:'Config. de test',desc:'Parámetros y ajustes de sesión',icon:Icons.zap,color:'#00D4FF'},
          {id:'export',label:'Exportación',desc:'Formato y destino de reportes',icon:Icons.download,color:'#00C853'},
        ].map(item => (
          <div key={item.id} onClick={()=>setSub(item.id)} style={{display:'flex',alignItems:'center',gap:14,padding:'16px',background:'#0F1D32',borderRadius:12,border:'1px solid rgba(37,153,213,0.08)',cursor:'pointer',transition:'all 150ms'}}>
            <div style={{width:44,height:44,borderRadius:12,background:`${item.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:item.color}}>{item.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:600}}>{item.label}</div>
              <div style={{fontSize:12,color:'#829AB1',marginTop:2}}>{item.desc}</div>
            </div>
            <span style={{color:'#486581'}}>{Icons.arrow}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Back Header ──────────────────────────────────── */
function MobileFormHeader({title, onBack}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0 16px'}}>
      <div onClick={onBack} style={{width:36,height:36,borderRadius:10,background:'rgba(37,153,213,0.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#2599D5'}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:18,fontWeight:700,textTransform:'uppercase'}}>{title}</div>
    </div>
  );
}

/* ── Nuevo Atleta (Mobile) ────────────────────────── */
function MobileAthleteForm({onBack}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sport, setSport] = useState('Voleibol');
  const [team, setTeam] = useState('');
  const [weight, setWeight] = useState('68');
  const [height, setHeight] = useState('172');
  const [gender, setGender] = useState('female');
  const [notes, setNotes] = useState('');
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      <MobileFormHeader title="Nuevo atleta" onBack={onBack} />

      {/* Personal data */}
      <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Datos personales</div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
        <MInput label="Nombre completo" value={name} onChange={setName} icon={Icons.user} />
        <MInput label="Email" value={email} onChange={setEmail} type="email" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        } />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <MInput label="Peso (kg)" value={weight} onChange={setWeight} type="number" />
          <MInput label="Altura (cm)" value={height} onChange={setHeight} type="number" />
        </div>
      </div>

      {/* Gender */}
      <MRadioGroup label="Género" value={gender} onChange={setGender} options={[
        {value:'female',label:'Femenino'},
        {value:'male',label:'Masculino'},
        {value:'other',label:'Otro'},
      ]} />

      {/* Sport */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Deporte</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <MSelect label="Deporte" value={sport} onChange={setSport}
            options={['Voleibol','Fútbol','Rugby','Básquet','Hockey','Handball','Atletismo']} />
          <MInput label="Equipo / Club" value={team} onChange={setTeam} />
        </div>
      </div>

      {/* Notes */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Notas</div>
        <MTextarea label="Observaciones" value={notes} onChange={setNotes} rows={3} maxLength={300} />
      </div>

      {/* Toggle */}
      <div style={{marginTop:16}}>
        <MToggleRow label="Notificaciones" desc="Alertas de sesiones y reportes" on={notifications} onToggle={()=>setNotifications(!notifications)} icon={Icons.bell} />
      </div>

      {/* Actions */}
      <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:24}}>
        <MBtn block icon={Icons.check}>Registrar atleta</MBtn>
        <MBtn variant="ghost" block onClick={onBack}>Cancelar</MBtn>
      </div>
    </div>
  );
}

/* ── Config de Test (Mobile) ──────────────────────── */
function MobileTestConfig({onBack}) {
  const [testType, setTestType] = useState(0);
  const [threshold, setThreshold] = useState(50);
  const [jumpCount, setJumpCount] = useState(8);
  const [bleAuto, setBleAuto] = useState(true);
  const [audio, setAudio] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [laterality, setLaterality] = useState('bilateral');

  const testTypes = ['CMJ','SJ','DJ','Abalakov'];

  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      <MobileFormHeader title="Config. de test" onBack={onBack} />

      {/* Test Type Segment */}
      <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Tipo de test</div>
      <div style={{display:'flex',background:'#0F1D32',borderRadius:10,padding:3,border:'1px solid rgba(37,153,213,0.06)',marginBottom:20}}>
        {testTypes.map((t,i) => (
          <div key={t} onClick={()=>setTestType(i)} style={{
            flex:1,padding:'10px 6px',borderRadius:8,textAlign:'center',fontSize:13,fontWeight:testType===i?600:400,
            color:testType===i?'#fff':'#627D98',background:testType===i?'#2599D5':'transparent',
            cursor:'pointer',transition:'all 200ms',
          }}>{t}</div>
        ))}
      </div>

      {/* Laterality */}
      <MRadioGroup label="Lateralidad" value={laterality} onChange={setLaterality} options={[
        {value:'bilateral',label:'Bilateral'},
        {value:'left',label:'Unilateral izquierdo'},
        {value:'right',label:'Unilateral derecho'},
      ]} />

      {/* Parameters */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Parámetros</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <MSliderRow label="Umbral de detección" value={threshold} onChange={setThreshold} min={10} max={100} step={5} unit="N" icon={Icons.zap} />
          <MSliderRow label="Cantidad de saltos" value={jumpCount} onChange={setJumpCount} min={1} max={30} step={1} unit="" icon={Icons.chart} />
        </div>
      </div>

      {/* Toggles */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Feedback</div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <MToggleRow label="Auto-conectar BLE" desc="Conectar al abrir" on={bleAuto} onToggle={()=>setBleAuto(!bleAuto)} icon={Icons.bluetooth} />
          <MToggleRow label="Audio feedback" desc="Sonido al detectar salto" on={audio} onToggle={()=>setAudio(!audio)} />
          <MToggleRow label="Vibración" on={vibration} onToggle={()=>setVibration(!vibration)} />
        </div>
      </div>

      {/* Actions */}
      <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:24}}>
        <MBtn block>Guardar configuración</MBtn>
        <MBtn variant="secondary" block onClick={onBack}>Restaurar defaults</MBtn>
      </div>
    </div>
  );
}

/* ── Exportación (Mobile) ─────────────────────────── */
function MobileExportForm({onBack}) {
  const [range, setRange] = useState('month');
  const [formats, setFormats] = useState(['csv']);
  const [shareCoach, setShareCoach] = useState(true);
  const [email, setEmail] = useState('');

  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      <MobileFormHeader title="Exportar datos" onBack={onBack} />

      {/* Range */}
      <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Rango</div>
      <MSelect label="Período" value={range} onChange={setRange} options={[
        {value:'session',label:'Última sesión'},
        {value:'week',label:'Última semana'},
        {value:'month',label:'Último mes'},
        {value:'quarter',label:'Último trimestre'},
      ]} />

      {/* Format checkboxes */}
      <div style={{marginTop:20}}>
        <MCheckboxList label="Formato" values={formats} onChange={setFormats} options={[
          {value:'csv',label:'CSV — Datos tabulares'},
          {value:'pdf',label:'PDF — Reporte visual'},
          {value:'xlsx',label:'XLSX — Excel'},
        ]} />
      </div>

      {/* Share */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:12,fontWeight:600,color:'#829AB1',letterSpacing:'0.04em',marginBottom:8,textTransform:'uppercase'}}>Compartir</div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <MToggleRow label="Enviar al cuerpo técnico" desc="Copia automática por email" on={shareCoach} onToggle={()=>setShareCoach(!shareCoach)} icon={Icons.share} />
          <MInput label="Email adicional" value={email} onChange={setEmail} type="email" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          } />
        </div>
      </div>

      {/* Actions */}
      <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:24}}>
        <MBtn block icon={Icons.download}>Generar reporte</MBtn>
        <MBtn variant="ghost" block onClick={onBack}>Cancelar</MBtn>
      </div>
    </div>
  );
}

Object.assign(window, {
  MInput, MSelect, MToggleRow, MTextarea, MRadioGroup, MCheckboxList, MSliderRow, MBtn,
  MobileFormsScreen, MobileFormHeader, MobileAthleteForm, MobileTestConfig, MobileExportForm,
});

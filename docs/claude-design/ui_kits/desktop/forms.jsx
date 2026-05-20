/* ArgFit Desktop — Form Components & Screen (PrimeNG + TailwindCSS style) */
const {useState, useRef} = React;

/* ═══ FORM PRIMITIVES ════════════════════════════════ */

/* ── Text Input ───────────────────────────────────── */
function DInput({label, value, onChange, placeholder, type='text', error, success, helpText, icon, disabled, required, size='md'}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? '#FF3D71' : success ? '#00C853' : focused ? '#2599D5' : 'rgba(37,153,213,0.15)';
  const boxShadow = focused ? (error ? '0 0 0 3px rgba(255,61,113,0.12)' : '0 0 0 3px rgba(37,153,213,0.12)') : 'none';
  const pad = size === 'sm' ? '8px 12px' : '10px 14px';
  const fs = size === 'sm' ? 13 : 14;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,flex:1,minWidth:0}}>
      {label && <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em',display:'flex',alignItems:'center',gap:4}}>
        {label}{required && <span style={{color:'#FF3D71'}}>*</span>}
      </label>}
      <div style={{position:'relative',display:'flex',alignItems:'center'}}>
        {icon && <span style={{position:'absolute',left:12,color:'#627D98',display:'flex',pointerEvents:'none'}}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e=>onChange&&onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          style={{
            width:'100%',
            background: disabled ? '#0C1829' : 'rgba(15,29,50,0.8)',
            border:`1.5px solid ${borderColor}`,
            borderRadius:8,
            padding:pad,
            paddingLeft: icon ? 38 : undefined,
            color: disabled ? '#627D98' : '#F0F4F8',
            fontFamily:"'Outfit',sans-serif",
            fontSize:fs,
            outline:'none',
            transition:'border-color 200ms, box-shadow 200ms',
            boxShadow,
            opacity: disabled ? 0.6 : 1,
          }}
        />
      </div>
      {(error || helpText) && <span style={{fontSize:11,color:error?'#FF3D71':'#627D98'}}>{error || helpText}</span>}
    </div>
  );
}

/* ── Textarea ─────────────────────────────────────── */
function DTextarea({label, value, onChange, placeholder, rows=3, error, helpText, required, maxLength}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? '#FF3D71' : focused ? '#2599D5' : 'rgba(37,153,213,0.15)';
  const boxShadow = focused ? '0 0 0 3px rgba(37,153,213,0.12)' : 'none';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,flex:1,minWidth:0}}>
      {label && <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em',display:'flex',alignItems:'center',gap:4}}>
        {label}{required && <span style={{color:'#FF3D71'}}>*</span>}
      </label>}
      <textarea
        value={value}
        onChange={e=>onChange&&onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
        style={{
          width:'100%',
          background:'rgba(15,29,50,0.8)',
          border:`1.5px solid ${borderColor}`,
          borderRadius:8,
          padding:'10px 14px',
          color:'#F0F4F8',
          fontFamily:"'Outfit',sans-serif",
          fontSize:14,
          outline:'none',
          resize:'vertical',
          transition:'border-color 200ms, box-shadow 200ms',
          boxShadow,
          lineHeight:1.5,
        }}
      />
      <div style={{display:'flex',justifyContent:'space-between'}}>
        {(error || helpText) && <span style={{fontSize:11,color:error?'#FF3D71':'#627D98'}}>{error || helpText}</span>}
        {maxLength && <span style={{fontSize:11,color:'#627D98',marginLeft:'auto'}}>{(value||'').length}/{maxLength}</span>}
      </div>
    </div>
  );
}

/* ── Select ───────────────────────────────────────── */
function DSelect({label, value, onChange, options=[], placeholder, error, required, size='md'}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? '#FF3D71' : focused ? '#2599D5' : 'rgba(37,153,213,0.15)';
  const pad = size === 'sm' ? '8px 32px 8px 12px' : '10px 36px 10px 14px';
  const fs = size === 'sm' ? 13 : 14;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,flex:1,minWidth:0}}>
      {label && <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em',display:'flex',alignItems:'center',gap:4}}>
        {label}{required && <span style={{color:'#FF3D71'}}>*</span>}
      </label>}
      <div style={{position:'relative'}}>
        <select
          value={value}
          onChange={e=>onChange&&onChange(e.target.value)}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          style={{
            width:'100%',
            appearance:'none',
            background:'rgba(15,29,50,0.8)',
            border:`1.5px solid ${borderColor}`,
            borderRadius:8,
            padding:pad,
            color: value ? '#F0F4F8' : '#627D98',
            fontFamily:"'Outfit',sans-serif",
            fontSize:fs,
            outline:'none',
            cursor:'pointer',
            transition:'border-color 200ms',
          }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => typeof o === 'string'
            ? <option key={o} value={o}>{o}</option>
            : <option key={o.value} value={o.value}>{o.label}</option>
          )}
        </select>
        <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#627D98'}}>{DI.chevDown}</span>
      </div>
      {error && <span style={{fontSize:11,color:'#FF3D71'}}>{error}</span>}
    </div>
  );
}

/* ── Checkbox ─────────────────────────────────────── */
function DCheckbox({checked, onChange, label, disabled}) {
  return (
    <div onClick={()=>!disabled && onChange && onChange(!checked)} style={{display:'flex',alignItems:'center',gap:10,cursor:disabled?'default':'pointer',opacity:disabled?0.5:1}}>
      <div style={{
        width:18,height:18,borderRadius:4,
        border:`2px solid ${checked?'#2599D5':'#486581'}`,
        background:checked?'#2599D5':'transparent',
        display:'flex',alignItems:'center',justifyContent:'center',
        transition:'all 150ms',flexShrink:0,
      }}>
        {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      {label && <span style={{fontSize:14,color:disabled?'#627D98':'#BCCCDC'}}>{label}</span>}
    </div>
  );
}

/* ── Radio ────────────────────────────────────────── */
function DRadio({selected, onChange, label, value, name}) {
  const isSelected = selected === value;
  return (
    <div onClick={()=>onChange&&onChange(value)} style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
      <div style={{
        width:18,height:18,borderRadius:'50%',
        border:`2px solid ${isSelected?'#2599D5':'#486581'}`,
        display:'flex',alignItems:'center',justifyContent:'center',
        transition:'all 150ms',flexShrink:0,
      }}>
        {isSelected && <div style={{width:8,height:8,borderRadius:'50%',background:'#2599D5'}}></div>}
      </div>
      {label && <span style={{fontSize:14,color:'#BCCCDC'}}>{label}</span>}
    </div>
  );
}

/* ── Toggle ───────────────────────────────────────── */
function DToggle({on, onToggle, label, desc}) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
      {(label || desc) && <div>
        {label && <div style={{fontSize:14,fontWeight:500,color:'#F0F4F8'}}>{label}</div>}
        {desc && <div style={{fontSize:12,color:'#627D98',marginTop:2}}>{desc}</div>}
      </div>}
      <div onClick={onToggle} style={{width:44,height:24,borderRadius:12,background:on?'#2599D5':'#334E68',position:'relative',cursor:'pointer',transition:'background 200ms',flexShrink:0}}>
        <div style={{position:'absolute',width:18,height:18,borderRadius:'50%',background:'#fff',top:3,left:on?23:3,transition:'left 200ms'}}></div>
      </div>
    </div>
  );
}

/* ── Slider ───────────────────────────────────────── */
function DSlider({label, value, onChange, min=0, max=100, step=1, unit, helpText}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,flex:1}}>
      {label && <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em'}}>{label}</label>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'#2599D5',fontWeight:600}}>{value}{unit}</span>
      </div>}
      <div style={{position:'relative',height:24,display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',height:4,borderRadius:2,background:'#152A42',width:'100%'}}></div>
        <div style={{position:'absolute',height:4,borderRadius:2,background:'#2599D5',width:`${pct}%`}}></div>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e=>onChange&&onChange(Number(e.target.value))}
          style={{position:'absolute',width:'100%',height:24,opacity:0,cursor:'pointer',margin:0}}
        />
        <div style={{position:'absolute',left:`calc(${pct}% - 8px)`,width:16,height:16,borderRadius:'50%',background:'#2599D5',border:'2px solid #0F1D32',boxShadow:'0 0 8px rgba(37,153,213,0.3)',pointerEvents:'none'}}></div>
      </div>
      {helpText && <span style={{fontSize:11,color:'#627D98'}}>{helpText}</span>}
    </div>
  );
}

/* ── File Upload ──────────────────────────────────── */
function DFileUpload({label, helpText, accept, onFile}) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);
  const handleFile = (f) => { setFileName(f.name); onFile && onFile(f); };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {label && <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em'}}>{label}</label>}
      <div
        onClick={()=>inputRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDragging(true)}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])}}
        style={{
          border:`2px dashed ${dragging?'#2599D5':'rgba(37,153,213,0.15)'}`,
          borderRadius:12,
          padding:'28px 20px',
          textAlign:'center',
          cursor:'pointer',
          background:dragging?'rgba(37,153,213,0.06)':'rgba(15,29,50,0.4)',
          transition:'all 200ms',
        }}
      >
        <input ref={inputRef} type="file" accept={accept} onChange={e=>{if(e.target.files[0]) handleFile(e.target.files[0])}} style={{display:'none'}} />
        <div style={{color:'#2599D5',marginBottom:8}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        {fileName
          ? <div style={{fontSize:13,color:'#F0F4F8',fontWeight:500}}>{fileName}</div>
          : <>
              <div style={{fontSize:13,color:'#BCCCDC'}}>Arrastrá un archivo o <span style={{color:'#2599D5',fontWeight:600}}>elegí uno</span></div>
              {helpText && <div style={{fontSize:11,color:'#627D98',marginTop:4}}>{helpText}</div>}
            </>
        }
      </div>
    </div>
  );
}

/* ── Chips Input ──────────────────────────────────── */
function DChips({label, values=[], onChange, placeholder, helpText}) {
  const [input, setInput] = useState('');
  const handleKey = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onChange([...values, input.trim()]);
      setInput('');
    }
  };
  const remove = (idx) => onChange(values.filter((_,i) => i !== idx));
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,flex:1}}>
      {label && <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em'}}>{label}</label>}
      <div style={{
        display:'flex',flexWrap:'wrap',gap:6,
        background:'rgba(15,29,50,0.8)',
        border:'1.5px solid rgba(37,153,213,0.15)',
        borderRadius:8,padding:'8px 10px',minHeight:42,alignItems:'center',
      }}>
        {values.map((v,i) => (
          <span key={i} style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(37,153,213,0.15)',color:'#57B0E7',borderRadius:6,padding:'3px 8px',fontSize:12,fontWeight:500}}>
            {v}
            <span onClick={()=>remove(i)} style={{cursor:'pointer',opacity:0.7,lineHeight:1}}>×</span>
          </span>
        ))}
        <input
          value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={values.length === 0 ? placeholder : ''}
          style={{background:'none',border:'none',outline:'none',color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:13,flex:1,minWidth:80}}
        />
      </div>
      {helpText && <span style={{fontSize:11,color:'#627D98'}}>{helpText}</span>}
    </div>
  );
}

/* ── Inline Number Stepper ────────────────────────── */
function DNumberStepper({label, value, onChange, min=0, max=999, step=1, unit}) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {label && <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em'}}>{label}</label>}
      <div style={{display:'flex',alignItems:'center',gap:0,background:'rgba(15,29,50,0.8)',border:'1.5px solid rgba(37,153,213,0.15)',borderRadius:8,overflow:'hidden',width:'fit-content'}}>
        <button onClick={()=>onChange&&onChange(Math.max(min, value-step))} style={{background:'none',border:'none',color:'#829AB1',padding:'8px 12px',cursor:'pointer',fontSize:16,fontFamily:"'Outfit',sans-serif",borderRight:'1px solid rgba(37,153,213,0.10)'}}>−</button>
        <span style={{padding:'8px 16px',fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:'#F0F4F8',fontWeight:500,minWidth:60,textAlign:'center'}}>{value}{unit}</span>
        <button onClick={()=>onChange&&onChange(Math.min(max, value+step))} style={{background:'none',border:'none',color:'#829AB1',padding:'8px 12px',cursor:'pointer',fontSize:16,fontFamily:"'Outfit',sans-serif",borderLeft:'1px solid rgba(37,153,213,0.10)'}}>+</button>
      </div>
    </div>
  );
}

/* ═══ FORMS SCREEN ═══════════════════════════════════ */
function FormsScreen() {
  /* Form state */
  const [name, setName] = useState('María García');
  const [email, setEmail] = useState('');
  const [sport, setSport] = useState('Voleibol');
  const [team, setTeam] = useState('');
  const [weight, setWeight] = useState(68);
  const [height, setHeight] = useState(172);
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState('female');
  const [notes, setNotes] = useState('');
  const [injuries, setInjuries] = useState(['Esguince tobillo izq. (2024)']);
  const [threshold, setThreshold] = useState(50);
  const [bleAuto, setBleAuto] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [exportCSV, setExportCSV] = useState(true);
  const [exportPDF, setExportPDF] = useState(false);
  const [shareCoach, setShareCoach] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Nuevo atleta', 'Configuración de test', 'Exportación'];

  return (
    <div style={{padding:24,overflow:'auto',flex:1,background:'radial-gradient(ellipse 80% 50% at 65% 5%, rgba(37,153,213,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 15% 85%, rgba(0,212,255,0.04) 0%, transparent 50%)'}}>
      {/* Tab Bar */}
      <div style={{display:'flex',gap:2,background:'#0F1D32',borderRadius:10,padding:3,border:'1px solid rgba(37,153,213,0.06)',marginBottom:24,width:'fit-content'}}>
        {tabs.map((t,i) => (
          <button key={t} onClick={()=>setActiveTab(i)} style={{
            padding:'9px 20px',borderRadius:8,border:'none',fontSize:13,fontWeight:activeTab===i?600:400,
            background:activeTab===i?'#2599D5':'transparent',color:activeTab===i?'#fff':'#627D98',
            cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all 200ms'
          }}>{t}</button>
        ))}
      </div>

      {/* ─── TAB 0: Nuevo Atleta ─── */}
      {activeTab === 0 && (
        <div style={{maxWidth:800}}>
          <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",marginBottom:4,textTransform:'uppercase'}}>Registrar nuevo atleta</div>
          <div style={{fontSize:13,color:'#627D98',marginBottom:24}}>Completá los datos del atleta para comenzar a trackear su rendimiento.</div>

          {/* Section: Datos personales */}
          <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',marginBottom:16,textTransform:'uppercase'}}>Datos personales</div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              <DInput label="Nombre completo" value={name} onChange={setName} placeholder="Nombre y apellido" required />
              <DInput label="Email" value={email} onChange={setEmail} placeholder="atleta@email.com" type="email" icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              } helpText="Se usará para enviar reportes" />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:16}}>
              <DNumberStepper label="Edad" value={age} onChange={setAge} min={10} max={99} unit=" años" />
              <DNumberStepper label="Peso" value={weight} onChange={setWeight} min={30} max={200} unit=" kg" />
              <DNumberStepper label="Altura" value={height} onChange={setHeight} min={100} max={250} unit=" cm" />
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em',marginBottom:8,display:'block'}}>Género</label>
              <div style={{display:'flex',gap:20}}>
                <DRadio selected={gender} onChange={setGender} value="female" label="Femenino" />
                <DRadio selected={gender} onChange={setGender} value="male" label="Masculino" />
                <DRadio selected={gender} onChange={setGender} value="other" label="Otro" />
              </div>
            </div>
          </div>

          {/* Section: Deporte */}
          <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',marginBottom:16,textTransform:'uppercase'}}>Deporte y equipo</div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
              <DSelect label="Deporte" value={sport} onChange={setSport} required
                options={['Voleibol','Fútbol','Rugby','Básquet','Hockey','Handball','Atletismo','Tenis','Natación']} />
              <DInput label="Equipo / Club" value={team} onChange={setTeam} placeholder="Nombre del club o selección" />
            </div>

            <DChips label="Lesiones previas" values={injuries} onChange={setInjuries} placeholder="Escribí y presioná Enter para agregar" helpText="Registrá lesiones relevantes para el seguimiento" />
          </div>

          {/* Section: Notas */}
          <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',marginBottom:16,textTransform:'uppercase'}}>Notas y archivos</div>

            <DTextarea label="Observaciones" value={notes} onChange={setNotes} placeholder="Notas sobre el atleta, objetivos, etc..." rows={3} maxLength={500} helpText="Información adicional para el equipo técnico" />

            <div style={{marginTop:16}}>
              <DFileUpload label="Foto de perfil" helpText="JPG, PNG — máx 2MB" accept="image/*" />
            </div>
          </div>

          {/* Actions */}
          <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:8}}>
            <DBtn variant="secondary">Cancelar</DBtn>
            <DBtn icon={DI.plus}>Registrar atleta</DBtn>
          </div>
        </div>
      )}

      {/* ─── TAB 1: Config de test ─── */}
      {activeTab === 1 && (
        <div style={{maxWidth:800}}>
          <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",marginBottom:4,textTransform:'uppercase'}}>Configuración de test</div>
          <div style={{fontSize:13,color:'#627D98',marginBottom:24}}>Ajustá los parámetros antes de iniciar una sesión de evaluación.</div>

          <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',marginBottom:16,textTransform:'uppercase'}}>Parámetros del test</div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              <DSelect label="Tipo de test" value="CMJ" options={[
                {value:'CMJ',label:'CMJ — Countermovement Jump'},
                {value:'SJ',label:'SJ — Squat Jump'},
                {value:'DJ',label:'DJ — Drop Jump'},
                {value:'ABK',label:'Abalakov'},
                {value:'SP',label:'Sprint'},
              ]} required />
              <DSelect label="Lateralidad" value="bilateral" options={[
                {value:'bilateral',label:'Bilateral'},
                {value:'left',label:'Unilateral izquierdo'},
                {value:'right',label:'Unilateral derecho'},
              ]} />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              <DNumberStepper label="Cantidad de saltos" value={8} min={1} max={50} />
              <DNumberStepper label="Descanso entre saltos" value={3} min={1} max={30} unit="s" />
            </div>

            <DSlider label="Umbral de detección" value={threshold} onChange={setThreshold} min={10} max={100} step={5} unit="N" helpText="Fuerza mínima para registrar un salto válido" />
          </div>

          <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',marginBottom:16,textTransform:'uppercase'}}>Dispositivo y feedback</div>

            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <DToggle on={bleAuto} onToggle={()=>setBleAuto(!bleAuto)} label="Auto-conectar BLE" desc="Conectar automáticamente al dispositivo más cercano" />
              <div style={{borderBottom:'1px solid rgba(37,153,213,0.06)'}}></div>
              <DToggle on={audioFeedback} onToggle={()=>setAudioFeedback(!audioFeedback)} label="Audio feedback" desc="Reproducir sonido al detectar cada salto" />
              <div style={{borderBottom:'1px solid rgba(37,153,213,0.06)'}}></div>
              <DToggle on={true} label="Vibración" desc="Vibrar el dispositivo móvil al registrar" />
            </div>
          </div>

          <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:8}}>
            <DBtn variant="secondary">Restaurar defaults</DBtn>
            <DBtn>Guardar configuración</DBtn>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Exportación ─── */}
      {activeTab === 2 && (
        <div style={{maxWidth:800}}>
          <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",marginBottom:4,textTransform:'uppercase'}}>Exportación de datos</div>
          <div style={{fontSize:13,color:'#627D98',marginBottom:24}}>Configurá el formato y destino de los reportes.</div>

          <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',marginBottom:16,textTransform:'uppercase'}}>Formato de reporte</div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              <DSelect label="Rango de fechas" value="month" options={[
                {value:'session',label:'Última sesión'},
                {value:'week',label:'Última semana'},
                {value:'month',label:'Último mes'},
                {value:'quarter',label:'Último trimestre'},
                {value:'custom',label:'Personalizado'},
              ]} />
              <DSelect label="Atleta" value="all" options={[
                {value:'all',label:'Todos los atletas'},
                {value:'maria',label:'María García'},
                {value:'lucas',label:'Lucas Rodríguez'},
                {value:'santiago',label:'Santiago Pérez'},
              ]} />
            </div>

            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,fontWeight:500,color:'#829AB1',letterSpacing:'0.02em',marginBottom:10,display:'block'}}>Formatos de exportación</label>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <DCheckbox checked={exportCSV} onChange={setExportCSV} label="CSV — Datos tabulares para análisis externo" />
                <DCheckbox checked={exportPDF} onChange={setExportPDF} label="PDF — Reporte visual con gráficos" />
                <DCheckbox checked={false} label="XLSX — Planilla de cálculo (Excel)" />
              </div>
            </div>
          </div>

          <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",color:'#829AB1',letterSpacing:'0.06em',marginBottom:16,textTransform:'uppercase'}}>Compartir</div>

            <DToggle on={shareCoach} onToggle={()=>setShareCoach(!shareCoach)} label="Enviar copia al cuerpo técnico" desc="Los entrenadores asignados recibirán el reporte por email" />

            <div style={{marginTop:16}}>
              <DInput label="Email adicional" value="" placeholder="coach@club.com.ar" type="email" helpText="Opcional — se enviará una copia al generar" />
            </div>
          </div>

          <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:8}}>
            <DBtn variant="secondary">Vista previa</DBtn>
            <DBtn icon={DI.download}>Generar reporte</DBtn>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  DInput, DTextarea, DSelect, DCheckbox, DRadio, DToggle, DSlider, DFileUpload, DChips, DNumberStepper, FormsScreen
});

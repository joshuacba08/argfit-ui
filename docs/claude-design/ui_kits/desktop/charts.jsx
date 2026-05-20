/* ArgFit Desktop — Advanced ECharts Analytics Dashboard */
const {useState, useEffect, useRef, useCallback, useMemo} = React;

/* ── ArgFit Dark Theme for ECharts ── */
const ARGFIT_THEME = {
  backgroundColor: 'transparent',
  textStyle: {fontFamily: "'Outfit', system-ui, sans-serif", color: '#829AB1'},
  title: {textStyle: {color:'#F0F4F8',fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontWeight:700}},
  legend: {textStyle: {color:'#829AB1'}},
  tooltip: {
    backgroundColor: 'rgba(15,29,50,0.95)', borderColor: 'rgba(37,153,213,0.15)', borderWidth: 1,
    textStyle: {color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:12},
    extraCssText: 'border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4);backdrop-filter:blur(8px);'
  },
  categoryAxis: {axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}},axisTick:{lineStyle:{color:'rgba(37,153,213,0.12)'}},axisLabel:{color:'#627D98'},splitLine:{lineStyle:{color:'rgba(37,153,213,0.06)'}}},
  valueAxis: {axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}},axisTick:{lineStyle:{color:'rgba(37,153,213,0.12)'}},axisLabel:{color:'#627D98'},splitLine:{lineStyle:{color:'rgba(37,153,213,0.06)'}}},
  color: ['#2599D5','#00D4FF','#00C853','#FFB300','#FF3D71','#57B0E7','#00AACE','#8DCAEF'],
};

/* ── EChart wrapper component ── */
function EChart({option, height=320, style:extraStyle, onInit}) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.echarts) return;
    const chart = echarts.init(ref.current, null, {renderer:'canvas'});
    chartRef.current = chart;
    const themed = {...ARGFIT_THEME, ...option};
    chart.setOption(themed);
    onInit && onInit(chart);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, []);
  useEffect(() => {
    if (chartRef.current && option) {
      const themed = {...ARGFIT_THEME, ...option};
      chartRef.current.setOption(themed, {notMerge: false});
    }
  }, [option]);
  return <div ref={ref} style={{width:'100%',height,...(extraStyle||{})}}></div>;
}

/* ── EChart GL wrapper (for 3D) ── */
function EChartGL({option, height=400, style:extraStyle}) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.echarts) return;
    const chart = echarts.init(ref.current, null, {renderer:'canvas'});
    chartRef.current = chart;
    chart.setOption({...ARGFIT_THEME, ...option});
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, []);
  useEffect(() => {
    if (chartRef.current && option) chartRef.current.setOption({...ARGFIT_THEME, ...option}, {notMerge: false});
  }, [option]);
  return <div ref={ref} style={{width:'100%',height,...(extraStyle||{})}}></div>;
}

/* ── Chart Card wrapper ── */
function ChartCard({title, subtitle, children, controls, style:extraStyle}) {
  return (
    <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.08)',borderRadius:12,padding:20,display:'flex',flexDirection:'column',...(extraStyle||{})}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",textTransform:'uppercase',letterSpacing:'-0.01em'}}>{title}</div>
          {subtitle && <div style={{fontSize:12,color:'#627D98',marginTop:2}}>{subtitle}</div>}
        </div>
        {controls && <div style={{display:'flex',gap:4}}>{controls}</div>}
      </div>
      <div style={{flex:1,minHeight:0}}>{children}</div>
    </div>
  );
}

/* ── Sample Data Generators ── */
const ATHLETES_DATA = [
  {name:'María García',jump:45.2,force:2847,ct:0.342,rsi:1.32,power:1842,asymmetry:4.2,sport:'Voleibol'},
  {name:'Lucas Rodríguez',jump:52.1,force:3120,ct:0.318,rsi:1.45,power:2180,asymmetry:6.1,sport:'Fútbol'},
  {name:'Valentina López',jump:38.7,force:2340,ct:0.365,rsi:1.18,power:1520,asymmetry:3.8,sport:'Handball'},
  {name:'Santiago Pérez',jump:55.4,force:3340,ct:0.302,rsi:1.52,power:2420,asymmetry:2.9,sport:'Atletismo'},
  {name:'Camila Torres',jump:41.3,force:2580,ct:0.348,rsi:1.25,power:1680,asymmetry:5.0,sport:'Básquet'},
  {name:'Nicolás Morales',jump:49.7,force:2960,ct:0.325,rsi:1.40,power:2050,asymmetry:5.5,sport:'Fútbol'},
  {name:'Paula Martínez',jump:44.8,force:2720,ct:0.338,rsi:1.30,power:1790,asymmetry:3.2,sport:'Atletismo'},
  {name:'Diego Romero',jump:46.5,force:2780,ct:0.330,rsi:1.35,power:1920,asymmetry:9.1,sport:'Rugby'},
];

function genMonthlyData() {
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return months.map(m => ({month:m, cmj:Math.round(30+Math.random()*25), sj:Math.round(20+Math.random()*15), dj:Math.round(10+Math.random()*12), sprint:Math.round(5+Math.random()*8)}));
}

function genHeatmapData() {
  const data = [];
  for (let w=0;w<12;w++) for (let d=0;d<7;d++) {
    const v = Math.floor(Math.random()*10);
    if (Math.random()>0.15) data.push([d,w,v]);
  }
  return data;
}

/* ═══ ANALYTICS SCREEN ═══════════════════════════════ */
function ChartsScreen() {
  const [period, setPeriod] = useState('3M');
  const [activeAthlete, setActiveAthlete] = useState(null);
  const monthly = useMemo(genMonthlyData, []);
  const heatData = useMemo(genHeatmapData, []);

  /* ── 3D Scatter: Force × Jump Height × Contact Time ── */
  const scatter3dOption = useMemo(() => ({
    tooltip: {
      formatter: p => `<strong>${ATHLETES_DATA[p.dataIndex]?.name||''}</strong><br/>Salto: ${p.value[0]}cm<br/>Fuerza: ${p.value[1]}N<br/>T.Contacto: ${p.value[2]}s`
    },
    grid3D: {
      boxWidth:100,boxDepth:80,boxHeight:60,
      viewControl:{distance:220,alpha:20,beta:40,rotateSensitivity:3},
      axisLine:{lineStyle:{color:'rgba(37,153,213,0.15)'}},
      axisPointer:{lineStyle:{color:'#2599D5'}},
      environment:'transparent',
    },
    xAxis3D:{name:'Salto (cm)',nameTextStyle:{color:'#627D98',fontSize:11},axisLabel:{color:'#627D98'},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}},splitLine:{lineStyle:{color:'rgba(37,153,213,0.04)'}}},
    yAxis3D:{name:'Fuerza (N)',nameTextStyle:{color:'#627D98',fontSize:11},axisLabel:{color:'#627D98'},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}},splitLine:{lineStyle:{color:'rgba(37,153,213,0.04)'}}},
    zAxis3D:{name:'T.Contacto (s)',nameTextStyle:{color:'#627D98',fontSize:11},axisLabel:{color:'#627D98'},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}},splitLine:{lineStyle:{color:'rgba(37,153,213,0.04)'}}},
    series:[{
      type:'scatter3D',
      data: ATHLETES_DATA.map(a=>[a.jump,a.force,a.ct]),
      symbolSize:14,
      itemStyle:{borderWidth:1,borderColor:'rgba(37,153,213,0.3)'},
      emphasis:{itemStyle:{color:'#00D4FF',borderColor:'#fff',borderWidth:2}},
      label:{show:true,formatter:p=>ATHLETES_DATA[p.dataIndex]?.name.split(' ')[0]||'',color:'#BCCCDC',fontSize:10,distance:8},
    }]
  }), []);

  /* ── Radar: Multi-metric athlete comparison ── */
  const [radarAthletes, setRadarAthletes] = useState([0,3]);
  const radarOption = useMemo(() => {
    const indicators = [
      {name:'Salto',max:60},{name:'Fuerza',max:3500},{name:'RSI',max:2},
      {name:'Potencia',max:2500},{name:'Simetría',max:10},{name:'T.Contacto',max:0.4}
    ];
    return {
      legend:{data:radarAthletes.map(i=>ATHLETES_DATA[i].name),bottom:0,textStyle:{color:'#829AB1',fontSize:11}},
      radar:{indicator:indicators,center:['50%','48%'],radius:'65%',
        axisName:{color:'#829AB1',fontSize:11},
        splitArea:{areaStyle:{color:['rgba(37,153,213,0.02)','rgba(37,153,213,0.05)']}},
        splitLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},
        axisLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},
      },
      series:[{type:'radar',data:radarAthletes.map((idx,i)=>{
        const a = ATHLETES_DATA[idx];
        return {value:[a.jump,a.force,a.rsi,a.power,10-a.asymmetry,a.ct],name:a.name,
          lineStyle:{width:2},areaStyle:{opacity:0.15},
          itemStyle:{borderWidth:2},
        };
      })}]
    };
  }, [radarAthletes]);

  /* ── Stacked Bar: Monthly sessions by type ── */
  const barOption = useMemo(() => ({
    legend:{data:['CMJ','SJ','DJ','Sprint'],bottom:0,textStyle:{color:'#829AB1',fontSize:11}},
    grid:{left:50,right:16,top:16,bottom:40},
    xAxis:{type:'category',data:monthly.map(m=>m.month),axisLabel:{color:'#627D98',fontSize:11},axisLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},axisTick:{show:false}},
    yAxis:{type:'value',axisLabel:{color:'#627D98',fontSize:11},splitLine:{lineStyle:{color:'rgba(37,153,213,0.06)'}},axisLine:{show:false}},
    series:['cmj','sj','dj','sprint'].map((k,i)=>({
      name:['CMJ','SJ','DJ','Sprint'][i],type:'bar',stack:'total',
      data:monthly.map(m=>m[k]),
      barWidth:16,borderRadius:i===3?[3,3,0,0]:0,
      itemStyle:{borderRadius:i===3?[3,3,0,0]:0},
    }))
  }), [monthly]);

  /* ── Heatmap: Training intensity calendar ── */
  const heatmapOption = useMemo(() => ({
    grid:{left:60,right:16,top:16,bottom:36},
    xAxis:{type:'category',data:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],axisLabel:{color:'#627D98',fontSize:11},axisLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},axisTick:{show:false},splitArea:{show:false}},
    yAxis:{type:'category',data:['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','S11','S12'],axisLabel:{color:'#627D98',fontSize:10},axisLine:{show:false},axisTick:{show:false}},
    visualMap:{min:0,max:10,show:true,orient:'horizontal',bottom:4,left:'center',itemWidth:12,itemHeight:100,
      textStyle:{color:'#627D98',fontSize:10},
      inRange:{color:['#0F1D32','#114569','#17618D','#1E7DB1','#2599D5','#57B0E7','#00D4FF']}},
    series:[{type:'heatmap',data:heatData,
      itemStyle:{borderRadius:3,borderColor:'#0A1628',borderWidth:2},
      emphasis:{itemStyle:{borderColor:'#2599D5',borderWidth:2,shadowBlur:8,shadowColor:'rgba(37,153,213,0.3)'}},
    }]
  }), [heatData]);

  /* ── Boxplot: Jump distribution by type ── */
  const boxplotOption = useMemo(() => {
    const types = ['CMJ','SJ','DJ','Abalakov'];
    const boxData = types.map(()=>{
      const base = 30+Math.random()*15;
      return [base-5+Math.random()*3, base-2+Math.random()*2, base+Math.random()*3, base+4+Math.random()*3, base+8+Math.random()*4].sort((a,b)=>a-b).map(v=>+v.toFixed(1));
    });
    return {
      grid:{left:50,right:16,top:16,bottom:36},
      xAxis:{type:'category',data:types,axisLabel:{color:'#627D98'},axisLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},axisTick:{show:false}},
      yAxis:{type:'value',name:'Altura (cm)',nameTextStyle:{color:'#627D98',fontSize:11},axisLabel:{color:'#627D98'},splitLine:{lineStyle:{color:'rgba(37,153,213,0.06)'}},axisLine:{show:false}},
      series:[{type:'boxplot',data:boxData,
        itemStyle:{color:'rgba(37,153,213,0.15)',borderColor:'#2599D5',borderWidth:1.5},
        emphasis:{itemStyle:{borderColor:'#00D4FF',borderWidth:2}},
      }]
    };
  }, []);

  /* ── Parallel Coordinates: Multi-variable analysis ── */
  const parallelOption = useMemo(() => ({
    parallelAxis:[
      {dim:0,name:'Salto (cm)',nameLocation:'start',nameTextStyle:{color:'#627D98',fontSize:10},axisLabel:{color:'#627D98',fontSize:10},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
      {dim:1,name:'Fuerza (N)',nameLocation:'start',nameTextStyle:{color:'#627D98',fontSize:10},axisLabel:{color:'#627D98',fontSize:10},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
      {dim:2,name:'T.Contacto',nameLocation:'start',nameTextStyle:{color:'#627D98',fontSize:10},axisLabel:{color:'#627D98',fontSize:10},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
      {dim:3,name:'RSI',nameLocation:'start',nameTextStyle:{color:'#627D98',fontSize:10},axisLabel:{color:'#627D98',fontSize:10},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
      {dim:4,name:'Potencia',nameLocation:'start',nameTextStyle:{color:'#627D98',fontSize:10},axisLabel:{color:'#627D98',fontSize:10},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
      {dim:5,name:'Asimetría',nameLocation:'start',nameTextStyle:{color:'#627D98',fontSize:10},axisLabel:{color:'#627D98',fontSize:10},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
    ],
    parallel:{left:50,right:30,top:30,bottom:30,
      parallelAxisDefault:{axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}},axisTick:{lineStyle:{color:'rgba(37,153,213,0.12)'}}}
    },
    series:[{type:'parallel',lineStyle:{width:2,opacity:0.6},
      data:ATHLETES_DATA.map(a=>[a.jump,a.force,a.ct,a.rsi,a.power,a.asymmetry]),
      emphasis:{lineStyle:{width:3,opacity:1}},
    }]
  }), []);

  /* ── 3D Bar: Sessions by Sport × Month ── */
  const bar3dOption = useMemo(() => {
    const sports = ['Voleibol','Fútbol','Handball','Rugby','Básquet','Atletismo'];
    const months = ['Ene','Feb','Mar','Abr','May','Jun'];
    const data = [];
    sports.forEach((s,si)=>months.forEach((m,mi)=>{
      data.push([si,mi,Math.floor(5+Math.random()*25)]);
    }));
    return {
      grid3D:{boxWidth:120,boxDepth:80,boxHeight:50,viewControl:{distance:240,alpha:25,beta:35,rotateSensitivity:3},
        axisLine:{lineStyle:{color:'rgba(37,153,213,0.15)'}},
        environment:'transparent',light:{main:{intensity:0.6,shadow:false},ambient:{intensity:0.5}},
      },
      xAxis3D:{type:'category',data:sports,axisLabel:{color:'#627D98',fontSize:9,interval:0},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
      yAxis3D:{type:'category',data:months,axisLabel:{color:'#627D98',fontSize:10},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}}},
      zAxis3D:{type:'value',name:'Sesiones',nameTextStyle:{color:'#627D98',fontSize:10},axisLabel:{color:'#627D98'},axisLine:{lineStyle:{color:'rgba(37,153,213,0.12)'}},splitLine:{lineStyle:{color:'rgba(37,153,213,0.04)'}}},
      visualMap:{min:5,max:30,show:false,inRange:{color:['#114569','#2599D5','#00D4FF']}},
      series:[{type:'bar3D',data:data.map(d=>({value:[...d]})),shading:'lambert',
        barSize:8,bevelSize:0.3,
        itemStyle:{opacity:0.85},
        emphasis:{itemStyle:{color:'#00D4FF',opacity:1}},
        label:{show:false},
      }]
    };
  }, []);

  const PeriodButtons = () => (
    <div style={{display:'flex',background:'#152A42',borderRadius:6,padding:2}}>
      {['1M','3M','6M','1A'].map(p=>(
        <button key={p} onClick={()=>setPeriod(p)} style={{padding:'4px 10px',borderRadius:4,border:'none',fontSize:11,fontWeight:period===p?600:400,
          background:period===p?'#2599D5':'transparent',color:period===p?'#fff':'#627D98',cursor:'pointer',fontFamily:"'Outfit',sans-serif"}}>{p}</button>
      ))}
    </div>
  );

  return (
    <div style={{padding:24,overflow:'auto',flex:1}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div>
          <div style={{fontSize:15,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",textTransform:'uppercase'}}>Analytics avanzados</div>
          <div style={{fontSize:12,color:'#627D98',marginTop:2}}>Gráficos interactivos con ECharts — rotá, hacé zoom y explorá los datos</div>
        </div>
        <PeriodButtons />
      </div>

      {/* Row 1: 3D Scatter + Radar */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <ChartCard title="Análisis 3D" subtitle="Fuerza × Salto × Tiempo de contacto — Rotá el gráfico">
          <EChartGL option={scatter3dOption} height={340} />
        </ChartCard>
        <ChartCard title="Comparación radar" subtitle="Perfil multimétrico de atletas"
          controls={
            <select value={radarAthletes[1]} onChange={e=>setRadarAthletes([radarAthletes[0],+e.target.value])}
              style={{background:'#152A42',border:'1px solid rgba(37,153,213,0.12)',borderRadius:6,padding:'4px 8px',color:'#BCCCDC',fontFamily:"'Outfit',sans-serif",fontSize:11,outline:'none'}}>
              {ATHLETES_DATA.map((a,i)=><option key={i} value={i}>{a.name}</option>)}
            </select>
          }>
          <EChart option={radarOption} height={340} />
        </ChartCard>
      </div>

      {/* Row 2: Stacked Bar + Heatmap */}
      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:16,marginBottom:16}}>
        <ChartCard title="Sesiones mensuales" subtitle="Distribución por tipo de test">
          <EChart option={barOption} height={260} />
        </ChartCard>
        <ChartCard title="Intensidad semanal" subtitle="Mapa de calor — 12 semanas">
          <EChart option={heatmapOption} height={260} />
        </ChartCard>
      </div>

      {/* Row 3: Boxplot + Parallel */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <ChartCard title="Distribución de saltos" subtitle="Boxplot por tipo de test">
          <EChart option={boxplotOption} height={260} />
        </ChartCard>
        <ChartCard title="Coordenadas paralelas" subtitle="Análisis multivariable de atletas">
          <EChart option={parallelOption} height={260} />
        </ChartCard>
      </div>

      {/* Row 4: 3D Bar */}
      <ChartCard title="Sesiones 3D" subtitle="Sesiones por deporte y mes — Rotá el gráfico para explorar">
        <EChartGL option={bar3dOption} height={380} />
      </ChartCard>
    </div>
  );
}

Object.assign(window, {EChart, EChartGL, ChartCard, ChartsScreen, ARGFIT_THEME, ATHLETES_DATA});

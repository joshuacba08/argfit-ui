/* ArgFit Mobile — ECharts KPI-focused Charts (Ionic-style) */
const {useState, useEffect, useRef, useMemo} = React;

/* ── Mobile ArgFit Theme ── */
const MOBILE_THEME = {
  backgroundColor: 'transparent',
  textStyle: {fontFamily: "'Outfit', system-ui, sans-serif", color: '#829AB1'},
  tooltip: {
    backgroundColor: 'rgba(15,29,50,0.95)', borderColor: 'rgba(37,153,213,0.15)', borderWidth: 1,
    textStyle: {color:'#F0F4F8',fontFamily:"'Outfit',sans-serif",fontSize:11},
    extraCssText: 'border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.4);padding:8px 12px;'
  },
  color: ['#2599D5','#00D4FF','#00C853','#FFB300','#FF3D71','#57B0E7'],
};

/* ── Mobile EChart wrapper ── */
function MEChart({option, height=200, style:extraStyle}) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.echarts) return;
    const chart = echarts.init(ref.current, null, {renderer:'canvas'});
    chartRef.current = chart;
    chart.setOption({...MOBILE_THEME, ...option});
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); chart.dispose(); };
  }, []);
  useEffect(() => {
    if (chartRef.current && option) chartRef.current.setOption({...MOBILE_THEME, ...option}, {notMerge: false});
  }, [option]);
  return <div ref={ref} style={{width:'100%',height,...(extraStyle||{})}}></div>;
}

/* ── Mobile Chart Card ── */
function MChartCard({title, children, action, onAction, style:extraStyle}) {
  return (
    <div style={{background:'#0F1D32',border:'1px solid rgba(37,153,213,0.10)',borderRadius:12,padding:16,...(extraStyle||{})}}>
      {title && <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <span style={{fontSize:14,fontWeight:700,fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",letterSpacing:'-0.01em'}}>{title}</span>
        {action && <span onClick={onAction} style={{fontSize:12,color:'#2599D5',fontWeight:500,cursor:'pointer'}}>{action}</span>}
      </div>}
      {children}
    </div>
  );
}

/* ═══ MOBILE CHARTS SCREEN ═══════════════════════════ */
function MobileChartsScreen() {
  const [segment, setSegment] = useState(0);

  /* ── Gauge: Performance score ── */
  const gaugeOption = useMemo(() => ({
    series: [{
      type: 'gauge',
      center: ['50%','60%'],
      radius: '90%',
      startAngle: 200, endAngle: -20,
      min: 0, max: 100,
      pointer: {show: false},
      progress: {show: true, width: 14, roundCap: true,
        itemStyle: {color: {type:'linear',x:0,y:0,x2:1,y2:0,colorStops:[{offset:0,color:'#2599D5'},{offset:1,color:'#00D4FF'}]}}
      },
      axisLine: {lineStyle: {width: 14, color: [[1,'rgba(37,153,213,0.08)']]}},
      axisTick: {show: false}, splitLine: {show: false}, axisLabel: {show: false},
      detail: {
        fontSize: 36, fontWeight: 800, fontFamily: "'Zalando Sans Expanded','Exo 2',sans-serif",
        color: '#F0F4F8', offsetCenter: [0, '-5%'],
        formatter: '{value}',
      },
      title: {fontSize: 12, color: '#627D98', offsetCenter: [0, '30%']},
      data: [{value: 78, name: 'Performance Score'}],
    }],
  }), []);

  /* ── Smooth Area: Weekly jump height trend ── */
  const weeklyData = [38.2,40.1,39.5,42.3,41.8,43.1,44.2,42.9,45.2,43.8,44.5,45.0,44.8,46.1];
  const areaOption = useMemo(() => ({
    grid: {left:40,right:12,top:12,bottom:28},
    xAxis: {type:'category',data:weeklyData.map((_,i)=>`D${i+1}`),
      axisLabel:{color:'#627D98',fontSize:10,interval:2},
      axisLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},axisTick:{show:false},boundaryGap:false},
    yAxis: {type:'value',min:35,
      axisLabel:{color:'#627D98',fontSize:10},
      splitLine:{lineStyle:{color:'rgba(37,153,213,0.06)'}},axisLine:{show:false}},
    series: [{
      type: 'line', data: weeklyData, smooth: 0.4, symbol: 'none',
      lineStyle: {width: 2.5, color: '#2599D5'},
      areaStyle: {color: {type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[
        {offset:0,color:'rgba(37,153,213,0.25)'},{offset:1,color:'rgba(37,153,213,0)'}
      ]}},
    }],
  }), []);

  /* ── Donut: Session distribution ── */
  const donutOption = useMemo(() => ({
    legend: {show:false},
    series: [{
      type:'pie', radius:['58%','80%'], center:['50%','50%'],
      label:{show:false}, labelLine:{show:false},
      emphasis:{scale:true,scaleSize:4,
        itemStyle:{shadowBlur:12,shadowColor:'rgba(37,153,213,0.3)'}},
      data:[
        {value:42,name:'CMJ',itemStyle:{color:'#2599D5'}},
        {value:18,name:'SJ',itemStyle:{color:'#00D4FF'}},
        {value:15,name:'DJ',itemStyle:{color:'#FFB300'}},
        {value:8,name:'Sprint',itemStyle:{color:'#FF3D71'}},
        {value:12,name:'Abalakov',itemStyle:{color:'#00C853'}},
      ],
      itemStyle: {borderRadius: 4, borderColor: '#0F1D32', borderWidth: 3},
    }],
  }), []);

  /* ── Horizontal Bar: Top athletes ── */
  const rankOption = useMemo(() => ({
    grid: {left:90,right:30,top:8,bottom:8},
    xAxis: {type:'value',show:false},
    yAxis: {type:'category',
      data:['S. Pérez','L. Rodríguez','N. Morales','D. Romero','M. García'].reverse(),
      axisLabel:{color:'#BCCCDC',fontSize:11,fontWeight:500},
      axisLine:{show:false},axisTick:{show:false},
    },
    series:[{
      type:'bar',data:[42.1,46.5,49.7,52.1,55.4].reverse(),
      barWidth:12,borderRadius:6,
      itemStyle:{color:{type:'linear',x:0,y:0,x2:1,y2:0,colorStops:[
        {offset:0,color:'#2599D5'},{offset:1,color:'#00D4FF'}
      ]}},
      label:{show:true,position:'right',color:'#2599D5',fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",formatter:'{c} cm'},
    }],
  }), []);

  /* ── Radial Bar: KPI indicators ── */
  const radialOption = useMemo(() => ({
    polar: {radius:['30%','85%'],center:['50%','50%']},
    angleAxis: {max:100,show:false,startAngle:90},
    radiusAxis: {type:'category',data:['Fuerza','RSI','Simetría','Potencia'],
      axisLine:{show:false},axisTick:{show:false},
      axisLabel:{color:'#829AB1',fontSize:10,margin:4}},
    series:[{
      type:'bar',coordinateSystem:'polar',
      data:[
        {value:85,itemStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#2599D5'},{offset:1,color:'#00D4FF'}]}}},
        {value:72,itemStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#00C853'},{offset:1,color:'#00C853'}]}}},
        {value:91,itemStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#FFB300'},{offset:1,color:'#FFB300'}]}}},
        {value:68,itemStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'#FF3D71'},{offset:1,color:'#FF3D71'}]}}},
      ],
      barWidth:10,roundCap:true,
      itemStyle:{borderRadius:5},
    },{
      type:'bar',coordinateSystem:'polar',data:[100,100,100,100],
      barWidth:10,barGap:'-100%',roundCap:true,
      itemStyle:{color:'rgba(37,153,213,0.06)',borderRadius:5},
      silent:true,
    }],
  }), []);

  /* ── Multi-line: Force over sessions ── */
  const forceData1 = [2200,2340,2280,2500,2450,2580,2650,2520,2750,2680,2720,2847];
  const forceData2 = [2100,2200,2350,2300,2400,2380,2500,2550,2480,2600,2580,2650];
  const multiLineOption = useMemo(() => ({
    grid: {left:48,right:12,top:24,bottom:28},
    legend:{data:['María','Camila'],top:0,right:0,textStyle:{color:'#829AB1',fontSize:10}},
    xAxis: {type:'category',data:forceData1.map((_,i)=>`#${i+1}`),
      axisLabel:{color:'#627D98',fontSize:9,interval:2},
      axisLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},axisTick:{show:false},boundaryGap:false},
    yAxis: {type:'value',
      axisLabel:{color:'#627D98',fontSize:9},
      splitLine:{lineStyle:{color:'rgba(37,153,213,0.06)'}},axisLine:{show:false}},
    series: [
      {name:'María',type:'line',data:forceData1,smooth:0.3,symbol:'circle',symbolSize:4,
        lineStyle:{width:2,color:'#2599D5'},itemStyle:{color:'#2599D5'}},
      {name:'Camila',type:'line',data:forceData2,smooth:0.3,symbol:'circle',symbolSize:4,
        lineStyle:{width:2,color:'#00D4FF',type:'dashed'},itemStyle:{color:'#00D4FF'}},
    ],
  }), []);

  const segments = ['Resumen','Tendencias','Comparar'];

  return (
    <div style={{flex:1,overflow:'auto',padding:'0 16px 16px'}}>
      {/* Header */}
      <div style={{padding:'8px 0 12px'}}>
        <div style={{fontSize:12,color:'#829AB1',fontWeight:500}}>Análisis</div>
        <div style={{fontFamily:"'Zalando Sans Expanded','Exo 2',sans-serif",fontSize:20,fontWeight:700,marginTop:2,textTransform:'uppercase'}}>Charts</div>
      </div>

      {/* Segment */}
      <div style={{display:'flex',background:'#0F1D32',borderRadius:10,padding:3,border:'1px solid rgba(37,153,213,0.06)',marginBottom:16}}>
        {segments.map((s,i)=>(
          <div key={s} onClick={()=>setSegment(i)} style={{
            flex:1,padding:'10px 8px',borderRadius:8,textAlign:'center',fontSize:13,fontWeight:segment===i?600:400,
            color:segment===i?'#fff':'#627D98',background:segment===i?'#2599D5':'transparent',
            cursor:'pointer',transition:'all 200ms',
          }}>{s}</div>
        ))}
      </div>

      {/* ─── Tab 0: Resumen ─── */}
      {segment === 0 && <>
        {/* Gauge */}
        <MChartCard title="PERFORMANCE SCORE">
          <MEChart option={gaugeOption} height={180} />
          <div style={{display:'flex',justifyContent:'center',gap:20,marginTop:4}}>
            {[['Salto','45.2 cm','#2599D5'],['Fuerza','2847 N','#00D4FF'],['RSI','1.32','#00C853']].map(([l,v,c])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontSize:10,color:'#627D98',marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>
        </MChartCard>

        {/* Donut + Legend */}
        <div style={{marginTop:12}}>
          <MChartCard title="SESIONES POR TIPO">
            <div style={{display:'flex',alignItems:'center'}}>
              <div style={{width:'45%'}}><MEChart option={donutOption} height={140} /></div>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:8,paddingLeft:8}}>
                {[['CMJ',42,'#2599D5'],['SJ',18,'#00D4FF'],['DJ',15,'#FFB300'],['Sprint',8,'#FF3D71'],['Abalakov',12,'#00C853']].map(([n,v,c])=>(
                  <div key={n} style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:8,height:8,borderRadius:2,background:c,flexShrink:0}}></div>
                    <span style={{fontSize:12,color:'#BCCCDC',flex:1}}>{n}</span>
                    <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:'#829AB1',fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </MChartCard>
        </div>

        {/* Radial KPI */}
        <div style={{marginTop:12}}>
          <MChartCard title="INDICADORES KPI">
            <MEChart option={radialOption} height={180} />
          </MChartCard>
        </div>
      </>}

      {/* ─── Tab 1: Tendencias ─── */}
      {segment === 1 && <>
        <MChartCard title="PROGRESO DE SALTO" action="14 días">
          <MEChart option={areaOption} height={180} />
          <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
            <div><div style={{fontSize:10,color:'#627D98'}}>Inicio</div><div style={{fontSize:13,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'#829AB1'}}>38.2cm</div></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:10,color:'#627D98'}}>Cambio</div><div style={{fontSize:13,fontWeight:700,color:'#00C853'}}>+17.8%</div></div>
            <div style={{textAlign:'right'}}><div style={{fontSize:10,color:'#627D98'}}>Actual</div><div style={{fontSize:13,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'#2599D5'}}>45.0cm</div></div>
          </div>
        </MChartCard>

        <div style={{marginTop:12}}>
          <MChartCard title="RANKING — MEJOR SALTO">
            <MEChart option={rankOption} height={180} />
          </MChartCard>
        </div>

        <div style={{marginTop:12}}>
          <MChartCard title="FUERZA POR SESIÓN" action="12 sesiones">
            <MEChart option={multiLineOption} height={200} />
          </MChartCard>
        </div>
      </>}

      {/* ─── Tab 2: Comparar ─── */}
      {segment === 2 && <>
        {/* Radar comparison */}
        <MChartCard title="COMPARACIÓN ATLETAS">
          <MEChart option={{
            legend:{data:['María García','Santiago Pérez'],bottom:0,textStyle:{color:'#829AB1',fontSize:10}},
            radar:{indicator:[
              {name:'Salto',max:60},{name:'Fuerza',max:3500},{name:'RSI',max:2},
              {name:'Potencia',max:2500},{name:'Simetría',max:10},{name:'Velocidad',max:4}
            ],center:['50%','45%'],radius:'60%',
              axisName:{color:'#829AB1',fontSize:10},
              splitArea:{areaStyle:{color:['rgba(37,153,213,0.02)','rgba(37,153,213,0.05)']}},
              splitLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},
              axisLine:{lineStyle:{color:'rgba(37,153,213,0.10)'}},
            },
            series:[{type:'radar',data:[
              {value:[45.2,2847,1.32,1842,5.8,3.2],name:'María García',lineStyle:{width:2},areaStyle:{opacity:0.12}},
              {value:[55.4,3340,1.52,2420,7.1,3.8],name:'Santiago Pérez',lineStyle:{width:2},areaStyle:{opacity:0.12}},
            ]}]
          }} height={240} />
        </MChartCard>

        {/* Side by side bars */}
        <div style={{marginTop:12}}>
          <MChartCard title="MÉTRICAS LADO A LADO">
            <MEChart option={{
              grid:{left:70,right:12,top:8,bottom:8},
              xAxis:{type:'value',show:false},
              yAxis:{type:'category',data:['Salto','Fuerza','RSI','Potencia','Simetría'].reverse(),
                axisLabel:{color:'#BCCCDC',fontSize:11},axisLine:{show:false},axisTick:{show:false}},
              series:[
                {name:'María',type:'bar',data:[45.2,28.5,66,73.7,58].reverse(),barWidth:8,barGap:'30%',
                  itemStyle:{color:'#2599D5',borderRadius:4},
                  label:{show:false}},
                {name:'Santiago',type:'bar',data:[55.4,33.4,76,96.8,71].reverse(),barWidth:8,
                  itemStyle:{color:'#00D4FF',borderRadius:4},
                  label:{show:false}},
              ],
              legend:{data:['María','Santiago'],bottom:0,textStyle:{color:'#829AB1',fontSize:10}},
            }} height={200} />
          </MChartCard>
        </div>
      </>}
    </div>
  );
}

Object.assign(window, {MEChart, MChartCard, MobileChartsScreen});

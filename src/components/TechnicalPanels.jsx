import { useMemo, useState } from 'react';
import { aerodynamicScenario, syntheticRainflow, inspectionTargets } from './technicalAnalysis.js';

function SignalPlot({samples,label,units='u.a.'}) {
  const min=Math.min(...samples),max=Math.max(...samples),padding=max===min?Math.max(Math.abs(min)*.1,1):0,low=min-padding,span=max-min+padding*2||1;
  const points=samples.map((value,index)=>`${8+index/(samples.length-1||1)*284},${68-(value-low)/span*50}`).join(' ');
  const format=value=>value.toLocaleString('es-ES',{maximumFractionDigits:1});
  return <figure className="technical-signal"><figcaption>{label}<span>{format(min)}–{format(max)} {units}</span></figcaption><svg viewBox="0 0 300 84" role="img" aria-label={label}><path className="signal-grid" d="M8 18H292 M8 43H292 M8 68H292"/><polyline points={points}/><text x="8" y="81">Inicio</text><text x="265" y="81">Final</text></svg></figure>;
}

export function PredictivePanel({data,activeView,onSelectView,onClose}) {
  const targets=inspectionTargets(data);
  const history=(data?.history??[]).map(point=>point.load).filter(Number.isFinite);
  return <section className="fatigue-panel technical-panel predictive-panel" aria-label="Mantenimiento predictivo">
    <div className="fatigue-heading"><span>CONDICIÓN Y SEGUIMIENTO</span><button type="button" onClick={onClose} aria-label="Cerrar mantenimiento predictivo">×</button></div>
    <h1>Mantenimiento<span>Predictivo · inspección por componentes</span></h1>
    <p className="fatigue-caption">ESTIMACIONES DIDÁCTICAS · SIN RUL CALCULADA</p>
    <p className="fatigue-intro">Selecciona un componente para acercarte. El ámbar señala la zona de inspección.</p>
    <div className="inspection-list">{targets.map(target=><button type="button" key={target.view} onClick={()=>onSelectView(target.view)} aria-pressed={activeView===target.view}>
      <span className="inspection-top"><strong>{target.label}</strong><span aria-hidden="true">↗</span></span><small>{target.detail}</small><b>{target.metric}</b><span className={`inspection-state ${target.review?'review':''}`}>{target.status}</span>
    </button>)}</div>
    {history.length>1?<SignalPlot samples={history} label="Carga estimada · historial de esta sesión" units="%"/>:<p className="technical-empty">El historial se formará con las actualizaciones de esta sesión. Se necesitan al menos dos muestras para dibujar la tendencia.</p>}
    <p className="fatigue-scope"><strong>Plan de inspección ilustrativo</strong>Las temperaturas, vibración y cargas se estiman desde generación agregada. Las etiquetas orientan esta demostración; no detectan fallos ni predicen una fecha de avería.</p>
    <details><summary>Criterios del ejemplo</summary><p>Se marca «Revisar escenario» con gearbox ≥ 70 °C, vibración ≥ 2,3 mm/s, desalineación ≥ 12° o carga ≥ 75 %, según el componente. Son umbrales didácticos elegidos para esta interfaz, sin validación del fabricante.</p><p>No se calcula vida útil restante (RUL). Una predicción real requiere sensores de condición, historial y un modelo validado.</p><a href="https://docs.nrel.gov/docs/fy12osti/54530.pdf" target="_blank" rel="noopener noreferrer">Referencia · monitorización de condición NREL ↗</a></details>
  </section>;
}

export function RainflowPanel({onClose}) {
  const [wind,setWind]=useState(8),[cp,setCp]=useState(.45),[ct,setCt]=useState(.8);
  const aero=useMemo(()=>aerodynamicScenario({wind,cp,ct}),[wind,cp,ct]);
  const flow=useMemo(()=>syntheticRainflow({wind,ct}),[wind,ct]);
  const format=value=>value.toLocaleString('es-ES',{maximumFractionDigits:2});
  const maxCount=Math.max(1,...flow.bins.map(bin=>bin.count));
  return <section className="fatigue-panel technical-panel rainflow-panel" aria-label="Rainflow, Cp y Ct">
    <div className="fatigue-heading"><span>AERODINÁMICA Y CICLOS</span><button type="button" onClick={onClose} aria-label="Cerrar Rainflow Cp Ct">×</button></div>
    <h1>Rainflow<span>Cp · captura de energía / Ct · empuje</span></h1>
    <p className="fatigue-caption">ESCENARIO SINTÉTICO · INDEPENDIENTE DE ESIOS</p>
    <p className="fatigue-intro">Cp modifica la potencia y Ct el empuje. Explora cómo una señal variable se descompone en ciclos de carga.</p>
    <div className="technical-sliders">
      <label>Viento del escenario <strong>{wind} m/s</strong><input type="range" min="0" max="20" step="1" value={wind} onChange={e=>setWind(Number(e.target.value))}/></label>
      <label>Cp · coeficiente de potencia <strong>{format(cp)}</strong><input type="range" min="0" max="0.59" step="0.01" value={cp} onChange={e=>setCp(Number(e.target.value))}/></label>
      <label>Ct · coeficiente de empuje <strong>{format(ct)}</strong><input type="range" min="0" max="1.2" step="0.01" value={ct} onChange={e=>setCt(Number(e.target.value))}/></label>
    </div>
    <div className="technical-results"><article><span>Potencia captada</span><strong>{format(aero.powerMW)} <small>MW</small></strong><small>½ρ A Cp v³ · sin límite nominal</small></article><article><span>Empuje del rotor</span><strong>{format(aero.thrustKN)} <small>kN</small></strong><small>½ρ A Ct v²</small></article></div>
    <SignalPlot samples={flow.samples} label="Señal sintética · 60 segundos"/>
    <figure className="rainflow-histogram"><figcaption>Conteo Rainflow <strong>{format(flow.count)} ciclos equivalentes</strong></figcaption><div className="rainflow-bars">{flow.bins.map((bin,index)=><div key={index} title={`Rango ${format(bin.from)}–${format(bin.to)} u.a.: ${format(bin.count)} ciclos`}><span style={{height:`${Math.max(2,bin.count/maxCount*55)}px`}}/><small>{format(bin.count)}</small></div>)}</div><div className="histogram-axis"><span>Rangos pequeños</span><span>Rangos grandes · u.a.</span></div></figure>
    <p className="fatigue-scope"><strong>Ejemplo de conteo, sin daño medido</strong>Se cuentan ciclos y medios ciclos de una señal artificial escalada con Ct y v². No es un historial mecánico real ni un DEL de esta turbina. El movimiento 3D sigue los datos de la aplicación; los deslizadores cambian solo este escenario.</p>
    <details><summary>Supuestos y método</summary><p>Rotor de 145 m, densidad 1,225 kg/m³. Cp y Ct se editan como supuestos independientes. Los colores del rotor y las flechas ilustran energía (turquesa) y empuje (ámbar).</p><p>La señal de 60 s se muestrea cada 0,25 s. Rainflow extrae cambios de sentido y aplica una pila de tres puntos; los residuos abiertos cuentan como medios ciclos. Las cargas se expresan en unidades arbitrarias.</p><a href="https://openfast.readthedocs.io/en/main/source/user/aerodyn/driver.html" target="_blank" rel="noopener noreferrer">Referencia · Cp/Ct en AeroDyn ↗</a><br/><a href="https://github.com/iamlikeme/rainflow" target="_blank" rel="noopener noreferrer">Referencia · algoritmo Rainflow ↗</a></details>
  </section>;
}

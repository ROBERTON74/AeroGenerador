import { useState } from 'react';
import { useEffect } from 'react';
import { Activity, ArrowUpRight, Focus, Globe2, MousePointer2, Orbit, RotateCcw, Wind, Wrench, Zap } from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import WindTurbineScene from './components/WindTurbineScene.jsx';
import { useWindData } from './hooks/useWindData.js';
import FatiguePanel from './components/FatiguePanel.jsx';
import { PredictivePanel, RainflowPanel } from './components/TechnicalPanels.jsx';

export default function App() {
  // Hook central: trae datos reales/respaldo y expone el refresco manual al dashboard.
  const { data, loading, error, refresh } = useWindData();

  // Activa o desactiva la capa visual de esfuerzos mecanicos en la escena 3D.
  const [showStressMap, setShowStressMap] = useState(false);
  const [seaStatus, setSeaStatus] = useState('loading');
  const [showDelMap, setShowDelMap] = useState(() => new URLSearchParams(window.location.search).get('vista') === 'del');
  const [cameraView, setCameraView] = useState(() => {
    const view = new URLSearchParams(window.location.search).get('vista');
    return ['del','base','predictivo','rainflow'].includes(view) ? view : 'overview';
  });
  const [cameraRevision, setCameraRevision] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const showPredictive = cameraView.startsWith('predictivo');
  const showRainflow = cameraView === 'rainflow';

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setAutoRotate(false);
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  const selectView = (view) => {
    setShowDelMap(view.startsWith('del'));
    if (view.startsWith('del') || view.startsWith('predictivo') || view === 'rainflow') setAutoRotate(false);
    setCameraView(view);
    setCameraRevision((current) => current + 1);
  };
  const generation = typeof data?.windMw === 'number'
    ? new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(data.windMw)
    : '—';

  return (
    <main className="app-shell">
      {/* Escena principal: recibe los datos para animar rotor, entorno y esfuerzos. */}
      <WindTurbineScene windData={data} showStressMap={showStressMap} showDelMap={showDelMap} cameraView={cameraView} cameraRevision={cameraRevision} autoRotate={autoRotate} reducedMotion={reducedMotion} onSeaStatusChange={setSeaStatus} />
      <div className="scene-vignette" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#" aria-label="AeroGenerador, volver a la vista general" onClick={(event) => { event.preventDefault(); selectView('overview'); }}>
          <span className="brand-mark"><Wind size={23} /></span>
          <span>Aero<span className="brand-light">Generador</span><small>OBSERVATORIO EÓLICO · ESPAÑA</small></span>
        </a>
        <div className="header-meta"><Globe2 size={15} /><span>Exploración 3D</span><span className={`live-badge ${error ? 'is-fallback' : ''}`}><i />{loading ? 'Actualizando' : error ? 'Datos de respaldo' : 'Datos conectados'}</span></div>
      </header>
      {showDelMap ? <FatiguePanel activeView={cameraView} onSelectView={selectView} onClose={() => selectView('overview')} /> : showPredictive ? <PredictivePanel data={data} activeView={cameraView} onSelectView={selectView} onClose={()=>selectView('overview')} /> : showRainflow ? <RainflowPanel onClose={()=>selectView('overview')} /> : <section className="scene-intro" aria-label="Observatorio de energía eólica">
        <span className="eyebrow"><span /> ENERGÍA EN MOVIMIENTO</span>
        <h1>El viento.<br /><span>La energía.</span><br />En tus manos.</h1>
        <p>Explora un aerogenerador en 3D y descubre cómo el viento se transforma en electricidad.</p>
        <div className="generation-highlight"><span className="generation-icon"><Zap size={20} /></span><div><span>Generación eólica · {data?.geoName ?? 'Península'}</span><strong>{generation} <small>MW</small></strong></div><ArrowUpRight size={21} /></div>
        <p className="data-disclaimer">Generación agregada real. Mecánica del modelo estimada.</p>
      </section>}
      <nav className="scene-toolbar" aria-label="Controles de la escena 3D">
        <button type="button" className={cameraView === 'overview' ? 'selected' : ''} aria-pressed={cameraView === 'overview'} onClick={() => selectView('overview')}><RotateCcw size={17} /><span>Vista general</span></button>
        <button type="button" className={cameraView === 'rotor' ? 'selected' : ''} aria-pressed={cameraView === 'rotor'} onClick={() => selectView('rotor')}><Focus size={17} /><span>Rotor</span></button>
        <button type="button" className={showDelMap ? 'selected fatigue-active' : ''} aria-pressed={showDelMap} onClick={() => selectView(showDelMap ? 'overview' : 'del')}><Focus size={17} /><span>DEL · Fatiga</span></button>
        <button type="button" className={showPredictive ? 'selected inspection-active' : ''} aria-pressed={showPredictive} onClick={()=>selectView(showPredictive?'overview':'predictivo')}><Wrench size={17}/><span>Predictivo</span></button>
        <button type="button" className={showRainflow ? 'selected' : ''} aria-pressed={showRainflow} onClick={()=>selectView(showRainflow?'overview':'rainflow')}><Activity size={17}/><span>Rainflow · Cp/Ct</span></button>
        <button type="button" className={autoRotate ? 'selected' : ''} aria-pressed={autoRotate} onClick={() => setAutoRotate((current) => !current)}><Orbit size={17} /><span>Recorrido</span></button>
      </nav>
      <div className="scene-hint"><MousePointer2 size={14} /><span>Arrastra para explorar · Acerca con la rueda</span></div>

      {/* No descubrir la escena hasta que el océano aprobado esté montado. */}
      {seaStatus === 'loading' ? <LoadingScreen scene message="Preparando el océano…" /> : loading && !data ? <LoadingScreen /> : null}
      {seaStatus === 'error' ? <p className="sea-load-error" role="alert">No se pudo cargar el océano. Se muestra el mar de respaldo. <button type="button" onClick={() => window.location.reload()}>Reintentar</button></p> : null}

      {/* Dashboard inferior: muestra datos energeticos, SCADA y controles de analisis. */}
      <Dashboard
        windData={data}
        error={error}
        loading={loading}
        showStressMap={showStressMap}
        onStressMapChange={setShowStressMap}
        onRefresh={refresh}
      />
    </main>
  );
}


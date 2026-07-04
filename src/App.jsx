import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import WindTurbineScene from './components/WindTurbineScene.jsx';
import { useWindData } from './hooks/useWindData.js';

export default function App() {
  // Hook central: trae datos reales/respaldo y expone el refresco manual al dashboard.
  const { data, loading, error, refresh } = useWindData();

  // Activa o desactiva la capa visual de esfuerzos mecanicos en la escena 3D.
  const [showStressMap, setShowStressMap] = useState(false);

  return (
    <main className="app-shell">
      {/* Escena principal: recibe los datos para animar rotor, entorno y esfuerzos. */}
      <WindTurbineScene windData={data} showStressMap={showStressMap} />

      {/* Pantalla de carga solo mientras aun no existe ningun dato inicial. */}
      {loading && !data ? <LoadingScreen /> : null}

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


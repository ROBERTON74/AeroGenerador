import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import WindTurbineScene from './components/WindTurbineScene.jsx';
import { useWindData } from './hooks/useWindData.js';

export default function App() {
  const { data, loading, error, refresh } = useWindData();
  const [showStressMap, setShowStressMap] = useState(false);

  return (
    <main className="app-shell">
      <WindTurbineScene windData={data} showStressMap={showStressMap} />
      {loading && !data ? <LoadingScreen /> : null}
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

import { useState } from 'react';
import { ChevronsDown, ChevronsUp, MapPin, RefreshCw, Signal, Wind } from 'lucide-react';

const numberFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const decimalFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const REPRESENTATIVE_ROTOR_RADIUS_METERS = 72.5;

function formatDate(value) {
  if (!value) return '--';
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )} h`;
}

function formatDecimal(value, suffix = '') {
  if (typeof value !== 'number') return '--';
  return `${decimalFormatter.format(value)}${suffix}`;
}

function formatPercent(value) {
  if (typeof value !== 'number') return '--';
  return `${percentFormatter.format(value * 100)}%`;
}

function formatDirection(value) {
  if (typeof value !== 'number') return '--';
  return `${numberFormatter.format(value)} deg`;
}

function Stat({ label, value, detail, className = '' }) {
  return (
    <div className={`stat ${className}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function AlarmList({ alarms = [] }) {
  if (!alarms.length) {
    return <span className="alarm-pill normal">Sin alarmas activas</span>;
  }

  return alarms.slice(0, 4).map((alarm) => (
    <span className={`alarm-pill ${alarm.level}`} key={`${alarm.label}-${alarm.detail}`}>
      {alarm.label}
    </span>
  ));
}

function PowerCurve({ scada }) {
  const windMs = scada?.windSpeedMs ?? 0;
  const powerRatio = scada?.ratedPowerMw ? Math.min(1, (scada?.expectedPowerMw ?? 0) / scada.ratedPowerMw) : 0;
  const x = Math.min(96, Math.max(4, (windMs / 25) * 100));
  const y = 92 - powerRatio * 76;

  return (
    <div className="mini-chart power-curve" aria-hidden="true">
      <svg viewBox="0 0 120 72" role="img">
        <path d="M8 64 C28 64, 34 60, 44 48 C56 30, 68 12, 98 12" />
        <line x1="8" y1="64" x2="112" y2="64" />
        <line x1="8" y1="8" x2="8" y2="64" />
        <circle cx={(x / 100) * 104 + 8} cy={y} r="4" />
      </svg>
    </div>
  );
}

function WindRose({ scada }) {
  const direction = scada?.windDirectionDeg ?? 0;
  const nacelle = scada?.nacelleDirectionDeg ?? direction;

  return (
    <div className="wind-rose" aria-hidden="true">
      <span className="rose-axis ns" />
      <span className="rose-axis ew" />
      <span className="rose-needle wind" style={{ transform: `rotate(${direction}deg)` }} />
      <span className="rose-needle nacelle" style={{ transform: `rotate(${nacelle}deg)` }} />
    </div>
  );
}

function HistoryLine({ history = [] }) {
  const points = history.length ? history : [{ load: 0 }, { load: 0 }];
  const maxLoad = Math.max(100, ...points.map((point) => point.load ?? 0));
  const path = points
    .map((point, index) => {
      const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
      const y = 92 - ((point.load ?? 0) / maxLoad) * 78;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg className="history-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function ComponentMatrix({ components = [] }) {
  return (
    <div className="component-matrix">
      {components.map((component) => (
        <span className={`component-chip ${component.state}`} key={component.label}>
          {component.label}
        </span>
      ))}
    </div>
  );
}

function GearboxThermalPanel({ scada, open, onClose }) {
  if (!open) return null;

  const gearboxTemp = scada?.gearboxTempC;
  const oilTemp = scada?.oilTempC;
  const generatorTemp = scada?.generatorTempC;
  const vibration = scada?.vibrationMmS;
  const heatLevel = Math.min(1, Math.max(0.18, ((gearboxTemp ?? 55) - 40) / 55));

  return (
    <section className="thermal-panel" aria-label="Detalle termico gearbox">
      <div className="thermal-panel-head">
        <div>
          <span>Analisis termico</span>
          <strong>Gearbox y circuito de aceite</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar detalle termico">
          x
        </button>
      </div>

      <div className="gearbox-stage" style={{ '--heat-level': heatLevel }}>
        <div className="gearbox-shell">
          <span className="shaft shaft-input" />
          <span className="shaft shaft-output" />
          <span className="gear gear-large">
            <i />
          </span>
          <span className="gear gear-mid">
            <i />
          </span>
          <span className="gear gear-small">
            <i />
          </span>
          <span className="friction-zone friction-a" />
          <span className="friction-zone friction-b" />
          <span className="bearing bearing-left" />
          <span className="bearing bearing-right" />
          <span className="oil-pipe pipe-top" />
          <span className="oil-pipe pipe-bottom" />
          <span className="oil-flow flow-a" />
          <span className="oil-flow flow-b" />
        </div>
        <div className="thermal-scale">
          <span>40 C</span>
          <strong>{formatDecimal(gearboxTemp, ' C')}</strong>
          <span>95 C</span>
        </div>
      </div>

      <div className="thermal-readouts">
        <Stat label="Gearbox" value={formatDecimal(gearboxTemp, ' C')} detail="Caja de cambios" />
        <Stat label="Aceite" value={formatDecimal(oilTemp, ' C')} detail="Circuito lubricacion" />
        <Stat label="Generador" value={formatDecimal(generatorTemp, ' C')} detail="Bobinado estimado" />
        <Stat label="Vibracion" value={formatDecimal(vibration, ' mm/s')} detail="Eje principal" />
      </div>

      <div className="thermal-note">
        <span className="hot-dot" />
        <p>Las zonas rojas representan contactos con mayor friccion estimada desde la carga derivada de ESIOS.</p>
      </div>
    </section>
  );
}

function PitchConditionPanel({ scada, open, onClose }) {
  if (!open) return null;

  const pitchAngle = scada?.pitchAngleDeg ?? 0;
  const yawError = scada?.yawMisalignmentDeg ?? 0;
  const vibration = scada?.vibrationMmS;
  const availability = scada?.availabilityPercent;
  const loadPercent = Math.min(100, Math.max(0, Math.round((scada?.capacityFactor ?? 0) * 100)));
  const conditionScore = Math.min(100, Math.max(0, Math.round((availability ?? 96) - Math.abs(yawError) * 0.4)));
  const pitchVisualAngle = Math.min(28, Math.max(0, pitchAngle));

  return (
    <section
      className="thermal-panel pitch-panel"
      aria-label="Detalle de pitch y condicion"
      style={{ '--pitch-angle': `${pitchVisualAngle}deg`, '--condition-width': `${conditionScore}%` }}
    >
      <div className="thermal-panel-head">
        <div>
          <span>Control aerodinamico</span>
          <strong>Pitch y condicion de componentes</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar detalle de pitch y condicion">
          x
        </button>
      </div>

      <div className="pitch-stage">
        <div className="pitch-rotor">
          <span className="pitch-blade pitch-blade-a">
            <i />
          </span>
          <span className="pitch-blade pitch-blade-b">
            <i />
          </span>
          <span className="pitch-blade pitch-blade-c">
            <i />
          </span>
          <span className="pitch-root root-a" />
          <span className="pitch-root root-b" />
          <span className="pitch-root root-c" />
          <span className="pitch-hub" />
          <span className="pitch-load-ring" />
        </div>

        <div className="condition-bars">
          {(scada?.components ?? []).map((component) => (
            <div className={`condition-row ${component.state}`} key={component.label}>
              <span>{component.label}</span>
              <i />
              <strong>{component.state}</strong>
            </div>
          ))}
        </div>

        <div className="pitch-scale">
          <span>0 deg</span>
          <strong>{formatDecimal(pitchAngle, ' deg')}</strong>
          <span>28 deg</span>
        </div>
      </div>

      <div className="thermal-readouts pitch-readouts">
        <Stat label="Pitch" value={formatDecimal(pitchAngle, ' deg')} detail="Angulo de pala" />
        <Stat label="Yaw" value={formatDecimal(yawError, ' deg')} detail="Desalineacion" />
        <Stat label="Vibracion" value={formatDecimal(vibration, ' mm/s')} detail="Condicion rotor" />
        <Stat label="Condicion" value={`${conditionScore}%`} detail={`Carga ${loadPercent}%`} />
      </div>

      <div className="thermal-note">
        <span className="hot-dot pitch-dot" />
        <p>Las zonas marcadas indican raiz de pala, buje y orientacion, con carga y vibracion derivadas de ESIOS.</p>
      </div>
    </section>
  );
}

function WindYawPanel({ scada, open, onClose }) {
  if (!open) return null;

  const windDirection = scada?.windDirectionDeg ?? 0;
  const nacelleDirection = scada?.nacelleDirectionDeg ?? windDirection;
  const yawError = scada?.yawMisalignmentDeg ?? 0;
  const windSpeed = scada?.windSpeedMs;
  const availability = scada?.availabilityPercent;
  const yawSeverity = `${Math.min(100, Math.round(Math.abs(yawError) * 4))}%`;

  return (
    <section
      className="thermal-panel yaw-panel"
      aria-label="Detalle de rosa de viento y yaw"
      style={{
        '--wind-direction': `${windDirection}deg`,
        '--nacelle-direction': `${nacelleDirection}deg`,
        '--yaw-severity': yawSeverity,
      }}
    >
      <div className="thermal-panel-head">
        <div>
          <span>Orientacion aerodinamica</span>
          <strong>Rosa de viento y control yaw</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar detalle de rosa de viento y yaw">
          x
        </button>
      </div>

      <div className="yaw-stage">
        <div className="yaw-compass">
          <span className="compass-ring ring-outer" />
          <span className="compass-ring ring-inner" />
          <span className="compass-axis axis-ns" />
          <span className="compass-axis axis-ew" />
          <span className="wind-vector">
            <i />
          </span>
          <span className="nacelle-vector">
            <i />
          </span>
          <span className="wind-stream stream-a" />
          <span className="wind-stream stream-b" />
          <span className="wind-stream stream-c" />
          <span className="yaw-correction" />
          <span className="yaw-error-arc" />
          <span className="yaw-nacelle" />
          <span className="yaw-ghost" />
        </div>

        <div className="yaw-legend">
          <span><i className="legend-wind" /> Viento</span>
          <span><i className="legend-nacelle" /> Gondola</span>
          <span><i className="legend-error" /> Error yaw</span>
        </div>

        <div className="yaw-scale">
          <span>0 deg</span>
          <strong>{formatDecimal(yawError, ' deg')}</strong>
          <span>25 deg</span>
        </div>
      </div>

      <div className="thermal-readouts yaw-readouts">
        <Stat label="Viento" value={formatDirection(windDirection)} detail="Direccion derivada" />
        <Stat label="Gondola" value={formatDirection(nacelleDirection)} detail="Orientacion yaw" />
        <Stat label="Error yaw" value={formatDecimal(yawError, ' deg')} detail="Desalineacion" />
        <Stat label="Velocidad" value={formatDecimal(windSpeed, ' m/s')} detail={`Derivado ESIOS · Disp. ${formatDecimal(availability, '%')}`} />
      </div>

      <div className="thermal-note">
        <span className="hot-dot yaw-dot" />
        <p>El arco muestra una desalineacion estimada desde el equivalente operativo derivado de ESIOS.</p>
      </div>
    </section>
  );
}

function PowerCurvePanel({ scada, open, onClose }) {
  if (!open) return null;

  const windMs = scada?.windSpeedMs ?? 0;
  const expectedPower = scada?.expectedPowerMw ?? 0;
  const ratedPower = scada?.ratedPowerMw ?? 5.0;
  const capacityFactor = scada?.capacityFactor ?? 0;
  const powerRatio = ratedPower ? Math.min(1, expectedPower / ratedPower) : 0;
  const pointX = Math.min(326, Math.max(38, 38 + (windMs / 25) * 288));
  const pointY = Math.min(142, Math.max(34, 142 - powerRatio * 104));
  const flowWidth = `${Math.max(8, Math.round(powerRatio * 100))}%`;

  return (
    <section
      className="thermal-panel power-panel"
      aria-label="Detalle de curva de potencia"
      style={{
        '--power-flow': flowWidth,
        '--power-point-x': `${pointX}px`,
        '--power-point-y': `${pointY}px`,
      }}
    >
      <div className="thermal-panel-head">
        <div>
          <span>Respuesta aerodinamica</span>
          <strong>Curva de potencia dinamica</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar detalle de curva de potencia">
          x
        </button>
      </div>

      <div className="power-stage">
        <svg className="power-chart-large" viewBox="0 0 370 170" role="img" aria-label="Curva de potencia">
          <rect className="power-zone zone-cut-in" x="38" y="24" width="46" height="118" />
          <rect className="power-zone zone-partial" x="84" y="24" width="156" height="118" />
          <rect className="power-zone zone-rated" x="240" y="24" width="86" height="118" />
          <rect className="power-zone zone-cut-out" x="326" y="24" width="22" height="118" />
          <line className="power-axis" x1="38" y1="142" x2="348" y2="142" />
          <line className="power-axis" x1="38" y1="24" x2="38" y2="142" />
          <path className="power-curve-shadow" d="M42 140 C78 140, 92 132, 112 110 C145 72, 174 36, 244 36 C282 36, 308 36, 344 36" />
          <path className="power-curve-main" d="M42 140 C78 140, 92 132, 112 110 C145 72, 174 36, 244 36 C282 36, 308 36, 344 36" />
          <line className="power-operating-line" x1={pointX} y1="142" x2={pointX} y2={pointY} />
          <circle className="power-operating-ring" cx={pointX} cy={pointY} r="13" />
          <circle className="power-operating-point" cx={pointX} cy={pointY} r="5" />
          <text x="42" y="158">cut-in</text>
          <text x="240" y="158">nominal</text>
          <text x="316" y="158">cut-out</text>
        </svg>

        <div className="power-flow-strip">
          <span />
          <i />
        </div>

        <div className="power-stage-labels">
          <span>Viento equiv. {formatDecimal(windMs, ' m/s')}</span>
          <span>{formatDecimal(expectedPower, ' MW')}</span>
        </div>
      </div>

      <div className="thermal-readouts power-readouts">
        <Stat label="Viento eq." value={formatDecimal(windMs, ' m/s')} detail="Derivado ESIOS" />
        <Stat label="Potencia" value={formatDecimal(expectedPower, ' MW')} detail="Turbina tipo" />
        <Stat label="Nominal" value={formatDecimal(ratedPower, ' MW')} detail="Referencia" />
        <Stat label="Factor" value={formatPercent(capacityFactor)} detail="Carga actual" />
      </div>

      <div className="thermal-note">
        <span className="hot-dot power-dot" />
        <p>El punto operativo usa la potencia ESIOS y un viento equivalente calculado desde esa generacion.</p>
      </div>
    </section>
  );
}

function OperationModePanel({ scada, open, onClose }) {
  if (!open) return null;

  const mode = scada?.operationMode ?? 'Calculando';
  const windMs = scada?.windSpeedMs ?? 0;
  const capacityFactor = scada?.capacityFactor ?? 0;
  const availability = scada?.availabilityPercent;
  const ratedPower = scada?.ratedPowerMw ?? 5.0;
  const expectedPower = scada?.expectedPowerMw ?? 0;
  const loadPercent = Math.min(100, Math.max(0, Math.round(capacityFactor * 100)));
  const needleAngle = -72 + Math.min(1, Math.max(0, capacityFactor)) * 144;

  return (
    <section
      className="thermal-panel operation-panel"
      aria-label="Detalle de potencia nominal y modo operativo"
      style={{ '--operation-load': `${loadPercent}%`, '--operation-needle': `${needleAngle}deg` }}
    >
      <div className="thermal-panel-head">
        <div>
          <span>Modo de operacion</span>
          <strong>Potencia nominal y disponibilidad</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar detalle de potencia nominal">
          x
        </button>
      </div>

      <div className="operation-stage">
        <div className="operation-gauge">
          <span className="gauge-arc arc-low" />
          <span className="gauge-arc arc-partial" />
          <span className="gauge-arc arc-rated" />
          <span className="gauge-needle" />
          <span className="gauge-hub" />
          <strong>{loadPercent}%</strong>
        </div>

        <div className="operation-states">
          <span className={loadPercent < 18 ? 'active' : ''}>cut-in</span>
          <span className={loadPercent >= 18 && loadPercent < 78 ? 'active' : ''}>parcial</span>
          <span className={loadPercent >= 78 && loadPercent < 96 ? 'active' : ''}>nominal</span>
          <span className={loadPercent >= 96 ? 'active' : ''}>limitacion</span>
        </div>

        <div className="operation-flow">
          <span className="flow-wind" />
          <span className="flow-rotor" />
          <span className="flow-grid" />
        </div>
      </div>

      <div className="thermal-readouts operation-readouts">
        <Stat label="Modo" value={mode} detail="Estado calculado" />
        <Stat label="Potencia" value={formatDecimal(expectedPower, ' MW')} detail="Salida estimada" />
        <Stat label="Nominal" value={formatDecimal(ratedPower, ' MW')} detail="Turbina tipo" />
        <Stat label="Disponib." value={formatDecimal(availability, '%')} detail={`${formatDecimal(windMs, ' m/s')} equiv.`} />
      </div>

      <div className="thermal-note">
        <span className="hot-dot operation-dot" />
        <p>La aguja usa la carga derivada de ESIOS y el flujo representa equivalente de viento, rotor y red.</p>
      </div>
    </section>
  );
}

export default function Dashboard({
  windData,
  error,
  loading,
  showStressMap,
  onStressMapChange,
  onRefresh,
}) {
  const [showThermalPanel, setShowThermalPanel] = useState(false);
  const [showPitchPanel, setShowPitchPanel] = useState(false);
  const [showYawPanel, setShowYawPanel] = useState(false);
  const [showPowerPanel, setShowPowerPanel] = useState(false);
  const [showOperationPanel, setShowOperationPanel] = useState(false);
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);
  const windMw = windData?.windMw ?? 0;
  const share = (windData?.share ?? 0) * 100;
  const hasMixShare = (windData?.totalMw ?? 0) > 0;
  const rpm = windData?.rpm ?? 0;
  const powerPercent = Math.round((windData?.rotorPower ?? windData?.normalizedPower ?? 0) * 100);
  const meteorology = windData?.meteorology;
  const windSpeed80m = meteorology?.windSpeed80mKmh ?? meteorology?.windSpeed10mKmh;
  const windGust = meteorology?.windGustKmh;
  const windSpread = typeof windGust === 'number' && typeof windSpeed80m === 'number' ? windGust - windSpeed80m : undefined;
  const tipSpeedMs = (2 * Math.PI * REPRESENTATIVE_ROTOR_RADIUS_METERS * rpm) / 60;
  const tipSpeedKmh = tipSpeedMs * 3.6;
  const mechanical = windData?.mechanical;
  const mechanicalLoad = mechanical?.mechanicalLoadPercent ?? 0;
  const towerSwayDeg = mechanical?.towerSwayDeg ?? 0;
  const towerTorsionDeg = mechanical?.towerTorsionDeg ?? 0;
  const bladeRootFlexDeg = mechanical?.bladeRootFlexDeg ?? 0;
  const scada = windData?.scada;
  const history = windData?.history ?? [];
  const generationArea = windData?.geoName ?? 'Península';
  const dataBasis = windData?.dataBasis ?? 'ESIOS';

  return (
    <>
    <aside className={`dashboard ${isDashboardCollapsed ? 'collapsed' : ''}`}>
      <button
        type="button"
        className="dashboard-collapse-toggle"
        onClick={() => {
          const nextCollapsed = !isDashboardCollapsed;
          setIsDashboardCollapsed(nextCollapsed);
          if (nextCollapsed) {
            setShowPitchPanel(false);
            setShowThermalPanel(false);
            setShowYawPanel(false);
            setShowPowerPanel(false);
            setShowOperationPanel(false);
          }
        }}
        aria-expanded={!isDashboardCollapsed}
        aria-label={isDashboardCollapsed ? 'Mostrar dashboard' : 'Minimizar dashboard'}
      >
        {isDashboardCollapsed ? <ChevronsUp size={17} /> : <ChevronsDown size={17} />}
        <span>{isDashboardCollapsed ? 'Mostrar dashboard' : 'Minimizar'}</span>
      </button>

      <div className="dashboard-title">
        <div className="status-icon">
          <Wind size={24} />
        </div>
        <div>
          <h1>Aerogenerador REE</h1>
          <p>{windData?.status ?? 'Esperando datos'}</p>
          <p className="dashboard-location">
            <MapPin size={13} />
            Datos electricos: {generationArea}
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <Stat label="Eólica" value={`${numberFormatter.format(windMw)} MW`} detail={generationArea} />
        <Stat
          label={hasMixShare ? 'Mix' : 'Factor carga'}
          value={`${percentFormatter.format(share)}%`}
          detail={hasMixShare ? 'Peso aproximado' : 'Sobre potencia instalada'}
        />
        <Stat
          label="Viento equiv."
          value={formatDecimal(windSpeed80m, ' km/h')}
          detail={`Derivado ${dataBasis}`}
        />
        <Stat
          label="Variación"
          value={formatDecimal(windSpread, ' km/h')}
          detail="Equivalente carga"
        />
        <Stat label="Rotor" value={`${rpm} rpm`} detail="Animación vinculada" />
        <Stat
          label="Punta pala"
          value={`${decimalFormatter.format(tipSpeedKmh)} km/h`}
          detail={`${decimalFormatter.format(tipSpeedMs)} m/s`}
        />
        <Stat
          className="last-update-stat"
          label="Último dato"
          value={formatDate(windData?.datetime)}
          detail={windData?.source ?? '--'}
        />
      </div>

      <div className="mechanics-grid">
        <Stat
          label="Oscilación torre"
          value={`${decimalFormatter.format(towerSwayDeg)}°`}
          detail="Estimación visual"
        />
        <Stat
          label="Torsión torre"
          value={`${decimalFormatter.format(towerTorsionDeg)}°`}
          detail="Por variación de carga"
        />
        <Stat
          label="Base pala"
          value={`${decimalFormatter.format(bladeRootFlexDeg)}°`}
          detail="Flexión estimada"
        />
        <Stat
          label="Carga mecánica"
          value={`${mechanicalLoad}%`}
          detail={mechanical?.state ?? 'Calculando'}
        />
      </div>

      <section className="scada-panel" aria-label="Panel SCADA">
        <button
          type="button"
          className={`scada-card operation-card operation-trigger ${showOperationPanel ? 'active' : ''}`}
          onClick={() => {
            setShowPitchPanel(false);
            setShowThermalPanel(false);
            setShowYawPanel(false);
            setShowPowerPanel(false);
            setShowOperationPanel((current) => !current);
          }}
          aria-expanded={showOperationPanel}
          aria-label="Abrir o cerrar detalle de potencia nominal"
        >
          <span>Modo operativo</span>
          <strong>{scada?.operationMode ?? 'Calculando'}</strong>
          <small>Disponibilidad {formatDecimal(scada?.availabilityPercent, '%')}</small>
          <div className="alarm-strip">
            <AlarmList alarms={scada?.alarms} />
          </div>
          <em>{showOperationPanel ? 'Ocultar detalle' : 'Ver detalle'}</em>
        </button>

        <button
          type="button"
          className={`scada-card chart-card power-trigger ${showPowerPanel ? 'active' : ''}`}
          onClick={() => {
            setShowPitchPanel(false);
            setShowThermalPanel(false);
            setShowYawPanel(false);
            setShowOperationPanel(false);
            setShowPowerPanel((current) => !current);
          }}
          aria-expanded={showPowerPanel}
          aria-label="Abrir o cerrar detalle de curva de potencia"
        >
          <span>Curva de potencia</span>
          <strong>{formatDecimal(scada?.expectedPowerMw, ' MW')}</strong>
          <small>{formatPercent(scada?.capacityFactor)} de turbina tipo</small>
          <PowerCurve scada={scada} />
          <em>{showPowerPanel ? 'Ocultar detalle' : 'Ver detalle'}</em>
        </button>

        <button
          type="button"
          className={`scada-card rose-card yaw-trigger ${showYawPanel ? 'active' : ''}`}
          onClick={() => {
            setShowPitchPanel(false);
            setShowThermalPanel(false);
            setShowPowerPanel(false);
            setShowOperationPanel(false);
            setShowYawPanel((current) => !current);
          }}
          aria-expanded={showYawPanel}
          aria-label="Abrir o cerrar detalle de rosa de viento y yaw"
        >
          <span>Rosa de viento / yaw</span>
          <strong>{formatDecimal(scada?.yawMisalignmentDeg, ' deg')}</strong>
          <small>Dirección derivada {formatDirection(scada?.windDirectionDeg)} · Gondola {formatDirection(scada?.nacelleDirectionDeg)}</small>
          <WindRose scada={scada} />
          <em>{showYawPanel ? 'Ocultar detalle' : 'Ver detalle'}</em>
        </button>

        <button
          type="button"
          className={`scada-card pitch-trigger ${showPitchPanel ? 'active' : ''}`}
          onClick={() => {
            setShowThermalPanel(false);
            setShowYawPanel(false);
            setShowPowerPanel(false);
            setShowOperationPanel(false);
            setShowPitchPanel((current) => !current);
          }}
          aria-expanded={showPitchPanel}
          aria-label="Abrir o cerrar detalle de pitch y condicion"
        >
          <span>Pitch y condicion</span>
          <strong>{formatDecimal(scada?.pitchAngleDeg, ' deg')}</strong>
          <small>Vibracion {formatDecimal(scada?.vibrationMmS, ' mm/s')}</small>
          <ComponentMatrix components={scada?.components} />
          <em>{showPitchPanel ? 'Ocultar detalle' : 'Ver detalle'}</em>
        </button>

        <button
          type="button"
          className={`scada-card thermal-trigger ${showThermalPanel ? 'active' : ''}`}
          onClick={() => {
            setShowPitchPanel(false);
            setShowYawPanel(false);
            setShowPowerPanel(false);
            setShowOperationPanel(false);
            setShowThermalPanel((current) => !current);
          }}
          aria-expanded={showThermalPanel}
          aria-label="Abrir o cerrar detalle termico del gearbox"
        >
          <span>Temperaturas</span>
          <strong>{formatDecimal(scada?.generatorTempC, ' C')}</strong>
          <small>Gearbox {formatDecimal(scada?.gearboxTempC, ' C')} · Aceite {formatDecimal(scada?.oilTempC, ' C')}</small>
          <em>{showThermalPanel ? 'Ocultar detalle' : 'Ver detalle'}</em>
          <HistoryLine history={history} />
        </button>
      </section>

      <div className="dashboard-actions">
        <label className="stress-toggle">
          <input
            type="checkbox"
            checked={showStressMap}
            onChange={(event) => onStressMapChange(event.target.checked)}
          />
          <span className="stress-check" aria-hidden="true" />
          <span className="stress-copy">
            <strong>Análisis mecánico</strong>
            <small>Estrés y movimiento</small>
          </span>
        </label>
        <div className="power-core" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(0.08, powerPercent / 100)})` }} />
        </div>
        <span className={error ? 'connection offline' : 'connection online'}>
          <Signal size={16} />
          {error ? 'Simulación activa' : `Conectado a ${dataBasis}`}
        </span>
        <button type="button" onClick={onRefresh} disabled={loading} aria-label="Actualizar datos">
          <RefreshCw size={17} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {error ? <p className="error-line">{error}</p> : null}
    </aside>
    <GearboxThermalPanel scada={scada} open={showThermalPanel} onClose={() => setShowThermalPanel(false)} />
    <PitchConditionPanel scada={scada} open={showPitchPanel} onClose={() => setShowPitchPanel(false)} />
    <WindYawPanel scada={scada} open={showYawPanel} onClose={() => setShowYawPanel(false)} />
    <PowerCurvePanel scada={scada} open={showPowerPanel} onClose={() => setShowPowerPanel(false)} />
    <OperationModePanel scada={scada} open={showOperationPanel} onClose={() => setShowOperationPanel(false)} />
    </>
  );
}

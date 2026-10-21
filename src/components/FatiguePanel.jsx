import { FATIGUE_ZONES } from './fatigueZones.js';

export default function FatiguePanel({ activeView, onSelectView, onClose }) {
  return (
    <section className="fatigue-panel" aria-label="DEL y zonas críticas de fatiga">
      <div className="fatigue-heading"><span>ANÁLISIS DE FATIGA</span><button type="button" onClick={onClose} aria-label="Cerrar vista DEL">×</button></div>
      <h1>DEL<span>Damage Equivalent Load</span></h1>
      <p className="fatigue-caption">MAPA ILUSTRATIVO · DEL NO CALCULADO</p>
      <p className="fatigue-intro">Localiza las uniones sometidas a cargas cíclicas en el modelo de Blender.</p>
      <div className="fatigue-legend"><i /><span>Menor énfasis</span><span>Zonas críticas</span></div>
      <div className="fatigue-zones" aria-label="Ampliar una zona de fatiga">
        {FATIGUE_ZONES.map(zone => <button type="button" key={zone.view} aria-pressed={activeView === zone.view} onClick={() => onSelectView(zone.view)}>
          <span className="fatigue-zone-dot" /><span><strong>{zone.label}</strong><small>{zone.description}</small></span><span aria-hidden="true">↗</span>
        </button>)}
      </div>
      <p className="fatigue-scope"><strong>Mapa ilustrativo · DEL no calculado</strong>El color señala zonas de atención por fatiga. Para obtener un DEL se necesita el historial de cargas y sus ciclos; ESIOS aporta generación agregada.</p>
      <details><summary>¿Qué representa el DEL?</summary><p>Es una carga cíclica equivalente que produce el mismo daño por fatiga que una historia de cargas variables, para un material y un número de ciclos de referencia.</p><code>DEL = (Σ nᵢ · Lᵢᵐ / Nₑq)¹/ᵐ</code><p>Lᵢ: rango de carga · nᵢ: ciclos · m: pendiente S-N · Nₑq: ciclos de referencia.</p><a href="https://wes.copernicus.org/articles/7/1171/2022/" target="_blank" rel="noopener noreferrer">Referencia técnica · Wind Energy Science ↗</a></details>
    </section>
  );
}

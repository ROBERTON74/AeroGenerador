// Reference locations for an illustrative fatigue map, not computed DEL values.
export const FATIGUE_ZONES = [
  { view: 'del', label: 'Raíces de pala y buje', description: 'Flexión cíclica y transmisión de cargas.' },
  { view: 'del-nacelle', label: 'Unión rotor–góndola', description: 'Rodamientos, conexiones y orientación.' },
  { view: 'del-base', label: 'Base de la torre', description: 'Flexión de torre y unión a cimentación.' },
];

export function fatigueZoneForMesh(name, parentName = '') {
  const combined = `${name} ${parentName}`;
  if (/pala_\d_70m/.test(combined)) return 'blade';
  if (/SUPER_ROOT|PRECISION_(SOCKET|ROOT)|ROTOR_(DETAIL|BOLT)_blade/.test(combined)) return 'root';
  if (/yaw_|bearing|rodamiento/i.test(combined)) return 'bearing';
  if (/HUB|spinner|AERO_spinner/.test(combined)) return 'hub';
  if (/^(TOWER|torre_|brida_|puerta_|maneta_|IB_CORRECT_tower)/.test(name)) return 'tower';
  return 'body';
}

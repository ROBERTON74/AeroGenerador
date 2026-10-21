export interface WindScenario {
  wind: number; diameter: number; cp: number; ct: number; density: number;
  hours: number; fuelKwhPerLitre: number; thermalEfficiency: number;
}
export const DEFAULT_SCENARIO: WindScenario = {
  wind: 8, diameter: 145, cp: 0.45, ct: 0.8, density: 1.225,
  hours: 1, fuelKwhPerLitre: 10, thermalEfficiency: 0.4,
};
const bounded = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
export function calculateWind(input: WindScenario) {
  const wind = bounded(input.wind, 0, 30, 0);
  const diameter = bounded(input.diameter, 60, 200, 145);
  const cp = bounded(input.cp, 0, 16 / 27, 0.45);
  const ct = bounded(input.ct, 0, 1.2, 0.8);
  const density = bounded(input.density, 0.9, 1.4, 1.225);
  const hours = bounded(input.hours, 0, 24, 1);
  const fuelEnergy = bounded(input.fuelKwhPerLitre, 1, 15, 10);
  const thermalEfficiency = bounded(input.thermalEfficiency, 0.1, 0.65, 0.4);
  const area = Math.PI * (diameter / 2) ** 2;
  const windMw = 0.5 * density * area * wind ** 3 / 1e6;
  const operating = wind >= 3 && wind < 25;
  const electricMw = operating ? Math.min(5, windMw * cp * 0.94) : 0;
  // Constant Ct is a scenario assumption, including while electrical output stops.
  const thrustKn = 0.5 * density * area * ct * wind ** 2 / 1000;
  const thrustReferenceMw = thrustKn * wind / 1000;
  const energyMwh = electricMw * hours;
  const fuelLitres = energyMwh * 1000 / (fuelEnergy * thermalEfficiency);
  const state = wind < 3 ? 'Esperando viento' : wind >= 25 ? 'Parada por viento alto' : electricMw >= 5 ? 'Potencia nominal' : 'En generación';
  return { wind, area, windMw, electricMw, thrustKn, thrustReferenceMw, energyMwh, fuelLitres, operating, state, loadPercent: electricMw / 5 * 100 };
}

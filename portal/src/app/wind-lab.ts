import { Component, signal } from '@angular/core';
import { AnimatedNumber } from './animated-number';
import { calculateWind, DEFAULT_SCENARIO, WindScenario } from './wind-model';
@Component({ selector: 'app-wind-lab', imports: [AnimatedNumber], templateUrl: './wind-lab.html', styleUrl: './wind-lab.css' })
export class WindLab {
  readonly Math = Math;
  readonly scenario = signal<WindScenario>({ ...DEFAULT_SCENARIO });
  readonly selection = signal('electric');
  readonly paused = signal(false);
  get result() { return calculateWind(this.scenario()); }
  readonly presets = [{ wind: 5, label: 'Brisa' }, { wind: 12, label: 'Intenso' }, { wind: 20, label: 'Fuerte' }, { wind: 28, label: 'Parada' }];
  readonly controls: { key: keyof WindScenario; label: string; unit: string; min: number; max: number; step: number; digits: number }[] = [
    { key: 'wind', label: 'Velocidad del viento', unit: 'm/s', min: 0, max: 30, step: 0.5, digits: 1 },
    { key: 'diameter', label: 'Diámetro del rotor', unit: 'm', min: 60, max: 200, step: 1, digits: 0 },
    { key: 'cp', label: 'Coeficiente de potencia · Cp', unit: '', min: 0, max: 0.59, step: 0.01, digits: 2 },
    { key: 'ct', label: 'Coeficiente de empuje · Ct', unit: '', min: 0, max: 1.2, step: 0.01, digits: 2 },
    { key: 'density', label: 'Densidad del aire', unit: 'kg/m³', min: 0.9, max: 1.4, step: 0.005, digits: 3 },
    { key: 'hours', label: 'Duración del escenario', unit: 'h', min: 0, max: 24, step: 0.5, digits: 1 },
  ];
  readonly details: Record<string, { title: string; formula: string; text: string }> = {
    electric: { title: 'Potencia eléctrica estimada', formula: 'P = min(5 MW, ½ ρ A v³ Cp × 0,94)', text: 'Escenario de una turbina tipo de 5 MW. Rendimiento del tren eléctrico supuesto: 94 %. Arranque a 3 m/s y parada a 25 m/s. Cp constante elegido por ti; no es una curva certificada del fabricante.' },
    wind: { title: 'Potencia disponible en el viento', formula: 'Pviento = ½ ρ A v³ · A = π D² / 4', text: 'Flujo de energía cinética que atraviesa el área del rotor antes de extraer energía. Al duplicar el viento se multiplica por ocho. No toda esa energía se convierte en electricidad.' },
    thrust: { title: 'Fuerza de empuje sobre el rotor', formula: 'T = ½ ρ A Ct v²', text: 'Carga axial estimada en kilonewtons. Crece con el cuadrado del viento. Ct es un supuesto independiente y constante; en una turbina real depende de pitch, control y estado operativo, incluso durante una parada.' },
    thrustPower: { title: 'Potencia de referencia del empuje', formula: 'Preferencia = T × v∞', text: 'Producto del empuje por la velocidad del viento libre, expresado en MW para comparar magnitudes. No es potencia eléctrica ni potencia mecánica entregada a una torre fija: para trabajo mecánico se necesita la velocidad del punto de aplicación. No se suma a la generación.' },
    energy: { title: 'Energía del escenario', formula: 'E = P eléctrica × duración', text: 'Energía en MWh suponiendo que el viento, Cp y las demás condiciones permanecen constantes durante todas las horas seleccionadas. No representa un pronóstico ni producción medida.' },
    fuel: { title: 'Combustible fósil equivalente evitado', formula: 'Litros = E[kWh] / (PCI[kWh/L] × η térmica)', text: 'Comparación hipotética con un generador térmico que produjera la misma electricidad. El aerogenerador no quema combustible. Los valores iniciales de 10 kWh/L y 40 % son supuestos editables, no datos de un combustible concreto ni ahorro medido de la red.' },
  };
  get cards() {
    const r = this.result;
    return [
      { id: 'electric', label: 'Potencia eléctrica', value: r.electricMw, unit: 'MW', tag: 'Turbina tipo · máx. 5 MW' },
      { id: 'wind', label: 'Potencia del viento', value: r.windMw, unit: 'MW', tag: 'Flujo disponible en el rotor' },
      { id: 'thrust', label: 'Fuerza de empuje', value: r.thrustKn, unit: 'kN', tag: 'Carga axial · Ct configurable' },
      { id: 'thrustPower', label: 'Empuje · referencia T × v', value: r.thrustReferenceMw, unit: 'MW', tag: 'No equivale a generación' },
      { id: 'energy', label: 'Energía del escenario', value: r.energyMwh, unit: 'MWh', tag: 'Condiciones constantes' },
      { id: 'fuel', label: 'Combustible evitado', value: r.fuelLitres, unit: 'L equiv.', tag: 'Comparación térmica hipotética' },
    ];
  }
  setControl(key: keyof WindScenario, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (!Number.isFinite(value)) return;
    const range = this.controls.find(control => control.key === key) ?? (key === 'fuelKwhPerLitre' ? { min: 1, max: 15 } : { min: 0.1, max: 0.65 });
    const safeValue = Math.min(range.max, Math.max(range.min, value));
    this.scenario.update(current => ({ ...current, [key]: safeValue }));
    input.value = String(safeValue);
  }
  preset(wind: number) { this.scenario.update(current => ({ ...current, wind })); }
  reset() { this.scenario.set({ ...DEFAULT_SCENARIO }); this.selection.set('electric'); }
  format(value: number, digits = 1) { return new Intl.NumberFormat('es-ES', { maximumFractionDigits: digits }).format(value); }
}

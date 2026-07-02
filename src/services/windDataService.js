const REE_API_BASE = '/ree-api';
const ESIOS_API_BASE = '/esios-api';
const SPANISH_WIND_INSTALLED_CAPACITY_MW = 31679;
const REPRESENTATIVE_TURBINE_RATED_MW = 5.0;
const ELECTRIC_SYSTEM_LABEL = 'Peninsula';

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toApiDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function getLatestValue(values = []) {
  return values
    .filter((entry) => typeof entry.value === 'number')
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0];
}

function toIsoDate(date) {
  return date.toISOString().replace('.000Z', 'Z');
}

function deriveEquivalentWindFromPower(rotorPower = 0) {
  const load = clamp01(rotorPower);
  if (load <= 0.01) return 0;
  if (load <= 0.92) return 3 + Math.cbrt(load) * 9;
  return 12 + ((load - 0.92) / 0.08) * 3;
}

function estimateRepresentativeRotorRpm(loadFactor = 0) {
  const load = clamp01(loadFactor);
  if (load <= 0.01) return 0;
  return Math.round(clamp(4.5 + Math.sqrt(load) * 7.8, 4.5, 12.8));
}

function normalizeAngleDelta(angleA = 0, angleB = 0) {
  return Math.abs((((angleA - angleB + 540) % 360) + 360) % 360 - 180);
}

function getOperationMode(windSpeedMs, rotorPower) {
  if (windSpeedMs < 3) return 'Bajo cut-in';
  if (windSpeedMs >= 25) return 'Parada por seguridad';
  if (windSpeedMs >= 20) return 'Limitacion por equivalente alto';
  if (rotorPower > 0.82) return 'Potencia nominal';
  return 'Produccion parcial';
}

function estimatePowerCurve(windSpeedMs) {
  const cutIn = 3;
  const rated = 12;
  const cutOut = 25;

  if (windSpeedMs < cutIn || windSpeedMs >= cutOut) return 0;
  if (windSpeedMs >= rated) return REPRESENTATIVE_TURBINE_RATED_MW;

  const ramp = (windSpeedMs - cutIn) / (rated - cutIn);
  return REPRESENTATIVE_TURBINE_RATED_MW * Math.pow(clamp01(ramp), 3);
}

function getSeverityLabel(score) {
  if (score >= 0.72) return 'critico';
  if (score >= 0.46) return 'vigilancia';
  return 'normal';
}

function createWindMetrics({ windMw, totalMw = 0, share, datetime, source, statusPrefix, rawTitle, geoName }) {
  const normalizedPower = clamp01(windMw / SPANISH_WIND_INSTALLED_CAPACITY_MW);
  const computedShare = share ?? (totalMw > 0 ? windMw / totalMw : normalizedPower);
  const rpm = estimateRepresentativeRotorRpm(normalizedPower);

  return {
    windMw,
    totalMw,
    share: computedShare,
    rpm,
    normalizedPower,
    rotorPower: normalizedPower,
    installedCapacityMw: SPANISH_WIND_INSTALLED_CAPACITY_MW,
    datetime,
    source,
    geoName: geoName ?? ELECTRIC_SYSTEM_LABEL,
    status:
      statusPrefix ??
      (windMw > 12000 ? 'Generacion alta' : windMw > 6500 ? 'Generacion media' : 'Generacion baja'),
    rawTitle,
  };
}

export function estimateMechanicalLoads(currentData, previousData) {
  const loadFactor = clamp01(currentData?.rotorPower ?? currentData?.normalizedPower ?? 0);
  const shareFactor = clamp01(currentData?.share ?? loadFactor);
  const windMw = currentData?.windMw ?? 0;
  const previousWindMw = previousData?.windMw;
  const variationMw = typeof previousWindMw === 'number' ? Math.abs(windMw - previousWindMw) : 0;
  const variationReference = Math.max(1200, windMw * 0.18);
  const gustSpreadKmh =
    typeof currentData?.meteorology?.windGustKmh === 'number' &&
    typeof currentData?.meteorology?.windSpeed10mKmh === 'number'
      ? Math.max(0, currentData.meteorology.windGustKmh - currentData.meteorology.windSpeed10mKmh)
      : 0;
  const gustFactor = clamp01(gustSpreadKmh / 28);
  const variationFactor = Math.max(clamp01(variationMw / variationReference), gustFactor);

  const towerSwayDeg = 0.03 + loadFactor * 0.28 + variationFactor * 0.14;
  const towerTorsionDeg = 0.008 + loadFactor * 0.035 + variationFactor * 0.16;
  const bladeRootFlexDeg = 0.18 + loadFactor * 1.35 + variationFactor * 0.28;
  const mechanicalLoadPercent = Math.round(
    Math.min(100, loadFactor * 72 + variationFactor * 22 + shareFactor * 6),
  );
  const rpm = currentData?.rpm ?? estimateRepresentativeRotorRpm(loadFactor);
  const ratedPowerMw = REPRESENTATIVE_TURBINE_RATED_MW;
  const estimatedPowerMw = ratedPowerMw * loadFactor;
  const angularVelocityRadS = Math.max(0.18, (rpm * Math.PI * 2) / 60);
  const torqueMNm = estimatedPowerMw / angularVelocityRadS;
  const thrustKN = Math.round(180 + loadFactor * 720 + variationFactor * 210);
  const bladeRootMomentMNm = Number((4.2 + loadFactor * 10.8 + variationFactor * 2.6).toFixed(2));
  const towerForeAftMm = Number((18 + loadFactor * 74 + variationFactor * 24).toFixed(1));
  const towerLateralMm = Number((10 + loadFactor * 42 + variationFactor * 30).toFixed(1));
  const nacelleAccelerationMS2 = Number((0.018 + loadFactor * 0.18 + variationFactor * 0.11).toFixed(3));
  const bladeTipDeflectionM = Number((1.2 + loadFactor * 5.8 + variationFactor * 1.4).toFixed(2));
  const drivetrainTorqueMNm = Number(torqueMNm.toFixed(2));
  const gearboxInputRpm = rpm;
  const gearboxOutputRpm = Math.round(rpm * 97);

  return {
    loadFactor,
    variationFactor,
    towerSwayDeg,
    towerTorsionDeg,
    bladeRootFlexDeg,
    mechanicalLoadPercent,
    thrustKN,
    bladeRootMomentMNm,
    towerForeAftMm,
    towerLateralMm,
    nacelleAccelerationMS2,
    bladeTipDeflectionM,
    drivetrainTorqueMNm,
    gearboxInputRpm,
    gearboxOutputRpm,
    state:
      variationFactor > 0.55
        ? 'Carga variable'
        : mechanicalLoadPercent > 72
          ? 'Carga alta'
          : mechanicalLoadPercent > 42
            ? 'Carga media'
            : 'Carga baja',
  };
}

export function deriveScadaMetrics(currentData, previousData) {
  const meteorology = currentData?.meteorology ?? {};
  const windSpeedKmh = meteorology.windSpeed80mKmh ?? meteorology.windSpeed10mKmh ?? 0;
  const windSpeedMs = windSpeedKmh / 3.6;
  const windDirectionDeg = meteorology.windDirection80mDeg ?? meteorology.windDirection10mDeg ?? 0;
  const rotorPower = clamp01(currentData?.rotorPower ?? currentData?.normalizedPower ?? 0);
  const mechanicalLoad = currentData?.mechanical?.mechanicalLoadPercent ?? 0;
  const gustSpread =
    typeof meteorology.windGustKmh === 'number'
      ? Math.max(0, meteorology.windGustKmh - (meteorology.windSpeed10mKmh ?? windSpeedKmh))
      : 0;

  const yawOffset = Math.min(18, 3 + gustSpread * 0.18 + (previousData?.mechanical?.variationFactor ?? 0) * 8);
  const nacelleDirectionDeg = (windDirectionDeg - yawOffset + 360) % 360;
  const yawMisalignmentDeg = normalizeAngleDelta(windDirectionDeg, nacelleDirectionDeg);
  const pitchAngleDeg =
    windSpeedMs < 3 ? 0 : windSpeedMs < 12 ? 1.5 + rotorPower * 4.5 : 6 + (windSpeedMs - 12) * 1.4;
  const expectedPowerMw = estimatePowerCurve(windSpeedMs);
  const operationMode = getOperationMode(windSpeedMs, rotorPower);
  const capacityFactor = clamp01(expectedPowerMw / REPRESENTATIVE_TURBINE_RATED_MW);

  const gearboxTempC = clamp(38 + rotorPower * 22 + mechanicalLoad * 0.08, 35, 82);
  const generatorTempC = clamp(42 + rotorPower * 27 + mechanicalLoad * 0.1, 38, 92);
  const oilTempC = clamp(36 + rotorPower * 18 + mechanicalLoad * 0.065, 32, 72);
  const vibrationMmS = clamp(0.45 + rotorPower * 1.25 + Math.min(1.15, gustSpread / 22), 0.35, 3.2);

  const alarms = [
    gustSpread > 28
      ? {
          level: 'warning',
          label: 'Variacion equivalente alta',
          detail: `${Math.round(gustSpread)} km/h sobre equivalente medio`,
        }
      : null,
    yawMisalignmentDeg > 12
      ? { level: 'warning', label: 'Yaw misalignment', detail: `${yawMisalignmentDeg.toFixed(1)} deg` }
      : null,
    mechanicalLoad > 78
      ? { level: 'critical', label: 'Carga mecanica alta', detail: `${mechanicalLoad}%` }
      : null,
    windSpeedMs >= 20
      ? { level: 'warning', label: 'Equivalente alto', detail: `${windSpeedMs.toFixed(1)} m/s derivados` }
      : null,
  ].filter(Boolean);

  const availabilityPercent = Math.max(
    88,
    Math.round(99.2 - alarms.filter((alarm) => alarm.level !== 'info').length * 2.4 - mechanicalLoad * 0.035),
  );

  const components = [
    { label: 'Palas', state: getSeverityLabel(rotorPower * 0.45 + gustSpread / 60) },
    { label: 'Buje', state: getSeverityLabel(mechanicalLoad / 130 + yawMisalignmentDeg / 70) },
    { label: 'Gearbox', state: getSeverityLabel((gearboxTempC - 45) / 55 + vibrationMmS / 12) },
    { label: 'Generador', state: getSeverityLabel((generatorTempC - 48) / 62 + rotorPower * 0.2) },
    { label: 'Torre', state: getSeverityLabel(mechanicalLoad / 120 + (currentData?.mechanical?.towerSwayDeg ?? 0) / 1.1) },
  ];

  return {
    site: meteorology.site,
    operationMode,
    windSpeedMs,
    windDirectionDeg,
    nacelleDirectionDeg,
    yawMisalignmentDeg,
    pitchAngleDeg: Math.min(28, pitchAngleDeg),
    expectedPowerMw,
    ratedPowerMw: REPRESENTATIVE_TURBINE_RATED_MW,
    capacityFactor,
    availabilityPercent,
    gearboxTempC,
    generatorTempC,
    oilTempC,
    vibrationMmS,
    alarms,
    components,
    estimateMethod:
      'ESIOS 551 real; viento, rpm, temperaturas y cargas calibradas por factor de capacidad eolica agregada',
  };
}

function applyEsiosDerivedOperationalContext(generationData) {
  const rotorPower = clamp01(generationData.rotorPower ?? generationData.normalizedPower ?? 0);
  const equivalentWindMs = deriveEquivalentWindFromPower(rotorPower);
  const equivalentWindKmh = equivalentWindMs * 3.6;
  const equivalentSpreadKmh = 2 + rotorPower * 8;
  const directionDeg = (245 + rotorPower * 42) % 360;

  return {
    ...generationData,
    rotorPower,
    rpm: estimateRepresentativeRotorRpm(rotorPower),
    meteorology: {
      site: generationData.geoName ?? ELECTRIC_SYSTEM_LABEL,
      datetime: generationData.datetime,
      windSpeed10mKmh: equivalentWindKmh * 0.82,
      windSpeed80mKmh: equivalentWindKmh,
      windSpeed120mKmh: equivalentWindKmh * 1.06,
      windDirection10mDeg: directionDeg,
      windDirection80mDeg: directionDeg,
      windGustKmh: equivalentWindKmh + equivalentSpreadKmh,
      source: 'Derivado de ESIOS 551',
      derived: true,
    },
    status: `${generationData.status}  - base ESIOS`,
    dataBasis: generationData.source?.startsWith('ESIOS') ? 'ESIOS' : 'REData',
    estimateMethod:
      'Generacion eolica real normalizada contra potencia instalada eolica espanola y convertida a equivalentes de turbina tipo',
  };
}

function normalizeGenerationResponse(payload) {
  const indicators = payload?.included ?? [];
  const windIndicator = indicators.find((item) =>
    item?.attributes?.title
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .includes('eolica'),
  );
  const latestWind = getLatestValue(windIndicator?.attributes?.values);

  if (!windIndicator || !latestWind) {
    throw new Error('No se encontro el indicador de generacion eolica en REData.');
  }

  const totalMw = indicators.reduce((sum, item) => {
    const latest = getLatestValue(item?.attributes?.values);
    return sum + (latest?.value ?? 0);
  }, 0);

  return createWindMetrics({
    windMw: latestWind.value,
    totalMw,
    share: latestWind.percentage,
    datetime: latestWind.datetime,
    source: 'Red Electrica de Espana - REData',
    rawTitle: windIndicator.attributes.title,
    geoName: ELECTRIC_SYSTEM_LABEL,
  });
}

function normalizeEsiosResponse(payload) {
  const values = payload?.indicator?.values ?? [];
  const latest = getLatestValue(values);

  if (!latest) {
    throw new Error('ESIOS no devolvio valores recientes para el indicador 551.');
  }

  return createWindMetrics({
    windMw: latest.value,
    datetime: latest.datetime,
    source: 'ESIOS indicador 551 - Generacion T.Real eolica',
    statusPrefix: 'Tiempo real ESIOS',
    rawTitle: payload?.indicator?.name ?? 'Generacion T.Real eolica',
    geoName: latest.geo_name ?? ELECTRIC_SYSTEM_LABEL,
  });
}

async function fetchEsiosRealtimeWind() {
  const end = new Date();
  const start = new Date(end.getTime() - 6 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    start_date: toIsoDate(start),
    end_date: toIsoDate(end),
    time_trunc: 'five_minutes',
  });

  const response = await fetch(`${ESIOS_API_BASE}/indicators/551?${params.toString()}`, {
    headers: {
      Accept: 'application/json; application/vnd.esios-api-v1+json',
    },
  });

  if (!response.ok) {
    throw new Error(`ESIOS respondio con HTTP ${response.status}. Revisa VITE_ESIOS_API_KEY.`);
  }

  return normalizeEsiosResponse(await response.json());
}

async function fetchReeDailyWind() {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    start_date: toApiDate(start),
    end_date: toApiDate(end),
    time_trunc: 'day',
    geo_trunc: 'electric_system',
    geo_limit: 'peninsular',
    geo_ids: '8741',
  });

  const response = await fetch(
    `${REE_API_BASE}/es/datos/generacion/estructura-generacion?${params.toString()}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`REData respondio con HTTP ${response.status}.`);
  }

  const data = normalizeGenerationResponse(await response.json());

  return {
    ...data,
    source: 'REData publico diario - respaldo sin token ESIOS',
    status: `${data.status} (dato diario)`,
  };
}

export async function fetchWindGeneration() {
  const generationData = await fetchEsiosRealtimeWind().catch(async (esiosError) => {
    try {
      return await fetchReeDailyWind();
    } catch (reeError) {
      throw new Error(`${esiosError.message} / ${reeError.message}`);
    }
  });

  return applyEsiosDerivedOperationalContext(generationData);
}

export function createFallbackWindData() {
  const phase = (Date.now() / 1000) % 60;
  const normalizedPower = 0.38 + Math.sin(phase / 7) * 0.08;
  const fallbackSpeed = 22 + Math.sin(phase / 6) * 5;
  const meteorology = {
    site: ELECTRIC_SYSTEM_LABEL,
    datetime: new Date().toISOString(),
    windSpeed10mKmh: fallbackSpeed * 0.82,
    windSpeed80mKmh: fallbackSpeed,
    windSpeed120mKmh: fallbackSpeed * 1.08,
    windDirection10mDeg: 260,
    windDirection80mDeg: 270,
    windGustKmh: fallbackSpeed + 8,
    source: 'simulacion local',
  };

  return {
    windMw: 9000 + normalizedPower * 5000,
    totalMw: 32000,
    share: normalizedPower,
    rpm: estimateRepresentativeRotorRpm(normalizedPower),
    normalizedPower,
    rotorPower: normalizedPower,
    installedCapacityMw: SPANISH_WIND_INSTALLED_CAPACITY_MW,
    meteorology,
    datetime: new Date().toISOString(),
    source: 'Simulacion local mientras responde REData/ESIOS',
    geoName: ELECTRIC_SYSTEM_LABEL,
    status: 'Modo simulacion',
    rawTitle: 'Eolica',
  };
}



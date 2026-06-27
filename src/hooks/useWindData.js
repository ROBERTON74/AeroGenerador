import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createFallbackWindData,
  deriveScadaMetrics,
  estimateMechanicalLoads,
  fetchWindGeneration,
} from '../services/windDataService.js';

const POLL_INTERVAL = 5 * 60 * 1000;
const HISTORY_LIMIT = 18;

function appendHistory(history, nextData) {
  const scada = nextData?.scada;
  const point = {
    time: nextData?.meteorology?.datetime ?? nextData?.datetime ?? new Date().toISOString(),
    windSpeedMs: scada?.windSpeedMs ?? 0,
    rpm: nextData?.rpm ?? 0,
    load: nextData?.mechanical?.mechanicalLoadPercent ?? 0,
    expectedPowerMw: scada?.expectedPowerMw ?? 0,
  };

  return [...history, point].slice(-HISTORY_LIMIT);
}

export function useWindData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const historyRef = useRef([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const nextData = await fetchWindGeneration();
      setData((currentData) => ({
        ...(() => {
          const mechanical = estimateMechanicalLoads(nextData, currentData);
          const enrichedData = {
            ...nextData,
            mechanical,
          };
          const scada = deriveScadaMetrics(enrichedData, currentData);
          const withScada = {
            ...enrichedData,
            scada,
          };
          historyRef.current = appendHistory(historyRef.current, withScada);
          return {
            ...withScada,
            history: historyRef.current,
          };
        })(),
      }));
      setError(null);
    } catch (requestError) {
      setData((currentData) => {
        const fallbackData = currentData ?? createFallbackWindData();
        const enrichedData = {
          ...fallbackData,
          mechanical: estimateMechanicalLoads(fallbackData, currentData),
        };
        const withScada = {
          ...enrichedData,
          scada: deriveScadaMetrics(enrichedData, currentData),
        };
        historyRef.current = appendHistory(historyRef.current, withScada);

        return {
          ...withScada,
          history: historyRef.current,
        };
      });
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = window.setInterval(refresh, POLL_INTERVAL);
    return () => window.clearInterval(timerRef.current);
  }, [refresh]);

  return { data, loading, error, refresh };
}

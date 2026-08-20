import { useState, useEffect, useCallback, useRef } from "react";
import {
  getLocations,
  convertLocationToPlace,
} from "../services/locationService";
import type { Place } from "../components/map/types";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CacheData {
  data: Place[];
  timestamp: number;
}

let cache: CacheData | null = null;

export const useLocations = () => {
  const [locations, setLocations] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isMounted = useRef(true);

  const fetchLocations = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        setLocations(cache.data);
        setLoading(false);
        return;
      }

      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await getLocations(1, 100);
      
      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Resposta da API inválida");
      }

      const places = response.data.map(convertLocationToPlace);
      
      cache = { data: places, timestamp: Date.now() };

      if (isMounted.current) {
        setLocations(places);
      }
    } catch (err) {
      if (isMounted.current) {
        setError("Erro ao carregar locais. Verifique sua conexão.");
        if (cache) {
          setLocations(cache.data);
        } else {
          setLocations([]);
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchLocations();
    return () => { isMounted.current = false; };
  }, [fetchLocations]);

  const refresh = useCallback(() => {
    fetchLocations(true);
  }, [fetchLocations]);

  return { locations, loading, error, refreshing, refresh };
};

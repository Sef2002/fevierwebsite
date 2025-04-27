import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Service } from '../types';

const CACHE_TIME = 1000 * 60 * 60; // 1 hour

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
    staleTime: CACHE_TIME,
    cacheTime: CACHE_TIME,
  });
}
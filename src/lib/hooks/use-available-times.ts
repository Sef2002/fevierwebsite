import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { format } from 'date-fns';

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00'
];

export function useAvailableTimes(date: Date | null, serviceId: string | null) {
  return useQuery({
    queryKey: ['available-times', date?.toISOString(), serviceId],
    queryFn: async () => {
      if (!date || !serviceId) return [];

      const formattedDate = format(date, 'yyyy-MM-dd');

      const { data: bookedSlots, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', formattedDate)
        .eq('service_id', serviceId)
        .neq('status', 'cancelled');

      if (error) throw error;

      const bookedTimes = new Set(bookedSlots.map(slot => slot.appointment_time));
      return TIME_SLOTS.filter(time => !bookedTimes.has(time));
    },
    enabled: !!date && !!serviceId,
  });
}
import { z } from 'zod';

export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  duration: z.number().int().positive(),
  price: z.number().int().positive(),
  image_url: z.string().url(),
  stripe_price_id: z.string(),
});

export const appointmentSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  customer_email: z.string().email('Valid email is required'),
  customer_phone: z.string().min(10, 'Valid phone number is required'),
  service_id: z.string().uuid('Please select a service'),
  appointment_date: z.string().min(1, 'Date is required'),
  appointment_time: z.string().min(1, 'Time is required'),
});

export type Service = z.infer<typeof serviceSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
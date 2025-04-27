import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceCard } from './ServiceCard';
import { useServices } from '@/lib/hooks/use-services';
import { useAvailableTimes } from '@/lib/hooks/use-available-times';
import { STRIPE_CREATE_CHECKOUT_SESSION_URL, products } from '@/stripe-config';
import { appointmentSchema, type Appointment } from '@/lib/types';

export function BookingForm() {
  const [step, setStep] = React.useState(1);
  const { data: services, isLoading: isLoadingServices } = useServices();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<Appointment>({
    resolver: zodResolver(appointmentSchema)
  });

  const selectedDate = watch('appointment_date') ? new Date(watch('appointment_date')) : null;
  const selectedServiceId = watch('service_id');
  
  const { data: availableTimes = [], isLoading: isLoadingTimes } = useAvailableTimes(
    selectedDate,
    selectedServiceId
  );

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = async (data: Appointment) => {
    try {
      // Find the selected service object
      const selectedService = services?.find(service => service.id === data.service_id);
      if (!selectedService) {
        throw new Error('Selected service not found');
      }

      // Find the corresponding Stripe product
      const product = products[selectedService.name as keyof typeof products];
      if (!product) {
        throw new Error('Stripe product not found for this service');
      }

      // Create checkout session
      const response = await fetch(STRIPE_CREATE_CHECKOUT_SESSION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: data.customer_name,
          email: data.customer_email,
          phone: data.customer_phone,
          serviceId: data.service_id,
          date: data.appointment_date,
          time: data.appointment_time,
          priceId: product.priceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      alert(error.message);
    }
  };

  if (isLoadingServices) {
    return <div>Loading services...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={service.id === selectedServiceId}
                  onSelect={() => setValue('service_id', service.id)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextStep}
              disabled={!selectedServiceId}
              className="w-full mt-6 bg-[#9333ea] text-white py-2 rounded-lg disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Select Date & Time</h2>
            <div className="space-y-4">
              <input
                type="date"
                min={format(new Date(), 'yyyy-MM-dd')}
                {...register('appointment_date')}
                className="w-full p-2 border rounded"
              />
              {errors.appointment_date && (
                <p className="text-red-500 text-sm">{errors.appointment_date.message}</p>
              )}

              {isLoadingTimes ? (
                <div>Loading available times...</div>
              ) : (
                <select
                  {...register('appointment_time')}
                  className="w-full p-2 border rounded"
                  disabled={!selectedDate || availableTimes.length === 0}
                >
                  <option value="">Select a time</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              )}
              {errors.appointment_time && (
                <p className="text-red-500 text-sm">{errors.appointment_time.message}</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border rounded"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!watch('appointment_date') || !watch('appointment_time')}
                className="px-4 py-2 bg-[#9333ea] text-white rounded disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Your Details</h2>
            <div className="space-y-4">
              <input
                {...register('customer_name')}
                placeholder="Your name"
                className="w-full p-2 border rounded"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm">{errors.customer_name.message}</p>
              )}

              <input
                {...register('customer_email')}
                type="email"
                placeholder="Your email"
                className="w-full p-2 border rounded"
              />
              {errors.customer_email && (
                <p className="text-red-500 text-sm">{errors.customer_email.message}</p>
              )}

              <input
                {...register('customer_phone')}
                type="tel"
                placeholder="Your phone"
                className="w-full p-2 border rounded"
              />
              {errors.customer_phone && (
                <p className="text-red-500 text-sm">{errors.customer_phone.message}</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border rounded"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#9333ea] text-white rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Booking...' : 'Complete Booking'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
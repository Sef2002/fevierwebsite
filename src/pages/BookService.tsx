// BookService.tsx (Full Corrected Version)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BookingForm } from '@/components/booking/BookingForm';
import type { Appointment } from '@/lib/types';

export default function BookService() {
  const navigate = useNavigate();

  const handleSubmit = async (data: Appointment) => {
    try {
      // 1. Lookup Stripe price ID from Supabase based on selected service_id
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('stripe_price_id, price')
        .eq('id', data.service_id)
        .maybeSingle();

      if (serviceError || !service?.stripe_price_id) {
        throw new Error('Service not found or missing Stripe price ID');
      }

      const stripePriceId = service.stripe_price_id;

      // 2. Create Stripe Checkout session by sending full metadata
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientName: data.customer_name,
            email: data.customer_email,
            phone: data.customer_phone,
            serviceId: data.service_id,
            date: data.date,
            time: data.time,
            priceId: stripePriceId,
            success_url: `${window.location.origin}/booking/success`,
            cancel_url: `${window.location.origin}/booking/cancel`,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Stripe Error Response:', errorText);
        alert(`Stripe Error:\n${errorText}`);
        return;
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      } else {
        throw new Error('No checkout URL received.');
      }
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      alert(`An error occurred during booking:\n${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Book Your Appointment</h1>
          <p className="mt-2 text-lg text-gray-600">
            Choose your service and preferred time
          </p>
        </div>
        <BookingForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
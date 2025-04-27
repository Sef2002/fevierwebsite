import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function Success() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyAndInsert = async () => {
      try {
        // Skip in Bolt preview environments
        if (location.hostname.includes('webcontainer')) {
          console.log('⚡ Bolt environment detected, skipping server verification.');
          setStatus('success');
          return;
        }

        // Verify the Stripe checkout session via serverless function
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-verify-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) throw new Error('Failed to verify Stripe session');

        const { metadata } = await res.json();

        // Insert the new appointment with status 'confirmed'
        const { error } = await supabase.from('appointments').insert({
          customer_name: metadata.clientName,
          customer_email: metadata.email,
          customer_phone: metadata.phone,
          service_id: metadata.serviceId,
          date_time: metadata.dateTime,
          stripe_session_id: sessionId,
          payment_confirmed: true,
          status: 'confirmed', // ✅ Added: set appointment as confirmed
        });

        if (error) throw error;

        setStatus('success');
      } catch (err) {
        console.error('❌ Error confirming appointment:', err);
        setStatus('error');
      }
    };

    if (sessionId) verifyAndInsert();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg text-center">
        {status === 'loading' && (
          <p className="text-yellow-500 text-lg">⏳ Stiamo confermando il tuo appuntamento...</p>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-3xl font-bold text-green-600">✅ Appuntamento confermato!</h2>
            <p className="text-sm text-gray-500 mt-2">Grazie per aver prenotato con noi.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-3xl font-bold text-red-600">❌ Errore nella conferma</h2>
            <p className="text-sm text-gray-500 mt-2">Contattaci se il problema persiste.</p>
          </>
        )}
      </div>
    </div>
  );
}
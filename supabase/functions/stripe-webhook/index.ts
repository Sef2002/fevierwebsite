import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    if (!signature) {
      return new Response('Missing Stripe signature', { status: 400 });
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (!metadata) {
        console.error('Missing metadata');
        return new Response('Missing metadata', { status: 400 });
      }

      const { clientName, email, phone, serviceId, date, time } = metadata;

      const { error } = await supabase.from('appointments').insert({
        customer_name: clientName,
        customer_email: email,
        customer_phone: phone,
        service_id: serviceId,
        appointment_date: date,
        appointment_time: time,
        stripe_session_id: session.id,
        payment_confirmed: true,
      });

      if (error) {
        console.error('Error inserting appointment:', error);
        return new Response('Error inserting appointment', { status: 500 });
      }

      console.info('✅ Appointment confirmed for', email);
    }

    return new Response('Webhook handled', { status: 200 });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return new Response(error.message, { status: 500 });
  }
});
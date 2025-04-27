import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2023-10-16',
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
});

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    // Fetch all active products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    let processedCount = 0;
    const errors: string[] = [];

    // Process each product
    for (const product of products.data) {
      try {
        const price = product.default_price as Stripe.Price;
        
        if (!price || !price.unit_amount) {
          errors.push(`Product ${product.id} has no valid price`);
          continue;
        }

        const serviceData = {
          name: product.name,
          description: product.description || '',
          price: price.unit_amount / 100, // ✅ Convert from cents to euros
          stripe_product_id: product.id,
          stripe_price_id: price.id,
          duration: product.metadata.duration ? parseInt(product.metadata.duration) : 30,
          image_url: product.images?.[0] || '',
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('services')
          .upsert(serviceData, { 
            onConflict: 'stripe_product_id',
            ignoreDuplicates: false,
          });

        if (error) {
          errors.push(`Failed to upsert product ${product.id}: ${error.message}`);
          continue;
        }

        processedCount++;
      } catch (error) {
        errors.push(`Error processing product ${product.id}: ${error.message}`);
      }
    }

    // Prepare response
    const response = {
      success: processedCount > 0,
      processed: processedCount,
      total: products.data.length,
      errors: errors.length > 0 ? errors : undefined,
    };

    // Return response with CORS headers
    return new Response(JSON.stringify(response), {
      status: errors.length === 0 ? 200 : 207,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }
});
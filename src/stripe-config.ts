export const products = {
  'Taglio Uomo + Shampoo': {
    priceId: 'price_1RHnNoREFJcjg1BxBUZYDvpw',
    name: 'Taglio Uomo + Shampoo',
    description: 'Taglio professionale con shampoo incluso',
    mode: 'payment',
  },
  'Taglio Uomo': {
    priceId: 'price_1RHnNHREFJcjg1BxySQrVIVq',
    name: 'Taglio Uomo',
    description: 'Taglio professionale',
    mode: 'payment',
  },
} as const;

export type ProductId = keyof typeof products;

// ✅ Add this:
export const STRIPE_CREATE_CHECKOUT_SESSION_URL = 'https://echicvonatdpggxzhlfe.supabase.co/functions/v1/stripe-create-checkout-session';
import Razorpay from 'razorpay';

const rateLimitStore = new Map();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000;

async function rateLimitCheck(ip) {
  const now = Date.now();
  const requests = rateLimitStore.get(ip) || [];
  const recentRequests = requests.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return true;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!(await rateLimitCheck(ip))) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { slot, amount, name, email, phone } = body;

    if (!slot || !amount || !name || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Environment Variables:', {
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET ? '[REDACTED]' : 'undefined',
    });

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay configuration is missing');
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt#${slot}_${Date.now()}`,
      notes: { slot, name, email, phone },
    });

    return new Response(JSON.stringify({ orderId: order.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      razorpayError: error.response ? error.response.data : null,
    });
    return new Response(
      JSON.stringify({ error: `Failed to create order: ${error.message}` }),
      {
        status: error.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
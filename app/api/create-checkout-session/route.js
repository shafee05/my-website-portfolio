import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// Simple in-memory rate limiter
const requestCounts = new Map();
const RATE_LIMIT = 10; // Increased to 10 requests to avoid blocking during testing
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

function rateLimit(request) {
  const ip = request.headers.get('x-forwarded-for') || 'local'; // Use 'local' for local testing
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || { count: 0, startTime: now };

  // Reset count if window has passed
  if (now - userRequests.startTime > RATE_LIMIT_WINDOW) {
    userRequests.count = 0;
    userRequests.startTime = now;
  }

  // Increment and check limit
  userRequests.count += 1;
  requestCounts.set(ip, userRequests);

  if (userRequests.count > RATE_LIMIT) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
}

export async function POST(request) {
  try {
    // Apply rate limiting
    rateLimit(request);

    // Parse request body
    const { slot, amount, name, email, phone } = await request.json();

    // Debug environment variables
    console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

    // Check for missing environment variables
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not defined in .env.local');
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_SECRET is not defined in .env.local');
    }

    // Initialize Razorpay client
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use working key for now
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create order
    const receiptId = 'slot_' + slot + '_' + new Date().getTime();
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (error.message.includes('Rate limit exceeded')) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json({ error: `Failed to create order: ${error.message}` }, { status: 500 });
  }
}
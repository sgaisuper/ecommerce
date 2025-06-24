import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppMessage } from '@/types/product';

const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token && mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified');
    return new NextResponse(challenge);
  } else {
    return new NextResponse('Verification failed', { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach((entry: { changes?: { field: string; value: { messages?: WhatsAppMessage[]; contacts?: { wa_id: string; profile?: { name: string } }[] } }[] }) => {
        entry.changes?.forEach((change) => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            
            messages?.forEach((message: WhatsAppMessage) => {
              console.log('Received message:', message);
              handleIncomingMessage(message);
            });
          }
        });
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleIncomingMessage(message: WhatsAppMessage) {
  if (message.type === 'text') {
    const textBody = message.text?.body?.toLowerCase();
    
    if (textBody?.includes('catalog') || textBody?.includes('products')) {
      // Send catalog message
      // Implementation would call WhatsAppAPI.sendCatalogMessage()
      console.log('Customer requested catalog');
    } else if (textBody?.includes('order') || textBody?.includes('buy')) {
      // Handle order inquiry
      console.log('Customer wants to place an order');
    }
  } else if (message.type === 'order') {
    // Handle incoming order from WhatsApp catalog
    const order = message.order;
    console.log('Received order:', order);
    // Process the order - save to database, send confirmation
  } else if (message.type === 'interactive') {
    // Handle interactive message responses
    console.log('Interactive message response:', message.interactive);
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppAPI } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();
    
    if (!to || !message) {
      return NextResponse.json({ error: 'Missing "to" or "message" field' }, { status: 400 });
    }

    const whatsapp = new WhatsAppAPI();
    const result = await whatsapp.sendMessage(to, message);
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.id,
      message: 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending test message:', error);
    return NextResponse.json({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'WhatsApp Test API',
    usage: 'POST with {"to": "phone_number", "message": "your_message"}'
  });
}
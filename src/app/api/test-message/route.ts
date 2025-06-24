import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppAPI } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();
    
    console.log('Test message request:', { to, message });
    
    if (!to || !message) {
      return NextResponse.json({ error: 'Missing "to" or "message" field' }, { status: 400 });
    }

    // Check environment variables
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    console.log('Environment check:', {
      hasAccessToken: !!accessToken,
      hasPhoneNumberId: !!phoneNumberId,
      accessTokenLength: accessToken?.length || 0,
      phoneNumberId: phoneNumberId || 'not set'
    });
    
    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({ 
        error: 'WhatsApp credentials not configured',
        debug: {
          hasAccessToken: !!accessToken,
          hasPhoneNumberId: !!phoneNumberId,
          message: 'Please set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in Vercel environment variables'
        }
      }, { status: 500 });
    }

    const whatsapp = new WhatsAppAPI();
    console.log('Attempting to send message...');
    
    const result = await whatsapp.sendMessage(to, message);
    
    console.log('Message sent successfully:', result);
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.id,
      message: 'Message sent successfully!',
      debug: {
        to,
        phoneNumberId,
        resultId: result.id
      }
    });
  } catch (error) {
    console.error('Error sending test message:', error);
    
    // Enhanced error details
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      response: (error as { response?: { data?: unknown } })?.response?.data || null,
      status: (error as { response?: { status?: number } })?.response?.status || null,
      statusText: (error as { response?: { statusText?: string } })?.response?.statusText || null
    };
    
    return NextResponse.json({ 
      error: 'Failed to send message',
      debug: errorDetails,
      environmentCheck: {
        hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
        hasPhoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
        accessTokenPrefix: process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 10) + '...',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'WhatsApp Test API',
    usage: 'POST with {"to": "phone_number", "message": "your_message"}'
  });
}
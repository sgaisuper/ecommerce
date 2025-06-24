import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: {
      hasAccessToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
      hasPhoneNumberId: !!process.env.WHATSAPP_PHONE_NUMBER_ID,
      hasWebhookToken: !!process.env.WEBHOOK_VERIFY_TOKEN,
      hasAppId: !!process.env.META_APP_ID,
      hasAppSecret: !!process.env.META_APP_SECRET,
      accessTokenLength: process.env.WHATSAPP_ACCESS_TOKEN?.length || 0,
      accessTokenPrefix: process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 10) + '...' || 'not set',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'not set',
      appId: process.env.META_APP_ID || 'not set'
    },
    timestamp: new Date().toISOString()
  });
}
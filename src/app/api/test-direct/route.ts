import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();
    
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    console.log('Direct API test:', { to, message, phoneNumberId });
    
    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({ 
        error: 'Missing credentials',
        debug: { hasAccessToken: !!accessToken, hasPhoneNumberId: !!phoneNumberId }
      }, { status: 500 });
    }

    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: 'hello_world',
          language: {
            code: 'en_US'
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('WhatsApp API response:', response.data);
    
    return NextResponse.json({ 
      success: true,
      data: response.data,
      debug: {
        status: response.status,
        statusText: response.statusText
      }
    });

  } catch (error) {
    console.error('Direct API error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      return NextResponse.json({
        error: 'WhatsApp API error',
        debug: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          errorData: error.response?.data,
          message: error.message
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({
      error: 'Unknown error',
      debug: {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown'
      }
    }, { status: 500 });
  }
}
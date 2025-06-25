import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, product } = await request.json();
    
    if (!to || !product) {
      return NextResponse.json({ 
        error: 'Missing phone number or product data' 
      }, { status: 400 });
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({ 
        error: 'WhatsApp API not configured' 
      }, { status: 500 });
    }

    // Send product message via WhatsApp
    const whatsappResponse = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.replace(/[^0-9]/g, ''), // Remove non-numeric characters
        type: 'interactive',
        interactive: {
          type: 'product',
          body: {
            text: `Check out ${product.name}! 🛍️\n\n${product.description}\n\nPrice: $${product.price} ${product.currency}`
          },
          action: {
            catalog_id: product.catalogId,
            product_retailer_id: product.productId
          }
        }
      })
    });

    const whatsappData = await whatsappResponse.json();

    if (!whatsappResponse.ok) {
      throw new Error(`WhatsApp API error: ${JSON.stringify(whatsappData)}`);
    }

    return NextResponse.json({ 
      success: true,
      messageId: whatsappData.messages?.[0]?.id,
      message: 'Product sent successfully!'
    });

  } catch (error) {
    console.error('Error sending product message:', error);
    return NextResponse.json({ 
      error: 'Failed to send product message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
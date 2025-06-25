import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppAPI } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { action, catalogId, product } = await request.json();
    
    console.log('Catalog API request:', { action, catalogId, product });
    
    const whatsapp = new WhatsAppAPI();
    
    switch (action) {
      case 'create_product':
        const result = await whatsapp.createProduct(catalogId, product);
        return NextResponse.json({ 
          success: true, 
          data: result,
          message: 'Product added to WhatsApp catalog'
        });
        
      case 'sync_all':
        // This would sync all products from your app to WhatsApp catalog
        return NextResponse.json({ 
          success: true,
          message: 'Catalog sync initiated'
        });
        
      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Catalog API error:', error);
    return NextResponse.json({ 
      error: 'Catalog operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const catalogId = searchParams.get('catalogId');
    
    if (!catalogId) {
      return NextResponse.json({ 
        error: 'Missing catalogId parameter' 
      }, { status: 400 });
    }
    
    // Get catalog products from WhatsApp
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    
    const response = await fetch(`https://graph.facebook.com/v23.0/${catalogId}/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const data = await response.json();
    
    return NextResponse.json({ 
      success: true,
      products: data.data || [],
      catalogId
    });
    
  } catch (error) {
    console.error('Get catalog error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch catalog',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const catalogId = searchParams.get('catalogId') || process.env.WHATSAPP_CATALOG_ID;
    
    if (!catalogId) {
      return NextResponse.json({ 
        error: 'Missing catalog ID' 
      }, { status: 400 });
    }
    
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Missing access token' 
      }, { status: 500 });
    }

    const response = await fetch(`https://graph.facebook.com/v23.0/${catalogId}/products`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform Facebook catalog products to our app format
    const transformedProducts = data.data?.map((product: any) => ({
      id: product.retailer_id || product.id,
      name: product.name,
      description: product.description || '',
      price: product.price ? parseFloat(product.price) / 100 : 0, // Convert from cents
      currency: product.currency || 'USD',
      imageUrl: product.image_url || product.images?.[0]?.url || 'https://via.placeholder.com/300x300',
      availability: product.availability || 'in stock',
      category: product.category || 'General'
    })) || [];
    
    return NextResponse.json({ 
      success: true,
      products: transformedProducts,
      total: transformedProducts.length,
      catalogId
    });
    
  } catch (error) {
    console.error('Error fetching catalog products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch catalog products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
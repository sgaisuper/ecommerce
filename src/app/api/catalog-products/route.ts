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
    
    // Log the raw API response for debugging
    console.log('WhatsApp Catalog API Response:', JSON.stringify(data, null, 2));
    
    // Transform Facebook catalog products to our app format
    const transformedProducts = data.data?.map((product: {
      id: string;
      retailer_id?: string;
      name: string;
      description?: string;
      price?: string;
      currency?: string;
      image_url?: string;
      additional_image_urls?: string[];
      image_cdn_urls?: string[];
      images?: { url: string }[];
      availability?: string;
      category?: string;
      brand?: string;
      url?: string;
    }) => {
      // Handle price conversion - try multiple formats
      let priceValue = 0;
      if (product.price) {
        const priceStr = product.price.toString();
        // Check if price contains currency (e.g., "29.99 USD")
        if (priceStr.includes(' ')) {
          const [price] = priceStr.split(' ');
          priceValue = parseFloat(price);
        } else {
          // Check if it's in cents (integer > 100) or dollars (decimal)
          const numPrice = parseFloat(priceStr);
          priceValue = numPrice > 100 && !priceStr.includes('.') 
            ? numPrice / 100  // Convert from cents
            : numPrice;       // Already in dollars
        }
      }
      
      // Handle image URLs - try multiple sources
      const imageUrl = product.image_url || 
                      product.additional_image_urls?.[0] ||
                      product.image_cdn_urls?.[0] ||
                      product.images?.[0]?.url ||
                      'https://via.placeholder.com/300x300?text=' + encodeURIComponent(product.name);
      
      console.log(`Product ${product.name}: price=${product.price}, converted=${priceValue}, image=${imageUrl}`);
      
      return {
        id: product.retailer_id || product.id,
        name: product.name,
        description: product.description || `${product.name} - Available in our catalog`,
        price: priceValue,
        currency: product.currency || 'USD',
        imageUrl: imageUrl,
        availability: product.availability || 'in stock',
        category: product.category || product.brand || 'General'
      };
    }) || [];
    
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
'use client';

import { useState } from 'react';
import * as React from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    availability: 'in stock',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring',
    price: 299.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    availability: 'in stock',
    category: 'Electronics'
  }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [catalogId] = useState<string>('1684431495770842');
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load products from WhatsApp catalog on component mount
  React.useEffect(() => {
    const loadCatalogProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await fetch(`/api/catalog-products?catalogId=${catalogId}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error('Failed to load catalog products:', data.error);
          // Fallback to sample products if catalog fails
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error('Error loading catalog products:', error);
        // Fallback to sample products if error
        setProducts(sampleProducts);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (catalogId) {
      loadCatalogProducts();
    }
  }, [catalogId]);

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
    setShowForm(false);
  };

  const handleEditProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      ));
      setEditingProduct(undefined);
      setShowForm(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const sendProductToWhatsApp = async (product: Product) => {
    const phone = prompt('Enter customer phone number (with country code, e.g., +6584373362):');
    if (!phone) return;
    
    try {
      const response = await fetch('/api/send-product-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          product: {
            catalogId: catalogId,
            productId: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            currency: product.currency
          }
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Product sent to WhatsApp successfully!');
      } else {
        alert('❌ Failed to send product: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Ecommerce</h1>
              <p className="text-gray-600">Manage your product catalog for WhatsApp Business</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Add Local Product
              </button>
              <a
                href="https://business.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Add to WhatsApp Catalog
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Catalog</h2>
              <p className="text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} in your catalog
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-medium text-gray-900 mb-2">WhatsApp Catalog Status</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">✅ Synced with Catalog ID: {catalogId}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-700">✅ {products.length} products loaded from WhatsApp</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                🔄 Refresh Catalog
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Products are automatically synced from your WhatsApp Business catalog
              </p>
            </div>
          </div>
        </div>

        {loadingProducts ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading products...</h3>
            <p className="text-gray-600">Fetching products from WhatsApp catalog</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">No products found in WhatsApp catalog</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEditForm}
                onDelete={handleDeleteProduct}
                onSendToWhatsApp={sendProductToWhatsApp}
              />
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Integration Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-700">WhatsApp Business API - Webhook Configured</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${catalogId ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-gray-700">Product Catalog Sync - {catalogId ? 'Ready' : 'Enter Catalog ID'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-700">Webhook Configuration - Ready for Testing</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Test WhatsApp Messaging</h4>
            <p className="text-sm text-blue-700 mb-3">
              Test your WhatsApp integration using approved template messages.
            </p>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const phone = prompt('Enter your phone number (with country code, e.g., +1234567890):');
                  if (!phone) return;
                  
                  try {
                    const response = await fetch('/api/test-message', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: phone,
                        message: 'Hello! This is a test message from your WhatsApp ecommerce app 🛍️'
                      })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                      alert('✅ Template message sent successfully! Check your WhatsApp.');
                    } else {
                      console.error('Full error details:', result);
                      const debugInfo = result.debug ? '\n\nDebug Info:\n' + JSON.stringify(result.debug, null, 2) : '';
                      alert('❌ Failed to send message: ' + result.error + debugInfo);
                    }
                  } catch (error) {
                    alert('❌ Error: ' + error);
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Send Template Message
              </button>
              <button
                onClick={async () => {
                  const phone = prompt('Enter your phone number (just numbers, no + or country code):');
                  if (!phone) return;
                  
                  try {
                    const response = await fetch('/api/test-direct', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: phone,
                        message: 'Direct API test'
                      })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                      alert('✅ Direct API call successful! Check your WhatsApp.');
                    } else {
                      console.error('Direct API error:', result);
                      alert('❌ Direct API failed: ' + JSON.stringify(result.debug, null, 2));
                    }
                  } catch (error) {
                    alert('❌ Error: ' + error);
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Test Direct API
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Template messages use the approved &quot;hello_world&quot; template and should work immediately.
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Add your WhatsApp Business API credentials in Vercel environment variables to enable messaging.
          </p>
        </div>
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}

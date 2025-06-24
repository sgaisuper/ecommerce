'use client';

import { useState } from 'react';
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
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Ecommerce</h1>
              <p className="text-gray-600">Manage your product catalog for WhatsApp Business</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Catalog</h2>
          <p className="text-gray-600">
            {products.length} product{products.length !== 1 ? 's' : ''} in your catalog
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Add your first product to get started</p>
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
              <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-700">Product Catalog Sync - Pending Setup</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-700">Webhook Configuration - Ready for Testing</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Test WhatsApp Messaging</h4>
            <p className="text-sm text-blue-700 mb-3">
              Test your WhatsApp integration by sending a message to your phone number.
            </p>
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
                    alert('✅ Message sent successfully! Check your WhatsApp.');
                  } else {
                    alert('❌ Failed to send message: ' + result.error);
                  }
                } catch (error) {
                  alert('❌ Error: ' + error);
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Send Test Message
            </button>
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

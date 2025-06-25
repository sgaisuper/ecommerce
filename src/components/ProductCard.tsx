import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onSendToWhatsApp?: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onSendToWhatsApp }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-green-600">
            ${product.price.toFixed(2)} {product.currency}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.availability === 'in stock' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.availability}
          </span>
        </div>
        {product.category && (
          <p className="text-sm text-gray-500 mb-3">Category: {product.category}</p>
        )}
        <div className="space-y-2">
          {onSendToWhatsApp && (
            <button
              onClick={() => onSendToWhatsApp(product)}
              className="w-full bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              📱 Send via WhatsApp
            </button>
          )}
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(product.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  availability: 'in stock' | 'out of stock';
  category?: string;
}

export interface Order {
  id: string;
  customerPhone: string;
  customerName?: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: 'text' | 'interactive' | 'order';
  text?: {
    body: string;
  };
  interactive?: {
    type: string;
    list_reply?: {
      id: string;
      title: string;
    };
    button_reply?: {
      id: string;
      title: string;
    };
  };
  order?: {
    catalog_id: string;
    product_items: {
      product_retailer_id: string;
      quantity: number;
      item_price: number;
    }[];
  };
}
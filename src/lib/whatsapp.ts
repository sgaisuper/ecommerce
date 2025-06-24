import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v23.0';

export class WhatsAppAPI {
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  async sendMessage(to: string, message: string) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendCatalogMessage(to: string, catalogId: string) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'catalog_message',
            header: {
              type: 'text',
              text: 'Check out our products!'
            },
            body: {
              text: 'Browse our catalog and place your order directly through WhatsApp.'
            },
            action: {
              name: 'catalog_message',
              parameters: {
                thumbnail_product_retailer_id: catalogId
              }
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending catalog message:', error);
      throw error;
    }
  }

  async createProduct(catalogId: string, product: { name: string; description: string; price: number; currency?: string; availability?: string; id: string; imageUrl: string }) {
    try {
      const response = await axios.post(
        `${WHATSAPP_API_URL}/${catalogId}/products`,
        {
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency || 'USD',
          availability: product.availability || 'in stock',
          retailer_id: product.id,
          image_url: product.imageUrl
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
}
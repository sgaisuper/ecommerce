# WhatsApp Business API Setup Guide

## Meta Solution Partner Setup

### 1. Create Business Manager
- Go to [Business Manager](https://business.facebook.com)
- Create a new business or use existing one
- Save your Business Manager ID

### 2. Create WhatsApp Business Account (WABA)
- In Business Manager, go to Business Settings
- Click "WhatsApp Business Account" and create new
- Save your WABA ID

### 3. Create Meta App
- Go to [Meta for Developers](https://developers.facebook.com)
- Create new app with "Business" type
- Add display name and contact email
- Save your App ID and App Secret

### 4. Add System User
- In Business Manager > Business Settings > Users > System Users
- Create new system user with Admin role
- Generate access token with these permissions:
  - `whatsapp_business_management`
  - `whatsapp_business_messaging`

### 5. App Review Process
Submit your app for review with these permissions:
- `whatsapp_business_management` - Manage phone numbers, templates, business profile
- `whatsapp_business_messaging` - Send/receive messages, upload/download media

Sample App Review submission:
```
App Name: WhatsApp Ecommerce Solution
App Type: Business
Use Case: Ecommerce platform integration with WhatsApp Business API
- Product catalog management
- Order processing through WhatsApp
- Customer service automation
- Multi-client solution provider platform
```

### 6. Configure Webhook
1. In App Dashboard > WhatsApp > Configuration
2. Set Callback URL: `https://your-domain.com/api/webhook`
3. Set Verify Token: (use same token in your .env file)
4. Click "Verify and Save"
5. Subscribe to "messages" webhook field

### 7. Register Phone Number
```bash
curl -X POST \
'https://graph.facebook.com/v23.0/PHONE_NUMBER_ID/register' \
-H 'Authorization: Bearer ACCESS_TOKEN' \
-H 'Content-Type: application/json' \
-d '{
  "messaging_product": "whatsapp",
  "pin": "123456"
}'
```

### 8. Test Integration
1. Send test message from personal WhatsApp to business number
2. Check webhook receives message
3. Send test message from business to personal number
4. Verify catalog functionality

## Environment Variables Setup

```env
# Get from Meta App Dashboard
WHATSAPP_ACCESS_TOKEN=your_system_user_access_token
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret

# Get from WhatsApp Manager
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id

# Set your own secure token
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token_here
```

## Important Notes

- Each Meta App can only have one webhook endpoint
- Phone numbers can only be on one platform (Cloud API or On-Premises)
- System users are limited (1 admin, 1 employee per app)
- Webhook verification is required before receiving messages
- Two-factor authentication (6-digit PIN) is mandatory for phone registration

## Testing Checklist

- [ ] App approved for required permissions
- [ ] System user access token generated
- [ ] Webhook endpoint configured and verified
- [ ] Phone number registered with 2FA
- [ ] Test message sent and received
- [ ] Webhook receives message notifications
- [ ] Catalog integration working
- [ ] Order processing functional

## Troubleshooting

### Common Issues

1. **Webhook verification fails**
   - Check verify token matches in app and code
   - Ensure HTTPS endpoint is accessible
   - Verify webhook URL is correct

2. **Messages not received**
   - Check webhook subscription to "messages" field
   - Verify WABA subscription to app
   - Check access token permissions

3. **Phone registration fails**
   - Ensure phone number is not already registered elsewhere
   - Check 2FA PIN is 6 digits
   - Verify phone number format

4. **Catalog not syncing**
   - Check Meta App permissions
   - Verify WABA catalog settings
   - Check product data format

### Support Resources

- [WhatsApp Business Platform Docs](https://developers.facebook.com/docs/whatsapp)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer)
- [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken)
- [Solution Partner Portal](https://www.facebook.com/business/partner-directory)
# Ocean Hair Marketplace

## Current State
New project -- no existing code.

## Requested Changes (Diff)

### Add
- Splash/landing screen with Ocean Hair branding
- Authentication: Sign up as Vendor or Manufacturer, Login
- Home screen: greeting, featured manufacturers, trending wigs product grid
- Product detail page: images, pricing (from price per piece), lengths, MOQ, supplier info, Chat with Supplier button, Order Now button
- Chat screen: messaging between vendors and manufacturers per product/supplier
- Orders screen: tabs for Pending / Shipped / Delivered, order cards with item details and Track Order
- Profile screen: business account info, stats (orders/favorites/reviews), payment methods, manage address
- Role-based data: users have role (vendor or manufacturer), manufacturers can list products

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Authorization with two roles: vendor, manufacturer
2. Backend entities:
   - Products: id, name, category, priceFrom, images, lengths, moq, manufacturerId, stock
   - Orders: id, buyerId, sellerId, productId, quantity, total, status (pending/shipped/delivered)
   - Messages: id, senderId, receiverId, productId, text, timestamp
   - User profiles: userId, businessName, role, avatar
3. Frontend pages:
   - /: Splash/landing page
   - /auth: Login & Signup with role selection
   - /home: Home screen with product categories and featured manufacturers
   - /product/:id: Product detail
   - /chat: Chat list and thread view
   - /orders: My Orders with status tabs
   - /profile: User profile and settings
4. UI theme: deep blue primary (#1a3a8f), gold accent (#c9a84c), white cards, mobile-first layout

import Client from 'shopify-buy';

// Initialize Shopify client
// Note: These Environment Variables should be added to .env.local
export const shopifyClient = Client.buildClient({
    domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
    storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
    apiVersion: '2024-01'
});

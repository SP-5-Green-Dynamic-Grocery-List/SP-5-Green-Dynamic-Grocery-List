const axios = require('axios');

const CLIENT_ID = 'newappgrocerylist-6d07892c89e468845eadf15cab05b4a84740570194919184140';
const CLIENT_SECRET = 'q9RQ1s2TSX3IV6wwP7s-6_iCXSWzgr0pY-Z7kYWt';
const TOKEN_URL = 'https://api.kroger.com/v1/connect/oauth2/token';
const API_URL = 'https://api.kroger.com/v1/products';
let accessToken = ''; // This will hold our access token

// Function to obtain an access token
async function obtainAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'product.compact');

  try {
    const response = await axios.post(TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    accessToken = response.data.access_token; // Update the access token
    console.log('Access token obtained:', accessToken);
    return accessToken; // Return the access token for immediate use
  } catch (error) {
    console.error('Error obtaining access token:', error);
    return null; // Return null if there's an error
  }
}

// Function to fetch product data using the access token
async function fetchProductData(productQuery, locationId) {
  try {
    const response = await axios.get(`${API_URL}?filter.term=${encodeURIComponent(productQuery)}&filter.locationId=${locationId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Use the global accessToken variable
        'Content-Type': 'application/json'
      }
    });

    // Process response data as needed
    response.data.data.forEach((product, index) => {
        console.log(`Product ${index + 1}:`);
        console.log(`Product ID: ${product.productId}`);
        console.log(`UPC: ${product.upc}`);
        console.log(`Brand: ${product.brand}`);
        console.log(`Categories: ${product.categories.join(", ")}`);
        console.log(`Country Origin: ${product.countryOrigin}`);
        console.log(`Description: ${product.description}`);
    });
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
}

// Main function to orchestrate the token fetch and product data fetch
async function main() {
  const productQuery = 'milk'; // Define your product query
  const locationId = '01480265'; // Define your location ID
  
  // Directly obtain and use the access token
  const token = await obtainAccessToken();
  if (token) {
    await fetchProductData(productQuery, locationId);
  }
}

main();

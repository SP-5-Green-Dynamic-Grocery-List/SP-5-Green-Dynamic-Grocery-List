import { encode } from 'base-64';
import axios, * as others from 'axios';

// Function to obtain an access token
async function obtainAccessToken() {
  const CLIENT_ID = 'newappgrocerylist-6d07892c89e468845eadf15cab05b4a84740570194919184140';
  const CLIENT_SECRET = 'q9RQ1s2TSX3IV6wwP7s-6_iCXSWzgr0pY-Z7kYWt';
  const TOKEN_URL = 'https://api.kroger.com/v1/connect/oauth2/token';
  const API_URL = 'https://api.kroger.com/v1/products';

  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const base64Credentials = encode(credentials);

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'product.compact');

  try {
    const response = await axios.post(TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${base64Credentials}`,
      },
    });

    const accessToken = response.data.access_token; // Update the access token
    console.log('Access token obtained:', accessToken);
    return accessToken; // Return the access token for immediate use
  } catch (error) {
    console.error('Error obtaining access token:', error);
    return null; // Return null if there's an error
  }
}

// Function to fetch a location ID using the Kroger Location API
async function fetchLocationId(zipCode, accessToken) {
  try {
    const response = await axios.get(`https://api.kroger.com/v1/locations?filter.zipCode.near=${zipCode}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const locationId = response.data.data[0].locationId;
      console.log(`Location ID found for zip code ${zipCode}: ${locationId}`);
      return locationId;
    } else {
      console.log(`No locations found for zip code ${zipCode}.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching location ID:', error);
    return null;
  }
}

// Function to fetch product data using the access token
async function fetchProductData(productQuery, zipCode) {
  const API_URL = 'https://api.kroger.com/v1/products';
  const accessToken = await obtainAccessToken();
  // Obtain an access token
  console.log('trying to fetch product');

  if (accessToken) {
    // Fetch location ID dynamically based on zip code
    const locationId = await fetchLocationId(zipCode, accessToken);

    // Proceed to fetch product data if a location ID was successfully retrieved
    if (locationId) {
      try {
        // Construct the URL with optional locationId
        const url = `${API_URL}?filter.term=${encodeURIComponent(productQuery)}${locationId ? `&filter.locationId=${locationId}` : ''}`;
        console.log('awaiting kroger reply');
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        // Process response data as needed
        if (response.data.data.length > 0) {
          response.data.data.forEach((product, index) => {
            console.log(`Product ${index + 1}:`);
            console.log(`Product ID: ${product.productId}`);
            console.log(`UPC: ${product.upc}`);
            console.log(`Brand: ${product.brand}`);
            console.log(`Categories: ${product.categories.join(", ")}`);
            console.log(`Country Origin: ${product.countryOrigin}`);
            console.log(`Description: ${product.description}`);

            // Safely access price information
            const item = product.items && product.items[0];
            if (item && item.price && item.price.regular) {
              console.log(`Regular Price: $${item.price.regular}`);
            } else {
              console.log("Price information not available.");
            }
          });
        } else {
          console.log('No products found for the given query.');
        }

      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    } else {
      console.log(`Could not fetch product data without a valid location ID.`);
    }
  }
}

export default fetchProductData;


async function main() {
    const productQuery = 'Orange'; // Define your product query
    const zipCode = '30114'; // Example zip code for location search
  
    fetchProductData(productQuery,zipCode);
  }
  

main();

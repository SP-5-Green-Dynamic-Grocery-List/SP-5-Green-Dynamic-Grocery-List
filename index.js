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
  
  if (accessToken) {
    const locationId = await fetchLocationId(zipCode, accessToken);

    if (locationId) {
      try {
        const url = `${API_URL}?filter.term=${encodeURIComponent(productQuery)}${locationId ? `&filter.locationId=${locationId}` : ''}`;
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.data.length > 0) {
          // Create an array to hold product information
          const products = [];

          response.data.data.forEach(product => {
            // Safely access price information
            const item = product.items && product.items[0];
            const regularPrice = item && item.price && item.price.regular ? item.price.regular : null;
            // Grab the image url and get the small one 3 because we dont want the 4k pic
            const frontImageUrl = product.images && product.images.length > 0 ? product.images[0].sizes && product.images[0].sizes.length > 0 ? product.images[0].sizes[3].url : null : null;
            
            
            const productInfo = {
              productId: product.productId,
              upc: product.upc,
              brand: product.brand,
              categories: product.categories,
              countryOrigin: product.countryOrigin,
              description: product.description,
              regularPrice: regularPrice,
              frontImage: frontImageUrl
            };

            // Add the product information to the array
            products.push(productInfo);
          });

          
          return products;
        } else {
          return null; // Return null if no products found
        }

      } catch (error) {
        console.error('Error fetching product data:', error);
        return null; // Return null in case of error
      }
    } else {
      console.log(`Could not fetch product data without a valid location ID.`);
      return null; // Return null if no location ID
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

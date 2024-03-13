const axios = require('axios');

// Replace 'Your_Access_Token' with your actual access token
const accessToken = 'eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vYXBpLmtyb2dlci5jb20vdjEvLndlbGwta25vd24vandrcy5qc29uIiwia2lkIjoiWjRGZDNtc2tJSDg4aXJ0N0xCNWM2Zz09IiwidHlwIjoiSldUIn0.eyJhdWQiOiJuZXdhcHBncm9jZXJ5bGlzdC02ZDA3ODkyYzg5ZTQ2ODg0NWVhZGYxNWNhYjA1YjRhODQ3NDA1NzAxOTQ5MTkxODQxNDAiLCJleHAiOjE3MTAzNTc4OTQsImlhdCI6MTcxMDM1NjA4OSwiaXNzIjoiYXBpLmtyb2dlci5jb20iLCJzdWIiOiI3MzExNTljNy1lNDlmLTU2OWMtYjBiYS05MjUzNGUyNDJiNWEiLCJzY29wZSI6InByb2R1Y3QuY29tcGFjdCIsImF1dGhBdCI6MTcxMDM1NjA5NDIzODMxNDMyMywiYXpwIjoibmV3YXBwZ3JvY2VyeWxpc3QtNmQwNzg5MmM4OWU0Njg4NDVlYWRmMTVjYWIwNWI0YTg0NzQwNTcwMTk0OTE5MTg0MTQwIn0.b84HGn0fTaoW7p5Y7y6kjiiCe3sjfLvnRg8nbkIso5mnpLmZ92xv2cY5No4v88YxEfbWSZsk3fFpnN0qtdnNQIqNld7akWd8ZsBVzIpVZc3pNCJN6RW9spW4hCbujL3_YZDEGrejO_hkYDkFgYVcPRh_Q3YSeA4WOgI96Zj2G0QlZl79A0cF-N86Qjruu8EO0I2k3OjXGH9-6mkueTZyOck2mI8h4XhEjA1RxiS_PgW0I8X1KVBavsGJvfWY4wR8arlOhLUf4D7LdeRdTPcG-tPUsvyHK6g7Fo95g3mkb3ZKYMzksva7HcUNYf9IeQowYAABrJORRfu9YI2Bn_9BRA';
// Replace 'Your_Product_Query' with your product search query
const productQuery = 'milk';
// Optional: Replace with your specific store location ID
const locationId = '01480265';

const config = {
  method: 'get',
  url: `https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(productQuery)}&filter.zipCode.near =30114&filter.radiusInMiles=20`,
  headers: { 
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
};


axios.get(`https://api.kroger.com/v1/products?filter.term=${encodeURIComponent(productQuery)}&filter.locationId=${locationId}`, {
  headers: { 
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
.then(function (response) {
  // Loop through each product in the response data
  response.data.data.forEach((product, index) => {
    console.log(`Product ${index + 1}:`);
    console.log(`Product ID: ${product.productId}`);
    console.log(`UPC: ${product.upc}`);
    console.log(`Brand: ${product.brand}`);
    console.log(`Categories: ${product.categories.join(", ")}`);
    console.log(`Country Origin: ${product.countryOrigin}`);
    console.log(`Description: ${product.description}`);

    // Assuming price is directly available in the product object
    if(product.price) {
      console.log(`Price: $${product.price.regular}`);
    }

    // Show only the front perspective image
    const frontImage = product.images.find(image => image.perspective === 'front');
    if(frontImage && frontImage.sizes) {
      const imageUrl = frontImage.sizes.find(size => size.size === 'large').url; // Example: Using 'large' size
      console.log(`Front Image URL: ${imageUrl}`);
    }

    console.log('-----------------------------------');
  });
})
.catch(function (error) {
  console.log(error);
});
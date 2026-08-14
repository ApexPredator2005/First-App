// Vercel Serverless Function
// Securely proxies the Google Maps API Key from environment variables to the frontend
// Route: GET /api/config → returns { apiKey, status }
module.exports = function handler(req, res) {
  // CORS & Caching headers
  // TODO: After deployment, restrict Access-Control-Allow-Origin to your Vercel domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GMP_API_KEY || "";

  return res.status(200).json({
    apiKey: apiKey,
    status: apiKey ? "configured" : "unconfigured"
  });
};

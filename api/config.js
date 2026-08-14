// Vercel Serverless Function
// Securely proxies the Google Maps API Key from environment variables to the frontend
// Route: GET /api/config → returns { apiKey, status }
module.exports = function handler(req, res) {
  // Dynamic & Strict CORS Policy: Allow local dev, same-host requests, and Vercel domains
  const origin = req.headers.origin || "";
  const host = req.headers.host || "";
  
  let allowedOrigin = `https://${host}`;
  if (origin && (origin.endsWith('.vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes(host))) {
    allowedOrigin = origin;
  }
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GMP_API_KEY || "";

  return res.status(200).json({
    apiKey: apiKey,
    status: apiKey ? "configured" : "unconfigured"
  });
};

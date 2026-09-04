/**
 * Node / Vercel handler — wraps worker/create-checkout-session.js
 * Set env: STRIPE_SECRET_KEY, SITE_ORIGIN (and optional CORS_ORIGIN).
 */
import worker from "../worker/create-checkout-session.js";

export default async function handler(req, res) {
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
  const request = new Request("https://local/api/create-checkout-session", {
    method: req.method || "POST",
    headers: { "Content-Type": "application/json" },
    body: req.method === "GET" ? undefined : body,
  });
  const env = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    SITE_ORIGIN: process.env.SITE_ORIGIN,
    CORS_ORIGIN: corsOrigin,
  };
  const response = await worker.fetch(request, env);
  const text = await response.text();
  res.statusCode = response.status;
  res.setHeader("Content-Type", "application/json");
  res.end(text);
}

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const NOTIFY_EMAIL = process.env.COMMENTS_NOTIFY_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.COMMENTS_FROM_EMAIL || "comments@resend.dev";

function sanitize(str) {
  return str.replace(/[<>]/g, "");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const path = req.method === "GET" ? req.query.path : req.body?.path;
  if (!path || typeof path !== "string") {
    res.status(400).json({ error: "missing path" });
    return;
  }

  const key = `comments:${path}`;

  if (req.method === "GET") {
    const comments = (await redis.lrange(key, 0, -1)) || [];
    res.status(200).json({ comments });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const name = sanitize(String(req.body?.name || "").trim()).slice(0, 80);
  const email = String(req.body?.email || "").trim().slice(0, 200);
  const comment = sanitize(String(req.body?.comment || "").trim()).slice(0, 2000);

  if (!name || !email || !comment) {
    res.status(400).json({ error: "missing fields" });
    return;
  }

  const entry = {
    name,
    comment,
    created_at: new Date().toISOString()
  };

  await redis.rpush(key, entry);
  const comments = (await redis.lrange(key, 0, -1)) || [];

  if (RESEND_API_KEY && NOTIFY_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: "New blog comment",
          text: `New comment on ${path}\n\nName: ${name}\nEmail: ${email}\n\n${comment}`
        })
      });
    } catch {
      // ignore email errors
    }
  }

  res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=60");
  res.status(200).json({ comments });
}

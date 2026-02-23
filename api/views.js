import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  const { path } = req.query || {};
  if (!path || typeof path !== "string") {
    res.status(400).json({ error: "missing path" });
    return;
  }

  const key = `views:${path}`;

  try {
    const views = await redis.incr(key);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ views });
  } catch (err) {
    res.status(500).json({ error: "kv error" });
  }
}

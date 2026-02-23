import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
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

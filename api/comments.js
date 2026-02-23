import { Redis } from "@upstash/redis";
import { createHash, randomUUID } from "crypto";

function createRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = createRedisClient();
const NOTIFY_EMAIL = process.env.COMMENTS_NOTIFY_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.COMMENTS_FROM_EMAIL || "comments@resend.dev";

function sanitize(str) {
  return str.replace(/[<>]/g, "");
}

function isValidEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseComment(value) {
  if (value && typeof value === "object") return value;
  if (typeof value !== "string") return null;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function buildLegacyCommentId(comment, index) {
  const seed = `${comment.created_at || ""}|${comment.name || ""}|${comment.comment || ""}|${index}`;
  return `legacy-${createHash("sha1").update(seed).digest("hex").slice(0, 16)}`;
}

function normalizeComments(rawComments) {
  return rawComments
    .map((entry, index) => {
      const parsed = parseComment(entry) || {};
      const id = typeof parsed.id === "string" && parsed.id.trim()
        ? parsed.id.trim()
        : buildLegacyCommentId(parsed, index);
      const parentId = typeof parsed.parent_id === "string" && parsed.parent_id.trim()
        ? parsed.parent_id.trim()
        : null;

      return {
        id,
        parent_id: parentId,
        name: sanitize(String(parsed.name || "Anonymous")).slice(0, 80),
        comment: sanitize(String(parsed.comment || "")).slice(0, 2000),
        created_at: String(parsed.created_at || "")
      };
    })
    .filter((comment) => comment.comment);
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

  if (!redis) {
    res.status(500).json({ error: "kv env missing" });
    return;
  }

  if (req.method === "GET") {
    const rawComments = (await redis.lrange(key, 0, -1)) || [];
    const comments = normalizeComments(rawComments);
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
  const parentId = sanitize(String(req.body?.parent_id || "").trim()).slice(0, 120) || null;

  if (!name || !email || !comment) {
    res.status(400).json({ error: "missing fields" });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "invalid email" });
    return;
  }

  const entry = {
    id: randomUUID(),
    parent_id: parentId,
    name,
    comment,
    created_at: new Date().toISOString()
  };

  await redis.rpush(key, entry);
  const rawComments = (await redis.lrange(key, 0, -1)) || [];
  const comments = normalizeComments(rawComments);

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

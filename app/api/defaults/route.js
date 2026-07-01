import { NextResponse } from "next/server";

const keyPrefix = "mcm-cup-defaults";

function getStoreConfig() {
  return {
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token:
      process.env.KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.KV_REST_API_READ_ONLY_TOKEN
  };
}

function storeKey(slug) {
  return `${keyPrefix}:${slug}`;
}

async function redisCommand(command) {
  const { url, token } = getStoreConfig();

  if (!url || !token) {
    return { unavailable: true };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Defaults store request failed: ${response.status}`);
  }

  return response.json();
}

export async function GET(request) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const result = await redisCommand(["GET", storeKey(slug)]);

  if (result.unavailable || !result.result) {
    return NextResponse.json({ state: null });
  }

  try {
    return NextResponse.json({ state: JSON.parse(result.result) });
  } catch {
    return NextResponse.json({ state: null });
  }
}

export async function POST(request) {
  const body = await request.json();

  if (!body?.slug || !body?.state) {
    return NextResponse.json(
      { error: "Missing slug or state" },
      { status: 400 }
    );
  }

  const result = await redisCommand([
    "SET",
    storeKey(body.slug),
    JSON.stringify(body.state)
  ]);

  if (result.unavailable) {
    return NextResponse.json(
      { error: "Defaults store is not configured" },
      { status: 501 }
    );
  }

  return NextResponse.json({ ok: true });
}

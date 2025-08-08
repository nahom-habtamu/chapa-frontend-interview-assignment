import { NextRequest, NextResponse } from "next/server";

const CHAPA_API_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildChapaUrl(req: NextRequest): string {
  const { pathname, search } = req.nextUrl;
  const slug = pathname.replace(/^\/?api\/chapa\//, "");
  const queryString = search || "";
  return `${CHAPA_API_URL}/${slug}${queryString}`;
}

function buildForwardHeaders(req: NextRequest): Headers {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${CHAPA_SECRET_KEY ?? ""}`);

  // Forward only safe headers from the incoming request
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  // Optional: Identify traffic source
  headers.set("X-Forwarded-By", "chapa-frontend-interview-assignment");
  return headers;
}

async function proxyToChapa(req: NextRequest): Promise<NextResponse> {
  if (!CHAPA_SECRET_KEY) {
    return NextResponse.json(
      { message: "Server misconfiguration: CHAPA_SECRET_KEY is not set" },
      { status: 500 }
    );
  }

  const method = req.method.toUpperCase();
  if (method !== "GET" && method !== "POST") {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
  }

  const chapaUrl = buildChapaUrl(req);
  const headers = buildForwardHeaders(req);

  const hasBody = method === "POST";
  try {
    const response = await fetch(chapaUrl, {
      method,
      headers,
      body: hasBody ? (req as unknown as { body?: ReadableStream<Uint8Array> }).body : undefined,
      duplex: hasBody ? "half" : undefined,
    } as RequestInit);

    const responseHeaders = new Headers(response.headers);
    // Do not forward Set-Cookie from Chapa to the browser
    responseHeaders.delete("set-cookie");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Chapa proxy error:", error);
    return NextResponse.json(
      { message: "An error occurred while proxying to Chapa API." },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) {
  return proxyToChapa(req);
}

export async function POST(req: NextRequest) {
  return proxyToChapa(req);
}


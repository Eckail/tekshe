import { validateAiTutorRequest } from "../../data/aiTutor";
import { getAiTutorStatus } from "../../server/aiTutor";

function jsonNoStore(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request): Promise<Response> {
  // Read request-time data to ensure secret-backed availability is not cached
  // into a static build response.
  request.headers.get("user-agent");
  return jsonNoStore({ status: getAiTutorStatus() });
}

export async function POST(request: Request): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) {
    return jsonNoStore({ error: { code: "request_too_large" } }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: { code: "invalid_json" } }, 400);
  }

  const input = validateAiTutorRequest(body);
  if (!input) {
    return jsonNoStore({ error: { code: "invalid_request" } }, 400);
  }

  const status = getAiTutorStatus();
  if (!status.available) {
    return jsonNoStore(
      {
        error: {
          code: "ai_tutor_unavailable",
          reason: status.reason,
          message: "AI мұғалімі әзірге бапталмаған.",
        },
      },
      503,
    );
  }

  // The provider adapter is intentionally not implemented until a provider is
  // selected and reviewed. Never return a canned response as if it were AI.
  return jsonNoStore({ error: { code: "provider_not_supported" } }, 503);
}

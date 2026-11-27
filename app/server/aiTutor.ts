import {
  validateAiTutorRequest,
  type AiTutorProvider,
  type AiTutorRequest,
} from "../data/aiTutor";

export type AiTutorUnavailableReason =
  | "credentials_missing"
  | "provider_not_supported";

export type AiTutorStatus = {
  available: false;
  reason: AiTutorUnavailableReason;
};

export type AiTutorErrorCode =
  | "invalid_request"
  | "not_configured"
  | "timeout"
  | "provider_error"
  | "invalid_provider_response";

export class AiTutorServiceError extends Error {
  readonly code: AiTutorErrorCode;

  constructor(code: AiTutorErrorCode) {
    super(code);
    this.name = "AiTutorServiceError";
    this.code = code;
  }
}

type AiTutorEnvironment = {
  TEKSHE_AI_PROVIDER?: string;
  TEKSHE_AI_API_KEY?: string;
  TEKSHE_AI_API_URL?: string;
};

export function getAiTutorStatus(
  environment: AiTutorEnvironment = {
    TEKSHE_AI_PROVIDER: process.env.TEKSHE_AI_PROVIDER,
    TEKSHE_AI_API_KEY: process.env.TEKSHE_AI_API_KEY,
    TEKSHE_AI_API_URL: process.env.TEKSHE_AI_API_URL,
  },
): AiTutorStatus {
  if (
    !environment.TEKSHE_AI_PROVIDER?.trim() ||
    !environment.TEKSHE_AI_API_KEY?.trim() ||
    !environment.TEKSHE_AI_API_URL?.trim()
  ) {
    return { available: false, reason: "credentials_missing" };
  }

  // No provider adapter is shipped yet. Credentials alone do not turn the
  // feature on or make an unsupported endpoint look available.
  return { available: false, reason: "provider_not_supported" };
}

export async function generateAiTutorReply(
  input: unknown,
  provider: AiTutorProvider | null,
  timeoutMs = 12_000,
): Promise<string> {
  const request: AiTutorRequest | null = validateAiTutorRequest(input);
  if (!request) throw new AiTutorServiceError("invalid_request");
  if (!provider) throw new AiTutorServiceError("not_configured");

  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeoutFailure = new Promise<never>((_resolve, reject) => {
      timeout = setTimeout(() => {
        controller.abort();
        reject(new AiTutorServiceError("timeout"));
      }, timeoutMs);
    });
    const response = await Promise.race([
      provider.generateReply(request, controller.signal),
      timeoutFailure,
    ]);
    if (typeof response !== "string" || !response.trim() || response.length > 4_000) {
      throw new AiTutorServiceError("invalid_provider_response");
    }
    return response.trim();
  } catch (error) {
    if (error instanceof AiTutorServiceError) throw error;
    throw new AiTutorServiceError("provider_error");
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}

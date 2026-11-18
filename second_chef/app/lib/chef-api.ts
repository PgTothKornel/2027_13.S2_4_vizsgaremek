export class InputError extends Error {}

export type BodyValidator<T> = (body: unknown) => T;

const MAX_BODY_SIZE = 16_000;

function validateRequestOrigin(request: Request): void {
  const origin = request.headers.get('origin');
  if (!origin) return;

  let source: URL;
  try {
    source = new URL(origin);
  } catch {
    throw new InputError('Érvénytelen kérés eredet.');
  }

  const host = request.headers.get('host') ?? new URL(request.url).host;
  const isHttpOrigin = source.protocol === 'http:' || source.protocol === 'https:';

  if (!isHttpOrigin || source.host !== host) {
    throw new InputError('Érvénytelen kérés eredet.');
  }
}

export async function readBody<T>(
  request: Request,
  validate: BodyValidator<T>,
): Promise<T> {
  validateRequestOrigin(request);

  const text = await request.text();
  if (text.length > MAX_BODY_SIZE) {
    throw new InputError('Túl nagy kérés.');
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new InputError('Ellenőrizd a megadott adatokat.');
  }

  try {
    return validate(body);
  } catch (error) {
    if (error instanceof InputError) throw error;
    throw new InputError('Ellenőrizd a megadott adatokat.');
  }
}

export function apiError(error: unknown): Response {
  if (error instanceof InputError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  // Connection strings and driver errors must never reach the browser or logs.
  console.error('Second Chef request failed', JSON.stringify({
    name: error instanceof Error ? error.name : 'UnknownError',
    code: error !== null && typeof error === 'object' && 'code' in error && typeof error.code === 'string' ? error.code : undefined,
    configurationError: error instanceof Error && /TEST_USER_ID|DATABASE_URL is not defined/.test(error.message),
    typeError: error instanceof TypeError ? error.message.replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted]') : undefined,
  }));

  return Response.json(
    { error: 'Nem sikerült elérni az adatokat. Próbáld újra később.' },
    { status: 503 },
  );
}

export function json(data: unknown): Response {
  return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

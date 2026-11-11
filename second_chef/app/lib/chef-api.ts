import { z } from 'zod';

export class InputError extends Error {}

export async function readBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  const origin = request.headers.get('origin');
  // Next.js may construct an internal request URL with localhost behind a proxy.
  // The browser's Origin must match the actual incoming Host, never a client user ID.
  if (origin) {
    let source: URL;
    try { source = new URL(origin); } catch { throw new InputError('Érvénytelen kérés eredet.'); }
    const host = request.headers.get('host') ?? new URL(request.url).host;
    if (!['http:', 'https:'].includes(source.protocol) || source.host !== host)
      throw new InputError('Érvénytelen kérés eredet.');
  }
  const text = await request.text();
  if (text.length > 16000) throw new InputError('Túl nagy kérés.');
  try { return schema.parse(JSON.parse(text)); }
  catch { throw new InputError('Ellenőrizd a megadott adatokat.'); }
}

export function apiError(error: unknown) {
  if (error instanceof InputError) return Response.json({ error: error.message }, { status: 400 });
  // Connection strings and driver errors must never reach the browser or logs.
  console.error('Second Chef request failed', JSON.stringify({
    name: error instanceof Error ? error.name : 'UnknownError',
    code: error !== null && typeof error === 'object' && 'code' in error && typeof error.code === 'string' ? error.code : undefined,
    configurationError: error instanceof Error && /TEST_USER_ID|DATABASE_URL is not defined/.test(error.message),
    typeError: error instanceof TypeError ? error.message.replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted]') : undefined,
  }));
  return Response.json({ error: 'Nem sikerült elérni az adatokat. Próbáld újra később.' }, { status: 503 });
}

export function json(data: unknown) {
  return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

/** Report routing/server failures without attempting to parse an HTML page as JSON. */
export async function readApiResponse<T>(response: Response): Promise<T> {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('A receptkiszolgáló nem érhető el: az API nem JSON-választ küldött. Ellenőrizd, hogy a Next.js szerver megfelelő verziója fut-e.');
  }
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error('A receptkiszolgáló hibás választ küldött. Próbáld újra később.');
  }
  if (!response.ok) {
    const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
      ? result.error : 'Nem sikerült elérni a receptkiszolgálót.';
    throw new Error(message);
  }
  return result as T;
}

export async function GET() {
  return Response.json({ ok: true, service: 'boukingolts-frontend', version: 4 });
}

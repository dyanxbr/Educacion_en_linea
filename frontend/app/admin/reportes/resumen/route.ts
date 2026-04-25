export async function GET() {
  const res = await fetch('educacionenlinea-production.up.railway.app/reportes/resumen');
  const data = await res.json();
  return Response.json(data);
}
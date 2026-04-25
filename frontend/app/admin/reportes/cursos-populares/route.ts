export async function GET() {
  const res = await fetch('educacionenlinea-production.up.railway.app/reportes/cursos-populares');
  const data = await res.json();
  return Response.json(data);
}
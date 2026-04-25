export async function POST(request: Request) {
  const formData = await request.formData();
  const res = await fetch('educacionenlinea-production.up.railway.app/videos', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
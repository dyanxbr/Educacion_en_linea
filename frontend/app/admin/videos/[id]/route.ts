export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`educacionenlinea-production.up.railway.app/videos/${params.id}`, {
    method: 'DELETE',
  });
  return Response.json({ ok: true });
}
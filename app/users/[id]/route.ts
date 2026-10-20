import { prisma } from "../../../lib/db";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  return Response.json(user);
}

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  const { name, age, status } = await request.json();

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, age, status },
  });

  return Response.json(user);
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;

  await prisma.user.delete({
    where: { id: Number(id) },
  });

  return new Response(null, { status: 204 });
}
